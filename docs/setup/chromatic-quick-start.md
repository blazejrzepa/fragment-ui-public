# 🎨 Chromatic - Quick Start Guide

## ✅ Status

- ✅ Workflow configured: `.github/workflows/chromatic.yml`
- ✅ Token available: `chpt_a9a800ba2c497a7`
- ⏳ Check if token is added to GitHub Secrets

## 🚀 Quick Setup (2 minutes)

### Step 1: Verify GitHub Secret

1. Go to: https://github.com/blazejrzepa/fragment-ui/settings/secrets/actions
2. Check if `CHROMATIC_PROJECT_TOKEN` exists
3. If not, add it:
   - Click "New repository secret"
   - Name: `CHROMATIC_PROJECT_TOKEN`
   - Value: `chpt_a9a800ba2c497a7`
   - Click "Add secret"

### Step 2: Trigger Chromatic Build

**Option A: Push a commit (automatic)**
```bash
git commit --allow-empty -m "trigger: Chromatic build"
git push origin main
```

**Option B: Check existing builds**
- Go to: https://github.com/blazejrzepa/fragment-ui/actions
- Look for "Chromatic" workflow runs

### Step 3: Get Storybook URL

After successful build:
1. Open Chromatic workflow in GitHub Actions
2. Click "View storybook" or similar link
3. Copy the Storybook URL (looks like: `https://xxxxx.chromatic.com`)

### Step 4: Update Portal

1. Go to Vercel Dashboard: https://vercel.com/dashboard
2. Select project: `fragment-ui-www` (or your portal project)
3. Go to: **Settings** → **Environment Variables**
4. Add/Update:
   - **Name:** `NEXT_PUBLIC_STORYBOOK_URL`
   - **Value:** `https://xxxxx.chromatic.com` (your Chromatic URL)
5. **Redeploy** the portal to apply changes

## 🎯 Benefits of Chromatic

✅ **Automatic hosting** - Storybook hosted on Chromatic CDN  
✅ **Visual regression testing** - Automatic visual diffs  
✅ **Review UI** - Easy PR reviews with visual changes  
✅ **History** - Track component changes over time  
✅ **Free for open source** - No cost for public repos  
✅ **Works in monorepo** - Better than Vercel for Storybook

## 🔍 Verify Everything Works

1. ✅ Chromatic workflow runs successfully
2. ✅ Storybook URL is accessible
3. ✅ Portal links to Storybook work (check component pages)
4. ✅ Visual regression tests run automatically

## 📚 Resources

- **Chromatic Dashboard:** https://www.chromatic.com/builds
- **GitHub Actions:** https://github.com/blazejrzepa/fragment-ui/actions
- **Documentation:** See `CHROMATIC_SETUP.md` for details

