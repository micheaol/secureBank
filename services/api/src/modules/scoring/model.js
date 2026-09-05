const prismaClient = require("../../config/prismaClient");

async function createScoreEvent({ userId, points, reason, challengeId = null }, client = prismaClient) {
  return client.scoreEvent.create({ data: { userId, points, reason, challengeId } });
}

async function sumPointsForUser(userId) {
  const result = await prismaClient.scoreEvent.aggregate({
    where: { userId },
    _sum: { points: true },
  });
  return result._sum.points ?? 0;
}

async function findLeaderboard(limit = 50) {
  return prismaClient.scoreEvent.groupBy({
    by: ["userId"],
    _sum: { points: true },
    orderBy: { _sum: { points: "desc" } },
    take: limit,
  });
}

async function findAllUserTotals() {
  return prismaClient.scoreEvent.groupBy({
    by: ["userId"],
    _sum: { points: true },
  });
}

async function findAllCustomerUsersWithFullName() {
  return prismaClient.user.findMany({
    where: { role: { name: "customer" } },
    select: { id: true, fullName: true },
  });
}

module.exports = {
  createScoreEvent,
  sumPointsForUser,
  findLeaderboard,
  findAllUserTotals,
  findAllCustomerUsersWithFullName,
};
