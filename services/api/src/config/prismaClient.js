const { PrismaClient } = require("@prisma/client");
const environment = require("./environment");

const globalReference = globalThis;

const prismaClient =
  globalReference.__securebankPrismaClient ||
  new PrismaClient({
    log: environment.database.logSqlToConsole ? ["query", "warn", "error"] : ["warn", "error"],
  });

if (environment.nodeEnvironment !== "production") {
  globalReference.__securebankPrismaClient = prismaClient;
}

module.exports = prismaClient;
