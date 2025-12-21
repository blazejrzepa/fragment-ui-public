# 🔗 Figma Code Connect - Step by Step (Button)

This guide will walk you through the process of publishing the Button connection from Figma to code.

## ✅ What we already have ready:

- ✅ File `figma-code-connect/button.ts` with correct mapping
- ✅ Installed package `@figma/code-connect`
- ✅ Scripts in `package.json`

---

## 🚀 Step 1: Getting Figma Access Token

### 1.1. Open Figma Settings

1. Open Figma (desktop or web)
2. Click on your **avatar/icon** in top right corner
3. Select **"Settings"** from menu

### 1.2. Create Personal Access Token

1. In settings, go to **"Account"** tab
2. Scroll down to **"Personal Access Tokens"** section
3. Click **"Create a new personal access token"**
4. Provide name (e.g. "Fragment UI Code Connect")
5. Copy generated token (will be visible only once!)
6. **Save token in secure place** (notepad, password manager)

### 1.3. Set token in terminal

```bash
# In terminal, in project directory:
export FIGMA_TOKEN="your-token-here"
```

**Or permanently (for macOS/Linux):**
```bash
# Add to ~/.zshrc or ~/.bashrc
echo 'export FIGMA_TOKEN="your-token-here"' >> ~/.zshrc
source ~/.zshrc
```

---

## 🚀 Step 2: Publishing connection

### 2.1. Check if token is set

```bash
echo $FIGMA_TOKEN
```

If it shows token - it's OK! If empty - go back to Step 1.3.

### 2.2. Go to project directory

```bash
cd /Users/blazejrzepa/Dev/fragment-ui
```

### 2.3. Publish connection

```bash
pnpm figma:publish
```

**Or directly:**
```bash
npx @figma/code-connect connect publish --dir figma-code-connect --token $FIGMA_TOKEN
```

### 2.4. Check result

You should see something like:
```
✅ Successfully published 1 code connection(s)
```

---

## 🚀 Step 3: Verification in Figma

### 3.1. Open Code Connect plugin

1. Open Figma file: `Fragment UI Design System`
2. Right-click on **Button** component
3. Select **"Plugins"** → **"Code Connect"** (or use keyboard shortcut)

### 3.2. Check connection

1. In Code Connect plugin you should see:
   - ✅ Button component from your code
   - ✅ Variant mapping (solid, outline, ghost)
   - ✅ Usage example

2. Click on link to code - should open GitHub/repository

---

## 🚀 Step 4: Testing mapping

### 4.1. Switch variants in Figma

1. Select Button instance in Figma
2. In right panel Properties change variants:
   - `variant`: solid → outline → ghost
   - `size`: sm
   - `icons`: leading → trailing

3. In Code Connect plugin you should see how code changes!

---

## ❌ Troubleshooting

### Problem: "No token found"

**Solution:**
```bash
export FIGMA_TOKEN="your-token"
pnpm figma:publish
```

### Problem: "Permission denied"

**Solution:**
- Make sure you have access to Figma file
- Token must have permissions to read files

### Problem: "Component not found"

**Solution:**
- Check if component name in Figma is exactly **"Button"** (case-sensitive)
- Check if Node ID is correct (1304-13481)

### Problem: "Variants not mapping"

**Solution:**
- Check if variant names in Figma exactly match those in `button.ts`
- In Figma: `variant: solid, outline, ghost`
- In code: `"solid": { variant: "solid" }`

---

## 📝 What's next?

After successful Button connection:

1. **Add more components** (Input, Select, etc.)
2. **Update variants** when you add new ones in code/Figma
3. **Use Code Connect** to synchronize design ↔ code

---

## 🆘 Need help?

- Check logs: add `--verbose` to command
- Documentation: `docs/technical/figma-code-connect.md`
- Figma Docs: https://www.figma.com/developers/code-connect
