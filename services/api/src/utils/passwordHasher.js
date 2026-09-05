const bcrypt = require("bcryptjs");
const environment = require("../config/environment");

async function hashPlainTextPassword(plainTextPassword) {
  return bcrypt.hash(plainTextPassword, environment.bcryptSaltRounds);
}

async function verifyPasswordAgainstHash(plainTextPassword, passwordHash) {
  return bcrypt.compare(plainTextPassword, passwordHash);
}

module.exports = {
  hashPlainTextPassword,
  verifyPasswordAgainstHash,
};
