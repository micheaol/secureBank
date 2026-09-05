const createExpressApplication = require("./app");
const environment = require("./config/environment");
const prismaClient = require("./config/prismaClient");

async function startServer() {
  await prismaClient.$connect();
  console.info("Connected to the SecureBank database.");

  const app = createExpressApplication();

  const server = app.listen(environment.port, () => {
    console.info(
      `SecureBank API listening on port ${environment.port} (${environment.nodeEnvironment})`
    );
  });

  async function shutDownGracefully(signal) {
    console.info(`Received ${signal}. Shutting down SecureBank API gracefully.`);
    server.close(async () => {
      await prismaClient.$disconnect();
      process.exit(0);
    });
  }

  process.on("SIGINT", () => shutDownGracefully("SIGINT"));
  process.on("SIGTERM", () => shutDownGracefully("SIGTERM"));
}

startServer().catch((startupError) => {
  console.error("Failed to start SecureBank API:", startupError);
  process.exit(1);
});
