/**
 * UI-DSL v2 Types
 * 
 * Layout-first, datasources, slots for AI-native generation.
 * Based on Copilot specification (docs/copilot/contract.md)
 */

/**
 * UUID v4 identifier
 */
export type Id = string;

/**
 * Size tokens
 */
export type Size = "sm" | "md" | "lg" | "xl";

/**
 * Common properties for all UI nodes
 */
export interface UiCommon {
  id: Id;
  name?: string;
  a11y?: {
    ariaLabel?: string;
    describedBy?: string;
    ariaLabelledBy?: string;
    role?: string;
  };
  layout?: {
    maxWidth?: Size;
    gap?: number;
    colSpan?: number;
    padding?: Size;
    margin?: Size;
  };
  testId?: string; // for E2E tests
  dataUiId?: string; // for patch-ops (mirror = id)
}

/**
 * Data source types
 */
export type DataSource =
  | { id: Id; kind: "placeholder"; shape?: "table" | "cards" | "metrics" | "list" }
  | { id: Id; kind: "static"; data: any }
  | { id: Id; kind: "url"; url: string; method?: "GET" | "POST" | "PUT" | "DELETE"; path?: string; headers?: Record<string, string> };

/**
 * Binding for datasource → prop mapping
 */
export interface Binding {
  sourceId: Id;
  path: string; // JSON path in datasource (e.g., "users[0].name")
  prop: string; // Component prop name (e.g., "value", "label")
}

/**
 * UI Node types (union)
 */
export type UiNode = UiPage | UiSection | UiGrid | UiStack | UiTwoColumn | UiThreeColumn | UiSidebar | UiBlockRef | UiComponent;

/**
 * Page node (root)
 */
export interface UiPage extends UiCommon {
  type: "page";
  title?: string;
  description?: string;
  children: UiNode[]; // sections, grids, blocks, components
  dataSources?: DataSource[]; // global datasources
  metadata?: {
    version?: string;
    generatedAt?: string;
    source?: string; // Original prompt
  };
}

/**
 * Section node (container)
 * Supports specialized section types for complex screens
 */
export interface UiSection extends UiCommon {
  type: "section";
  title?: string;
  variant?: "card" | "panel" | "hero" | "plain" | "banner";
  children: UiNode[];
  
  // Specialized section types for complex screens
  kind?: SectionKind;
  sectionData?: SectionData;
}

/**
 * Section kinds for complex screens
 */
export type SectionKind =
  | "hero"
  | "pricing"
  | "featureGrid"
  | "stats"
  | "testimonials"
  | "faq"
  | "dataTable"
  | "chart"
  | "cta";

/**
 * Section-specific data based on kind
 */
export type SectionData =
  | HeroSectionData
  | PricingSectionData
  | FeatureGridSectionData
  | StatsSectionData
  | TestimonialsSectionData
  | FAQSectionData
  | DataTableSectionData
  | ChartSectionData
  | CTASectionData;

/**
 * Hero section data
 */
export interface HeroSectionData {
  kind: "hero";
  title: string;
  description?: string;
  cta?: {
    primary?: {
      label: string;
      action?: string;
    };
    secondary?: {
      label: string;
      action?: string;
    };
  };
  image?: {
    src: string;
    alt: string;
  };
  background?: "gradient" | "image" | "solid";
}

/**
 * Pricing section data
 */
export interface PricingSectionData {
  kind: "pricing";
  title: string;
  description?: string;
  tiers: Array<{
    name: string;
    price: string;
    period?: string;
    features: string[];
    cta: {
      label: string;
      action?: string;
    };
  }>;
  layout?: "grid" | "stack";
}

/**
 * Feature grid section data
 */
export interface FeatureGridSectionData {
  kind: "featureGrid";
  title: string;
  features: Array<{
    icon?: string;
    title: string;
    description: string;
  }>;
  columns?: 2 | 3 | 4;
}

/**
 * Stats section data
 */
export interface StatsSectionData {
  kind: "stats";
  items: Array<{
    label: string;
    value: string | number;
    trend?: "up" | "down" | "neutral";
    change?: string;
  }>;
  layout?: "grid" | "row";
}

/**
 * Testimonials section data
 */
export interface TestimonialsSectionData {
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

/**
 * FAQ section data
 */
export interface FAQSectionData {
  kind: "faq";
  title: string;
  items: Array<{
    question: string;
    answer: string;
  }>;
}

/**
 * Data table section data
 */
export interface DataTableSectionData {
  kind: "dataTable";
  title: string;
  columns: Array<{
    key: string;
    label: string;
    sortable?: boolean;
  }>;
  dataSourceId?: Id; // Reference to DataSource
  pagination?: boolean;
  filters?: Array<{
    key: string;
    type: "text" | "select" | "date";
  }>;
}

/**
 * Chart section data
 */
export interface ChartSectionData {
  kind: "chart";
  title: string;
  chartType: "line" | "bar" | "pie" | "area";
  dataSourceId?: Id; // Reference to DataSource
  dimensions?: {
    width?: number;
    height?: number;
  };
}

/**
 * CTA section data
 */
export interface CTASectionData {
  kind: "cta";
  title: string;
  description?: string;
  cta: {
    label: string;
    action?: string;
  };
  variant?: "primary" | "secondary" | "outline";
}

/**
 * Grid node (layout)
 */
export interface UiGrid extends UiCommon {
  type: "grid";
  columns: number; // 2, 3, 4, etc.
  responsive?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  children: UiNode[];
}

/**
 * Stack layout node (vertical/horizontal stacking)
 */
export interface UiStack extends UiCommon {
  type: "stack";
  direction?: "vertical" | "horizontal";
  gap?: number;
  children: UiNode[];
}

/**
 * Two-column layout node
 */
export interface UiTwoColumn extends UiCommon {
  type: "twoColumn";
  ratio?: "1:1" | "1:2" | "2:1";
  gap?: number;
  responsive?: {
    breakpoint?: "sm" | "md" | "lg";
    stack?: boolean; // Stack on smaller screens
  };
  children: UiNode[]; // First child = left column, second child = right column
}

/**
 * Three-column layout node
 */
export interface UiThreeColumn extends UiCommon {
  type: "threeColumn";
  ratios?: [number, number, number]; // e.g., [1, 2, 1]
  gap?: number;
  responsive?: {
    breakpoint?: "sm" | "md" | "lg";
    stack?: boolean;
  };
  children: UiNode[]; // First child = left, second = middle, third = right
}

/**
 * Sidebar layout node
 */
export interface UiSidebar extends UiCommon {
  type: "sidebar";
  position: "left" | "right";
  sidebarWidth?: "sm" | "md" | "lg";
  contentMaxWidth?: "sm" | "md" | "lg" | "xl" | "full";
  gap?: number;
  children: UiNode[]; // First child = sidebar, rest = main content
}

/**
 * Block reference (reusable block from @fragment_ui/blocks)
 */
export interface UiBlockRef extends UiCommon {
  type: "block";
  ref: string; // "@fragment_ui/blocks/pricing-table" or "local-block-id"
  inputs?: Record<string, any>; // e.g., { plans: [...], ctaCopy: "..." }
}

/**
 * Component node (Fragment UI component)
 */
export interface UiComponent extends UiCommon {
  type: "component";
  component: string; // "Button" | "Input" | "DataTable" | etc. (from registry)
  props?: Record<string, any>; // only props from registry
  children?: UiNode[]; // child nodes (for containers like Card, Dialog)
  slots?: Record<string, UiNode[]>; // e.g., { header: [...], body: [...], footer: [...] }
  variant?: string; // from registry variants
  copy?: string; // simple microcopy (for Button, Label, etc.)
  bind?: Binding[]; // datasource → prop mappings
}

/**
 * Patch operation types
 */
export type PatchOp =
  | "setProp"
  | "setCopy"
  | "toggleVariant"
  | "addNode"
  | "removeNode"
  | "moveNode"
  | "wrapWith"
  | "reorder"
  | "rename"
  | "setToken"
  | "setBinding"
  | "setDataSource";

/**
 * Patch operation
 */
export interface Patch {
  targetId: Id;
  op: PatchOp;
  args: Record<string, any>; // e.g., { path: "props.variant", value: "outline" }
}

/**
 * Validation diagnostic
 */
export interface Diagnostic {
  level: "error" | "warning" | "info";
  message: string;
  path?: string; // JSON path to the issue
  code?: string; // Error code (e.g., "INVALID_COMPONENT", "MISSING_PROP")
}

/**
 * Validation result
 */
export interface ValidationResult {
  valid: boolean;
  diagnostics: Diagnostic[];
}

