# Load Testing (SB-073..076)

## What this document is — and isn't

The 10-Week plan calls for load tests at 50, 100, 250 and 500 concurrent
participants against **conference infrastructure**, with an explicit rule:
*"Do not claim 500-user support unless the test passes against agreed
thresholds."*

This document records real measurements taken against the **local
single-machine dev stack** (one Express process, one Postgres container, no
clustering, no Kubernetes) — the topology in `docker-compose.yml`, not the
multi-node conference topology in `infrastructure/kubernetes/`. That
topology has not been built or tested (see that directory's README for
why). So:

- The numbers below are **real** — captured by actually running
  `infrastructure/load-tests/run-load-test.js`, not estimated.
- They are **not** evidence that any conference concurrency target is met.
  They're a correctness/regression baseline for this codebase: do requests
  succeed under concurrent load, and where does latency start to degrade on
  a single instance.
- Reaching an actual 50/100/250/500-participant verdict requires running
  the same methodology against the real conference infrastructure once
  Week 9 execution stands it up — that is operational work this repository
  cannot perform on its own.

## Method

```bash
node infrastructure/load-tests/run-load-test.js <connections> <durationSeconds>
```

Three scenarios per run: an unauthenticated health check, an authenticated
read (`GET /labs`), and an authenticated read hitting Prisma (`GET
/accounts`). Tool: `autocannon`.

## Results captured on this dev machine

| Scenario | Connections | Req/s (avg) | Latency p50 | Latency p99 | Errors |
|---|---:|---:|---:|---:|---:|
| Health check | 50 | 1319.5 | 30ms | 138ms | 0 |
| GET /labs (auth) | 50 | 129.5 | 351ms | 752ms | 0 |
| GET /accounts (auth) | 50 | 139.3 | 281ms | 2743ms | 0 |
| Health check | 100 | 1099.1 | 76ms | 261ms | 0 |
| GET /labs (auth) | 100 | 226.5 | 364ms | 4877ms | 0 |
| GET /accounts (auth) | 100 | 437.7 | 198ms | 2445ms | 0 |

## Reading these numbers honestly

- **Zero errors/timeouts at every level tested** — the application itself
  does not fall over or return incorrect data under concurrent load; the
  auth, ownership-scoping, and Prisma query paths hold up correctly.
- **Tail latency (p99) degrades sharply** on authenticated, database-backed
  endpoints as concurrency rises (client latency includes bcrypt/JWT
  overhead plus a single shared Postgres container's connection pool on
  one laptop CPU) — this is expected for a single-instance dev topology,
  not a verdict on the conference architecture, which spreads participants
  across per-participant namespaces and databases (see
  `infrastructure/kubernetes/README.md`).
- Before claiming 250 or 500-concurrent-participant support, Week 9
  execution must: (1) stand up the per-participant Kubernetes topology,
  (2) rerun this exact methodology against it, (3) record results here
  with the same honesty, and (4) get sign-off in the Week 10 Go/No-Go
  review (`docs/go-no-go-checklist.md`) before advertising that capacity.
