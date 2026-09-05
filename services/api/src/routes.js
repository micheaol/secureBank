const express = require("express");
const authRouter = require("./modules/auth/router");
const usersRouter = require("./modules/users/router");
const accountsRouter = require("./modules/accounts/router");
const beneficiariesRouter = require("./modules/beneficiaries/router");
const transfersRouter = require("./modules/transfers/router");
const transactionsRouter = require("./modules/transactions/router");
const supportRouter = require("./modules/support/router");
const labsRouter = require("./modules/labs/router");
const challengesRouter = require("./modules/challenges/router");
const environmentsRouter = require("./modules/environments/router");
const scoringRouter = require("./modules/scoring/router");
const teamsRouter = require("./modules/teams/router");
const helpRequestsRouter = require("./modules/helpRequests/router");
const achievementsRouter = require("./modules/achievements/router");
const facilitatorRouter = require("./modules/facilitator/router");
const adminRouter = require("./modules/admin/router");

const apiRouter = express.Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/accounts", accountsRouter);
apiRouter.use("/beneficiaries", beneficiariesRouter);
apiRouter.use("/transfers", transfersRouter);
apiRouter.use("/transactions", transactionsRouter);
apiRouter.use("/support", supportRouter);
apiRouter.use("/labs", labsRouter);
apiRouter.use("/challenges", challengesRouter);
apiRouter.use("/environments", environmentsRouter);
apiRouter.use("/scoring", scoringRouter);
apiRouter.use("/teams", teamsRouter);
apiRouter.use("/help-requests", helpRequestsRouter);
apiRouter.use("/achievements", achievementsRouter);
apiRouter.use("/facilitator", facilitatorRouter);
apiRouter.use("/admin", adminRouter);

module.exports = apiRouter;
