/**
 * UI-DSL v2 Code Generator
 * 
 * Converts UI-DSL v2 to TSX code with imports and data-ui-id
 */

import type {
  UiPage,
  UiNode,
  UiComponent,
  UiSection,
  UiGrid,
  UiStack,
  UiTwoColumn,
  UiThreeColumn,
  UiSidebar,
  UiBlockRef,
  DataSource,
  Binding,
} from "@fragment_ui/ui-dsl";
import { planImports, generateImportStatements, getBlockForSectionKind } from "./import-planner";

export interface CodeGenOptions {
  includeImports?: boolean;
  componentName?: string;
  generateStorybook?: boolean;
}

/**
 * Generate TSX code from UI-DSL v2
 */
export function generateCodeFromDSL(
  dsl: UiPage,
  registry: any,
  options: CodeGenOptions = {}
): string {
  const {
    includeImports = true,
    componentName = "GeneratedPage",
    generateStorybook = false,
  } = options;

  // Collect all used components for imports
  const usedComponents = new Set<string>();
  collectComponents(dsl, usedComponents);

  // Generate imports using import planner
  const imports = includeImports
    ? (() => {
        const plan = planImports(usedComponents, registry);
        return generateImportStatements(plan);
      })()
    : "";

  // Generate component code
  const componentCode = generateComponent(dsl, componentName, registry);

  // Generate Storybook story if requested
  const storybookCode = generateStorybook
    ? generateStorybookStory(dsl, componentName)
    : "";

  return `${imports}

${componentCode}${storybookCode ? `\n\n${storybookCode}` : ""}`;
}

/**
 * Collect all component names used in DSL
 */
function collectComponents(node: UiNode, components: Set<string>): void {
  if (node.type === "component") {
    components.add(node.component);
  }

  if ("children" in node && Array.isArray(node.children)) {
    node.children.forEach((child) => collectComponents(child, components));
  }

  if (node.type === "component" && node.slots) {
    Object.values(node.slots).forEach((slotNodes) => {
      slotNodes.forEach((slotNode) => collectComponents(slotNode, components));
    });
  }
  
  // Collect components from specialized sections
  if (node.type === "section") {
    const section = node as UiSection;
    // Use blocks for specialized sections
    if (section.kind) {
      const blockName = getBlockForSectionKind(section.kind);
      if (blockName) {
        components.add(blockName);
      }
    }
    
    // Collect dashboard widgets if section contains them
    if (section.title?.toLowerCase().includes("dashboard")) {
      components.add("DashboardWidgets");
      components.add("WidgetContainer");
      components.add("MetricCard");
    }
  }
  
  // Collect components from block references
  if (node.type === "block") {
    const block = node as UiBlockRef;
    if (block.ref.includes("dashboard-widgets")) {
      components.add("DashboardWidgets");
      components.add("WidgetContainer");
    }
    // Check inputs for component references
    if (block.inputs) {
      Object.values(block.inputs).forEach((value) => {
        if (Array.isArray(value)) {
          value.forEach((item) => {
            if (item && typeof item === "object" && item.content) {
              if (item.content.type === "component") {
                components.add(item.content.component);
              }
            }
          });
        }
      });
    }
  }
  
  // Collect dashboard components
  if (node.type === "component") {
    const comp = node as UiComponent;
    if (comp.component === "MetricCard" || comp.component === "ActivityFeed" || 
        comp.component === "QuickActions" || comp.component === "FilterBar" ||
        comp.component === "Chart") {
      components.add(comp.component);
    }
  }
}

/**
 * Generate import statements (deprecated - use import-planner instead)
 * @deprecated Use planImports and generateImportStatements from import-planner
 */
function generateImports(components: Set<string>, registry: any): string {
  const plan = planImports(components, registry);
  return generateImportStatements(plan);
}

/**
 * Generate component code
 */
function generateComponent(
  dsl: UiPage,
  componentName: string,
  registry: any
): string {
  const props: string[] = [];
  const state: string[] = [];
  const effects: string[] = [];

  // Generate datasource hooks if needed
  if (dsl.dataSources && dsl.dataSources.length > 0) {
    dsl.dataSources.forEach((ds, index) => {
      if (ds.kind === "placeholder") {
        state.push(
          `  const [data${index}, setData${index}] = React.useState(() => generatePlaceholderData("${ds.shape || "list"}"));`
        );
      } else if (ds.kind === "url") {
        state.push(
          `  const [data${index}, setData${index}] = React.useState(null);`
        );
        effects.push(
          `  React.useEffect(() => {`,
          `    fetch("${ds.url}")`,
          `      .then((res) => res.json())`,
          `      .then((data) => setData${index}(data))`,
          `      .catch((err) => console.error("Failed to fetch data:", err));`,
          `  }, []);`
        );
      } else if (ds.kind === "static") {
        state.push(
          `  const data${index} = ${JSON.stringify(ds.data)};`
        );
      }
    });
  }

  // Generate children JSX - pass datasources for binding resolution
  const children = Array.isArray(dsl.children) ? dsl.children : [];
  const childrenJSX = children
    .map((child) => generateNodeJSX(child, registry, 2, dsl.dataSources))
    .join("\n");

  // Generate layout classes
  const layoutClasses = generateLayoutClasses(dsl.layout);
  
  // Check if we need placeholder data function
  const needsPlaceholderData = dsl.dataSources && dsl.dataSources.some(ds => ds.kind === "placeholder");
  const placeholderFunction = needsPlaceholderData ? `${generatePlaceholderDataFunction()}\n\n` : "";

  return `${placeholderFunction}export function ${componentName}() {
${state.join("\n")}
${effects.length > 0 ? "\n" + effects.join("\n") : ""}
  return (
    <div className="${layoutClasses}" data-ui-id="${dsl.id}">
${childrenJSX}
    </div>
  );
}`;
}

/**
 * Generate JSX for a node
 */
function generateNodeJSX(
  node: UiNode,
  registry: any,
  indent: number = 0,
  dataSources?: DataSource[]
): string {
  const indentStr = " ".repeat(indent);

  switch (node.type) {
    case "section":
      return generateSectionJSX(node, registry, indent, dataSources);
    case "grid":
      return generateGridJSX(node, registry, indent, dataSources);
    case "stack":
      return generateStackJSX(node, registry, indent, dataSources);
    case "twoColumn":
      return generateTwoColumnJSX(node, registry, indent, dataSources);
    case "threeColumn":
      return generateThreeColumnJSX(node, registry, indent, dataSources);
    case "sidebar":
      return generateSidebarJSX(node, registry, indent, dataSources);
    case "block":
      return generateBlockJSX(node, registry, indent);
    case "component":
      return generateComponentJSX(node, registry, indent, dataSources);
    default:
      return `${indentStr}{/* Unknown node type: ${(node as any).type} */}`;
  }
}

/**
 * Generate JSX for section
 */
function generateSectionJSX(
  node: UiSection,
  registry: any,
  indent: number,
  dataSources?: DataSource[]
): string {
  const indentStr = " ".repeat(indent);
  const variant = node.variant || "card";
  const layoutClasses = generateLayoutClasses(node.layout);

  // Handle specialized section types (hero, pricing, etc.)
  if (node.kind && node.sectionData) {
    return generateSpecializedSectionJSX(node, registry, indent, dataSources);
  }

  // Map variant to component structure
  if (variant === "card") {
    const childrenJSX = node.children
      .map((child) => generateNodeJSX(child, registry, indent + 6, dataSources))
      .join("\n");

    return `${indentStr}<Card className="${layoutClasses}" data-ui-id="${node.id}">
${node.title ? `${indentStr}  <CardHeader>
${indentStr}    <CardTitle>${node.title}</CardTitle>
${indentStr}  </CardHeader>` : ""}
${indentStr}  <CardContent>
${childrenJSX}
${indentStr}  </CardContent>
${indentStr}</Card>`;
  } else {
    // Plain section
    const childrenJSX = node.children
      .map((child) => generateNodeJSX(child, registry, indent + 2, dataSources))
      .join("\n");

    return `${indentStr}<section className="${layoutClasses}" data-ui-id="${node.id}">
${node.title ? `${indentStr}  <h2>${node.title}</h2>` : ""}
${childrenJSX}
${indentStr}</section>`;
  }
}

/**
 * Generate JSX for specialized section types (hero, pricing, etc.)
 */
function generateSpecializedSectionJSX(
  node: UiSection,
  registry: any,
  indent: number,
  dataSources?: DataSource[]
): string {
  const indentStr = " ".repeat(indent);
  const layoutClasses = generateLayoutClasses(node.layout);
  
  if (!node.kind || !node.sectionData) {
    return generateSectionJSX(node, registry, indent, dataSources);
  }

  switch (node.kind) {
    case "hero": {
      const data = node.sectionData as any;
      const title = data.title || node.title || "Welcome";
      const description = data.description || "";
      const primaryCTA = data.cta?.primary;
      const secondaryCTA = data.cta?.secondary;
      const background = data.background || "solid";
      const image = data.image;
      
      const heroProps: any = {
        title,
        background,
      };
      if (description) heroProps.description = description;
      if (primaryCTA) {
        heroProps.primaryCTA = {
          label: primaryCTA.label,
          action: primaryCTA.action,
          href: primaryCTA.action,
        };
      }
      if (secondaryCTA) {
        heroProps.secondaryCTA = {
          label: secondaryCTA.label,
          action: secondaryCTA.action,
          href: secondaryCTA.action,
        };
      }
      if (image) heroProps.image = image;
      
      return `${indentStr}<HeroSection ${Object.entries(heroProps).map(([key, value]) => {
        if (typeof value === "string") {
          return `${key}="${value}"`;
        }
        return `${key}={${JSON.stringify(value)}}`;
      }).join(" ")} data-ui-id="${node.id}" className="${layoutClasses}" />`;
    }
    
    case "pricing": {
      const data = node.sectionData as any;
      const title = data.title || node.title || "Pricing";
      const tiers = data.tiers || [];
      const layout = data.layout || "grid";
      
      // Use PricingTable block if available, otherwise generate inline
      return `${indentStr}<section className="py-16 ${layoutClasses}" data-ui-id="${node.id}">
${indentStr}  <div className="max-w-7xl mx-auto px-4">
${indentStr}    <h2 className="text-3xl font-bold mb-8 text-center">${title}</h2>
${indentStr}    <PricingTable tiers={${JSON.stringify(tiers.map((tier: any) => ({
        name: tier.name,
        price: tier.price,
        pricePeriod: tier.period,
        features: tier.features.map((f: string) => ({ name: f, included: true })),
        ctaText: tier.cta?.label || "Get Started",
        ctaHref: tier.cta?.action,
      })))}} />
${indentStr}  </div>
${indentStr}</section>`;
    }
    
    case "featureGrid": {
      const data = node.sectionData as any;
      const title = data.title || node.title || "Features";
      const features = data.features || [];
      const columns = data.columns || 3;
      
      return `${indentStr}<FeatureGridSection
${indentStr}  title="${title}"
${indentStr}  features={${JSON.stringify(features)}}
${indentStr}  columns={${columns}}
${indentStr}  data-ui-id="${node.id}"
${indentStr}  className="${layoutClasses}"
${indentStr} />`;
    }
    
    case "stats": {
      const data = node.sectionData as any;
      const title = node.title;
      const items = data.items || [];
      const layout = data.layout || "grid";
      const columns = data.columns || 4;
      
      return `${indentStr}<StatsSection
${indentStr}  ${title ? `title="${title}"` : ""}
${indentStr}  items={${JSON.stringify(items)}}
${indentStr}  layout="${layout}"
${indentStr}  columns={${columns}}
${indentStr}  data-ui-id="${node.id}"
${indentStr}  className="${layoutClasses}"
${indentStr} />`;
    }
    
    case "faq": {
      const data = node.sectionData as any;
      const title = data.title || node.title || "FAQ";
      const description = data.description;
      const items = data.items || [];
      
      return `${indentStr}<FAQSection
${indentStr}  title="${title}"
${description ? `${indentStr}  description="${description}"` : ""}
${indentStr}  items={${JSON.stringify(items)}}
${indentStr}  data-ui-id="${node.id}"
${indentStr}  className="${layoutClasses}"
${indentStr} />`;
    }
    
    case "cta": {
      const data = node.sectionData as any;
      const title = data.title || node.title || "Ready to Get Started?";
      const description = data.description || "";
      const primaryCTA = data.cta?.primary || data.cta;
      const secondaryCTA = data.cta?.secondary;
      const variant = data.variant || "centered";
      const background = data.background || "solid";
      
      const ctaProps: any = {
        title,
        variant,
        background,
      };
      if (description) ctaProps.description = description;
      if (primaryCTA) {
        ctaProps.primaryCTA = {
          label: primaryCTA.label,
          action: primaryCTA.action,
          href: primaryCTA.action,
        };
      }
      if (secondaryCTA) {
        ctaProps.secondaryCTA = {
          label: secondaryCTA.label,
          action: secondaryCTA.action,
          href: secondaryCTA.action,
        };
      }
      
      return `${indentStr}<CTASection ${Object.entries(ctaProps).map(([key, value]) => {
        if (typeof value === "string") {
          return `${key}="${value}"`;
        }
        return `${key}={${JSON.stringify(value)}}`;
      }).join(" ")} data-ui-id="${node.id}" className="${layoutClasses}" />`;
    }
    
    case "testimonials": {
      const data = node.sectionData as any;
      const title = data.title || node.title || "Testimonials";
      const description = data.description;
      const items = data.items || [];
      const layout = data.layout || "grid";
      const columns = data.columns || 3;
      
      return `${indentStr}<TestimonialsSection
${indentStr}  title="${title}"
${description ? `${indentStr}  description="${description}"` : ""}
${indentStr}  items={${JSON.stringify(items)}}
${indentStr}  layout="${layout}"
${indentStr}  columns={${columns}}
${indentStr}  data-ui-id="${node.id}"
${indentStr}  className="${layoutClasses}"
${indentStr} />`;
    }
    
    case "dataTable": {
      const data = node.sectionData as any;
      const title = data.title || node.title || "Data Table";
      const columns = data.columns || [];
      const pagination = data.pagination || false;
      
      return `${indentStr}<section className="py-8 ${layoutClasses}" data-ui-id="${node.id}">
${indentStr}  <div className="max-w-7xl mx-auto px-4">
${indentStr}    <h2 className="text-2xl font-bold mb-4">${title}</h2>
${indentStr}    <div className="border rounded-lg">
${indentStr}      <Table>
${indentStr}        <TableHeader>
${indentStr}          <TableRow>
${columns.map((col: any) => `${indentStr}            <TableHead>${col.label}</TableHead>`).join("\n")}
${indentStr}          </TableRow>
${indentStr}        </TableHeader>
${indentStr}        <TableBody>
${indentStr}          <TableRow>
${columns.map(() => `${indentStr}            <TableCell>Data placeholder</TableCell>`).join("\n")}
${indentStr}          </TableRow>
${indentStr}        </TableBody>
${indentStr}      </Table>
${pagination ? `${indentStr}      <div className="p-4 border-t">
${indentStr}        <div className="flex justify-between items-center">
${indentStr}          <div className="text-sm text-muted-foreground">Showing 1-10 of 100</div>
${indentStr}          <div className="flex gap-2">
${indentStr}            <Button variant="outline" size="sm">Previous</Button>
${indentStr}            <Button variant="outline" size="sm">Next</Button>
${indentStr}          </div>
${indentStr}        </div>
${indentStr}      </div>` : ""}
${indentStr}    </div>
${indentStr}  </div>
${indentStr}</section>`;
    }
    
    case "chart": {
      const data = node.sectionData as any;
      const title = data.title || node.title || "Chart";
      const chartType = data.chartType || "line";
      
      return `${indentStr}<section className="py-8 ${layoutClasses}" data-ui-id="${node.id}">
${indentStr}  <div className="max-w-7xl mx-auto px-4">
${indentStr}    <h2 className="text-2xl font-bold mb-4">${title}</h2>
${indentStr}    <div className="border rounded-lg p-6 bg-muted/50">
${indentStr}      <div className="h-64 flex items-center justify-center text-muted-foreground">
${indentStr}        Chart placeholder (${chartType} chart)
${indentStr}      </div>
${indentStr}    </div>
${indentStr}  </div>
${indentStr}</section>`;
    }
    
    default:
      // Fallback to generic section
      return generateSectionJSX(node, registry, indent, dataSources);
  }
}

/**
 * Generate JSX for grid
 */
function generateGridJSX(
  node: UiGrid,
  registry: any,
  indent: number,
  dataSources?: DataSource[]
): string {
  const indentStr = " ".repeat(indent);
  const layoutClasses = generateLayoutClasses(node.layout);
  const gridCols = node.columns || 2;
  
  // Generate responsive grid classes
  const responsiveClasses: string[] = [];
  if (node.responsive) {
    const { sm, md, lg, xl } = node.responsive;
    if (sm !== undefined) responsiveClasses.push(`grid-cols-${sm}`);
    if (md !== undefined) responsiveClasses.push(`md:grid-cols-${md}`);
    if (lg !== undefined) responsiveClasses.push(`lg:grid-cols-${lg}`);
    if (xl !== undefined) responsiveClasses.push(`xl:grid-cols-${xl}`);
  } else {
    // Default responsive behavior
    responsiveClasses.push(`grid-cols-1`, `md:grid-cols-2`, `lg:grid-cols-${gridCols}`);
  }
  
  const gridClass = `grid ${responsiveClasses.join(" ")} gap-4`;

  const childrenJSX = node.children
    .map((child) => generateNodeJSX(child, registry, indent + 2, dataSources))
    .join("\n");

  return `${indentStr}<div className="${gridClass} ${layoutClasses}" data-ui-id="${node.id}">
${childrenJSX}
${indentStr}</div>`;
}

/**
 * Generate JSX for stack layout
 */
function generateStackJSX(
  node: UiStack,
  registry: any,
  indent: number,
  dataSources?: DataSource[]
): string {
  const indentStr = " ".repeat(indent);
  const layoutClasses = generateLayoutClasses(node.layout);
  const direction = node.direction || "vertical";
  const gap = node.gap || 4;
  
  const flexDirection = direction === "horizontal" ? "flex-row" : "flex-col";
  const stackClass = `flex ${flexDirection} gap-${gap}`;

  const childrenJSX = node.children
    .map((child) => generateNodeJSX(child, registry, indent + 2, dataSources))
    .join("\n");

  return `${indentStr}<div className="${stackClass} ${layoutClasses}" data-ui-id="${node.id}">
${childrenJSX}
${indentStr}</div>`;
}

/**
 * Generate JSX for two-column layout
 */
function generateTwoColumnJSX(
  node: UiTwoColumn,
  registry: any,
  indent: number,
  dataSources?: DataSource[]
): string {
  const indentStr = " ".repeat(indent);
  const layoutClasses = generateLayoutClasses(node.layout);
  const ratio = node.ratio || "1:1";
  const gap = node.gap || 4;
  
  // Generate responsive classes
  let gridClass = `grid grid-cols-1 md:grid-cols-2 gap-${gap}`;
  if (node.responsive?.stack) {
    const breakpoint = node.responsive.breakpoint || "md";
    gridClass = `grid grid-cols-1 ${breakpoint}:grid-cols-2 gap-${gap}`;
  }

  // Split children into two columns (first child = left, rest = right)
  const leftChildren = node.children.length >= 1 ? [node.children[0]] : [];
  const rightChildren = node.children.length >= 2 ? node.children.slice(1) : [];

  const leftJSX = leftChildren
    .map((child) => generateNodeJSX(child, registry, indent + 4, dataSources))
    .join("\n");
  const rightJSX = rightChildren
    .map((child) => generateNodeJSX(child, registry, indent + 4, dataSources))
    .join("\n");

  return `${indentStr}<div className="${gridClass} ${layoutClasses}" data-ui-id="${node.id}">
${indentStr}  <div className="md:col-span-1">
${leftJSX}
${indentStr}  </div>
${indentStr}  <div className="md:col-span-1">
${rightJSX}
${indentStr}  </div>
${indentStr}</div>`;
}

/**
 * Generate JSX for three-column layout
 */
function generateThreeColumnJSX(
  node: UiThreeColumn,
  registry: any,
  indent: number,
  dataSources?: DataSource[]
): string {
  const indentStr = " ".repeat(indent);
  const layoutClasses = generateLayoutClasses(node.layout);
  const gap = node.gap || 4;
  
  // Generate responsive classes
  let gridClass = `grid grid-cols-1 md:grid-cols-3 gap-${gap}`;
  if (node.responsive?.stack) {
    const breakpoint = node.responsive.breakpoint || "md";
    gridClass = `grid grid-cols-1 ${breakpoint}:grid-cols-3 gap-${gap}`;
  }

  // Split children into three columns (first = left, second = middle, rest = right)
  const leftChildren = node.children.length >= 1 ? [node.children[0]] : [];
  const middleChildren = node.children.length >= 2 ? [node.children[1]] : [];
  const rightChildren = node.children.length >= 3 ? node.children.slice(2) : [];

  const leftJSX = leftChildren
    .map((child) => generateNodeJSX(child, registry, indent + 4, dataSources))
    .join("\n");
  const middleJSX = middleChildren
    .map((child) => generateNodeJSX(child, registry, indent + 4, dataSources))
    .join("\n");
  const rightJSX = rightChildren
    .map((child) => generateNodeJSX(child, registry, indent + 4, dataSources))
    .join("\n");

  return `${indentStr}<div className="${gridClass} ${layoutClasses}" data-ui-id="${node.id}">
${indentStr}  <div className="md:col-span-1">
${leftJSX}
${indentStr}  </div>
${indentStr}  <div className="md:col-span-1">
${middleJSX}
${indentStr}  </div>
${indentStr}  <div className="md:col-span-1">
${rightJSX}
${indentStr}  </div>
${indentStr}</div>`;
}

/**
 * Generate JSX for sidebar layout
 */
function generateSidebarJSX(
  node: UiSidebar,
  registry: any,
  indent: number,
  dataSources?: DataSource[]
): string {
  const indentStr = " ".repeat(indent);
  const layoutClasses = generateLayoutClasses(node.layout);
  const position = node.position || "left";
  const sidebarWidth = node.sidebarWidth || "md";
  const gap = node.gap || 4;
  
  // Generate responsive classes
  const flexDirection = position === "left" ? "flex-row" : "flex-row-reverse";
  const sidebarWidthClass = `w-${sidebarWidth === "sm" ? "64" : sidebarWidth === "lg" ? "80" : "72"}`;
  const contentMaxWidth = node.contentMaxWidth || "full";
  const contentMaxWidthClass = contentMaxWidth !== "full" ? `max-w-${contentMaxWidth}` : "";
  
  const layoutClass = `flex ${flexDirection} gap-${gap}`;

  // Split children: first = sidebar, rest = content
  const sidebarChildren = node.children.length >= 1 ? [node.children[0]] : [];
  const contentChildren = node.children.length > 1 ? node.children.slice(1) : [];

  const sidebarJSX = sidebarChildren
    .map((child) => generateNodeJSX(child, registry, indent + 4, dataSources))
    .join("\n");
  const contentJSX = contentChildren
    .map((child) => generateNodeJSX(child, registry, indent + 4, dataSources))
    .join("\n");

  return `${indentStr}<div className="${layoutClass} ${layoutClasses}" data-ui-id="${node.id}">
${indentStr}  <aside className="${sidebarWidthClass} flex-shrink-0">
${sidebarJSX}
${indentStr}  </aside>
${indentStr}  <main className="flex-1 ${contentMaxWidthClass}">
${contentJSX}
${indentStr}  </main>
${indentStr}</div>`;
}

/**
 * Generate JSX for block reference
 */
function generateBlockJSX(
  node: UiBlockRef,
  registry: any,
  indent: number
): string {
  const indentStr = " ".repeat(indent);
  
  // Extract block name from ref (e.g., "@fragment_ui/blocks/dashboard-widgets" -> "DashboardWidgets")
  const refParts = node.ref.split("/");
  const blockRefName = refParts[refParts.length - 1];
  const blockName = blockRefName
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
  
  const inputs = node.inputs || {};

  // Special handling for DashboardWidgets
  if (blockName === "DashboardWidgets" || node.ref.includes("dashboard-widgets")) {
    const widgets = (inputs.widgets as any[]) || [];
    const columns = inputs.columns || 12;
    
    // Generate widgets array with JSX content
    const widgetsWithJSX = widgets.map((widget) => {
      let contentJSX: string | null = null;
      if (widget.content && typeof widget.content === "object" && widget.content.type === "component") {
        // Generate JSX for component content
        contentJSX = generateComponentJSX(widget.content, registry, indent + 6);
      }
      
      return {
        ...widget,
        contentJSX, // Store JSX separately
      };
    });
    
    // Generate widgets prop with inline JSX
    const widgetsProp = widgetsWithJSX.map((widget) => {
      const widgetProps: string[] = [
        `id: "${widget.id}"`,
        `type: "${widget.type}"`,
        widget.title ? `title: "${widget.title}"` : "",
        widget.span ? `span: ${widget.span}` : "",
      ].filter(Boolean);
      
      let contentPart = "";
      if (widget.contentJSX) {
        // Use JSX for content
        contentPart = `content: (\n${widget.contentJSX}\n${" ".repeat(indent + 4)})`;
      } else {
        contentPart = `content: ${JSON.stringify(widget.content)}`;
      }
      
      return `{\n${" ".repeat(indent + 4)}${widgetProps.join(",\n" + " ".repeat(indent + 4))},\n${" ".repeat(indent + 4)}${contentPart}\n${" ".repeat(indent + 2)}}`;
    }).join(",\n");
    
    const props = [
      `widgets={[\n${widgetsProp}\n${indentStr}]}`,
      `columns={${columns}}`,
    ].join(" ");

    return `${indentStr}<DashboardWidgets ${props} data-ui-id="${node.id}" />`;
  }

  // Generate props for other blocks
  const props = Object.entries(inputs)
    .map(([key, value]) => {
      if (typeof value === "object" && value !== null && !Array.isArray(value)) {
        return `${key}={${JSON.stringify(value)}}`;
      }
      return `${key}={${JSON.stringify(value)}}`;
    })
    .join(" ");

  return `${indentStr}<${blockName} ${props} data-ui-id="${node.id}" />`;
}

/**
 * Generate JSX for component
 */
function generateComponentJSX(
  node: UiComponent,
  registry: any,
  indent: number,
  dataSources?: DataSource[]
): string {
  const indentStr = " ".repeat(indent);
  let componentName = node.component;
  
  // CRITICAL: Validate component name - if undefined or "undefined", use fallback
  if (!componentName || componentName === "undefined" || componentName === "null") {
    console.warn(`[dsl-codegen] Component name is ${componentName} for node ${node.id}, using fallback "div"`);
    componentName = "div";
  }
  
  // Normalize component name: check registry for kebab-case keys
  // Registry uses kebab-case (e.g., "metric-card") but DSL uses PascalCase (e.g., "MetricCard")
  if (registry?.components) {
    // Try exact match first
    if (!registry.components[componentName]) {
      // Try kebab-case version
      const kebabCase = componentName
        .replace(/([A-Z])/g, "-$1")
        .toLowerCase()
        .replace(/^-/, "");
      if (registry.components[kebabCase]) {
        // Component exists in registry as kebab-case, but we use PascalCase in code
        // Keep PascalCase for component name in JSX
        componentName = componentName; // Already PascalCase
      } else {
        // Component not found in registry - use fallback
        console.warn(`[dsl-codegen] Component "${componentName}" not found in registry, using fallback "div"`);
        componentName = "div";
      }
    }
  }

  // Generate props
  const props: string[] = [];
  if (node.variant) {
    props.push(`variant="${node.variant}"`);
  }
  if (node.props) {
    Object.entries(node.props).forEach(([key, value]) => {
      // CRITICAL: Skip undefined values - don't generate props with undefined
      if (value === undefined || value === null || value === "undefined" || value === "null") {
        return; // Skip this prop
      }
      
      // Special handling for onClick and other function props
      if (key === "onClick" || key.startsWith("on")) {
        // If it's a string, treat it as a function body
        if (typeof value === "string") {
          // Remove any quotes that might be around the value
          let cleanValue = value.trim().replace(/^["']|["']$/g, '');
          
          // Remove any malformed data-ui-id attributes that might be inside the onClick value
          // This can happen if the DSL was corrupted or incorrectly generated
          // Pattern: data-ui-id="..." or data-ui-id='...' or = data-ui-id="..."
          cleanValue = cleanValue.replace(/data-ui-id\s*=\s*["'][^"']*["']/g, '');
          cleanValue = cleanValue.replace(/\s*=\s*data-ui-id\s*=\s*["'][^"']*["']/g, '');
          cleanValue = cleanValue.replace(/data-ui-id\s*=\s*[^"'\s>]+/g, '');
          
          // Remove any stray = characters that might be left (e.g., "() = data-ui-id=...")
          cleanValue = cleanValue.replace(/\(\)\s*=\s*([^=])/g, '() => $1');
          
          // Clean up any stray > characters that might be left
          cleanValue = cleanValue.replace(/^\s*>\s*/, '').replace(/\s*>\s*$/, '');
          cleanValue = cleanValue.replace(/\s*>\s*/g, ' ');
          cleanValue = cleanValue.trim();
          
          // If it already looks like a function, use it directly
          if (cleanValue.startsWith("()") || cleanValue.startsWith("function") || cleanValue.includes("=>")) {
            // Ensure it's a valid arrow function
            if (!cleanValue.includes("=>") && cleanValue.startsWith("()")) {
              cleanValue = cleanValue.replace(/^\(\)\s*/, "() => ");
            }
            props.push(`${key}={${cleanValue}}`);
          } else {
            // Otherwise wrap it in an arrow function
            props.push(`${key}={() => ${cleanValue}}`);
          }
        } else {
          // If it's already a function or object, stringify it
          props.push(`${key}={${JSON.stringify(value)}}`);
        }
      } else if (typeof value === "string") {
        props.push(`${key}="${value}"`);
      } else {
        props.push(`${key}={${JSON.stringify(value)}}`);
      }
    });
  }
  if (node.copy) {
    // For components that support children, use copy as children
    props.push(`children="${node.copy}"`);
  }
  // Always add data-ui-id (mirrors id)
  props.push(`data-ui-id="${node.id}"`);

  // Generate bindings - resolve datasource references
  if (node.bind && node.bind.length > 0 && dataSources) {
    node.bind.forEach((binding) => {
      // Find datasource index by ID
      const dsIndex = dataSources.findIndex(ds => ds.id === binding.sourceId);
      if (dsIndex >= 0) {
        const datasource = dataSources[dsIndex];
        // For placeholder datasources, generatePlaceholderData returns data directly:
        // - "table" -> array
        // - "cards" -> array  
        // - "list" -> array
        // - "metrics" -> object
        // So if shape is array-based and path is "rows", use data directly
        const arrayShapes = ["table", "cards", "list"];
        if (datasource.kind === "placeholder" && 
            arrayShapes.includes(datasource.shape || "") && 
            binding.path === "rows") {
          // Use data directly without .rows path
          props.push(`${binding.prop}={data${dsIndex}}`);
        } else {
          // Resolve path (e.g., "rows" -> data0.rows or just data0)
          const dataPath = binding.path ? `.${binding.path}` : '';
          props.push(`${binding.prop}={data${dsIndex}${dataPath}}`);
        }
      }
    });
  }

  // Generate slots if present
  if (node.slots && Object.keys(node.slots).length > 0) {
    const slotJSX: string[] = [];
    Object.entries(node.slots).forEach(([slotName, slotNodes]) => {
      const slotContent = slotNodes
        .map((slotNode) => generateNodeJSX(slotNode, registry, indent + 6, dataSources))
        .join("\n");
      
      // Map slot names to proper Card components
      let slotComponent = slotName;
      if (componentName === "Card") {
        if (slotName === "header") {
          slotComponent = "CardHeader";
        } else if (slotName === "content") {
          slotComponent = "CardContent";
        } else if (slotName === "title") {
          slotComponent = "CardTitle";
        } else if (slotName === "description") {
          slotComponent = "CardDescription";
        }
      }
      
      slotJSX.push(`${indentStr}  <${slotComponent}>`);
      slotJSX.push(slotContent);
      slotJSX.push(`${indentStr}  </${slotComponent}>`);
    });

    return `${indentStr}<${componentName} ${props.join(" ")}>
${slotJSX.join("\n")}
${indentStr}</${componentName}>`;
  }

  // Generate children if present
  if (node.children && node.children.length > 0) {
    const childrenJSX = node.children
      .map((child) => generateNodeJSX(child, registry, indent + 2, dataSources))
      .join("\n");

    return `${indentStr}<${componentName} ${props.join(" ")}>
${childrenJSX}
${indentStr}</${componentName}>`;
  }

  // Self-closing component
  return `${indentStr}<${componentName} ${props.join(" ")} />`;
}

/**
 * Generate layout classes from layout config
 */
function generateLayoutClasses(layout?: {
  maxWidth?: string;
  gap?: number;
  padding?: string;
  margin?: string;
}): string {
  const classes: string[] = [];

  if (layout?.maxWidth) {
    classes.push(`max-w-${layout.maxWidth}`);
  }
  if (layout?.gap !== undefined) {
    classes.push(`gap-${layout.gap}`);
  }
  if (layout?.padding) {
    classes.push(`p-${layout.padding}`);
  }
  if (layout?.margin) {
    classes.push(`m-${layout.margin}`);
  }

  return classes.join(" ") || "";
}

/**
 * Generate placeholder data function (for datasource kind="placeholder")
 */
function generatePlaceholderDataFunction(): string {
  return `function generatePlaceholderData(shape) {
  switch (shape) {
    case "table":
      return [
        { id: 1, name: "Item 1", email: "item1@example.com", status: "active" },
        { id: 2, name: "Item 2", email: "item2@example.com", status: "inactive" },
        { id: 3, name: "Item 3", email: "item3@example.com", status: "active" },
      ];
    case "cards":
      return [
        { id: 1, title: "Card 1", description: "Description 1" },
        { id: 2, title: "Card 2", description: "Description 2" },
      ];
    case "metrics":
      return { value: 100, label: "Metric" };
    default:
      return [];
  }
}`;
}

/**
 * Generate Storybook story
 */
function generateStorybookStory(dsl: UiPage, componentName: string): string {
  return `import type { Meta, StoryObj } from "@storybook/react";
import { ${componentName} } from "./${componentName}";

const meta: Meta<typeof ${componentName}> = {
  title: "Generated/${componentName}",
  component: ${componentName},
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof ${componentName}>;

export const Default: Story = {
  render: () => <${componentName} />,
};`;
}

