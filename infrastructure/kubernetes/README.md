# SecureBank Conference Infrastructure (SB-066..070)

**Status: illustrative IaC, not deployed.** This directory documents the
intended multi-tenant conference topology. It has not been applied against
real cluster infrastructure in this environment — doing so requires a real
Kubernetes cluster, cloud credentials, and DNS/ingress the conference venue
provides, none of which exist in this dev sandbox. Treat these manifests as
the reviewed design for Week 9 execution, not as something already running.

## Why per-participant namespaces

The single `docker-compose.yml` at the repo root is the **local development**
topology: one shared Postgres, one API, one web app. It is intentionally
*not* the conference topology, because the whole point of SecureBank's
"Isolated" principle (PRD §4, §23) is that Participant A's actions can never
affect Participant B's environment or data.

The conference topology instead gives each participant (or team) a
dedicated Kubernetes namespace:

```
namespace: sb-participant-<id>
  ├── Deployment: securebank-api   (this participant's copy)
  ├── Deployment: securebank-web
  ├── StatefulSet: postgres        (this participant's own database)
  ├── ResourceQuota                (SB-070: CPU/memory/storage ceiling)
  └── NetworkPolicy                (SB-069: deny-all egress except DNS + the
                                     platform's shared control plane)
```

The Sandbox platform's `environments` module (`services/api/src/modules/
environments`) is the control-plane piece that *decides* when to provision
one of these — `getOrCreateEnvironmentForLab` is where a real orchestrator
integration would call the Kubernetes API (or a provisioning queue) instead
of just writing an `Environment` row, once this topology is actually stood
up (SB-067).

## Files

- `namespace-template.yaml` — per-participant namespace + ResourceQuota +
  LimitRange (SB-070).
- `networkpolicy-isolation.yaml` — default-deny ingress/egress, with the one
  explicit allow rule a lab environment needs (DNS + the shared control
  plane API) (SB-068, SB-069).
- `deployment-template.yaml` — the API/web Deployments for one participant
  namespace, parameterised by `${PARTICIPANT_ID}`.

## What "participant isolation" means concretely here (SB-068)

Two layers, not one:

1. **Application layer** (already built and tested in this repo): every
   query in `services/api` scopes by the authenticated `userId` — see
   `accounts.model.findAccountByIdForUser`, `challenges.service.
   assertChallengeIsUnlockedForUser`, etc. This is what stops Participant A
   from reading Participant B's account or challenge progress *within a
   shared database* — which is what this repo actually runs today.
2. **Infrastructure layer** (this directory, not yet deployed): once each
   participant gets their own namespace and database, isolation no longer
   depends solely on application code being bug-free — a NetworkPolicy and
   separate Postgres instance mean there is no shared resource to query
   incorrectly in the first place. SB-078 (Week 10, Isolation Test) is
   where both layers get adversarially tested together.
