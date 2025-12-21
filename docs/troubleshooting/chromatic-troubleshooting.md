# 🔧 Chromatic Troubleshooting - Workflow #120

## Problem
Workflow #120 doesn't show Storybook URL in logs.

## Diagnosis

### Check workflow #120 logs:

1. **Open workflow run:**
   ```
   https://github.com/blazejrzepa/fragment-ui/actions/runs/[run-number-120]
   ```

2. **Check "Run Chromatic" step:**
   - Did it execute?
   - What is the status (✅ success / ❌ failed / ⏸️ skipped)?
   - What errors are in the logs?

### Most common causes:

#### 1. ❌ Missing token in GitHub Secrets

**Symptoms:**
- Chromatic action doesn't execute
- In logs: "Missing project token" or similar error

**Solution:**
1. Check Secrets: https://github.com/blazejrzepa/fragment-ui/settings/secrets/actions
2. If `CHROMATIC_PROJECT_TOKEN` is missing:
   - Log in to: https://www.chromatic.com
   - Settings → Project Token
   - Copy token (starts with `chpt_`)
   - Add to GitHub Secrets as `CHROMATIC_PROJECT_TOKEN`

#### 2. ❌ Storybook build failed

**Symptoms:**
- In logs: errors from `storybook:build`
- Build doesn't complete successfully

**Solution:**
- Check if it works locally: `cd packages/ui && pnpm storybook:build`
- If it works locally, problem may be in CI (dependencies, cache)

#### 3. ⚠️ Chromatic action skipped (continue-on-error)

**Symptoms:**
- Workflow passes (green status)
- But Chromatic step doesn't return URL

**Solution:**
- Workflow has `continue-on-error: true`, so errors don't stop workflow
- Check "Run Chromatic" step logs carefully

## ✅ Step-by-step solution

### Step 1: Check workflow #120

1. Open: https://github.com/blazejrzepa/fragment-ui/actions
2. Find workflow run #120
3. Click on it
4. Scroll to **"Run Chromatic"** step
5. Check:
   - ✅ Did it execute?
   - ❌ What errors are in logs?
   - 📋 Copy last 20-30 lines of logs

### Step 2: Check GitHub Secrets

1. Open: https://github.com/blazejrzepa/fragment-ui/settings/secrets/actions
2. Check if exists: `CHROMATIC_PROJECT_TOKEN`
3. If missing - add (see instructions above)

### Step 3: Run new test build

I've already run an empty commit to trigger a new build.

Check:
```
https://github.com/blazejrzepa/fragment-ui/actions
```

Latest workflow should start shortly.

### Step 4: Check new build logs

1. Open latest workflow run
2. Check "Run Chromatic" step
3. Look in logs for:
   ```
   ✓ Storybook published to https://xxxxx.chromatic.com
   ```
   or
   ```
   View your Storybook at: https://xxxxx.chromatic.com
   ```

## 🆘 If it still doesn't work

### Check locally:

```bash
# Test Storybook build
cd packages/ui
pnpm storybook:build

# If build works, check if Chromatic can be run locally
# (requires token)
npx chromatic --project-token=YOUR_TOKEN
```

### Check workflow configuration:

Workflow uses:
- `workingDir: packages/ui` ✅
- `buildScriptName: storybook:build` ✅
- `projectToken: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}` ✅

Everything looks correct.

### Possible pnpm lockfile issues:

If there are lockfile issues in CI:

```bash
# Update lockfile locally
pnpm install
git add pnpm-lock.yaml
git commit -m "chore: Update pnpm-lock.yaml"
git push origin main
```

## 📋 Checklist

Before checking new build:

- [ ] I checked workflow #120 logs
- [ ] I checked if token is in GitHub Secrets
- [ ] I checked if Storybook build works locally
- [ ] I ran new build (empty commit)
- [ ] I'm checking new build logs

## 🔗 Useful links

- Workflow: https://github.com/blazejrzepa/fragment-ui/actions/workflows/chromatic.yml
- Secrets: https://github.com/blazejrzepa/fragment-ui/settings/secrets/actions
- Chromatic Dashboard: https://www.chromatic.com
