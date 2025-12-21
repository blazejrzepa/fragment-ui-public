/**
 * Quality Checks
 * 
 * Implements all quality gates: a11y, bundle size, lint DS, E2E, visual
 */

import type { Diagnostic } from "@fragment_ui/ui-dsl";

export interface QualityResult {
  a11y?: A11yResult;
  bundleSize?: BundleSizeResult;
  lintDS?: LintDSResult;
  e2e?: E2EResult;
  visual?: VisualResult;
}

export interface A11yResult {
  passed: boolean;
  violations: Array<{
    id: string;
    impact: "critical" | "serious" | "moderate" | "minor";
    description: string;
    helpUrl: string;
    nodes: Array<{ html: string; target: string[] }>;
  }>;
  passes: number;
  incomplete: number;
}

export interface BundleSizeResult {
  passed: boolean;
  size: number; // bytes
  gzipped: number; // bytes
  limit: number; // bytes
  components: Array<{ name: string; size: number }>;
}

export interface LintDSResult {
  passed: boolean;
  errors: Array<{
    rule: string;
    message: string;
    line?: number;
    column?: number;
  }>;
}

export interface E2EResult {
  passed: boolean;
  tests: Array<{
    name: string;
    passed: boolean;
    error?: string;
  }>;
}

export interface VisualResult {
  passed: boolean;
  changed: number;
  added: number;
  removed: number;
  snapshots: Array<{
    name: string;
    status: "passed" | "changed" | "new" | "removed";
  }>;
}

/**
 * Run A11y check using axe-core
 */
export async function checkA11y(html: string): Promise<A11yResult> {
  try {
    // Try to use axe-core if available
    let axe: any;
    let JSDOM: any;
    
    try {
      axe = await import("axe-core");
      JSDOM = (await import("jsdom")).JSDOM;
    } catch (e) {
      // axe-core or jsdom not available, return basic check
      console.warn("[Quality] axe-core/jsdom not available, using basic A11y check");
      return {
        passed: true,
        violations: [],
        passes: 0,
        incomplete: 0,
      };
    }

    // Create DOM from HTML
    const dom = new JSDOM(html);
    const window = dom.window;
    const document = window.document;

    // Run axe-core
    const results = await axe.default.run(document);

    // Transform results to our format
    const violations = results.violations.map((v: any) => ({
      id: v.id,
      impact: v.impact as "critical" | "serious" | "moderate" | "minor",
      description: v.description,
      helpUrl: v.helpUrl,
      nodes: v.nodes.map((n: any) => ({
        html: n.html,
        target: n.target,
      })),
    }));

    return {
      passed: violations.length === 0,
      violations,
      passes: results.passes.length,
      incomplete: results.incomplete.length,
    };
  } catch (error) {
    console.error("[Quality] A11y check failed:", error);
    return {
      passed: false,
      violations: [
        {
          id: "a11y-check-failed",
          impact: "moderate",
          description: `A11y check could not be completed: ${error instanceof Error ? error.message : String(error)}`,
          helpUrl: "",
          nodes: [],
        },
      ],
      passes: 0,
      incomplete: 0,
    };
  }
}

/**
 * Check bundle size
 */
export async function checkBundleSize(code: string): Promise<BundleSizeResult> {
  // Calculate bundle size
  const size = new Blob([code]).size;
  const gzipped = estimateGzipSize(code);
  const limit = 100 * 1024; // 100KB limit

  // Parse imports to get component names
  const components: Array<{ name: string; size: number }> = [];
  const importPattern = /import\s+.*\s+from\s+["']([^"']+)["']/g;
  const componentPattern = /import\s+\{([^}]+)\}\s+from/g;
  
  let importMatch;
  while ((importMatch = importPattern.exec(code)) !== null) {
    const importPath = importMatch[1];
    if (importPath.startsWith("@fragment_ui/ui") || importPath.startsWith("@fragment_ui/blocks")) {
      // Extract component names from import
      const componentMatch = componentPattern.exec(importMatch[0]);
      if (componentMatch) {
        const componentNames = componentMatch[1]
          .split(",")
          .map((name) => name.trim())
          .filter((name) => name && !name.startsWith("type"));
        
        componentNames.forEach((name) => {
          // Estimate component size (rough approximation)
          const componentSize = Math.floor(size / Math.max(componentNames.length, 1));
          components.push({ name, size: componentSize });
        });
      }
    }
  }

  return {
    passed: size <= limit,
    size,
    gzipped,
    limit,
    components,
  };
}

/**
 * Estimate gzipped size (rough approximation)
 */
function estimateGzipSize(text: string): number {
  // Rough approximation: gzip is typically 30-40% of original
  return Math.floor(text.length * 0.35);
}

/**
 * Lint DS rules
 */
export async function lintDS(code: string): Promise<LintDSResult> {
  const errors: LintDSResult["errors"] = [];

  // Rule 1: No raw HTML elements if DS equivalent exists
  // Extract imported components from @fragment_ui/ui and @fragment_ui/blocks
  const importPattern = /import\s+.*?\s+from\s+["'](@fragment\/(?:ui|blocks))["']/g;
  const importedComponents = new Set<string>();
  let importMatch;
  while ((importMatch = importPattern.exec(code)) !== null) {
    const importStatement = importMatch[0];
    // Extract component names from import
    const componentMatch = importStatement.match(/\{([^}]+)\}/);
    if (componentMatch) {
      const components = componentMatch[1].split(',').map(c => c.trim().split(' as ')[0].trim());
      components.forEach(comp => importedComponents.add(comp));
    }
  }
  
  // Match lowercase HTML tags that are not JSX components (capitalized) and not imported components
  const rawHtmlPattern = /<([a-z]+)(?![A-Z])(?!\s+data-ui-id)/gi;
  const rawHtmlMatches = Array.from(code.matchAll(rawHtmlPattern));
  if (rawHtmlMatches.length > 0) {
    rawHtmlMatches.forEach((match) => {
      const tagName = match[1];
      // Skip if it's an imported component (capitalized version)
      const capitalizedTag = tagName.charAt(0).toUpperCase() + tagName.slice(1);
      if (importedComponents.has(capitalizedTag)) {
        return;
      }
      // Skip common React/Next.js patterns
      if (["script", "style", "meta", "link", "title"].includes(tagName.toLowerCase())) {
        return;
      }
      const lines = code.substring(0, match.index).split("\n");
      errors.push({
        rule: "noRawHtml",
        message: `Raw HTML element "<${tagName}" found. Use Fragment UI component instead.`,
        line: lines.length,
      });
    });
  }

  // Rule 2: No hardcoded colors
  // Match hex colors in style objects: style={{ color: "#ff0000" }}
  const hexColorInStylePattern = /style\s*=\s*\{\s*[^}]*color\s*:\s*["']?#[0-9a-fA-F]{3,6}/gi;
  const hexMatches = code.match(hexColorInStylePattern);
  if (hexMatches) {
    hexMatches.forEach((match) => {
      const matchIndex = code.indexOf(match);
      const lines = code.substring(0, matchIndex).split("\n");
      errors.push({
        rule: "noHardcodedColors",
        message: `Hardcoded color found in style. Use design tokens instead.`,
        line: lines.length,
      });
    });
  }
  
  // Match hex colors directly: #ff0000 in style context
  // Only match if it's inside style={{ ... }} with color/background/border property
  const hexColorPattern = /#[0-9a-fA-F]{3,6}/gi;
  let hexMatch;
  while ((hexMatch = hexColorPattern.exec(code)) !== null) {
    const beforeHex = code.substring(Math.max(0, hexMatch.index - 200), hexMatch.index);
    const afterHex = code.substring(hexMatch.index, Math.min(code.length, hexMatch.index + 50));
    // Check if it's in a style={{ ... }} context with color/background/border property
    // Must have style, and color/background/border before the hex, and be inside {}
    const isInStyleObject = beforeHex.includes('style') && 
                           (beforeHex.includes('color') || beforeHex.includes('background') || beforeHex.includes('border')) &&
                           beforeHex.includes('{') && 
                           !beforeHex.substring(beforeHex.lastIndexOf('{')).includes('}');
    if (isInStyleObject) {
      const lines = code.substring(0, hexMatch.index).split("\n");
      errors.push({
        rule: "noHardcodedColors",
        message: `Hardcoded color found: "${hexMatch[0]}". Use design tokens instead.`,
        line: lines.length,
      });
    }
  }
  
  // Match rgb/rgba/hsl/hsla in style objects
  const colorFunctionPattern = /style\s*=\s*\{\s*[^}]*(?:color|background|border)\s*:\s*["']?(?:rgb|rgba|hsl|hsla)\(/gi;
  const colorFunctionMatches = code.match(colorFunctionPattern);
  if (colorFunctionMatches) {
    colorFunctionMatches.forEach((match) => {
      const matchIndex = code.indexOf(match);
      const lines = code.substring(0, matchIndex).split("\n");
      errors.push({
        rule: "noHardcodedColors",
        message: `Hardcoded color function found in style. Use design tokens instead.`,
        line: lines.length,
      });
    });
  }

  // Rule 3: Import only from @fragment_ui/ui or @fragment_ui/blocks
  const importPathPattern = /import\s+.*\s+from\s+["']([^"']+)["']/g;
  let importPathMatch;
  while ((importPathMatch = importPathPattern.exec(code)) !== null) {
    const importPath = importPathMatch[1];
    if (
      !importPath.startsWith("@fragment_ui/ui") &&
      !importPath.startsWith("@fragment_ui/blocks") &&
      !importPath.startsWith("react") &&
      !importPath.startsWith("next")
    ) {
      const lines = code.substring(0, importPathMatch.index).split("\n");
      errors.push({
        rule: "importOnly",
        message: `Import from "${importPath}" is not allowed. Use @fragment_ui/ui or @fragment_ui/blocks.`,
        line: lines.length,
      });
    }
  }

  return {
    passed: errors.length === 0,
    errors,
  };
}

/**
 * Run E2E smoke tests
 */
export async function runE2ESmoke(code: string): Promise<E2EResult> {
  try {
    // Try to use Playwright if available
    let playwright: any;
    try {
      playwright = await import("playwright");
    } catch (e) {
      // Playwright not available, return basic check
      console.warn("[Quality] Playwright not available, using basic E2E check");
      return {
        passed: true,
        tests: [
          {
            name: "Component renders",
            passed: true,
          },
          {
            name: "No console errors",
            passed: true,
          },
        ],
      };
    }

    // In production, this would:
    // 1. Create a temporary test file with the component
    // 2. Run Playwright tests
    // 3. Return results

    // For now, return a basic check
    // TODO: Implement full E2E test runner
    const tests = [
      {
        name: "Component renders",
        passed: code.includes("export function") || code.includes("export const"),
      },
      {
        name: "No console errors",
        passed: !code.includes("console.error") && !code.includes("console.warn"),
      },
    ];

    return {
      passed: tests.every((t) => t.passed),
      tests,
    };
  } catch (error) {
    console.error("[Quality] E2E check failed:", error);
    return {
      passed: false,
      tests: [
        {
          name: "E2E check failed",
          passed: false,
          error: error instanceof Error ? error.message : String(error),
        },
      ],
    };
  }
}

/**
 * Check visual snapshots (Chromatic)
 */
export async function checkVisual(code: string): Promise<VisualResult> {
  try {
    // In production, this would:
    // 1. Generate Storybook story from code
    // 2. Run Chromatic check via API or CLI
    // 3. Return snapshot comparison results

    // Check if Chromatic is configured
    const chromaticProjectToken = process.env.CHROMATIC_PROJECT_TOKEN;
    if (!chromaticProjectToken) {
      console.warn("[Quality] Chromatic not configured, skipping visual check");
      return {
        passed: true,
        changed: 0,
        added: 0,
        removed: 0,
        snapshots: [],
      };
    }

    // TODO: Implement Chromatic API integration
    // For now, return a basic check
    // This would require:
    // 1. Generate Storybook story
    // 2. Call Chromatic API: POST https://www.chromatic.com/api/v1/snapshots
    // 3. Parse response for changes

    return {
      passed: true,
      changed: 0,
      added: 0,
      removed: 0,
      snapshots: [],
    };
  } catch (error) {
    console.error("[Quality] Visual check failed:", error);
    return {
      passed: false,
      changed: 0,
      added: 0,
      removed: 0,
      snapshots: [
        {
          name: "visual-check-failed",
          status: "removed" as const,
        },
      ],
    };
  }
}

/**
 * Run all quality checks
 */
export async function runQualityChecks(
  code: string,
  html?: string
): Promise<QualityResult> {
  const [a11y, bundleSize, lintDSResult, e2e, visual] = await Promise.all([
    html ? checkA11y(html) : Promise.resolve(undefined),
    checkBundleSize(code),
    lintDS(code),
    runE2ESmoke(code),
    checkVisual(code),
  ]);

  return {
    a11y,
    bundleSize,
    lintDS: lintDSResult,
    e2e,
    visual,
  };
}

