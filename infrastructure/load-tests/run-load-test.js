// Local load-test harness (SB-073..076). Run with:
//   node infrastructure/load-tests/run-load-test.js [connections] [durationSeconds]
//
// IMPORTANT: this measures the local dev stack on a single developer
// machine (one Express process, one shared Postgres container, no
// clustering) - NOT the multi-node conference infrastructure described in
// infrastructure/kubernetes/. Treat the numbers here as a correctness/
// regression baseline for this codebase, not as evidence the conference
// capacity targets (50/100/250/500 concurrent, 10-Week-plan.md SB-073..076)
// are met. Do not claim a concurrency target is "passed" from this script
// alone - the 10-Week-plan is explicit that 500-user support must not be
// claimed until it passes against the real, agreed infrastructure.

const autocannon = require("autocannon");

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:4000/api/v1";
const connections = Number(process.argv[2]) || 50;
const duration = Number(process.argv[3]) || 15;

async function fetchAccessToken() {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "ada.okafor@securebank.training", password: "SecureBank!2026" }),
  });
  const body = await response.json();
  if (!body.success) {
    throw new Error(`Could not authenticate for load test: ${body.message}`);
  }
  return body.data.accessToken;
}

async function runScenario(title, options) {
  console.info(`\n=== ${title} (${connections} connections, ${duration}s) ===`);
  const result = await autocannon(options);
  console.info(`  requests/sec: ${result.requests.average}`);
  console.info(`  latency p50/p99 (ms): ${result.latency.p50} / ${result.latency.p99}`);
  console.info(`  errors: ${result.errors}  timeouts: ${result.timeouts}  non-2xx: ${result.non2xx}`);
  return result;
}

async function main() {
  const accessToken = await fetchAccessToken();

  await runScenario("Public health check", {
    url: `${API_BASE_URL.replace("/api/v1", "")}/health`,
    connections,
    duration,
  });

  await runScenario("Authenticated: list labs", {
    url: `${API_BASE_URL}/labs`,
    connections,
    duration,
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  await runScenario("Authenticated: list accounts", {
    url: `${API_BASE_URL}/accounts`,
    connections,
    duration,
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

main().catch((error) => {
  console.error("Load test failed:", error);
  process.exitCode = 1;
});
