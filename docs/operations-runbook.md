# Operations Runbook (SB-085)

## Startup

```bash
docker compose up --build      # db + api + web, from repo root
# first run only:
npm run db:migrate --workspace=services/api
npm run db:seed --workspace=services/api
```

Health check: `curl http://localhost:4000/health` should return
`{"success":true,...}`. Frontend: `http://localhost:3000` should redirect
to `/bank/login`.

## Health checks

| Component | Check |
|---|---|
| API | `GET /health` (no auth) |
| Database | `docker compose ps` — `db` should show `healthy` |
| Web | `GET /bank/login` returns 200 |
| Challenge engine | `node infrastructure/load-tests/challenge-qa.js` — all 15 challenges should pass |
| Isolation | `node infrastructure/load-tests/isolation-test.js` — all checks should pass |

## Monitoring

Current observability (Week 1 baseline, see `docs/architecture.md` §6):
Express request logs (`morgan`), and the `AuditEvent` table for every
security-relevant action (login, transfer, challenge solve/remediate,
admin/facilitator privileged actions). Query it directly or via the Admin
console's Audit log tab. There is no external metrics/alerting pipeline
wired up yet — that is Kubernetes/cloud-provider-specific work that depends
on which infrastructure Week 9 execution actually stands up (see
`infrastructure/kubernetes/README.md`).

## Capacity

See `docs/load-testing.md`. Do not advertise a concurrency number to
participants or facilitators without a fresh test run against the real
conference infrastructure backing that number.

## Incident response

1. **A participant reports another participant's data is visible to
   them.** This is a Sev-1: escalate immediately, do not let them continue
   demonstrating it further than necessary to confirm, and treat it as an
   unintended vulnerability per the project `README.md`'s disclosure
   process — not a challenge to score.
2. **A lab's environments are failing to provision.** Check
   `GET /api/v1/admin/emergency` for `provisioningStopped` or a
   lab-specific `disabled` flag left on from a previous test — an
   administrator may need to resume/enable it. Check the API logs for
   Prisma/Postgres connection errors next.
3. **The database is unreachable.** `docker compose ps` — if `db` isn't
   healthy, `docker compose logs db`. Do not delete the `securebank_postgres_data`
   volume without confirming you don't need what's in it.
4. **Something needs to stop right now, floor-wide.** Admin console →
   Emergency tab → Emergency sandbox shutdown. This requires a written
   reason and is audited (SB-072 kill switch).

## Reset

- **One participant's one challenge**: facilitator/admin call
  `POST /api/v1/challenges/:code/reset/:userId` (SB-013 feature flag reset;
  no UI button yet — this is an API-level facilitator action today).
- **One participant's environment**: Facilitator console → Participant
  inspector → Reset.
- **All environments in a lab**: Admin console → Emergency tab → "Terminate
  all environments for a lab."
- **Full local dev database reset**: `docker compose down -v` (destroys the
  `securebank_postgres_data` volume — confirm before running against
  anything that isn't your own dev machine) then re-run migrate + seed.

## Shutdown

```bash
docker compose down          # stop and remove containers, keep volumes
docker compose down -v       # also destroy the database volume
```

## Escalation contacts

To be filled in per conference edition — this template intentionally does
not hardcode names/numbers that would go stale between editions.
