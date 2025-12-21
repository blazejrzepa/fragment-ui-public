# 🚀 Code Connect - Final Setup Guide

Complete guide on how to set up Code Connect step by step.

## ✅ What We Have Ready:

- ✅ File `figma-code-connect/button.ts` with correct mapping
- ✅ Figma URL: `https://www.figma.com/design/dccfbPgHqbWW7K687i9Fv3/...`
- ✅ Node ID: `1304-13481`
- ✅ Variant mapping: `solid`, `outline`, `ghost`, `sm`, `leading`, `trailing`

---

## 🎯 Step 1: Make sure files are in GitHub repo

### 1.1. Check status:

```bash
cd /Users/blazejrzepa/Dev/fragment-ui
git status figma-code-connect/button.ts
```

### 1.2. Commit and push:

```bash
# Add files
git add figma-code-connect/button.ts package.json

# Commit
git commit -m "Add Figma Code Connect mapping for Button"

# Push (if you're on release/v1.4.0, you can first merge to main)
git push origin release/v1.4.0

# Or if you want in main:
git checkout main
git merge release/v1.4.0
git push origin main
```

### 1.3. Check on GitHub:

Open in browser:
```
https://github.com/blazejrzepa/fragment-ui/blob/main/figma-code-connect/button.ts
```

Make sure the file is visible!

---

## 🎯 Step 2: Install Code Connect Plugin in Figma

### 2.1. Open Figma

1. Open Figma application (desktop or web)
2. Open file: `Fragment UI Design System`

### 2.2. Install Plugin

1. **Click menu** (3 lines in top left corner) or **"Plugins"** icon (puzzle piece)
2. Select **"Plugins"** → **"Browse plugins"** or **"Find plugins"**
3. Search for: **"Code Connect"** (official plugin from Figma)
4. Click **"Install"**

**If you can't find the plugin:**
- May be available only in Dev Mode
- May be built into Figma (doesn't require installation)
- Check menu: **"Plugins"** → **"Code Connect"** (may already be available)

---

## 🎯 Step 3: Connect Plugin to GitHub

### 3.1. Open Code Connect Plugin

**Method A: Through menu:**
- Menu → **"Plugins"** → **"Code Connect"**

**Method B: Through Dev Mode:**
- Enable **Dev Mode** (toggle in top right corner)
- Right-click on Button → **"Plugins"** → **"Code Connect"**

**Method C: Through shortcut:**
- `Ctrl+/` (Windows/Linux) or `Cmd+/` (Mac)
- Type "Code Connect"

### 3.2. Connect to GitHub

1. In plugin window you should see option **"Connect to GitHub"** or **"Connect repository"**
2. Click on it
3. Log in to GitHub and authorize access
4. Select repository: `blazejrzepa/fragment-ui`
5. Plugin will automatically start scanning repo

---

## 🎯 Step 4: Verification

### 4.1. Check if plugin sees files

In Code Connect plugin window you should see:
- List of found Code Connect files
- Information about connected components

### 4.2. Check Button connection

1. Right-click on **Button** component in Figma
2. Select **"Plugins"** → **"Code Connect"**
3. You should see:
   - ✅ Connection to `packages/ui/src/button.tsx`
   - ✅ Variant mapping
   - ✅ Usage example

---

## ❌ If Plugin Is Not Available

### Alternative 1: GitHub Integration in Figma

1. In Figma: **Settings** → **Integrations** → **GitHub**
2. Connect with GitHub
3. Select repo: `blazejrzepa/fragment-ui`
4. Figma may automatically detect Code Connect files

### Alternative 2: Manual Dev Resources

1. In Dev Mode, click on Button
2. In **"Dev Resources"** section add link:
   ```
   https://github.com/blazejrzepa/fragment-ui/blob/main/packages/ui/src/button.tsx
   ```

### Alternative 3: MCP Server

1. In **"MCP server"** section in Dev Mode
2. Add link to code in prompt:
   ```
   Code: https://github.com/blazejrzepa/fragment-ui/blob/main/packages/ui/src/button.tsx
   ```

---

## 🔍 Troubleshooting

### Problem: Plugin doesn't see files

**Solution:**
- Make sure files are in repo (commit + push)
- Check if repo is public or you have access
- Check if you're on correct branch (main/master)

### Problem: "Component not found"

**Solution:**
- Check if `figmaComponentName: "Button"` exactly matches name in Figma
- Check if Node ID is correct (`1304-13481`)

### Problem: "No connection found"

**Solution:**
- Refresh plugin (close and reopen)
- Check if plugin is connected to correct repo
- Check if token has appropriate permissions

---

## ✅ Checklist

- [ ] Files are in GitHub repo (commit + push)
- [ ] Code Connect Plugin is installed
- [ ] Plugin is connected to GitHub
- [ ] Repo is selected in plugin
- [ ] Plugin sees files from `figma-code-connect/`
- [ ] Connection works for Button

---

## 📝 What's Next?

After successful Button connection:

1. **Add more components** (Input, Select, etc.)
2. **Update variants** when you add new ones
3. **Use Code Connect** to synchronize design ↔ code

---

*Let me know which step doesn't work, and I'll help solve the problem!* 🆘
