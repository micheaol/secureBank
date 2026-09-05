const teamsModel = require("./model");
const scoringService = require("../scoring/service");

async function joinOrCreateTeam(userId, teamName) {
  let team = await teamsModel.findTeamByName(teamName);
  if (!team) {
    team = await teamsModel.createTeam(teamName);
  }
  await teamsModel.createMembership(userId, team.id);
  return team;
}

async function leaveTeam(userId) {
  await teamsModel.deleteMembership(userId);
}

async function getMyTeam(userId) {
  const membership = await teamsModel.findMembershipForUser(userId);
  if (!membership) {
    return null;
  }

  const members = await teamsModel.findTeamMembers(membership.teamId);
  const memberScores = await Promise.all(
    members.map(async (member) => ({
      id: member.user.id,
      fullName: member.user.fullName,
      score: await scoringService.getTotalScoreForUser(member.user.id),
    }))
  );

  return {
    id: membership.team.id,
    name: membership.team.name,
    members: memberScores,
    totalScore: memberScores.reduce((sum, member) => sum + member.score, 0),
  };
}

async function getTeamLeaderboard() {
  const teams = await teamsModel.findAllTeamsWithMembers();
  const userTotals = await scoringService.getAllUserTotals();
  const totalsByUserId = new Map(userTotals.map((row) => [row.userId, row.totalScore]));

  const teamScores = teams.map((team) => ({
    id: team.id,
    name: team.name,
    memberCount: team.memberships.length,
    totalScore: team.memberships.reduce((sum, membership) => sum + (totalsByUserId.get(membership.userId) ?? 0), 0),
  }));

  return teamScores.sort((a, b) => b.totalScore - a.totalScore);
}

module.exports = {
  joinOrCreateTeam,
  leaveTeam,
  getMyTeam,
  getTeamLeaderboard,
};
