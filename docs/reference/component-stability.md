# Component Stability Levels

Fragment UI components are marked with stability levels to help you make informed decisions about which components to use in production.

## Stability Levels

### Stable

**Label:** `stable`

**Meaning:**
- Component is production-ready and stable
- Follows Semantic Versioning (SemVer)
- Breaking changes will include migration notes
- Safe to use in production applications

**Example:**
```tsx
import { Button } from "@fragment_ui/ui";
// Button is stable - safe for production use
```

### Experimental

**Label:** `experimental`

**Meaning:**
- Component is available but may change without migration guarantees
- API may change in future versions
- Use with caution in production
- Good for prototyping and testing

**Example:**
```tsx
import { ExperimentalComponent } from "@fragment_ui/ui";
// Experimental - may change without notice
```

### Deprecated

**Label:** `deprecated`

**Meaning:**
- Component is no longer recommended for new projects
- Will be removed in a future version
- Includes deprecation notice and planned removal version
- Migration path provided when available

**Example:**
```tsx
import { DeprecatedComponent } from "@fragment_ui/ui";
// Deprecated in v1.2.0 - will be removed in v2.0.0
// Use NewComponent instead
```

## How to Check Stability

### In Documentation

Each component page shows a stability badge at the top:

- 🟢 **Stable** - Production-ready
- 🟡 **Experimental** - May change
- 🔴 **Deprecated** - Will be removed

### In Registry

Component registry includes `stability` field:

```json
{
  "button": {
    "import": "@fragment_ui/ui/button",
    "stability": "stable",
    "description": "..."
  }
}
```

### In Code

TypeScript types include stability information:

```typescript
import type { ComponentInfo } from "@fragment_ui/registry";

const component: ComponentInfo = {
  stability: "stable",
  // ...
};
```

## Best Practices

1. **Production Apps:** Use only `stable` components
2. **Prototyping:** `experimental` components are fine
3. **New Projects:** Avoid `deprecated` components
4. **Existing Projects:** Plan migration from `deprecated` components

## Migration

When a component is deprecated:

1. Check the deprecation notice in component docs
2. Review migration notes (if provided)
3. Update to the recommended replacement
4. Test thoroughly before deploying

---

**See also:**
- [Public DS Guidelines](../OSS_PUBLIC_DS_GUIDELINES.md) - Development guidelines
- [Component Registry](../tools/registry/usage.md) - Registry usage guide

