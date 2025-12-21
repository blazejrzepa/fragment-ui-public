# 🎨 Figma Code Connect Plugin - Detailed Guide

## Step 2: Use Code Connect Plugin in Figma

### Step 2.1: Open file in Figma

1. **Open Figma** (desktop or web)
2. **Open file:** `Fragment UI Design System`
   - If you don't see the file, use link: `https://www.figma.com/design/dccfbPgHqbWW7K687i9Fv3/Fragment-UI-Design-System`
3. **Go to components page:**
   - In left panel (Layers) find `Components` page or page where Button is
   - Click on it

---

### Step 2.2: Install Code Connect Plugin (if you don't have it yet)

1. **Open plugins menu:**
   - Click on **"Plugins"** icon in top bar (puzzle piece icon)
   - Or use shortcut: `Ctrl+/` (Windows/Linux) or `Cmd+/` (Mac)

2. **Search for Code Connect:**
   - In search field type: **"Code Connect"**
   - You should see **"Code Connect"** plugin (official from Figma)

3. **Install plugin:**
   - Click on **"Code Connect"**
   - Click **"Install"** button (or "Run" if already installed)
   - Plugin should open

---

### Step 2.3: Connect Plugin to GitHub (FIRST TIME)

**If you're using the plugin for the first time, you need to connect it to GitHub:**

1. **In Code Connect plugin window:**
   - You should see screen with option **"Connect to GitHub"** or **"Connect repository"**
   - Click on this button

2. **GitHub Authorization:**
   - You'll be redirected to GitHub
   - Log in to GitHub (if not logged in)
   - Click **"Authorize Figma"** or **"Authorize"**
   - GitHub will ask for permission confirmation

3. **Repository selection:**
   - After authorization, you'll return to Figma
   - In plugin you'll see list of repositories
   - **Find and select:** `username/fragment-ui` (or your repo name)
   - Click on repository

4. **Confirmation:**
   - Plugin should show success message
   - May also show list of found Code Connect files

---

### Step 2.4: Use Plugin on Button Component

1. **Find Button component:**
   - In Figma, on `Components` page, find **Button** component
   - May be in **"Assets"** panel (left panel, component icon) or directly on page

2. **Open plugin for Button:**
   
   **Method A: Through context menu (easiest)**
   - Right-click on Button component
   - In context menu select **"Plugins"**
   - Select **"Code Connect"** from plugin list
   
   **Method B: Through Plugins panel**
   - Click on Button component (select it)
   - In top bar click **"Plugins"** icon (puzzle piece)
   - Select **"Code Connect"**
   
   **Method C: Through keyboard shortcut**
   - Select Button component
   - Press `Ctrl+/` (Windows/Linux) or `Cmd+/` (Mac)
   - Type "Code Connect" and select plugin

3. **Check connection:**
   - Plugin should open
   - In plugin window you should see:
     - ✅ **"Button"** - component name
     - ✅ Link to code (e.g. `packages/ui/src/button.tsx`)
     - ✅ Variant mapping:
       - `variant: solid, outline, ghost`
       - `size: sm`
       - `icons: leading, trailing`
     - ✅ Code usage example

---

### Step 2.5: Testing Mapping

1. **Switch variants in Figma:**
   - In Figma, select Button instance (or component itself)
   - In right panel **"Properties"** you'll see variant properties
   - Change:
     - `variant`: solid → outline → ghost
     - `size`: sm
     - `icons`: leading → trailing

2. **Check in plugin:**
   - In Code Connect plugin window you should see how code changes
   - Code should automatically update according to selected variants

---

## ❌ Troubleshooting

### Problem: "No connection found" or "No code found"

**Solution:**
1. Check if repo is connected:
   - In plugin, click on settings icon (⚙️) or "Settings"
   - Check if you see connected repo
   - If not, go back to Step 2.3

2. Check if files are in repo:
   - Make sure `figma-code-connect/button.ts` is in repo
   - Check if commit and push were done
   - Check if you're on correct branch (main/master)

3. Refresh plugin:
   - Close plugin (click X)
   - Open again (right-click → Plugins → Code Connect)
   - Or use `Ctrl+R` in Figma

### Problem: "Component not found"

**Solution:**
1. Check component name:
   - In Figma, click on Button
   - In left panel Layers check exact name
   - Should be: **"Button"** (without additional characters)
   - If name is different, update in `button.ts`: `figmaComponentName: "Button"`

2. Check Node ID:
   - In Figma, right-click on Button
   - Select "Copy link"
   - Check if Node ID in link is `1304-13481`
   - If not, update in `button.ts`

### Problem: "Variants not mapping"

**Solution:**
1. Check variant names in Figma:
   - Click on Button
   - In right panel Properties check exact property and value names
   - In `button.ts` must be exactly the same (case-sensitive)

2. Example of correct mapping:
   - In Figma: `variant: solid, outline, ghost`
   - In `button.ts`: `"solid": { variant: "solid" }`

### Problem: Plugin doesn't see changes

**Solution:**
1. Check if changes are in repo:
   - `git log` - check if commit was done
   - `git push` - make sure push was done

2. Refresh plugin:
   - Close and reopen plugin
   - Plugin may need a moment to synchronize

---

## ✅ Success!

If you see in plugin:
- ✅ Button component name
- ✅ Link to code
- ✅ Variant mapping
- ✅ Usage example

**That means everything works!** 🎉

---

## 📝 What's next?

1. **Add more components** (Input, Select, etc.)
2. **Use Code Connect** to synchronize design ↔ code
3. **Update variants** when you add new ones in code/Figma

---

*If you have problems, let me know!* 🆘
