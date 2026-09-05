# SecureBank — Core Threat Model (SB-006)

**Scope:** the Week 1 platform (Next.js BFF + Express API + PostgreSQL) and
its authentication foundation. Per-lab threat models (Web, API, AI,
DevSecOps, Supply Chain) are added as each lab is built; this document
covers the shared foundation every lab sits on.

## 1. Assets

| Asset | Why it matters |
|---|---|
| Participant credentials (password hashes, tokens) | Compromise = account takeover across the whole platform |
| Synthetic account balances / transactions | The core "believability" of the bank; integrity matters even though the money is fake |
| Session tokens (access + refresh) | Bearer of authorization; theft = impersonation |
| Audit log (`AuditEvent`) | Evidence trail for both operations and several lab challenges (Admin audit log screen) |
| `API_BASE_URL` / JWT secrets / DB credentials | Server-only secrets; leakage collapses the trust boundary between BFF and backend |

## 2. Actors

- **Customer** (self-registered, role `customer`) — the only role reachable
  through the public registration flow.
- **Support agent / operations user / developer / devops engineer / security
  engineer / administrator / lab facilitator / sandbox administrator** —
  provisioned out-of-band (seed data or, in later sprints, the Admin
  console). Not self-assignable.
- **Anonymous attacker** — anyone hitting `/api/*` or the Express API
  without a session, including conference participants deliberately probing
  the platform (expected and desired, but must stay inside lab boundaries).
- **Malicious/compromised participant** — an authenticated `customer` trying
  to exceed their own authorization boundary (this is the entire premise of
  the Web and API labs from Week 3 onward).

## 3. Trust boundaries

See `docs/architecture.md` §6 for the diagram. In threat-modeling terms,
each boundary is a place we assume the crossing data is hostile until
proven otherwise:

- **B1 — Internet → apps/web**: all request bodies, cookies, and headers are
  untrusted.
- **B2 — apps/web → services/api**: trusted *transport* (private network),
  but the identity claim (Bearer token) inside it is still verified by
  Express on every request — apps/web is a relay, not an authority.
- **B3 — services/api → PostgreSQL**: trusted, parameterized only.

## 4. Threats and controls (STRIDE-flavoured)

| # | Threat | Where | Control implemented in Week 1 |
|---|---|---|---|
| T1 | Credential stuffing / brute force on login | B1 | `express-rate-limit` on `/auth/login`, `/auth/register`, `/auth/forgot-password`, `/auth/reset-password` (20 req / 15 min) |
| T2 | Password database compromise → cleartext exposure | B3 | Passwords hashed with bcrypt (cost factor 12), never stored or logged in plaintext |
| T3 | Session/token theft via XSS | B1 | Access/refresh tokens are `httpOnly` cookies, never exposed to client JS or stored in `localStorage` |
| T4 | CSRF against cookie-authenticated endpoints | B1 | Cookies are `SameSite=Lax`; state-changing Route Handlers only accept same-site navigation/fetch (no cross-site form posts trigger them) |
| T5 | User enumeration via login/forgot-password responses | B1 | Login returns one generic "Invalid email or password" message; forgot-password always returns the same message regardless of whether the account exists |
| T6 | Reset-token replay or brute force | B1/B3 | Reset tokens are single-use (`usedAt`), time-boxed (30 min default), stored as a SHA-256 hash (not the raw token), and never echoed back in any API response |
| T7 | Refresh-token replay after logout/password reset | B3 | Refresh tokens are opaque, hashed at rest, and revocable; password reset revokes *all* of a user's refresh tokens |
| T8 | Broken Object-Level Authorization (a customer reading another customer's account) | B2 | `accounts.service.getAccountForCurrentUser` filters by both `accountId` **and** the authenticated `userId` — ownership is enforced at the query, not just the route |
| T9 | SQL injection | B3 | All queries go through Prisma's query builder; no raw SQL string concatenation anywhere in Week 1 code |
| T10 | Secrets committed to the repository | B1 (supply chain) | `.env` is git-ignored; only `.env.example` (no real values) is committed; JWT secrets/DB credentials are required env vars in production (`environment.js` throws if missing) |
| T11 | Backend URL / internal API surface exposed to the browser | B2 | `API_BASE_URL` is a server-only env var (no `NEXT_PUBLIC_` prefix), imported only via files marked `"server-only"` |
| T12 | Tampering with request payloads (mass assignment, type confusion) | B1/B2 | Every write endpoint validates `req.body` against a Zod schema before it reaches business logic; unlisted fields are dropped, not passed through |
| T13 | Repudiation of privileged/authentication actions | B3 | `AuditEvent` records every auth attempt (success and denial) with actor, result, IP, user agent and correlation id |

## 5. Intentional vulnerabilities (none yet — by design)

Per PRD §4 ("Intentionally Vulnerable" must be *deliberate, documented,
controlled*) and SB-005 ("intentional weaknesses must be introduced
explicitly as challenges rather than accidental engineering defects"), the
Week 1 authentication and accounts foundation contains **zero** intentional
vulnerabilities. It is the secure baseline that:

- SB-013 (Vulnerability Feature Flags, Week 2) will toggle between
  `vulnerable` / `patched` / `reset` states per challenge, and
- the Web (Week 3), API (Week 4), AI (Week 5), DevSecOps (Week 6) and Supply
  Chain (Week 7) labs will each layer specific, cataloged weaknesses onto,
  using the challenge schema from SB-012.

Any vulnerability found in this Week 1 code that is **not** listed above is
a genuine defect, not a feature, and should be fixed rather than treated as
a lab challenge (README §"Reporting Security Vulnerabilities").

## 6. Open items for later sprints

- Multi-factor authentication (PRD §9 lists this as "optional" — not built
  in Week 1).
- Device/session management UI (list active sessions, revoke a specific
  device) — currently only "revoke all" (on password reset) exists.
- Rate limiting is in-memory (`express-rate-limit` default store), which is
  per-process only; a shared store (Redis) is needed once the API scales
  beyond one instance (tracked for Week 9 infrastructure hardening).
