# Documentation Versioning System

Fragment UI implements a comprehensive versioning system for documentation that allows users to access documentation for specific versions while maintaining backward compatibility.

## Overview

The versioning system supports:
- **Semantic Versioning (SemVer)**: Major.Minor.Patch format (e.g., 1.0.0)
- **Version Switcher**: Easy navigation between versions in the UI
- **Versioned Routes**: Access documentation via `/docs/v{version}/{path}`
- **Changelog**: Track changes across versions
- **Component History**: View version-specific changes for components

## Architecture

### Routing

Versioned documentation routes use a middleware-based approach to handle dots in version numbers:

1. **URL Format**: `/docs/v0.9.0/changelog` or `/docs/v0.9.0/foundations/tokens`
2. **Middleware Rewrite**: Converts dots to dashes: `/docs/v/0-9-0/changelog`
3. **Route Handler**: `/app/docs/v/[...version]/page.tsx` parses the version and renders content

### Components

#### Version Switcher (`VersionSwitcher`)
Located in the main navigation, allows users to:
- Switch between available versions
- View version status (Current, Beta, Deprecated)
- Automatically navigate to versioned docs

#### Versioned Docs Page
Handles rendering of versioned documentation:
- Parses version from URL segments
- Validates version exists
- Redirects current version to non-versioned docs
- Shows deprecation warnings

### Version Management

Versions are defined in `/apps/www/src/lib/versions.ts`:

```typescript
export const VERSIONS: Version[] = [
  {
    version: "1.0.0",
    label: "1.0.0 (Current)",
    status: "stable",
    releaseDate: "2024-01-01",
    changelog: ["Initial release"],
  },
  // ...
];
```

## Adding a New Version

1. **Update versions.ts**:
   ```typescript
   {
     version: "1.1.0",
     label: "1.1.0 (Current)",
     status: "stable",
     releaseDate: "2024-02-01",
     changelog: [
       "Added new Button variants",
       "Improved accessibility",
     ],
   }
   ```

2. **Update CURRENT_VERSION**:
   ```typescript
   export const CURRENT_VERSION = "1.1.0";
   ```

3. **Add Component History** (if needed):
   ```typescript
   COMPONENT_VERSIONS["button"] = [
     {
       version: "1.1.0",
       changes: ["Added outline variant"],
     },
   ];
   ```

## Version Status Types

- **stable**: Production-ready version (default)
- **beta**: Pre-release version
- **deprecated**: Old version, should be upgraded

## URL Patterns

### Current Version
- `/docs/changelog` → Shows current version docs
- `/docs/v1.0.0/changelog` → Redirects to `/docs/changelog`

### Older Versions
- `/docs/v0.9.0/changelog` → Shows 0.9.0 version docs
- `/docs/v0.9.0/foundations/tokens` → Versioned tokens page

## Implementation Details

### Middleware
The middleware (`apps/www/middleware.ts`) handles:
- Intercepting versioned URLs with dots
- Rewriting to internal route format
- Preserving slug paths for nested routes

### Route Structure
```
app/docs/
  ├── v/
  │   └── [...version]/
  │       └── page.tsx  # Handles all versioned routes
  ├── changelog/
  │   └── page.tsx
  └── ...
```

### Parsing Logic
The versioned page component:
1. Receives version segments from Next.js routing
2. Detects if version uses dashes (from middleware rewrite) or dots
3. Converts to standard format (e.g., `0-9-0` → `0.9.0`)
4. Validates against available versions
5. Renders appropriate content or 404

## Best Practices

1. **Always update changelog** when releasing a new version
2. **Mark breaking changes** clearly in component history
3. **Deprecate old versions** after sufficient migration period
4. **Test version switching** across different pages
5. **Keep version metadata** up to date (release dates, status)

## Troubleshooting

### Version Not Found (404)
- Check version exists in `VERSIONS` array
- Verify version string matches exactly (case-sensitive)
- Ensure middleware is rewriting correctly

### Duplicate Keys Error
- Ensure all headings have unique IDs
- Check `extractHeadings` function handles duplicates

### Route Not Matching
- Clear Next.js cache: `rm -rf apps/www/.next`
- Restart dev server
- Check middleware matcher configuration

