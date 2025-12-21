# 🔄 Alternative Code Connect Publishing Method

The `@figma/code-connect` CLI has limited support for React/TypeScript. **The recommended method is to use the Figma Code Connect Plugin directly in Figma**.

## ✅ Method 1: Figma Code Connect Plugin (RECOMMENDED)

### Step 1: Repository Preparation

1. **Make sure the repo is on GitHub:**
   ```bash
   git remote -v
   ```
   If there's no GitHub, add it:
   ```bash
   git remote add origin https://github.com/username/fragment-ui.git
   git push -u origin main
   ```

2. **Make sure files are in the repo:**
   ```bash
   git add figma-code-connect/button.ts
   git commit -m "Add Figma Code Connect mapping for Button"
   git push
   ```

### Step 2: Plugin Installation in Figma

1. Open Figma
2. Click the menu (hamburger icon) in the top left corner
3. Select **"Plugins"** → **"Browse plugins"**
4. Search for **"Code Connect"**
5. Click **"Install"**

### Step 3: Connect to GitHub

1. In Figma, open the Code Connect plugin:
   - Right-click on component → **"Plugins"** → **"Code Connect"**
   - Or use menu: **"Plugins"** → **"Code Connect"**

2. Click **"Connect to GitHub"** or **"Connect repository"**

3. Log in to GitHub and authorize access

4. Select repository: `username/fragment-ui` (or appropriate)

5. Plugin will automatically detect files from `figma-code-connect/`

### Step 4: Verification

1. Right-click on **Button** component in Figma
2. Select **"Plugins"** → **"Code Connect"**
3. You should see:
   - ✅ Connection to code
   - ✅ Variant mapping
   - ✅ Usage example

---

## ⚠️ Method 2: CLI (If Plugin doesn't work)

If the plugin doesn't work, you can try using CLI with token, but it may require additional configuration.

### Preparation

1. **Set token:**
   ```bash
   export FIGMA_TOKEN='your-token'
   ```

2. **Check if files are visible:**
   ```bash
   npx @figma/code-connect connect parse --dir figma-code-connect
   ```

3. **If it sees files, publish:**
   ```bash
   npx @figma/code-connect connect publish --dir figma-code-connect --token $FIGMA_TOKEN
   ```

---

## 🔍 Troubleshooting

### Problem: Plugin doesn't see files

**Solution:**
- Make sure the repo is public or you have access
- Check if files are in the main branch (main/master)
- Make sure the path is `figma-code-connect/button.ts`

### Problem: "Component not found"

**Solution:**
- Check if `figmaComponentName: "Button"` exactly matches the name in Figma
- Check if Node ID is correct

### Problem: "No connection found"

**Solution:**
- Make sure `button.ts` file is in the repo
- Check if plugin is connected to the correct repo
- Try refreshing the plugin (Ctrl+R in Figma)

---

## 📝 Recommendations

**For the best experience:**
1. ✅ Use Code Connect Plugin (Method 1)
2. ✅ Keep files in GitHub repo
3. ✅ Regularly commit and push changes
4. ✅ Use plugin in Figma for verification

---

*Plugin automatically synchronizes changes from repo, so you don't need to manually publish!* 🎉
