## Description
<!-- Briefly describe the change -->

## Checklist
- [ ] Build passes: `npm run -w apps/admin-ui build` and `npm run -w apps/api typecheck`
- [ ] No forbidden imports in admin-ui (no `@/lib/supabase/admin`, no `createAdminClient`)
- [ ] If this PR touches PAGE 15 (User Investigation): PII masked by default, evidence-pack and reveal-pii RBAC/audit verified, case-gated chat unchanged

## Related
<!-- Issue or plan reference if any -->
