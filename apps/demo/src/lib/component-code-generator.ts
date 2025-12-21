/**
 * Component Code Generator
 * 
 * Generates React component code from registry metadata.
 * Handles simple, compound, and alias components.
 */

import type { Registry, ComponentMetadata, ComponentInfo, ComponentType } from '@/types/registry';

import { toKebabCase, toPascalCase, toCamelCase } from '@fragment_ui/utils';
export class ComponentNotFoundError extends Error {
  constructor(
    public componentName: string,
    public actualName: string
  ) {
    super(`Component "${componentName}" (alias for "${actualName}") not found in registry.`);
    this.name = 'ComponentNotFoundError';
  }
}

export class SubcomponentNotFoundError extends Error {
  constructor(
    public subcomponent: string,
    public parentComponent: string
  ) {
    super(`Subcomponent "${subcomponent}" required by "${parentComponent}" not found in registry.`);
    this.name = 'SubcomponentNotFoundError';
  }
}

export class ComponentCodeGenerator {
  constructor(private registry: Registry) {}

  /**
   * Converts kebab-case to camelCase for function names
   */
  /**
   * Main method to generate component code
   */
  async generateCode(componentName: string): Promise<string> {
    // 1. Resolve aliases and get metadata
    const metadata = this.resolveComponent(componentName);
    
    // 2. Validate component
    this.validateComponent(metadata);
    
    // 3. Generate code based on type
    switch (metadata.type) {
      case 'simple':
        return this.generateSimpleComponent(metadata);
      case 'compound':
        return this.generateCompoundComponent(metadata);
      case 'alias':
        return this.generateAliasComponent(metadata);
      default:
        throw new Error(`Unknown component type: ${metadata.type}`);
    }
  }

  /**
   * Resolves aliases and returns full component metadata
   */
  resolveComponent(componentName: string): ComponentMetadata {
    // Check aliases first
    const actualName = this.registry.aliases?.[componentName] || componentName;
    
    // Get component info from registry
    const componentInfo = this.registry.components[actualName];
    if (!componentInfo) {
      throw new ComponentNotFoundError(componentName, actualName);
    }

    // Determine type if not specified
    const type: ComponentType = componentInfo.type || 
      (componentInfo.aliasFor ? 'alias' : 
       (componentInfo.requiresSubcomponents ? 'compound' : 'simple'));

    return {
      name: componentName,
      actualName,
      type,
      requiresSubcomponents: componentInfo.requiresSubcomponents,
      requiresContext: componentInfo.requiresContext || false,
      selfClosing: componentInfo.selfClosing || false,
      aliasProps: componentInfo.aliasProps,
      example: componentInfo.example,
      props: componentInfo.props,
      import: componentInfo.import
    };
  }

  /**
   * Validates component before generating code
   */
  private validateComponent(metadata: ComponentMetadata): void {
    // Check if required subcomponents exist
    if (metadata.requiresSubcomponents) {
      for (const subcomponent of metadata.requiresSubcomponents) {
        if (!this.registry.components[subcomponent]) {
          throw new SubcomponentNotFoundError(subcomponent, metadata.name);
        }
      }
    }

    // Warn if Context component has no pre-generated example
    if (metadata.requiresContext && !metadata.example?.code) {
      console.warn(
        `[ComponentCodeGenerator] Component ${metadata.name} requires Context but has no pre-generated example. ` +
        `This may cause rendering issues in iframe.`
      );
    }
  }

  /**
   * Generates code for simple component
   */
  /**
   * Adds data-ui-id attributes to JSX elements in code for inspector functionality
   * This enables the inspector to select and inspect elements in the Preview
   */
  private addDataUiIdsToCode(code: string, componentName: string): string {
    // Generate base ID for the component
    const baseId = componentName.toLowerCase().replace(/\s+/g, '-');
    
    // Pattern to match JSX elements (both self-closing and with children)
    // Matches: <ComponentName ...> or <ComponentName ... />
    const jsxElementPattern = /<([A-Z][a-zA-Z0-9]*)(\s[^>]*?)?(\/?>|>)/g;
    
    let result = code;
    const matches: Array<{ start: number; end: number; fullMatch: string; componentName: string; props: string; closing: string }> = [];
    
    // Collect all matches first
    let match;
    while ((match = jsxElementPattern.exec(code)) !== null) {
      const fullMatch = match[0];
      const jsxComponentName = match[1];
      const props = match[2] || '';
      const closing = match[3];
      
      // Skip if already has data-ui-id
      if (props.includes('data-ui-id')) {
        continue;
      }
      
      // Skip React fragments and common wrapper elements that don't need IDs
      const skipComponents = ['Fragment', 'React'];
      if (skipComponents.includes(jsxComponentName)) {
        continue;
      }
      
      matches.push({
        start: match.index,
        end: match.index + fullMatch.length,
        fullMatch,
        componentName: jsxComponentName,
        props,
        closing
      });
    }
    
    // Replace matches in reverse order to preserve indices
    for (let i = matches.length - 1; i >= 0; i--) {
      const m = matches[i];
      const elementId = i === 0 
        ? `${baseId}-example` 
        : `${baseId}-${m.componentName.toLowerCase()}-${i}`;
      
      // Insert data-ui-id before closing bracket
      const newProps = m.props.trim() 
        ? `${m.props.trim()} data-ui-id="${elementId}"`
        : `data-ui-id="${elementId}"`;
      
      const newFullMatch = `<${m.componentName} ${newProps}${m.closing}`;
      result = result.substring(0, m.start) + newFullMatch + result.substring(m.end);
    }
    
    return result;
  }

  private generateSimpleComponent(metadata: ComponentMetadata): string {
    // Check if component has an example in registry (from examples array)
    // This takes priority over special handlers for consistency with Library tab
    const componentInfo = this.registry.components[metadata.actualName];
    if (componentInfo?.example && componentInfo.example.code) {
      const example = componentInfo.example;
      if (example.code) {
        const functionName = `${toCamelCase(metadata.name)}Example`;
        // Replace the function name in the example code
        const functionNamePattern = /export\s+default\s+function\s+\w+\s*\(/;
        let code = example.code.replace(functionNamePattern, `export default function ${functionName}(`);
        
        // Add data-ui-id attributes for inspector functionality
        code = this.addDataUiIdsToCode(code, metadata.name);
        
        return code;
      }
    }
    
    // Check if component has a single example
    if (metadata.example?.code) {
      const functionName = `${toCamelCase(metadata.name)}Example`;
      const functionNamePattern = /export\s+default\s+function\s+\w+\s*\(/;
      return metadata.example.code.replace(functionNamePattern, `export default function ${functionName}(`);
    }
    
    // FormField needs Input as a child component
    let additionalComponents: string[] = [];
    if (metadata.actualName === 'FormField') {
      additionalComponents.push('Input');
    }
    // Accordion needs AccordionItem, AccordionTrigger, and AccordionContent
    if (metadata.actualName === 'Accordion') {
      additionalComponents.push('AccordionItem', 'AccordionTrigger', 'AccordionContent');
    }
    // Alert needs AlertTitle and AlertDescription
    if (metadata.actualName === 'Alert') {
      additionalComponents.push('AlertTitle', 'AlertDescription');
    }
    // ToggleGroup needs ToggleGroupItem
    if (metadata.actualName === 'ToggleGroup') {
      additionalComponents.push('ToggleGroupItem');
    }
    // Select needs SelectTrigger, SelectValue, SelectContent, SelectItem
    if (metadata.actualName === 'Select') {
      additionalComponents.push('SelectTrigger', 'SelectValue', 'SelectContent', 'SelectItem');
    }
    // Dialog needs DialogTrigger, DialogContent, DialogHeader, DialogTitle
    if (metadata.actualName === 'Dialog') {
      additionalComponents.push('DialogTrigger', 'DialogContent', 'DialogHeader', 'DialogTitle');
    }
    // Table needs TableHeader, TableBody, TableRow, TableHead, TableCell
    if (metadata.actualName === 'Table') {
      additionalComponents.push('TableHeader', 'TableBody', 'TableRow', 'TableHead', 'TableCell');
    }
    // DropdownMenu needs DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem
    if (metadata.actualName === 'DropdownMenu') {
      additionalComponents.push('DropdownMenuTrigger', 'DropdownMenuContent', 'DropdownMenuItem');
    }
    // ContextMenu needs ContextMenuTrigger, ContextMenuContent, ContextMenuItem
    if (metadata.actualName === 'ContextMenu') {
      additionalComponents.push('ContextMenuTrigger', 'ContextMenuContent', 'ContextMenuItem');
    }
    // Popover needs PopoverTrigger, PopoverContent
    if (metadata.actualName === 'Popover') {
      additionalComponents.push('PopoverTrigger', 'PopoverContent');
    }
    // HoverCard needs HoverCardTrigger, HoverCardContent
    if (metadata.actualName === 'HoverCard') {
      additionalComponents.push('HoverCardTrigger', 'HoverCardContent');
    }
    // Sheet needs SheetTrigger, SheetContent, SheetHeader, SheetTitle
    if (metadata.actualName === 'Sheet') {
      additionalComponents.push('SheetTrigger', 'SheetContent', 'SheetHeader', 'SheetTitle');
    }
    // NavigationMenu needs NavigationMenuList, NavigationMenuItem, NavigationMenuTrigger, NavigationMenuContent
    if (metadata.actualName === 'NavigationMenu') {
      additionalComponents.push('NavigationMenuList', 'NavigationMenuItem', 'NavigationMenuTrigger', 'NavigationMenuContent');
    }
    // Menubar needs MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem
    if (metadata.actualName === 'Menubar') {
      additionalComponents.push('MenubarMenu', 'MenubarTrigger', 'MenubarContent', 'MenubarItem');
    }
    // Combobox needs ComboboxTrigger, ComboboxInput, ComboboxContent, ComboboxItem
    if (metadata.actualName === 'Combobox') {
      additionalComponents.push('ComboboxTrigger', 'ComboboxInput', 'ComboboxContent', 'ComboboxItem');
    }
    // MultiSelect needs MultiSelectTrigger, MultiSelectInput, MultiSelectContent, MultiSelectItem
    if (metadata.actualName === 'MultiSelect') {
      additionalComponents.push('MultiSelectTrigger', 'MultiSelectInput', 'MultiSelectContent', 'MultiSelectItem');
    }
    const imports = this.generateImports(metadata, additionalComponents.length > 0 ? additionalComponents : undefined);
    const componentCode = this.generateComponentJSX(metadata);
    // Convert kebab-case to camelCase for function name
    const functionName = `${toCamelCase(metadata.name)}Example`;
    
    return `${imports}\n\nexport default function ${functionName}() {\n  return (\n    ${componentCode}\n  );\n}`;
  }

  /**
   * Generates code for compound component (e.g., AlertDialog)
   */
  private generateCompoundComponent(metadata: ComponentMetadata): string {
    // Convert kebab-case to camelCase for function name
    const functionName = `${toCamelCase(metadata.name)}Example`;
    
    // If there's a pre-generated example, use it but replace function name
    if (metadata.example?.code) {
      // Replace the function name in the example code with the actual component name
      const exampleCode = metadata.example.code;
      // Find the function name pattern and replace it (more flexible pattern)
      const functionNamePattern = /export\s+default\s+function\s+\w+Example\s*\(/;
      return exampleCode.replace(functionNamePattern, `export default function ${functionName}(`);
    }

    // Otherwise generate full example
    const imports = this.generateImports(metadata, metadata.requiresSubcomponents);
    const componentCode = this.generateCompoundComponentJSX(metadata);
    
    return `${imports}\n\nexport default function ${functionName}() {\n  return (\n    ${componentCode}\n  );\n}`;
  }

  /**
   * Generates code for alias component (e.g., PasswordInput -> Input)
   */
  private generateAliasComponent(metadata: ComponentMetadata): string {
    // Get the actual component info
    const aliasFor = this.registry.components[metadata.actualName];
    if (!aliasFor) {
      throw new ComponentNotFoundError(metadata.name, metadata.actualName);
    }

    // Create metadata for the aliased component
    const aliasMetadata: ComponentMetadata = {
      ...metadata,
      type: aliasFor.type || 'simple',
      props: { 
        ...aliasFor.props, 
        ...metadata.aliasProps 
      },
      selfClosing: aliasFor.selfClosing || false,
      requiresContext: aliasFor.requiresContext || false
    };

    return this.generateSimpleComponent(aliasMetadata);
  }

  /**
   * Generates import statements
   */
  private generateImports(
    metadata: ComponentMetadata,
    additionalComponents?: string[]
  ): string {
    const componentsToImport = [
      metadata.actualName,
      ...(additionalComponents || [])
    ].filter(Boolean);

    // All components should be imported from @fragment_ui/ui main package
    return `"use client";\nimport { ${componentsToImport.join(', ')} } from "@fragment_ui/ui";`;
  }

  /**
   * Generates JSX for simple component
   */
  private generateComponentJSX(metadata: ComponentMetadata): string {
    // Special handling for components that require specific props
    if (metadata.actualName === 'Breadcrumbs') {
      return this.generateBreadcrumbsJSX(metadata);
    }
    
    if (metadata.actualName === 'CommandPalette') {
      return this.generateCommandPaletteJSX(metadata);
    }
    
    if (metadata.actualName === 'Combobox') {
      return this.generateComboboxJSX(metadata);
    }
    
    if (metadata.actualName === 'MultiSelect') {
      return this.generateMultiSelectJSX(metadata);
    }
    
    if (metadata.actualName === 'SegmentedControl') {
      return this.generateSegmentedControlJSX(metadata);
    }
    
    if (metadata.actualName === 'SplitButton') {
      return this.generateSplitButtonJSX(metadata);
    }
    
    if (metadata.actualName === 'Stepper') {
      return this.generateStepperJSX(metadata);
    }
    
    if (metadata.actualName === 'Timeline') {
      return this.generateTimelineJSX(metadata);
    }
    
    if (metadata.actualName === 'TreeView') {
      return this.generateTreeViewJSX(metadata);
    }
    
    if (metadata.actualName === 'FormField') {
      return this.generateFormFieldJSX(metadata);
    }
    
    if (metadata.actualName === 'Pagination') {
      return this.generatePaginationJSX(metadata);
    }
    
    if (metadata.actualName === 'ToggleGroup') {
      return this.generateToggleGroupJSX(metadata);
    }
    
    // Accordion removed - now uses examples from registry for consistency with Library tab
    // if (metadata.actualName === 'Accordion') {
    //   return this.generateAccordionJSX(metadata);
    // }
    
    if (metadata.actualName === 'Alert') {
      return this.generateAlertJSX(metadata);
    }
    
    if (metadata.actualName === 'Select') {
      return this.generateSelectJSX(metadata);
    }
    
    if (metadata.actualName === 'Dialog') {
      return this.generateDialogJSX(metadata);
    }
    
    if (metadata.actualName === 'Table') {
      return this.generateTableJSX(metadata);
    }
    
    if (metadata.actualName === 'DropdownMenu') {
      return this.generateDropdownMenuJSX(metadata);
    }
    
    if (metadata.actualName === 'ContextMenu') {
      return this.generateContextMenuJSX(metadata);
    }
    
    if (metadata.actualName === 'Popover') {
      return this.generatePopoverJSX(metadata);
    }
    
    if (metadata.actualName === 'HoverCard') {
      return this.generateHoverCardJSX(metadata);
    }
    
    if (metadata.actualName === 'Sheet') {
      return this.generateSheetJSX(metadata);
    }
    
    if (metadata.actualName === 'NavigationMenu') {
      return this.generateNavigationMenuJSX(metadata);
    }
    
    if (metadata.actualName === 'Menubar') {
      return this.generateMenubarJSX(metadata);
    }
    
    // Check if component has variant prop
    const variantProp = this.findVariantProp(metadata.props, metadata.aliasProps);
    
    if (variantProp && Array.isArray(variantProp.values) && variantProp.values.length > 1) {
      // Generate all variants
      return this.generateAllVariantsJSX(metadata, variantProp);
    }
    
    const props = this.generateProps(metadata.props, metadata.aliasProps);
    const dataUiId = `data-ui-id="${metadata.name.toLowerCase()}-example"`;
    // Convert actualName to PascalCase for JSX (if it contains hyphens)
    const componentName = toPascalCase(metadata.actualName);
    
    if (metadata.selfClosing) {
      return `<${componentName}${props} ${dataUiId} />`;
    } else {
      return `<${componentName}${props} ${dataUiId}>\n      Example\n    </${componentName}>`;
    }
  }

  /**
   * Finds variant prop (array of values) in props
   */
  private findVariantProp(
    props?: Record<string, any>,
    aliasProps?: Record<string, any>
  ): { name: string; values: any[] } | null {
    const allProps = { ...props, ...aliasProps };
    if (!allProps) return null;
    
    // Look for "variant" prop first (most common)
    if (allProps['variant'] && Array.isArray(allProps['variant']) && allProps['variant'].length > 1) {
      return { name: 'variant', values: allProps['variant'] };
    }
    
    // Look for any prop with array of values (potential variant)
    for (const [key, value] of Object.entries(allProps)) {
      if (Array.isArray(value) && value.length > 1 && !key.endsWith('?')) {
        // Prefer non-optional props as variants
        return { name: key, values: value };
      }
    }
    
    return null;
  }

  /**
   * Generates JSX with all variants
   */
  private generateAllVariantsJSX(
    metadata: ComponentMetadata,
    variantProp: { name: string; values: any[] }
  ): string {
    const variants = variantProp.values;
    const variantName = variantProp.name;
    const cleanVariantName = variantName.replace(/\?$/, '');
    // Convert actualName to PascalCase for JSX
    const componentName = toPascalCase(metadata.actualName);
    
    const variantElements = variants.map((variant, index) => {
      // Create props with this variant
      const variantProps = { ...metadata.props, ...metadata.aliasProps };
      variantProps[variantName] = variant;
      
      const props = this.generateProps(variantProps, {});
      const dataUiId = `data-ui-id="${metadata.name.toLowerCase()}-${cleanVariantName}-${variant}-${index}"`;
      const labelText = `${cleanVariantName}="${variant}"`;
      
      if (metadata.selfClosing) {
        return `<div key="${variant}" style={{ marginBottom: '1rem' }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--color-fg-muted)', marginBottom: '0.5rem' }}>${labelText}</div>
        <${componentName}${props} ${dataUiId} />
      </div>`;
      } else {
        return `<div key="${variant}" style={{ marginBottom: '1rem' }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--color-fg-muted)', marginBottom: '0.5rem' }}>${labelText}</div>
        <${componentName}${props} ${dataUiId}>\n          Example\n        </${componentName}>
      </div>`;
      }
    });
    
    return `<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      ${variantElements.join('\n      ')}
    </div>`;
  }

  /**
   * Generates JSX for Breadcrumbs component
   */
  private generateBreadcrumbsJSX(metadata: ComponentMetadata): string {
    const dataUiId = `data-ui-id="${metadata.name.toLowerCase()}-example"`;
    const componentName = toPascalCase(metadata.actualName);
    return `<${componentName} ${dataUiId} items={[
      { label: "Home", href: "/" },
      { label: "Products", href: "/products" },
      { label: "Example" }
    ]} />`;
  }

  /**
   * Generates JSX for CommandPalette component
   */
  private generateCommandPaletteJSX(metadata: ComponentMetadata): string {
    const dataUiId = `data-ui-id="${metadata.name.toLowerCase()}-example"`;
    const componentName = toPascalCase(metadata.actualName);
    return `<${componentName} ${dataUiId} actions={[
      { id: "1", label: "New File", keywords: ["new", "file"] },
      { id: "2", label: "Open File", keywords: ["open", "file"] },
      { id: "3", label: "Save File", keywords: ["save", "file"] }
    ]} />`;
  }

  /**
   * Generates JSX for Combobox component
   * Combobox is a compound component that requires ComboboxTrigger, ComboboxInput, ComboboxContent, and ComboboxItem
   */
  private generateComboboxJSX(metadata: ComponentMetadata): string {
    const dataUiId = `data-ui-id="${metadata.name.toLowerCase()}-example"`;
    return `<Combobox ${dataUiId}>
      <ComboboxTrigger>
        <ComboboxInput placeholder="Search..." />
      </ComboboxTrigger>
      <ComboboxContent>
        <ComboboxItem value="option1">Option 1</ComboboxItem>
        <ComboboxItem value="option2">Option 2</ComboboxItem>
        <ComboboxItem value="option3">Option 3</ComboboxItem>
      </ComboboxContent>
    </Combobox>`;
  }

  /**
   * Generates JSX for MultiSelect component
   * MultiSelect is a compound component that requires MultiSelectTrigger, MultiSelectInput, MultiSelectContent, and MultiSelectItem
   */
  private generateMultiSelectJSX(metadata: ComponentMetadata): string {
    const dataUiId = `data-ui-id="${metadata.name.toLowerCase()}-example"`;
    return `<MultiSelect ${dataUiId}>
      <MultiSelectTrigger>
        <MultiSelectInput placeholder="Select multiple..." />
      </MultiSelectTrigger>
      <MultiSelectContent>
        <MultiSelectItem value="option1">Option 1</MultiSelectItem>
        <MultiSelectItem value="option2">Option 2</MultiSelectItem>
        <MultiSelectItem value="option3">Option 3</MultiSelectItem>
      </MultiSelectContent>
    </MultiSelect>`;
  }

  /**
   * Generates JSX for SegmentedControl component
   */
  private generateSegmentedControlJSX(metadata: ComponentMetadata): string {
    const dataUiId = `data-ui-id="${metadata.name.toLowerCase()}-example"`;
    const componentName = toPascalCase(metadata.actualName);
    return `<${componentName} ${dataUiId} options={[
      { value: "option1", label: "Option 1" },
      { value: "option2", label: "Option 2" },
      { value: "option3", label: "Option 3" }
    ]} />`;
  }

  /**
   * Generates JSX for SplitButton component
   */
  private generateSplitButtonJSX(metadata: ComponentMetadata): string {
    const dataUiId = `data-ui-id="${metadata.name.toLowerCase()}-example"`;
    return `<${metadata.actualName} ${dataUiId} primaryAction={{
      label: "Primary Action",
      onClick: () => {}
    }} options={[
      { label: "Option 1", onClick: () => {} },
      { label: "Option 2", onClick: () => {} }
    ]} />`;
  }

  /**
   * Generates JSX for Stepper component
   */
  private generateStepperJSX(metadata: ComponentMetadata): string {
    const dataUiId = `data-ui-id="${metadata.name.toLowerCase()}-example"`;
    return `<${metadata.actualName} ${dataUiId} steps={[
      { id: "1", label: "Step 1", description: "First step" },
      { id: "2", label: "Step 2", description: "Second step" },
      { id: "3", label: "Step 3", description: "Third step" }
    ]} currentStep={1} />`;
  }

  /**
   * Generates JSX for Timeline component
   */
  private generateTimelineJSX(metadata: ComponentMetadata): string {
    const dataUiId = `data-ui-id="${metadata.name.toLowerCase()}-example"`;
    return `<${metadata.actualName} ${dataUiId} events={[
      { id: "1", title: "Event 1", description: "First event", status: "completed" },
      { id: "2", title: "Event 2", description: "Second event", status: "current" },
      { id: "3", title: "Event 3", description: "Third event", status: "upcoming" }
    ]} />`;
  }

  /**
   * Generates JSX for TreeView component
   */
  private generateTreeViewJSX(metadata: ComponentMetadata): string {
    const dataUiId = `data-ui-id="${metadata.name.toLowerCase()}-example"`;
    return `<${metadata.actualName} ${dataUiId} nodes={[
      { id: "1", label: "Node 1", children: [
        { id: "1-1", label: "Child 1" },
        { id: "1-2", label: "Child 2" }
      ]},
      { id: "2", label: "Node 2" }
    ]} />`;
  }

  /**
   * Generates JSX for FormField component
   * FormField requires a React element as children (e.g., <Input>), not a string
   */
  private generateFormFieldJSX(metadata: ComponentMetadata): string {
    const props = this.generateProps(metadata.props, metadata.aliasProps);
    const dataUiId = `data-ui-id="${metadata.name.toLowerCase()}-example"`;
    return `<${metadata.actualName}${props} ${dataUiId}>
      <Input placeholder="Enter text..." />
    </${metadata.actualName}>`;
  }

  /**
   * Generates JSX for Pagination component
   * Pagination requires currentPage, totalPages, and onPageChange props
   */
  private generatePaginationJSX(metadata: ComponentMetadata): string {
    const dataUiId = `data-ui-id="${metadata.name.toLowerCase()}-example"`;
    return `<${metadata.actualName} ${dataUiId} currentPage={1} totalPages={10} onPageChange={(page) => {}} />`;
  }

  /**
   * Generates JSX for Alert component
   * Alert is a compound component that requires AlertTitle and AlertDescription
   */
  private generateAlertJSX(metadata: ComponentMetadata): string {
    const dataUiId = `data-ui-id="${metadata.name.toLowerCase()}-example"`;
    return `<Alert className="w-full" ${dataUiId}>
      <AlertTitle>Alert Title</AlertTitle>
      <AlertDescription>Alert description goes here.</AlertDescription>
    </Alert>`;
  }

  /**
   * Generates JSX for ToggleGroup component
   * ToggleGroup requires type prop and ToggleGroupItem children
   */
  private generateToggleGroupJSX(metadata: ComponentMetadata): string {
    const dataUiId = `data-ui-id="${metadata.name.toLowerCase()}-example"`;
    return `<ToggleGroup type="single" defaultValue="center" aria-label="Text alignment" ${dataUiId}>
      <ToggleGroupItem value="left" aria-label="Left aligned">Left</ToggleGroupItem>
      <ToggleGroupItem value="center" aria-label="Center aligned">Center</ToggleGroupItem>
      <ToggleGroupItem value="right" aria-label="Right aligned">Right</ToggleGroupItem>
    </ToggleGroup>`;
  }

  /**
   * Generates JSX for Accordion component
   * Accordion is a compound component that requires AccordionItem, AccordionTrigger, and AccordionContent
   */
  private generateAccordionJSX(metadata: ComponentMetadata): string {
    const dataUiId = `data-ui-id="${metadata.name.toLowerCase()}-example"`;
    return `<${metadata.actualName} type="single" collapsible className="w-full" ${dataUiId}>
      <AccordionItem value="item-1">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>
          Yes. It adheres to the WAI-ARIA design pattern.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Is it styled?</AccordionTrigger>
        <AccordionContent>
          Yes. It comes with default styles that matches the other components' aesthetic.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Is it animated?</AccordionTrigger>
        <AccordionContent>
          Yes. It's animated by default, but you can disable it if you prefer.
        </AccordionContent>
      </AccordionItem>
    </${metadata.actualName}>`;
  }

  /**
   * Generates JSX for compound component
   */
  private generateCompoundComponentJSX(metadata: ComponentMetadata): string {
    // Template-based generation for compound components
    if (metadata.actualName === 'AlertDialog') {
      return this.generateAlertDialogJSX();
    }
    
    if (metadata.actualName === 'Select') {
      return this.generateSelectJSX(metadata);
    }
    
    // Default template for other compound components
    return this.generateDefaultCompoundJSX(metadata);
  }

  /**
   * Generates JSX for Select component
   * Select is a compound component that requires SelectTrigger, SelectValue, SelectContent, and SelectItem
   */
  private generateSelectJSX(metadata: ComponentMetadata): string {
    const dataUiId = `data-ui-id="${metadata.name.toLowerCase()}-example"`;
    return `<Select ${dataUiId}>
      <SelectTrigger>
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="option1">Option 1</SelectItem>
        <SelectItem value="option2">Option 2</SelectItem>
        <SelectItem value="option3">Option 3</SelectItem>
      </SelectContent>
    </Select>`;
  }

  /**
   * Generates JSX for Dialog component
   * Dialog is a compound component that requires DialogTrigger, DialogContent, DialogHeader, and DialogTitle
   */
  private generateDialogJSX(metadata: ComponentMetadata): string {
    const dataUiId = `data-ui-id="${metadata.name.toLowerCase()}-example"`;
    return `<Dialog ${dataUiId}>
      <DialogTrigger asChild>
        <button>Open Dialog</button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogDescription>Dialog description goes here.</DialogDescription>
        </DialogHeader>
        <p>Dialog content goes here.</p>
      </DialogContent>
    </Dialog>`;
  }

  /**
   * Generates JSX for Table component
   * Table is a compound component that requires TableHeader, TableBody, TableRow, TableHead, and TableCell
   */
  private generateTableJSX(metadata: ComponentMetadata): string {
    const dataUiId = `data-ui-id="${metadata.name.toLowerCase()}-example"`;
    return `<Table ${dataUiId}>
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
    </Table>`;
  }

  /**
   * Generates JSX for DropdownMenu component
   * DropdownMenu is a compound component that requires DropdownMenuTrigger, DropdownMenuContent, and DropdownMenuItem
   */
  private generateDropdownMenuJSX(metadata: ComponentMetadata): string {
    const dataUiId = `data-ui-id="${metadata.name.toLowerCase()}-example"`;
    return `<DropdownMenu ${dataUiId}>
      <DropdownMenuTrigger asChild>
        <button>Open Menu</button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuItem>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>`;
  }

  /**
   * Generates JSX for ContextMenu component
   * ContextMenu is a compound component that requires ContextMenuTrigger, ContextMenuContent, and ContextMenuItem
   */
  private generateContextMenuJSX(metadata: ComponentMetadata): string {
    const dataUiId = `data-ui-id="${metadata.name.toLowerCase()}-example"`;
    return `<ContextMenu ${dataUiId}>
      <ContextMenuTrigger className="border p-4 rounded">
        Right-click here
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>Copy</ContextMenuItem>
        <ContextMenuItem>Paste</ContextMenuItem>
        <ContextMenuItem>Delete</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>`;
  }

  /**
   * Generates JSX for Popover component
   * Popover is a compound component that requires PopoverTrigger and PopoverContent
   */
  private generatePopoverJSX(metadata: ComponentMetadata): string {
    const dataUiId = `data-ui-id="${metadata.name.toLowerCase()}-example"`;
    return `<Popover ${dataUiId}>
      <PopoverTrigger asChild>
        <button>Open Popover</button>
      </PopoverTrigger>
      <PopoverContent>
        <p>Popover content goes here.</p>
      </PopoverContent>
    </Popover>`;
  }

  /**
   * Generates JSX for HoverCard component
   * HoverCard is a compound component that requires HoverCardTrigger and HoverCardContent
   */
  private generateHoverCardJSX(metadata: ComponentMetadata): string {
    const dataUiId = `data-ui-id="${metadata.name.toLowerCase()}-example"`;
    return `<HoverCard ${dataUiId}>
      <HoverCardTrigger asChild>
        <button>Hover me</button>
      </HoverCardTrigger>
      <HoverCardContent>
        <p>Hover card content goes here.</p>
      </HoverCardContent>
    </HoverCard>`;
  }

  /**
   * Generates JSX for Sheet component
   * Sheet is a compound component that requires SheetTrigger, SheetContent, SheetHeader, and SheetTitle
   */
  private generateSheetJSX(metadata: ComponentMetadata): string {
    const dataUiId = `data-ui-id="${metadata.name.toLowerCase()}-example"`;
    return `<Sheet ${dataUiId}>
      <SheetTrigger asChild>
        <button>Open Sheet</button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Sheet Title</SheetTitle>
          <SheetDescription>Sheet description goes here.</SheetDescription>
        </SheetHeader>
        <p>Sheet content goes here.</p>
      </SheetContent>
    </Sheet>`;
  }

  /**
   * Generates JSX for NavigationMenu component
   * NavigationMenu is a compound component that requires NavigationMenuList, NavigationMenuItem, NavigationMenuTrigger, and NavigationMenuContent
   */
  private generateNavigationMenuJSX(metadata: ComponentMetadata): string {
    const dataUiId = `data-ui-id="${metadata.name.toLowerCase()}-example"`;
    return `<NavigationMenu ${dataUiId}>
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
    </NavigationMenu>`;
  }

  /**
   * Generates JSX for Menubar component
   * Menubar is a compound component that requires MenubarMenu, MenubarTrigger, MenubarContent, and MenubarItem
   */
  private generateMenubarJSX(metadata: ComponentMetadata): string {
    const dataUiId = `data-ui-id="${metadata.name.toLowerCase()}-example"`;
    return `<Menubar ${dataUiId}>
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
    </Menubar>`;
  }

  /**
   * Generates AlertDialog JSX
   */
  private generateAlertDialogJSX(): string {
    return `<AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>Open Alert</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>`;
  }

  /**
   * Generates default JSX for compound components
   */
  private generateDefaultCompoundJSX(metadata: ComponentMetadata): string {
    // For now, return a simple wrapper
    // This can be extended with more sophisticated templates
    return `<${metadata.actualName}>\n      <div>Example</div>\n    </${metadata.actualName}>`;
  }

  /**
   * Generates props from metadata
   */
  private generateProps(
    props?: Record<string, any>,
    aliasProps?: Record<string, any>
  ): string {
    const allProps = { ...props, ...aliasProps };
    if (!allProps || Object.keys(allProps).length === 0) {
      return '';
    }
    
    const propsArray = Object.entries(allProps)
      .slice(0, 5) // Limit props for simplicity
      .map(([key, value]) => {
        // Remove TypeScript optional marker (?) from prop name
        const cleanKey = key.replace(/\?$/, '');
        
        // Skip union types (contain "|")
        if (typeof value === 'string' && value.includes('|')) {
          return null;
        }
        
        // Skip error prop - user should set it explicitly
        if (cleanKey === 'error') {
          return null;
        }
        
        // Handle array values (enums) - use the first value, or the value if it's already a string
        if (Array.isArray(value) && value.length > 0) {
          // If value is already set (string), use it; otherwise use first array element
          const propValue = typeof value === 'string' ? value : value[0];
          return `${cleanKey}="${propValue}"`;
        }
        
        // Handle string values that are actual values (not type descriptions)
        if (typeof value === 'string' && !['string', 'boolean', 'number'].includes(value)) {
          return `${cleanKey}="${value}"`;
        }
        
        // Handle string values
        if (typeof value === 'string') {
          // Check if it's a type description
          if (value === 'string' || value === 'boolean' || value === 'number') {
            // Generate sensible default value
            if (value === 'boolean') {
              // Skip optional boolean props - they should be omitted by default
              // Only include if they're explicitly set to true in the value
              return null;
            } else if (value === 'string') {
              const defaultValue = this.getDefaultStringValue(cleanKey);
              return defaultValue ? `${cleanKey}="${defaultValue}"` : null;
            }
            return null;
          } else {
            // It's an actual string value
            return `${cleanKey}="${value}"`;
          }
        }
        
        // Handle boolean values
        if (typeof value === 'boolean' && value) {
          return cleanKey;
        }
        
        return null;
      })
      .filter(Boolean);

    return propsArray.length > 0 ? ` ${propsArray.join(' ')}` : '';
  }

  /**
   * Gets default string value for a prop
   */
  private getDefaultStringValue(propName: string): string | null {
    const defaults: Record<string, string> = {
      label: 'Label',
      name: 'example',
      placeholder: 'Enter text',
      title: 'Title',
      description: 'Description'
    };
    
    return defaults[propName] || propName.charAt(0).toUpperCase() + propName.slice(1);
  }
}

