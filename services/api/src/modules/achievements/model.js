const prismaClient = require("../../config/prismaClient");

async function findAllAchievements() {
  return prismaClient.achievement.findMany({ orderBy: { code: "asc" } });
}

async function findAchievementByCode(code) {
  return prismaClient.achievement.findUnique({ where: { code } });
}

async function findUnlockedAchievementsForUser(userId) {
  return prismaClient.userAchievement.findMany({
    where: { userId },
    include: { achievement: true },
    orderBy: { unlockedAt: "asc" },
  });
}

async function createUserAchievementIfMissing(userId, achievementId) {
  const existing = await prismaClient.userAchievement.findUnique({
    where: { userId_achievementId: { userId, achievementId } },
  });
  if (existing) {
    return null;
  }
  return prismaClient.userAchievement.create({ data: { userId, achievementId } });
}

module.exports = {
  findAllAchievements,
  findAchievementByCode,
  findUnlockedAchievementsForUser,
  createUserAchievementIfMissing,
};
