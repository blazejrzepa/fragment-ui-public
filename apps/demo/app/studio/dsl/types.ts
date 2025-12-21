/**
 * UI-DSL Types
 * 
 * Minimal JSON contract between prompt and TSX generation.
 * This is the intermediate representation that the generator uses.
 * 
 * v1.1: Extended with ID, metadata, and layout operations for conversational editing.
 * v2.0: Extended with AXL (Agentic Experience Layer) - Action Contracts, Intent, Constraints, Evaluation.
 */

export type UiDsl =
  | UiForm
  | UiPage
  | UiTable
  | UiDashboard
  | UiDecision;

/**
 * Action Contract - defines the semantics and constraints of an action (CTA)
 * Used for agent-readable UI and synthetic testing
 */
export type ActionContract = {
  id: string;                    // UUID v4 - stable identifier for the action
  label: string;                 // Human-readable label
  kind: "hard" | "soft";         // hard = destructive/irreversible, soft = reversible
  riskLevel?: "low" | "medium" | "high";  // Risk assessment
  requiresConfirmation?: boolean; // Whether user confirmation is required
  preauthAllowed?: boolean;      // Whether action can be pre-authorized (only for soft actions)
  sideEffects?: string[];        // List of side effects (e.g., ["sends-email", "creates-record"])
  telemetry?: {                  // Telemetry configuration
    eventName?: string;
    properties?: Record<string, any>;
  };
};

/**
 * UI Intent - primary and secondary intents of the UI
 */
export type UiIntent = {
  primary?: string;              // Primary intent (e.g., "purchase", "signup", "compare")
  secondary?: string[];          // Secondary intents (e.g., ["learn-more", "contact"])
};

/**
 * UI Constraints - hard and soft constraints
 */
export type UiConstraints = {
  hard?: Array<{                 // Hard constraints (must be satisfied)
    type: string;                // e.g., "budget", "deadline", "accessibility"
    condition: string;           // e.g., "budget <= 500", "deadline >= 2025-01-01"
  }>;
  soft?: Array<{                 // Soft constraints (preferences)
    type: string;
    condition: string;
    weight?: number;             // Weight for optimization (0-1)
  }>;
};

/**
 * UI Evaluation - success metrics and evaluation criteria
 */
export type UiEvaluation = {
  successMetrics?: Array<{       // Metrics to evaluate success
    name: string;                // e.g., "conversion-rate", "time-to-complete"
    target?: number;              // Target value
    unit?: string;                // e.g., "%", "seconds"
  }>;
};

export type UiCommon = {
  id: string;                    // UUID v4 - stable identifier for patches
  key?: string;                  // React key (optional, defaults to id)
  name?: string;                 // Optional name for refactoring
  "data-test-id"?: string;       // For Playwright tests
  title?: string;
  description?: string;          // Optional description text
  layout?: { 
    maxWidth?: "sm" | "md" | "lg" | "xl"; 
    gap?: number;
    type?: "stack" | "grid" | "two-column";  // Layout type for operations
    columns?: number;            // For grid layout
    colSpan?: number;            // For grid items
    radius?: number;             // Border radius (in pixels)
  };
  a11y?: { 
    ariaDescribedBy?: string;
    ariaLabel?: string;
  };
  // AXL (Agentic Experience Layer) extensions
  intent?: UiIntent;             // Primary and secondary intents
  constraints?: UiConstraints;  // Hard and soft constraints
  evaluation?: UiEvaluation;     // Success metrics
  actions?: ActionContract[];    // Action contracts for CTAs
};

export type UiForm = UiCommon & {
  type: "form";
  fields: Array<{
    id: string;                  // UUID v4 for each field
    name: string;
    label: string;
    component: "Input" | "PasswordInput" | "Checkbox" | "Select" | "Switch" | "Textarea";
    options?: string[];
    validation?: string; // e.g., "email|required" or "min:8|required"
    placeholder?: string;
    description?: string;
    required?: boolean;
  }>;
  actions?: Array<{ 
    id: string;                  // UUID v4 for each action
    type: "submit" | "reset" | "button"; 
    label: string; 
    variant?: "primary" | "secondary" | "ghost";
    onClick?: string; // Optional handler code
  }>;
  onSubmit?: string; // Optional handler code
};

/**
 * Layout types for pages and screens
 * Extended for Milestone 3.1: Screen DSL
 */
export type UiLayout =
  | { type: "dashboard"; areas: Array<"header" | "sidebar" | "content" | "footer">; grid?: { cols: number; gap: number } }
  | { type: "marketing"; hero?: boolean; sections: Array<"features" | "proof" | "pricing" | "faq" | "cta"> }
  | { type: "two-column"; ratio?: "1:1" | "1:2" | "2:1" }
  | { type: "grid"; columns: number; gap: number; maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full" }
  | { type: "stack"; gap: number; maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full" };

/**
 * Screen regions for page layouts
 */
export type UiScreenRegion = "header" | "sidebar" | "content" | "footer" | "main";

/**
 * Module types for reusable screen sections
 * Extended for Milestone 3.1: Screen DSL
 */
export type UiModuleType =
  | "hero"                    // Hero section with title, description, CTA
  | "pricing"                 // Pricing table with tiers
  | "faq"                     // FAQ accordion
  | "navigation"              // Navigation module (generic)
  | "navigation-header"       // Navigation header with logo, menu, user menu
  | "navigation-sidebar"      // Navigation sidebar with menu items
  | "testimonials"            // Testimonials carousel
  | "data-table-section"      // Data table with filters
  | "kpi-header"              // KPI metrics header
  | "features"                // Features grid
  | "proof"                   // Social proof (logos, stats)
  | "cta"                     // Call-to-action section
  | "navigation"              // Navigation header
  | "footer"                  // Footer with links
  | "breadcrumbs";            // Breadcrumb navigation

/**
 * Module definition for screen composition
 */
export type UiModule = {
  id: string;                  // UUID v4
  type: UiModuleType;
  title?: string;
  description?: string;
  props?: Record<string, any>; // Module-specific properties
  slots?: Record<string, UiDsl[]>; // Named slots for module content
  data?: UiDataSource;        // Data binding for module
};

/**
 * Data source types for sections and modules
 * Extended for Milestone 3.1: Screen DSL with mock data schema
 */
export type UiDataSource =
  | { kind: "placeholder" }
  | { kind: "static"; data: any }
  | { kind: "http"; url: string; method?: "GET" | "POST"; params?: Record<string, any> }
  | { kind: "mock"; schema: MockDataSchema; count?: number }; // Mock data with schema

/**
 * Mock data schema for generating placeholder data
 */
export type MockDataSchema = {
  [key: string]: {
    type: "string" | "number" | "boolean" | "date" | "array" | "object";
    generator?: "name" | "email" | "phone" | "url" | "lorem" | "number" | "boolean" | "date";
    min?: number;
    max?: number;
    items?: MockDataSchema; // For array/object types
  };
};

/**
 * Page/Screen DSL - Extended for Milestone 3.1
 * Supports regions, modules, and complex layouts
 */
export type UiPage = Omit<UiCommon, "layout"> & {
  type: "page" | "screen";      // "screen" is alias for "page" with regions
  layout?: UiLayout;
  // Regions for screen layouts (header, sidebar, content, footer)
  regions?: Record<UiScreenRegion, {
    id: string;
    modules?: UiModule[];       // Modules in this region
    content?: UiDsl[];          // Direct content (components)
  }>;
  // Sections for page layouts (backward compatible)
  sections?: Array<{ 
    id: string;                  // UUID v4 for each section
    kind: string;                // Extended to support layout-specific kinds
    title?: string;
    content: UiDsl[] | Record<string, UiDsl[]>;
    data?: UiDataSource;         // Optional data source for section
    // Extended for Milestone 3.1
    module?: UiModuleType;      // If section uses a module pattern
    moduleProps?: Record<string, any>; // Module-specific props
  }>;
};

export type UiTable = UiCommon & {
  type: "table";
  columns: Array<{ 
    id: string;                  // UUID v4 for each column
    key: string; 
    label: string; 
    kind?: "text" | "badge" | "date" | "actions";
    width?: string;
    sortable?: boolean;           // Enable sorting for this column
    filterable?: boolean;         // Enable filtering for this column
  }>;
  dataSource: "placeholder" | "url" | "static";
  data?: Array<Record<string, any>>; // For static data
  filters?: Array<{ 
    id: string;                  // UUID v4 for each filter
    type: "search" | "select" | "dateRange"; 
    key: string; 
    options?: string[];
    placeholder?: string;
  }>;
  pagination?: { 
    pageSize: number;
    showSizeChanger?: boolean;
  };
  // Enhanced features
  sortable?: boolean;             // Enable sorting (default: false)
  filterable?: boolean;          // Enable filtering (default: false)
  selectable?: boolean;          // Enable row selection (default: false)
};

export type UiDashboard = UiCommon & {
  type: "dashboard";
  widgets: Array<{ 
    id: string;                  // UUID v4 for each widget
    kind: "metric" | "chart" | "table"; 
    title?: string;
    data?: any;
  }>;
};

/**
 * Decision Pattern - for complex decision-making UIs
 * Uses blocks from @fragment_ui/blocks/decision
 */
export type UiDecision = UiCommon & {
  type: "decision";
  pattern: "compare-3" | "recommendation" | "tradeoffs" | "review-confirm";
  options: Array<{
    id: string;
    name: string;
    description?: string;
    [key: string]: any; // Pattern-specific properties
  }>;
  summary?: string; // Optional summary/description
};

/**
 * Generate UUID v4
 * Uses crypto.randomUUID() if available, otherwise falls back to a simple implementation
 */
export function generateId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for environments without crypto.randomUUID
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Helper type for validation
export function isUiForm(dsl: UiDsl): dsl is UiForm {
  return dsl.type === "form";
}

export function isUiPage(dsl: UiDsl): dsl is UiPage {
  return dsl.type === "page";
}

export function isUiTable(dsl: UiDsl): dsl is UiTable {
  return dsl.type === "table";
}

export function isUiDashboard(dsl: UiDsl): dsl is UiDashboard {
  return dsl.type === "dashboard";
}

export function isUiDecision(dsl: UiDsl): dsl is UiDecision {
  return dsl.type === "decision";
}

