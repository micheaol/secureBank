require("dotenv").config();

const requiredEnvironmentVariables = ["JWT_ACCESS_SECRET", "JWT_REFRESH_SECRET"];

function assertRequiredEnvironmentVariablesArePresent() {
  const missingVariableNames = requiredEnvironmentVariables.filter(
    (variableName) => !process.env[variableName]
  );

  if (missingVariableNames.length > 0 && process.env.NODE_ENV === "production") {
    throw new Error(
      `Missing required environment variables: ${missingVariableNames.join(", ")}`
    );
  }
}

assertRequiredEnvironmentVariablesArePresent();

const environment = {
  nodeEnvironment: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 4000,

  webApplicationOrigin: process.env.WEB_APP_ORIGIN || "http://localhost:3000",

  database: {
    connectionUrl:
      process.env.DATABASE_URL ||
      "postgresql://securebank:securebank@localhost:5432/securebank_dev",
    logSqlToConsole: process.env.DB_LOG_SQL === "true",
  },

  jsonWebToken: {
    accessTokenSecret: process.env.JWT_ACCESS_SECRET || "dev-only-access-secret-change-me",
    refreshTokenSecret: process.env.JWT_REFRESH_SECRET || "dev-only-refresh-secret-change-me",
    accessTokenExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
    refreshTokenExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
    refreshTokenExpiresInDays: Number(process.env.JWT_REFRESH_EXPIRES_IN_DAYS) || 7,
  },

  passwordReset: {
    tokenExpiresInMinutes: Number(process.env.PASSWORD_RESET_EXPIRES_IN_MINUTES) || 30,
  },

  bcryptSaltRounds: Number(process.env.BCRYPT_SALT_ROUNDS) || 12,
};

module.exports = environment;
