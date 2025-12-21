# Chromatic Setup Guide

## Overview

Chromatic is configured for visual regression testing but is **optional**. The CI workflow will skip Chromatic if the project token is not configured.

## Current Status

✅ **Workflow configured** - `.github/workflows/chromatic.yml`  
✅ **Token received** - Ready to be added to GitHub Secrets  
⚠️ **Action required** - Add token to repository secrets to enable CI

## Setup Instructions

### 1. Create Chromatic Account & Project

1. Go to [https://www.chromatic.com/start](https://www.chromatic.com/start)
2. Sign in with GitHub
3. Create a new project
4. Select "Storybook" as the integration type

### 2. Get Project Token

1. After creating the project, go to the "Manage" screen
2. Find your **Project Token** (looks like: `chpt_xxxxxxxxxxxxxxxxxx`)
3. Copy the token

**Your token:** `chpt_a9a800ba2c497a7` ✅

### 3. Add Token to GitHub Secrets

1. Go to your repository on GitHub
2. Navigate to: **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `CHROMATIC_PROJECT_TOKEN`
5. Value: Paste your project token
6. Click **Add secret**

### 4. Verify Setup

After adding the token:
- Push a new commit or open a PR
- Chromatic workflow should now run automatically
- Check the "Chromatic" workflow run in GitHub Actions

## Local Testing

You can test Chromatic locally before setting up CI:

```bash
# Install Chromatic CLI
pnpm add -D chromatic

# Run Chromatic (replace with your token)
npx chromatic --project-token=YOUR_TOKEN_HERE
```

## Disabling Chromatic

If you don't want to use Chromatic:
- The workflow will automatically skip if token is not set
- No action needed - CI will still pass

## Troubleshooting

### Workflow Skipped
- ✅ **Expected** if `CHROMATIC_PROJECT_TOKEN` is not set
- This is intentional and CI will still pass

### Token Invalid
- Double-check the token in Chromatic dashboard
- Ensure it's copied correctly (no extra spaces)
- Regenerate token if needed

### Build Failures
- Check that Storybook builds successfully: `pnpm -C packages/ui storybook:build`
- Verify `workingDir: packages/ui` matches your structure
- Check Chromatic logs in GitHub Actions

## Resources

- [Chromatic Documentation](https://www.chromatic.com/docs/setup)
- [Chromatic GitHub Action](https://github.com/chromaui/chromatic-action)
- [Visual Testing Guide](https://www.chromatic.com/docs/visual-testing)

