# SecureBank — System Architecture (SB-001)

**Status:** Week 1 baseline. Covers the core banking platform built so far; the
five security labs layer on top of this in later sprints without changing
these boundaries.

## 1. Service boundaries

```
Browser (participant)
      │  HTTPS
      ▼
apps/web            Next.js 16 (App Router), the ONLY thing the browser talks to
  - React UI (RTK Query + React Hook Form + Zod)
  - Route Handlers under /api/*  (Backend-for-Frontend / BFF)
  - proxy.js: optimistic route protection
      │  Server-to-server HTTP (API_BASE_URL, never exposed to the browser)
      ▼
services/api         Node.js / Express REST API
  - modules/<domain>/{router,controller,service,model}.js
  - Prisma ORM
      │
      ▼
PostgreSQL            Single relational database (Docker Compose: `db`)
```

Two processes, one browser-facing surface:

- **apps/web** is the only origin the browser ever calls. It owns session
  cookies, form validation, and all rendering. It has no direct database
  access.
- **services/api** is the only thing that owns business logic and the
  database. It has no knowledge of cookies or the browser — it deals purely
  in Bearer-token-authenticated JSON requests, so it can be reused by other
  clients (a future mobile app, `curl`, load-test scripts) without change.

This split is deliberate for the AppSec conference use case: the Web,
Sandbox, Facilitator and Admin surfaces (PRD §7) can all be additional
Next.js route groups calling the same backend, while backend module
boundaries (`/auth`, `/users`, `/accounts`, ...) map directly onto the API
Security Lab's domain list (PRD §11).

## 2. Request flow (why a BFF)

```
Browser --RTK Query--> /api/auth/login (Next Route Handler)
                              │
                              ├─ forwards credentials to services/api
                              │
                              ├─ receives { user, accessToken, refreshToken }
                              │
                              ├─ sets sb_access_token / sb_refresh_token
                              │  as httpOnly, sameSite=lax cookies
                              │
                              └─ returns only { user } to the browser
```

The access/refresh tokens never reach client-side JavaScript. Every
subsequent authenticated call (`/api/users/me`, `/api/accounts`, ...) is a
thin Next.js Route Handler that reads the `sb_access_token` cookie
server-side, attaches it as `Authorization: Bearer <token>`, and forwards the
request to Express. RTK Query's base query wraps this in a single-retry
reauthentication flow: a `401` triggers `POST /api/auth/refresh` once before
surfacing the error to the UI.

`proxy.js` (Next.js 16's renamed `middleware.js`) performs only an
**optimistic** check — cookie presence, not validity — to redirect signed-out
visitors away from `/bank/*` before a page even renders. The actual
authorization decision is always re-verified by Express on every request,
per [Next.js's own guidance](https://nextjs.org/docs/app/guides/authentication#optimistic-checks-with-proxy-optional)
that proxy/middleware must never be the sole line of defense.

## 3. Backend module boundaries

Each domain under `services/api/src/modules/` is self-contained:

| Module | Owns | Week 1 status |
|---|---|---|
| `auth` | Registration, login, logout, refresh, password reset, session tokens | Full (router/controller/service/model) |
| `users` | User + Role identity data, current-profile lookup | Full |
| `accounts` | Account balances, auto-provisioning on signup | Full |
| `audit` | Security telemetry (`AuditEvent`) | Full (model + service; no public router yet) |
| `beneficiaries` | Beneficiary records | Data model only — workflow is Week 2 (SB-008) |
| `transactions` | Transaction history | Data model only — workflow is Week 2 (SB-010) |
| `transfers` | Money movement | Data model only — workflow is Week 2 (SB-009) |
| `support` | Support tickets/messages | Data model only — workflow is Week 2 (SB-011) |

A module never reaches into another module's Prisma queries directly; it
calls the other module's `service.js` (e.g. `auth/service.js` calls
`accounts/service.js` to provision the two starter accounts on registration).
This keeps each domain swappable and matches the brief's requirement that
challenges be "independently versionable" (PRD §28).

## 4. Data model

Single Prisma schema (`services/api/prisma/schema.prisma`), covering every
entity called for in PRD §9's core banking features and the SB-004 data
model: `Role`, `User`, `RefreshToken`, `PasswordResetToken`, `Account`,
`Beneficiary`, `Transaction`, `Transfer`, `SupportTicket`, `SupportMessage`,
`AuditEvent`. One schema, one Postgres database — no per-module database
splitting, since the labs need to query across domains (e.g. the Admin
audit log joins `AuditEvent` to `User`).

## 5. User roles (PRD §8)

Modeled as a `Role` table (not a hardcoded enum) so Sandbox operators can add
roles later without a migration. Seeded roles: `customer`,
`support_agent`, `operations_user`, `developer`, `devops_engineer`,
`security_engineer`, `administrator`, `lab_facilitator`,
`sandbox_administrator`. Self-registration always assigns `customer`; every
other role is provisioned out-of-band (seed script or future Admin console).

## 6. Trust boundaries

1. **Browser ↔ apps/web** — untrusted input boundary. All form input is
   validated twice: client-side (Zod + React Hook Form, for UX) and
   server-side (Zod again, inside Express) — the client-side copy is never
   trusted on its own.
2. **apps/web ↔ services/api** — a trusted server-to-server link over the
   Docker Compose network (or `localhost` in dev). `API_BASE_URL` is a
   server-only environment variable; it is never sent to the browser bundle.
3. **services/api ↔ PostgreSQL** — trusted, credentialed via
   `DATABASE_URL`. All queries go through Prisma's parameterized query
   builder (no raw string concatenation), which is the Week 1 secure
   baseline that later labs will intentionally weaken in isolated,
   flagged challenges (PRD §4, "Intentionally Vulnerable" + SB-013).

## 7. Lab boundaries (forward-looking)

This Week 1 build is the **secure baseline** referenced throughout the PRD:
authentication uses bcrypt + short-lived JWTs + rotated opaque refresh
tokens; Prisma prevents SQL injection by construction; every auth event is
audited. Starting Week 3 (Web Application Security Lab) and Week 4 (API
Security Lab), specific, documented weaknesses will be introduced **behind
the feature-flag mechanism from SB-013**, never as accidental regressions to
this baseline.

## 8. Deployment topology (local / conference dev)

`docker compose up` starts three services on one Docker network:
`db` (Postgres 16), `api` (Express, port 4000), `web` (Next.js, port 3000).
Source directories are bind-mounted for hot reload; `node_modules` is kept in
named volumes so the containers' Linux-built dependencies are never shadowed
by the host's. This is the Week 1 dev topology only — SB-066 through SB-076
(Week 9) will define the multi-tenant, isolated conference infrastructure.
