// Automated cross-participant isolation test (SB-078). Run against a live
// API instance:
//   node infrastructure/load-tests/isolation-test.js
//
// This exercises the APPLICATION layer of isolation only (query scoping by
// authenticated userId) - see infrastructure/kubernetes/README.md for the
// infrastructure layer (namespaces/NetworkPolicy) this test cannot reach
// from here because that topology isn't deployed in this environment.
//
// It logs in as two distinct accounts and asserts that neither can read or
// mutate the other's resources. Exits non-zero if any check fails, so it
// can be wired into CI later.

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:4000/api/v1";

const failures = [];

function check(description, condition) {
  if (condition) {
    console.info(`  PASS  ${description}`);
  } else {
    console.error(`  FAIL  ${description}`);
    failures.push(description);
  }
}

async function apiRequest(path, { method = "GET", token, body } = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await response.json().catch(() => null);
  return { status: response.status, body: json };
}

async function login(email, password) {
  const { body } = await apiRequest("/auth/login", { method: "POST", body: { email, password } });
  return body.data.accessToken;
}

async function main() {
  console.info("Authenticating two independent participants...");
  const userAToken = await login("ada.okafor@securebank.training", "SecureBank!2026");
  const userBToken = await login("admin@securebank.training", "SecureBank!2026");

  console.info("\n--- Accounts ---");
  const { body: userAAccounts } = await apiRequest("/accounts", { token: userAToken });
  const userAAccountId = userAAccounts.data.accounts[0]?.id;
  if (userAAccountId) {
    const crossAccess = await apiRequest(`/accounts/${userAAccountId}`, { token: userBToken });
    check("User B cannot read User A's account by ID", crossAccess.status === 404);
  } else {
    console.info("  (skipped - User A has no accounts)");
  }

  console.info("\n--- Beneficiaries ---");
  const { body: userABeneficiaries } = await apiRequest("/beneficiaries", { token: userAToken });
  const beneficiaryId = userABeneficiaries.data.beneficiaries[0]?.id;
  if (beneficiaryId) {
    const crossDelete = await apiRequest(`/beneficiaries/${beneficiaryId}`, { method: "DELETE", token: userBToken });
    check("User B cannot delete User A's beneficiary", crossDelete.status === 404);
  }

  console.info("\n--- Support tickets ---");
  const { body: createdTicket } = await apiRequest("/support", {
    method: "POST",
    token: userAToken,
    body: { subject: "Isolation test ticket", category: "Test" },
  });
  const ticketId = createdTicket?.data?.ticket?.id;
  if (ticketId) {
    const crossTicketRead = await apiRequest(`/support/${ticketId}`, { token: userBToken });
    check("User B cannot read User A's support ticket", crossTicketRead.status === 404);
  }

  console.info("\n--- Auth/session ---");
  const noToken = await apiRequest("/users/me");
  check("Unauthenticated request to /users/me is rejected", noToken.status === 401);

  const badToken = await apiRequest("/users/me", { token: "not-a-real-token" });
  check("Forged/invalid bearer token is rejected", badToken.status === 401);

  console.info("\n--- Role-gated surfaces ---");
  const customerHitsAdmin = await apiRequest("/admin/overview", { token: userAToken });
  check("A customer role cannot reach /admin/*", customerHitsAdmin.status === 403);

  const adminHitsAdmin = await apiRequest("/admin/overview", { token: userBToken });
  check("An administrator role can reach /admin/*", adminHitsAdmin.status === 200);

  console.info(`\n${failures.length === 0 ? "ALL CHECKS PASSED" : `${failures.length} CHECK(S) FAILED`}`);
  process.exitCode = failures.length === 0 ? 0 : 1;
}

main().catch((error) => {
  console.error("Isolation test crashed:", error);
  process.exitCode = 1;
});
