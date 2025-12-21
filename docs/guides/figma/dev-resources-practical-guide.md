# 🎯 Dev Resources in Practice - Guide

How Dev Resources will work in your Fragment UI design system.

## 📋 How It Will Look:

### For You (Designer/Developer):

1. **In Figma (Dev Mode):**
   - You open Button component
   - In the right panel you see "Dev Resources" section
   - There's a link: `packages/ui/src/button.tsx`
   - Clicking opens the file in GitHub

2. **For Designers:**
   - They open component in Figma
   - They see link to code
   - They can check implementation without leaving Figma

3. **For Developers:**
   - They open component in Figma (Dev Mode)
   - They see link to code
   - Clicking leads directly to implementation
   - They don't need to search for file in repo

---

## 🔄 Workflow in Practice:

### Scenario 1: Designer wants to see code

1. Designer opens Button in Figma
2. In Dev Mode sees link to code
3. Click → GitHub opens with button.tsx file
4. Designer sees implementation and can see:
   - What props the component accepts
   - What variants are in code
   - How implementation looks

### Scenario 2: Developer implements new variant

1. Designer created new variant in Figma
2. Developer opens component in Figma
3. Sees link to code → clicks
4. GitHub opens with current implementation
5. Developer sees what needs to be added/updated

### Scenario 3: Code Review

1. Designer/Developer wants to check if design matches code
2. Opens component in Figma
3. Sees link to code → compares design with implementation
4. Can report discrepancies

---

## 📊 Structure for Fragment UI:

### Core Components:

| Component | Dev Resource Link |
|-----------|-------------------|
| Button | `packages/ui/src/button.tsx` |
| Input | `packages/ui/src/input.tsx` |
| Select | `packages/ui/src/select.tsx` |
| Dialog | `packages/ui/src/dialog.tsx` |
| ... | ... |

### Block Components:

| Block | Dev Resource Link |
|-------|-------------------|
| Authentication Block | `packages/blocks/src/authentication-block.tsx` |
| Pricing Table | `packages/blocks/src/pricing-table.tsx` |
| ... | ... |

---

## ✅ What Works:

### ✅ Advantages:

1. **Quick navigation Design → Code**
   - Click and you're in code
   - You don't need to search for file in repo

2. **For all instances**
   - Link added to main component
   - Visible for all instances

3. **For entire team**
   - Designers see links
   - Developers see links
   - Everyone has access to code

4. **Works in Dev Mode**
   - All Dev Mode features available
   - Inspect, CSS, etc. + links to code

---

## ⚠️ Limitations:

### ❌ What doesn't work (vs Code Connect):

1. **No automatic variant mapping**
   - You don't automatically see: "solid" → `variant="solid"`
   - You need to check manually in code

2. **No automatic synchronization**
   - If you change variant in Figma, link doesn't update
   - Link always leads to the same file

3. **No code examples**
   - You don't see example usage
   - You don't see props directly in Figma

4. **Manual addition**
   - You need to add link for each component
   - No automatic detection

---

## 🎯 Practical Usage:

### For Designers:

```
1. I open Button in Figma
2. I see: "Open in VS Code" or link to GitHub
3. I click → code opens
4. I check if design matches implementation
5. I can report discrepancies
```

### For Developers:

```
1. I open Button in Figma (Dev Mode)
2. I see link to code
3. I click → GitHub opens
4. I see current implementation
5. I implement changes according to design
```

### For Code Review:

```
1. I check component in Figma
2. I open link to code
3. I compare design with code
4. I check if all variants are implemented
5. I report issues
```

---

## 📝 Implementation Checklist:

### Step 1: Add Dev Resources for all components

- [ ] Button → `packages/ui/src/button.tsx`
- [ ] Input → `packages/ui/src/input.tsx`
- [ ] Select → `packages/ui/src/select.tsx`
- [ ] Dialog → `packages/ui/src/dialog.tsx`
- [ ] ... (all components)

### Step 2: Add for Blocks

- [ ] Authentication Block → `packages/blocks/src/authentication-block.tsx`
- [ ] Pricing Table → `packages/blocks/src/pricing-table.tsx`
- [ ] ... (all blocks)

### Step 3: Documentation for team

- [ ] Create documentation on how to use Dev Resources
- [ ] Explain workflow for designers and developers
- [ ] Add usage examples

---

## 💡 Best Practices:

### 1. Always use links to `main` branch

```
✅ https://github.com/blazejrzepa/fragment-ui/blob/main/packages/ui/src/button.tsx
❌ https://github.com/.../blob/feature/xyz/.../button.tsx
```

### 2. Add links to main components

- Add link to main component (not instance)
- Link will be visible for all instances

### 3. Update links when changing structure

- If you move component, update link
- Make sure links are current

---

## 🚀 What's Next?

1. **Add Dev Resources** for all components
2. **Test workflow** with team
3. **Consider upgrade** if you need Code Connect (automatic variant mapping)

---

*Dev Resources is a practical solution that works now!* ✅
