const scoringModel = require("./model");

async function awardPoints(userId, points, reason, challengeId, client) {
  return scoringModel.createScoreEvent({ userId, points, reason, challengeId }, client);
}

async function getTotalScoreForUser(userId) {
  return scoringModel.sumPointsForUser(userId);
}

async function getScoreAndRankForUser(userId) {
  const allTotals = await scoringModel.findAllUserTotals();
  const ranked = allTotals
    .map((row) => ({ userId: row.userId, totalScore: row._sum.points ?? 0 }))
    .sort((a, b) => b.totalScore - a.totalScore);

  const rankIndex = ranked.findIndex((row) => row.userId === userId);
  const totalScore = rankIndex >= 0 ? ranked[rankIndex].totalScore : 0;

  return {
    totalScore,
    rank: rankIndex >= 0 ? rankIndex + 1 : null,
    totalParticipants: ranked.length,
  };
}

async function getAllUserTotals() {
  const totals = await scoringModel.findAllUserTotals();
  return totals.map((row) => ({ userId: row.userId, totalScore: row._sum.points ?? 0 }));
}

async function getIndividualLeaderboard(limit = 50) {
  const [users, totals] = await Promise.all([scoringModel.findAllCustomerUsersWithFullName(), getAllUserTotals()]);
  const totalsByUserId = new Map(totals.map((row) => [row.userId, row.totalScore]));

  return users
    .map((user) => ({ id: user.id, fullName: user.fullName, totalScore: totalsByUserId.get(user.id) ?? 0 }))
    .sort((a, b) => b.totalScore - a.totalScore)
    .slice(0, limit);
}

module.exports = {
  awardPoints,
  getTotalScoreForUser,
  getScoreAndRankForUser,
  getAllUserTotals,
  getIndividualLeaderboard,
};
