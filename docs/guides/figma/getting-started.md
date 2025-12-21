# 🎨 Figma Integration - Step-by-Step Guide

## 📋 Phase 1: Basic Components (Button, Input, Select, Checkbox, Radio, Switch)

---

## Step 1: Figma File Preparation

### 1.1. Creating a new file in Figma

1. Open Figma Desktop or Web
2. Click **"New Design File"**
3. Name the file: **"Fragment UI Design System"**
4. Organize structure:
   ```
   📁 Pages
     📄 Design System
     📄 Components
     📄 Tokens
     📄 Examples
   ```

### 1.2. Creating directory structure

In Figma, create **Frames** (rectangles) as directories:

1. **Tokens Frame**
   - Colors (Light / Dark / High Contrast)
   - Typography
   - Spacing
   - Shadows
   - Border Radius

2. **Components Frame**
   - Form Controls
   - Data Display
   - Feedback
   - Navigation
   - Layout

3. **Examples Frame**
   - Usage examples
   - Patterns

---

## Step 2: Import Design Tokens

### 2.1. Creating Color Styles

1. Go to **Tokens Frame** → **Colors**
2. Create **Color Styles** for each color from design tokens:

**Light Mode Colors:**
- `--color-bg-primary` → `#FFFFFF`
- `--color-bg-secondary` → `#F5F5F5`
- `--color-fg-primary` → `#000000`
- `--color-fg-secondary` → `#666666`
- `--color-brand-primary` → `#0066FF`
- `--color-accent-red` → `#EF4444`
- `--color-accent-green` → `#10B981`
- `--color-accent-yellow` → `#F59E0B`
- `--color-accent-blue` → `#3B82F6`

**Dark Mode Colors:**
- Create separate Color Styles for dark mode
- Use "Dark/" prefix in name

**Semantic Colors:**
- Success, Error, Warning, Info (with bg, fg, border, muted variants)

### 2.2. Creating Typography Styles

1. Create **Text Styles** for each typography level:
   - Heading 1, 2, 3, 4
   - Body Large, Body, Body Small
   - Caption, Label

### 2.3. Creating Spacing & Effects

1. **Spacing:** Create documentation for spacing scale (0-32px)
2. **Effects:** Create Shadow Styles for elevation levels

---

## Step 3: Components - Button

### 3.1. Creating Button Component in Figma

1. Go to **Components Frame** → **Form Controls**
2. Create a rectangle (Frame) with dimensions **120x40px**
3. Add text "Button" (center aligned)
4. Set:
   - Background: Color Style `--color-brand-primary`
   - Border Radius: 8px (or use token)
   - Padding: 8px 16px
   - Typography: Body Medium

### 3.2. Creating Variants

1. Select Frame → **Create Component** (⌥⌘K or right-click → Create Component)
2. Click **"Create Variant"** or click the **"+"** icon in Variants section
3. Create variants:

**Variant: variant**
- `Solid` (default)
- `Outline`
- `Ghost`

**Variant: size**
- `Small` (sm)
- `Medium` (md) - default
- `Large` (lg)

**Variant: state**
- `Default`
- `Disabled`
- `Loading`

### 3.3. Variant Configuration

**Solid Button:**
- Background: `--color-brand-primary`
- Text: White
- Border: None

**Outline Button:**
- Background: Transparent
- Text: `--color-brand-primary`
- Border: 1px solid `--color-brand-primary`

**Ghost Button:**
- Background: Transparent
- Text: `--color-brand-primary`
- Border: None

**Sizes:**
- Small: Padding `6px 12px`, Font Size `14px`, Height `32px`
- Medium: Padding `8px 16px`, Font Size `16px`, Height `40px`
- Large: Padding `10px 20px`, Font Size `18px`, Height `48px`

**States:**
- Disabled: Opacity 50%
- Loading: Add spinner icon (can be added later)

### 3.4. Component Naming

1. Click on component → Properties panel
2. Name: **"Button"**
3. Description: "Button component with variants: solid, outline, ghost"

---

## Step 4: Components - Input

### 4.1. Creating Input Component

1. Create Frame **240x40px**
2. Add inner rectangle (border):
   - Border: 1px solid `--color-fg-muted`
   - Border Radius: 8px
   - Padding: 8px 12px
3. Add placeholder text: "Enter text..."

### 4.2. Input Variants

**Variant: state**
- `Default`
- `Disabled` (opacity + disabled cursor)
- `Error` (border color: `--color-accent-red`)
- `Focused` (border color: `--color-brand-primary`)

**Variant: type** (optional)
- `Text`
- `Email`
- `Password`
- `Number`

### 4.3. Configuration

- Background: `--color-bg-primary`
- Border: 1px solid `--color-fg-muted`
- Border Radius: 8px
- Typography: Body

---

## Step 5: Components - Select, Checkbox, Radio, Switch

### 5.1. Select Component

1. Frame **240x40px**
2. Border + ChevronDown icon (on the right)
3. Placeholder: "Select option..."
4. Variants: `Default`, `Disabled`, `Error`, `Open` (dropdown expanded)

### 5.2. Checkbox Component

1. Frame **20x20px**
2. Square border + check icon
3. Variants:
   - `Unchecked` / `Checked`
   - `Disabled`
   - `Indeterminate` (optional)

### 5.3. Radio Component

1. Frame **20x20px`
2. Circle border + filled circle
3. Variants:
   - `Unselected` / `Selected`
   - `Disabled`

### 5.4. Switch Component

1. Frame **44x24px` (or similar)
2. Toggle slider
3. Variants:
   - `Off` / `On`
   - `Disabled`

---

## Step 6: Figma Code Connect - Update Mappings

### 6.1. Getting Figma File URL

1. Open your file in Figma
2. Click **"Share"** (top right corner)
3. Copy URL - should look like:
   ```
   https://www.figma.com/file/YOUR_FILE_ID/Fragment-UI-Design-System
   ```

### 6.2. Getting Node IDs

**For each component:**
1. Click on component in Figma
2. In the right panel Properties, find **"Node ID"**
3. Copy Node ID (or use URL with node-id in query string)

**Alternatively:**
- Right-click on component → **"Copy link"**
- Link contains `node-id=XXXX` in URL

### 6.3. Updating button.ts

1. Open `figma-code-connect/button.ts`
2. Update `figmaNode` with real URL:

```typescript
figmaNode: "https://www.figma.com/file/YOUR_FILE_ID/Design-System?node-id=YOUR_NODE_ID",
```

3. Verify `figmaComponentName` - must exactly match name in Figma
4. Verify `variants` - must match variant names in Figma

### 6.4. Creating mappings for remaining components

Create new files in `figma-code-connect/`:

**select.ts:**
```typescript
import { codeConnect } from "figma-code-connect";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../packages/ui/src/select";

codeConnect.define({
  figmaNode: "https://www.figma.com/file/YOUR_FILE_ID/Design-System?node-id=SELECT_NODE_ID",
  figmaComponentName: "Select",
  codeComponent: Select,
  variants: {
    state: {
      "Default": {},
      "Disabled": { disabled: true },
      "Error": {},
    },
  },
  example: {
    render: (props) => (
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select option..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">Option 1</SelectItem>
          <SelectItem value="2">Option 2</SelectItem>
        </SelectContent>
      </Select>
    ),
  },
});
```

**checkbox.ts, radio.ts, switch.ts** - similarly

---

## Step 7: Generate and Push Code Connect

### 7.1. CLI Installation

```bash
npm install -g @figma/code-connect
```

Or use with npx (without global installation).

### 7.2. Generating code-connect.json

```bash
cd /Users/blazejrzepa/Dev/fragment-ui
npx @figma/code-connect generate
```

This will create `code-connect.json` file in the root directory.

### 7.3. Validation

```bash
npx @figma/code-connect validate
```

Checks if all mappings are correct.

### 7.4. Push to Figma

**Required:**
- Figma Personal Access Token
- Permissions to file in Figma

**Creating token:**
1. Figma → Settings → Account → Personal Access Tokens
2. Generate new token
3. Copy token

**Push:**
```bash
export FIGMA_ACCESS_TOKEN="your-token-here"
npx @figma/code-connect push
```

---

## Step 8: Verification in Figma

### 8.1. Code Connect Plugin Installation

1. Open file in Figma
2. Menu → Plugins → Browse plugins
3. Search for **"Code Connect"**
4. Install

### 8.2. Connecting to Repository

1. In Figma: Menu → Plugins → Code Connect
2. Click **"Connect Repository"**
3. Select GitHub
4. Authorize access
5. Select repository: `blazejrzepa/fragment-ui`

### 8.3. Connection Verification

1. Click on Button component in Figma
2. In the right panel you should see:
   - Link to code (`packages/ui/src/button.tsx`)
   - Mapped props and variants
   - Usage example

---

## ✅ Phase 1 Checklist

### In Figma:
- [ ] Design System File created
- [ ] Directory structure (Tokens, Components, Examples)
- [ ] Color Styles (Light/Dark mode)
- [ ] Typography Styles
- [ ] Button Component with all variants
- [ ] Input Component with all states
- [ ] Select Component
- [ ] Checkbox Component
- [ ] Radio Component
- [ ] Switch Component

### In code:
- [ ] `button.ts` - updated with Figma URL and Node ID
- [ ] `input.ts` - updated with Figma URL and Node ID
- [ ] `select.ts` - created
- [ ] `checkbox.ts` - created
- [ ] `radio.ts` - created
- [ ] `switch.ts` - created

### Code Connect:
- [ ] Figma Code Connect CLI installed
- [ ] `code-connect.json` generated
- [ ] Validation passed
- [ ] Push to Figma completed
- [ ] Plugin in Figma connected
- [ ] Connection verification - all components working

---

## 🎯 Next Steps

After completing Phase 1:
1. Test connections in Figma
2. Verify all variants
3. Proceed to Phase 2 (Core Components)

---

*Last Updated: 2024-12-27*
