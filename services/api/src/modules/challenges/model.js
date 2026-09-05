const prismaClient = require("../../config/prismaClient");

async function findChallengesByLabId(labId) {
  return prismaClient.challenge.findMany({
    where: { labId },
    orderBy: { order: "asc" },
    include: { hints: { orderBy: { order: "asc" }, select: { id: true, order: true, cost: true } } },
  });
}

async function findChallengeByCode(code) {
  return prismaClient.challenge.findUnique({
    where: { code },
    include: { hints: { orderBy: { order: "asc" } }, lab: true },
  });
}

async function findAllProgressForUserInLab(userId, labId) {
  return prismaClient.challengeProgress.findMany({
    where: { userId, challenge: { labId } },
  });
}

async function findProgressForUserAndChallenge(userId, challengeId) {
  return prismaClient.challengeProgress.findUnique({
    where: { userId_challengeId: { userId, challengeId } },
  });
}

async function upsertProgress(userId, challengeId, data) {
  return prismaClient.challengeProgress.upsert({
    where: { userId_challengeId: { userId, challengeId } },
    create: { userId, challengeId, ...data },
    update: data,
  });
}

async function countChallengesInLab(labId) {
  return prismaClient.challenge.count({ where: { labId } });
}

async function countSolvedChallengesForUserInLab(userId, labId) {
  return prismaClient.challengeProgress.count({
    where: { userId, status: "SOLVED", challenge: { labId } },
  });
}

async function countRemediatedChallengesForUser(userId) {
  return prismaClient.challengeProgress.count({ where: { userId, flagState: "PATCHED" } });
}

async function countDistinctLabsSolvedByUser(userId) {
  const solvedProgress = await prismaClient.challengeProgress.findMany({
    where: { userId, status: "SOLVED" },
    select: { challenge: { select: { labId: true } } },
  });
  return new Set(solvedProgress.map((progress) => progress.challenge.labId)).size;
}

async function deleteProgress(userId, challengeId) {
  return prismaClient.challengeProgress.deleteMany({ where: { userId, challengeId } });
}

async function findNextChallengeInLab(labId, currentOrder) {
  return prismaClient.challenge.findFirst({
    where: { labId, order: { gt: currentOrder } },
    orderBy: { order: "asc" },
  });
}

module.exports = {
  findChallengesByLabId,
  findChallengeByCode,
  findAllProgressForUserInLab,
  findProgressForUserAndChallenge,
  upsertProgress,
  countChallengesInLab,
  countSolvedChallengesForUserInLab,
  findNextChallengeInLab,
  countRemediatedChallengesForUser,
  countDistinctLabsSolvedByUser,
  deleteProgress,
};
