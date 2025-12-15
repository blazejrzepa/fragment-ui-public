"use client";

import { useMemo } from "react";
import type { EnhancedComponentInfo } from "../types";

/**
 * Hook to generate preview code for components
 * 
 * This hook generates consistent preview code for components
 * based on registry information and examples.
 */
export interface UseComponentPreviewOptions {
  componentName: string;
  componentInfo?: Partial<EnhancedComponentInfo>;
  variant?: string;
  customCode?: string;
}

export interface UseComponentPreviewReturn {
  previewCode: string;
  hasExamples: boolean;
  availableVariants: string[];
}

export function useComponentPreview(
  options: UseComponentPreviewOptions
): UseComponentPreviewReturn {
  const { componentName, componentInfo, variant, customCode } = options;

  const previewCode = useMemo(() => {
    // Use custom code if provided
    if (customCode) {
      return customCode;
    }

    // Normalize component name for comparison (handle both PascalCase and lowercase)
    // Do this early to check for special handlers first
    const normalizedName = componentName.toLowerCase();
    
    // Generate basic component usage
    const packageName = componentInfo?.package || "@fragment_ui/ui";
    const componentNamePascal = componentName
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join("");

    // List of components that have special handlers (should use handler instead of examples)
    // Note: Accordion removed - should use examples from registry for consistency
    const componentsWithSpecialHandlers = [
      "button", "select", "dialog", "tabs", "table",
      "dropdownmenu", "contextmenu", "navigationmenu", "menubar",
      "popover", "hovercard", "sheet", "combobox", "multiselect",
      "calendar", "datepicker", "carousel", "stepper", "pagination",
      "commandpalette", "breadcrumbs", "segmentedcontrol", "splitbutton",
      "timeline", "treeview", "formfield", "activityfeed", "activity-feed",
      "alert"
    ];

    // Check if this component has a special handler
    const hasSpecialHandler = componentsWithSpecialHandlers.includes(normalizedName);

    // Use example code from registry FIRST (for consistency across all views)
    // This ensures Library tab, left sidebar, and docs page all show the same example
    if (componentInfo?.examples && componentInfo.examples.length > 0) {
      const example = variant
        ? componentInfo.examples.find(e => e.name === variant) || componentInfo.examples[0]
        : componentInfo.examples[0];
      
      if (example.code) {
        // Normalize code from registry: fix require, add missing props, ensure proper structure
        // First, handle escaped newlines in JSON strings (registry stores code as JSON string with \n)
        let normalizedCode = example.code;
        
        // If code contains escaped newlines (\\n), unescape them first
        // Check for both \\n (double backslash + n) and \n (single backslash + n in string)
        if (normalizedCode.includes('\\n')) {
          // Replace \\n with actual newline (this handles JSON-encoded strings)
          normalizedCode = normalizedCode.replace(/\\n/g, '\n');
        }
        
        // Debug: log normalization for problematic components (only in development)
        if (typeof window !== 'undefined' && (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development')) {
          const problematicComponents = ['combobox', 'pricingtable', 'pricing-table', 'formfieldenhanced', 'form-field-enhanced', 'tabslist', 'tabs-list'];
          if (problematicComponents.includes(normalizedName)) {
            console.log(`[useComponentPreview] Normalizing ${normalizedName}:`, {
              originalLength: example.code.length,
              normalizedLength: normalizedCode.length,
              hasEscapedNewlines: example.code.includes('\\n'),
              hasActualNewlines: normalizedCode.includes('\n'),
            });
          }
        }
        
        // Replace require with import
        normalizedCode = normalizedCode.replace(
          /const\s+(\w+)\s*=\s*require\(['"]([^'"]+)['"]\)/g,
          (match, varName, modulePath) => {
            return `import ${varName} from "${modulePath}";`;
          }
        );
        
        // Fix PricingTable - add tiers prop if missing
        if (normalizedName === 'pricingtable' || normalizedName === 'pricing-table') {
          if (!normalizedCode.includes('tiers=') && !normalizedCode.includes('tiers =') && !normalizedCode.includes('tiers:')) {
            // Check if PricingTable is used without tiers (handle both self-closing and with children)
            if (normalizedCode.includes('<PricingTable') && !normalizedCode.includes('tiers')) {
              const tiersData = `[
  { name: "Basic", price: "$10", pricePeriod: "month", features: [{ name: "Feature 1" }], ctaText: "Get Started" },
  { name: "Pro", price: "$29", pricePeriod: "month", features: [{ name: "Feature 1" }, { name: "Feature 2" }], ctaText: "Get Started", popular: true },
  { name: "Enterprise", price: "$99", pricePeriod: "month", features: [{ name: "Feature 1" }, { name: "Feature 2" }, { name: "Feature 3" }], ctaText: "Contact Sales" }
]`;
              
              // Replace self-closing tag
              normalizedCode = normalizedCode.replace(
                /<PricingTable\s*\/>/g,
                `<PricingTable tiers={${tiersData}} />`
              );
              // Replace opening tag without closing (if it has children)
              normalizedCode = normalizedCode.replace(
                /<PricingTable\s*>/g,
                `<PricingTable tiers={${tiersData}}>`
              );
            }
          }
        }
        
        // Fix Combobox - Combobox requires options prop, but registry might use compound syntax
        // Convert compound syntax to simple Combobox with options prop
        if (normalizedName === 'combobox') {
          // Check if using compound syntax (has ComboboxTrigger, ComboboxInput, etc.)
          const usesCompoundSyntax = normalizedCode.includes('ComboboxTrigger') || 
                                     normalizedCode.includes('ComboboxInput') ||
                                     normalizedCode.includes('ComboboxContent') ||
                                     normalizedCode.includes('ComboboxItem');
          
          if (usesCompoundSyntax) {
            // Extract options from ComboboxItem elements (handle both single-line and multi-line)
            const itemMatches = normalizedCode.match(/<ComboboxItem\s+value=["']([^"']+)["'][^>]*>([^<]+)<\/ComboboxItem>/g);
            if (itemMatches && itemMatches.length > 0) {
              const options = itemMatches.map(match => {
                const valueMatch = match.match(/value=["']([^"']+)["']/);
                const labelMatch = match.match(/>([^<]+)</);
                return {
                  value: valueMatch ? valueMatch[1] : '',
                  label: labelMatch ? labelMatch[1].trim() : ''
                };
              }).filter(opt => opt.value && opt.label);
              
              if (options.length > 0) {
                // Replace compound syntax with simple Combobox
                const importMatch = normalizedCode.match(/import\s+\{[^}]+\}\s+from\s+["']([^"']+)["']/);
                const packageName = importMatch ? importMatch[1] : '@fragment_ui/ui';
                
                normalizedCode = `import { Combobox } from "${packageName}";
import React from "react";

export default function Preview() {
  const options = ${JSON.stringify(options, null, 2)};
  
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Combobox
          options={options}
          placeholder="Select an option..."
        />
      </div>
    </div>
  );
}`;
              }
            }
          } else if (normalizedCode.includes('<Combobox') && 
                     !normalizedCode.includes('options=') && !normalizedCode.includes('options =') && !normalizedCode.includes('options:')) {
            // Add options if missing for simple Combobox
            if (!normalizedCode.includes('const options')) {
              normalizedCode = normalizedCode.replace(
                /export default function Preview\(\)/,
                `export default function Preview() {
  const options = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" }
  ];`
              );
            }
            // Add options prop to Combobox
            normalizedCode = normalizedCode.replace(
              /<Combobox([^>]*?)(?:\/)?>/g,
              (match, attrs) => {
                if (!attrs.includes('options')) {
                  return `<Combobox${attrs} options={options} />`;
                }
                return match;
              }
            );
          }
        }
        
        // Fix FormFieldEnhanced - must be wrapped in FormEnhanced
        // Apply to ALL components that use FormFieldEnhanced, not just form-field-enhanced
        // More aggressive check: look for FormFieldEnhanced anywhere in the code
        const hasFormFieldEnhanced = /<FormFieldEnhanced[\s>]/.test(normalizedCode);
        const hasFormEnhanced = /<FormEnhanced[\s>]/.test(normalizedCode);
        
        if (hasFormFieldEnhanced && !hasFormEnhanced) {
          // Extract imports
          const importLines: string[] = normalizedCode.match(/^import\s+.*$/gm) || [];
          const restOfCode = normalizedCode.replace(/^import\s+.*$/gm, '').trim();
          
          // Add FormEnhanced to imports if not present
          if (!importLines.some(line => line.includes('FormEnhanced'))) {
            const packageName = componentInfo?.package || '@fragment_ui/ui';
            // Check if FormFieldEnhanced is already imported to determine import style
            const hasFormFieldEnhancedImport = importLines.some(line => line.includes('FormFieldEnhanced'));
            if (hasFormFieldEnhancedImport) {
              // Add FormEnhanced to existing import
              importLines.forEach((line, index) => {
                if (line.includes('FormFieldEnhanced') && !line.includes('FormEnhanced')) {
                  importLines[index] = line.replace(
                    /import\s*\{([^}]*FormFieldEnhanced[^}]*)\}\s*from/,
                    (match, imports) => {
                      return `import { ${imports}, FormEnhanced } from`;
                    }
                  );
                }
              });
            } else {
              // Add new import line before the first import or at the beginning
              if (importLines.length > 0) {
                importLines.unshift(`import { FormEnhanced } from "${packageName}";`);
              } else {
                importLines.push(`import { FormEnhanced } from "${packageName}";`);
              }
            }
          }
          
          // More aggressive wrapping: wrap the entire component content if FormFieldEnhanced is found
          // First, try to find the return statement
          let wrappedCode = restOfCode;
          
          // Pattern 1: return (<FormFieldEnhanced ... />)
          if (restOfCode.match(/return\s*\([\s\S]*?<FormFieldEnhanced/)) {
            wrappedCode = restOfCode.replace(
              /(return\s*\([\s\S]*?)(<FormFieldEnhanced[^>]*>[\s\S]*?<\/FormFieldEnhanced>)([\s\S]*?\))/,
              (match, before, formField, after) => {
                return `${before}<FormEnhanced onSubmit={(data) => console.log(data)}>
    ${formField}
  </FormEnhanced>${after}`;
              }
            );
          }
          
          // Pattern 2: return <FormFieldEnhanced ... /> (no parentheses)
          if (wrappedCode === restOfCode && restOfCode.match(/return\s+<FormFieldEnhanced/)) {
            wrappedCode = restOfCode.replace(
              /(return\s+)(<FormFieldEnhanced[^>]*>[\s\S]*?<\/FormFieldEnhanced>)/,
              (match, returnKeyword, formField) => {
                return `${returnKeyword}<FormEnhanced onSubmit={(data) => console.log(data)}>
    ${formField}
  </FormEnhanced>`;
              }
            );
          }
          
          // Pattern 3: Just <FormFieldEnhanced ... /> without return (JSX at top level)
          if (wrappedCode === restOfCode && restOfCode.match(/^[\s]*<FormFieldEnhanced/)) {
            wrappedCode = restOfCode.replace(
              /(<FormFieldEnhanced[^>]*>[\s\S]*?<\/FormFieldEnhanced>)/,
              `<FormEnhanced onSubmit={(data) => console.log(data)}>
    $1
  </FormEnhanced>`
            );
          }
          
          // Pattern 4: Multiple FormFieldEnhanced instances - wrap each one
          if (wrappedCode === restOfCode) {
            wrappedCode = restOfCode.replace(
              /(<FormFieldEnhanced[^>]*>[\s\S]*?<\/FormFieldEnhanced>)/g,
              `<FormEnhanced onSubmit={(data) => console.log(data)}>
    $1
  </FormEnhanced>`
            );
          }
          
          // If we still haven't wrapped, wrap the entire function body
          if (wrappedCode === restOfCode) {
            // Try to wrap the entire return statement or function body
            if (restOfCode.includes('export default function')) {
              wrappedCode = restOfCode.replace(
                /(export default function\s+\w+\s*\([^)]*\)\s*\{[\s\S]*?return\s*\([\s\S]*?)(<FormFieldEnhanced[\s\S]*?)([\s\S]*?\)[\s\S]*?\})/,
                (match, before, formFieldContent, after) => {
                  return `${before}<FormEnhanced onSubmit={(data) => console.log(data)}>
    ${formFieldContent}
  </FormEnhanced>${after}`;
                }
              );
            }
          }
          
          // Final fallback: if still not wrapped, wrap the entire code block
          if (wrappedCode === restOfCode) {
            // Find where FormFieldEnhanced starts and wrap from there
            const formFieldIndex = wrappedCode.indexOf('<FormFieldEnhanced');
            if (formFieldIndex !== -1) {
              const beforeFormField = wrappedCode.substring(0, formFieldIndex);
              const formFieldAndAfter = wrappedCode.substring(formFieldIndex);
              
              // Find the closing tag
              const closingTagIndex = formFieldAndAfter.indexOf('</FormFieldEnhanced>');
              if (closingTagIndex !== -1) {
                const formField = formFieldAndAfter.substring(0, closingTagIndex + '</FormFieldEnhanced>'.length);
                const afterFormField = formFieldAndAfter.substring(closingTagIndex + '</FormFieldEnhanced>'.length);
                
                wrappedCode = `${beforeFormField}<FormEnhanced onSubmit={(data) => console.log(data)}>
    ${formField}
  </FormEnhanced>${afterFormField}`;
              }
            }
          }
          
          // Reconstruct the code with imports
          normalizedCode = [
            ...importLines,
            '',
            wrappedCode
          ].join('\n');
        }
        
        // Fix TabsList - must be wrapped in Tabs
        if (normalizedName === 'tabslist' || normalizedName === 'tabs-list') {
          if (normalizedCode.includes('<TabsList') && !normalizedCode.includes('<Tabs')) {
            // Extract imports
            const importLines: string[] = normalizedCode.match(/^import\s+.*$/gm) || [];
            const restOfCode = normalizedCode.replace(/^import\s+.*$/gm, '').trim();
            
            // Add Tabs to imports if not present
            if (!importLines.some(line => line.includes('Tabs') && !line.includes('TabsList'))) {
              const packageName = componentInfo?.package || '@fragment_ui/ui';
              importLines.push(`import { Tabs, TabsContent } from "${packageName}";`);
            }
            
            // Wrap TabsList in Tabs
            normalizedCode = [
              ...importLines,
              '',
              restOfCode.replace(
                /(<TabsList[^>]*>[\s\S]*?<\/TabsList>)/,
                `<Tabs defaultValue="tab1">
    $1
    <TabsContent value="tab1">Content for tab 1</TabsContent>
  </Tabs>`
              )
            ].join('\n');
          }
        }
        
        // Ensure code has proper export default function structure
        if (!normalizedCode.includes('export default function')) {
          // If code is just JSX, wrap it in a function
          if (normalizedCode.trim().startsWith('<') || normalizedCode.includes('return (')) {
            // Extract imports
            const importLines = normalizedCode.match(/^import\s+.*$/gm) || [];
            const restOfCode = normalizedCode.replace(/^import\s+.*$/gm, '').trim();
            
            normalizedCode = [
              ...importLines,
              '',
              'export default function Preview() {',
              '  return (',
              restOfCode.split('\n').map(line => '    ' + line).join('\n'),
              '  );',
              '}'
            ].join('\n');
          }
        }
        
        // Debug: log for Accordion (only in development)
        if (typeof window !== 'undefined' && (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') && normalizedName === 'accordion') {
          console.log('[useComponentPreview] Accordion: Using example from registry', {
            hasExamples: true,
            examplesCount: componentInfo.examples.length,
            exampleName: example.name,
            codePreview: normalizedCode.substring(0, 150) + '...'
          });
        }
        return normalizedCode;
      }
    }
    
    // Debug: log if Accordion doesn't have examples (only in development)
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development' && normalizedName === 'accordion') {
      console.warn('[useComponentPreview] Accordion: No examples in componentInfo', {
        hasComponentInfo: !!componentInfo,
        hasExamples: !!(componentInfo?.examples),
        examplesLength: componentInfo?.examples?.length || 0,
        componentInfoKeys: componentInfo ? Object.keys(componentInfo) : []
      });
    }
    
    // Only use special handlers if no examples in registry
    // Special handlers take priority only if there are no examples

    // Handle special cases for compound components
    const compoundComponents: Record<string, string> = {
      "accordion": "Accordion, AccordionItem, AccordionTrigger, AccordionContent",
      "tabs": "Tabs, TabsList, TabsTrigger, TabsContent",
      "select": "Select, SelectTrigger, SelectValue, SelectContent, SelectItem",
      "dialog": "Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription",
      "table": "Table, TableHeader, TableBody, TableRow, TableHead, TableCell",
      "dropdownmenu": "DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem",
      "contextmenu": "ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem",
      "popover": "Popover, PopoverTrigger, PopoverContent",
      "hovercard": "HoverCard, HoverCardTrigger, HoverCardContent",
      "sheet": "Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription",
      "navigationmenu": "NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuTrigger, NavigationMenuContent",
      "menubar": "Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem",
      "combobox": "Combobox, ComboboxTrigger, ComboboxInput, ComboboxContent, ComboboxItem",
      "multiselect": "MultiSelect, MultiSelectTrigger, MultiSelectInput, MultiSelectContent, MultiSelectItem",
      "carousel": "Carousel, CarouselItem",
      "stepper": "Stepper, StepperItem",
    };

    const imports = compoundComponents[normalizedName] || componentNamePascal;
    const importStatement = componentInfo?.import || imports;

    // Generate basic usage
    // Accordion handler removed - now uses examples from registry for consistency with ComponentCodeGenerator
    if (normalizedName === "button") {
      return `import { Button } from "${packageName}";

export default function Preview() {
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <Button>Click me</Button>
    </div>
  );
}`;
    }

    if (normalizedName === "select") {
      const code = `import { ${importStatement} } from "${packageName}";

export default function Preview() {
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}`;
      return code;
    }

    if (normalizedName === "dialog") {
      const code = `import { ${importStatement}, Button } from "${packageName}";

export default function Preview() {
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <Dialog>
        <DialogTrigger asChild>
          <Button>Open Dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>Dialog description goes here.</DialogDescription>
          </DialogHeader>
          <p>Dialog content goes here.</p>
        </DialogContent>
      </Dialog>
    </div>
  );
}`;
      return code;
    }

    if (normalizedName === "tabs") {
      const code = `import { ${importStatement} } from "${packageName}";

export default function Preview() {
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <Tabs defaultValue="tab1" className="w-full max-w-md">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content for tab 1</TabsContent>
        <TabsContent value="tab2">Content for tab 2</TabsContent>
      </Tabs>
    </div>
  );
}`;
      return code;
    }

    if (normalizedName === "table") {
      const code = `import { ${importStatement} } from "${packageName}";

export default function Preview() {
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <Table>
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
          <TableRow>
            <TableCell>Jane Smith</TableCell>
            <TableCell>jane@example.com</TableCell>
            <TableCell>User</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}`;
      return code;
    }

    if (normalizedName === "dropdownmenu") {
      const code = `import { ${importStatement}, Button } from "${packageName}";

export default function Preview() {
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>Open Menu</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}`;
      return code;
    }

    if (normalizedName === "contextmenu") {
      const code = `import { ${importStatement} } from "${packageName}";

export default function Preview() {
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <ContextMenu>
        <ContextMenuTrigger className="border p-4 rounded">
          Right-click here
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Copy</ContextMenuItem>
          <ContextMenuItem>Paste</ContextMenuItem>
          <ContextMenuItem>Delete</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
}`;
      return code;
    }

    if (normalizedName === "navigationmenu") {
      const code = `import { ${importStatement} } from "${packageName}";

export default function Preview() {
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Item 1</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="p-4">
                <p>Content for item 1</p>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Item 2</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="p-4">
                <p>Content for item 2</p>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}`;
      return code;
    }

    if (normalizedName === "menubar") {
      const code = `import { ${importStatement} } from "${packageName}";

export default function Preview() {
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>New</MenubarItem>
            <MenubarItem>Open</MenubarItem>
            <MenubarItem>Save</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Edit</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>Cut</MenubarItem>
            <MenubarItem>Copy</MenubarItem>
            <MenubarItem>Paste</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </div>
  );
}`;
      return code;
    }

    if (normalizedName === "popover") {
      const code = `import { ${importStatement}, Button } from "${packageName}";

export default function Preview() {
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button>Open Popover</Button>
        </PopoverTrigger>
        <PopoverContent>
          <p>Popover content goes here.</p>
        </PopoverContent>
      </Popover>
    </div>
  );
}`;
      return code;
    }

    if (normalizedName === "hovercard") {
      const code = `import { ${importStatement}, Button } from "${packageName}";

export default function Preview() {
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <HoverCard>
        <HoverCardTrigger asChild>
          <Button>Hover me</Button>
        </HoverCardTrigger>
        <HoverCardContent>
          <p>Hover card content goes here.</p>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}`;
      return code;
    }

    if (normalizedName === "sheet") {
      const code = `import { ${importStatement}, Button } from "${packageName}";

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
            <SheetDescription>Sheet description goes here.</SheetDescription>
          </SheetHeader>
          <p>Sheet content goes here.</p>
        </SheetContent>
      </Sheet>
    </div>
  );
}`;
      return code;
    }

    if (normalizedName === "combobox") {
      const code = `import { Combobox } from "${packageName}";
import React from "react";

export default function Preview() {
  const options = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" }
  ];
  
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Combobox
          options={options}
          placeholder="Select an option..."
        />
      </div>
    </div>
  );
}`;
      return code;
    }

    if (normalizedName === "multiselect") {
      const code = `import { ${importStatement} } from "${packageName}";

export default function Preview() {
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <MultiSelect>
        <MultiSelectTrigger>
          <MultiSelectInput placeholder="Select multiple..." />
        </MultiSelectTrigger>
        <MultiSelectContent>
          <MultiSelectItem value="option1">Option 1</MultiSelectItem>
          <MultiSelectItem value="option2">Option 2</MultiSelectItem>
          <MultiSelectItem value="option3">Option 3</MultiSelectItem>
        </MultiSelectContent>
      </MultiSelect>
    </div>
  );
}`;
      return code;
    }

    if (normalizedName === "calendar") {
      const code = `import { Calendar } from "${packageName}";

export default function Preview() {
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <Calendar />
    </div>
  );
}`;
      return code;
    }

    if (normalizedName === "datepicker") {
      const code = `import { DatePicker } from "${packageName}";

export default function Preview() {
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <DatePicker />
    </div>
  );
}`;
      return code;
    }

    if (normalizedName === "carousel") {
      const code = `import { ${importStatement} } from "${packageName}";

export default function Preview() {
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <Carousel>
        <CarouselItem>
          <div className="p-8 bg-gray-100 rounded">Slide 1</div>
        </CarouselItem>
        <CarouselItem>
          <div className="p-8 bg-gray-100 rounded">Slide 2</div>
        </CarouselItem>
        <CarouselItem>
          <div className="p-8 bg-gray-100 rounded">Slide 3</div>
        </CarouselItem>
      </Carousel>
    </div>
  );
}`;
      return code;
    }

    if (normalizedName === "stepper") {
      const code = `import { ${importStatement} } from "${packageName}";

export default function Preview() {
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <Stepper steps={[
        { id: "1", label: "Step 1", description: "First step" },
        { id: "2", label: "Step 2", description: "Second step" },
        { id: "3", label: "Step 3", description: "Third step" }
      ]} />
    </div>
  );
}`;
      return code;
    }

    if (normalizedName === "pagination") {
      const code = `import { Pagination } from "${packageName}";

export default function Preview() {
  const [currentPage, setCurrentPage] = React.useState(1);
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <Pagination currentPage={currentPage} totalPages={10} onPageChange={setCurrentPage} />
    </div>
  );
}`;
      return code;
    }

    if (normalizedName === "commandpalette") {
      const code = `import { CommandPalette } from "${packageName}";

export default function Preview() {
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <CommandPalette actions={[
        { id: "1", label: "New File", keywords: ["new", "file"] },
        { id: "2", label: "Open File", keywords: ["open", "file"] },
        { id: "3", label: "Save File", keywords: ["save", "file"] }
      ]} />
    </div>
  );
}`;
      return code;
    }

    if (normalizedName === "breadcrumbs") {
      const code = `import { Breadcrumbs } from "${packageName}";

export default function Preview() {
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <Breadcrumbs items={[
        { label: "Home", href: "/" },
        { label: "Products", href: "/products" },
        { label: "Current Page" }
      ]} />
    </div>
  );
}`;
      return code;
    }

    if (normalizedName === "segmentedcontrol") {
      const code = `import { SegmentedControl } from "${packageName}";

export default function Preview() {
  const [value, setValue] = React.useState("option1");
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <SegmentedControl value={value} onValueChange={setValue} options={[
        { value: "option1", label: "Option 1" },
        { value: "option2", label: "Option 2" },
        { value: "option3", label: "Option 3" }
      ]} />
    </div>
  );
}`;
      return code;
    }

    if (normalizedName === "splitbutton") {
      const code = `import { SplitButton, Button } from "${packageName}";

export default function Preview() {
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <SplitButton
        mainAction={{ label: "Save", onClick: () => {} }}
        dropdownActions={[
          { label: "Save As", onClick: () => {} },
          { label: "Export", onClick: () => {} }
        ]}
      />
    </div>
  );
}`;
      return code;
    }

    if (normalizedName === "timeline") {
      const code = `import { Timeline } from "${packageName}";

export default function Preview() {
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <Timeline events={[
        { id: "1", title: "Event 1", description: "First event", status: "completed" },
        { id: "2", title: "Event 2", description: "Second event", status: "current" },
        { id: "3", title: "Event 3", description: "Third event", status: "upcoming" }
      ]} />
    </div>
  );
}`;
      return code;
    }

    if (normalizedName === "treeview") {
      const code = `import { TreeView } from "${packageName}";

export default function Preview() {
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <TreeView nodes={[
        { id: "1", label: "Node 1", children: [
          { id: "1-1", label: "Child 1" },
          { id: "1-2", label: "Child 2" }
        ]},
        { id: "2", label: "Node 2" }
      ]} />
    </div>
  );
}`;
      return code;
    }

    if (normalizedName === "formfield") {
      const code = `import { FormEnhanced, FormFieldEnhanced, Input } from "${packageName}";

export default function Preview() {
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <FormEnhanced onSubmit={(data) => console.log(data)}>
        <FormFieldEnhanced name="email" label="Email">
          <Input placeholder="Enter email..." />
        </FormFieldEnhanced>
      </FormEnhanced>
    </div>
  );
}`;
      return code;
    }

    // Special handlers for components that need specific props
    if (normalizedName === "activityfeed" || normalizedName === "activity-feed") {
      const code = `import { ActivityFeed } from "${packageName}";

export default function Preview() {
  const activities = [
    {
      id: "1",
      type: "action",
      title: "User created project",
      description: "New project 'My Project' was created",
      timestamp: "2 hours ago",
      user: {
        name: "John Doe",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John"
      }
    },
    {
      id: "2",
      type: "update",
      title: "Project updated",
      description: "Settings were modified",
      timestamp: "5 hours ago",
      user: {
        name: "Jane Smith",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane"
      }
    },
    {
      id: "3",
      type: "comment",
      title: "New comment",
      description: "Added a comment to the discussion",
      timestamp: "1 day ago",
      user: {
        name: "Bob Johnson"
      }
    }
  ];
  return (
    <div className="w-full p-4">
      <ActivityFeed items={activities} />
    </div>
  );
}`;
      return code;
    }

    if (normalizedName === "alert") {
      const code = `import { Alert, AlertTitle, AlertDescription } from "${packageName}";
import { Terminal, Info, CheckCircle2, XCircle, TriangleAlert } from "lucide-react";
import React from "react";

export default function Preview() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-4">
      <Alert variant="default">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>
          You can add components to your app using the cli.
        </AlertDescription>
      </Alert>
      <Alert variant="info">
        <Info className="h-4 w-4" />
        <AlertTitle>Information</AlertTitle>
        <AlertDescription>
          This is an informational message.
        </AlertDescription>
      </Alert>
      <Alert variant="success">
        <CheckCircle2 className="h-4 w-4" />
        <AlertTitle>Success!</AlertTitle>
        <AlertDescription>
          Your operation was successful.
        </AlertDescription>
      </Alert>
      <Alert variant="warning">
        <TriangleAlert className="h-4 w-4" />
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>
          Proceed with caution.
        </AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <XCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Something went wrong.
        </AlertDescription>
      </Alert>
    </div>
  );
}`;
      return code;
    }

    // Generic fallback
    return `import { ${componentNamePascal} } from "${packageName}";

export default function Preview() {
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <${componentNamePascal} />
    </div>
  );
}`;
  }, [componentName, componentInfo, variant, customCode]);

  const hasExamples = useMemo(() => {
    return !!(componentInfo?.examples && componentInfo.examples.length > 0);
  }, [componentInfo]);

  const availableVariants = useMemo(() => {
    if (componentInfo?.variants) {
      return componentInfo.variants.map(v => v.name);
    }
    if (componentInfo?.examples) {
      return componentInfo.examples.map(e => e.name);
    }
    return [];
  }, [componentInfo]);

  return {
    previewCode,
    hasExamples,
    availableVariants,
  };
}

