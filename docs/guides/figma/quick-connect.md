# ⚡ Quick Connect Button with Code

## 📋 Step 1: Getting information from Figma

### 1.1. File URL

1. Open file in Figma
2. Click **"Share"** (top right corner) or **"Share"** in menu
3. Copy URL - looks like:
   ```
   https://www.figma.com/file/XXXXXXXXXXXXXXX/Fragment-UI-Design-System
   ```

### 1.2. Node ID for Button

**Method A: Copy Link (easiest)**
1. Right-click on Button component
2. Select **"Copy link"** or **"Copy/Paste" → "Copy link"**
3. Copied link looks like:
   ```
   https://www.figma.com/file/XXXXXXXXXXXXXXX/Fragment-UI-Design-System?node-id=1%3A1234
   ```
4. Copy entire link or just part `?node-id=1%3A1234`

**Method B: From Properties Panel**
1. Click on Button
2. In right panel Properties find component information
3. Node ID should be visible (may be in format `1:1234`)

### 1.3. Variant names

1. Click on Button in Figma
2. In right panel you'll see **"Variants"** or **"Component Properties"** section
3. Check exact names:

**Example:**
```
Variant:
  - Solid
  - Outline  
  - Ghost

Size:
  - Small
  - Medium
  - Large

State:
  - Default
  - Disabled
  - Loading
```

**Important:** Names in Figma must exactly match keys in code!

---

## 📋 Step 2: Checking component name

1. Click on Button in Figma
2. In left panel Layers check exact component name
3. Should be: **"Button"** (no additional characters, no spaces)

If name is different (e.g. "Button Primary"), update name in Figma or in code.

---

## 📋 Step 3: Providing information

When you have all information, provide me:

1. **File URL:** `https://www.figma.com/file/...`
2. **Button link:** `https://www.figma.com/file/...?node-id=...`
3. **Variant names:**
   - variant: `Solid`, `Outline`, `Ghost` (or as they are in Figma)
   - size: `Small`, `Medium`, `Large` (or as they are in Figma)
   - state: `Default`, `Disabled`, `Loading` (or as they are in Figma)

---

## 📋 Step 4: Automatic update

After receiving information:
1. ✅ I'll update `figma-code-connect/button.ts`
2. ✅ I'll verify variant mapping
3. ✅ I'll generate `code-connect.json`
4. ✅ We'll test the connection

---

## 💡 Tips

- **If you don't see variants:** Make sure you created Component (not just Frame)
- **If names don't match:** You can change names in Figma or adjust code
- **If you don't have Node ID:** Use "Copy link" method - it's the easiest

---

*Ready? Provide me with information, and I'll update the code!* 🚀
