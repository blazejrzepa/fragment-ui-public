# Storybook Troubleshooting

## Problem: Vite cannot resolve Storybook internal modules

### Error
```
Failed to resolve import "storybook/internal/preview/runtime" from "virtual:/@storybook/builder-vite/vite-app.js"
```

### Root Cause
This is a known issue with Storybook + Vite + pnpm in monorepos. The problem occurs because:
1. pnpm uses a different node_modules structure
2. Vite has trouble resolving Storybook's internal modules
3. Virtual files in Storybook need special handling

## Solutions Applied

1. ✅ **PostCSS config** - Changed to `.cjs` extension
2. ✅ **.npmrc** - Added hoisting for Storybook and Vite
3. ✅ **Root dependencies** - Added `storybook` to root `package.json`
4. ✅ **Vite config** - Added `viteFinal` with dedupe and fs.allow

## Current Status

Storybook manager starts successfully, but Vite preview has module resolution issues.

## Alternative Solutions to Try

### Option 1: Use Storybook 7.x (More stable)
```bash
pnpm -C packages/ui add -D @storybook/react-vite@^7.6.0
```

### Option 2: Move Storybook to root
Create `.storybook` in root instead of in `packages/ui`.    

### Option 3: Use Webpack instead of Vite
Switch to `@storybook/react-webpack5` which may handle monorepos better.

### Option 4: Use pnpm.publicHoistPattern
Add to root `package.json`:
```json
{
  "pnpm": {
    "publicHoistPattern": ["*storybook*", "*vite*"]
  }
}
```

## Manual Testing

For now, you can:
1. ✅ Verify stories compile (run `pnpm test:storybook`)
2. ✅ Check that all components have stories
3. ⏳ Browser testing requires Vite preview to work

The stories themselves are valid - the issue is only with the Vite dev server.

