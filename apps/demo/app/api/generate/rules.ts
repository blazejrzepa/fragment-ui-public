/**
 * Smart Rules System for Fragment UI AI Playground
 * 
 * This file contains intelligent rules and patterns for generating
 * complete applications, screens, and component flows.
 */

export interface ComponentRule {
  pattern: RegExp | string[];
  component: string;
  props?: Record<string, any>;
  context?: string[];
  priority: number;
}

export interface ScreenTemplate {
  type: string;
  name: string;
  description: string;
  components: Array<{
    component: string;
    props?: Record<string, any>;
    position?: "header" | "body" | "footer" | "sidebar";
    required?: boolean;
  }>;
  layout: "single-column" | "two-column" | "three-column" | "dashboard" | "landing";
}

export interface AppFlow {
  name: string;
  screens: ScreenTemplate[];
  navigation: Array<{
    from: string;
    to: string;
    trigger: string;
  }>;
}

/**
 * Component Usage Rules - when to use which component
 */
export const COMPONENT_RULES: ComponentRule[] = [
  // Navigation
  {
    pattern: ["navigation", "menu", "nav", "nawigacja"],
    component: "NavigationMenu",
    context: ["header", "sidebar"],
    priority: 10,
  },
  {
    pattern: ["breadcrumb", "breadcrumbs", "ścieżka"],
    component: "Breadcrumbs",
    context: ["header"],
    priority: 8,
  },
  
  // Data Display
  {
    pattern: ["table", "tabela", "data table", "grid"],
    component: "Table",
    context: ["body"],
    priority: 10,
  },
  {
    pattern: ["list", "lista", "items"],
    component: "VirtualList",
    context: ["body"],
    priority: 9,
  },
  {
    pattern: ["card", "karta", "panel"],
    component: "Card",
    context: ["body"],
    priority: 7,
  },
  
  // Forms
  {
    pattern: ["form", "formularz", "input", "field"],
    component: "Input",
    context: ["form", "body"],
    priority: 10,
  },
  {
    pattern: ["select", "dropdown", "wybierz"],
    component: "Select",
    context: ["form"],
    priority: 9,
  },
  {
    pattern: ["date", "data", "calendar"],
    component: "DatePicker",
    context: ["form"],
    priority: 9,
  },
  
  // Feedback
  {
    pattern: ["alert", "notification", "message", "powiadomienie"],
    component: "Alert",
    context: ["body", "header"],
    priority: 8,
  },
  {
    pattern: ["toast", "snackbar", "popup"],
    component: "Toast",
    context: ["global"],
    priority: 7,
  },
  {
    pattern: ["dialog", "modal", "popup", "okno"],
    component: "Dialog",
    context: ["global"],
    priority: 9,
  },
  
  // Layout
  {
    pattern: ["sidebar", "boczny", "panel"],
    component: "Sidebar",
    context: ["layout"],
    priority: 10,
  },
  {
    pattern: ["tabs", "zakładki", "sections"],
    component: "Tabs",
    context: ["body"],
    priority: 8,
  },
  {
    pattern: ["accordion", "rozwijane", "collapse"],
    component: "Accordion",
    context: ["body"],
    priority: 7,
  },
];

/**
 * Screen Type Detection Rules
 */
export const SCREEN_TYPE_RULES: Record<string, RegExp[]> = {
  dashboard: [
    /dashboard|panel|pulpit|overview|przegląd/i,
    /statistics|stats|statystyki/i,
    /metrics|metryki/i,
  ],
  landing: [
    /landing|strona główna|homepage|hero/i,
    /welcome|witamy|intro/i,
  ],
  list: [
    /list|lista|items|elementy/i,
    /table|tabela|grid/i,
    /products|produkty|users|użytkownicy/i,
  ],
  detail: [
    /detail|szczegóły|view|widok/i,
    /profile|profil|settings|ustawienia/i,
  ],
  form: [
    /form|formularz|create|utwórz|edit|edytuj/i,
    /register|rejestracja|login|logowanie/i,
  ],
  search: [
    /search|wyszukaj|find|znajdź/i,
    /filter|filtruj|sort|sortuj/i,
  ],
};

/**
 * Predefined Screen Templates
 */
export const SCREEN_TEMPLATES: Record<string, ScreenTemplate> = {
  dashboard: {
    type: "dashboard",
    name: "Dashboard",
    description: "Overview dashboard with metrics and charts",
    layout: "dashboard",
    components: [
      { component: "NavigationMenu", position: "header", required: true },
      { component: "Card", position: "body", props: { variant: "metric" } },
      { component: "Table", position: "body" },
      { component: "Progress", position: "body" },
    ],
  },
  landing: {
    type: "landing",
    name: "Landing Page",
    description: "Marketing landing page with hero section",
    layout: "single-column",
    components: [
      { component: "NavigationMenu", position: "header", required: true },
      { component: "Card", position: "body", props: { variant: "hero" } },
      { component: "Button", position: "body", props: { variant: "solid", size: "lg" } },
      { component: "Tabs", position: "body" },
    ],
  },
  list: {
    type: "list",
    name: "List View",
    description: "List or table view with filters",
    layout: "two-column",
    components: [
      { component: "NavigationMenu", position: "header", required: true },
      { component: "Input", position: "body", props: { type: "search", placeholder: "Search..." } },
      { component: "Select", position: "body", props: { placeholder: "Filter" } },
      { component: "Table", position: "body", required: true },
      { component: "Pagination", position: "footer" },
    ],
  },
  detail: {
    type: "detail",
    name: "Detail View",
    description: "Detail page with information cards",
    layout: "single-column",
    components: [
      { component: "Breadcrumbs", position: "header" },
      { component: "Card", position: "body", required: true },
      { component: "Tabs", position: "body" },
      { component: "Button", position: "body", props: { variant: "outline" } },
    ],
  },
  form: {
    type: "form",
    name: "Form",
    description: "Form page with inputs and validation",
    layout: "single-column",
    components: [
      { component: "Card", position: "body", required: true },
      { component: "Input", position: "body", required: true },
      { component: "Button", position: "body", props: { type: "submit" } },
    ],
  },
  settings: {
    type: "settings",
    name: "Settings Page",
    description: "Settings page with grouped options",
    layout: "two-column",
    components: [
      { component: "NavigationMenu", position: "header", required: true },
      { component: "Card", position: "body", required: true },
      { component: "Tabs", position: "body" },
      { component: "Switch", position: "body" },
      { component: "Select", position: "body" },
      { component: "Button", position: "body", props: { variant: "primary" } },
    ],
  },
  profile: {
    type: "profile",
    name: "Profile Page",
    description: "User profile page with avatar and information",
    layout: "single-column",
    components: [
      { component: "NavigationMenu", position: "header", required: true },
      { component: "Card", position: "body", required: true },
      { component: "Input", position: "body" },
      { component: "Textarea", position: "body" },
      { component: "Button", position: "body", props: { variant: "primary" } },
    ],
  },
  search: {
    type: "search",
    name: "Search Results",
    description: "Search results page with filters and results",
    layout: "two-column",
    components: [
      { component: "NavigationMenu", position: "header", required: true },
      { component: "Input", position: "body", props: { type: "search", placeholder: "Search..." } },
      { component: "Select", position: "body", props: { placeholder: "Filter" } },
      { component: "Card", position: "body" },
      { component: "Pagination", position: "footer" },
    ],
  },
  cart: {
    type: "cart",
    name: "Shopping Cart",
    description: "Shopping cart with items and checkout",
    layout: "two-column",
    components: [
      { component: "NavigationMenu", position: "header", required: true },
      { component: "Table", position: "body", required: true },
      { component: "Card", position: "body", props: { variant: "summary" } },
      { component: "Button", position: "body", props: { variant: "primary", size: "lg" } },
    ],
  },
};

/**
 * App Flow Templates - complete application flows
 */
export const APP_FLOW_TEMPLATES: Record<string, AppFlow> = {
  "e-commerce": {
    name: "E-commerce Application",
    screens: [
      SCREEN_TEMPLATES.landing,
      SCREEN_TEMPLATES.list,
      SCREEN_TEMPLATES.detail,
      { ...SCREEN_TEMPLATES.form, name: "Checkout" },
    ],
    navigation: [
      { from: "landing", to: "list", trigger: "Browse Products" },
      { from: "list", to: "detail", trigger: "View Product" },
      { from: "detail", to: "checkout", trigger: "Add to Cart" },
    ],
  },
  "admin-panel": {
    name: "Admin Panel",
    screens: [
      SCREEN_TEMPLATES.dashboard,
      SCREEN_TEMPLATES.list,
      SCREEN_TEMPLATES.detail,
      SCREEN_TEMPLATES.form,
    ],
    navigation: [
      { from: "dashboard", to: "list", trigger: "View Items" },
      { from: "list", to: "detail", trigger: "Edit" },
      { from: "detail", to: "form", trigger: "Save Changes" },
    ],
  },
  "onboarding": {
    name: "User Onboarding",
    screens: [
      { ...SCREEN_TEMPLATES.landing, name: "Welcome" },
      { ...SCREEN_TEMPLATES.form, name: "Registration" },
      { ...SCREEN_TEMPLATES.form, name: "Profile Setup" },
      { ...SCREEN_TEMPLATES.dashboard, name: "Dashboard" },
    ],
    navigation: [
      { from: "welcome", to: "registration", trigger: "Get Started" },
      { from: "registration", to: "profile-setup", trigger: "Continue" },
      { from: "profile-setup", to: "dashboard", trigger: "Complete" },
    ],
  },
};

/**
 * Component Composition Rules - how components work together
 */
export const COMPOSITION_RULES = {
  // Layout patterns
  layouts: {
    "single-column": {
      structure: ["header", "body", "footer"],
      maxWidth: "max-w-4xl",
    },
    "two-column": {
      structure: ["header", ["sidebar", "body"], "footer"],
      maxWidth: "max-w-7xl",
    },
    "dashboard": {
      structure: ["header", ["sidebar", ["body-grid"]], "footer"],
      maxWidth: "max-w-full",
    },
  },
  
  // Component grouping rules
  groups: {
    "form-group": {
      components: ["Input", "Select", "Textarea", "Checkbox", "Radio"],
      container: "Card",
      spacing: "space-y-4",
    },
    "action-group": {
      components: ["Button"],
      container: "div",
      spacing: "flex gap-2",
    },
    "data-group": {
      components: ["Table", "Card", "List"],
      container: "div",
      spacing: "space-y-4",
    },
  },
  
  // Required combinations
  required: {
    "Table": ["TableHeader", "TableBody", "TableRow"],
    "Select": ["SelectTrigger", "SelectContent", "SelectItem"],
    "Dialog": ["DialogTrigger", "DialogContent"],
    "Tabs": ["TabsList", "TabsTrigger", "TabsContent"],
  },
};

/**
 * Detect screen type from prompt
 */
export function detectScreenType(prompt: string): string | null {
  const lowerPrompt = prompt.toLowerCase();
  
  for (const [type, patterns] of Object.entries(SCREEN_TYPE_RULES)) {
    if (patterns.some(pattern => pattern.test(lowerPrompt))) {
      return type;
    }
  }
  
  return null;
}

/**
 * Detect app flow from prompt
 */
export function detectAppFlow(prompt: string): string | null {
  const lowerPrompt = prompt.toLowerCase();
  
  if (lowerPrompt.includes("e-commerce") || lowerPrompt.includes("shop") || lowerPrompt.includes("sklep")) {
    return "e-commerce";
  }
  if (lowerPrompt.includes("admin") || lowerPrompt.includes("panel")) {
    return "admin-panel";
  }
  if (lowerPrompt.includes("onboarding") || lowerPrompt.includes("rejestracja") || lowerPrompt.includes("welcome")) {
    return "onboarding";
  }
  
  return null;
}

/**
 * Get components for a screen type
 */
export function getComponentsForScreen(screenType: string): string[] {
  const template = SCREEN_TEMPLATES[screenType];
  if (!template) return [];
  
  return template.components.map(c => c.component);
}

/**
 * Suggest components based on prompt
 */
export function suggestComponents(prompt: string): Array<{ component: string; confidence: number }> {
  const suggestions: Array<{ component: string; confidence: number }> = [];
  const lowerPrompt = prompt.toLowerCase();
  
  for (const rule of COMPONENT_RULES) {
    const patterns = Array.isArray(rule.pattern) ? rule.pattern : [rule.pattern];
    const matches = patterns.filter(pattern => {
      if (pattern instanceof RegExp) {
        return pattern.test(lowerPrompt);
      }
      return lowerPrompt.includes(pattern.toLowerCase());
    });
    
    if (matches.length > 0) {
      suggestions.push({
        component: rule.component,
        confidence: (matches.length / patterns.length) * rule.priority,
      });
    }
  }
  
  return suggestions.sort((a, b) => b.confidence - a.confidence);
}

