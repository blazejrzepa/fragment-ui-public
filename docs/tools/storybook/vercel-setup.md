# 📚 Storybook Deployment to Vercel

This guide explains how to deploy Fragment UI's Storybook to Vercel.

## ⚠️ Important Note

**Storybook build in monorepo has dependency resolution issues.** We recommend using **Chromatic** for Storybook deployment, which is already configured and working. See the [Alternative: Use Chromatic](#alternative-use-chromatic-already-configured) section below.

If you still want to try Vercel deployment, follow the steps below, but you may encounter build issues that require additional configuration.

## 🚀 Quick Setup

### Option 1: Deploy as Separate Project (Not Recommended - Use Chromatic Instead)

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/new
   - Sign in with GitHub
   - Click "Import Git Repository"
   - Select: `blazejrzepa/fragment-ui`

2. **Configure Project Settings**
   
   **Project Settings:**
   - **Project Name:** `fragment-ui-storybook` (or any name you prefer)
   - **Root Directory:** `packages/ui` ⚠️ **IMPORTANT!**
   - **Build Command:** 
     ```bash
     cd ../.. && pnpm tokens:build && cd packages/ui && pnpm storybook:build
     ```
   - **Output Directory:** `storybook-static`
   - **Install Command:** 
     ```bash
     cd ../.. && pnpm install --frozen-lockfile
     ```
   - **Framework Preset:** Other (or leave empty)

3. **Environment Variables** (Optional)
   - No environment variables needed for basic Storybook deployment
   - If you need custom configuration, you can add them here

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (~3-5 minutes)

### Option 2: Use vercel.json (Already Configured)

The `packages/ui/vercel.json` file is already configured. Vercel will automatically detect it if you deploy from the `packages/ui` directory.

## 📋 Build Process

The build process:
1. **Install dependencies** from root (monorepo)
2. **Build design tokens** (`pnpm tokens:build`)
3. **Build Storybook** (`pnpm storybook:build`)
4. **Deploy static files** from `storybook-static/`

## 🔗 Update Storybook URL

After deployment, update the Storybook URL in your portal:

1. **Get Storybook URL from Vercel**
   - Go to your Vercel project dashboard
   - Copy the deployment URL (e.g., `https://fragment-ui-storybook.vercel.app`)

2. **Update Portal Environment Variable**
   - Go to your Portal project in Vercel (`fragment-ui-www`)
   - Settings → Environment Variables
   - Update or add: `NEXT_PUBLIC_STORYBOOK_URL`
   - Value: `https://fragment-ui-storybook.vercel.app` (your Storybook URL)
   - Redeploy portal to apply changes

## 🔄 Automatic Deployments

Vercel automatically deploys when you push to:
- `main` branch → Production deployment
- Other branches → Preview deployments

### Branch Configuration (Optional)

You can configure which branches trigger deployments:
- **Production Branch:** `main`
- **Preview Branches:** All other branches

## 📝 Manual Deployment

If you need to manually trigger a deployment:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from packages/ui directory
cd packages/ui
vercel --prod
```

## 🐛 Troubleshooting

### Build Fails: "Cannot find module '@fragment_ui/tokens'"

**Solution:** Make sure Build Command includes token build:
```bash
cd ../.. && pnpm tokens:build && cd packages/ui && pnpm storybook:build
```

### Build Fails: "pnpm: command not found"

**Solution:** Vercel should auto-detect pnpm from `packageManager` in root `package.json`. If not, specify in Vercel settings:
- **Node.js Version:** 20.x
- **Package Manager:** pnpm

### Build Fails: "Cannot resolve '@storybook/react'"

**Solution:** This may be a monorepo hoisting issue. Try:
1. Ensure `*storybook*` is in `pnpm.publicHoistPattern` in root `package.json` ✅ (already configured)
2. Reinstall dependencies: `pnpm install --force` (if needed)
3. Vercel should handle this automatically with clean environment

### Storybook Build Output Not Found

**Solution:** Verify `outputDirectory` in Vercel settings:
- **Output Directory:** `storybook-static`

### 404 Errors After Deployment

**Solution:** Ensure `vercel.json` rewrites are configured (already done):
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Alternative: Use Chromatic (Already Configured)

If Vercel build fails, consider using **Chromatic** (already configured):
- ✅ Chromatic is already set up in `.github/workflows/chromatic.yml`
- ✅ Chromatic provides hosting and visual regression testing
- See [CHROMATIC_SETUP.md](./CHROMATIC_SETUP.md) for details

## 📚 Related Documentation

- [Vercel Documentation](https://vercel.com/docs)
- [Storybook Build Documentation](https://storybook.js.org/docs/react/sharing/publish-storybook)
- [Portal Setup](../VERCEL_SETUP.md)

## ✅ Verification

After deployment, verify:
1. ✅ Storybook loads at Vercel URL
2. ✅ All stories are visible
3. ✅ Components render correctly
4. ✅ Interactive controls work
5. ✅ A11y addon functions properly
6. ✅ Portal links to Storybook work (after updating env var)

## 🔗 Links

- **Storybook:** https://fragment-ui-storybook.vercel.app (your URL)
- **Portal:** https://fragment-ui-www.vercel.app (your portal URL)
- **GitHub:** https://github.com/blazejrzepa/fragment-ui

