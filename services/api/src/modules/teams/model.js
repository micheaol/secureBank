const prismaClient = require("../../config/prismaClient");

async function findTeamByName(name) {
  return prismaClient.team.findUnique({ where: { name } });
}

async function createTeam(name) {
  return prismaClient.team.create({ data: { name } });
}

async function findMembershipForUser(userId) {
  return prismaClient.teamMembership.findUnique({
    where: { userId },
    include: { team: true },
  });
}

async function createMembership(userId, teamId) {
  return prismaClient.teamMembership.upsert({
    where: { userId },
    update: { teamId },
    create: { userId, teamId },
  });
}

async function deleteMembership(userId) {
  return prismaClient.teamMembership.deleteMany({ where: { userId } });
}

async function findTeamMembers(teamId) {
  return prismaClient.teamMembership.findMany({
    where: { teamId },
    include: { user: { select: { id: true, fullName: true } } },
  });
}

async function findAllTeamsWithMembers() {
  return prismaClient.team.findMany({
    include: { memberships: { select: { userId: true } } },
  });
}

module.exports = {
  findTeamByName,
  createTeam,
  findMembershipForUser,
  createMembership,
  deleteMembership,
  findTeamMembers,
  findAllTeamsWithMembers,
};
