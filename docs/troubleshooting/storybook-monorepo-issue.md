# ⚠️ Storybook Build Issue in pnpm Monorepo

## Problem

Storybook build fails in pnpm monorepo with module resolution errors:
```
[vite]: Rollup failed to resolve import "@storybook/addon-actions/preview"
```

## Root Cause

This is a **known issue** with pnpm + Storybook + Vite in monorepos:
- pnpm uses isolated node_modules structure
- Storybook addons use deep imports (e.g., `@storybook/addon-actions/preview`)
- Vite/Rollup cannot resolve these imports correctly in pnpm's structure
- `@storybook/addon-essentials` bundles multiple addons and imports them dynamically

## Solutions Attempted

✅ **Added explicit dependencies** - `@storybook/addon-actions`, `@storybook/addon-docs`, etc.  
✅ **Configured Vite aliases** - Direct paths to addon packages  
✅ **Created custom Vite plugin** - Dynamic resolver for addon imports  
✅ **Enhanced .npmrc hoisting** - `public-hoist-pattern[]=*storybook*`  
❌ **Still failing** - Rollup cannot resolve imports from within `@storybook/addon-essentials`

## Recommended Solution: Use Chromatic ✅

**Chromatic works perfectly** because:
- It uses its own build environment
- Better handling of monorepo structures
- Automatic hosting
- Visual regression testing included
- **Already configured and working!**

### Setup Chromatic:

1. **Verify token is in GitHub Secrets:**
   - https://github.com/blazejrzepa/fragment-ui/settings/secrets/actions
   - Should have: `CHROMATIC_PROJECT_TOKEN`

2. **Check Chromatic builds:**
   - https://github.com/blazejrzepa/fragment-ui/actions/workflows/chromatic.yml

3. **Get Storybook URL:**
   - From Chromatic dashboard: https://www.chromatic.com/builds
   - Or from GitHub Actions workflow output

4. **Update Portal:**
   - Vercel → `fragment-ui-www` → Settings → Environment Variables
   - Add: `NEXT_PUBLIC_STORYBOOK_URL` = [Chromatic URL]

## Alternative Solutions (Not Recommended)

### Option 1: Use `shamefully-hoist=true`
```ini
# .npmrc
shamefully-hoist=true
```
⚠️ **Warning:** This defeats pnpm's benefits and can cause dependency issues

### Option 2: Use npm/yarn instead of pnpm
- Loses pnpm's performance benefits
- Not recommended for monorepo

### Option 3: Move Storybook to root
- Create `.storybook` in repo root
- Builds may work, but loses package isolation

### Option 4: Use Storybook 7.x
- Older version may have better monorepo support
- Loses newer features

## Current Status

- ❌ **Storybook build fails locally** (module resolution)
- ❌ **Vercel deployment fails** (same issue)
- ✅ **Chromatic works** (recommended solution)

## References

- [Storybook + pnpm issues](https://github.com/storybookjs/storybook/issues/18720)
- [pnpm hoisting documentation](https://pnpm.io/npmrc#public-hoist-pattern)
- [Chromatic setup guide](./CHROMATIC_SETUP.md)

