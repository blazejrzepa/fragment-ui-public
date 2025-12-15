# 🚀 Step-by-Step: Setup fragmentui.com

## 📋 Overview

1. ✅ Change `fragment-ui` to PRIVATE
2. ✅ Connect `fragment-ui-public` to Vercel
3. ✅ Configure domain fragmentui.com
4. ✅ Test deployment
5. ✅ Verify everything works

---

## STEP 1: Change `fragment-ui` to PRIVATE

### 1.1 Open Repository on GitHub

1. Go to: https://github.com/blazejrzepa/fragment-ui
2. Click **Settings** (in top menu of repository)

### 1.2 Change Visibility to PRIVATE

1. In Settings, scroll down to **"Danger Zone"** section
2. Click **"Change visibility"**
3. Select **"Change to private"**
4. Type repository name: `blazejrzepa/fragment-ui`
5. Click **"I understand, change repository visibility"**
6. Confirm change

### 1.3 Verify

- Check if repo is now PRIVATE (lock icon next to name)

**✅ STEP 1 COMPLETE**

---

## STEP 2: Connect `fragment-ui-public` to Vercel

### 2.1 Log in to Vercel

1. Go to: https://vercel.com
2. Log in (use GitHub account - recommended)
3. If you don't have an account, create one (free)

### 2.2 Import Repository

1. In Vercel Dashboard, click **"Add New..."** → **"Project"**
2. Click **"Import Git Repository"**
3. Find and select: **`blazejrzepa/fragment-ui-public`**
4. If you don't see repo, click **"Adjust GitHub App Permissions"** and allow access

### 2.3 Configure Project

After selecting repository, Vercel will show configuration:

**Framework Preset:**
- Select: **Next.js** (should be automatically detected)

**Root Directory:**
- Click **"Edit"** next to "Root Directory"
- Change to: `apps/www`
- Click **"Continue"**

**Build and Output Settings:**
- **Build Command:** (leave empty - we'll use from vercel.json)
- **Output Directory:** `.next` (should be automatic)
- **Install Command:** `pnpm install` (or leave empty)

**Environment Variables:**
- Leave empty for now (we'll add later if needed)

### 2.4 Deploy

1. Click **"Deploy"**
2. Wait for build to complete (2-5 minutes)
3. After completion, you'll see link: `https://fragment-ui-public-xxx.vercel.app`

**✅ STEP 2 COMPLETE**

---

## STEP 3: Configure Domain fragmentui.com

### 3.1 Add Domain in Vercel

1. In Vercel Dashboard, open project `fragment-ui-public`
2. Go to **"Settings"** tab
3. Click **"Domains"** in left menu
4. In "Add Domain" field, type: `fragmentui.com`
5. Click **"Add"**

### 3.2 Configure DNS

Vercel will show DNS configuration instructions. You have two options:

#### Option A: Root Domain (fragmentui.com)

**If your DNS provider supports ANAME/ALIAS:**
- Add record: `ANAME` or `ALIAS`
- Name: `@` (or empty)
- Value: `cname.vercel-dns.com`

**If it does NOT support ANAME/ALIAS:**
- Add record: `A`
- Name: `@` (or empty)
- Value: IP from Vercel (Vercel will show IP to use)

#### Option B: CNAME for www (www.fragmentui.com)

- Add record: `CNAME`
- Name: `www`
- Value: `cname.vercel-dns.com`

### 3.3 Where to Configure DNS?

**If you have domain on:**
- **Cloudflare**: Dashboard → DNS → Records
- **Namecheap**: Domain List → Manage → Advanced DNS
- **GoDaddy**: My Products → DNS → Records
- **Google Domains**: DNS → Custom records

### 3.4 Add DNS Records

1. Log in to your DNS provider's panel
2. Find "DNS Records" or "DNS Management" section
3. Add records according to Vercel instructions:
   - For root domain: A record or ANAME
   - For www: CNAME record
4. Save changes

### 3.5 Verify in Vercel

1. Return to Vercel → Settings → Domains
2. Click **"Refresh"** next to domain
3. Vercel will check DNS configuration
4. Status will change to **"Valid Configuration"** (may take a few minutes)

**⚠️ NOTE:** DNS propagation can take 24-48 hours, but usually works within a few minutes to an hour.

**✅ STEP 3 COMPLETE**

---

## STEP 4: Test Deployment

### 4.1 Check if Build Succeeded

1. In Vercel Dashboard → Project → **"Deployments"**
2. Check if latest deployment has status **"Ready"** (green)
3. If there's an error, click on deployment and check logs

### 4.2 Check Preview URL

1. Click on deployment
2. Click **"Visit"** (or use link `https://fragment-ui-public-xxx.vercel.app`)
3. Check if site loads

### 4.3 Check Domain (if DNS is ready)

1. Open: https://fragmentui.com
2. Check if site loads
3. Check if all links work

### 4.4 Check Registry

1. Open: https://fragmentui.com/r/button.json
2. Check if it returns JSON with component

**✅ STEP 4 COMPLETE**

---

## STEP 5: Verify Everything Works

### 5.1 Check Main Pages

- [ ] https://fragmentui.com - homepage
- [ ] https://fragmentui.com/docs - documentation
- [ ] https://fragmentui.com/components - component list
- [ ] https://fragmentui.com/r/button.json - registry

### 5.2 Check Components

- [ ] Components display correctly
- [ ] Code examples work
- [ ] Dark mode works
- [ ] Navigation works

### 5.3 Check npm Packages

- [ ] https://www.npmjs.com/package/@fragment_ui/ui
- [ ] https://www.npmjs.com/package/@fragment_ui/tokens
- [ ] https://www.npmjs.com/package/@fragment_ui/blocks
- [ ] https://www.npmjs.com/package/@fragment_ui/mcp-server

### 5.4 Check GitHub

- [ ] https://github.com/blazejrzepa/fragment-ui-public - PUBLIC ✅
- [ ] https://github.com/blazejrzepa/fragment-ui - PRIVATE ✅

**✅ STEP 5 COMPLETE**

---

## 🎉 Done!

Now you have:
- ✅ `fragment-ui` as PRIVATE (where you work)
- ✅ `fragment-ui-public` as PUBLIC (official repo)
- ✅ fragmentui.com works and is connected
- ✅ Automatic deployment on every push

---

## 🔄 What's Next?

### Automatic Deployment

From now on, every push to `main` in `fragment-ui-public` automatically:
1. Triggers build in Vercel
2. Deploys new version
3. Updates fragmentui.com

### Workflow

1. **Work in `fragment-ui`** (private)
2. **Sync to `fragment-ui-public`** (public)
3. **Push to GitHub** → automatic deploy
4. **Site updates automatically**

---

## 🐛 Troubleshooting

### Build Fails in Vercel

**Problem:** Build failed

**Solution:**
1. Check logs in Vercel Dashboard → Deployments → click on failed deployment
2. Check if all dependencies are available
3. Check if `vercel.json` has correct build command
4. Check if root directory is set to `apps/www`

### DNS Doesn't Work

**Problem:** fragmentui.com doesn't load

**Solution:**
1. Check DNS configuration in provider panel
2. Check DNS propagation: https://dnschecker.org
3. Check if domain is verified in Vercel
4. Wait for DNS propagation (can take up to 48h)

### Site Doesn't Load

**Problem:** Site returns error

**Solution:**
1. Check logs in Vercel Dashboard
2. Check if build succeeded
3. Check if all assets are available
4. Check if there are no errors in browser console

---

## 📞 Need Help?

If you encounter problems:
1. Check logs in Vercel Dashboard
2. Check Vercel documentation: https://vercel.com/docs
3. Check Next.js documentation: https://nextjs.org/docs

---

**Good luck! 🚀**
