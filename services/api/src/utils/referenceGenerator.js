const crypto = require("crypto");

function generateRandomDigitString(length) {
  const digits = "0123456789";
  return Array.from({ length }, () => digits[crypto.randomInt(0, digits.length)]).join("");
}

function generateSyntheticAccountNumber() {
  return generateRandomDigitString(10);
}

function generateTransactionReference() {
  return `SB-TRX-${generateRandomDigitString(6)}`;
}

module.exports = {
  generateSyntheticAccountNumber,
  generateTransactionReference,
};
