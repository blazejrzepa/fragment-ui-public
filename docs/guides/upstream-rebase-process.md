# Upstream Rebase Process - Fragment UI

## Overview

Fragment UI is based on shadcn/ui components. This document describes the process for managing upstream updates and maintaining our customizations through an overlay patches system.

## Why We Need This

When shadcn/ui releases updates, we need to:
1. **Update our components** with upstream changes
2. **Preserve our customizations** (Fragment UI-specific modifications)
3. **Handle conflicts** when upstream changes conflict with our patches
4. **Maintain compatibility** with our design tokens and conventions

## Architecture

### Overlay Patches System

The overlay patches system allows us to:
- Track customizations made to upstream components
- Automatically reapply patches after upstream updates
- Detect conflicts when upstream changes conflict with our patches
- Maintain a history of all rebases

### Patch Types

1. **Modify** - Changes to existing code
2. **Add** - New code added
3. **Remove** - Code removed
4. **Replace** - Code replaced

## Rebase Process

### Step 1: Preparation

Before starting a rebase:

1. **Check current state:**
   ```bash
   pnpm --filter @fragment_ui/patches list
   ```

2. **Review active patches:**
   - Understand what customizations we have
   - Note any patches that might conflict

3. **Backup current state:**
   ```bash
   git commit -am "Before rebase to upstream vX.Y.Z"
   ```

### Step 2: Update Upstream

1. **Update shadcn/ui components:**
   ```bash
   # For each component that needs updating
   npx shadcn@latest add button --overwrite
   ```

2. **Or update via registry:**
   ```bash
   # Update from shadcn registry
   curl -o packages/ui/src/button.tsx https://ui.shadcn.com/r/button.json
   ```

### Step 3: Check for Conflicts

1. **Check all patches:**
   ```bash
   pnpm --filter @fragment_ui/patches check <patch-id>
   ```

2. **Review conflicts:**
   - If conflicts exist, review each one
   - Determine if patch is still needed
   - Update patch if upstream change makes it obsolete

### Step 4: Start Rebase

1. **Start rebase process:**
   ```bash
   pnpm --filter @fragment_ui/patches rebase <from-version> <to-version>
   ```

   Example:
   ```bash
   pnpm --filter @fragment_ui/patches rebase 1.0.0 1.1.0
   ```

2. **Review rebase info:**
   - Check number of patches
   - Review conflicts
   - Plan resolution strategy

### Step 5: Resolve Conflicts

For each conflict:

1. **Review the conflict:**
   - What upstream changed
   - What our patch expected
   - What the current state is

2. **Decide resolution:**
   - **Keep patch** - If our customization is still needed
   - **Update patch** - If patch needs modification
   - **Remove patch** - If upstream change makes patch obsolete

3. **Update patch file:**
   ```bash
   # Edit patch file in packages/patches/<patch-id>.json
   # Update oldContent/newContent to match new upstream
   ```

### Step 6: Apply Patches

1. **Apply all patches:**
   ```bash
   pnpm --filter @fragment_ui/patches apply <patch-id>
   ```

2. **Or apply all for a component:**
   ```bash
   # This is handled by the rebase manager
   ```

3. **Verify changes:**
   - Run tests
   - Check Storybook
   - Verify functionality

### Step 7: Test & Validate

1. **Run tests:**
   ```bash
   pnpm test
   ```

2. **Check Storybook:**
   ```bash
   pnpm storybook
   ```

3. **Verify A11y:**
   ```bash
   pnpm test:a11y
   ```

4. **Check bundle size:**
   ```bash
   pnpm bundle:analyze
   ```

### Step 8: Complete Rebase

1. **Generate report:**
   ```bash
   pnpm --filter @fragment_ui/patches report
   ```

2. **Commit changes:**
   ```bash
   git add .
   git commit -m "Rebase to upstream vX.Y.Z - Applied N patches"
   ```

3. **Update documentation:**
   - Update CHANGELOG.md
   - Update version numbers
   - Document any breaking changes

## Creating New Patches

### When to Create a Patch

Create a patch when you need to:
- Customize upstream component behavior
- Add Fragment UI-specific features
- Modify styling to match our design tokens
- Fix issues specific to our use case

### How to Create a Patch

1. **Make your changes** to the component in `packages/ui/src/`

2. **Create patch:**
   ```bash
   pnpm --filter @fragment_ui/patches create \
     --component button \
     --file button.tsx \
     --description "Add loading state support" \
     --reason "Fragment UI requires loading states for all interactive components"
   ```

3. **Verify patch:**
   ```bash
   pnpm --filter @fragment_ui/patches check <patch-id>
   ```

4. **Test patch:**
   - Apply patch to clean upstream version
   - Verify functionality
   - Run tests

## Patch File Structure

```json
{
  "metadata": {
    "id": "button-loading-state-1234567890",
    "componentName": "button",
    "upstreamVersion": "latest",
    "fragmentVersion": "1.8.0",
    "createdAt": 1234567890000,
    "updatedAt": 1234567890000,
    "description": "Add loading state support",
    "author": "developer@example.com",
    "reason": "Fragment UI requires loading states for all interactive components"
  },
  "targetFile": "button.tsx",
  "patchType": "modify",
  "changes": [
    {
      "type": "insert",
      "line": 15,
      "newContent": "  loading?: boolean;"
    },
    {
      "type": "replace",
      "line": 45,
      "oldContent": "      disabled={disabled}",
      "newContent": "      disabled={disabled || loading}"
    }
  ]
}
```

## Best Practices

### 1. Minimize Patches

- Prefer configuration over patches when possible
- Use design tokens instead of hardcoded values
- Leverage CSS variables for customization

### 2. Document Patches

- Always provide clear `description` and `reason`
- Link to issues or RFCs if applicable
- Document expected behavior

### 3. Test Patches

- Test patches on clean upstream versions
- Verify patches work after rebase
- Update tests if patch changes behavior

### 4. Review Regularly

- Review patches quarterly
- Remove obsolete patches
- Consolidate related patches

### 5. Version Tracking

- Track upstream version in patch metadata
- Update `upstreamVersion` after rebase
- Document compatibility

## Troubleshooting

### Patch Won't Apply

**Problem:** Patch conflicts with current code

**Solution:**
1. Check if patch is still needed
2. Update patch to match new upstream
3. Or remove patch if obsolete

### Rebase Fails

**Problem:** Multiple patches conflict

**Solution:**
1. Apply patches one by one
2. Resolve conflicts individually
3. Update patch dependencies if needed

### Upstream Change Makes Patch Obsolete

**Problem:** Upstream now includes our customization

**Solution:**
1. Remove the patch
2. Update component to use upstream version
3. Document the change

## Automation

### CI/CD Integration

Add rebase checks to CI:

```yaml
# .github/workflows/rebase-check.yml
name: Rebase Check
on:
  pull_request:
    paths:
      - 'packages/ui/src/**'
jobs:
  check-patches:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: pnpm install
      - run: pnpm --filter @fragment_ui/patches check-all
```

### Scheduled Rebase

Consider monthly rebase schedule:

1. First Monday of month: Check for upstream updates
2. Review patches and conflicts
3. Plan rebase for next week
4. Execute rebase and test
5. Release if successful

## Related Documentation

- [RFC Process](./RFC_PROCESS.md) - For proposing patch changes
- [Deprecation Policy](./DEPRECATION_POLICY.md) - For removing patches
- [Contributing Guide](./CONTRIBUTING.md) - For patch contributions

---

*Last Updated: 2025-01-05*

