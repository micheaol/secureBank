const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const environment = require("../config/environment");

function signAccessToken(tokenPayload) {
  return jwt.sign(tokenPayload, environment.jsonWebToken.accessTokenSecret, {
    expiresIn: environment.jsonWebToken.accessTokenExpiresIn,
  });
}

function verifyAccessToken(accessToken) {
  return jwt.verify(accessToken, environment.jsonWebToken.accessTokenSecret);
}

function generateOpaqueSessionToken() {
  const rawToken = crypto.randomBytes(48).toString("hex");
  const tokenHash = hashOpaqueToken(rawToken);
  return { rawToken, tokenHash };
}

function hashOpaqueToken(rawToken) {
  return crypto.createHash("sha256").update(rawToken).digest("hex");
}

module.exports = {
  signAccessToken,
  verifyAccessToken,
  generateOpaqueSessionToken,
  hashOpaqueToken,
};
