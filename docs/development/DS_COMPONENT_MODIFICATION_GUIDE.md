# Design System Component Modification Guide

**Purpose:** This guide explains the correct workflow for modifying Design System components to ensure consistency and maintainability.

---

## 🎯 Core Principle: **Single Source of Truth**

**All component changes MUST start from the Design System source files.**

```
┌─────────────────────────────────────┐
│   Design System (Source of Truth)   │
│   packages/ui/src/*.tsx             │
│   packages/blocks/src/*.tsx         │
└─────────────────────────────────────┘
              │
              │ Changes propagate automatically
              ▼
┌─────────────────────────────────────┐
│   Portal (apps/www)                 │
│   - Uses DS components              │
│   - Documentation pages             │
│   - Examples                        │
└─────────────────────────────────────┘
```

**❌ WRONG:** Modifying components in `apps/www/src/components/`  
**✅ CORRECT:** Modifying components in `packages/ui/src/` or `packages/blocks/src/`

---

## 📋 Modification Workflow

### Step 1: Identify Component Location

**UI Components** → `packages/ui/src/[component-name].tsx`  
**Blocks** → `packages/blocks/src/[block-name].tsx`  
**Templates** → `packages/blocks/src/templates/[template-name].tsx`

**Example:**
- `Button` → `packages/ui/src/button.tsx`
- `NavigationMenu` → `packages/ui/src/navigation-menu.tsx`
- `DocumentationHeader` → `packages/blocks/src/documentation-header.tsx`
- `DashboardTemplate` → `packages/blocks/src/templates/dashboard-template.tsx`

---

### Step 2: Make Changes in DS Source

**Always modify the source component first:**

```typescript
// ✅ CORRECT: Edit packages/ui/src/button.tsx
export function Button({ variant, size, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "base-styles",
        variant === "solid" && "new-solid-styles", // Your changes here
        size === "lg" && "new-lg-styles"           // Your changes here
      )}
      {...props}
    />
  );
}
```

**❌ NEVER modify wrapper components in apps/www:**
```typescript
// ❌ WRONG: Don't modify apps/www/src/components/button-wrapper.tsx
// Wrapper components should only adapt props/data, not styling
```

---

### Step 3: Update Component Styles

**If modifying styles, ensure you:**

1. **Use Design System tokens:**
   ```typescript
   // ✅ CORRECT: Use DS tokens
   className="bg-[color:var(--color-surface-1)] text-[color:var(--foreground-primary)]"
   
   // ❌ WRONG: Hardcoded colors
   className="bg-zinc-900 text-white"
   ```

2. **Update component CSS if needed:**
   - Component-specific styles → `packages/ui/src/[component].tsx` (inline styles or className)
   - Global DS styles → `packages/ui/src/styles.css` (if affecting multiple components)

3. **Maintain consistency:**
   - Follow existing patterns in the component
   - Use semantic color tokens (`--color-surface-*`, `--foreground-*`, etc.)
   - Use spacing tokens (`--space-*`) where applicable

---

### Step 4: Update Documentation Pages

**After modifying DS component, update its documentation:**

**Location:** `apps/www/app/docs/components/[component-name]/page.tsx`

**What to update:**
- ✅ Examples (if API changed)
- ✅ Props documentation (if props changed)
- ✅ Variants documentation (if variants changed)
- ✅ Code examples in examples section

**Example:**
```typescript
// apps/www/app/docs/components/button/page.tsx
export default function ButtonPage() {
  return (
    <DocLayout>
      <h1>Button</h1>
      <StabilityBadge stability="stable" />
      
      {/* Update examples if component API changed */}
      <div className="space-y-4 my-6">
        <div>
          <h3>New Variant</h3>
          <Button variant="new-variant">New Variant</Button> {/* Updated example */}
        </div>
      </div>
    </DocLayout>
  );
}
```

---

### Step 5: Update Registry Entry

**Location:** `packages/registry/registry.json` or `apps/www/public/r/[component-name].json`

**What to update:**
- ✅ Props (if props changed)
- ✅ Variants (if variants changed)
- ✅ Examples (if examples changed)
- ✅ Description (if behavior changed)

**Example:**
```json
{
  "button": {
    "import": "@fragment_ui/ui/button",
    "props": {
      "variant": ["solid", "outline", "ghost", "new-variant"], // Updated variants
      "size": ["sm", "md", "lg", "xl"] // Updated sizes
    },
    "variants": [
      {
        "name": "new-variant",
        "props": { "variant": "new-variant" },
        "description": "New variant description"
      }
    ],
    "examples": [
      {
        "name": "new-variant",
        "code": "<Button variant=\"new-variant\">Click me</Button>",
        "description": "New variant example"
      }
    ]
  }
}
```

---

### Step 6: Update Component Display (if applicable)

**If component is used in Component Playground:**

**Location:** `apps/www/src/components/component-playground/`

**What to check:**
- ✅ Component preview still works
- ✅ Props editor reflects new props/variants
- ✅ Code generator outputs correct code

---

### Step 7: Update Tests (if applicable)

**Location:** `packages/ui/src/__tests__/[component-name].test.tsx`

**What to update:**
- ✅ Unit tests for new props/variants
- ✅ Snapshot tests (if visual changes)
- ✅ Accessibility tests (if a11y changed)

---

### Step 8: Build and Verify

**After all changes:**

```bash
# Build DS packages
pnpm --filter @fragment_ui/ui build
pnpm --filter @fragment_ui/blocks build

# Build portal
pnpm --filter fragment-www build

# Run tests
pnpm --filter @fragment_ui/ui test

# Check for errors
pnpm check:public-ds-boundaries
pnpm check:public-ds-contract
```

---

## 🔄 Complete Workflow Checklist

When modifying a DS component, follow this checklist:

### Before Changes:
- [ ] Identify component location (`packages/ui/src/` or `packages/blocks/src/`)
- [ ] Understand current component API and styling
- [ ] Plan changes (props, variants, styles, behavior)

### During Changes:
- [ ] ✅ Modify component in DS source (`packages/ui/src/[component].tsx`)
- [ ] ✅ Use Design System tokens (colors, spacing, typography)
- [ ] ✅ Maintain component API consistency
- [ ] ✅ Update component styles (`packages/ui/src/styles.css` if needed)

### After Changes:
- [ ] ✅ Update documentation page (`apps/www/app/docs/components/[component]/page.tsx`)
- [ ] ✅ Update registry entry (`packages/registry/registry.json` or `apps/www/public/r/[component].json`)
- [ ] ✅ Update examples in documentation
- [ ] ✅ Update component playground (if applicable)
- [ ] ✅ Update tests (if applicable)
- [ ] ✅ Build and verify (`pnpm build`)
- [ ] ✅ Run tests (`pnpm test`)
- [ ] ✅ Check boundaries (`pnpm check:public-ds-boundaries`)
- [ ] ✅ Check contract (`pnpm check:public-ds-contract`)

---

## 📝 Examples

### Example 1: Adding a New Variant to Button

**Step 1:** Modify `packages/ui/src/button.tsx`
```typescript
export function Button({ variant = "solid", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "base-styles",
        variant === "solid" && "solid-styles",
        variant === "outline" && "outline-styles",
        variant === "new-variant" && "new-variant-styles" // ✅ Add here
      )}
      {...props}
    />
  );
}
```

**Step 2:** Update `apps/www/app/docs/components/button/page.tsx`
```typescript
<div>
  <h3>Variants</h3>
  <div className="flex gap-2">
    <Button variant="solid">Solid</Button>
    <Button variant="outline">Outline</Button>
    <Button variant="new-variant">New Variant</Button> {/* ✅ Add example */}
  </div>
</div>
```

**Step 3:** Update `packages/registry/registry.json`
```json
{
  "button": {
    "props": {
      "variant": ["solid", "outline", "ghost", "new-variant"] // ✅ Add variant
    }
  }
}
```

---

### Example 2: Changing Component Styling

**Step 1:** Modify `packages/ui/src/navigation-menu.tsx`
```typescript
export function NavigationMenuLink({ className, ...props }: NavigationMenuLinkProps) {
  return (
    <NavigationMenuPrimitive.Link
      className={cn(
        "group inline-flex h-auto w-max items-center justify-center rounded-md bg-transparent px-2.5 py-1.5 text-sm font-normal transition-colors",
        "hover:bg-[color:var(--color-surface-2)]", // ✅ Updated hover style
        "text-[color:var(--foreground-primary)]",   // ✅ Updated text color
        className
      )}
      {...props}
    />
  );
}
```

**Step 2:** Update `packages/ui/src/styles.css` (if global styles needed)
```css
/* ✅ Add global styles if needed */
@layer components {
  [data-radix-navigation-menu-link] {
    color: var(--foreground-primary) !important;
  }
}
```

**Step 3:** Update `apps/www/app/docs/components/navigation-menu/page.tsx`
```typescript
// ✅ Update examples to reflect new styling
<NavigationMenu>
  <NavigationMenuList>
    <NavigationMenuItem>
      <NavigationMenuLink href="/docs">Docs</NavigationMenuLink>
    </NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>
```

**Step 4:** Verify in portal - changes should be visible automatically

---

## ⚠️ Common Mistakes to Avoid

### ❌ Mistake 1: Modifying Wrapper Components
```typescript
// ❌ WRONG: Don't modify apps/www/src/components/button-wrapper.tsx
export function ButtonWrapper({ ...props }) {
  return <Button className="custom-styles" {...props} />; // Don't add styles here
}

// ✅ CORRECT: Modify packages/ui/src/button.tsx
export function Button({ className, ...props }: ButtonProps) {
  return <button className={cn("ds-styles", className)} {...props} />;
}
```

### ❌ Mistake 2: Hardcoding Colors
```typescript
// ❌ WRONG: Hardcoded colors
className="bg-zinc-900 text-white"

// ✅ CORRECT: Use DS tokens
className="bg-[color:var(--color-surface-1)] text-[color:var(--foreground-primary)]"
```

### ❌ Mistake 3: Forgetting to Update Documentation
```typescript
// ❌ WRONG: Changed component but forgot to update docs
// Component has new variant "new-variant" but docs still show old variants

// ✅ CORRECT: Always update documentation after component changes
```

### ❌ Mistake 4: Modifying Portal-Specific Components
```typescript
// ❌ WRONG: Don't modify portal-specific components for DS changes
// apps/www/src/components/logo.tsx - this is portal-specific, not DS

// ✅ CORRECT: Only modify DS components in packages/ui/ or packages/blocks/
```

---

## 🎯 Quick Reference

### Component Locations:
- **UI Components:** `packages/ui/src/[component-name].tsx`
- **Blocks:** `packages/blocks/src/[block-name].tsx`
- **Templates:** `packages/blocks/src/templates/[template-name].tsx`

### Documentation Locations:
- **Component Docs:** `apps/www/app/docs/components/[component-name]/page.tsx`
- **Block Docs:** `apps/www/app/docs/components/[block-name]/page.tsx`
- **Template Docs:** `apps/www/app/docs/templates/[template-name]/page.tsx`

### Registry Locations:
- **Main Registry:** `packages/registry/registry.json`
- **Component Registry:** `apps/www/public/r/[component-name].json`

### Style Locations:
- **Component Styles:** `packages/ui/src/[component-name].tsx` (inline)
- **Global DS Styles:** `packages/ui/src/styles.css`
- **Portal Styles:** `apps/www/src/styles/globals.css` (only for portal-specific)

---

## 🔍 Verification Steps

After making changes, verify:

1. **Component works in DS:**
   ```bash
   pnpm --filter @fragment_ui/ui build
   ```

2. **Documentation displays correctly:**
   ```bash
   pnpm --filter fragment-www build
   # Visit http://localhost:3000/docs/components/[component-name]
   ```

3. **Registry is updated:**
   ```bash
   # Check registry.json or /r/[component-name].json
   ```

4. **No breaking changes:**
   ```bash
   pnpm check:public-ds-boundaries
   pnpm check:public-ds-contract
   ```

---

## 📚 Related Documentation

- `docs/development/component-implementation.md` - Component implementation guidelines
- `docs/HOW_TO_EDIT_DS_COMPONENTS.md` - Detailed editing guide
- `docs/OSS_PUBLIC_DS_GUIDELINES.md` - Public DS contract requirements
- `docs/development/editing-navigation-menu.md` - Example: Editing NavigationMenu

---

## 💡 Key Takeaways

1. **Always start from DS source** (`packages/ui/src/` or `packages/blocks/src/`)
2. **Use Design System tokens** (colors, spacing, typography)
3. **Update documentation** after component changes
4. **Update registry** after API changes
5. **Build and verify** before considering changes complete
6. **Never modify wrapper components** for styling changes
7. **Keep portal-specific components separate** from DS components

---

**Remember:** The Design System is the **single source of truth**. All changes must originate from there and propagate to the portal automatically.

