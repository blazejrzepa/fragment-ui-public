# 📋 Dev Resources Setup - Task List

**Status:** 🚧 In Progress  
**Priority:** A (Figma Code Connect & Parity)  
**Created:** 2025-01-05  
**Related:** [NEXT_STEPS.md](./NEXT_STEPS.md)

---

## 🎯 Goal

Complete Dev Resources setup for Card, Dialog, and Select components to achieve 5/5 component coverage (currently 2/5 with Button and Input).

---

## ✅ Completed Tasks

- [x] Extended `generate-figma-dev-resources.ts` with Card, Dialog, Select mappings
- [x] Added Storybook paths for all three components
- [x] Generated documentation with instructions
- [x] Updated `.figma-dev-resources.json` with pending components
- [x] Committed changes to repository

---

## 📝 Pending Tasks

### Phase 1: Get Figma Node IDs

**For each component (Card, Dialog, Select):**

- [ ] **Card Node ID**
  - [ ] Open Card component in Figma
  - [ ] Right-click → Copy/Paste as → Copy link
  - [ ] Extract node-id from URL (e.g., `?node-id=1304-13481`)
  - [ ] Update `scripts/generate-figma-dev-resources.ts`:
    ```typescript
    {
      figmaNodeId: "YOUR-CARD-NODE-ID", // Replace TODO-CARD-NODE-ID
      componentName: "Card",
      // ...
    }
    ```

- [ ] **Dialog Node ID**
  - [ ] Open Dialog component in Figma
  - [ ] Right-click → Copy/Paste as → Copy link
  - [ ] Extract node-id from URL
  - [ ] Update `scripts/generate-figma-dev-resources.ts`:
    ```typescript
    {
      figmaNodeId: "YOUR-DIALOG-NODE-ID", // Replace TODO-DIALOG-NODE-ID
      componentName: "Dialog",
      // ...
    }
    ```

- [ ] **Select Node ID**
  - [ ] Open Select component in Figma
  - [ ] Right-click → Copy/Paste as → Copy link
  - [ ] Extract node-id from URL
  - [ ] Update `scripts/generate-figma-dev-resources.ts`:
    ```typescript
    {
      figmaNodeId: "YOUR-SELECT-NODE-ID", // Replace TODO-SELECT-NODE-ID
      componentName: "Select",
      // ...
    }
    ```

---

### Phase 2: Regenerate Documentation

- [ ] Run generation script:
  ```bash
  pnpm figma:dev-resources
  ```
- [ ] Verify `docs/guides/figma-dev-resources-manual-setup.md` is updated
- [ ] Verify `.figma-dev-resources.json` includes all components (no pending items)
- [ ] Review generated links are correct

---

### Phase 3: Add Dev Resources in Figma

**Option A: Manual Setup (Recommended for first time)**

For each component (Card, Dialog, Select):

- [ ] **Card Dev Resources**
  - [ ] Open Figma → Enable Dev Mode (`Shift + D`)
  - [ ] Click on Card component
  - [ ] In right panel → Dev Resources section → "+ Add"
  - [ ] Add Component Code link:
    - Label: "Component Code" or "Card Code"
    - URL: `https://github.com/blazejrzepa/fragment-ui/blob/main/packages/ui/src/card.tsx`
  - [ ] Add Documentation link:
    - Label: "Documentation" or "Card Docs"
    - URL: `https://fragment-ui-www.vercel.app/docs/components/card`
  - [ ] Add Storybook link:
    - Label: "Storybook" or "Card Story"
    - URL: `https://6908c46a37e9c1c1fe40b48d-wvgljbvydh.chromatic.com?path=/docs/display-card--docs`
  - [ ] Verify all links work

- [ ] **Dialog Dev Resources**
  - [ ] Open Dialog component in Figma (Dev Mode)
  - [ ] Add Component Code link:
    - URL: `https://github.com/blazejrzepa/fragment-ui/blob/main/packages/ui/src/dialog.tsx`
  - [ ] Add Documentation link:
    - URL: `https://fragment-ui-www.vercel.app/docs/components/dialog`
  - [ ] Add Storybook link:
    - URL: `https://6908c46a37e9c1c1fe40b48d-wvgljbvydh.chromatic.com?path=/docs/core-dialog--docs`
  - [ ] Verify all links work

- [ ] **Select Dev Resources**
  - [ ] Open Select component in Figma (Dev Mode)
  - [ ] Add Component Code link:
    - URL: `https://github.com/blazejrzepa/fragment-ui/blob/main/packages/ui/src/select.tsx`
  - [ ] Add Documentation link:
    - URL: `https://fragment-ui-www.vercel.app/docs/components/select`
  - [ ] Add Storybook link:
    - URL: `https://6908c46a37e9c1c1fe40b48d-wvgljbvydh.chromatic.com?path=/docs/core-select--docs`
  - [ ] Verify all links work

**Option B: API Automation (If you have FIGMA_TOKEN)**

- [ ] Get Figma Personal Access Token:
  - [ ] Go to Figma Settings → Account → Personal Access Tokens
  - [ ] Generate new token
  - [ ] Set environment variable:
    ```bash
    export FIGMA_TOKEN="your-token-here"
    ```
- [ ] Run API script:
  ```bash
  pnpm figma:dev-resources:add
  ```
- [ ] Verify resources were added successfully
- [ ] Check Figma to confirm all links are present

---

### Phase 4: Verification

- [ ] **Test in Figma**
  - [ ] Open each component (Card, Dialog, Select) in Figma Dev Mode
  - [ ] Verify Dev Resources section shows all 3 links (Code, Docs, Storybook)
  - [ ] Click each link to verify they work correctly
  - [ ] Test with team members to ensure visibility

- [ ] **Update Documentation**
  - [ ] Update `docs/roadmap/figma-integration-status.md` with completion status
  - [ ] Update `docs/roadmap/NEXT_STEPS.md` checklist
  - [ ] Mark this task as complete in project status

- [ ] **Commit Changes**
  - [ ] Commit updated `scripts/generate-figma-dev-resources.ts` with node IDs
  - [ ] Commit regenerated documentation
  - [ ] Update CHANGELOG.md if needed

---

## 📊 Current Status

| Component | Node ID | Dev Resources | Status |
|-----------|---------|---------------|--------|
| Button | `1304-13481` | ✅ Added | ✅ Complete |
| Input | ✅ (existing) | ✅ Added | ✅ Complete |
| Card | `TODO-CARD-NODE-ID` | ⏳ Pending | 🚧 In Progress |
| Dialog | `TODO-DIALOG-NODE-ID` | ⏳ Pending | 🚧 In Progress |
| Select | `TODO-SELECT-NODE-ID` | ⏳ Pending | 🚧 In Progress |

**Progress:** 2/5 components (40%) → Target: 5/5 components (100%)

---

## 🔗 Quick Links

### Generated Documentation
- Manual Setup Guide: `docs/guides/figma-dev-resources-manual-setup.md`
- JSON Config: `.figma-dev-resources.json`

### Scripts
- Generation: `pnpm figma:dev-resources`
- API Add: `pnpm figma:dev-resources:add` (requires FIGMA_TOKEN)

### Component Links (Ready to Use)

**Card:**
- Code: `https://github.com/blazejrzepa/fragment-ui/blob/main/packages/ui/src/card.tsx`
- Docs: `https://fragment-ui-www.vercel.app/docs/components/card`
- Storybook: `https://6908c46a37e9c1c1fe40b48d-wvgljbvydh.chromatic.com?path=/docs/display-card--docs`

**Dialog:**
- Code: `https://github.com/blazejrzepa/fragment-ui/blob/main/packages/ui/src/dialog.tsx`
- Docs: `https://fragment-ui-www.vercel.app/docs/components/dialog`
- Storybook: `https://6908c46a37e9c1c1fe40b48d-wvgljbvydh.chromatic.com?path=/docs/core-dialog--docs`

**Select:**
- Code: `https://github.com/blazejrzepa/fragment-ui/blob/main/packages/ui/src/select.tsx`
- Docs: `https://fragment-ui-www.vercel.app/docs/components/select`
- Storybook: `https://6908c46a37e9c1c1fe40b48d-wvgljbvydh.chromatic.com?path=/docs/core-select--docs`

---

## 📝 Notes

- Node IDs are required only for API automation. Manual setup can be done without them.
- All links are already generated and ready to use.
- After completing this task, we'll have 5/5 components with Dev Resources (completing Priority A from NEXT_STEPS.md).

---

## ✅ Definition of Done

- [ ] All 5 components (Button, Input, Card, Dialog, Select) have Dev Resources in Figma
- [ ] All links verified and working
- [ ] Documentation updated
- [ ] Scripts updated with actual node IDs
- [ ] Changes committed to repository
- [ ] Team notified of completion

---

**Last Updated:** 2025-01-05  
**Next Review:** After Phase 1 completion

