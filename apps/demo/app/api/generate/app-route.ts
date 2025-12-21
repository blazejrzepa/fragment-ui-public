/**
 * App and Flow Generation System
 * 
 * Generates complete applications with multiple screens and navigation
 */

import { 
  detectScreenType, 
  detectAppFlow, 
  SCREEN_TEMPLATES, 
  APP_FLOW_TEMPLATES,
  suggestComponents,
  COMPOSITION_RULES 
} from "./rules";

export interface Screen {
  id: string;
  name: string;
  type: string;
  components: Array<{
    component: string;
    props?: Record<string, any>;
    position: string;
  }>;
  layout: string;
}

export interface App {
  name: string;
  screens: Screen[];
  navigation: Array<{
    from: string;
    to: string;
    trigger: string;
  }>;
}

/**
 * Generate a complete application from prompt
 */
export function generateApp(prompt: string): App {
  const appFlow = detectAppFlow(prompt);
  
  if (appFlow && APP_FLOW_TEMPLATES[appFlow]) {
    const template = APP_FLOW_TEMPLATES[appFlow];
    return {
      name: template.name,
      screens: template.screens.map((screen, index) => ({
        id: `screen-${index + 1}`,
        name: screen.name,
        type: screen.type,
        components: screen.components.map(comp => ({
          component: comp.component,
          props: comp.props,
          position: comp.position || "body",
        })),
        layout: screen.layout,
      })),
      navigation: template.navigation,
    };
  }
  
  // Generate single screen app
  const screenType = detectScreenType(prompt) || "form";
  const screenTemplate = SCREEN_TEMPLATES[screenType] || SCREEN_TEMPLATES.form;
  
  return {
    name: screenTemplate.name,
    screens: [{
      id: "screen-1",
      name: screenTemplate.name,
      type: screenTemplate.type,
      components: screenTemplate.components.map(comp => ({
        component: comp.component,
        props: comp.props,
        position: comp.position || "body",
      })),
      layout: screenTemplate.layout,
    }],
    navigation: [],
  };
}

/**
 * Generate React code for a complete app with multiple screens
 */
export function generateAppCode(app: App): string {
  const imports = new Set<string>([
    "useState",
    "useEffect",
    "Button",
    "Card",
    "CardContent",
    "CardHeader",
    "CardTitle",
    "CardDescription",
    "Toaster",
    "toast",
  ]);
  
  // Collect all needed components
  app.screens.forEach(screen => {
    screen.components.forEach(comp => {
      imports.add(comp.component);
      // Add required sub-components
      const componentKey = comp.component as keyof typeof COMPOSITION_RULES.required;
      if (COMPOSITION_RULES.required[componentKey]) {
        COMPOSITION_RULES.required[componentKey].forEach(sub => imports.add(sub));
      }
    });
  });
  
  // Generate imports
  const importStatements = Array.from(imports).sort().map(imp => {
    if (imp === "useState" || imp === "useEffect") {
      return `import { ${imp} } from "react";`;
    }
    return `  ${imp},`;
  });
  
  const componentImports = importStatements
    .filter(s => s.includes("  "))
    .join("\n");
  
  const reactImports = importStatements
    .filter(s => !s.includes("  "))
    .join("\n");
  
  // Generate screen components
  const screenComponents = app.screens.map((screen, index) => {
    return generateScreenComponent(screen, index + 1);
  }).join("\n\n");
  
  // Generate navigation
  const navigationCode = app.navigation.length > 0
    ? generateNavigation(app.navigation)
    : "";
  
  // Generate main app component
  const appCode = `
"use client";

${reactImports}
import {
${componentImports}
} from "@fragment_ui/ui";

${screenComponents}

${navigationCode}

export default function GeneratedApp() {
  const [currentScreen, setCurrentScreen] = useState("${app.screens[0]?.id || "screen-1"}");
  
  const navigate = (screenId) => {
    setCurrentScreen(screenId);
  };
  
  const currentScreenData = app.screens.find(s => s.id === currentScreen);
  
  return (
    <div className="min-h-screen bg-[color:var(--color-surface-base)]">
      <Toaster />
      {currentScreen === "screen-1" && <Screen1 onNavigate={navigate} />}
${app.screens.slice(1).map((screen, index) => 
      `      {currentScreen === "${screen.id}" && <Screen${index + 2} onNavigate={navigate} />}`
    ).join("\n")}
    </div>
  );
}

const app = ${JSON.stringify(app, null, 2)};
`;
  
  return appCode.trim();
}

/**
 * Generate code for a single screen
 */
function generateScreenComponent(screen: Screen, screenNumber: number): string {
  const componentName = `Screen${screenNumber}`;
  
  // Group components by position
  const headerComponents = screen.components.filter(c => c.position === "header");
  const bodyComponents = screen.components.filter(c => c.position === "body");
  const footerComponents = screen.components.filter(c => c.position === "footer");
  
  // Generate layout based on screen layout type
  const layoutCode = generateLayout(screen.layout, {
    header: headerComponents,
    body: bodyComponents,
    footer: footerComponents,
  });
  
  return `function ${componentName}({ onNavigate }) {
  return (
${layoutCode}
  );
}`;
}

/**
 * Generate layout structure
 */
function generateLayout(
  layoutType: string,
  components: {
    header: Array<any>;
    body: Array<any>;
    footer: Array<any>;
  }
): string {
  const layoutTypeKey = layoutType as keyof typeof COMPOSITION_RULES.layouts;
  const layoutConfig = COMPOSITION_RULES.layouts[layoutTypeKey] || COMPOSITION_RULES.layouts["single-column"];
  
  let code = `    <div className="${layoutConfig.maxWidth} mx-auto p-6">\n`;
  
  // Header
  if (components.header.length > 0) {
    code += `      <header className="mb-8">\n`;
    components.header.forEach(comp => {
      code += `        ${generateComponentCode(comp)}\n`;
    });
    code += `      </header>\n`;
  }
  
  // Body
  if (components.body.length > 0) {
    code += `      <main className="space-y-6">\n`;
    components.body.forEach(comp => {
      code += `        ${generateComponentCode(comp)}\n`;
    });
    code += `      </main>\n`;
  }
  
  // Footer
  if (components.footer.length > 0) {
    code += `      <footer className="mt-8">\n`;
    components.footer.forEach(comp => {
      code += `        ${generateComponentCode(comp)}\n`;
    });
    code += `      </footer>\n`;
  }
  
  code += `    </div>`;
  
  return code;
}

/**
 * Generate code for a single component
 */
function generateComponentCode(comp: any): string {
  const { component, props = {} } = comp;
  
  // Basic component rendering
  switch (component) {
    case "NavigationMenu":
      return `<NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Home</NavigationMenuTrigger>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>About</NavigationMenuTrigger>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>`;
    
    case "Card":
      return `<Card>
        <CardHeader>
          <CardTitle>${props.title || "Card Title"}</CardTitle>
          <CardDescription>${props.description || "Card description"}</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card content goes here</p>
        </CardContent>
      </Card>`;
    
    case "Button":
      return `<Button variant="${props.variant || "solid"}" size="${props.size || "md"}">
        ${props.label || "Button"}
      </Button>`;
    
    case "Table":
      return `<Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>John Doe</TableCell>
            <TableCell>john@example.com</TableCell>
            <TableCell>Admin</TableCell>
          </TableRow>
        </TableBody>
      </Table>`;
    
    case "Input":
      return `<Input 
        type="${props.type || "text"}" 
        placeholder="${props.placeholder || "Enter text..."}"
      />`;
    
    case "Select":
      return `<Select 
        value="${props.value || ""}"
        onValueChange={(value) => console.log("Selected:", value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="${props.placeholder || "Select an option..."}" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
          <SelectItem value="option3">Option 3</SelectItem>
        </SelectContent>
      </Select>`;
    
    case "Pagination":
      return `<Pagination 
        currentPage={1}
        totalPages={10}
        onPageChange={(page) => console.log("Page changed:", page)}
      />`;
    
    default:
      return `<${component} />`;
  }
}

/**
 * Generate navigation code
 */
function generateNavigation(navigation: Array<{ from: string; to: string; trigger: string }>): string {
  return `
// Navigation handlers
const navigationHandlers = {
${navigation.map(nav => 
  `  "${nav.from}": (onNavigate) => {
    onNavigate("${nav.to}");
  },`
).join("\n")}
};
`;
}

