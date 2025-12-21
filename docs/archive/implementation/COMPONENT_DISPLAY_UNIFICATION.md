# Component Display Unification Plan

**Status:** Planning  
**Priority:** P0  
**Last Updated:** 2025-01-XX

---

## 🎯 Goal

Unify component display across all locations in Fragment UI Studio:
1. **Documentation pages** (`apps/www/app/docs/components/[component]/page.tsx`)
2. **Library tab** (`apps/demo/app/studio?tab=library`)
3. **Left sidebar Library** (`apps/demo/src/components/playground/playground-left-sidebar.tsx`)
4. **Component Inspector** (`apps/demo/src/components/playground/element-inspector.tsx`)

All components should:
- Look identical across all locations
- Use the same preview rendering
- Share the same metadata structure
- Support automated addition of new components

---

## 📊 Current State Analysis

### 1. Documentation Pages (`apps/www`)

**Location:** `apps/www/app/docs/components/accordion/page.tsx`

**Current Implementation:**
- Uses `DocLayout` wrapper
- Manual component examples in JSX
- Manual code blocks
- Manual features list
- Manual accessibility notes

**Example:**
```tsx
<Accordion type="single" collapsible className="w-full">
  <AccordionItem value="item-1">
    <AccordionTrigger>Is it accessible?</AccordionTrigger>
    <AccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
  </AccordionItem>
</Accordion>
```

**Issues:**
- Manual maintenance required
- Inconsistent formatting
- No automatic preview generation
- No connection to registry

---

### 2. Library Tab (`apps/demo`)

**Location:** `apps/demo/src/components/playground/components-gallery.tsx`

**Current Implementation:**
- Uses `ComponentsGallery` component
- Grid layout with cards
- Uses `ReactLiveRenderer` for preview
- Generates preview code from registry
- Shows package, version, note

**Example:**
```tsx
<Card>
  <CardHeader>
    <CardTitle>{component.name}</CardTitle>
  </CardHeader>
  <CardContent>
    <ReactLiveRenderer code={previewCode} />
    <div>Package: {component.package}</div>
  </CardContent>
</Card>
```

**Issues:**
- Different layout than documentation
- Preview code generation is basic
- No examples/variants display
- No features/accessibility info

---

### 3. Left Sidebar Library (`apps/demo`)

**Location:** `apps/demo/src/components/playground/playground-left-sidebar.tsx`

**Current Implementation:**
- Tree view with component names
- Hardcoded `ALL_COMPONENTS` list
- No preview
- No metadata display

**Example:**
```tsx
const ALL_COMPONENTS = [
  "accordion",
  "activity-feed",
  // ... hardcoded list
];
```

**Issues:**
- Hardcoded component list (not from registry)
- No preview on hover/click
- No metadata display
- Different from other locations

---

### 4. Component Inspector (`apps/demo`)

**Location:** `apps/demo/src/components/playground/element-inspector.tsx`

**Current Implementation:**
- Shows selected element properties
- Basic DSL editing
- No component preview
- No component documentation

**Issues:**
- No preview of component
- No documentation link
- No examples/variants

---

## 🏗️ Proposed Solution

### Unified Component Display System

Create a shared component system that works across all locations:

```
packages/ui/src/component-display/
├── ComponentCard.tsx          # Card view (Library tab)
├── ComponentTreeItem.tsx      # Tree item (Left sidebar)
├── ComponentDocumentation.tsx # Full page (Documentation)
├── ComponentPreview.tsx        # Preview renderer (shared)
├── ComponentMetadata.tsx       # Metadata display (shared)
└── hooks/
    ├── useComponentRegistry.ts # Registry access
    ├── useComponentPreview.ts  # Preview code generation
    └── useComponentExamples.ts # Examples loading
```

### Registry Enhancement

Extend registry format to include all needed metadata:

```typescript
interface EnhancedComponentInfo {
  name: string;
  import: string;
  package: "@fragment_ui/ui" | "@fragment_ui/blocks";
  note?: string;
  
  // New fields for unified display
  description?: string;           // Component description
  examples?: ComponentExample[];  // Multiple examples
  variants?: Variant[];           // Component variants
  features?: string[];            // Feature list
  accessibility?: {
    role?: string;
    notes?: string;
    wcag?: string[];
  };
  props?: PropDefinition[];       // Full prop definitions
  slots?: Slot[];                 // Component slots
  related?: string[];             // Related components
}
```

### Automated Component Registration

Create script to automatically:
1. Scan `packages/ui/src/components/` for new components
2. Extract metadata from component files
3. Generate registry entries
4. Generate documentation pages
5. Generate preview examples

---

## 📋 Implementation Plan

### Phase 1: Create Shared Components (1 week)

**Tasks:**
1. Create `ComponentPreview` - unified preview renderer
2. Create `ComponentMetadata` - metadata display component
3. Create `useComponentRegistry` hook - registry access
4. Create `useComponentPreview` hook - preview code generation

**Files:**
- `packages/ui/src/component-display/ComponentPreview.tsx` (new)
- `packages/ui/src/component-display/ComponentMetadata.tsx` (new)
- `packages/ui/src/component-display/hooks/useComponentRegistry.ts` (new)
- `packages/ui/src/component-display/hooks/useComponentPreview.ts` (new)

**Acceptance Criteria:**
- ComponentPreview renders components identically everywhere
- ComponentMetadata displays consistent info
- Hooks work in both apps/www and apps/demo

---

### Phase 2: Enhance Registry Format (3 days)

**Tasks:**
1. Extend registry schema with new fields
2. Update registry.json with enhanced metadata
3. Create migration script for existing components
4. Update registry validator

**Files:**
- `packages/registry/src/types.ts` (update)
- `packages/registry/registry.json` (update)
- `scripts/migrate-registry.mjs` (new)
- `packages/registry/src/validator.ts` (update)

**Acceptance Criteria:**
- Registry includes all new fields
- Existing components migrated
- Validator checks new fields

---

### Phase 3: Update Documentation Pages (2 days)

**Tasks:**
1. Create `ComponentDocumentation` component
2. Update all documentation pages to use it
3. Generate pages from registry

**Files:**
- `packages/ui/src/component-display/ComponentDocumentation.tsx` (new)
- `apps/www/app/docs/components/[component]/page.tsx` (update - use shared component)
- `scripts/generate-docs.mjs` (new - auto-generate pages)

**Acceptance Criteria:**
- All docs pages use shared component
- Consistent layout and styling
- Auto-generated from registry

---

### Phase 4: Update Library Tab (2 days)

**Tasks:**
1. Create `ComponentCard` component
2. Update `ComponentsGallery` to use it
3. Use shared preview and metadata

**Files:**
- `packages/ui/src/component-display/ComponentCard.tsx` (new)
- `apps/demo/src/components/playground/components-gallery.tsx` (update)

**Acceptance Criteria:**
- Library tab matches documentation style
- Uses shared preview component
- Shows all metadata consistently

---

### Phase 5: Update Left Sidebar (2 days)

**Tasks:**
1. Create `ComponentTreeItem` component
2. Update left sidebar to use registry (not hardcoded list)
3. Add preview on hover/click
4. Add metadata tooltip

**Files:**
- `packages/ui/src/component-display/ComponentTreeItem.tsx` (new)
- `apps/demo/src/components/playground/playground-left-sidebar.tsx` (update)

**Acceptance Criteria:**
- Left sidebar reads from registry
- Preview available on hover/click
- Consistent with other locations

---

### Phase 6: Update Inspector (2 days)

**Tasks:**
1. Add component preview to inspector
2. Add documentation link
3. Add examples/variants display

**Files:**
- `apps/demo/src/components/playground/element-inspector.tsx` (update)

**Acceptance Criteria:**
- Inspector shows component preview
- Links to documentation
- Shows examples/variants

---

### Phase 7: Automation Scripts (3 days)

**Tasks:**
1. Create component scanner
2. Create registry generator
3. Create documentation generator
4. Create preview example generator

**Files:**
- `scripts/scan-components.mjs` (new)
- `scripts/generate-registry.mjs` (update)
- `scripts/generate-docs.mjs` (new)
- `scripts/generate-examples.mjs` (new)

**Acceptance Criteria:**
- New components automatically added to registry
- Documentation pages auto-generated
- Preview examples auto-generated
- CI/CD integration works

---

## 🎨 Design Specifications

### Component Card (Library Tab)

```
┌─────────────────────────────────┐
│ Component Name          [Open]  │
├─────────────────────────────────┤
│                                 │
│      [Preview Area]            │
│      (300px height)            │
│                                 │
├─────────────────────────────────┤
│ Package: @fragment_ui/ui          │
│ Version: 1.0.0                 │
│ Note: Component description    │
└─────────────────────────────────┘
```

### Component Tree Item (Left Sidebar)

```
📁 Components
  ├─ 📄 accordion
  ├─ 📄 button
  └─ 📄 card
```

**On hover/click:**
- Show preview tooltip
- Show metadata
- Link to documentation

### Component Documentation Page

```
┌─────────────────────────────────┐
│ Breadcrumbs                      │
│ Component Name                  │
│ Description                      │
├─────────────────────────────────┤
│ Overview                         │
│ Install                          │
│ Examples                         │
│   [Preview 1]                   │
│   [Preview 2]                   │
│ Code                             │
│ Features                         │
│ Accessibility                    │
│ Links                            │
└─────────────────────────────────┘
```

---

## 🔄 Migration Strategy

### Step 1: Create Shared Components
- Build new components in `packages/ui`
- Test in isolation
- No breaking changes

### Step 2: Update One Location
- Start with Library tab (easiest)
- Verify it works
- Get feedback

### Step 3: Roll Out to Other Locations
- Update documentation pages
- Update left sidebar
- Update inspector

### Step 4: Enable Automation
- Add scanning scripts
- Add generation scripts
- Integrate with CI/CD

---

## 📝 Registry Format Example

```json
{
  "accordion": {
    "name": "accordion",
    "import": "Accordion, AccordionItem, AccordionTrigger, AccordionContent",
    "package": "@fragment_ui/ui",
    "description": "Accordion component for displaying collapsible content sections. Supports single and multiple open items.",
    "examples": [
      {
        "name": "Single Open",
        "code": "<Accordion type=\"single\" collapsible>...</Accordion>",
        "preview": "accordion-single"
      },
      {
        "name": "Multiple Open",
        "code": "<Accordion type=\"multiple\">...</Accordion>",
        "preview": "accordion-multiple"
      }
    ],
    "variants": [
      {
        "name": "single",
        "props": { "type": "single", "collapsible": true }
      },
      {
        "name": "multiple",
        "props": { "type": "multiple" }
      }
    ],
    "features": [
      "Single or multiple open items",
      "Animated transitions",
      "Accessible via Radix UI",
      "Keyboard navigation"
    ],
    "accessibility": {
      "role": "region",
      "notes": "Uses Radix UI which provides full keyboard navigation and ARIA attributes following WAI-ARIA patterns.",
      "wcag": ["2.1.1", "2.1.2", "4.1.2"]
    },
    "props": [
      {
        "name": "type",
        "type": "'single' | 'multiple'",
        "default": "single",
        "description": "Type of accordion behavior"
      }
    ],
    "related": ["collapsible", "tabs"]
  }
}
```

---

## ✅ Success Criteria

1. **Visual Consistency:** All component displays look identical
2. **Functional Consistency:** Same preview, metadata, examples everywhere
3. **Automation:** New components automatically appear everywhere
4. **Maintainability:** Single source of truth (registry)
5. **Developer Experience:** Easy to add new components

---

## 🚨 Risks & Mitigation

### Risk 1: Breaking Changes
- **Mitigation:** Gradual migration, feature flags, backward compatibility

### Risk 2: Performance
- **Mitigation:** Lazy loading, code splitting, memoization

### Risk 3: Registry Size
- **Mitigation:** Incremental loading, caching, pagination

---

**Last Updated:** 2025-01-XX  
**Next Steps:** Review plan, start Phase 1 implementation

