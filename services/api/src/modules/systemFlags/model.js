const prismaClient = require("../../config/prismaClient");

async function getFlag(key) {
  return prismaClient.systemFlag.findUnique({ where: { key } });
}

async function setFlag(key, value, reason, updatedBy) {
  return prismaClient.systemFlag.upsert({
    where: { key },
    update: { value, reason, updatedBy },
    create: { key, value, reason, updatedBy },
  });
}

async function listFlags() {
  return prismaClient.systemFlag.findMany();
}

module.exports = { getFlag, setFlag, listFlags };
