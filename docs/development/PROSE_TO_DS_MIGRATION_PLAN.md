# Migration Plan: Remove `.prose` and Use DS Typography Components

## 🎯 Goal

**Remove all `.prose` usage and replace with Design System typography components to maintain DS as the single source of truth.**

---

## 📊 Current State Analysis

### Where `.prose` is Used:

1. **`DocLayout` component** (`apps/www/src/components/doc-layout.tsx`)
   - Uses `className="prose prose-invert max-w-none min-w-0"`

2. **~20 documentation pages** use `prose prose-invert`:
   - Guide pages (cli-usage, enterprise-features, etc.)
   - Component pages (card-grid, form-container, etc.)
   - Testing pages (test-guide, performance-tests, etc.)
   - Versioned docs pages

3. **`globals.css`** has ~700 lines of `.prose` styles:
   - Headings (h1-h6)
   - Paragraphs
   - Lists (ul, ol)
   - Code blocks
   - Links
   - Inline code

### Problems:

- ❌ `.prose` styles are in `globals.css` (portal-specific) instead of DS
- ❌ Not using DS typography tokens consistently
- ❌ External dependency on Tailwind Typography patterns (even if not installed)
- ❌ Violates "DS as single source of truth" principle

---

## ✅ Solution: Create DS Typography Components

### Phase 1: Create Typography Components in DS

**Location:** `packages/ui/src/typography/`

#### Components to Create:

1. **`Heading`** (`heading.tsx`)
   - Props: `level` (1-6), `size`, `className`
   - Uses DS tokens for font-size, weight, line-height
   - Example: `<Heading level={1}>Title</Heading>`

2. **`Paragraph`** (`paragraph.tsx`)
   - Props: `size` (sm, md, lg), `variant` (default, intro), `className`
   - Uses DS tokens
   - Example: `<Paragraph variant="intro">Introduction text</Paragraph>`

3. **`List`** (`list.tsx`)
   - Props: `ordered` (boolean), `className`
   - Uses DS tokens for spacing, typography
   - Example: `<List ordered><li>Item</li></List>`

4. **`Link`** (`link.tsx`)
   - Props: `href`, `external`, `className`
   - Uses DS tokens for colors, underline
   - Example: `<Link href="/docs">Documentation</Link>`

5. **`DocumentContent`** (`document-content.tsx`)
   - Wrapper component that replaces `.prose`
   - Applies DS typography styles to children
   - Example: `<DocumentContent>{children}</DocumentContent>`

#### Typography Styles in DS:

**Location:** `packages/ui/src/styles.css`

- Move all typography styles from `globals.css` to DS
- Use DS tokens (`--color-fg-base`, `--typography-size-*`, etc.)
- Create `.document-content` class (replaces `.prose`)

---

### Phase 2: Migrate DocLayout

**File:** `apps/www/src/components/doc-layout.tsx`

**Before:**
```tsx
<article className="prose prose-invert max-w-none min-w-0">
  {children}
</article>
```

**After:**
```tsx
import { DocumentContent } from "@fragment_ui/ui";

<DocumentContent>
  {children}
</DocumentContent>
```

---

### Phase 3: Migrate Documentation Pages

**Files to Update:** ~20 pages

**Before:**
```tsx
<article className="prose prose-invert max-w-none">
  {content}
</article>
```

**After:**
```tsx
import { DocumentContent } from "@fragment_ui/ui";

<DocumentContent>
  {content}
</DocumentContent>
```

**Pages to Migrate:**
- `apps/www/app/docs/guides/*/page.tsx` (5 files)
- `apps/www/app/docs/components/*/page.tsx` (8 files)
- `apps/www/app/docs/testing/*/page.tsx` (3 files)
- `apps/www/app/docs/v/[...version]/page.tsx`
- `apps/www/app/docs/foundations/tokens/page.tsx`
- `apps/www/src/components/tutorial/tutorial-step.tsx`

---

### Phase 4: Remove `.prose` Styles from globals.css

**File:** `apps/www/src/styles/globals.css`

**Actions:**
1. Remove all `.prose` styles (~700 lines)
2. Keep only portal-specific styles (logo, breadcrumbs, etc.)
3. Typography styles are now in DS (`packages/ui/src/styles.css`)

---

### Phase 5: Update MDX Content Rendering

**For markdown content rendered via `dangerouslySetInnerHTML`:**

**Before:**
```tsx
<div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
```

**After:**
```tsx
import { DocumentContent } from "@fragment_ui/ui";

<DocumentContent dangerouslySetInnerHTML={{ __html: content }} />
```

---

## 📋 Implementation Checklist

### Phase 1: Create DS Typography Components
- [ ] Create `packages/ui/src/typography/heading.tsx`
- [ ] Create `packages/ui/src/typography/paragraph.tsx`
- [ ] Create `packages/ui/src/typography/list.tsx`
- [ ] Create `packages/ui/src/typography/link.tsx`
- [ ] Create `packages/ui/src/typography/document-content.tsx`
- [ ] Create `packages/ui/src/typography/index.ts` (exports)
- [ ] Add typography styles to `packages/ui/src/styles.css`
- [ ] Export from `packages/ui/src/index.ts`
- [ ] Add tests for typography components
- [ ] Add Storybook stories

### Phase 2: Migrate DocLayout
- [ ] Update `apps/www/src/components/doc-layout.tsx`
- [ ] Test on documentation pages

### Phase 3: Migrate Documentation Pages
- [ ] Migrate guide pages (5 files)
- [ ] Migrate component pages (8 files)
- [ ] Migrate testing pages (3 files)
- [ ] Migrate versioned docs page
- [ ] Migrate tokens page
- [ ] Migrate tutorial-step component

### Phase 4: Remove `.prose` Styles
- [ ] Remove `.prose` styles from `globals.css`
- [ ] Keep portal-specific styles
- [ ] Test all documentation pages

### Phase 5: Verification
- [ ] Build DS package
- [ ] Build portal
- [ ] Test all documentation pages
- [ ] Verify typography consistency
- [ ] Check accessibility
- [ ] Verify dark mode

---

## 🎨 Typography Component API Design

### Heading Component

```tsx
interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  size?: "display-2xl" | "display-xl" | "display-lg" | "display-md" | "display-sm" | "display-xs" | "2xl" | "xl" | "lg" | "md" | "sm" | "xs";
  className?: string;
}

<Heading level={1} size="display-lg">Main Title</Heading>
<Heading level={2} size="xl">Section Title</Heading>
```

### Paragraph Component

```tsx
interface ParagraphProps extends React.HTMLAttributes<HTMLParagraphElement> {
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  variant?: "default" | "intro";
  className?: string;
}

<Paragraph variant="intro">Introduction text</Paragraph>
<Paragraph size="md">Body text</Paragraph>
```

### List Component

```tsx
interface ListProps extends React.HTMLAttributes<HTMLUListElement | HTMLOListElement> {
  ordered?: boolean;
  className?: string;
}

<List>
  <li>Item 1</li>
  <li>Item 2</li>
</List>

<List ordered>
  <li>First</li>
  <li>Second</li>
</List>
```

### Link Component

```tsx
interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  external?: boolean;
  className?: string;
}

<Link href="/docs">Documentation</Link>
<Link href="https://example.com" external>External Link</Link>
```

### DocumentContent Component

```tsx
interface DocumentContentProps extends React.HTMLAttributes<HTMLElement> {
  as?: "article" | "div" | "section";
  className?: string;
}

<DocumentContent>
  <Heading level={1}>Title</Heading>
  <Paragraph>Content...</Paragraph>
</DocumentContent>
```

---

## 🔄 Migration Strategy

### Incremental Migration:

1. **Create DS components first** (Phase 1)
2. **Test components in isolation** (Storybook)
3. **Migrate DocLayout** (Phase 2) - affects all pages
4. **Migrate pages one by one** (Phase 3) - can be done incrementally
5. **Remove `.prose` styles** (Phase 4) - only after all pages migrated

### Rollback Plan:

- Keep `.prose` styles in `globals.css` until migration is complete
- Can revert DocLayout change if issues arise
- Each page migration is independent

---

## 📚 Benefits

1. ✅ **DS as Single Source of Truth** - All typography in DS
2. ✅ **Consistency** - Same typography across all pages
3. ✅ **Maintainability** - One place to update typography
4. ✅ **Type Safety** - TypeScript props for typography components
5. ✅ **Reusability** - Typography components can be used anywhere
6. ✅ **Documentation** - Typography components documented in DS

---

## ⚠️ Considerations

1. **MDX Content** - Some content is rendered via `dangerouslySetInnerHTML`
   - Solution: Wrap in `DocumentContent` component

2. **Markdown Processing** - Some pages use markdown processors
   - Solution: Ensure markdown output is compatible with DS components

3. **Breaking Changes** - Removing `.prose` might break some styles
   - Solution: Test thoroughly before removing styles

4. **Performance** - Typography components add React overhead
   - Solution: Use `React.memo` for optimization

---

## 📝 Notes

- Tailwind Typography plugin is **not installed** - we're using custom `.prose` styles
- All typography styles should use DS tokens
- Typography components should be accessible (semantic HTML)
- Support both light and dark mode

---

**Status:** 📋 Planning  
**Priority:** ⭐⭐⭐ High (DS Compliance)  
**Estimated Time:** 2-3 days

