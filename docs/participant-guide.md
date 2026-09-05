# SecureBank Participant Guide (SB-084)

## Getting started

1. Sign in at the Digital Bank surface (`/bank/login`) with the credentials
   given to you at registration, or self-register at `/bank/register`.
2. Switch to the **Sandbox** surface from the top masthead. This is your
   mission control: dashboard, lab catalogue, score, achievements,
   leaderboard, team.
3. Open **Labs**, pick one, and read its Mission before launching. Some
   labs recommend a laptop with room for several panels open at once.
4. **Launch Lab Environment** provisions your own isolated copy of that
   lab (about a minute). This never affects any other participant's
   environment or data.

## Rules

- Attack only your own assigned environment. Every environment is scoped
  to your account — you cannot reach another participant's data even if
  you try (this is tested, see `infrastructure/load-tests/isolation-test.js`).
- Do not attempt to reach the conference network, venue infrastructure, or
  any system outside your lab environment. That is out of scope and against
  the rules regardless of technical feasibility.
- All data — accounts, balances, transactions, names — is synthetic. Nothing
  in SecureBank represents a real person, account, or transaction.
- If a challenge or environment seems broken (not intentionally
  vulnerable, just *broken*), use **Request Facilitator** rather than
  working around it — a genuine platform defect is not a challenge to
  solve, it's a bug to report.

## How a challenge works

Every challenge follows the same shape:

1. **Scenario & Objective** — what's happened, and what you're trying to
   find.
2. **Evidence** — logs, tables, and diffs specific to that challenge. Read
   across the tabs; nothing here is decorative.
3. **Evidence board** — pin the specific rows/lines that support your
   finding as you go (optional, but it documents your reasoning).
4. **Hints** — each hint reduces the maximum score for that challenge; they
   reveal in order, one at a time.
5. **Record finding** — submit what you found. Validation is automated and
   immediate against your own environment.
6. **Fix It** — after solving, remediate the root cause to earn a bonus and
   move your environment's `flagState` for that challenge from
   `VULNERABLE` to `PATCHED`.

Solving a challenge unlocks the next one in that lab. Some labs have
optional hidden challenges for advanced participants.

## Scoring

Points come from four places: solving a challenge, remediating it,
achievement bonuses, and (negatively) hints. Your total score, rank, and
achievements are visible on your Dashboard and the Sandbox Leaderboard.
Team scores are the sum of member scores — join or create a team from
**Sandbox → Team**.

## Troubleshooting

| Symptom | What to do |
|---|---|
| "This challenge is locked" | Solve the previous challenge in that lab first. |
| Environment seems stuck | Use **Request Facilitator** from the Sandbox rail. |
| Wrong answer keeps failing | Re-read the evidence tabs; the answer is always something literally present in the evidence, not something you have to guess blind. |
| Can't reach a page after refresh | Your session may have expired — sign in again at `/bank/login`. |

## Acceptable use

By participating you agree to: attack only your assigned environment,
respect other participants' isolation, follow facilitator instructions,
and report unintended platform vulnerabilities (as opposed to intentional
lab challenges) responsibly rather than exploiting them further — see the
project `README.md`'s "Reporting Security Vulnerabilities" section.
