# UI-DSL v2 - Complex Screens Specification

**Version:** 1.0  
**Status:** Specification  
**Last Updated:** 2025-01-XX

---

## 📋 Overview

This document specifies how UI-DSL v2 supports complex screens (dashboards, landing pages, flows) with sections, layouts, and responsive rules.

---

## 🎯 Goals

1. **Layout-First:** Define layout structure before components
2. **Sections:** Reusable screen sections (hero, pricing, FAQ, etc.)
3. **Responsive:** Support responsive breakpoints
4. **Composable:** Sections compose into full screens

---

## 📦 Section Types

### Hero Section

```typescript
interface HeroSection {
  type: "section";
  kind: "hero";
  title: string;
  description?: string;
  cta?: {
    primary?: ActionContract;
    secondary?: ActionContract;
  };
  image?: {
    src: string;
    alt: string;
  };
  background?: "gradient" | "image" | "solid";
}
```

**Usage:** Landing pages, marketing pages

---

### Pricing Section

```typescript
interface PricingSection {
  type: "section";
  kind: "pricing";
  title: string;
  description?: string;
  tiers: Array<{
    name: string;
    price: string;
    period?: string;
    features: string[];
    cta: ActionContract;
  }>;
  layout?: "grid" | "stack";
}
```

**Usage:** Landing pages, pricing pages

---

### Feature Grid

```typescript
interface FeatureGridSection {
  type: "section";
  kind: "featureGrid";
  title: string;
  features: Array<{
    icon?: string;
    title: string;
    description: string;
  }>;
  columns?: 2 | 3 | 4;
}
```

**Usage:** Landing pages, product pages

---

### FAQ Section

```typescript
interface FAQSection {
  type: "section";
  kind: "faq";
  title: string;
  items: Array<{
    question: string;
    answer: string;
  }>;
}
```

**Usage:** Landing pages, help pages

---

### Data Table Section

```typescript
interface DataTableSection {
  type: "section";
  kind: "dataTable";
  title: string;
  columns: Array<{
    key: string;
    label: string;
    sortable?: boolean;
  }>;
  dataSource: DataSource;
  pagination?: boolean;
  filters?: Array<{
    key: string;
    type: "text" | "select" | "date";
  }>;
}
```

**Usage:** Dashboards, admin panels

---

### Chart Placeholder

```typescript
interface ChartSection {
  type: "section";
  kind: "chart";
  title: string;
  chartType: "line" | "bar" | "pie" | "area";
  dataSource: DataSource;
  dimensions?: {
    width?: number;
    height?: number;
  };
}
```

**Usage:** Dashboards, analytics pages

---

### Stats Section

```typescript
interface StatsSection {
  type: "section";
  kind: "stats";
  items: Array<{
    label: string;
    value: string | number;
    trend?: "up" | "down" | "neutral";
    change?: string;
  }>;
  layout?: "grid" | "row";
}
```

**Usage:** Dashboards, overview pages

---

### Testimonials Section

```typescript
interface TestimonialsSection {
  type: "section";
  kind: "testimonials";
  title: string;
  items: Array<{
    quote: string;
    author: string;
    role?: string;
    avatar?: string;
  }>;
  layout?: "carousel" | "grid";
}
```

**Usage:** Landing pages, marketing pages

---

## 🏗️ Layout Types

### Grid Layout

```typescript
interface GridLayout {
  type: "grid";
  columns: number;              // 1-12
  gap: number;                  // Spacing between items
  responsive?: {
    sm?: number;                // Columns on small screens
    md?: number;                // Columns on medium screens
    lg?: number;                // Columns on large screens
  };
}
```

---

### Stack Layout

```typescript
interface StackLayout {
  type: "stack";
  gap: number;
  direction?: "vertical" | "horizontal";
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
}
```

---

### Two-Column Layout

```typescript
interface TwoColumnLayout {
  type: "two-column";
  ratio?: "1:1" | "1:2" | "2:1";
  gap?: number;
  responsive?: {
    breakpoint: "sm" | "md" | "lg";
    stack?: boolean;            // Stack on smaller screens
  };
}
```

---

### Three-Column Layout

```typescript
interface ThreeColumnLayout {
  type: "three-column";
  ratios?: [number, number, number]; // e.g., [1, 2, 1]
  gap?: number;
  responsive?: {
    breakpoint: "sm" | "md" | "lg";
    stack?: boolean;
  };
}
```

---

### Sidebar Layout

```typescript
interface SidebarLayout {
  type: "sidebar";
  position: "left" | "right";
  sidebarWidth?: "sm" | "md" | "lg";
  contentMaxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  gap?: number;
}
```

---

### Dashboard Layout

```typescript
interface DashboardLayout {
  type: "dashboard";
  areas: Array<"header" | "sidebar" | "content" | "footer">;
  grid?: {
    cols: number;              // Grid columns (e.g., 12)
    gap: number;
  };
}
```

---

## 📐 Responsive Rules

```typescript
interface ResponsiveRules {
  breakpoints: {
    sm: number;                 // e.g., 640px
    md: number;                 // e.g., 768px
    lg: number;                 // e.g., 1024px
    xl: number;                 // e.g., 1280px
  };
  rules: Array<{
    breakpoint: "sm" | "md" | "lg" | "xl";
    property: string;           // e.g., "columns", "gap"
    value: any;
  }>;
}
```

---

## 🎨 Screen Scaffolds

### Dashboard Scaffold

```typescript
const dashboardScaffold: UiPage = {
  type: "page",
  layout: {
    type: "dashboard",
    areas: ["header", "sidebar", "content", "footer"],
    grid: { cols: 12, gap: 4 }
  },
  sections: [
    { kind: "header", content: [/* navigation */] },
    { kind: "sidebar", content: [/* nav menu */] },
    { kind: "content", content: [/* widgets, tables */] },
    { kind: "footer", content: [/* footer */] }
  ]
};
```

---

### Landing Page Scaffold

```typescript
const landingScaffold: UiPage = {
  type: "page",
  layout: {
    type: "stack",
    gap: 8,
    maxWidth: "xl"
  },
  sections: [
    { kind: "hero", ... },
    { kind: "featureGrid", ... },
    { kind: "pricing", ... },
    { kind: "testimonials", ... },
    { kind: "faq", ... },
    { kind: "cta", ... }
  ]
};
```

---

## 🔄 Generation Flow

### 1. Intent Detection

```typescript
function detectIntent(prompt: string): Intent {
  // Detect screen type: dashboard, landing, settings, auth
  // Detect sections needed: hero, pricing, FAQ, etc.
  // Detect layout preferences
}
```

---

### 2. Scaffold Selection

```typescript
function selectScaffold(intent: Intent): Scaffold {
  // Select appropriate scaffold
  // Or generate custom scaffold based on intent
}
```

---

### 3. Section Generation

```typescript
function generateSections(intent: Intent, scaffold: Scaffold): Section[] {
  // Generate sections based on intent
  // Use @fragment_ui/blocks where possible
  // Fallback to @fragment_ui/ui composition
}
```

---

### 4. Layout Application

```typescript
function applyLayout(sections: Section[], layout: Layout): UiPage {
  // Apply layout to sections
  // Set responsive rules
  // Set container constraints
}
```

---

## 📝 Acceptance Criteria

1. ✅ Prompt "dashboard for SaaS admin" generates screen with sidebar/nav + header + widgets + table
2. ✅ Prompt "landing page for webinar" generates hero + value props + CTA + FAQ
3. ✅ All sections render without bundler errors
4. ✅ Layouts are responsive
5. ✅ Sections use @fragment_ui/blocks where available
6. ✅ Fallback to @fragment_ui/ui composition works

---

## 🔗 Related Documents

- [UI-DSL v2 Types](../../packages/ui-dsl/src/types-v2.ts) - Type definitions
- [DSL Generator](../../apps/demo/src/lib/dsl-generator.ts) - Generator implementation
- [Code Generation](../../apps/demo/src/lib/dsl-codegen.ts) - TSX generation

---

**Last Updated:** 2025-01-XX

