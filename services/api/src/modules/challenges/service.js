const challengesModel = require("./model");
const labsModel = require("../labs/model");
const environmentsService = require("../environments/service");
const scoringService = require("../scoring/service");
const achievementsService = require("../achievements/service");
const auditService = require("../audit/service");
const { ApplicationError } = require("../../utils/apiResponse");

const LAB_COMPLETION_ACHIEVEMENT_BY_LAB_CODE = {
  WEB: "access_controller",
  API: "api_hunter",
  AI: "ai_red_teamer",
  DEVSECOPS: "pipeline_defender",
  SUPPLY_CHAIN: "supply_chain_investigator",
};

function buildChallengeSummary(challenge, progress) {
  return {
    code: challenge.code,
    title: challenge.title,
    difficulty: challenge.difficulty,
    points: challenge.points,
    order: challenge.order,
    isHidden: challenge.isHidden,
    status: progress?.status ?? "LOCKED",
    flagState: progress?.flagState ?? "VULNERABLE",
  };
}

function resolveEffectiveStatus(challenge, existingProgress) {
  if (existingProgress) {
    return existingProgress.status;
  }
  return challenge.order === 1 ? "AVAILABLE" : "LOCKED";
}

async function listChallengesForLab(userId, labCode) {
  const lab = await labsModel.findLabByCode(labCode);
  if (!lab) {
    throw new ApplicationError("Lab not found.", 404);
  }

  const challenges = await challengesModel.findChallengesByLabId(lab.id);
  const progressRows = await challengesModel.findAllProgressForUserInLab(userId, lab.id);
  const progressByChallengeId = new Map(progressRows.map((progress) => [progress.challengeId, progress]));

  const challengeSummaries = challenges.map((challenge) => {
    const existingProgress = progressByChallengeId.get(challenge.id) ?? null;
    const effectiveStatus = resolveEffectiveStatus(challenge, existingProgress);
    return buildChallengeSummary(challenge, existingProgress ? { ...existingProgress, status: effectiveStatus } : { status: effectiveStatus });
  });

  return { lab: { code: lab.code, name: lab.name, description: lab.description }, challenges: challengeSummaries };
}

async function assertChallengeIsUnlockedForUser(userId, challenge) {
  const progress = await challengesModel.findProgressForUserAndChallenge(userId, challenge.id);
  if (progress) {
    return progress;
  }
  if (challenge.order !== 1) {
    throw new ApplicationError("This challenge is locked.", 403);
  }
  return null;
}

function buildHintsForResponse(hints, hintsRevealed) {
  return hints.map((hint) => ({
    order: hint.order,
    cost: hint.cost,
    revealed: hint.order <= hintsRevealed,
    content: hint.order <= hintsRevealed ? hint.content : null,
  }));
}

async function getChallengeDetail(userId, challengeCode) {
  const challenge = await challengesModel.findChallengeByCode(challengeCode);
  if (!challenge) {
    throw new ApplicationError("Challenge not found.", 404);
  }

  const progress = await assertChallengeIsUnlockedForUser(userId, challenge);

  return {
    code: challenge.code,
    lab: challenge.lab.code,
    title: challenge.title,
    difficulty: challenge.difficulty,
    points: challenge.points,
    scenario: challenge.scenario,
    objective: challenge.objective,
    learningObjective: challenge.learningObjective,
    prerequisites: challenge.prerequisites,
    startingState: challenge.startingState,
    expectedSecurityBoundary: challenge.expectedSecurityBoundary,
    status: progress?.status ?? "AVAILABLE",
    flagState: progress?.flagState ?? "VULNERABLE",
    attempts: progress?.attempts ?? 0,
    evidence: progress?.evidence ?? [],
    submittedAnswer: progress?.submittedAnswer ?? null,
    pointsAwarded: progress?.pointsAwarded ?? 0,
    hints: buildHintsForResponse(challenge.hints, progress?.hintsRevealed ?? 0),
    evidenceBundle: progress && ["ACTIVE", "SOLVED"].includes(progress.status) ? challenge.evidenceBundle : null,
    remediationGuide: progress?.status === "SOLVED" ? challenge.remediationGuide : null,
    remediationDiff: progress?.status === "SOLVED" ? challenge.remediationDiff : null,
  };
}

async function startChallenge(userId, challengeCode) {
  const challenge = await challengesModel.findChallengeByCode(challengeCode);
  if (!challenge) {
    throw new ApplicationError("Challenge not found.", 404);
  }

  await assertChallengeIsUnlockedForUser(userId, challenge);

  const environment = await environmentsService.getOrCreateEnvironmentForLab(userId, challenge.labId, challenge.lab.code);
  const progress = await challengesModel.upsertProgress(userId, challenge.id, { status: "ACTIVE" });

  return {
    challenge: { code: challenge.code, title: challenge.title },
    progress: { status: progress.status, hintsRevealed: progress.hintsRevealed, attempts: progress.attempts },
    environment: { id: environment.id, externalId: environment.externalId, expiresAt: environment.expiresAt, status: environment.status },
  };
}

async function revealHint(userId, challengeCode, hintOrder) {
  const challenge = await challengesModel.findChallengeByCode(challengeCode);
  if (!challenge) {
    throw new ApplicationError("Challenge not found.", 404);
  }

  const hint = challenge.hints.find((candidateHint) => candidateHint.order === hintOrder);
  if (!hint) {
    throw new ApplicationError("Hint not found.", 404);
  }

  const progress = await challengesModel.findProgressForUserAndChallenge(userId, challenge.id);
  const currentHintsRevealed = progress?.hintsRevealed ?? 0;

  if (hintOrder !== currentHintsRevealed + 1) {
    throw new ApplicationError("Reveal hints in order.", 400);
  }

  await scoringService.awardPoints(userId, -hint.cost, `hint:${challenge.code}:${hintOrder}`, challenge.id);
  const updatedProgress = await challengesModel.upsertProgress(userId, challenge.id, {
    hintsRevealed: hintOrder,
    status: progress?.status ?? "ACTIVE",
  });

  return { order: hint.order, content: hint.content, cost: hint.cost, hintsRevealed: updatedProgress.hintsRevealed };
}

async function submitAnswer(userId, challengeCode, { answer, evidence }, requestContext) {
  const challenge = await challengesModel.findChallengeByCode(challengeCode);
  if (!challenge) {
    throw new ApplicationError("Challenge not found.", 404);
  }

  const progress = await challengesModel.findProgressForUserAndChallenge(userId, challenge.id);
  if (!progress || progress.status === "LOCKED") {
    throw new ApplicationError("Start this challenge before submitting a finding.", 400);
  }

  if (progress.status === "SOLVED") {
    return { correct: true, alreadySolved: true, pointsAwarded: 0 };
  }

  const isCorrect =
    Boolean(challenge.answerKey) && answer?.trim().toLowerCase() === challenge.answerKey.trim().toLowerCase();

  await challengesModel.upsertProgress(userId, challenge.id, {
    attempts: progress.attempts + 1,
    submittedAnswer: answer,
    evidence: evidence ?? progress.evidence ?? undefined,
  });

  if (!isCorrect) {
    return { correct: false };
  }

  await challengesModel.upsertProgress(userId, challenge.id, {
    status: "SOLVED",
    solvedAt: new Date(),
    pointsAwarded: challenge.points,
  });

  await scoringService.awardPoints(userId, challenge.points, `solve:${challenge.code}`, challenge.id);

  await auditService.recordAuditEvent(null, {
    action: "challenge.solved",
    result: "SUCCESS",
    actorId: userId,
    resourceType: "Challenge",
    resourceId: challenge.id,
    ...requestContext,
  });

  const nextChallenge = await challengesModel.findNextChallengeInLab(challenge.labId, challenge.order);
  if (nextChallenge) {
    const nextProgress = await challengesModel.findProgressForUserAndChallenge(userId, nextChallenge.id);
    if (!nextProgress || nextProgress.status === "LOCKED") {
      await challengesModel.upsertProgress(userId, nextChallenge.id, { status: "AVAILABLE" });
    }
  }

  await achievementsService.unlockAchievementIfNotAlready(userId, "first_blood");

  const [solvedInLab, totalInLab, distinctLabsSolved, totalLabs] = await Promise.all([
    challengesModel.countSolvedChallengesForUserInLab(userId, challenge.labId),
    challengesModel.countChallengesInLab(challenge.labId),
    challengesModel.countDistinctLabsSolvedByUser(userId),
    labsModel.findAllLabs().then((labs) => labs.length),
  ]);

  if (solvedInLab === totalInLab) {
    const labAchievementCode = LAB_COMPLETION_ACHIEVEMENT_BY_LAB_CODE[challenge.lab.code];
    if (labAchievementCode) {
      await achievementsService.unlockAchievementIfNotAlready(userId, labAchievementCode);
    }
  }

  if (distinctLabsSolved === totalLabs) {
    await achievementsService.unlockAchievementIfNotAlready(userId, "securebank_defender");
  }

  return { correct: true, pointsAwarded: challenge.points, nextChallengeCode: nextChallenge?.code ?? null };
}

async function remediateChallenge(userId, challengeCode, requestContext) {
  const challenge = await challengesModel.findChallengeByCode(challengeCode);
  if (!challenge) {
    throw new ApplicationError("Challenge not found.", 404);
  }

  const progress = await challengesModel.findProgressForUserAndChallenge(userId, challenge.id);
  if (!progress || progress.status !== "SOLVED") {
    throw new ApplicationError("Solve this challenge before remediating it.", 400);
  }

  if (progress.flagState === "PATCHED") {
    return { flagState: "PATCHED", pointsAwarded: 0, alreadyRemediated: true };
  }

  await challengesModel.upsertProgress(userId, challenge.id, { flagState: "PATCHED", remediatedAt: new Date() });

  const remediationPoints = challenge.remediationPoints ?? 0;
  if (remediationPoints > 0) {
    await scoringService.awardPoints(userId, remediationPoints, `remediate:${challenge.code}`, challenge.id);
  }

  if (challenge.lab.code === "WEB") {
    await achievementsService.unlockAchievementIfNotAlready(userId, "secure_coder");
  }

  const totalRemediated = await challengesModel.countRemediatedChallengesForUser(userId);
  if (totalRemediated >= 5) {
    await achievementsService.unlockAchievementIfNotAlready(userId, "remediation_master");
  }

  await auditService.recordAuditEvent(null, {
    action: "challenge.remediated",
    result: "SUCCESS",
    actorId: userId,
    resourceType: "Challenge",
    resourceId: challenge.id,
    ...requestContext,
  });

  return { flagState: "PATCHED", pointsAwarded: remediationPoints };
}

/**
 * SB-013 feature-flag reset: a facilitator/administrator can clear a
 * specific participant's progress on one challenge (hints, attempts,
 * flagState, evidence) without touching any other participant, so a
 * mis-solved or corrupted challenge instance can be reset independently.
 */
async function resetChallengeForParticipant(actorUserId, actorRoleName, targetUserId, challengeCode, requestContext) {
  const challenge = await challengesModel.findChallengeByCode(challengeCode);
  if (!challenge) {
    throw new ApplicationError("Challenge not found.", 404);
  }

  await challengesModel.deleteProgress(targetUserId, challenge.id);

  await auditService.recordAuditEvent(null, {
    action: "challenge.reset",
    result: "SUCCESS",
    actorId: actorUserId,
    actorRole: actorRoleName,
    resourceType: "Challenge",
    resourceId: challenge.id,
    metadata: { targetUserId },
    ...requestContext,
  });

  return { challengeCode: challenge.code, targetUserId, status: "reset" };
}

module.exports = {
  listChallengesForLab,
  getChallengeDetail,
  startChallenge,
  revealHint,
  submitAnswer,
  remediateChallenge,
  resetChallengeForParticipant,
};
