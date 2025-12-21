# 📦 Registry Deployment Guide

## 🎯 Overview

Registry files need to be accessible via HTTPS for `shadcn add` command. There are multiple options available.

## ✅ Option 1: Vercel Portal (Already Working!)

**Registry files are already available through Vercel deployment!**

Since `apps/www/public/r/` is served as static files by Next.js, all registry files are automatically accessible:

**Registry URL:** `https://fragment-ui.dev/r/[component].json`

Or alternatively: `https://fragment-ui-www.vercel.app/r/[component].json`

### Usage:
```bash
# Using the main domain
npx shadcn@latest add https://fragment-ui.dev/r/button.json

# Or using Vercel domain
npx shadcn@latest add https://fragment-ui-www.vercel.app/r/button.json
```

### ✅ Advantages:
- ✅ Already configured and working
- ✅ No additional setup needed
- ✅ Automatic deployment with portal
- ✅ Free tier available

### Available Components:
- https://fragment-ui-www.vercel.app/r/button.json
- https://fragment-ui-www.vercel.app/r/input.json
- https://fragment-ui-www.vercel.app/r/dialog.json
- ... and all other components

---

## 📦 Option 2: GitHub Pages (Optional - Setup Later)

Registry files can be deployed to GitHub Pages for a separate registry domain.

**Note:** GitHub Pages is **free for public repositories**. GitHub Pro is not required.

**Registry URL (after setup):** `https://blazejrzepa.github.io/fragment-ui-registry/r/[component].json`

## 🚀 Automatic Deployment

### GitHub Actions Workflow

The `.github/workflows/deploy-registry.yml` workflow automatically deploys registry files when:
- Push to `main` branch
- Changes in:
  - `packages/registry/**`
  - `apps/www/public/r/**`
  - `scripts/generate-registry-json.mjs`

### Manual Trigger

You can also trigger deployment manually:
1. Go to: https://github.com/blazejrzepa/fragment-ui/actions/workflows/deploy-registry.yml
2. Click "Run workflow"
3. Select branch: `main`
4. Click "Run workflow"

## ⚙️ Setup GitHub Pages

### First Time Setup

1. **Go to Repository Settings:**
   ```
   https://github.com/blazejrzepa/fragment-ui/settings/pages
   ```

2. **Configure GitHub Pages:**
   - **Source:** GitHub Actions (not branch)
   - **Branch:** Leave empty (workflow handles deployment)
   - **Folder:** Leave empty

3. **Save settings**

### After First Deployment

The workflow will create a `gh-pages` branch automatically and deploy to:
```
https://blazejrzepa.github.io/fragment-ui-registry/
```

## 📋 Registry Files Structure

Each registry file contains:
```json
{
  "name": "button",
  "type": "registry:component",
  "dependencies": ["react", "react-dom"],
  "files": [
    {
      "path": "components/ui/button.tsx",
      "content": "..."
    }
  ]
}
```

## ✅ Usage

### Install Component

```bash
npx shadcn@latest add https://blazejrzepa.github.io/fragment-ui-registry/r/button.json
```

### Available Components

All components are listed at:
```
https://blazejrzepa.github.io/fragment-ui-registry/
```

Or directly access:
```
https://blazejrzepa.github.io/fragment-ui-registry/r/button.json
https://blazejrzepa.github.io/fragment-ui-registry/r/input.json
https://blazejrzepa.github.io/fragment-ui-registry/r/dialog.json
# etc...
```

## 🔍 Verification

After deployment:

1. **Check deployment status:**
   - GitHub Actions: https://github.com/blazejrzepa/fragment-ui/actions
   - Look for "Deploy Registry to GitHub Pages" workflow

2. **Test registry URL:**
   ```bash
   curl https://blazejrzepa.github.io/fragment-ui-registry/r/button.json
   ```
   Should return JSON with component definition.

3. **Test installation:**
   ```bash
   # In a test Next.js project
   npx shadcn@latest add https://blazejrzepa.github.io/fragment-ui-registry/r/button.json
   ```

## 🆘 Troubleshooting

### Registry Not Updating

**Problem:** Changes to registry files don't trigger deployment

**Solution:**
- Ensure files are in `apps/www/public/r/` after running `pnpm registry:generate`
- Check if workflow is triggered (GitHub Actions tab)
- Manually trigger workflow if needed

### 404 on Registry URL

**Problem:** `https://blazejrzepa.github.io/fragment-ui-registry/r/button.json` returns 404

**Solutions:**
1. Check GitHub Pages is enabled: https://github.com/blazejrzepa/fragment-ui/settings/pages
2. Check deployment succeeded in Actions tab
3. Wait a few minutes for GitHub Pages to update (can take up to 10 minutes)
4. Clear browser cache

### CORS Errors

**Problem:** CORS errors when accessing registry from `shadcn add`

**Solution:**
- GitHub Pages automatically sets CORS headers
- If issues persist, check GitHub Pages configuration

## 🔄 Update Registry

To update registry files:

1. **Make changes to components** in `packages/ui/src/`

2. **Regenerate registry:**
   ```bash
   pnpm registry:generate
   ```

3. **Commit and push:**
   ```bash
   git add apps/www/public/r/
   git commit -m "chore: Update registry files"
   git push origin main
   ```

4. **Workflow will automatically deploy**

## 📊 Alternative: Use Vercel Portal

The registry files are also available through the Vercel portal deployment:
```
https://fragment-ui-www.vercel.app/r/button.json
```

This is automatically available since `apps/www/public/r/` is served as static files by Next.js.

## 🔗 Related Files

- **Workflow:** `.github/workflows/deploy-registry.yml`
- **Generator:** `scripts/generate-registry-json.mjs`
- **Registry config:** `packages/registry/registry.json`
- **Output:** `apps/www/public/r/*.json`

