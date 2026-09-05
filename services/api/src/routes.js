const express = require("express");
const authRouter = require("./modules/auth/router");
const usersRouter = require("./modules/users/router");
const accountsRouter = require("./modules/accounts/router");

const apiRouter = express.Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/accounts", accountsRouter);

module.exports = apiRouter;
