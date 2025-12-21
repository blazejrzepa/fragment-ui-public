# Documentation Maintenance Policy

**Purpose:** Guidelines for keeping documentation up to date  
**Audience:** All contributors  
**When to read:** When updating documentation

---

## When to Update Documentation

### Must Update

- **New Features:** Document new features immediately
- **API Changes:** Update API docs when APIs change
- **Architecture Changes:** Update architecture docs when system changes
- **Breaking Changes:** Document breaking changes in migration guides

### Should Update

- **Bug Fixes:** Update troubleshooting if bug was common
- **Process Changes:** Update runbooks if processes change
- **Tool Updates:** Update tool docs if tools change

### Nice to Update

- **Examples:** Add examples for clarity
- **Diagrams:** Update diagrams if architecture changes
- **Links:** Fix broken links

---

## How to Add a New ADR

1. **Create File:** `docs/architecture/decisions/00XX-title.md`
2. **Use Next Number:** Check existing ADRs for next number
3. **Follow Format:** Use ADR template
4. **Update Index:** Add to `docs/architecture/decisions/README.md`
5. **Set Status:** Start with "Proposed", update to "Accepted" when decided

### ADR Template

```markdown
# ADR-00XX: [Title]

**Status:** Proposed | Accepted | Deprecated | Superseded
**Date:** YYYY-MM-DD
**Deciders:** [Names]

## Context
[Background and problem statement]

## Decision
[What we decided]

## Consequences
[Positive and negative consequences]
```

---

## How to Keep Diagrams in Sync

### Mermaid Diagrams

- **Location:** In markdown files using ` ```mermaid ` code blocks
- **Update:** Update diagrams when architecture changes
- **Verify:** Check that diagrams render correctly (GitHub, VS Code)

### C4 Diagrams

- **Location:** `docs/architecture/system-overview.md`
- **Update:** Update when system architecture changes
- **Verify:** Use Mermaid C4 extension or online renderer

---

## How to Keep Contracts in Sync

### API Contracts

- **Location:** `docs/reference/api-contracts.md`
- **Update:** Update when API endpoints change
- **Format:** OpenAPI/Swagger or markdown tables

### Registry Format

- **Location:** `docs/reference/registry-format.md`
- **Update:** Update when registry schema changes
- **Format:** JSON Schema or TypeScript types

### UI-DSL Schema

- **Location:** `docs/reference/ui-dsl-schema.md`
- **Update:** Update when DSL schema changes
- **Format:** JSON Schema exported from `packages/ui-dsl`

---

## Documentation Review Process

### Before Merging

- [ ] Documentation updated for changes
- [ ] Links verified (no broken links)
- [ ] Diagrams render correctly
- [ ] Examples work
- [ ] Spelling/grammar checked

### Periodic Review

- **Quarterly:** Review all documentation for accuracy
- **After Major Releases:** Update architecture docs
- **When System Changes:** Update relevant sections

---

## Documentation Standards

### File Naming

- **kebab-case:** `component-name.md`
- **Descriptive:** `how-to-do-x.md`
- **Consistent:** Follow existing patterns

### Structure

- **Purpose:** State purpose at top
- **Audience:** Who should read this
- **When to read:** When to read this
- **Gotchas:** Common pitfalls

### Content

- **Actionable:** Focus on what to do, not theory
- **Examples:** Include code examples
- **Links:** Link to related docs
- **Checklists:** Use checklists for procedures

---

## Translation Policy

- **Language:** All documentation in English
- **No Polish:** Do not use Polish in documentation
- **Translation:** Translate any Polish content to English

---

## Archive Policy

### When to Archive

- **Superseded:** Document replaced by newer version
- **Outdated:** Document no longer accurate
- **Completed:** Implementation plan for completed work

### Archive Location

- **Path:** `docs/archive/` or `docs/{section}/archive/`
- **README:** Create README in archive explaining why archived
- **Don't Delete:** Archive, don't delete (preserve history)

---

## Getting Help

- **Questions:** Ask in team channel
- **Suggestions:** Create issue or PR
- **Broken Links:** Fix immediately or create issue

---

**Last Updated:** 2025-01-XX

