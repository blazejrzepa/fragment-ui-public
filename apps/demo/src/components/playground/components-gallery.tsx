"use client";

import React, { useMemo } from "react";
import { ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, Tabs, TabsList, TabsTrigger, TabsContent, ComponentCard } from "@fragment_ui/ui";
import { ReactLiveRenderer } from "@/components/react-live-renderer";
import type { Registry } from "@/types/registry";
import { ComponentCodeGenerator } from "@/lib/component-code-generator";

interface ComponentsGalleryProps {
  registry: Registry | null;
  filterType?: "components" | "blocks" | "all"; // Filter by type: show only components, only blocks, or all
  librarySubTab?: "components" | "blocks"; // Sub-tab for library view (shows internal tabs)
  onLibrarySubTabChange?: (tab: "components" | "blocks") => void; // Callback when library sub-tab changes
  onComponentClick?: (componentName: string) => void;
}

// List of all available components (matching DS Portal)
// This is the source of truth for all components with documentation pages
const ALL_COMPONENTS = [
  "accordion",
  "alert",
  "aspect-ratio",
  "avatar",
  "badge",
  "breadcrumbs",
  "button",
  "calendar",
  "card",
  "carousel",
  "checkbox",
  "collapsible",
  "color-picker",
  "combobox",
  "command-palette",
  "context-menu",
  "data-table",
  "date-picker",
  "dialog",
  "dropdown-menu",
  "file-upload",
  "form-container",
  "form-field",
  "hover-card",
  "input",
  "kbd",
  "menubar",
  "multi-select",
  "navigation-menu",
  "pagination",
  "popover",
  "progress",
  "radio",
  "rating",
  "resizable",
  "scroll-area",
  "segmented-control",
  "select",
  "separator",
  "sheet",
  "skeleton",
  "slider",
  "spinner",
  "split-button",
  "stepper",
  "switch",
  "table",
  "tabs",
  "tag-input",
  "textarea",
  "timeline",
  "toast",
  "toggle",
  "toggle-group",
  "tooltip",
  "tree-view",
  "activity-feed",
  "quick-actions",
  "filter-bar",
  "metric-card",
  "chart",
];

// List of known blocks (matching DS Portal)
const KNOWN_BLOCKS = [
  "authentication-block",
  "card-grid",
  "dashboard-layout",
  "form-container",
  "navigation-header",
  "pricing-table",
  "settings-screen",
  "data-table",
  "hero-section",
  "feature-grid-section",
  "stats-section",
  "testimonials-section",
  "faq-section",
  "cta-section",
  "widget-container",
  "dashboard-widgets",
  "benefits-section",
  "comparison-section",
  "footer-section",
  "kpi-dashboard",
  "analytics-dashboard",
];

// UI components exceptions (components with hyphens that are UI components, not blocks)
// These should appear in the "Components" tab, not "Blocks" tab
// Must match DS Portal componentExceptions
const uiComponentExceptions = [
  "multi-select",
  "command-palette",
  "date-picker",
  "toggle-group",
  "tree-view",
  "color-picker",
  "segmented-control",
  "rating",
  "file-upload",
  "split-button",
  "tag-input",
  "activity-feed",
  "quick-actions",
  "filter-bar",
  "metric-card",
  "chart",
  "dropdown-menu",
  "context-menu",
  "hover-card",
  "navigation-menu",
  "scroll-area",
  "aspect-ratio",
  "data-table",
  "form-field",
];

/**
 * Ensures that the generated code has a render() call for react-live's noInline mode
 */
function ensureRenderCall(code: string): string {
  // First, normalize require() to import statements
  code = code.replace(
    /const\s+(\w+)\s*=\s*require\(['"]([^'"]+)['"]\)/g,
    (match, varName, modulePath) => {
      return `import ${varName} from "${modulePath}";`;
    }
  );
  
  // Fix arrow functions in object literals that might cause syntax errors
  // Pattern: accessor: (row) => row.name -> accessor: (row) => row.name (keep as is, but ensure proper formatting)
  // This is handled by fixSyntaxErrors in the API route, but we should ensure it's correct here too
  
  // First, fix any existing render() calls that use function calls instead of JSX
  // Pattern: render(ComponentName()) -> render(<ComponentName />)
  code = code.replace(/render\s*\(\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(\s*\)\s*\)/g, 'render(<$1 />)');
  
  // Check if code already has render() call (more robust check)
  const hasRenderCall = /render\s*\(/s.test(code);
  if (hasRenderCall) {
    return code;
  }
  
  // Check if code is just JSX without a function wrapper
  // Pattern: <Component ... /> or <Component>...</Component> at the start (after imports)
  const importsMatch = code.match(/^(import\s+.*?\n)+/s);
  const codeWithoutImports = importsMatch ? code.slice(importsMatch[0].length) : code;
  const trimmedCode = codeWithoutImports.trim();
  
  // If code starts with JSX (after imports), wrap it in a function
  if (trimmedCode.startsWith('<') && !trimmedCode.includes('export default') && !trimmedCode.includes('function')) {
    const imports = importsMatch ? importsMatch[0] : '';
    return `${imports}export default function Preview() {
  return (
    ${trimmedCode}
  );
}

render(<Preview />);`;
  }
  
  // Extract component name from export default function (more robust pattern)
  const defaultExportMatch = code.match(/export\s+default\s+function\s+(\w+)\s*\(/);
  if (defaultExportMatch) {
    const componentName = defaultExportMatch[1];
    // Add render call at the end using JSX syntax (required for hooks to work)
    return `${code}\n\nrender(<${componentName} />);`;
  }
  
  // Try to find const/function component export
  const constExportMatch = code.match(/export\s+default\s+const\s+(\w+)\s*=/);
  if (constExportMatch) {
    const componentName = constExportMatch[1];
    return `${code}\n\nrender(<${componentName} />);`;
  }
  
  // Try to find any exported function component (more flexible pattern)
  const functionMatch = code.match(/(?:export\s+default\s+)?function\s+([A-Z]\w*)\s*\(/);
  if (functionMatch) {
    const componentName = functionMatch[1];
    return `${code}\n\nrender(<${componentName} />);`;
  }
  
  // Try to find any exported const component
  const constComponentMatch = code.match(/(?:export\s+default\s+)?const\s+([A-Z]\w*)\s*=\s*(?:\(|function)/);
  if (constComponentMatch) {
    const componentName = constComponentMatch[1];
    return `${code}\n\nrender(<${componentName} />);`;
  }
  
  // Try to find camelCase component names (e.g., calendarExample, colorpickerExample, datatableExample)
  const camelCaseMatch = code.match(/(?:export\s+default\s+)?function\s+([a-z][a-zA-Z0-9_$]*)\s*\(/);
  if (camelCaseMatch) {
    const componentName = camelCaseMatch[1];
    return `${code}\n\nrender(<${componentName} />);`;
  }
  
  // Last resort: try to find Preview component (most common pattern)
  if (code.includes('function Preview') || code.includes('const Preview')) {
    return `${code}\n\nrender(<Preview />);`;
  }
  
  // Final fallback: try to render the last exported component or add a generic render
  // But this is risky, so we'll let ReactLiveRenderer handle it with a warning
  console.warn('[ensureRenderCall] Could not find component to render, code may fail:', code.substring(0, 100));
  return code;
}

/**
 * Generates component preview code without render() call
 * Used by ComponentCodeGenerator to generate examples
 */
export function generateComponentCodeWithoutRender(componentName: string, componentInfo: any): string {
  // Use pre-generated example from registry if available (check examples array first)
  let code: string;
  
  // Check examples array (preferred - matches useComponentPreview and ComponentCodeGenerator)
  if (componentInfo?.examples && Array.isArray(componentInfo.examples) && componentInfo.examples.length > 0) {
    const firstExample = componentInfo.examples[0];
    if (firstExample?.code) {
      code = firstExample.code;
      // Remove render() call if present (ComponentRenderer will add it)
      return code.replace(/\n\s*render\s*\([^)]*\)\s*;?\s*$/s, '').trim();
    }
  }
  
  // Fallback to single example (for backward compatibility)
  if (componentInfo?.example?.code) {
    code = componentInfo.example.code;
    // Remove render() call if present (ComponentRenderer will add it)
    return code.replace(/\n\s*render\s*\([^)]*\)\s*;?\s*$/s, '').trim();
  }
  
  // Generate code using the same logic as generateComponentPreviewCode
  return generateComponentPreviewCodeInternal(componentName, componentInfo);
}

function generateComponentPreviewCode(componentName: string, componentInfo: any): string {
  // Use pre-generated example from registry if available (check examples array first)
  let code: string;
  
  // Check examples array (preferred - matches useComponentPreview and ComponentCodeGenerator)
  if (componentInfo?.examples && Array.isArray(componentInfo.examples) && componentInfo.examples.length > 0) {
    const firstExample = componentInfo.examples[0];
    if (firstExample?.code) {
      code = firstExample.code;
      return ensureRenderCall(code);
    }
  }
  
  // Fallback to single example (for backward compatibility)
  if (componentInfo?.example?.code) {
    code = componentInfo.example.code;
    return ensureRenderCall(code);
  }
  
  // Generate code using internal function and add render call
  code = generateComponentPreviewCodeInternal(componentName, componentInfo);
  return ensureRenderCall(code);
}

/**
 * Internal function that generates component code without render() call
 */
function generateComponentPreviewCodeInternal(componentName: string, componentInfo: any): string {
  let code: string;
  
  // Generate a simple preview code for the component
  const packageName = (!componentName.includes("-") || uiComponentExceptions.includes(componentName))
    ? "@fragment_ui/ui"
    : "@fragment_ui/blocks";
  
  // Convert kebab-case to PascalCase for component name
  // Handle special cases for acronyms (kpi -> KPI, etc.)
  const acronymMap: Record<string, string> = {
    "kpi": "KPI",
    "api": "API",
    "ui": "UI",
    "id": "ID",
    "url": "URL",
    "http": "HTTP",
    "html": "HTML",
    "css": "CSS",
    "js": "JS",
  };
  
  const componentDisplayName = componentName
    .split("-")
    .map(word => {
      const lowerWord = word.toLowerCase();
      return acronymMap[lowerWord] || word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join("");
  
  // Generate basic example based on component type
  const examples: Record<string, string> = {
    "alert": `import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogAction } from "${packageName}";

export default function Preview() {
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button className="px-4 py-2 bg-blue-500 text-white rounded">Show Alert</button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Alert</AlertDialogTitle>
            <AlertDialogDescription>This is an alert message.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogAction>OK</AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}`,
    // Accordion removed - now uses examples from registry for consistency
    // "accordion": ... (removed - use registry examples instead)
    "alert-dialog": `import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel } from "${packageName}";

export default function Preview() {
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button>Open Dialog</button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Alert</AlertDialogTitle>
            <AlertDialogDescription>This is an alert dialog.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogAction>OK</AlertDialogAction>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}`,
    "avatar": `import { Avatar } from "${packageName}";

export default function Preview() {
  return (
    <div className="w-full h-full flex items-center justify-center gap-2 p-4">
      <Avatar alt="User" fallback="U" />
    </div>
  );
}`,
    "badge": `import { Badge } from "${packageName}";

export default function Preview() {
  return (
    <div className="w-full h-full flex items-center justify-center gap-2 p-4">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
    </div>
  );
}`,
    "breadcrumbs": `import { Breadcrumbs } from "${packageName}";

export default function Preview() {
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "About", href: "/about" }
        ]}
      />
    </div>
  );
}`,
    "button": `import { Button } from "${packageName}";
import { useState } from "react";
import { toast } from "${packageName}";

export default function Preview() {
  const [count, setCount] = useState(0);
  return (
    <div className="w-full h-full flex items-center justify-center gap-2 p-4">
      <Button onClick={() => {
        setCount(count + 1);
        toast.success(\`Clicked \${count + 1} times!\`);
      }}>
        Click me ({count})
      </Button>
      <Button variant="outline" onClick={() => setCount(0)}>Reset</Button>
    </div>
  );
}`,
    "calendar": `import { Calendar } from "${packageName}";

export default function Preview() {
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <Calendar />
    </div>
  );
}`,
    "metric-card": `import { MetricCard } from "${packageName}";

export default function Preview() {
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <MetricCard
        title="Total Revenue"
        value="$45,231"
        trend="up"
        trendValue="+20.1%"
        description="From last month"
      />
    </div>
  );
}`,
    "activity-feed": `import { ActivityFeed } from "${packageName}";

export default function Preview() {
  const activities = [
    {
      id: "1",
      type: "action",
      title: "John Doe created a new project",
      timestamp: new Date(),
      user: { name: "John Doe" },
    },
  ];
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <ActivityFeed items={activities} />
    </div>
  );
}`,
    "quick-actions": `import { QuickActions } from "${packageName}";

export default function Preview() {
  const actions = [
    { id: "1", label: "New Project", icon: "➕", onClick: () => {} },
    { id: "2", label: "Import", icon: "📥", onClick: () => {} },
  ];
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <QuickActions actions={actions} columns={2} />
    </div>
  );
}`,
    "filter-bar": `import { FilterBar } from "${packageName}";
import { useState } from "react";

export default function Preview() {
  const [search, setSearch] = useState("");
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <FilterBar
        filters={[
          {
            id: "search",
            type: "search",
            placeholder: "Search...",
            value: search,
            onChange: (value) => setSearch(value),
          },
        ]}
        onClear={() => setSearch("")}
      />
    </div>
  );
}`,
    "chart": `import { Chart } from "${packageName}";

export default function Preview() {
  const data = [
    { label: "Jan", value: 1000 },
    { label: "Feb", value: 1500 },
    { label: "Mar", value: 1200 },
  ];
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <Chart data={data} type="line" height={200} />
    </div>
  );
}`,
    "card": `import { Card, CardHeader, CardTitle, CardContent } from "${packageName}";

export default function Preview() {
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
        </CardHeader>
        <CardContent>
          Card content
        </CardContent>
      </Card>
    </div>
  );
}`,
    "carousel": `import { Carousel } from "${packageName}";

export default function Preview() {
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <Carousel className="w-full max-w-xs">
        <div className="h-32 flex items-center justify-center bg-blue-500 text-white rounded-lg">Slide 1</div>
        <div className="h-32 flex items-center justify-center bg-green-500 text-white rounded-lg">Slide 2</div>
        <div className="h-32 flex items-center justify-center bg-orange-500 text-white rounded-lg">Slide 3</div>
      </Carousel>
    </div>
  );
}`,
    "checkbox": `import { Checkbox } from "${packageName}";

export default function Preview() {
  return (
    <div className="w-full h-full flex items-center justify-center gap-2 p-4">
      <Checkbox id="check1" />
      <label htmlFor="check1">Checkbox</label>
    </div>
  );
}`,
    "collapsible": `import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "${packageName}";
import { useState } from "react";

export default function Preview() {
  const [open, setOpen] = useState(false);
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <Collapsible open={open} onOpenChange={setOpen} className="w-full max-w-md">
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent>Collapsible content</CollapsibleContent>
      </Collapsible>
    </div>
  );
}`,
    "color-picker": `import { ColorPicker } from "${packageName}";

export default function Preview() {
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <ColorPicker />
    </div>
  );
}`,
    "combobox": `import { Combobox } from "${packageName}";

export default function Preview() {
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <Combobox placeholder="Select..." options={[{ value: "1", label: "Option 1" }]} />
    </div>
  );
}`,
    "command-palette": `import { CommandPalette } from "${packageName}";

export default function Preview() {
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <CommandPalette 
        actions={[
          { id: "1", label: "New File", keywords: ["new", "file"], onSelect: () => console.log("New File") },
          { id: "2", label: "Open File", keywords: ["open", "file"], onSelect: () => console.log("Open File") },
          { id: "3", label: "Save File", keywords: ["save", "file"], onSelect: () => console.log("Save File") }
        ]}
      />
    </div>
  );
}`,
    "date-picker": `import { DatePicker } from "${packageName}";

export default function Preview() {
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <DatePicker />
    </div>
  );
}`,
    "dialog": `import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "${packageName}";

export default function Preview() {
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <Dialog>
        <DialogTrigger asChild>
          <button>Open Dialog</button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>Dialog description</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}`,
    "context-menu": `import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem, ContextMenuLabel, ContextMenuSeparator } from "${packageName}";

export default function Preview() {
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <ContextMenu>
        <ContextMenuTrigger className="flex h-[150px] w-full max-w-md items-center justify-center rounded-md border border-[color:var(--color-fg-muted)] text-sm">
          Right click here
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuLabel>My Account</ContextMenuLabel>
          <ContextMenuSeparator />
          <ContextMenuItem>Profile</ContextMenuItem>
          <ContextMenuItem>Settings</ContextMenuItem>
          <ContextMenuItem>Logout</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
}`,
    "dropdown-menu": `import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "${packageName}";
import { Button } from "${packageName}";

export default function Preview() {
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Open Menu</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}`,
    "hover-card": `import { HoverCard, HoverCardContent, HoverCardTrigger } from "${packageName}";
import { Avatar } from "${packageName}";

export default function Preview() {
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <HoverCard>
        <HoverCardTrigger asChild>
          <button 
            type="button"
            className="text-[color:var(--color-brand-primary)] hover:underline"
          >
            @username
          </button>
        </HoverCardTrigger>
        <HoverCardContent>
          <div className="flex gap-4">
            <Avatar />
            <div className="space-y-1">
              <h4 className="text-sm font-semibold">@username</h4>
              <p className="text-sm text-[color:var(--color-fg-muted)]">
                Full name
              </p>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}`,
    "scroll-area": `import { ScrollArea } from "${packageName}";

export default function Preview() {
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <ScrollArea className="h-72 w-80 rounded-md border border-[color:var(--color-fg-muted)] p-4">
        <div className="space-y-2">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="text-sm">
              Item {i + 1}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}`,
    "file-upload": `import { FileUpload } from "${packageName}";

export default function Preview() {
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <FileUpload />
    </div>
  );
}`,
    "form-enhanced": `import { FormEnhanced, FormFieldEnhanced } from "${packageName}";
import { Input } from "${packageName}";

export default function Preview() {
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <FormEnhanced onSubmit={(data) => console.log(data)} className="w-full max-w-xs">
        <FormFieldEnhanced name="field" label="Field">
          <Input />
        </FormFieldEnhanced>
      </FormEnhanced>
    </div>
  );
}`,
    "form-field": `import { FormField } from "${packageName}";
import { Input } from "${packageName}";

export default function Preview() {
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <FormField name="field" label="Field" className="w-full max-w-xs">
        <Input />
      </FormField>
    </div>
  );
}`,
    "input": `import { Input } from "${packageName}";

export default function Preview() {
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <Input placeholder="Enter text..." className="w-full max-w-xs" />
    </div>
  );
}`,
    "kbd": `import { Kbd } from "${packageName}";

export default function Preview() {
  return (
    <div className="w-full h-full flex items-center justify-center gap-2 p-4">
      <Kbd>⌘</Kbd>
      <Kbd>K</Kbd>
    </div>
  );
}`,
    "menubar": `import { Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem } from "${packageName}";

export default function Preview() {
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>New</MenubarItem>
            <MenubarItem>Open</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </div>
  );
}`,
    "multi-select": `import { MultiSelect } from "${packageName}";
import { useState } from "react";

export default function Preview() {
  const [value, setValue] = useState([]);
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <MultiSelect 
        options={[{ value: "1", label: "Option 1" }, { value: "2", label: "Option 2" }]} 
        value={value}
        onValueChange={setValue}
      />
    </div>
  );
}`,
    "pagination": `import { Pagination } from "${packageName}";
import { useState } from "react";

export default function Preview() {
  const [currentPage, setCurrentPage] = useState(1);
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <Pagination 
        currentPage={currentPage}
        totalPages={10}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}`,
    "popover": `import { Popover, PopoverTrigger, PopoverContent } from "${packageName}";
import { Button } from "${packageName}";

export default function Preview() {
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button>Open Popover</Button>
        </PopoverTrigger>
        <PopoverContent>Popover content</PopoverContent>
      </Popover>
    </div>
  );
}`,
    "progress": `import { Progress } from "${packageName}";

export default function Preview() {
  return (
    <div className="w-full h-full flex items-center justify-center p-4 max-w-xs">
      <Progress value={50} />
    </div>
  );
}`,
    "radio": `import { Radio, RadioGroup } from "${packageName}";

export default function Preview() {
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <RadioGroup>
        <Radio value="option1" id="radio1" />
        <label htmlFor="radio1">Option 1</label>
      </RadioGroup>
    </div>
  );
}`,
    "rating": `import { Rating } from "${packageName}";

export default function Preview() {
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <Rating value={3} />
    </div>
  );
}`,
    "resizable": `import { Resizable, ResizableHandle, ResizablePanel } from "${packageName}";

export default function Preview() {
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <Resizable className="w-full max-w-md">
        <ResizablePanel defaultSize={50}>Panel 1</ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={50}>Panel 2</ResizablePanel>
      </Resizable>
    </div>
  );
}`,
    "segmented-control": `import { SegmentedControl } from "${packageName}";
import { useState } from "react";

export default function Preview() {
  const [value, setValue] = useState("1");
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <SegmentedControl 
        options={[{ value: "1", label: "Option 1" }, { value: "2", label: "Option 2" }]} 
        value={value}
        onValueChange={setValue}
      />
    </div>
  );
}`,
    "select": `import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "${packageName}";

export default function Preview() {
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <Select>
        <SelectTrigger className="w-full max-w-xs">
          <SelectValue placeholder="Select..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">Option 1</SelectItem>
          <SelectItem value="2">Option 2</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}`,
    "separator": `import { Separator } from "${packageName}";

export default function Preview() {
  return (
    <div className="w-full h-full flex items-center justify-center p-4 max-w-xs">
      <div className="flex flex-col gap-2 w-full">
        <div>Item 1</div>
        <Separator />
        <div>Item 2</div>
      </div>
    </div>
  );
}`,
    "sheet": `import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "${packageName}";
import { Button } from "${packageName}";

export default function Preview() {
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <Sheet>
        <SheetTrigger asChild>
          <Button>Open Sheet</Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Sheet Title</SheetTitle>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
}`,
    "skeleton": `import { Skeleton } from "${packageName}";

export default function Preview() {
  return (
    <div className="p-4 flex flex-col gap-2 w-full max-w-xs">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  );
}`,
    "slider": `import { Slider } from "${packageName}";

export default function Preview() {
  return (
    <div className="w-full h-full flex items-center justify-center p-4 max-w-xs">
      <Slider defaultValue={[50]} max={100} step={1} />
    </div>
  );
}`,
    "spinner": `import { Spinner } from "${packageName}";

export default function Preview() {
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <Spinner />
    </div>
  );
}`,
    "split-button": `import { SplitButton } from "${packageName}";

export default function Preview() {
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <SplitButton 
        primaryAction={{ label: "Action", onClick: () => console.log("Action clicked") }}
        options={[
          { label: "Option 1", onClick: () => console.log("Option 1") },
          { label: "Option 2", onClick: () => console.log("Option 2") }
        ]}
      />
    </div>
  );
}`,
    "stepper": `import { Stepper } from "${packageName}";

export default function Preview() {
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <Stepper 
        currentStep={1}
        steps={[
          { id: "1", label: "Step 1", description: "First step" },
          { id: "2", label: "Step 2", description: "Second step" },
          { id: "3", label: "Step 3", description: "Third step" }
        ]}
      />
    </div>
  );
}`,
    "switch": `import { Switch } from "${packageName}";

export default function Preview() {
  return (
    <div className="w-full h-full flex items-center justify-center gap-2 p-4">
      <Switch id="switch1" />
      <label htmlFor="switch1">Switch</label>
    </div>
  );
}`,
    "table": `import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "${packageName}";

export default function Preview() {
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <Table className="w-full max-w-xs">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Item 1</TableCell>
            <TableCell>Active</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Item 2</TableCell>
            <TableCell>Inactive</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}`,
    "data-table": `import { DataTable } from "${packageName}";

export default function Preview() {
  const data = [
    { id: "1", name: "John Doe", email: "john@example.com", status: "Active" },
    { id: "2", name: "Jane Smith", email: "jane@example.com", status: "Inactive" },
    { id: "3", name: "Bob Johnson", email: "bob@example.com", status: "Active" },
  ];
  
  function getName(row) {
    return row.name;
  }
  function getEmail(row) {
    return row.email;
  }
  function getStatus(row) {
    return row.status;
  }
  
  const columns = [
    { id: "name", header: "Name", accessor: getName, sortable: true },
    { id: "email", header: "Email", accessor: getEmail, sortable: true },
    { id: "status", header: "Status", accessor: getStatus, sortable: true },
  ];
  
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <DataTable data={data} columns={columns} pageSize={5} searchable />
    </div>
  );
}`,
    "tabs": `import { Tabs, TabsList, TabsTrigger, TabsContent } from "${packageName}";

export default function Preview() {
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <Tabs className="w-full max-w-xs">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>
    </div>
  );
}`,
    "tag-input": `import { TagInput } from "${packageName}";

export default function Preview() {
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <TagInput className="w-full max-w-xs" />
    </div>
  );
}`,
    "textarea": `import { Textarea } from "${packageName}";

export default function Preview() {
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <Textarea placeholder="Enter text..." className="w-full max-w-xs" />
    </div>
  );
}`,
    "timeline": `import { Timeline } from "${packageName}";

export default function Preview() {
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <Timeline 
        events={[
          { id: "1", title: "Event 1", description: "First event", status: "completed" },
          { id: "2", title: "Event 2", description: "Second event", status: "current" },
          { id: "3", title: "Event 3", description: "Third event", status: "upcoming" }
        ]}
      />
    </div>
  );
}`,
    "toast": `import { toast } from "${packageName}";
import { Button } from "${packageName}";

export default function Preview() {
  return (
    <div className="w-full h-full flex items-center justify-center gap-2 p-4">
      <Button onClick={() => toast.message("Info message")}>Info</Button>
      <Button onClick={() => toast.success("Success!")}>Success</Button>
      <Button onClick={() => toast.error("Error occurred")}>Error</Button>
      <Button onClick={() => toast.warning("Warning!")}>Warning</Button>
    </div>
  );
}`,
    "toggle": `import { Toggle } from "${packageName}";

export default function Preview() {
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <Toggle>Toggle</Toggle>
    </div>
  );
}`,
    "toggle-group": `import { ToggleGroup, ToggleGroupItem } from "${packageName}";

export default function Preview() {
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <ToggleGroup type="single">
        <ToggleGroupItem value="1">Option 1</ToggleGroupItem>
        <ToggleGroupItem value="2">Option 2</ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}`,
    "tooltip": `import { Tooltip } from "${packageName}";
import { Button } from "${packageName}";

export default function Preview() {
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <Tooltip content="Tooltip content">
        <Button>Hover me</Button>
      </Tooltip>
    </div>
  );
}`,
    "tree-view": `import { TreeView } from "${packageName}";

export default function Preview() {
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <TreeView 
        nodes={[
          { id: "1", label: "Node 1", children: [{ id: "1.1", label: "Node 1.1" }] },
          { id: "2", label: "Node 2" }
        ]}
      />
    </div>
  );
}`,
  };
  
  // Check if we have a specific example
  const normalizedName = componentName.toLowerCase();
  if (examples[normalizedName]) {
    return examples[normalizedName];
  }
  
  // For navigation-header or other blocks
  if (componentName === "navigation-header" || componentName.includes("navigation")) {
    code = `import { NavigationHeader } from "${packageName}";

export default function Preview() {
  return (
    <NavigationHeader
      logoText="App"
      links={[
        { href: "/", label: "Home" },
        { href: "/about", label: "About" }
      ]}
    />
  );
}`;
    return ensureRenderCall(code);
  }
  
  // New blocks examples
  if (componentName === "hero-section") {
    code = `import { HeroSection } from "${packageName}";

export default function Preview() {
  return (
    <HeroSection
      title="Welcome"
      description="Build amazing experiences"
      primaryCTA={{ label: "Get Started", href: "/signup" }}
      secondaryCTA={{ label: "Learn More", href: "/about" }}
    />
  );
}`;
    return code;
  }
  
  if (componentName === "feature-grid-section") {
    code = `import { FeatureGridSection } from "${packageName}";

export default function Preview() {
  return (
    <FeatureGridSection
      title="Features"
      features={[
        { title: "Fast", description: "Lightning fast performance" },
        { title: "Secure", description: "Enterprise-grade security" },
        { title: "Scalable", description: "Grows with your needs" }
      ]}
      columns={3}
    />
  );
}`;
    return ensureRenderCall(code);
  }
  
  if (componentName === "stats-section") {
    code = `import { StatsSection } from "${packageName}";

export default function Preview() {
  return (
    <StatsSection
      items={[
        { label: "Users", value: "1000", trend: "up", change: "+12%" },
        { label: "Revenue", value: "$50K", trend: "up", change: "+5%" }
      ]}
    />
  );
}`;
    return ensureRenderCall(code);
  }
  
  if (componentName === "testimonials-section") {
    code = `import { TestimonialsSection } from "${packageName}";

export default function Preview() {
  return (
    <TestimonialsSection
      title="What Our Customers Say"
      items={[
        { quote: "Great product!", author: "John Doe", role: "CEO", company: "Acme Inc" },
        { quote: "Amazing service", author: "Jane Smith", role: "CTO", company: "Tech Corp" }
      ]}
    />
  );
}`;
    return ensureRenderCall(code);
  }
  
  if (componentName === "faq-section") {
    code = `import { FAQSection } from "${packageName}";

export default function Preview() {
  return (
    <FAQSection
      title="Frequently Asked Questions"
      items={[
        { question: "What is this?", answer: "A design system for building UIs" },
        { question: "How do I use it?", answer: "Import components and start building" }
      ]}
    />
  );
}`;
    return ensureRenderCall(code);
  }
  
  if (componentName === "cta-section") {
    code = `import { CTASection } from "${packageName}";

export default function Preview() {
  return (
    <CTASection
      title="Ready to Get Started?"
      description="Start building amazing experiences today"
      primaryCTA={{ label: "Sign Up", href: "/signup" }}
      secondaryCTA={{ label: "Learn More", href: "/about" }}
    />
  );
}`;
    return ensureRenderCall(code);
  }
  
  if (componentName === "pricing-table") {
    code = `import { PricingTable } from "${packageName}";

export default function Preview() {
  const tiers = [
    {
      name: "Starter",
      description: "Perfect for getting started",
      price: "$9",
      pricePeriod: "month",
      features: [
        { name: "Up to 5 projects", included: true },
        { name: "10GB storage", included: true },
        { name: "Basic support", included: true },
      ],
      ctaText: "Get Started",
      ctaOnClick: () => console.log("Starter plan clicked"),
    },
    {
      name: "Pro",
      description: "For professionals",
      price: "$29",
      pricePeriod: "month",
      popular: true,
      features: [
        { name: "Unlimited projects", included: true },
        { name: "100GB storage", included: true },
        { name: "Priority support", included: true },
      ],
      ctaText: "Get Started",
      ctaOnClick: () => console.log("Pro plan clicked"),
    },
  ];
  
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <PricingTable tiers={tiers} />
    </div>
  );
}`;
    return ensureRenderCall(code);
  }
  
  if (componentName === "widget-container") {
    code = `import { WidgetContainer } from "${packageName}";

export default function Preview() {
  return (
    <WidgetContainer title="Widget" collapsible>
      <div className="p-4">Widget content goes here</div>
    </WidgetContainer>
  );
}`;
    return ensureRenderCall(code);
  }
  
  if (componentName === "dashboard-layout") {
    code = `import { DashboardLayout } from "${packageName}";
import { Button } from "@fragment_ui/ui";

export default function Preview() {
  return (
    <DashboardLayout
      header={<h1 className="text-xl font-semibold">Dashboard</h1>}
      sidebar={
        <div className="space-y-2">
          <Button variant="ghost" className="w-full justify-start">Overview</Button>
          <Button variant="ghost" className="w-full justify-start">Analytics</Button>
          <Button variant="ghost" className="w-full justify-start">Settings</Button>
        </div>
      }
    />
  );
}`;
    return ensureRenderCall(code);
  }
  
  if (componentName === "dashboard-widgets") {
    code = `import { DashboardWidgets } from "${packageName}";
import { MetricCard } from "@fragment_ui/ui";

export default function Preview() {
  return (
    <DashboardWidgets
      widgets={[
        {
          id: "1",
          type: "metric",
          content: <MetricCard title="Users" value="1000" />
        }
      ]}
      columns={12}
    />
  );
}`;
    return ensureRenderCall(code);
  }
  
  if (componentName === "kpi-dashboard") {
    code = `import { KPIDashboard } from "${packageName}";
import { TrendingUp, Users, DollarSign } from "lucide-react";

export default function Preview() {
  return (
    <KPIDashboard
      title="Key Metrics"
      metrics={[
        {
          id: "1",
          title: "Revenue",
          value: "$10k",
          trend: "up",
          trendValue: "+20%",
          icon: <DollarSign className="h-5 w-5" />
        },
        {
          id: "2",
          title: "Users",
          value: "1,234",
          trend: "up",
          trendValue: "+12%",
          icon: <Users className="h-5 w-5" />
        }
      ]}
      columns={4}
    />
  );
}`;
    return ensureRenderCall(code);
  }
  
  if (componentName === "analytics-dashboard") {
    code = `import { AnalyticsDashboard } from "${packageName}";
import { Chart } from "@fragment_ui/ui";
import { TrendingUp, Users } from "lucide-react";

export default function Preview() {
  return (
    <AnalyticsDashboard
      title="Analytics"
      metrics={[
        {
          id: "1",
          title: "Users",
          value: 1000,
          trend: "up",
          trendValue: "+20%",
          icon: <Users className="h-5 w-5" />
        }
      ]}
      charts={[
        {
          id: "1",
          title: "Traffic",
          type: "line",
          data: [{ label: "Jan", value: 100 }],
          height: 300
        }
      ]}
    />
  );
}`;
    return ensureRenderCall(code);
  }
  
  if (componentName === "benefits-section") {
    code = `import { BenefitsSection } from "${packageName}";
import { CheckCircle2 } from "lucide-react";

export default function Preview() {
  return (
    <BenefitsSection
      title="Key Benefits"
      description="Why choose our product"
      benefits={[
        {
          title: "Fast Performance",
          description: "Lightning fast loading times",
          icon: <CheckCircle2 className="h-6 w-6" />
        },
        {
          title: "Secure",
          description: "Bank-level security",
          icon: <CheckCircle2 className="h-6 w-6" />
        }
      ]}
      layout="grid"
      columns={3}
    />
  );
}`;
    return ensureRenderCall(code);
  }
  
  if (componentName === "comparison-section") {
    code = `import { ComparisonSection } from "${packageName}";

export default function Preview() {
  const basicPlan = {
    name: "Basic",
    features: {
      Storage: "10GB",
      Support: false
    }
  };
  
  const proPlan = {
    name: "Pro",
    popular: true,
    features: {
      Storage: "100GB",
      Support: true
    }
  };
  
  return (
    <ComparisonSection
      title="Compare Plans"
      plans={[basicPlan, proPlan]}
      features={[
        { name: "Storage" },
        { name: "Support" }
      ]}
    />
  );
}`;
    return ensureRenderCall(code);
  }
  
  if (componentName === "footer-section") {
    code = `import { FooterSection } from "${packageName}";

export default function Preview() {
  return (
    <FooterSection
      columns={[
        {
          title: "Company",
          links: [
            { label: "About", href: "/about" },
            { label: "Contact", href: "/contact" }
          ]
        }
      ]}
      copyright="© 2025 Company Name"
    />
  );
}`;
    return ensureRenderCall(code);
  }
  
  // Generic component preview - render with minimal props
  // Errors will be caught by ReactLiveRenderer's ErrorBoundary
  code = `import { ${componentDisplayName} } from "${packageName}";

export default function Preview() {
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <${componentDisplayName} />
    </div>
  );
}`;
  
  return ensureRenderCall(code);
}

export function ComponentsGallery({ registry, filterType = "all", librarySubTab, onLibrarySubTabChange, onComponentClick }: ComponentsGalleryProps) {
  const components = useMemo(() => {
    if (!registry || !registry.components) {
      return [];
    }

    // Build a set of all subcomponents (components that are required by other components)
    const subcomponents = new Set<string>();
    for (const [name, component] of Object.entries(registry.components)) {
      if ((component as any).requiresSubcomponents) {
        for (const subcomponent of (component as any).requiresSubcomponents) {
          subcomponents.add(subcomponent);
        }
      }
    }
    
    // Build a set of all aliases (components that are aliases for other components)
    const aliases = new Set<string>();
    if (registry.aliases) {
      for (const alias of Object.keys(registry.aliases)) {
        aliases.add(alias);
      }
    }
    
    // Filter out subcomponents and aliases, only show main components
    const mainComponents = Object.keys(registry.components).filter(name => {
      // Don't show if it's a subcomponent
      if (subcomponents.has(name)) {
        return false;
      }
      // Don't show if it's an alias (aliases are shown through their main component)
      if (aliases.has(name)) {
        return false;
      }
      // Don't show if it's marked as a subcomponent (for future use)
      const component = registry.components![name];
      if ((component as any).isSubcomponent) {
        return false;
      }
      // Don't show if it's an alias component (type: "alias")
      if ((component as any).type === "alias") {
        return false;
      }
      return true;
    });

    const uiComponents = mainComponents
      .filter((name) => !name.includes("-") || uiComponentExceptions.includes(name))
      .map((name) => ({
        name,
        package: "@fragment_ui/ui" as const,
        info: registry.components[name],
      }));

    const blocks = mainComponents
      .filter((name) => name.includes("-") && !uiComponentExceptions.includes(name))
      .map((name) => ({
        name,
        package: "@fragment_ui/blocks" as const,
        info: registry.components[name],
      }));

    // Filter based on filterType
    if (filterType === "components") {
      return uiComponents.sort((a, b) => a.name.localeCompare(b.name));
    } else if (filterType === "blocks") {
      return blocks.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      // "all" - return both
      return [...uiComponents, ...blocks].sort((a, b) => a.name.localeCompare(b.name));
    }
  }, [registry, filterType]);

  const getComponentVersion = (componentInfo: any) => {
    // Try to get version from registry or component info
    return registry?.version || "1.0.0";
  };

  // Determine if we should show internal tabs (when librarySubTab is provided)
  const showInternalTabs = librarySubTab !== undefined;
  const effectiveFilterType = showInternalTabs ? (librarySubTab === "blocks" ? "blocks" : "components") : filterType;

  // Re-filter components based on effective filter type
  // Use registry as the single source of truth
  const filteredComponents = useMemo(() => {
    // Get components from registry (for info/metadata)
    const registryComponents = registry?.components || {};
    
    // Build a set of all subcomponents (components that are required by other components)
    const subcomponents = new Set<string>();
    for (const [name, component] of Object.entries(registryComponents)) {
      if ((component as any).requiresSubcomponents) {
        for (const subcomponent of (component as any).requiresSubcomponents) {
          subcomponents.add(subcomponent);
        }
      }
    }
    
    // Build a set of all aliases (components that are aliases for other components)
    const aliases = new Set<string>();
    if (registry?.aliases) {
      for (const alias of Object.keys(registry.aliases)) {
        aliases.add(alias);
      }
    }

    // Get all component names from registry
    const allRegistryComponents = Object.keys(registryComponents);

    // Filter components: those without hyphens OR those in uiComponentExceptions
    const uiComponents = allRegistryComponents
      .filter((name) => {
        const normalized = name.toLowerCase();
        // Include if it doesn't have a hyphen, or if it's in exceptions
        return !normalized.includes("-") || uiComponentExceptions.includes(normalized);
      })
      .filter((name) => {
        // Don't show if it's a subcomponent
        if (subcomponents.has(name)) {
          return false;
        }
        // Don't show if it's an alias (aliases are shown through their main component)
        if (aliases.has(name)) {
          return false;
        }
        // Only show if it exists in registry
        if (!registryComponents[name]) {
          return false;
        }
        return true;
      })
      .map((name) => ({
        name,
        package: "@fragment_ui/ui" as const,
        info: registryComponents[name] || {},
      }));
    
    // Debug: log if Accordion is in the list
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      const accordionInList = uiComponents.some(c => c.name === 'Accordion');
      if (!accordionInList) {
        console.warn('[ComponentsGallery] Accordion not found in uiComponents. Total components:', uiComponents.length);
        console.warn('[ComponentsGallery] First 10 components:', uiComponents.slice(0, 10).map(c => c.name));
        console.warn('[ComponentsGallery] Registry has Accordion:', !!registryComponents['Accordion']);
        console.warn('[ComponentsGallery] All registry components count:', allRegistryComponents.length);
      }
    }

    // Filter blocks: those with hyphens that are NOT in uiComponentExceptions
    const blocks = allRegistryComponents
      .filter((k) => {
        const normalized = k.toLowerCase();
        return normalized.includes("-") && !uiComponentExceptions.includes(normalized);
      })
      .filter((name) => {
        // Don't show if it's a subcomponent
        if (subcomponents.has(name)) {
          return false;
        }
        // Don't show if it's an alias
        if (aliases.has(name)) {
          return false;
        }
        // Only show if it exists in registry
        if (!registryComponents[name]) {
          return false;
        }
        return true;
      })
      .map((name) => ({
        name,
        package: "@fragment_ui/blocks" as const,
        info: registryComponents[name] || {},
      }));

    // Filter based on effectiveFilterType
    if (effectiveFilterType === "components") {
      return uiComponents.sort((a, b) => a.name.localeCompare(b.name));
    } else if (effectiveFilterType === "blocks") {
      return blocks.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      // "all" - return both
      return [...uiComponents, ...blocks].sort((a, b) => a.name.localeCompare(b.name));
    }
  }, [registry, effectiveFilterType]);

  return (
    <div className="p-6 overflow-auto" style={{ height: "100%", backgroundColor: "var(--background-primary)" }}>
      <div className="mb-6">
        <h1 className="text-2xl font-medium mb-2">Library</h1>
        <p className="text-sm mb-4" style={{ color: "var(--foreground-secondary)" }}>
          Browse all available design system components and blocks
        </p>
        
        {showInternalTabs && onLibrarySubTabChange && (
          <Tabs value={librarySubTab} onValueChange={(value) => onLibrarySubTabChange(value as "components" | "blocks")}>
            <TabsList>
              <TabsTrigger value="components">Components</TabsTrigger>
              <TabsTrigger value="blocks">Blocks</TabsTrigger>
            </TabsList>
          </Tabs>
        )}
      </div>

      {!registry || filteredComponents.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-sm" style={{ color: "var(--foreground-secondary)" }}>
            {!registry ? "Loading components..." : `No ${effectiveFilterType} found in registry.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredComponents.map((component) => {
            // Convert ComponentInfo to EnhancedComponentInfo format
            // ComponentInfo has props as Record<string, any>, but EnhancedComponentInfo expects PropDefinition[]
            // Use type assertion to handle the mismatch - ComponentCard accepts Partial<EnhancedComponentInfo>
            const enhancedInfo = component.info 
              ? {
                  ...component.info,
                  // Omit props if it's not an array (EnhancedComponentInfo expects PropDefinition[])
                  ...(Array.isArray(component.info.props) 
                    ? { props: component.info.props }
                    : {}),
                } as any
              : undefined;
            
            return (
              <ComponentCard
                key={component.name}
                componentName={component.name}
                componentInfo={enhancedInfo}
                onComponentClick={onComponentClick}
                height="300px"
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

