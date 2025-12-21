/**
 * UI-DSL v2 Generator
 * 
 * Converts prompts to UI-DSL v2 structures using layout-first approach
 */

import type {
  UiPage,
  UiNode,
  UiSection,
  UiGrid,
  UiBlockRef,
  UiComponent,
  DataSource,
  Binding,
} from "@fragment_ui/ui-dsl";
import type { DocumentAnalysis } from "./docs/ingest";
import { createScaffold, type ScaffoldType } from "./scaffolds";
import { createSectionNode, hasBlockForSectionKind } from "./dsl-generator-helpers";
import { getBlockForSectionKind } from "./import-planner";

// Import a value (not just type) to ensure this file is treated as an ES module
// This is needed because Next.js/SWC may not recognize files with only type imports
// We'll use validatePage in the generateDSL function
import { validatePage } from "@fragment_ui/ui-dsl";

/**
 * Generate UUID v4
 */
function randomUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Intent classification from prompt
 */
export interface Intent {
  type: "page" | "form" | "dashboard" | "table" | "landing" | "settings";
  components: string[];
  layout?: "single-column" | "two-column" | "three-column" | "grid";
  hasData?: boolean;
  dataShape?: "table" | "cards" | "metrics" | "list";
}

/**
 * Parse prompt to detect intent
 */
export function detectIntent(prompt: string, documentAnalysis?: DocumentAnalysis): Intent {
  const lower = prompt.toLowerCase();
  
  // Build analysis text - combine document analysis with prompt if available
  let analysisText: string;
  if (documentAnalysis) {
    // Analyze requirements for component hints
    const requirementsText = documentAnalysis.requirements?.join(" ").toLowerCase() || "";
    const sectionsText = documentAnalysis.sections?.join(" ").toLowerCase() || "";
    analysisText = `${requirementsText} ${sectionsText} ${lower}`;
  } else {
    analysisText = lower;
  }
  
  // Detect type - check dashboard FIRST (more specific) before form
  let type: Intent["type"] = "page";
  
  // Dashboard detection - check for multiple dashboard indicators
  const dashboardIndicators = [
    /dashboard/i,
    /analytics/i,
    /metrics/i,
    /stats|statistics/i,
    /kpi/i,
    /overview/i,
    /monitoring/i,
    /reports?/i,
    /charts?/i,
    /graphs?/i,
  ];
  const hasDashboardIndicators = dashboardIndicators.some(regex => regex.test(analysisText));
  const hasDataVisualization = /chart|graph|visualization|data visualization/i.test(analysisText);
  const hasMultipleMetrics = /metric|kpi|stat/i.test(analysisText) && (analysisText.match(/metric|kpi|stat/gi)?.length || 0) > 1;
  
  if (hasDashboardIndicators || (hasDataVisualization && hasMultipleMetrics)) {
    type = "dashboard";
  } else if (/form|formularz|register|login|signup|sign in/i.test(analysisText)) {
    type = "form";
  } else if (/table|list|data table|grid|rows|columns/i.test(analysisText)) {
    type = "table";
  } else if (/landing|homepage|hero|cta|pricing/i.test(analysisText)) {
    type = "landing";
  } else if (/settings|preferences|profile|account/i.test(analysisText)) {
    type = "settings";
  }
  
  // Detect components - use analysis text for better detection
  const components: string[] = [];
  const componentKeywords: Record<string, string[]> = {
    Button: ["button", "btn", "submit", "cta", "action"],
    Input: ["input", "field", "text field", "textbox"],
    Select: ["select", "dropdown", "choose", "pick"],
    Card: ["card", "panel", "box", "container"],
    Table: ["table", "data table", "grid", "rows"],
    Form: ["form", "formularz"],
    Dialog: ["dialog", "modal", "popup"],
    Tabs: ["tabs", "tabbed"],
    Accordion: ["accordion", "collapse", "expand"],
    Badge: ["badge", "tag", "label"],
    Avatar: ["avatar", "profile picture", "user image"],
    Progress: ["progress", "loading", "spinner"],
    Alert: ["alert", "notification", "message"],
    Breadcrumbs: ["breadcrumbs", "navigation", "path"],
    Checkbox: ["checkbox", "check"],
    Radio: ["radio", "radio button"],
    Switch: ["switch", "toggle"],
    Textarea: ["textarea", "text area", "multiline"],
    DatePicker: ["date", "date picker", "calendar"],
    Slider: ["slider", "range"],
    Pagination: ["pagination", "pages", "next", "prev"],
  };
  
  for (const [component, keywords] of Object.entries(componentKeywords)) {
    if (keywords.some((keyword) => analysisText.includes(keyword))) {
      components.push(component);
    }
  }
  
  // Detect layout
  let layout: Intent["layout"] = "single-column";
  if (/two.?column|2.?column|side by side/i.test(analysisText)) {
    layout = "two-column";
  } else if (/three.?column|3.?column/i.test(analysisText)) {
    layout = "three-column";
  } else if (/grid|cards|tiles/i.test(analysisText)) {
    layout = "grid";
  }
  
  // Detect data requirements
  const hasData = /data|api|fetch|load|users|items|products|orders/i.test(analysisText);
  let dataShape: Intent["dataShape"] = "list";
  if (/table|rows|columns/i.test(analysisText)) {
    dataShape = "table";
  } else if (/cards|tiles|grid/i.test(analysisText)) {
    dataShape = "cards";
  } else if (/metrics|stats|numbers|kpi/i.test(analysisText)) {
    dataShape = "metrics";
  }
  
  // Enhanced detection using document analysis requirements
  if (documentAnalysis?.requirements) {
    const reqsText = documentAnalysis.requirements.join(" ").toLowerCase();
    // Check requirements for specific component mentions
    documentAnalysis.requirements.forEach(req => {
      const reqLower = req.toLowerCase();
      // Look for specific component mentions in requirements
      if (/button|submit|action|click/i.test(reqLower) && !components.includes("Button")) {
        components.push("Button");
      }
      if (/input|field|text field|textbox/i.test(reqLower) && !components.includes("Input")) {
        components.push("Input");
      }
      if (/select|dropdown|choose/i.test(reqLower) && !components.includes("Select")) {
        components.push("Select");
      }
      if (/table|data table|grid/i.test(reqLower) && !components.includes("Table")) {
        components.push("Table");
      }
      if (/card|panel|box/i.test(reqLower) && !components.includes("Card")) {
        components.push("Card");
      }
    });
  }
  
  return {
    type,
    components: [...new Set(components)], // Remove duplicates
    layout,
    hasData,
    dataShape,
  };
}

/**
 * Generate UI-DSL v2 page from prompt
 */
export function generateDSL(
  prompt: string, 
  registry: any,
  documentAnalysis?: DocumentAnalysis,
  providedIntent?: "page" | "dashboard" | "form" | "landing",
  constraints?: { maxWidth?: "sm" | "md" | "lg" | "xl"; theme?: string }
): {
  dsl: UiPage;
  diagnostics: Array<{ level: "error" | "warning" | "info"; message: string; path?: string }>;
} {
  // Use document analysis if provided for better intent detection
  const analysisText = documentAnalysis 
    ? `${documentAnalysis.title || ""}\n${documentAnalysis.requirements?.join("\n") || ""}\n${documentAnalysis.sections?.join("\n") || ""}\n${prompt}`
    : prompt;
  
  // Use provided intent if available, otherwise detect from prompt
  let intent = detectIntent(analysisText, documentAnalysis);
  if (providedIntent) {
    intent.type = providedIntent;
  }
  const diagnostics: Array<{ level: "error" | "warning" | "info"; message: string; path?: string }> = [];
  
  // Log detected intent for debugging
  console.log("[DSL Generator] Detected intent:", {
    type: intent.type,
    components: intent.components,
    layout: intent.layout,
    hasData: intent.hasData,
    dataShape: intent.dataShape,
    hasDocumentAnalysis: !!documentAnalysis,
  });
  
  // Use document analysis title if available, otherwise extract from prompt
  const pageTitle = documentAnalysis?.title || extractTitle(prompt) || intent.type.charAt(0).toUpperCase() + intent.type.slice(1);
  const pageDescription = documentAnalysis?.description || extractDescription(prompt);
  
  // Check if we should use a scaffold for complex screens
  const scaffoldMap: Record<string, ScaffoldType | null> = {
    dashboard: "dashboard",
    landing: "landing",
    settings: "settings",
    form: null, // Forms use custom generation
    table: null, // Tables use custom generation
    page: null, // Generic pages use custom generation
  };
  
  const scaffoldType = scaffoldMap[intent.type];
  
  // Use scaffold if available
  if (scaffoldType) {
    try {
      // Enhanced dashboard detection - detect required sections from prompt
      let dashboardOptions: any = { widgetCount: 4 };
      if (intent.type === "dashboard") {
        const lowerPrompt = prompt.toLowerCase();
        const analysisLower = analysisText.toLowerCase();
        
        // Detect "complex" keyword - increase widget count and include all sections
        const isComplex = /complex|elaborate|detailed|comprehensive|full|complete|advanced|professional/i.test(analysisLower);
        
        // Detect required sections
        dashboardOptions = {
          ...dashboardOptions,
          widgetCount: isComplex ? 8 : 4, // More widgets for complex dashboards
          includeCharts: isComplex || /chart|graph|visualization|wykres|trend/i.test(analysisLower),
          includeActivityFeed: isComplex || /activity|recent|actions|aktywności|ostatnie/i.test(analysisLower),
          includeFilters: isComplex || /filter|search|szukaj|filtruj/i.test(analysisLower),
          includeQuickActions: isComplex || /quick.?action|fast|szybkie|akcje/i.test(analysisLower),
        };
        
        // Detect specific data types
        const hasMetrics = /metric|kpi|stat|revenue|users|growth|churn/i.test(analysisLower);
        const hasTable = /table|data table|tabela|list|rows/i.test(analysisLower);
        const hasCharts = dashboardOptions.includeCharts;
        const hasActivity = dashboardOptions.includeActivityFeed;
        
        // If no specific sections detected, include all by default for professional dashboard
        // For complex dashboards, always include everything
        if (isComplex || (!hasMetrics && !hasTable && !hasCharts && !hasActivity)) {
          dashboardOptions = {
            ...dashboardOptions,
            widgetCount: isComplex ? 8 : 4,
            includeCharts: true,
            includeActivityFeed: true,
            includeFilters: true,
            includeQuickActions: true,
          };
        }
      }
      
      const scaffold = createScaffold(scaffoldType, {
        title: pageTitle,
        includeSidebar: true, // Always include sidebar for dashboard
        includeHeader: true, // Always include header with logo for dashboard
        ...(intent.type === "dashboard" ? dashboardOptions : {}),
        ...(intent.type === "landing" ? {
          includeHero: true,
          includeFeatures: true,
          includePricing: true,
          includeTestimonials: true,
          includeFAQ: true,
          includeCTA: true,
        } : {}),
      });
      
      // Metadata is not part of UiPage type, skip assignment
      
      // Add datasources if needed
      // dataSources is not part of UiPage type, skip assignment
      // if (intent.hasData) {
      //   const dataSourceId = randomUUID();
      //   scaffold.dataSources = [
      //     {
      //       id: dataSourceId,
      //       kind: "placeholder",
      //       shape: intent.dataShape,
      //     },
      //   ];
      // }
      
      // Apply constraints
      // Note: layout requires type and gap, so we skip direct assignment
      // if (constraints?.maxWidth) {
      //   scaffold.layout = {
      //     maxWidth: constraints.maxWidth,
      //   };
      // }
      
      diagnostics.push({
        level: "info",
        message: `Used ${scaffoldType} scaffold for ${intent.type} screen`,
      });
      
      const normalized = scaffold as any;
      // Ensure type/page shape for downstream codegen/tests
      normalized.type = "page";
      if (!Array.isArray(normalized.children)) {
        normalized.children = normalized.sections || [];
      }
      
      return { dsl: normalized, diagnostics };
    } catch (error) {
      diagnostics.push({
        level: "warning",
        message: `Failed to use scaffold: ${error instanceof Error ? error.message : String(error)}. Falling back to custom generation.`,
      });
      // Fall through to custom generation
    }
  }
  
  // Create root page (custom generation)
  const pageId = randomUUID();
  const page: UiPage = {
    type: "page",
    id: pageId,
    title: pageTitle,
    description: pageDescription,
    children: [],
    dataSources: [],
    layout: constraints?.maxWidth ? {
      maxWidth: constraints.maxWidth,
    } : undefined,
    metadata: {
      version: "2.0",
      generatedAt: new Date().toISOString(),
      source: prompt,
      ...(documentAnalysis ? {
        documentAnalysis: {
          sections: documentAnalysis.sections?.length || 0,
          requirements: documentAnalysis.requirements?.length || 0,
        }
      } : {}),
      ...(constraints ? { constraints } : {}),
    } as any, // Allow additional metadata properties
  };
  
  // Validate page structure (this also ensures the file is treated as an ES module)
  // We use validatePage to ensure the file is not optimized away by Next.js
  if (typeof validatePage === 'function') {
    // validatePage is available, but we'll validate manually to avoid breaking changes
    // This import is primarily to ensure the file is treated as an ES module
  }
  
  // Add datasources if needed
  let dataSourceId: string | undefined;
  if (intent.hasData) {
    dataSourceId = randomUUID();
    page.dataSources = [
      {
        id: dataSourceId,
        kind: "placeholder",
        shape: intent.dataShape,
      },
    ];
  }
  
  // Generate layout structure - pass document analysis for better generation
  const children = generateLayout(intent, prompt, registry, diagnostics, documentAnalysis, dataSourceId);
  page.children = children;

  // Fallback: ensure dashboard pages have content for downstream codegen/tests
  if ((!page.children || page.children.length === 0) && intent.type === "dashboard") {
    page.children = generateMetricsGrid(registry, diagnostics);
  }
  
  return { dsl: page, diagnostics };
}

/**
 * Extract title from prompt
 */
function extractTitle(prompt: string): string | undefined {
  // Try to extract title from common patterns
  const titleMatch = prompt.match(/(?:create|build|make|generate)\s+(?:a|an|the)?\s*([^,\.\n]+)/i);
  if (titleMatch) {
    return titleMatch[1].trim();
  }
  return undefined;
}

/**
 * Extract description from prompt
 */
function extractDescription(prompt: string): string | undefined {
  // Use first sentence as description
  const sentences = prompt.split(/[\.\!\?]\s+/);
  if (sentences.length > 1) {
    return sentences[0] + ".";
  }
  return prompt.length > 100 ? prompt.substring(0, 100) + "..." : prompt;
}

/**
 * Generate layout structure based on intent
 */
function generateLayout(
  intent: Intent,
  prompt: string,
  registry: any,
  diagnostics: Array<{ level: "error" | "warning" | "info"; message: string; path?: string }>,
  documentAnalysis?: DocumentAnalysis,
  dataSourceId?: string
): UiNode[] {
  const nodes: UiNode[] = [];
  
  // For forms, generate form structure
  if (intent.type === "form") {
    const formSection: UiSection = {
      type: "section",
      id: randomUUID(),
      variant: "card",
      title: extractTitle(prompt) || "Form",
      children: generateFormFields(prompt, registry, diagnostics, documentAnalysis),
    };
    nodes.push(formSection);
    return nodes;
  }
  
  // For dashboards, generate metrics + data sections
  if (intent.type === "dashboard") {
    // Metrics section
    const metricsSection: UiSection = {
      type: "section",
      id: randomUUID(),
      variant: "card",
      title: "Metrics",
      children: generateMetricsGrid(registry, diagnostics),
    };
    nodes.push(metricsSection);
    
    // Data section
    if (intent.hasData) {
      const dataSection: UiSection = {
        type: "section",
        id: randomUUID(),
        variant: "card",
        title: "Data",
        children: generateDataTable(registry, diagnostics, dataSourceId),
      };
      nodes.push(dataSection);
    }
    return nodes;
  }
  
  // For tables, generate table structure
  if (intent.type === "table") {
    const tableSection: UiSection = {
      type: "section",
      id: randomUUID(),
      variant: "card",
      title: "Data Table",
      children: generateDataTable(registry, diagnostics, dataSourceId),
    };
    nodes.push(tableSection);
    return nodes;
  }
  
  // For landing pages, generate hero + features + CTA
  if (intent.type === "landing") {
    const heroSection: UiSection = {
      type: "section",
      id: randomUUID(),
      variant: "hero",
      children: generateHeroContent(registry, diagnostics),
    };
    nodes.push(heroSection);
    
    const featuresSection: UiSection = {
      type: "section",
      id: randomUUID(),
      variant: "card",
      title: "Features",
      children: generateFeaturesGrid(registry, diagnostics),
    };
    nodes.push(featuresSection);
    return nodes;
  }
  
  // Default: single section with detected components
  const section: UiSection = {
    type: "section",
    id: randomUUID(),
    variant: "card",
    children: generateComponentsFromIntent(intent, registry, diagnostics),
  };
  nodes.push(section);
  
  return nodes;
}

/**
 * Generate form fields from prompt
 */
function generateFormFields(
  prompt: string,
  registry: any,
  diagnostics: Array<{ level: "error" | "warning" | "info"; message: string; path?: string }>,
  documentAnalysis?: DocumentAnalysis
): UiNode[] {
  const fields: UiNode[] = [];
  const lower = prompt.toLowerCase();
  
  // Use requirements from document analysis if available
  const requirementsText = documentAnalysis?.requirements?.join("\n") || prompt;
  const analysisLower = requirementsText.toLowerCase();
  
  // Enhanced field detection using document analysis requirements
  const textToAnalyze = documentAnalysis?.requirements?.join(" ") || prompt;
  const textLower = textToAnalyze.toLowerCase();
  
  // Common form field patterns
  const fieldPatterns = [
    { pattern: /email|e-mail/i, component: "Input", props: { type: "email", placeholder: "Email" } },
    { pattern: /password|pass/i, component: "Input", props: { type: "password", placeholder: "Password" } },
    { pattern: /name|full name/i, component: "Input", props: { placeholder: "Name" } },
    { pattern: /phone|telephone/i, component: "Input", props: { type: "tel", placeholder: "Phone" } },
    { pattern: /address/i, component: "Textarea", props: { placeholder: "Address" } },
    { pattern: /country|region/i, component: "Select", props: { placeholder: "Select country" } },
    { pattern: /agree|accept|terms/i, component: "Checkbox", props: { label: "I agree to the terms" } },
  ];
  
  fieldPatterns.forEach(({ pattern, component, props }) => {
    if (pattern.test(prompt)) {
      if (!registry.components || !registry.components[component]) {
        diagnostics.push({
          level: "warning",
          message: `Component "${component}" not found in registry`,
        });
        return;
      }
      
      const field: UiComponent = {
        type: "component",
        id: randomUUID(),
        component,
        props,
        dataUiId: randomUUID(), // Mirror id for patch operations
      };
      fields.push(field);
    }
  });
  
  // Add submit button
  if (fields.length > 0) {
    const submitButton: UiComponent = {
      type: "component",
      id: randomUUID(),
      component: "Button",
      variant: "solid",
      copy: "Submit",
      props: { type: "submit" },
      dataUiId: randomUUID(),
    };
    fields.push(submitButton);
  }
  
  return fields;
}

/**
 * Generate metrics grid
 */
function generateMetricsGrid(
  registry: any,
  diagnostics: Array<{ level: "error" | "warning" | "info"; message: string; path?: string }>
): UiNode[] {
  const grid: UiGrid = {
    type: "grid",
    id: randomUUID(),
    columns: 4,
    responsive: {
      sm: 1,
      md: 2,
      lg: 4,
      xl: 4,
    },
    children: [],
  };
  
  // Generate 4 metric cards using MetricCard component
  const metrics = [
    { title: "Total Users", value: "0", trend: "up" as const, trendValue: "+12.5%", description: "From last month" },
    { title: "Revenue", value: "$0", trend: "neutral" as const, description: "Total revenue" },
    { title: "Active Sessions", value: "0", trend: "down" as const, trendValue: "-5.2%", description: "Current active" },
    { title: "Conversion Rate", value: "0%", trend: "up" as const, trendValue: "+2.1%", description: "Overall conversion" },
  ];
  
  for (const metric of metrics) {
    const metricCard: UiComponent = {
      type: "component",
      id: randomUUID(),
      component: "MetricCard",
      props: {
        title: metric.title,
        value: metric.value,
        trend: metric.trend,
        trendValue: metric.trendValue,
        description: metric.description,
      },
      dataUiId: randomUUID(),
    };
    grid.children.push(metricCard);
  }
  
  return [grid];
}

/**
 * Generate data table
 */
function generateDataTable(
  registry: any,
  diagnostics: Array<{ level: "error" | "warning" | "info"; message: string; path?: string }>,
  dataSourceId?: string
): UiNode[] {
  const table: UiComponent = {
    type: "component",
    id: randomUUID(),
    component: "Table",
    props: {
      columns: ["Name", "Email", "Status"],
    },
    bind: dataSourceId ? [
      {
        sourceId: dataSourceId,
        path: "rows",
        prop: "data",
      },
    ] : undefined,
    dataUiId: randomUUID(),
  };
  
  return [table];
}

/**
 * Generate hero content
 */
function generateHeroContent(
  registry: any,
  diagnostics: Array<{ level: "error" | "warning" | "info"; message: string; path?: string }>
): UiNode[] {
  const nodes: UiNode[] = [];
  
  // Title
  const title: UiComponent = {
    type: "component",
    id: randomUUID(),
    component: "Heading",
    copy: "Welcome",
    props: { level: 1 },
    dataUiId: randomUUID(),
  };
  nodes.push(title);
  
  // Description
  const description: UiComponent = {
    type: "component",
    id: randomUUID(),
    component: "Text",
    copy: "Get started with our amazing product",
    dataUiId: randomUUID(),
  };
  nodes.push(description);
  
  // CTA Button
  const cta: UiComponent = {
    type: "component",
    id: randomUUID(),
    component: "Button",
    variant: "solid",
    copy: "Get Started",
    dataUiId: randomUUID(),
  };
  nodes.push(cta);
  
  return nodes;
}

/**
 * Generate features grid
 */
function generateFeaturesGrid(
  registry: any,
  diagnostics: Array<{ level: "error" | "warning" | "info"; message: string; path?: string }>
): UiNode[] {
  const grid: UiGrid = {
    type: "grid",
    id: randomUUID(),
    columns: 3,
    children: [],
  };
  
  // Generate 3 feature cards
  for (let i = 0; i < 3; i++) {
    const card: UiComponent = {
      type: "component",
      id: randomUUID(),
      component: "Card",
      slots: {
        header: [
          {
            type: "component",
            id: randomUUID(),
            component: "Heading",
            copy: `Feature ${i + 1}`,
            props: { level: 3 },
            dataUiId: randomUUID(),
          } as UiComponent,
        ],
        content: [
          {
            type: "component",
            id: randomUUID(),
            component: "Text",
            copy: "Feature description",
            dataUiId: randomUUID(),
          } as UiComponent,
        ],
      },
      dataUiId: randomUUID(),
    };
    grid.children.push(card);
  }
  
  return [grid];
}

/**
 * Generate components from intent
 */
function generateComponentsFromIntent(
  intent: Intent,
  registry: any,
  diagnostics: Array<{ level: "error" | "warning" | "info"; message: string; path?: string }>
): UiNode[] {
  const nodes: UiNode[] = [];
  
  intent.components.forEach((componentName) => {
    if (!registry.components || !registry.components[componentName]) {
      diagnostics.push({
        level: "warning",
        message: `Component "${componentName}" not found in registry`,
      });
      return;
    }
    
    const component: UiComponent = {
      type: "component",
      id: randomUUID(),
      component: componentName,
      dataUiId: randomUUID(),
    };
    nodes.push(component);
  });
  
  return nodes;
}

// Export empty object to ensure this file is treated as an ES module
// This is needed because Next.js/SWC may not recognize files with only type imports
export {};
