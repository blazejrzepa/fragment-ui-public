# 🔄 Migrating Domain from fragment-ui to fragment-ui-public in Vercel

## 📋 Situation

You already have:
- ✅ Domain `fragmentui.com` configured in Vercel
- ✅ Connected to project `fragment-ui` (old)
- ❌ You want to move it to project `fragment-ui-public` (new)

## 🚀 Solution: Move Domain to New Project

### STEP 1: Add New Project `fragment-ui-public` to Vercel

1. **Open Vercel Dashboard**: https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**
4. Find and select: **`blazejrzepa/fragment-ui-public`**
5. **Configure project:**
   - **Framework Preset**: Next.js (automatic)
   - **Root Directory**: `apps/www` (IMPORTANT! Click "Edit" and change)
   - **Build Command**: (leave empty - we'll use from vercel.json)
   - **Output Directory**: `.next` (automatic)
   - **Install Command**: `pnpm install` (or leave empty)
6. Click **"Deploy"**
7. Wait for build to complete (2-5 minutes)

**✅ Now you have two projects in Vercel:**
- `fragment-ui` (old)
- `fragment-ui-public` (new)

---

### STEP 2: Move Domain to New Project

#### Option A: Transfer Domain (Recommended)

1. **Open project `fragment-ui-public`** in Vercel Dashboard
2. Go to **Settings** → **Domains**
3. In "Add Domain" field, type: `fragmentui.com`
4. Click **"Add"**
5. Vercel will detect that the domain is already used in another project
6. Option will appear: **"Transfer from another project"** or **"Move domain"**
7. Select project `fragment-ui` from the list
8. Click **"Transfer"** or **"Move"**
9. Confirm the transfer

**✅ Domain is now assigned to `fragment-ui-public`**

#### Option B: Remove from Old, Add to New (Alternative)

If Option A doesn't work:

1. **Open project `fragment-ui`** (old)
2. Go to **Settings** → **Domains**
3. Find `fragmentui.com` in the list
4. Click **"Remove"** next to the domain
5. Confirm removal
6. **Open project `fragment-ui-public`** (new)
7. Go to **Settings** → **Domains**
8. In "Add Domain" field, type: `fragmentui.com`
9. Click **"Add"**
10. Vercel will show DNS instructions (but they should already be configured)
11. Click **"Refresh"** - domain should verify automatically

**✅ Domain is now assigned to `fragment-ui-public`**

---

### STEP 3: Verify

1. **Check in new project:**
   - Open `fragment-ui-public` → Settings → Domains
   - Check if `fragmentui.com` is in the list
   - Status should be: **"Valid Configuration"** ✅

2. **Check if site works:**
   - Open: https://fragmentui.com
   - Check if new version loads (from `fragment-ui-public`)
   - Check if all links work

3. **Check deployment:**
   - In project `fragment-ui-public` → Deployments
   - Check if latest deployment is active
   - Check if domain points to this deployment

---

### STEP 4: (Optional) Delete Old Project

If you no longer need project `fragment-ui` in Vercel:

1. **Open project `fragment-ui`** in Vercel Dashboard
2. Go to **Settings** → **General**
3. Scroll down to **"Danger Zone"** section
4. Click **"Delete Project"**
5. Type project name: `fragment-ui`
6. Click **"Delete"**
7. Confirm deletion

**⚠️ WARNING:** This will only delete the project from Vercel, it will NOT delete the repository from GitHub!

---

## 🔍 Troubleshooting

### Problem: Vercel Won't Allow Domain Transfer

**Solution:**
- Use Option B (remove from old, add to new)
- DNS is already configured, so domain should verify automatically

### Problem: Domain Doesn't Work After Transfer

**Solution:**
1. Check if domain is assigned to correct project
2. Check if deployment succeeded
3. Check if DNS is correctly configured
4. Wait a few minutes for propagation

### Problem: Site Shows Old Version

**Solution:**
1. Check browser cache (Ctrl+Shift+R or Cmd+Shift+R)
2. Check if deployment in new project succeeded
3. Check if domain points to correct deployment

---

## ✅ Checklist

After moving domain:

- [ ] Project `fragment-ui-public` is added to Vercel
- [ ] Domain `fragmentui.com` is assigned to `fragment-ui-public`
- [ ] Domain status: "Valid Configuration"
- [ ] https://fragmentui.com loads correctly
- [ ] All links work
- [ ] Registry works: https://fragmentui.com/r/button.json
- [ ] (Optional) Old project `fragment-ui` deleted from Vercel

---

## 🎉 Done!

Now:
- ✅ `fragmentui.com` points to project `fragment-ui-public`
- ✅ Every push to `fragment-ui-public` automatically deploys to fragmentui.com
- ✅ Old project `fragment-ui` can be deleted (optional)

---

**Good luck! 🚀**
