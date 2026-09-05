# Facilitator Guide (SB-083)

## Access

Sign in with an account whose role is `lab_facilitator`,
`sandbox_administrator`, or `administrator`, then open the **Facilitator**
surface from the masthead (`/facilitator`). Any other role gets a plain
"Access restricted" message, not an error — that's expected, not a bug.

## What you can see

- **Floor stats**: registered participants, how many have scored at least
  once, environments currently running, and open help requests.
- **Help queue**: every open `Request Facilitator` submission, with lab,
  reason, and how long it's been waiting. Resolve one once you've helped.
- **Lab health**: total solves vs. total challenges per lab, and how many
  environments are running there — a quick read on which lab needs more
  facilitators on the floor.
- **Participant inspector**: click any participant to see their team,
  score, per-challenge progress, and their environments.

## What you can do

- **Extend** a participant's environment (+30 minutes) if they're close to
  finishing and about to time out.
- **Reset** a participant's environment if it's stuck (this terminates it;
  they'll get a fresh one next time they launch a challenge).
- **Resolve** a help-queue entry once handled.

Every one of these is written to the audit log with your account as the
actor (`services/api/src/modules/audit`) — visible to administrators in the
Admin console's Audit log tab.

## What you cannot do here

Score overrides, challenge resets *for a specific challenge* (not just the
whole environment), and lab-wide emergency controls (disable a lab, stop
provisioning, shut down the floor) are **Administrator**-only, in the Admin
console (`/admin`) — not the Facilitator console. If a participant needs
one of those, escalate to an administrator rather than trying to work
around it from here.

## Incident escalation

If you see something that looks like a genuine platform defect (not an
intentional challenge) — e.g., a participant reaching another participant's
data outside the current lab's design — stop them, do not let them continue
exploring it, and escalate to an administrator immediately. This is exactly
the scenario `infrastructure/load-tests/isolation-test.js` exists to catch
before conference day; if it's happening live, it's a Week 10 Go/No-Go
blocker, not routine facilitation.

## Practice checklist (SB-083 training)

Before conference day, every facilitator should have actually done each of
these once, not just read about them:

- [ ] Signed in and opened the Facilitator console
- [ ] Resolved a help-queue entry end-to-end
- [ ] Extended a participant's environment
- [ ] Reset a participant's stuck environment
- [ ] Located a specific participant via the inspector and read their
      progress
- [ ] Knows what to do if the floor overview shows a lab with 0
      environments running and non-zero waiting help requests (probable
      provisioning problem — escalate to admin)
