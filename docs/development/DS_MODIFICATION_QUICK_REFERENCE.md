# DS Component Modification - Quick Reference

**Single Source of Truth:** All changes start from `packages/ui/src/` or `packages/blocks/src/`

---

## 🔄 Modification Workflow (8 Steps)

### 1. **Modify DS Source** ✅
- UI Components: `packages/ui/src/[component-name].tsx`
- Blocks: `packages/blocks/src/[block-name].tsx`
- Templates: `packages/blocks/src/templates/[template-name].tsx`

### 2. **Use DS Tokens** ✅
```typescript
// ✅ CORRECT
className="bg-[color:var(--color-surface-1)] text-[color:var(--foreground-primary)]"

// ❌ WRONG
className="bg-zinc-900 text-white"
```

### 3. **Update Documentation Page** ✅
- Location: `apps/www/app/docs/components/[component-name]/page.tsx`
- Update: Examples, props, variants, code snippets

### 4. **Update Registry Entry** ✅
- Location: `packages/registry/registry.json` or `apps/www/public/r/[component-name].json`
- Update: Props, variants, examples, description

### 5. **Update Component Playground** (if applicable) ✅
- Location: `apps/www/src/components/component-playground/`
- Update: Props editor, code generator

### 6. **Update Tests** (if applicable) ✅
- Location: `packages/ui/src/__tests__/[component-name].test.tsx`
- Update: Unit tests, snapshots, a11y tests

### 7. **Build and Verify** ✅
```bash
pnpm --filter @fragment_ui/ui build
pnpm --filter @fragment_ui/blocks build
pnpm --filter fragment-www build
pnpm check:public-ds-boundaries
pnpm check:public-ds-contract
```

### 8. **Test in Portal** ✅
- Visit: `http://localhost:3000/docs/components/[component-name]`
- Verify: Examples work, styling is correct, no errors

---

## ⚠️ Common Mistakes

❌ **Don't modify wrapper components** (`apps/www/src/components/*-wrapper.tsx`)  
❌ **Don't hardcode colors** (use DS tokens)  
❌ **Don't forget documentation** (always update docs after changes)  
❌ **Don't modify portal-specific components** (Logo, ThemeToggle, etc.)

---

## 📍 File Locations Quick Reference

| Component Type | Source Location | Documentation | Registry |
|---------------|----------------|----------------|----------|
| UI Component | `packages/ui/src/[name].tsx` | `apps/www/app/docs/components/[name]/page.tsx` | `packages/registry/registry.json` |
| Block | `packages/blocks/src/[name].tsx` | `apps/www/app/docs/components/[name]/page.tsx` | `apps/www/public/r/[name].json` |
| Template | `packages/blocks/src/templates/[name].tsx` | `apps/www/app/docs/templates/[name]/page.tsx` | `apps/www/public/r/[name].json` |

---

## ✅ Checklist

- [ ] Modified component in DS source (`packages/ui/src/` or `packages/blocks/src/`)
- [ ] Used Design System tokens (no hardcoded colors)
- [ ] Updated documentation page
- [ ] Updated registry entry
- [ ] Updated examples (if API changed)
- [ ] Built packages (`pnpm build`)
- [ ] Verified in portal (`http://localhost:3000/docs/components/[name]`)
- [ ] Checked boundaries (`pnpm check:public-ds-boundaries`)

---

**Full Guide:** See `docs/development/DS_COMPONENT_MODIFICATION_GUIDE.md` for detailed instructions.

