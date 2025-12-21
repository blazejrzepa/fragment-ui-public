# 🔗 Connecting Button with Figma - Step by Step

## Step 1: Getting Figma URL and Node ID

### 1.1. Getting file URL

1. Open your file in Figma
2. Click **"Share"** button (top right corner)
3. Copy URL - should look like:
   ```
   https://www.figma.com/file/XXXXXXXXXXXXXXX/Fragment-UI-Design-System
   ```

### 1.2. Getting Node ID for Button

**Method 1: From Properties Panel**
1. Click on Button component in Figma
2. In right panel Properties find section with component information
3. Right-click on component → **"Copy link"**
4. Link contains `node-id=XXXX` in URL

**Method 2: From URL**
1. Right-click on Button → **"Copy link"**
2. Copied link looks like:
   ```
   https://www.figma.com/file/XXXXXXXXXXXXXXX/Fragment-UI-Design-System?node-id=XXXX-XXXXX
   ```
3. Copy entire part `?node-id=XXXX-XXXXX`

---

## Step 2: Verifying component name and variants

### 2.1. Check component name

1. Click on Button in Figma
2. In left panel Layers check exact name
3. Should be: **"Button"** (no spaces, no additional characters)

**Important:** Name in Figma must exactly match `figmaComponentName` in code!

### 2.2. Check variant names

1. Click on Button → in right panel you'll see **"Variants"** section
2. Check exact variant names:
   - **variant:** `Solid`, `Outline`, `Ghost` (or as you named)
   - **size:** `Small`, `Medium`, `Large` (or `sm`, `md`, `lg`)
   - **state:** `Default`, `Disabled`, `Loading` (or as you named)

**Important:** Variant names in Figma must exactly match keys in `variants` in code!

---

## Step 3: Updating button.ts

Now update file `figma-code-connect/button.ts`:

1. Provide me:
   - URL to Figma file (e.g. `https://www.figma.com/file/XXXXX/...`)
   - Node ID for Button (e.g. `XXXX-XXXXX` from link)
   - Exact variant names in Figma

2. Or update file `figma-code-connect/button.ts` yourself:

```typescript
figmaNode: "https://www.figma.com/file/YOUR_FILE_ID/Fragment-UI-Design-System?node-id=YOUR_NODE_ID",
```

---

## Step 4: Generating Code Connect

After updating `button.ts`:

```bash
cd /Users/blazejrzepa/Dev/fragment-ui
npx @figma/code-connect generate
```

This will create `code-connect.json` file.

---

## Step 5: Validation

```bash
npx @figma/code-connect validate
```

Checks if mapping is correct.

---

## Step 6: Push to Figma (optional)

If you want to connect immediately:

1. Create Figma Personal Access Token:
   - Figma → Settings → Account → Personal Access Tokens
   - Generate new token
   - Copy token

2. Push:
```bash
export FIGMA_ACCESS_TOKEN="your-token-here"
npx @figma/code-connect push
```

---

## Step 7: Verification in Figma

1. Install **"Code Connect"** plugin in Figma
2. Open plugin → Connect Repository
3. Select GitHub → authorize → select `fragment-ui`
4. Click on Button → you should see link to code

---

## I need from you:

1. **URL to Figma file** (Share → Copy link)
2. **Node ID for Button** (from Copy link on component)
3. **Exact variant names** (as they are in Figma)

I can then update `button.ts` automatically! 🚀
