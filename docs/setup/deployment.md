# 🚀 Deployment Guide - fragmentui.com

## 📋 Repository Strategy (Final)

### 1. `fragment-ui` (PRIVATE - main repo)
- **Status**: PRIVATE 🔒
- **Location**: `/Users/blazejrzepa/Dev/fragment-ui`
- **Contents**: Full monorepo with Studio/Playground/telemetry
- **Purpose**: Main workspace for daily work

### 2. `fragment-ui-public` (PUBLIC - official)
- **Status**: PUBLIC 🌐
- **Location**: `/Users/blazejrzepa/Dev/fragment-ui-public`
- **GitHub**: https://github.com/blazejrzepa/fragment-ui-public
- **Domain**: fragmentui.com
- **Contents**: Clean design system + documentation
- **Purpose**: Official site and npm publication

## 🔧 Vercel Configuration for fragmentui.com

### Step 1: Connect Repository to Vercel

1. Go to: https://vercel.com/new
2. Import `fragment-ui-public` from GitHub
3. Set:
   - **Framework Preset**: Next.js
   - **Root Directory**: `apps/www`
   - **Build Command**: `cd ../.. && pnpm install && pnpm tokens:build && pnpm registry:generate && pnpm -F @fragment_ui/ui build && pnpm -F @fragment_ui/blocks build && cd apps/www && pnpm build`
   - **Output Directory**: `.next`
   - **Install Command**: `pnpm install`

### Step 2: Configure Domain

1. In Vercel Dashboard → Project Settings → Domains
2. Add domain: `fragmentui.com`
3. Add subdomains:
   - `www.fragmentui.com` (redirect to fragmentui.com)
4. Configure DNS:
   - Add DNS records according to Vercel instructions
   - Usually: CNAME for `www` and A record for root domain

### Step 3: Environment Variables (if needed)

In Vercel Dashboard → Settings → Environment Variables:
- Add variables if needed (e.g., for API routes)

### Step 4: Update Configuration

Update `apps/www/vercel.json`:

```json
{
  "buildCommand": "cd ../.. && pnpm install && pnpm tokens:build && pnpm registry:generate && pnpm -F @fragment_ui/ui build && pnpm -F @fragment_ui/blocks build && cd apps/www && pnpm build",
  "outputDirectory": ".next",
  "installCommand": "pnpm install",
  "framework": "nextjs",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/"
    }
  ]
}
```

## 🔄 Update Domain References

### Files to Update:

1. **package.json** (all packages):
   - `homepage`: `https://fragmentui.com`
   - `repository.url`: GitHub URL

2. **README.md**:
   - All links to `fragmentui.com`

3. **apps/www**:
   - Next.js configuration (if needed)
   - Metadata in layout.tsx

4. **CLI** (`packages/cli`):
   - All references to registry URL

## 📝 Pre-Deployment Checklist

### Before First Deployment:

- [ ] Update all references from `fragment-ui.dev` → `fragmentui.com`
- [ ] Check if `vercel.json` has correct build command
- [ ] Remove telemetry references (if in build command)
- [ ] Check if all dependencies are available
- [ ] Test build locally: `pnpm build`
- [ ] Check if documentation renders correctly

### After Deployment:

- [ ] Check if site loads: https://fragmentui.com
- [ ] Check if all links work
- [ ] Check if components display correctly
- [ ] Check if registry works: https://fragmentui.com/r/button.json
- [ ] Check if documentation is available
- [ ] Check SEO (meta tags, sitemap)

## 🔗 DNS Configuration

### For fragmentui.com:

1. **A Record** (root domain):
   - Name: `@`
   - Value: IP from Vercel (or use CNAME if provider supports it)

2. **CNAME Record** (www):
   - Name: `www`
   - Value: `cname.vercel-dns.com` (or what Vercel provides)

3. **Wait for DNS propagation** (usually 24-48h)

## 🚀 Automatic Deployment

After connecting to GitHub, Vercel automatically:
- ✅ Deploys on every push to `main`
- ✅ Creates preview deployments for PRs
- ✅ Shows status in GitHub

## 📊 Monitoring

After deployment:

1. **Vercel Analytics** (optional):
   - Enable in Vercel Dashboard
   - Track performance and errors

2. **Google Analytics** (optional):
   - Add tracking code to `apps/www/app/layout.tsx`

3. **Error Tracking** (optional):
   - Sentry, LogRocket, etc.

## 🔄 Deployment Workflow

1. **Work in `fragment-ui`** (private)
2. **Sync to `fragment-ui-public`** (public)
3. **Push to GitHub** → automatic deploy to Vercel
4. **Site updates automatically** on fragmentui.com

## 🐛 Troubleshooting

### Build Fails:
- Check logs in Vercel Dashboard
- Check if all dependencies are available
- Check if build command is correct

### DNS Doesn't Work:
- Check DNS configuration in domain panel
- Check DNS propagation: https://dnschecker.org
- Check if domain is verified in Vercel

### Site Doesn't Load:
- Check if build succeeded
- Check logs in Vercel Dashboard
- Check if all assets are available

## 📚 Useful Links

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Vercel Docs**: https://vercel.com/docs
- **Next.js Deployment**: https://nextjs.org/docs/deployment
