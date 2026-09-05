const prismaClient = require("../../config/prismaClient");

async function findAllLabs() {
  return prismaClient.lab.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { challenges: true } } },
  });
}

async function findLabByCode(code) {
  return prismaClient.lab.findUnique({
    where: { code },
    include: { _count: { select: { challenges: true } } },
  });
}

module.exports = {
  findAllLabs,
  findLabByCode,
};
