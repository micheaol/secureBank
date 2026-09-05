# Go/No-Go Review Checklist (SB-087)

Per the 10-Week plan: *"No unresolved critical safety or isolation defect
is acceptable."* This checklist separates what this repository can
demonstrate today from what requires live conference infrastructure and
people, so a reviewer can see exactly where the gap is.

## Product

- [x] Core banking workflow functions (auth, accounts, transfers, transactions, beneficiaries, support)
- [x] Web Lab operates (3 challenges, full lifecycle)
- [x] API Lab operates (3 challenges, full lifecycle)
- [x] AI Lab operates (3 challenges, full lifecycle)
- [x] DevSecOps Lab operates (3 challenges, full lifecycle)
- [x] Supply Chain Lab operates (3 challenges, full lifecycle)
- [ ] Full brief challenge catalogue (this build ships 15 representative
      challenges, not the brief's full exhaustive set — see
      `docs/labs-catalogue.md` "Scope note")

## Sandbox

- [x] Participant portal (dashboard, catalogue, workspace, success, remediation)
- [x] Lab launcher (provisioning animation + environment lifecycle)
- [x] Team system (join/create, team scoring)
- [x] Scoring (ledger-based, auditable)
- [x] Leaderboards (individual + team)
- [x] Achievements (9 defined, real unlock triggers wired to the engine)
- [x] Hints (cost-deducting, sequential reveal)
- [x] Facilitator dashboard
- [x] Admin console (overview, environments, audit log, emergency controls)

## Infrastructure

- [x] Automated provisioning (per-participant `Environment` rows;
      Kubernetes topology documented but **not deployed** — see
      `infrastructure/kubernetes/README.md`)
- [x] Automated resets (challenge-level, environment-level)
- [x] Automated teardown (terminate environment/lab, both privileged)
- [ ] Participant isolation **at the infrastructure layer** (namespaces +
      NetworkPolicy) — application-layer isolation is tested and passing
      (`infrastructure/load-tests/isolation-test.js`); infra-layer isolation
      requires the Kubernetes topology to actually exist first
- [ ] Egress controls (documented in `NetworkPolicy` templates, not deployed)
- [x] Resource limits (Docker Compose `deploy.resources.limits` for local
      dev; Kubernetes `ResourceQuota`/`LimitRange` templates for conference,
      not deployed)
- [~] Monitoring (audit log + request logs exist; no external metrics/
      alerting pipeline — depends on the eventual conference infra provider)
- [x] Kill switch (Admin console Emergency tab: stop provisioning, disable
      a lab, terminate all environments for a lab, emergency shutdown — all
      audited, all require a written reason)

## Operations

- [x] Challenges QA-tested — automated, `infrastructure/load-tests/challenge-qa.js`,
      all 15 challenges pass (start, wrong-answer rejection, correct-answer
      solve, remediation)
- [x] Security tested — automated isolation test passing; **not** a
      professional penetration test (SB-077) — that requires a dedicated
      engagement against real infrastructure
- [~] Capacity tested — real numbers exist for 50/100 concurrent connections
      against the **local dev stack only** (`docs/load-testing.md`); 250/500
      against real conference infrastructure is not yet possible because
      that infrastructure isn't deployed
- [ ] Facilitators trained — `docs/facilitator-guide.md` written; actual
      practice runs are a scheduling/logistics step for the conference team
- [x] Documentation completed (participant guide, facilitator guide,
      operations runbook, this checklist)
- [x] Runbook completed (`docs/operations-runbook.md`)
- [ ] Dress rehearsal passed — requires real participants and cannot be
      simulated from this repository

## Bottom line for this Go/No-Go pass

**Application and Sandbox platform: ready for review.** Every checkbox in
those two sections reflects code that exists, runs, and has been verified
in this session (build + lint + automated QA, all passing).

**Infrastructure and Operations: partially ready.** The application-layer
security posture (authorization, isolation, audit logging, emergency
controls) is real and tested. The parts marked `[ ]` or `[~]` all share one
root cause: they require infrastructure (a real Kubernetes cluster, cloud
credentials, conference-venue network) and people (facilitators, real
participants) that do not exist inside this development environment. Those
are Week 9/10 **execution** items for the operations team, not gaps in the
application itself.
