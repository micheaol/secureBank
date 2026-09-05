const achievementsModel = require("./model");

async function unlockAchievementIfNotAlready(userId, achievementCode) {
  const achievement = await achievementsModel.findAchievementByCode(achievementCode);
  if (!achievement) {
    return null;
  }
  return achievementsModel.createUserAchievementIfMissing(userId, achievement.id);
}

async function listUnlockedAchievementsForUser(userId) {
  return achievementsModel.findUnlockedAchievementsForUser(userId);
}

async function listAllAchievementsWithUnlockStatus(userId) {
  const [allAchievements, unlocked] = await Promise.all([
    achievementsModel.findAllAchievements(),
    achievementsModel.findUnlockedAchievementsForUser(userId),
  ]);
  const unlockedCodes = new Set(unlocked.map((entry) => entry.achievement.code));

  return allAchievements.map((achievement) => ({
    code: achievement.code,
    name: achievement.name,
    description: achievement.description,
    icon: achievement.icon,
    unlocked: unlockedCodes.has(achievement.code),
  }));
}

module.exports = {
  unlockAchievementIfNotAlready,
  listUnlockedAchievementsForUser,
  listAllAchievementsWithUnlockStatus,
};
