# Orchestrator Workflow

Use this workflow for session-level feature audits and release readiness checks.

## 1. Scope Collection

1. Identify feature/page scope and impacted files.
2. Split findings by area: UI, API, shared contracts, tests, docs.
3. List executed verification commands and outcomes.

## 2. Integrity Audit

1. Confirm real-vs-mock wiring for implemented features.
2. Validate API contracts and frontend consumers stay consistent.
3. Check build/typecheck/lint/test status for touched areas.
4. Flag regressions and unresolved design parity gaps.

## 3. Risk Audit

1. Security: auth/RBAC, privilege scope, exposed internals.
2. Data correctness: aggregation logic, fallback semantics, edge cases.
3. Build stability: failing checks, missing deps, generated-file noise.

## 4. Output Template

1. Master Report (changes, risks, missing items, next actions).
2. Blockers (actionable and explicit).
3. Final readiness status:
- `Ready` only when critical/major issues are closed and verification passes.
- otherwise `Not Ready` with exact reasons.
