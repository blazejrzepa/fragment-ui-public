# 🔄 Figma ↔ Design System - Synchronization Workflow

Technical guide for synchronizing components between Figma and code (Design System).

## 📋 Overview

Since we use **Dev Resources** (not Code Connect), synchronization is **manual**, but simpler and more controlled.

---

## 🔄 Workflow: Design → Code (Changes in Figma)

### Scenario: Designer added new variant in Figma

**Step 1: Designer informs about change**

1. Designer adds new variant in Figma (e.g. `variant: "danger"` for Button)
2. Designer informs developer (Slack, GitHub Issue, etc.)
3. Optionally: Designer creates GitHub Issue with change description

**Step 2: Developer checks changes in Figma**

1. Developer opens component in Figma (Dev Mode)
2. Checks all variants in Properties panel
3. Checks styles, colors, spacing, typography
4. Saves screenshots or notes

**Step 3: Developer updates code**

1. Opens file in code (e.g. `packages/ui/src/button.tsx`)
2. Adds new variant to code:
   ```typescript
   type Variant = "solid" | "outline" | "ghost" | "danger"; // ← new
   ```
3. Adds styles for new variant:
   ```typescript
   variant: {
     solid: "...",
     outline: "...",
     ghost: "...",
     danger: "bg-red-500 text-white ...", // ← new
   }
   ```
4. Updates Storybook stories
5. Updates tests

**Step 4: Update Dev Resource (if needed)**

1. If file/path changed, update Dev Resource in Figma
2. If not, Dev Resource remains unchanged

**Step 5: Verification**

1. Developer checks if code matches Figma
2. Designer checks if implementation matches design
3. Code Review

---

## 🔄 Workflow: Code → Design (Changes in Code)

### Scenario: Developer added new variant in code

**Step 1: Developer informs about change**

1. Developer adds new variant in code
2. Commit and push to repo
3. Informs designer (Slack, GitHub Issue, etc.)

**Step 2: Designer updates Figma**

1. Designer opens component in Figma
2. Checks code through Dev Resource link
3. Adds new variant in Figma:
   - Creates new variant in Component Properties
   - Sets styles according to code
   - Verifies with design tokens

**Step 3: Verification**

1. Designer checks if variant in Figma matches code
2. Developer checks if variant in code matches Figma
3. Code Review

---

## 📋 Detailed Workflow for Different Types of Changes

### 1. New Variant

**Design → Code:**
1. Designer adds variant in Figma
2. Designer documents changes (screenshot, description)
3. Developer implements in code
4. Verification

**Code → Design:**
1. Developer adds variant in code
2. Developer documents changes (commit message, PR)
3. Designer adds variant in Figma
4. Verification

---

### 2. Color/Style Change

**Design → Code:**
1. Designer changes color in Figma
2. Designer checks if uses design token (if not, uses token)
3. Developer updates code:
   - If uses token → updates token in code
   - If uses custom color → updates directly in component
4. Verification

**Code → Design:**
1. Developer changes color in code
2. If changed token → designer updates token in Figma
3. If changed directly → designer updates in component
4. Verification

---

### 3. Size/Spacing Change

**Design → Code:**
1. Designer changes spacing in Figma
2. Designer checks if uses spacing scale
3. Developer updates code (using spacing scale)
4. Verification

**Code → Design:**
1. Developer changes spacing in code
2. Designer updates in Figma (using spacing scale)
3. Verification

---

### 4. New Component

**Design → Code:**
1. Designer creates component in Figma
2. Designer defines variants, states, props
3. Developer implements in code:
   - Creates component file
   - Implements variants
   - Adds Storybook stories
   - Adds tests
4. Developer adds Dev Resource in Figma
5. Verification

**Code → Design:**
1. Developer creates component in code
2. Developer informs designer
3. Designer creates component in Figma:
   - Based on code
   - Uses design tokens
   - Defines variants
4. Developer adds Dev Resource in Figma
5. Verification

---

## 🛠️ Tools and Processes

### 1. GitHub Issues for Tracking Changes

**Template for change in Figma:**
```markdown
## Change in Figma
- **Component:** Button
- **Change:** Added "danger" variant
- **Link to Figma:** [link]
- **Screenshot:** [screenshot]
- **Priority:** High/Medium/Low
```

**Template for change in code:**
```markdown
## Change in code
- **Component:** Button
- **Change:** Added "danger" variant
- **PR:** #[number]
- **Link to code:** [link]
- **Priority:** High/Medium/Low
```

---

### 2. Design Tokens Synchronization

**Design Tokens in code:**
- `packages/tokens/` - source of truth
- Exported as CSS variables and TypeScript

**Design Tokens in Figma:**
- Manually synchronized with code
- Used in Figma components

**Synchronization:**
1. Change token in code
2. Update in Figma (manually)
3. Verification in all components

---

### 3. Version Control

**Design System (Code):**
- Git version control
- PR review process
- Semantic versioning

**Figma:**
- Version history in Figma
- Comments and review in Figma
- Branching (if you have Organization plan)

---

## 📊 Synchronization Checklist

### For Designer:

- [ ] Change in Figma done
- [ ] Uses design tokens (if possible)
- [ ] Change documentation (screenshot, description)
- [ ] Developer informed
- [ ] GitHub Issue created (optional)
- [ ] Verification after implementation

### For Developer:

- [ ] Change in code done
- [ ] Uses design tokens (if possible)
- [ ] Storybook updated
- [ ] Tests updated
- [ ] Dev Resource updated (if needed)
- [ ] Designer informed
- [ ] PR created
- [ ] Verification with design

---

## 🔄 Regular Synchronization

### Weekly:

1. **Design Review:**
   - Check all components in Figma
   - Check if all have Dev Resources
   - Check if variants are synchronized

2. **Code Review:**
   - Check all components in code
   - Check if all have Dev Resources in Figma
   - Check if variants are synchronized

### Monthly:

1. **Full Synchronization:**
   - Review all components
   - Design tokens verification
   - Documentation update

---

## 💡 Best Practices

### 1. Design Tokens as Source of Truth

**Always use design tokens:**
- ✅ Colors from tokens
- ✅ Spacing from tokens
- ✅ Typography from tokens

**Avoid:**
- ❌ Hardcoded colors
- ❌ Hardcoded spacing
- ❌ Hardcoded fonts

---

### 2. Change Documentation

**Always document:**
- What changed
- Why it changed
- How it affects other components

---

### 3. Communication

**Always communicate:**
- Changes in Figma → Developer
- Changes in code → Designer
- Use GitHub Issues/PRs

---

### 4. Verification

**Always verify:**
- Design matches code
- Code matches design
- All variants are synchronized

---

## 🚀 Automation (Optional)

### Possible Automations:

1. **GitHub Actions:**
   - Automatic checking if Dev Resources are up to date
   - Automatic tests after changes

2. **Figma Plugins:**
   - Automatic design tokens export
   - Automatic documentation generation

3. **CI/CD:**
   - Automatic tests after changes in Figma
   - Automatic deploy after changes in code

---

## 📝 Example: Full Workflow

### Scenario: Adding new "danger" variant for Button

**1. Designer (Figma):**
```
1. Opens Button in Figma
2. Adds "danger" variant in Component Properties
3. Sets styles: bg-red-500, text-white
4. Saves screenshot
5. Creates GitHub Issue: "Add danger variant to Button"
6. Informs developer
```

**2. Developer (Code):**
```
1. Opens GitHub Issue
2. Checks Figma (Dev Mode) → sees new variant
3. Opens packages/ui/src/button.tsx
4. Adds "danger" to type Variant
5. Adds styles for danger variant
6. Updates Storybook stories
7. Updates tests
8. Creates PR
```

**3. Code Review:**
```
1. Designer checks PR
2. Verifies if code matches Figma
3. Approves PR
4. Merge
```

**4. Verification:**
```
1. Developer checks Storybook
2. Designer checks if implementation matches Figma
3. ✅ Synchronized!
```

---

## 🎯 Summary

### Workflow:
1. **Change in Figma** → Information → Implementation in code → Verification
2. **Change in code** → Information → Update in Figma → Verification

### Key Principles:
- ✅ Design tokens as source of truth
- ✅ Communication on every change
- ✅ Verification after every change
- ✅ Change documentation

### Regularity:
- Weekly: Quick sync check
- Monthly: Full sync review

---

*This workflow ensures synchronization between Figma and Design System!* ✅
