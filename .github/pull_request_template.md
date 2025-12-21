## Summary

What does this PR change and why?

---

## Scope

- [ ] Public DS (`@fragment_ui/ui`, `@fragment_ui/tokens`, `@fragment_ui/blocks`)
- [ ] Docs (`apps/www`)
- [ ] Internal tooling (Studio/Playground/Copilot)
- [ ] CI / Infra

---

## Public DS Contract Checklist (required if Public DS is touched)

**Definition of Done** - All items must be checked before merge:

### Quality

- [ ] Component uses tokens (no hardcoded styles unless justified)
- [ ] Core behavior covered by unit/integration tests
- [ ] Accessibility baseline verified (keyboard + focus + roles/labels)
- [ ] Visual sanity check (Storybook or snapshots) where applicable

### Documentation

- [ ] Usage example included
- [ ] Props/API documented
- [ ] States documented (hover/focus/disabled/loading/error/empty)
- [ ] A11y notes included where relevant
- [ ] Component stability level set (stable/experimental/deprecated)

### Stability

- [ ] SemVer impact considered (patch/minor/major)
- [ ] Changeset added (if behavior/API changed)
- [ ] Migration notes added (if breaking change)

### CI Checks

- [ ] Tests pass (`pnpm test`)
- [ ] Docs build passes (`pnpm build` in apps/www)
- [ ] Public DS boundaries check passes (`pnpm check:public-ds-boundaries`)
- [ ] Public DS Contract check passes (`pnpm check:public-ds-contract`)

---

## Screenshots / Demos (optional)

Add screenshots or a short clip where useful.

---

## Notes for Reviewers

Any areas you want reviewers to focus on?

