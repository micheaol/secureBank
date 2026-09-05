# Load, isolation, and challenge QA tooling (SB-073..079)

Requires the stack running locally (`npm run dev:api` at minimum; `npm run
db:seed --workspace=services/api` must have been run at least once).

```bash
# Real requests/sec + latency against this dev machine's stack.
node infrastructure/load-tests/run-load-test.js <connections> <durationSeconds>
node infrastructure/load-tests/run-load-test.js 50 15
node infrastructure/load-tests/run-load-test.js 100 15

# Adversarial cross-participant access checks (SB-078).
node infrastructure/load-tests/isolation-test.js

# End-to-end QA of every seeded challenge (SB-079).
node infrastructure/load-tests/challenge-qa.js
```

See `docs/load-testing.md` for the results captured from this dev machine
and — importantly — what those numbers do and do not prove about
conference-day capacity.
