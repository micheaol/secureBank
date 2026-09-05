const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const environment = require("./config/environment");
const apiRouter = require("./routes");
const { handleRouteNotFound, handleApplicationErrors } = require("./middlewares/handleApplicationErrors");

function createExpressApplication() {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: environment.webApplicationOrigin,
      credentials: true,
    })
  );
  app.use(express.json({ limit: "1mb" }));
  app.use(morgan(environment.nodeEnvironment === "production" ? "combined" : "dev"));

  app.get("/health", (request, response) => {
    response.status(200).json({ success: true, message: "SecureBank API is healthy." });
  });

  app.use("/api/v1", apiRouter);

  app.use(handleRouteNotFound);
  app.use(handleApplicationErrors);

  return app;
}

module.exports = createExpressApplication;
