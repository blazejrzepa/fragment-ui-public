# Deployment

**Purpose:** Deploy Fragment UI applications to production  
**Audience:** DevOps, engineers deploying applications  
**When to read:** Before deploying or setting up CI/CD

---

## Overview

Fragment UI applications are deployed to **Vercel** using Next.js deployment.

---

## Deployment Architecture

### Applications

1. **Design System Portal** (`apps/www`)
   - **URL:** https://fragment-ui.dev (TODO: verify)
   - **Framework:** Next.js 15
   - **Deployment:** Vercel

2. **Studio Application** (`apps/demo`)
   - **URL:** https://studio.fragment-ui.dev (TODO: verify)
   - **Framework:** Next.js 15
   - **Deployment:** Vercel

3. **Storybook** (`packages/ui`)
   - **URL:** https://storybook.fragment-ui.dev (TODO: verify)
   - **Framework:** Storybook
   - **Deployment:** Static hosting

### Registry

- **URL Pattern:** `https://fragment-ui.dev/r/{component}.json`
- **Storage:** Static JSON files
- **CDN:** Vercel CDN (automatic)

---

## Deployment Process

### Automatic Deployment (CI/CD)

Deployment is automatic via GitHub Actions and Vercel:

1. **Push to `main` branch**
2. **GitHub Actions:** Run tests, lint, build
3. **Vercel:** Deploy on successful build
4. **Preview:** Preview deployments for PRs

### Manual Deployment

```bash
# Build all packages
pnpm build

# Deploy to Vercel (if Vercel CLI installed)
vercel --prod
```

---

## Environment Variables

### Required Variables

| Variable | Purpose | Where |
|----------|---------|-------|
| `OPENAI_API_KEY` | OpenAI API for Studio | Studio app |
| `POSTHOG_KEY` | PostHog analytics | Studio app |
| `POSTHOG_HOST` | PostHog host | Studio app |
| `NODE_ENV` | Environment | All apps |

### Setting Variables

1. **Vercel Dashboard:** Project Settings → Environment Variables
2. **CLI:** `vercel env add VARIABLE_NAME`

---

## Build Configuration

### Next.js Configuration

Each app has `next.config.mjs`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration
}
```

### Turborepo Configuration

`turbo.json` defines build tasks:

```json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"]
    }
  }
}
```

---

## Deployment Checklist

- [ ] All tests passing
- [ ] Linting passes
- [ ] Build succeeds locally
- [ ] Environment variables set
- [ ] Registry JSON files up to date
- [ ] Changelog updated
- [ ] Version bumped (if release)

---

## Rollback Procedure

### Vercel Rollback

1. **Vercel Dashboard:** Deployments → Select previous deployment → Promote to Production
2. **CLI:** `vercel rollback`

### Registry Rollback

Registry JSON files are in Git, so rollback via:
```bash
git revert <commit>
git push
```

---

## Monitoring

After deployment, monitor:

- **Vercel Dashboard:** Deployment status, logs
- **Application Logs:** Check for errors
- **Analytics:** PostHog dashboard
- **Uptime:** Vercel status page

---

## Gotchas

- **Build Order:** Some packages must be built before others
- **Environment Variables:** Must be set in Vercel dashboard
- **Registry Updates:** Changes require Git commit and push
- **Preview Deployments:** PRs get automatic preview deployments

---

## Next Steps

- [Release Process](./release-process.md) - Release workflow
- [Monitoring](./monitoring.md) - Logging and metrics
- [Troubleshooting](./troubleshooting.md) - Common issues

---

**Last Updated:** 2025-01-XX
