# Figma Dev Resources - Manual Setup Guide

> **Alternative to Code Connect** (which requires Enterprise plan)
> 
> This guide shows how to manually add Dev Resources to Figma components
> to achieve similar functionality to Code Connect.

## 📋 Overview

Dev Resources allow you to add links to code, documentation, and other resources
directly to Figma components. This works with **Professional plan** and doesn't
require Enterprise.

## 🚀 Quick Setup

### Step 1: Enable Dev Mode

1. Open Figma
2. Press `Shift + D` or click **"Dev Mode"** toggle in top right
3. Dev Mode is now enabled

### Step 2: Add Dev Resources

1. **Click on a component** in Figma (e.g., Button)
2. In the **right panel**, find **"Dev Resources"** section
3. Click **"+ Add"** button
4. Paste one of the links below for that component
5. Repeat for all resources (code, docs, storybook)

### Step 3: Verify

1. Click on component again
2. Check that Dev Resources section shows all links
3. Click on links to verify they work

---

## 📦 Component Mappings

### Button

**Figma Component:** [View in Figma](https://www.figma.com/design/dccfbPgHqbWW7K687i9Fv3/Fragment-UI-Design-System?node-id=1304-13481)

**Node ID:** `1304-13481`

**Dev Resources to add:**

1. **Component Code**
   - Label: "Component Code" or "Button Code"
   - URL: `https://github.com/blazejrzepa/fragment-ui/blob/main/packages/ui/src/button.tsx`

2. **Documentation**
   - Label: "Documentation" or "Button Docs"
   - URL: `https://fragment-ui-www.vercel.app/docs/components/button`

3. **Storybook**
   - Label: "Storybook" or "Button Story"
   - URL: `https://6908c46a37e9c1c1fe40b48d-wvgljbvydh.chromatic.com?path=%2Fdocs%2Fcore-button--docs`

**Variant Mapping:**

| Figma Variant | Code Prop |
|---------------|-----------|
| `variant=solid` | `variant="solid"` |
| `variant=outline` | `variant="outline"` |
| `variant=ghost` | `variant="ghost"` |
| `size=sm` | `size="sm"` |
| `size=md` | `size="md"` |
| `size=lg` | `size="lg"` |

---

### Card

⚠️ **Node ID Required:** Replace `TODO-CARD-NODE-ID` with actual Figma node ID

**How to get Node ID:**
1. Open component in Figma
2. Right-click → Copy/Paste as → Copy link
3. Extract node-id from URL (e.g., ?node-id=1304-13481)
4. Update this script with the node ID

**Dev Resources to add:**

1. **Component Code**
   - Label: "Component Code" or "Card Code"
   - URL: `https://github.com/blazejrzepa/fragment-ui/blob/main/packages/ui/src/card.tsx`

2. **Documentation**
   - Label: "Documentation" or "Card Docs"
   - URL: `https://fragment-ui-www.vercel.app/docs/components/card`

3. **Storybook**
   - Label: "Storybook" or "Card Story"
   - URL: `https://6908c46a37e9c1c1fe40b48d-wvgljbvydh.chromatic.com?path=%2Fdocs%2Fdisplay-card--docs`

**Variant Mapping:**

| Figma Variant | Code Prop |
|---------------|-----------|

---

### Dialog

⚠️ **Node ID Required:** Replace `TODO-DIALOG-NODE-ID` with actual Figma node ID

**How to get Node ID:**
1. Open component in Figma
2. Right-click → Copy/Paste as → Copy link
3. Extract node-id from URL (e.g., ?node-id=1304-13481)
4. Update this script with the node ID

**Dev Resources to add:**

1. **Component Code**
   - Label: "Component Code" or "Dialog Code"
   - URL: `https://github.com/blazejrzepa/fragment-ui/blob/main/packages/ui/src/dialog.tsx`

2. **Documentation**
   - Label: "Documentation" or "Dialog Docs"
   - URL: `https://fragment-ui-www.vercel.app/docs/components/dialog`

3. **Storybook**
   - Label: "Storybook" or "Dialog Story"
   - URL: `https://6908c46a37e9c1c1fe40b48d-wvgljbvydh.chromatic.com?path=%2Fdocs%2Fcore-dialog--docs`

**Variant Mapping:**

| Figma Variant | Code Prop |
|---------------|-----------|

---

### Select

⚠️ **Node ID Required:** Replace `TODO-SELECT-NODE-ID` with actual Figma node ID

**How to get Node ID:**
1. Open component in Figma
2. Right-click → Copy/Paste as → Copy link
3. Extract node-id from URL (e.g., ?node-id=1304-13481)
4. Update this script with the node ID

**Dev Resources to add:**

1. **Component Code**
   - Label: "Component Code" or "Select Code"
   - URL: `https://github.com/blazejrzepa/fragment-ui/blob/main/packages/ui/src/select.tsx`

2. **Documentation**
   - Label: "Documentation" or "Select Docs"
   - URL: `https://fragment-ui-www.vercel.app/docs/components/select`

3. **Storybook**
   - Label: "Storybook" or "Select Story"
   - URL: `https://6908c46a37e9c1c1fe40b48d-wvgljbvydh.chromatic.com?path=%2Fdocs%2Fcore-select--docs`

**Variant Mapping:**

| Figma Variant | Code Prop |
|---------------|-----------|

---

## 🔄 Automation (Optional)

If you have a Figma Personal Access Token, you can automate adding Dev Resources
using the Figma REST API. See `scripts/add-figma-dev-resources-api.ts` for
implementation.

## 📚 Related Documentation

- [Figma Dev Resources Guide](https://help.figma.com/hc/en-us/articles/360055203533)
- [Figma REST API - Dev Resources](https://www.figma.com/developers/api#dev-resources-endpoints)
- [Alternative Code Connect Solutions](../guides/figma-code-connect-alternatives.md)

---

*Generated: 2025-11-18T07:36:42.792Z*
