# Deprecation Policy - Fragment UI

## Overview

This document outlines the deprecation policy for Fragment UI components, APIs, and features.

## Deprecation Criteria

A component or feature may be deprecated if:
- It's replaced by a better alternative
- It has security or accessibility issues
- It's no longer maintained
- It conflicts with design system goals
- It has low adoption

## Deprecation Process

### 1. Announcement (vX.Y.0)

- Add deprecation notice to component/feature
- Update documentation with deprecation notice
- Add to CHANGELOG.md
- Notify maintainers and contributors

### 2. Support Period (6 months minimum)

- Component/feature remains functional
- Bug fixes only (no new features)
- Documentation maintained
- Migration guide provided

### 3. Removal (vX+1.0.0)

- Component/feature removed
- Breaking change documented
- Migration guide required

## Deprecation Timeline

```
v1.0.0 - Component available
v1.5.0 - Deprecation announced (6+ months notice)
v2.0.0 - Component removed (migration required)
```

## Deprecation Notice Format

### In Code

```typescript
/**
 * @deprecated This component is deprecated and will be removed in v2.0.0.
 * Use NewComponent instead.
 * 
 * Migration guide: https://fragment-ui.dev/docs/migrations/old-to-new
 */
export function OldComponent() {
  // ...
}
```

### In Documentation

```markdown
> ⚠️ **Deprecated**: This component is deprecated and will be removed in v2.0.0.
> Use [NewComponent](/docs/components/new-component) instead.
> 
> See [Migration Guide](/docs/migrations/old-to-new) for details.
```

### In Changelog

```markdown
## Deprecated

- `OldComponent` - Deprecated in v1.5.0, will be removed in v2.0.0. Use `NewComponent` instead.
```

## Migration Requirements

When deprecating, provide:
- ✅ Clear migration path
- ✅ Migration guide with examples
- ✅ Codemod (if applicable)
- ✅ Timeline for migration
- ✅ Support during migration period

## Exceptions

Emergency deprecations (security issues) may have shorter timelines:
- Security issues: 1 month minimum
- Critical bugs: 3 months minimum

## Communication

Deprecations are communicated via:
- CHANGELOG.md
- Documentation updates
- GitHub releases
- Email/Slack notifications (for enterprise customers)

---

*Last updated: 2025-01-05*

