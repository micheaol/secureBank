# SecureBank — Lab Catalogue (SB-014, SB-021, SB-030, SB-039, SB-048)

## Architecture common to every lab

Every lab (Web, API, AI, DevSecOps, Supply Chain) is built on the same
challenge engine (`services/api/src/modules/{labs,challenges,environments,
scoring,achievements}`), not five separate systems:

- **Evidence-investigation pattern.** Each challenge exposes a
  `scenario`/`objective`, an `evidenceBundle` (log lines and/or tables the
  participant reads across tabs in the Workspace), and an `answerKey`. There
  is no live exploitation traffic against a shared target — every
  participant gets their own read-only copy of the same synthetic evidence,
  which keeps labs safely isolated per participant (PRD §4, §23) without
  needing to thread feature flags through the real banking code paths.
- **Sequential unlock.** Challenges within a lab unlock in `order`; solving
  challenge *N* sets challenge *N+1* to `AVAILABLE` (`challenges/service.js
  submitAnswer`).
- **Scoring ledger.** Every point change (solve, hint cost, remediation
  bonus) is an immutable `ScoreEvent` row, not a mutable balance — this is
  what Week 8's leaderboard and the Admin/Facilitator consoles read from.
- **SB-013 feature flags.** `ChallengeProgress.flagState` (`VULNERABLE` /
  `PATCHED`) is scoped per participant per challenge. A facilitator/admin can
  reset any participant's single challenge (`POST
  /challenges/:code/reset/:userId`) without touching anyone else's state.
- **Environments.** Starting a challenge auto-provisions (or reuses) an
  `Environment` row for that lab (`env-XXXX`, 2-hour lifetime, extend/reset/
  terminate endpoints) — the Sandbox UI's provisioning animation is a
  client-side flourish; the backend is instant.

## Web Application Security (SB-015..020)

Three challenges spanning the required families:

| Code | Family | Difficulty | Weakness |
|---|---|---|---|
| WEB-01 | Access control (BOLA) | Explorer | Statement lookup doesn't verify ownership |
| WEB-02 | Session management | Engineer | Offboarding disables login but doesn't revoke refresh tokens |
| WEB-03 | Business logic | Specialist | TOCTOU race between transfer cancel and confirm |

## API Security (SB-022..027)

| Code | OWASP API Top 10 | Difficulty |
|---|---|---|
| API-01 | API1: Broken Object Level Authorization | Explorer |
| API-02 | API6/API3: Mass assignment | Engineer |
| API-03 | API4: Unrestricted resource consumption | Specialist |

## AI Security (SB-033..037)

| Code | Family | Difficulty |
|---|---|---|
| AI-01 | Direct prompt injection / system prompt leakage | Explorer |
| AI-02 | Excessive agency — tool invocation without authorization | Engineer |
| AI-03 | RAG poisoning / trust boundary failure | Specialist |

## DevSecOps (SB-041..045)

| Code | Family | Difficulty |
|---|---|---|
| DEVSECOPS-01 | Secret committed to source control | Explorer |
| DEVSECOPS-02 | Weak pipeline permissions / missing environment protection | Engineer |
| DEVSECOPS-03 | Excessive container privileges | Specialist |

## Software Supply Chain (SB-050..054)

| Code | Family | Difficulty |
|---|---|---|
| SC-001 | Dependency confusion | Explorer |
| SC-002 | Manifest/lockfile drift + missing provenance (full investigation across dependency diff, SBOM, artifact inspector, timeline — matches the design handoff's Workspace screen exactly) | Engineer |
| SC-003 | Missing provenance enforcement at deploy time | Specialist |

## Scope note

Three challenges per lab is a deliberately representative set, not the
brief's full exhaustive catalogue — PRD §29 explicitly excludes "reproduce
every AppSec vulnerability category" from V1 scope. The engine and content
schema (`prisma/seeds/labChallenges.js`) are built so additional challenges
are pure data: no code changes are needed to add more to any lab.
