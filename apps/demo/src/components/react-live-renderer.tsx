"use client";

import { LiveProvider, LiveEditor, LivePreview, LiveError } from "react-live";
import * as FragmentUI from "@fragment_ui/ui";
import * as FragmentBlocks from "@fragment_ui/blocks";
import * as React from "react";
import { useState, useEffect, useRef, useCallback, useLayoutEffect, Component, ErrorInfo, ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@fragment_ui/ui";
import { themes } from "prism-react-renderer";
// @ts-ignore - @babel/standalone doesn't have types
import * as Babel from "@babel/standalone";
// Import chart components from react-chartjs-2
import { Line, Bar, Pie, Doughnut, Radar, PolarArea } from "react-chartjs-2";
// Register Chart.js components (required for Chart.js v4+)
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip as ChartJSTooltip,
  Legend as ChartJSLegend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  ChartJSTooltip,
  ChartJSLegend
);

// Import chart components from recharts (with aliases to avoid conflicts with react-chartjs-2)
import {
  ResponsiveContainer,
  LineChart,
  BarChart,
  AreaChart,
  PieChart,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend,
  Line as RechartsLine,
  Bar as RechartsBar,
  Area,
  Pie as RechartsPie,
  Cell,
} from "recharts";
  // Import commonly used icons from lucide-react
import {
  Users,
  DollarSign,
  CheckCircle2,
  TrendingUp,
  Activity,
  Zap,
  Shield,
  XCircle,
  Terminal,
  Info,
  TriangleAlert,
} from "lucide-react";
// Import CommandPrimitive from cmdk (used by Combobox and MultiSelect)
import { Command as CommandPrimitive } from "cmdk";

interface ReactLiveRendererProps {
  code: string;
  onError?: (error: Error) => void;
  fullSize?: boolean; // If true, use full width and height without padding
}

// Error Boundary for better error handling
interface PreviewErrorBoundaryProps {
  children: ReactNode;
  onError?: (error: Error) => void;
}

interface PreviewErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class PreviewErrorBoundary extends Component<
  PreviewErrorBoundaryProps,
  PreviewErrorBoundaryState
> {
  constructor(props: PreviewErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): PreviewErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Preview error:", error, errorInfo);
    this.props.onError?.(error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="p-4 rounded-lg border"
          style={{
            backgroundColor: "var(--color-surface-1)",
            borderColor: "var(--color-status-error-border)",
          }}
        >
          <p
            className="text-sm font-medium mb-2"
            style={{ color: "var(--color-status-error-base)" }}
          >
            Preview Error
          </p>
          <p className="text-xs" style={{ color: "var(--color-fg-muted)" }}>
            {this.state.error?.message || "An error occurred while rendering the component"}
          </p>
          <p className="text-xs mt-2" style={{ color: "var(--color-fg-muted)" }}>
            Check the console for more details. This might be due to missing required props or incorrect component usage.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

export function ReactLiveRenderer({ code, onError, fullSize = false }: ReactLiveRendererProps) {
  // Create scope with all Fragment UI components, Blocks components, and React hooks
  const scope = {
    ...FragmentUI,
    ...FragmentBlocks, // Add all @fragment_ui/blocks components (NavigationHeader, etc.)
    React,
    useState,
    useEffect,
    useRef,
    useCallback,
    useLayoutEffect,
    // Debug: log if Accordion is available in scope (only in development)
    ...(typeof window !== 'undefined' && process.env.NODE_ENV === 'development' ? (() => {
      const hasAccordion = 'Accordion' in FragmentUI;
      const hasFormEnhanced = 'FormEnhanced' in FragmentUI;
      if (!hasAccordion) {
        console.warn('[ReactLiveRenderer] Accordion not found in FragmentUI. Available keys (first 20):', Object.keys(FragmentUI).slice(0, 20));
      } else {
        console.log('[ReactLiveRenderer] Accordion is available in scope');
      }
      if (!hasFormEnhanced) {
        console.warn('[ReactLiveRenderer] FormEnhanced not found in FragmentUI. Available keys:', Object.keys(FragmentUI).filter(k => k.toLowerCase().includes('form')));
      } else {
        console.log('[ReactLiveRenderer] FormEnhanced is available in scope:', typeof FragmentUI.FormEnhanced);
      }
      return {};
    })() : {}),
    // Add validators for ValidationRules.email() pattern (common in generated code)
    ValidationRules: FragmentUI.validators || {},
    // Add validateValue function for form validation
    validateValue: FragmentUI.validateValue || ((value: any, rules?: any) => undefined),
    // Add toast function (Toast is not a component, it's a function)
    toast: FragmentUI.toast || (() => {}),
    // Mock Toast component for backward compatibility (some generated code uses <Toast>)
    // This will show a console warning but allow the code to run
    Toast: React.forwardRef((props: any, ref: any) => {
      // Use useLayoutEffect to avoid "Cannot update during render" error
      React.useLayoutEffect(() => {
        if (FragmentUI.toast) {
          const variant = props.variant || 'default';
          const message = typeof props.children === 'string' ? props.children : 'Toast message';
          // Use setTimeout to defer toast call to next tick
          setTimeout(() => {
            if (variant === 'error') {
              FragmentUI.toast.error(message);
            } else if (variant === 'success') {
              FragmentUI.toast.success(message);
            } else if (variant === 'warning') {
              FragmentUI.toast.warning(message);
            } else if (variant === 'info') {
              FragmentUI.toast.info(message);
            } else {
              FragmentUI.toast.message(message);
            }
          }, 0);
        }
      }, []);
      return null; // Toast doesn't render anything, it's handled by Toaster
    }),
    // Aliases for backward compatibility (old code might use different names)
    // Form -> FormEnhanced (registry uses "Form" but actual export is "FormEnhanced")
    Form: FragmentUI.FormEnhanced,
    // Ensure FormEnhanced and FormFieldEnhanced are directly available (not just through FragmentUI)
    FormEnhanced: FragmentUI.FormEnhanced,
    // FormFieldEnhanced - use directly (should be wrapped in FormEnhanced by user code)
    // Note: We don't auto-wrap because it causes issues when already inside FormEnhanced
    FormFieldEnhanced: FragmentUI.FormFieldEnhanced,
    Tab: FragmentUI.Tabs, // Tab -> Tabs (common typo/old naming)
    TabList: FragmentUI.TabsList, // TabList -> TabsList (common typo/old naming)
    TabTrigger: FragmentUI.TabsTrigger, // TabTrigger -> TabsTrigger
    TabContent: FragmentUI.TabsContent, // TabContent -> TabsContent
    // Alert components
    Alert: FragmentUI.Alert,
    AlertTitle: FragmentUI.AlertTitle,
    AlertDescription: FragmentUI.AlertDescription,
    // ActivityFeed
    ActivityFeed: FragmentUI.ActivityFeed,
    // Chart.js from chart.js (for Chart.register() in generated code)
    ChartJS, // Available as ChartJS (for ChartJS.register() calls)
    // Chart (Fragment UI component) - this is the React component
    Chart: FragmentUI.Chart,
    // For Chart.register() calls in generated code, use ChartJS.register()
    // Note: ChartJS is available for ChartJS.register() calls
    // Chart.js components and scales (for Chart.register())
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    ChartJSTooltip, // Chart.js Tooltip
    ChartJSLegend, // Chart.js Legend
    // Chart.js components from react-chartjs-2
    Line,
    Bar,
    Pie,
    Doughnut,
    Radar,
    PolarArea,
    // Recharts components
    ResponsiveContainer,
    LineChart,
    BarChart,
    AreaChart,
    PieChart,
    ComposedChart,
    XAxis,
    YAxis,
    CartesianGrid,
    RechartsTooltip,
    RechartsLegend,
    RechartsLine,
    RechartsBar,
    Area,
    RechartsPie,
    Cell,
    // Note: Tooltip and Legend from FragmentUI are the default (for UI tooltips)
    // For recharts charts, use RechartsTooltip and RechartsLegend explicitly
    // Note: Line, Bar, Pie are from react-chartjs-2, use RechartsLine, RechartsBar, RechartsPie for recharts
    // Combobox - safe wrapper with default options
    Combobox: React.forwardRef<any, any>((props, ref) => {
      const safeProps = {
        ...props,
        options: props.options || [],
      };
      return <FragmentUI.Combobox ref={ref} {...safeProps} />;
    }),
    // ComboboxTrigger - alias to PopoverTrigger (used internally by Combobox)
    ComboboxTrigger: FragmentUI.PopoverTrigger,
    // ComboboxInput - alias to CommandPrimitive.Input (used internally by Combobox)
    ComboboxInput: CommandPrimitive.Input,
    // ComboboxContent - alias to PopoverContent (used internally by Combobox)
    ComboboxContent: FragmentUI.PopoverContent,
    // ComboboxItem - alias to Command.Item (used internally by Combobox)
    // Note: Combobox uses CommandPrimitive internally, so we create a simple wrapper
    ComboboxItem: ((props: any) => <div role="option" {...props} />),
    // Carousel
    Carousel: FragmentUI.Carousel,
    // CarouselItem - simple wrapper div (Carousel accepts any children)
    CarouselItem: React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
      (props, ref) => <div ref={ref} {...props} />
    ),
    // MultiSelect - safe wrapper with default options
    MultiSelect: React.forwardRef<any, any>((props, ref) => {
      const safeProps = {
        ...props,
        options: props.options || [],
      };
      return <FragmentUI.MultiSelect ref={ref} {...safeProps} />;
    }),
    // MultiSelectTrigger - alias to PopoverTrigger (used internally by MultiSelect)
    MultiSelectTrigger: FragmentUI.PopoverTrigger,
    // MultiSelectInput - alias to CommandPrimitive.Input (used internally by MultiSelect)
    MultiSelectInput: CommandPrimitive.Input,
    // MultiSelectContent - alias to PopoverContent (used internally by MultiSelect)
    MultiSelectContent: FragmentUI.PopoverContent,
    // MultiSelectItem - alias to Command.Item (used internally by MultiSelect)
    // Note: MultiSelect uses CommandPrimitive internally, so we create a simple wrapper
    MultiSelectItem: ((props: any) => <div role="option" {...props} />),
    // PasswordInput - alias to Input with type="password"
    PasswordInput: React.forwardRef<HTMLInputElement, any>(
      (props, ref) => <FragmentUI.Input ref={ref} type="password" {...props} />
    ),
    // TooltipProvider - from radix-ui (used by Tooltip)
    // Note: TooltipProvider is not exported from FragmentUI, so we create a simple wrapper
    TooltipProvider: (({ children, ...props }: any) => <>{children}</>),
    // Tabs components (ensure all are available)
    Tabs: FragmentUI.Tabs,
    // TabsList - safe wrapper that auto-wraps in Tabs if needed
    TabsList: ((props: any) => {
      // Check if we're already inside a Tabs context by checking if parent is Tabs
      // If not, wrap in Tabs
      return (
        <FragmentUI.Tabs defaultValue={props.defaultValue || "tab1"}>
          <FragmentUI.TabsList {...props} />
        </FragmentUI.Tabs>
      );
    }),
    TabsTrigger: FragmentUI.TabsTrigger,
    TabsContent: FragmentUI.TabsContent,
    // FilterBar
    FilterBar: FragmentUI.FilterBar,
    // Blocks components
    FAQSection: FragmentBlocks.FAQSection,
    CTASection: FragmentBlocks.CTASection,
    KPIDashboard: FragmentBlocks.KPIDashboard,
    KpiDashboard: FragmentBlocks.KPIDashboard, // Alias for KpiDashboard (camelCase)
    FeatureGridSection: FragmentBlocks.FeatureGridSection,
    // PricingTable - safe wrapper with default tiers
    PricingTable: ((props: any) => {
      const safeProps = {
        ...props,
        tiers: props.tiers || [],
      };
      return <FragmentBlocks.PricingTable {...safeProps} />;
    }),
    // Add commonly used icons from lucide-react
    Users,
    DollarSign,
    CheckCircle2,
    TrendingUp,
    Activity,
    Zap,
    Shield,
    XCircle,
    Terminal, // Add Terminal icon
    Info, // Add Info icon
    TriangleAlert, // Add TriangleAlert icon
  };

  // Clean code for react-live: remove imports, "use client", and export default
  // react-live doesn't support imports/exports - everything must be in scope
  // First pass: remove TypeScript type annotations before Babel transpilation
  
  // Remove imports more aggressively - handle multi-line imports
  let cleanCode = code
    // Remove "use client" directive
    .replace(/"use client";?\s*\n?/g, '');
  
  // Remove imports with proper multi-line handling
  // Match: import { ... } from "..."
  // This regex handles multi-line imports by matching across newlines
  cleanCode = cleanCode.replace(/import\s*\{[^}]*\}\s*from\s*["'][^"']+["'];?\s*\n?/gs, '');
  // Match: import X from "..."
  cleanCode = cleanCode.replace(/import\s+\w+\s+from\s+["'][^"']+["'];?\s*\n?/g, '');
  // Match: import * as X from "..."
  cleanCode = cleanCode.replace(/import\s+\*\s+as\s+\w+\s+from\s+["'][^"']+["'];?\s*\n?/g, '');
  // Match: import "..." (side-effect imports)
  cleanCode = cleanCode.replace(/import\s+["'][^"']+["'];?\s*\n?/g, '');

  // Remove TypeScript interface definitions with proper brace matching
  // This needs to be done separately because we need to modify cleanCode in place
  const removeInterfaces = (code: string): string => {
    let result = code;
    let changed = true;
    
    while (changed) {
      changed = false;
      const interfaceMatch = result.match(/interface\s+\w+[^{]*\{/);
      if (interfaceMatch && interfaceMatch.index !== undefined) {
        const start = interfaceMatch.index;
        let depth = 1;
        let pos = start + interfaceMatch[0].length;
        let inString = false;
        let stringChar = '';
        
        while (pos < result.length && depth > 0) {
          const char = result[pos];
          if (!inString && (char === '"' || char === "'" || char === '`')) {
            inString = true;
            stringChar = char;
          } else if (inString && char === stringChar) {
            inString = false;
          } else if (!inString) {
            if (char === '{') depth++;
            if (char === '}') depth--;
          }
          pos++;
        }
        
        if (depth === 0) {
          result = result.substring(0, start) + result.substring(pos);
          changed = true;
        }
      }
    }
    
    return result;
  };
  
  cleanCode = removeInterfaces(cleanCode);
  
  // Remove all export statements early (before other type annotations removal)
  // This must be done before Babel tries to parse the code
  // react-live doesn't support ES modules or CommonJS exports
  cleanCode = cleanCode
    .replace(/export\s+default\s+function\s+(\w+)/g, 'function $1')
    .replace(/export\s+function\s+(\w+)/g, 'function $1')
    .replace(/export\s+default\s+const\s+(\w+)/g, 'const $1')
    .replace(/export\s+const\s+(\w+)/g, 'const $1')
    .replace(/export\s+default\s+/g, '')
    .replace(/export\s+/g, '');
  
  cleanCode = cleanCode
    // Remove type definitions (type Name = ...)
    .replace(/type\s+\w+\s*=\s*[^;]+;\s*/g, '')
    // Pre-remove generic type parameters to help Babel (e.g., useState<Type>)
    // BUT NOT JSX tags - only match generics after identifiers or keywords
    // Match: useState<Type>, Record<string, any>, React.FormEvent<HTMLFormElement>
    // Don't match: <Card>, <CardHeader>, <div>
    .replace(/([a-zA-Z_$][a-zA-Z0-9_$]*)\s*<[A-Za-z0-9_<>,\s\[\]|&{}?]*>/g, '$1')
    // Remove type annotations from destructured function parameters
    // Match: ({ param1, param2 }: TypeName) or ({ param }: TypeName)
    // Handle both single-line and multi-line destructuring
    .replace(/(\{[\s\S]*?\})\s*:\s*[A-Z][a-zA-Z0-9<>,\s\[\]|&{}?]*(\s*\))/g, '$1$2')
    // Pre-remove type annotations in variable declarations (including React.FormEvent, string, any, etc.)
    // Only match if followed by = (variable declaration), not object values
    .replace(/:\s*[a-zA-Z][a-zA-Z0-9.<>,\s\[\]|&{}?]*(\s*[=])/g, '$1')
    // Pre-remove type annotations in function parameters (including React.FormEvent, string, any, etc.)
    // Match (param: Type) pattern but NOT object property values like { [name]: value }
    // Handle cases like: (name: string, value: any) => or (e: React.FormEvent) =>
    // More aggressive: remove all : Type patterns inside function parentheses
    // Strategy: Remove all type annotations from function parameters in one pass
    // Match patterns like: (param: Type, param2: Type2) or (param: Type) =>
    .replace(/(\([^)]*?)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*[a-zA-Z][a-zA-Z0-9.<>,\s\[\]|&{}?]*(\s*[,\)\s]*=>)/g, '$1$2$3')
    // Then remove remaining type annotations (including first parameter)
    .replace(/(\([^)]*?)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*([a-zA-Z][a-zA-Z0-9.<>,\s\[\]|&{}?]*?)(\s*[,\)])/g, (match, before, param, type, after) => {
      // Only remove if it looks like a type (no quotes, no brackets at start, not a common value name)
      // Also check if 'any' or other common types
      const isCommonType = /^(any|string|number|boolean|object|Record|React\.|HTML|void|null|undefined)$/i.test(type);
      const isValue = /^(value|prev|name|e|event|error|data|item|key|id|index|count|length|result|response|obj|arr|str|num|bool|val)$/i.test(type);
      if (isCommonType || (!isValue && !type.match(/^["'`\[{]/))) {
        return before + param + after;
      }
      return match;
    })
    // Additional pass: remove any remaining : Type patterns in parentheses (more aggressive)
    // BUT NOT object literal values like { [name]: value } - only match in function parameters
    // Only match if it's followed by ) or ,) - indicating function parameter, not object property
    .replace(/(\([^)]*?)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*([a-zA-Z][a-zA-Z0-9.<>,\s\[\]|&{}?]+)(\s*[,\)]\s*[,\)=])/g, (match, before, param, type, after) => {
      // Only remove if it looks like a type and we're in a function parameter context
      // Check if after contains => or { - indicating function parameter
      if (after.includes('=>') || after.includes('{')) {
        const isCommonType = /^(any|string|number|boolean|object|Record|React\.|HTML|void|null|undefined)$/i.test(type);
        if (isCommonType) {
          return before + param + after.replace(/^[,\)]\s*/, '');
        }
      }
      return match;
    })
    // Pre-remove type annotations in function return types (including React.FormEvent, etc.)
    .replace(/\)\s*:\s*[A-Z][a-zA-Z0-9.<>,\s\[\]|&{}?]*(\s*{)/g, ')$1')
    // Pre-remove type annotations in arrow functions (including React.FormEvent, etc.)
    .replace(/\)\s*:\s*[A-Z][a-zA-Z0-9.<>,\s\[\]|&{}?]*(\s*=>)/g, ')$1')
    .trim();

  // Fix broken object literal: const emailRules = {} -> const emailRules = {
  // Pattern: const emailRules = {} \n required: -> const emailRules = {\n    required:
  cleanCode = cleanCode.replace(
    /const\s+(\w+Rules)\s*=\s*\{\}\s*\n(\s*)(\w+):/g,
    (match, varName, indent, firstProp) => {
      return `const ${varName} = {\n${indent}    ${firstProp}:`;
    }
  );
  
  // Fix broken object literal: const emailRules = {} required: -> const emailRules = { required:
  // This handles cases where there's no newline between {} and the property
  cleanCode = cleanCode.replace(
    /const\s+(\w+Rules)\s*=\s*\{\}\s+(\w+):/g,
    (match, varName, firstProp) => {
      return `const ${varName} = {\n    ${firstProp}:`;
    }
  );
  
  // Fix incomplete object spread in setErrors: setErrors({ email) -> setErrors({ email: error })
  cleanCode = cleanCode.replace(
    /setErrors\(\{\s*(\w+)\s*\)/g,
    (match, fieldName) => {
      return `setErrors({ ${fieldName}: error })`;
    }
  );
  
  // Fix broken object literal: const app = {} "name": -> remove the invalid JSON object
  // Pattern: const app = {} followed by JSON-like object properties
  cleanCode = cleanCode.replace(
    /const\s+app\s*=\s*\{\}\s*\n\s*"name":[\s\S]*?"navigation":\s*\[\]\s*\};?\s*\n?/g,
    ''
  );
  
  // More general fix: remove any const var = {} followed by JSON-like properties (not valid JS)
  // This handles cases where AI generates invalid object literals
  cleanCode = cleanCode.replace(
    /const\s+\w+\s*=\s*\{\}\s*\n\s*"[^"]+":[\s\S]*?\};?\s*\n?/g,
    (match) => {
      // Only remove if it looks like JSON (starts with "key":) and not valid JS object
      if (match.includes('"name":') || match.includes('"screens":') || match.includes('"navigation":')) {
        return '';
      }
      return match;
    }
  );
  
  // Fix double colons first: included: true: undefined -> included: true
  cleanCode = cleanCode.replace(
    /(\w+):\s*true:\s*undefined/g,
    '$1: true'
  );
  
  // Fix nested tier objects in pricing tables: 
  // Problem: features: [{ name: "Feature 1" }, { name: "Premium", price: "$30", features: [...] }]
  // Should be: features: [{ name: "Feature 1" }] }, { name: "Premium", price: "$30", features: [...] }
  // Pattern: tier object (with name and price) nested inside features array
  // We need to close the features array, close the tier object, and start a new tier
  
  // Fix nested tier: when a tier object appears inside a features array within tiers
  // Pattern: features: [{ ... }, { name: "...", price: "...", features: [...] }]
  // Replace with: features: [{ ... }] }, { name: "...", price: "...", features: [...] }
  cleanCode = cleanCode.replace(
    /(features:\s*\[[^\]]*?)(\{\s*name:\s*"[^"]*",\s*price:\s*"[^"]*",\s*features:\s*\[)/g,
    (match, beforeFeatures, nextTier) => {
      // Close the features array with ], close the tier object with }, and start new tier
      return `${beforeFeatures}] }, ${nextTier}`;
    }
  );
  
  // Fix: tier object appearing after features array (simpler case)
  // Pattern: features: [...], { name: "...", price: "...", features: [...]
  cleanCode = cleanCode.replace(
    /(tiers\s*=\s*\[\s*\{[^}]*?features:\s*\[[^\]]*?\]\s*,\s*)(\{\s*name:\s*"[^"]*",\s*price:\s*"[^"]*",\s*features:)/g,
    (match, before, nextTier) => {
      // Close the previous tier object and start a new one
      return `${before}}, ${nextTier}`;
    }
  );
  
  // Fix missing values in object properties: { name: "Feature 1", included, { name: "Feature 2" }
  // Pattern: property name followed by comma and opening brace (missing value and closing brace)
  // This handles cases like: { name: "Feature 1", included, { name: "Feature 2" }
  // Handle both in regular objects and in arrays: features: [{ name: "...", included, { name: "..." }]
  cleanCode = cleanCode.replace(
    /(\{\s*[^}]*?)(\w+)\s*,\s*(\{)/g,
    (match, before, propName, nextBrace) => {
      // If property name is "included", "popular", or other boolean-like properties, add : true }, {
      if (propName === 'included' || propName === 'popular' || propName === 'required' || propName === 'disabled') {
        // Check if this property already has a value (e.g., "included: true")
        if (!before.match(new RegExp(`${propName}\\s*:`))) {
          return `${before}${propName}: true }, ${nextBrace}`;
        }
      }
      // Otherwise, add : undefined }, {
      if (!before.match(new RegExp(`${propName}\\s*:`))) {
        return `${before}${propName}: undefined }, ${nextBrace}`;
      }
      return match;
    }
  );
  
  // Fix missing values in object properties: { name: "Feature 1", included, ctaText: "..." }
  // Pattern: property name followed by comma (without value) before another property
  // This handles cases like: { name: "Feature 2", included, ctaText: "Sign Up" }
  cleanCode = cleanCode.replace(
    /(\{\s*[^}]*?)(\w+)\s*,\s*([a-zA-Z_$][a-zA-Z0-9_$]*\s*:)/g,
    (match, before, propName, nextProp) => {
      // If property name is "included", "popular", or other boolean-like properties, add : true
      if (propName === 'included' || propName === 'popular' || propName === 'required' || propName === 'disabled') {
        // Check if this property already has a value (e.g., "included: true")
        if (!before.match(new RegExp(`${propName}\\s*:`))) {
          return `${before}${propName}: true, ${nextProp}`;
        }
      }
      // Otherwise, add : undefined
      if (!before.match(new RegExp(`${propName}\\s*:`))) {
        return `${before}${propName}: undefined, ${nextProp}`;
      }
      return match;
    }
  );
  
  // CRITICAL FIX: Fix double/triple colons in object properties
  // Pattern: property: value: undefined -> property: value
  // Also handles: property: value: undefined: undefined -> property: value
  // Examples: id: 1: undefined -> id: 1, id: 1: undefined: undefined -> id: 1
  // This handles cases where OpenAI generates invalid syntax like { id: 1: undefined, ... }
  
  // First, fix triple colons: id: 1: undefined: undefined -> id: 1
  cleanCode = cleanCode.replace(
    /(\w+):\s*([^:,\}]+?):\s*undefined:\s*undefined/g,
    (match, propName, value) => {
      const trimmedValue = value.trim();
      if (/^\d+$/.test(trimmedValue) || 
          /^["'].*["']$/.test(trimmedValue) || 
          /^(true|false)$/.test(trimmedValue) ||
          /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(trimmedValue)) {
        return `${propName}: ${trimmedValue}`;
      }
      return match;
    }
  );
  
  // Then fix double colons: id: 1: undefined -> id: 1
  cleanCode = cleanCode.replace(
    /(\w+):\s*([^:,\}]+?):\s*undefined/g,
    (match, propName, value) => {
      const trimmedValue = value.trim();
      // Fix if value is a number, string (quoted), boolean, or identifier
      if (/^\d+$/.test(trimmedValue) || 
          /^["'].*["']$/.test(trimmedValue) || 
          /^(true|false)$/.test(trimmedValue) ||
          /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(trimmedValue)) {
        return `${propName}: ${trimmedValue}`;
      }
      return match;
    }
  );
  
  // More aggressive fix: handle cases like { id: 1: undefined, name: "John" }
  // Fix in object literals: { id: 1: undefined, ... } -> { id: 1, ... }
  cleanCode = cleanCode.replace(
    /\{\s*id:\s*(\d+):\s*undefined/g,
    '{ id: $1'
  );
  
  // Fix in array objects: [{ id: 1: undefined, ... }] -> [{ id: 1, ... }]
  cleanCode = cleanCode.replace(
    /\[\s*\{\s*id:\s*(\d+):\s*undefined/g,
    '[{ id: $1'
  );
  
  // General fix for any property with number value: property: 123: undefined -> property: 123
  cleanCode = cleanCode.replace(
    /(\w+):\s*(\d+):\s*undefined/g,
    '$1: $2'
  );
  
  // Fix double colons with true: included: true: undefined -> included: true
  cleanCode = cleanCode.replace(
    /(\w+):\s*true:\s*undefined/g,
    '$1: true'
  );
  
  // Fix double colons with false: disabled: false: undefined -> disabled: false
  cleanCode = cleanCode.replace(
    /(\w+):\s*false:\s*undefined/g,
    '$1: false'
  );
  
  // CRITICAL FIX: Fix spread operator with undefined: { ...prev: undefined, ... } -> { ...prev, ... }
  // Pattern: { ...prev: undefined, email: ... } -> { ...prev, email: ... }
  // This handles cases where spread operator is incorrectly written with : undefined
  cleanCode = cleanCode.replace(
    /\{\s*\.\.\.\s*(\w+):\s*undefined\s*,/g,
    '{ ...$1,'
  );
  
  // Also fix without comma: { ...prev: undefined } -> { ...prev }
  cleanCode = cleanCode.replace(
    /\{\s*\.\.\.\s*(\w+):\s*undefined\s*\}/g,
    '{ ...$1 }'
  );
  
  // CRITICAL FIX: Fix React.createElement("undefined", ...) -> React.createElement("div", ...)
  // This handles cases where component name is "undefined" string
  cleanCode = cleanCode.replace(
    /React\.createElement\(["']undefined["']/g,
    'React.createElement("div"'
  );
  
  // Also fix JSX-style: <undefined -> <div
  cleanCode = cleanCode.replace(
    /<undefined\s/g,
    '<div '
  );
  
  // Fix props with "undefined" string value: name: "undefined" -> (remove prop)
  // Handle both in object literals and React.createElement props
  // Pattern 1: name: "undefined", -> (remove entire line including comma and newline)
  cleanCode = cleanCode.replace(
    /(\w+):\s*["']undefined["']\s*,?\s*/g,
    ''
  );
  // Pattern 2: Fix trailing commas after removing undefined props
  cleanCode = cleanCode.replace(
    /,\s*\n\s*\}/g,
    '\n}'
  );
  cleanCode = cleanCode.replace(
    /\{\s*,/g,
    '{'
  );
  
  // Fix boolean props that should be undefined: error={false} -> (remove prop)
  // React doesn't accept false for non-boolean attributes
  // First, fix JSX attributes: error={false} -> (remove)
  // Handle with spaces: " error={false}" or " error={false} " or ", error={false}"
  cleanCode = cleanCode.replace(
    /(\s|,)\s*(\w+)=\{false\}(\s|,|>)/g,
    (match, before, propName, after) => {
      // Only remove if it's a known non-boolean prop
      if (propName === 'error' || propName === 'disabled' || propName === 'required') {
        // If before was a comma, keep it if after is not a comma
        if (before === ',' && after !== ',') {
          return after === '>' ? '>' : after;
        }
        // If after is a comma, keep it
        if (after === ',') {
          return before === ',' ? ',' : '';
        }
        // Otherwise, return the separator
        return after === '>' ? '>' : '';
      }
      return match;
    }
  );
  
  // Then fix object literals: error: false -> (remove)
  // BUT: Don't remove fill: false (it's a valid Chart.js property)
  cleanCode = cleanCode.replace(
    /(\w+):\s*false\s*,?\s*/g,
    (match, propName) => {
      // Only remove if it's a known non-boolean prop
      // BUT: Keep fill: false (it's valid for Chart.js datasets)
      if (propName === 'fill') {
        return match; // Keep fill: false
      }
      if (propName === 'error' || propName === 'disabled' || propName === 'required') {
        return '';
      }
      return match;
    }
  );
  
  // Fix missing values at end of object: { name: "...", included } -> { name: "...", included: true }
  cleanCode = cleanCode.replace(
    /(\{\s*[^}]*?)(\w+)\s*(\})/g,
    (match, before, propName, closing) => {
      // Only fix if it looks like a boolean property without a value at the end
      if (propName === 'included' || propName === 'popular' || propName === 'required' || propName === 'disabled') {
        // Check if this property already has a value (e.g., "included: true")
        if (!before.match(new RegExp(`${propName}\\s*:`))) {
          return `${before}${propName}: true${closing}`;
        }
      }
      return match;
    }
  );
  
  // Fix missing values before closing brace in arrays: [{ name: "...", included }] -> [{ name: "...", included: true }]
  cleanCode = cleanCode.replace(
    /(\[\s*\{[^}]*?)(\w+)\s*(\}\s*\])/g,
    (match, before, propName, closing) => {
      if (propName === 'included' || propName === 'popular' || propName === 'required' || propName === 'disabled') {
        if (!before.match(new RegExp(`${propName}\\s*:`))) {
          return `${before}${propName}: true${closing}`;
        }
      }
      return match;
    }
  );
  
  // Remove import and export statements before transpilation (react-live doesn't support ES modules)
  // IMPORTANT: Must remove imports BEFORE Babel transpilation, otherwise Babel will fail with sourceType: "script"
  cleanCode = cleanCode.replace(/import\s*\{[^}]*\}\s*from\s*["'][^"']+["'];?\s*\n?/gs, '');
  cleanCode = cleanCode.replace(/import\s+\w+\s+from\s+["'][^"']+["'];?\s*\n?/g, '');
  cleanCode = cleanCode.replace(/import\s+\*\s+as\s+\w+\s+from\s+["'][^"']+["'];?\s*\n?/g, '');
  cleanCode = cleanCode.replace(/import\s+["'][^"']+["'];?\s*\n?/g, ''); // Side-effect imports
  cleanCode = cleanCode.replace(/export\s+(default\s+)?function\s+/g, 'function ');
  cleanCode = cleanCode.replace(/export\s+(default\s+)?const\s+/g, 'const ');
  cleanCode = cleanCode.replace(/export\s+(default\s+)?/g, '');
  
  // Transpile JSX to JavaScript using Babel (TypeScript types already removed)
  // Use "classic" runtime to avoid _jsx imports that react-live doesn't support
  // Important: Don't use CommonJS modules - react-live runs in browser
  try {
    const transpiled = Babel.transform(cleanCode, {
      presets: [
        ["react", { runtime: "classic" }], // Use classic runtime (React.createElement)
      ],
      plugins: [],
      // Ensure we don't generate CommonJS exports
      sourceType: "script", // Use script mode, not module (avoids exports)
    });
    
    if (transpiled.code) {
      cleanCode = transpiled.code;
      // Remove any import statements that Babel might have added (multi-line support)
      cleanCode = cleanCode.replace(/import\s*\{[^}]*\}\s*from\s*["'][^"']+["'];?\s*\n?/gs, '');
      cleanCode = cleanCode.replace(/import\s+\w+\s+from\s+["'][^"']+["'];?\s*\n?/g, '');
      cleanCode = cleanCode.replace(/import\s+\*\s+as\s+\w+\s+from\s+["'][^"']+["'];?\s*\n?/g, '');
      // Remove _jsx/_jsxs runtime imports (shouldn't be needed with classic runtime, but just in case)
      cleanCode = cleanCode.replace(/import\s+.*?_jsx.*?from\s+["'][^"']+["'];?\s*\n?/g, '');
      // Remove any exports that Babel might have generated
      cleanCode = cleanCode.replace(/exports\.\w+\s*=\s*/g, '');
      cleanCode = cleanCode.replace(/exports\.default\s*=\s*/g, '');
      cleanCode = cleanCode.replace(/module\.exports\s*=\s*/g, '');
      cleanCode = cleanCode.replace(/Object\.defineProperty\(exports,\s*["']__esModule["'],\s*\{[^}]*\}\);?\s*\n?/g, '');
    }
  } catch (error) {
    // If Babel fails, fall back to more aggressive regex removal
    console.warn("Babel transpilation failed, using fallback:", error);
    // Remove any remaining imports before fallback processing
    cleanCode = cleanCode
      .replace(/import\s*\{[^}]*\}\s*from\s*["'][^"']+["'];?\s*\n?/gs, '')
      .replace(/import\s+\w+\s+from\s+["'][^"']+["'];?\s*\n?/g, '')
      .replace(/import\s+\*\s+as\s+\w+\s+from\s+["'][^"']+["'];?\s*\n?/g, '');
    cleanCode = cleanCode
      // Remove generic type parameters like <Record<string, any>>
      // BUT NOT JSX tags - only match generics after identifiers
      .replace(/([a-zA-Z_$][a-zA-Z0-9_$]*)\s*<[A-Za-z0-9_<>,\s\[\]|&{}?]*>/g, '$1')
      // Remove type annotations in variable declarations: const x: Type = -> const x = (including React.FormEvent, string, any, etc.)
      .replace(/:\s*[a-zA-Z][a-zA-Z0-9.<>,\s\[\]|&{}?]*(\s*[=,;\)])/g, '$1')
      // Remove type annotations in function parameters: (param: Type) => (param) (including React.FormEvent, string, any, etc.)
      // Handle arrow functions specifically: (name: string, value: any) => -> (name, value) =>
      // Remove all type annotations from parameters before =>
      .replace(/(\([^)]*?)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*[a-zA-Z][a-zA-Z0-9.<>,\s\[\]|&{}?]*(\s*[,\)\s]*=>)/g, '$1$2$3')
      // Remove remaining type annotations in function parameters ONLY (not object literals)
      // Only match if followed by ) or ,) and then => or { (function parameter context)
      .replace(/(\([^)]*?)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*([a-zA-Z][a-zA-Z0-9.<>,\s\[\]|&{}?]+)(\s*[,\)]\s*[,\)\s]*[=>{])/g, (match, before, param, type, after) => {
        const isCommonType = /^(any|string|number|boolean|object|Record|React\.|HTML|void|null|undefined)$/i.test(type);
        if (isCommonType) {
          return before + param + after.replace(/^[,\)]\s*/, '');
        }
        return match;
      })
      // Remove remaining type annotations that are clearly function parameters (followed by ) or ,) at end of parentheses)
      .replace(/(\([^)]*)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*(any|string|number|boolean|object|Record|React\.|HTML|void|null|undefined)(\s*[,\)]\s*\))/g, '$1$2$4')
      // Remove type annotations in function return types: function name(): Type { -> function name() { (including React.FormEvent, etc.)
      .replace(/\)\s*:\s*[A-Z][a-zA-Z0-9.<>,\s\[\]|&{}?]*(\s*{)/g, ')$1')
      // Remove type annotations in arrow functions: (): Type => -> () => (including React.FormEvent, etc.)
      .replace(/\)\s*:\s*[A-Z][a-zA-Z0-9.<>,\s\[\]|&{}?]*(\s*=>)/g, ')$1')
      .trim();
  }

  // Extract component name from various patterns:
  // 1. export default function ComponentName (highest priority) - supports camelCase and PascalCase
  // 2. export default ComponentName (for const declarations)
  // 3. const ComponentName = () => {} (React components start with uppercase)
  // 4. function ComponentName() or function componentName() - supports both camelCase and PascalCase
  // Priority: export default > function declarations (any case) > uppercase component names
  let componentNameMatch = 
    cleanCode.match(/export\s+default\s+function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/) || 
    cleanCode.match(/export\s+default\s+([A-Z][a-zA-Z0-9]*)/) ||
    cleanCode.match(/const\s+([A-Z][a-zA-Z0-9]*)\s*[:=]\s*(?:React\.FC|\([^)]*\)\s*=>|function\s*\()/) ||
    cleanCode.match(/function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/); // Support both camelCase and PascalCase
  let componentName = componentNameMatch ? componentNameMatch[1] : 'GeneratedForm';
  
  // Remove export default, keep only the function/component
  // Also handle _jsx runtime that Babel might generate
  cleanCode = cleanCode
    .replace(/export\s+default\s+function\s+(\w+)/g, 'function $1')
    .replace(/export\s+default\s+/g, '')
    // Remove _jsx/_jsxs runtime imports that Babel might add
    .replace(/import\s+.*?_jsx.*?from\s+["'][^"']+["'];?\s*\n?/g, '')
    .trim();
  
  // Re-extract component name after cleaning (in case it wasn't found before)
  // Support both camelCase and PascalCase function names
  if (componentName === 'GeneratedForm') {
    const reExtractMatch = 
      cleanCode.match(/export\s+default\s+function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/) ||
      cleanCode.match(/export\s+default\s+([A-Z][a-zA-Z0-9]*)/) ||
      cleanCode.match(/const\s+([A-Z][a-zA-Z0-9]*)\s*[:=]\s*(?:React\.FC|\([^)]*\)\s*=>|function\s*\()/) ||
      cleanCode.match(/function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/); // Support both camelCase and PascalCase
    if (reExtractMatch) {
      componentName = reExtractMatch[1];
      componentNameMatch = reExtractMatch;
    }
  }

  // For react-live, we don't need to move declarations - just ensure code is valid
  // The main issue is that react-live needs the code to evaluate to a React element
  // So we'll keep the code as-is after removing imports/exports/types

  // Helper function to convert camelCase to PascalCase for JSX component names
  // Defined once at the top level to avoid redeclaration errors
  const toPascalCase = (name: string): string => {
    if (!name) return name;
    // If already PascalCase (starts with uppercase), return as is
    if (name[0] === name[0].toUpperCase()) return name;
    // Convert camelCase to PascalCase
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  // react-live expects the code to evaluate to a React element
  // With noInline={true}, we must use render() function
  // This allows us to have function declarations and then render the component
  
  // First, check if code is just React.createElement(...) without a function wrapper
  // Pattern: React.createElement(Component, {...}) or /*#__PURE__*/React.createElement(...)
  const hasRenderCall = cleanCode.includes('render(');
  const isJustReactCreateElement = !hasRenderCall && 
                                   (cleanCode.includes('React.createElement(') || cleanCode.includes('/*#__PURE__*/React.createElement(')) &&
                                   !cleanCode.includes('function ') && 
                                   !cleanCode.includes('const ') && 
                                   !cleanCode.includes('export ');
  
  if (isJustReactCreateElement) {
    // Code is just React.createElement(...), wrap it in render()
    cleanCode = `${cleanCode}\n\nrender(${cleanCode.trim()});`;
  } else if (componentName) {
    // CRITICAL: Check if component actually exists in the code before trying to render it
    const componentExists = cleanCode.includes(`function ${componentName}`) ||
                           cleanCode.includes(`const ${componentName}`) ||
                           cleanCode.includes(`class ${componentName}`);
    
    // Check if component is already being rendered
    const alreadyRendered = cleanCode.includes(`render(`) ||
                           cleanCode.includes(`render(React.createElement(${componentName})`) ||
                           cleanCode.includes(`render(<${componentName}`);
    
    // Only add render() if component exists and is not already rendered
    if (componentExists && !alreadyRendered) {
      // With noInline={true}, react-live provides a render() function
      // Use JSX syntax instead of function call to avoid hook issues
      // Convert to PascalCase for JSX
      const pascalCaseName = toPascalCase(componentName);
      cleanCode += `\n\nrender(<${pascalCaseName} />);`;
    } else if (!componentExists && componentName === 'GeneratedForm') {
      // If GeneratedForm doesn't exist, try to find the actual component
      // Support both camelCase and PascalCase function names
      const functionMatch = cleanCode.match(/function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/);
      if (functionMatch && !alreadyRendered) {
        const actualComponentName = functionMatch[1];
        const pascalCaseName = toPascalCase(actualComponentName);
        cleanCode += `\n\nrender(<${pascalCaseName} />);`;
      } else if (!alreadyRendered) {
        // Last resort: if code contains React.createElement directly, wrap it in render()
        if (cleanCode.includes('React.createElement(') && !cleanCode.includes('function ') && !cleanCode.includes('const ')) {
          cleanCode = `${cleanCode}\n\nrender(${cleanCode.trim()});`;
        }
      }
    }
  } else {
    // If we can't find component name, try to render the last function
    if (!cleanCode.includes(`render(`)) {
      // Try to find any function that might be a component (supports both camelCase and PascalCase)
      const functionMatch = cleanCode.match(/function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/);
      if (functionMatch) {
        const foundComponentName = functionMatch[1];
        // Verify the component exists
        if (cleanCode.includes(`function ${foundComponentName}`) || cleanCode.includes(`const ${foundComponentName}`)) {
          const pascalCaseName = toPascalCase(foundComponentName);
          cleanCode += `\n\nrender(<${pascalCaseName} />);`;
        }
      } else if (cleanCode.includes('React.createElement(') && !cleanCode.includes('function ') && !cleanCode.includes('const ')) {
        // If no function found but code has React.createElement, wrap it in render()
        cleanCode = `${cleanCode}\n\nrender(${cleanCode.trim()});`;
      }
    }
  }

  // Debug: log the cleaned code (only in development)
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    const componentExists = cleanCode.includes(`function ${componentName}`) ||
                           cleanCode.includes(`const ${componentName}`) ||
                           cleanCode.includes(`class ${componentName}`);
    const hasRender = cleanCode.includes(`render(`) ||
                     cleanCode.includes(`render(React.createElement(${componentName})`) ||
                     cleanCode.includes(`render(<${componentName}`);
    // Check for return statement - handle both JSX and React.createElement
    const hasReturn = cleanCode.includes('return (') || 
                     cleanCode.includes('return <') || 
                     cleanCode.includes('return React.createElement') ||
                     cleanCode.includes('return/*#__PURE__*/React.createElement');
    
    console.log('Cleaned code for react-live (first 1000 chars):', cleanCode.substring(0, 1000));
    console.log('Cleaned code for react-live (last 200 chars):', cleanCode.substring(Math.max(0, cleanCode.length - 200)));
    console.log('Component name:', componentName);
    console.log('Has component function:', componentExists);
    console.log('Has component rendering:', hasRender);
    console.log('Has return statement:', hasReturn);
    console.log('Full code length:', cleanCode.length);
    
    // If component exists but no render, try to add it
    if (componentExists && !hasRender) {
      console.warn(`[ReactLiveRenderer] Component ${componentName} exists but no render() found. Adding render()...`);
      // Use JSX syntax instead of function call to avoid hook issues
      // Convert to PascalCase for JSX
      const pascalCaseName = toPascalCase(componentName);
      cleanCode += `\n\nrender(<${pascalCaseName} />);`;
    }
    
    // Fix render() calls that use function invocation instead of JSX
    // Pattern: render(ComponentName()) -> render(<ComponentName />)
    // Pattern: render(calendarExample()) -> render(<CalendarExample />)
    // This prevents "Invalid hook call" errors when hooks are called outside component context
    // Support both PascalCase and camelCase component names, convert to PascalCase for JSX
    cleanCode = cleanCode.replace(
      /render\s*\(\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(\s*\)\s*\)/g,
      (match, componentName) => {
        const pascalCaseName = toPascalCase(componentName);
        return `render(<${pascalCaseName} />)`;
      }
    );
    
    // Fix existing render() calls with JSX that use camelCase
    // Pattern: render(<activityFeedExample />) -> render(<ActivityFeedExample />)
    cleanCode = cleanCode.replace(
      /render\s*\(\s*<([a-z][a-zA-Z0-9_$]*)\s*\/>\s*\)/g,
      (match, componentName) => {
        const pascalCaseName = toPascalCase(componentName);
        return `render(<${pascalCaseName} />)`;
      }
    );
  }

  return (
    <LiveProvider 
      code={cleanCode}
      scope={scope}
      theme={themes.github}
      noInline={true}
    >
      {fullSize ? (
        <div 
          className="w-full h-full"
          style={{
            backgroundColor: "var(--background-primary)",
            display: "flex",
            flexDirection: "column",
            width: "100%",
            minWidth: "100%",
            maxWidth: "100%",
            position: "relative",
          }}
        >
          <PreviewErrorBoundary onError={onError}>
            <div style={{ 
              flex: 1, 
              width: "100%", 
              minWidth: "100%",
              maxWidth: "100%",
              height: "100%", 
              display: "flex", 
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}>
              <div style={{ 
                width: "100%", 
                minWidth: "100%",
                maxWidth: "100%",
                height: "100%", 
                display: "flex", 
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}>
                <LivePreview />
              </div>
            </div>
            <LiveError 
              style={{
                color: "var(--color-status-error-base)",
                padding: "12px",
                borderRadius: "6px",
                backgroundColor: "var(--color-surface-1)",
                border: "1px solid var(--color-status-error-border)",
                fontFamily: "Monaco, Consolas, monospace",
                fontSize: "13px",
                marginTop: "12px",
              }}
            />
          </PreviewErrorBoundary>
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-[400px]">
          <div 
            className="w-full border-dashed rounded-lg p-4 overflow-auto"
            style={{
              backgroundColor: "var(--color-surface-base)",
              borderColor: "var(--foreground-tertiary)",
              borderWidth: "1px",
            }}
          >
            <PreviewErrorBoundary onError={onError}>
              <LivePreview />
              <LiveError 
                style={{
                  color: "var(--color-status-error-base)",
                  padding: "12px",
                  borderRadius: "6px",
                  backgroundColor: "var(--color-surface-1)",
                  border: "1px solid var(--color-status-error-border)",
                  fontFamily: "Monaco, Consolas, monospace",
                  fontSize: "13px",
                  marginTop: "12px",
                }}
              />
            </PreviewErrorBoundary>
          </div>
        </div>
      )}
    </LiveProvider>
  );
}

/**
 * Render code editor separately (for Code tab)
 */
export function ReactLiveCodeEditor({ code, onError }: ReactLiveRendererProps) {
  const scope = {
    ...FragmentUI,
    ...FragmentBlocks, // Add all @fragment_ui/blocks components
    React,
    useState,
    useEffect,
    useRef,
    useCallback,
    // Aliases for backward compatibility
    Form: FragmentUI.FormEnhanced, // Form -> FormEnhanced (registry uses "Form" but actual export is "FormEnhanced")
    // Ensure FormEnhanced and FormFieldEnhanced are directly available (not just through FragmentUI)
    FormEnhanced: FragmentUI.FormEnhanced,
    FormFieldEnhanced: FragmentUI.FormFieldEnhanced,
    Tab: FragmentUI.Tabs,
    TabList: FragmentUI.TabsList,
    TabTrigger: FragmentUI.TabsTrigger,
    TabContent: FragmentUI.TabsContent,
    // Add commonly used icons from lucide-react
    Users,
    DollarSign,
    CheckCircle2,
    TrendingUp,
    Activity,
    Zap,
    Shield,
    XCircle,
  };

  // Clean code for react-live (same logic as ReactLiveRenderer)
  let cleanCode = code
    .replace(/"use client";?\s*\n?/g, '')
    .replace(/import\s+.*?from\s+["'][^"']+["'];?\s*\n?/g, '')
    .replace(/<[A-Za-z0-9_<>,\s\[\]|&{}?]*>/g, '')
    .replace(/:\s*[a-zA-Z][a-zA-Z0-9.<>,\s\[\]|&{}?]*(\s*[=,;\)])/g, '$1')
    .replace(/:\s*[a-zA-Z][a-zA-Z0-9.<>,\s\[\]|&{}?]*(\s*[,\)])/g, '$1')
    .replace(/\)\s*:\s*[A-Z][a-zA-Z0-9.<>,\s\[\]|&{}?]*(\s*{)/g, ')$1')
    .replace(/\)\s*:\s*[A-Z][a-zA-Z0-9.<>,\s\[\]|&{}?]*(\s*=>)/g, ')$1')
    .trim();

  try {
    const transpiled = Babel.transform(cleanCode, {
      presets: [
        ["react", { runtime: "classic" }],
      ],
      plugins: [],
    });
    
    if (transpiled.code) {
      cleanCode = transpiled.code;
      cleanCode = cleanCode.replace(/import\s+.*?from\s+["'][^"']+["'];?\s*\n?/g, '');
      cleanCode = cleanCode.replace(/import\s+.*?_jsx.*?from\s+["'][^"']+["'];?\s*\n?/g, '');
    }
  } catch (error) {
    console.warn("Babel transpilation failed, using fallback:", error);
    cleanCode = cleanCode
      .replace(/<[A-Za-z0-9_<>,\s\[\]|&{}?]*>/g, '')
      .replace(/:\s*[a-zA-Z][a-zA-Z0-9.<>,\s\[\]|&{}?]*(\s*[=,;\)])/g, '$1')
      .replace(/:\s*[a-zA-Z][a-zA-Z0-9.<>,\s\[\]|&{}?]*(\s*[,\)])/g, '$1')
      .replace(/\)\s*:\s*[A-Z][a-zA-Z0-9.<>,\s\[\]|&{}?]*(\s*{)/g, ')$1')
      .replace(/\)\s*:\s*[A-Z][a-zA-Z0-9.<>,\s\[\]|&{}?]*(\s*=>)/g, ')$1')
      .trim();
  }

  const componentNameMatch = cleanCode.match(/export\s+default\s+function\s+(\w+)/) || 
                             cleanCode.match(/function\s+(\w+)\s*\(/);
  const componentName = componentNameMatch ? componentNameMatch[1] : 'GeneratedForm';
  
  cleanCode = cleanCode
    .replace(/export\s+default\s+function\s+(\w+)/g, 'function $1')
    .replace(/export\s+default\s+/g, '')
    .replace(/import\s+.*?_jsx.*?from\s+["'][^"']+["'];?\s*\n?/g, '')
    .trim();

  if (componentName) {
    const alreadyRendered = cleanCode.includes(`<${componentName}`) || 
                           cleanCode.includes(`React.createElement(${componentName}`) ||
                           cleanCode.includes(`render(`);
    
    if (!alreadyRendered) {
      cleanCode += `\n\nrender(React.createElement(${componentName}))`;
    }
  }

  return (
    <LiveProvider 
      code={cleanCode}
      scope={scope}
      theme={themes.github}
      noInline={true}
    >
      <div className="space-y-4">
        <div className="border rounded-lg overflow-hidden">
          <LiveEditor 
            style={{
              fontFamily: "Monaco, Consolas, 'Courier New', monospace",
              fontSize: 14,
              minHeight: "400px",
              backgroundColor: "var(--color-surface-1)",
              color: "var(--color-fg-base)",
            }}
          />
        </div>
        <LiveError 
          style={{
            color: "var(--color-status-error-base)",
            padding: "12px",
            borderRadius: "6px",
            backgroundColor: "var(--color-surface-1)",
            border: "1px solid var(--color-status-error-border)",
            fontFamily: "Monaco, Consolas, monospace",
            fontSize: "13px",
          }}
        />
      </div>
    </LiveProvider>
  );
}

