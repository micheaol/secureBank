const prismaClient = require("../../config/prismaClient");
const labsModel = require("../labs/model");
const scoringService = require("../scoring/service");
const environmentsModel = require("../environments/model");
const { ApplicationError } = require("../../utils/apiResponse");

async function getFloorOverview() {
  const [registeredParticipants, runningEnvironments, openHelpRequests] = await Promise.all([
    prismaClient.user.count({ where: { role: { name: "customer" } } }),
    prismaClient.environment.count({ where: { status: "RUNNING" } }),
    prismaClient.helpRequest.count({ where: { status: "OPEN" } }),
  ]);

  const activeParticipants = await prismaClient.scoreEvent.findMany({
    distinct: ["userId"],
    select: { userId: true },
  });

  return {
    registeredParticipants,
    activeParticipants: activeParticipants.length,
    runningEnvironments,
    openHelpRequests,
  };
}

async function getLabHealth() {
  const labs = await labsModel.findAllLabs();

  return Promise.all(
    labs.map(async (lab) => {
      const totalSolves = await prismaClient.challengeProgress.count({
        where: { status: "SOLVED", challenge: { labId: lab.id } },
      });
      const runningEnvironments = await prismaClient.environment.count({ where: { labId: lab.id, status: "RUNNING" } });

      return {
        code: lab.code,
        name: lab.name,
        totalChallenges: lab._count.challenges,
        totalSolves,
        runningEnvironments,
      };
    })
  );
}

async function listParticipants() {
  const customers = await prismaClient.user.findMany({
    where: { role: { name: "customer" } },
    select: { id: true, fullName: true, lastLoginAt: true, teamMembership: { include: { team: true } } },
    orderBy: { fullName: "asc" },
  });

  return Promise.all(
    customers.map(async (customer) => ({
      id: customer.id,
      fullName: customer.fullName,
      team: customer.teamMembership?.team?.name ?? null,
      totalScore: await scoringService.getTotalScoreForUser(customer.id),
      lastLoginAt: customer.lastLoginAt,
    }))
  );
}

async function getParticipantDetail(userId) {
  const user = await prismaClient.user.findUnique({
    where: { id: userId },
    select: { id: true, fullName: true, teamMembership: { include: { team: true } } },
  });
  if (!user) {
    throw new ApplicationError("Participant not found.", 404);
  }

  const [progressRows, environments, totalScore] = await Promise.all([
    prismaClient.challengeProgress.findMany({
      where: { userId },
      include: { challenge: { select: { code: true, title: true, labId: true } } },
    }),
    environmentsModel.findEnvironmentsForUser(userId),
    scoringService.getTotalScoreForUser(userId),
  ]);

  return {
    id: user.id,
    fullName: user.fullName,
    team: user.teamMembership?.team?.name ?? null,
    totalScore,
    progress: progressRows.map((row) => ({
      challengeCode: row.challenge.code,
      challengeTitle: row.challenge.title,
      status: row.status,
      hintsRevealed: row.hintsRevealed,
      attempts: row.attempts,
    })),
    environments: environments.map((environment) => ({
      id: environment.id,
      externalId: environment.externalId,
      status: environment.status,
      expiresAt: environment.expiresAt,
    })),
  };
}

module.exports = {
  getFloorOverview,
  getLabHealth,
  listParticipants,
  getParticipantDetail,
};
