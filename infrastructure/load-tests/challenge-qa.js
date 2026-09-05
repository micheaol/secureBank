// Automated challenge QA (SB-079). Registers a brand-new participant and
// plays through every seeded challenge end-to-end: start -> wrong answer
// (must be rejected) -> correct answer (must solve + award points) ->
// remediate (must patch + award bonus). Exits non-zero on any failure.
//
//   node infrastructure/load-tests/challenge-qa.js

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:4000/api/v1";

const CHALLENGE_ANSWERS = {
  "WEB-01": "0071122334",
  "WEB-02": "rt_9002",
  "WEB-03": "cancelTransfer",
  "API-01": "acc_10433",
  "API-02": "roleName",
  "API-03": "pageSize",
  "AI-01": "transfer_funds",
  "AI-02": "get_transactions",
  "AI-03": "partner-integrations-bot",
  "DEVSECOPS-01": "sk_live_4f9a2b6c1e7d4a3b9f0c",
  "DEVSECOPS-02": "DEPLOY_TOKEN",
  "DEVSECOPS-03": "privileged",
  "SC-001": "naira-format",
  "SC-002": "sb-crypto-utils",
  "SC-003": "provenance",
};

const failures = [];

function check(description, condition) {
  if (condition) {
    console.info(`    PASS  ${description}`);
  } else {
    console.error(`    FAIL  ${description}`);
    failures.push(description);
  }
}

async function apiRequest(path, { method = "GET", token, body } = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  return { status: response.status, body: await response.json().catch(() => null) };
}

async function registerFreshQaParticipant() {
  const uniqueEmail = `qa-${Date.now()}@securebank.training`;
  const { body } = await apiRequest("/auth/register", {
    method: "POST",
    body: { fullName: "QA Participant", email: uniqueEmail, password: "QaPassword123" },
  });
  return body.data.accessToken;
}

async function playChallenge(token, code, correctAnswer) {
  console.info(`\n  ${code}`);

  const startResult = await apiRequest(`/challenges/${code}/start`, { method: "POST", token });
  check(`${code}: starts successfully`, startResult.status === 200);

  const detail = await apiRequest(`/challenges/${code}`, { token });
  check(`${code}: evidence bundle is present once started`, Array.isArray(detail.body?.data?.challenge?.evidenceBundle?.sections));

  const wrongSubmit = await apiRequest(`/challenges/${code}/submit`, {
    method: "POST",
    token,
    body: { answer: "definitely-not-the-answer" },
  });
  check(`${code}: wrong answer is rejected`, wrongSubmit.body?.data?.correct === false);

  const correctSubmit = await apiRequest(`/challenges/${code}/submit`, {
    method: "POST",
    token,
    body: { answer: correctAnswer },
  });
  check(`${code}: correct answer solves it`, correctSubmit.body?.data?.correct === true);
  check(`${code}: points were awarded`, correctSubmit.body?.data?.pointsAwarded > 0);

  const remediate = await apiRequest(`/challenges/${code}/remediate`, { method: "POST", token });
  check(`${code}: remediation succeeds`, remediate.status === 200);
}

async function main() {
  console.info("Registering a fresh QA participant...");
  const token = await registerFreshQaParticipant();

  for (const [code, answer] of Object.entries(CHALLENGE_ANSWERS)) {
    // eslint-disable-next-line no-await-in-loop
    await playChallenge(token, code, answer);
  }

  console.info(`\n${failures.length === 0 ? "ALL CHALLENGES PASSED QA" : `${failures.length} CHECK(S) FAILED`}`);
  process.exitCode = failures.length === 0 ? 0 : 1;
}

main().catch((error) => {
  console.error("Challenge QA crashed:", error);
  process.exitCode = 1;
});
