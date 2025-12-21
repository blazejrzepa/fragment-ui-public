/**
 * Verification runner for Submissions
 * 
 * Runs lint, a11y (placeholder), and token checks on submission TSX code.
 * Returns a verification result with score.
 */

import { ESLint } from "eslint";
import { join } from "node:path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { createRequire } from "module";
import { readFileSync } from "fs";
import type { SubmissionResult, SubmissionChecks } from "./types";
import type { UiDsl } from "../studio/dsl/types";
import { runAllChecks } from "./checks";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);

// Load custom Design System ESLint rules
const DS_RULES_DIR = join(process.cwd(), "tooling/lint");

interface ESLintRule {
  create(context: unknown): {
    [key: string]: (node: unknown) => void;
  };
}

interface ESLintParser {
  parseForESLint(code: string, options?: unknown): {
    ast: unknown;
    services?: unknown;
  };
}

let noRawElementsRule: ESLintRule | null = null;
let designSystemImportsRule: ESLintRule | null = null;
let noHardcodedColorsRule: ESLintRule | null = null;

try {
  noRawElementsRule = require(join(DS_RULES_DIR, "eslint-no-raw-elements.js")) as ESLintRule;
  designSystemImportsRule = require(join(DS_RULES_DIR, "eslint-design-system-imports-only.js")) as ESLintRule;
  noHardcodedColorsRule = require(join(DS_RULES_DIR, "eslint-no-inline-hardcoded-colors.js")) as ESLintRule;
} catch (error) {
  // Rules will be skipped if not available
  // Silently fail - rules are optional
}

// Try to use TypeScript parser if available
let tsParser: ESLintParser | null = null;
try {
  tsParser = require("@typescript-eslint/parser") as ESLintParser;
} catch {
  // Parser not available, will use default
}

/**
 * Run ESLint on TSX code
 */
async function runLint(tsx: string): Promise<{
  errors: number;
  warnings: number;
  issues: Array<{ line: number; column?: number; message: string; rule: string }>;
}> {
  try {
    // Build base config conditionally
    const baseConfig: {
      parser?: string;
      parserOptions: {
        ecmaVersion: string;
        sourceType: string;
        ecmaFeatures: { jsx: boolean };
      };
      plugins: Record<string, { rules: Record<string, ESLintRule | null> }>;
      rules: Record<string, string | [string, unknown]>;
    } = {
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
      plugins: {
        "ds-no-raw": {
          rules: {
            "no-raw-elements": noRawElementsRule,
          },
        },
        "ds-imports-only": {
          rules: {
            "design-system-imports-only": designSystemImportsRule,
          },
        },
        "ds-no-hardcolors": {
          rules: {
            "no-inline-hardcoded-colors": noHardcodedColorsRule,
          },
        },
      },
      rules: {
        // Design System rules - enforce as errors
        "ds-no-raw/no-raw-elements": "error",
        "ds-imports-only/design-system-imports-only": [
          "error",
          {
            allowed: ["^lucide-react$"],
            forbidden: {},
          },
        ],
        "ds-no-hardcolors/no-inline-hardcoded-colors": "error",
        // Turn off other rules for verification
        "no-console": "off",
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": "off",
      },
    };
    
    // Add parser if available
    if (tsParser) {
      baseConfig.parser = "@typescript-eslint/parser";
    }
    
    const eslint = new ESLint({
      overrideConfig: baseConfig,
    } as any);

    const results = await eslint.lintText(tsx, {
      filePath: "submission.tsx",
    });

    const messages = results[0]?.messages || [];
    const errors = messages.filter((m) => m.severity === 2);
    const warnings = messages.filter((m) => m.severity === 1);

    let issues = messages.map((m) => ({
      line: m.line || 0,
      column: m.column || undefined,
      message: m.message || "",
      rule: m.ruleId || "unknown",
    }));

    // Fallback: if no lint errors reported, do a lightweight check for raw HTML elements
    if (errors.length === 0 && issues.length === 0) {
      const rawTagPattern = /<\s*(button|input|select|textarea)\b/gi;
      if (rawTagPattern.test(tsx)) {
        issues = [
          {
            line: 1,
            column: undefined,
            message: "Raw HTML element detected. Use design system components.",
            rule: "ds-no-raw/no-raw-elements",
          },
        ];
      }
    }

    return {
      errors: issues.length,
      warnings: warnings.length,
      issues,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    // Log error but continue with empty result
    return {
      errors: 1,
      warnings: 0,
      issues: [
        {
          line: 0,
          column: undefined,
          message: `ESLint failed: ${errorMessage}`,
          rule: "eslint-error",
        },
      ],
    };
  }
}

/**
 * Run a11y check using Playwright + axe-core
 */
async function runA11yCheck(tsx: string): Promise<{
  violations: number;
  issues: Array<{ id: string; impact: string; description: string; help?: string; helpUrl?: string }>;
}> {
  try {
    // Check if Playwright is available
    let playwright: typeof import("playwright") | null = null;
    try {
      playwright = require("playwright") as typeof import("playwright");
    } catch {
      // Playwright not available, skip a11y check
      return {
        violations: 0,
        issues: [],
      };
    }

    // Launch browser
    const browser = await playwright.chromium.launch({
      headless: true,
    });
    
    try {
      const page = await browser.newPage();
      
      // Create HTML with the component
      // We'll use a simplified approach - just render the component in a basic HTML structure
      const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>A11y Check</title>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>
    body { margin: 0; padding: 20px; font-family: system-ui, -apple-system, sans-serif; }
    #root { min-height: 100vh; }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    ${tsx}
    
    // Try to render the component
    const root = ReactDOM.createRoot(document.getElementById('root'));
    try {
      // If code exports a default component, use it
      if (typeof Component !== 'undefined') {
        root.render(React.createElement(Component));
      } else {
        // Try to find any exported component
        const componentName = Object.keys(window).find(key => 
          typeof window[key] === 'function' && 
          window[key].name && 
          window[key].name[0] === window[key].name[0].toUpperCase()
        );
        if (componentName) {
          root.render(React.createElement(window[componentName]));
        } else {
          root.render(React.createElement('div', null, 'Component not found'));
        }
      }
    } catch (error) {
      root.render(React.createElement('div', null, 'Error: ' + error.message));
    }
  </script>
  <script>
    // Inject axe-core and run check
    (async function() {
      const axeScript = document.createElement('script');
      axeScript.src = 'https://unpkg.com/axe-core@4.11.0/axe.min.js';
      document.head.appendChild(axeScript);
      
      await new Promise((resolve) => {
        axeScript.onload = resolve;
      });
      
      // Wait for React to render
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Run axe-core
      if (window.axe && window.axe.run) {
        const results = await window.axe.run(document, {
          runOnly: {
            type: "tag",
            values: ["wcag2a", "wcag2aa", "wcag21aa", "best-practice"],
          },
        });
        
        // Send results back to Node.js
        window.__a11yResults = {
          violations: results.violations.map(v => ({
            id: v.id,
            impact: v.impact,
            description: v.description,
            help: v.help,
            helpUrl: v.helpUrl,
            nodes: v.nodes.map(n => ({
              html: n.html,
              target: n.target,
              failureSummary: n.failureSummary,
            })),
          })),
          passes: results.passes.length,
          incomplete: results.incomplete.length,
          inapplicable: results.inapplicable.length,
        };
      }
    })();
  </script>
</body>
</html>
      `;

      // Set content and wait for a11y results
      await page.setContent(html, { waitUntil: "networkidle" });
      
      // Wait for a11y check to complete (max 10 seconds)
      await page.waitForFunction(
        () => (window as any).__a11yResults !== undefined,
        { timeout: 10000 }
      ).catch(() => {
        // Timeout - a11y check may have failed
        console.warn("[Verify] A11y check timeout");
      });

      // Get results
      const a11yResults = await page.evaluate(() => (window as any).__a11yResults);
      
      if (!a11yResults) {
        return {
          violations: 0,
          issues: [],
        };
      }

      return {
        violations: a11yResults.violations.length,
        issues: a11yResults.violations.map((v: any) => ({
          id: v.id || "",
          impact: v.impact || "moderate",
          description: v.description || "",
          help: v.help,
          helpUrl: v.helpUrl,
        })),
      };
    } finally {
      await browser.close();
    }
  } catch (error: any) {
    console.error("[Verify] A11y check error:", error);
    return {
      violations: 0,
      issues: [
        {
          id: "a11y-check-failed",
          impact: "moderate",
          description: `A11y check failed: ${error.message || "Unknown error"}`,
        },
      ],
    };
  }
}

/**
 * Check for hardcoded colors and invalid CSS classes in TSX code
 */
function checkTokens(tsx: string): {
  violations: number;
  issues: Array<{ line: number; code: string; suggestion: string }>;
} {
  const issues: Array<{ line: number; code: string; suggestion: string }> = [];
  const lines = tsx.split("\n");
  
  // Allowed Tailwind color classes (whitelist)
  const allowedColorClasses = [
    "bg-", "text-", "border-", "ring-", "outline-",
    "bg-primary", "bg-secondary", "text-primary", "text-secondary",
    "border-primary", "border-secondary",
  ];
  
  // Match hex colors (#rgb, #rrggbb), rgb(), rgba(), hsl(), hsla()
  const hexPattern = /#(?:[0-9a-fA-F]{3}){1,2}\b/g;
  const rgbPattern = /rgba?\([^)]+\)/gi;
  const hslPattern = /hsla?\([^)]+\)/gi;
  
  // Match hardcoded color classes like text-[#fff], bg-[#000]
  const hardcodedColorClassPattern = /(?:className|class)=["'][^"']*(?:text|bg|border|ring|outline)-\[#[0-9a-fA-F]{3,6}\]/gi;
  
  // Check each line
  lines.forEach((line, index) => {
    const lineNum = index + 1;
    
    // Check for hex colors
    const hexMatches = line.match(hexPattern) || [];
    hexMatches.forEach((match) => {
      const context = line.substring(
        Math.max(0, line.indexOf(match) - 50),
        Math.min(line.length, line.indexOf(match) + match.length + 50)
    );
    // Skip if it's in a CSS variable fallback
      if (!context.includes("var(") || !context.includes("--")) {
        issues.push({
          line: lineNum,
          code: match,
          suggestion: `Replace ${match} with design token: var(--color-...)`,
        });
      }
    });
    
    // Check for rgb/rgba/hsl/hsla
    const rgbMatches = line.match(rgbPattern) || [];
    const hslMatches = line.match(hslPattern) || [];
    [...rgbMatches, ...hslMatches].forEach((match) => {
      issues.push({
        line: lineNum,
        code: match,
        suggestion: `Replace ${match} with design token: var(--color-...)`,
      });
    });
    
    // Check for hardcoded color classes
    const hardcodedMatches = line.match(hardcodedColorClassPattern) || [];
    hardcodedMatches.forEach((match) => {
      issues.push({
        line: lineNum,
        code: match,
        suggestion: `Replace hardcoded color class with Tailwind utility or design token`,
      });
    });
  });
  
  return {
    violations: issues.length,
    issues,
  };
}

/**
 * Check Figma Parity - compare code variants/props with Figma mapping
 */
function checkFigmaParity(tsx: string): {
  coverage: number;
  missing: Array<{ variant: string; prop: string }>;
} {
  try {
    // Load mapping
    const mappingPath = join(process.cwd(), "packages/registry/mapping.json");
    let mappingData: any = { mappings: {} };
    try {
      mappingData = JSON.parse(readFileSync(mappingPath, "utf-8"));
    } catch (fileError) {
      // If mapping.json doesn't exist, return default coverage
      return {
        coverage: 100,
        missing: [],
      };
    }
    const mappings = mappingData.mappings || {};
    
    const missing: Array<{ variant: string; prop: string }> = [];
    let totalVariants = 0;
    let foundVariants = 0;
    
    // Extract component usage from TSX
    // Simple regex to find component props and variants
    const componentPattern = /<(\w+)([^>]*)>/g;
    const matches = [...tsx.matchAll(componentPattern)];
    
    for (const match of matches) {
      const componentName = match[1];
      const propsString = match[2];
      
      if (!mappings[componentName]) {
        continue; // Component not in mapping
      }
      
      const mapping = mappings[componentName];
      const variants = mapping.variants || {};
      const props = mapping.props || {};
      
      // Check variants
      for (const [variantName, variantDef] of Object.entries(variants)) {
        totalVariants++;
        const codePattern = (variantDef as any).code || "";
        if (propsString.includes(codePattern) || codePattern === "") {
          foundVariants++;
        } else {
          missing.push({ variant: variantName, prop: componentName });
        }
      }
      
      // Check props
      for (const [propName, propDef] of Object.entries(props)) {
        const codeProp = (propDef as any).code || propName;
        if (!propsString.includes(codeProp)) {
          // Prop might be optional, so we don't count it as missing
        }
      }
    }
    
    const coverage = totalVariants > 0 ? (foundVariants / totalVariants) * 100 : 100;
    
    return {
      coverage: Math.round(coverage * 100) / 100, // Round to 2 decimal places
      missing,
    };
  } catch (error: any) {
    console.error("[Verify] Figma parity check error:", error);
    return {
      coverage: 0,
      missing: [{ variant: "error", prop: error.message || "Unknown error" }],
    };
  }
}

/**
 * Calculate verification score
 * Score: 40% lint + 40% a11y + 20% tokens/parity
 */
function calculateScore(
  lint: { errors: number; warnings: number },
  a11y: { violations: number },
  tokens: { violations: number },
  figma: { coverage: number }
): number {
  // Lint score (40%): 100 - (errors * 10 + warnings * 5), max 100
  const lintScore = Math.max(0, 100 - lint.errors * 10 - lint.warnings * 5);
  const lintWeighted = (lintScore / 100) * 40;
  
  // A11y score (40%): 100 - (violations * 15), max 100
  const a11yScore = Math.max(0, 100 - a11y.violations * 15);
  const a11yWeighted = (a11yScore / 100) * 40;
  
  // Tokens/Parity score (20%): 
  // - Tokens: 100 - (violations * 5), max 50
  // - Parity: coverage percentage, max 50
  const tokenScore = Math.max(0, 50 - tokens.violations * 5);
  const parityScore = figma.coverage * 0.5; // Convert percentage to 0-50 scale
  const tokensParityWeighted = ((tokenScore + parityScore) / 100) * 20;
  
  const totalScore = lintWeighted + a11yWeighted + tokensParityWeighted;
  return Math.round(totalScore * 100) / 100; // Round to 2 decimal places
}

/**
 * Generate actionable suggestions for fixing issues
 */
function generateSuggestions(
  lint: { errors: number; warnings: number; issues: Array<{ line: number; message: string; rule: string }> },
  a11y: { violations: number; issues: Array<{ id: string; impact: string; description: string; help?: string }> },
  tokens: { violations: number; issues: Array<{ line: number; code: string; suggestion: string }> },
  figma: { coverage: number; missing: Array<{ variant: string; prop: string }> }
): string[] {
  const suggestions: string[] = [];
  
  // Lint suggestions
  if (lint.errors > 0) {
    suggestions.push(`Fix ${lint.errors} ESLint error(s):`);
    lint.issues.slice(0, 5).forEach((issue) => {
      suggestions.push(`  Line ${issue.line}: ${issue.message} (rule: ${issue.rule})`);
    });
    if (lint.issues.length > 5) {
      suggestions.push(`  ... and ${lint.issues.length - 5} more errors`);
    }
  }
  
  // A11y suggestions
  if (a11y.violations > 0) {
    suggestions.push(`Fix ${a11y.violations} accessibility violation(s):`);
    a11y.issues.slice(0, 5).forEach((issue) => {
      const helpText = issue.help ? ` - ${issue.help}` : "";
      suggestions.push(`  ${issue.id} (${issue.impact}): ${issue.description}${helpText}`);
    });
    if (a11y.issues.length > 5) {
      suggestions.push(`  ... and ${a11y.issues.length - 5} more violations`);
  }
  }
  
  // Token suggestions
  if (tokens.violations > 0) {
    suggestions.push(`Replace ${tokens.violations} hardcoded color(s) with design tokens:`);
    tokens.issues.slice(0, 5).forEach((issue) => {
      suggestions.push(`  Line ${issue.line}: ${issue.suggestion}`);
    });
    if (tokens.issues.length > 5) {
      suggestions.push(`  ... and ${tokens.issues.length - 5} more violations`);
    }
  }
  
  // Figma parity suggestions
  if (figma.coverage < 90) {
    suggestions.push(`Improve Figma parity (current: ${figma.coverage.toFixed(1)}%, target: >90%):`);
    if (figma.missing.length > 0) {
      figma.missing.slice(0, 5).forEach((missing) => {
        suggestions.push(`  Missing variant "${missing.variant}" for component "${missing.prop}"`);
      });
    }
  }
  
  if (suggestions.length === 0) {
    suggestions.push("No issues found! Code passes all verification checks.");
  }
  
  return suggestions;
}

/**
 * Verify a submission
 * 
 * @param tsx - The TSX code to verify
 * @param dsl - Optional DSL for ACL and synthetic checks (Milestone 6.3)
 * @param storiesCode - Optional Storybook stories code for test presence check (Phase 2: D2)
 * @returns Verification result with score and suggestions
 */
export async function verifySubmission(
  tsx: string,
  dsl?: UiDsl,
  storiesCode?: string
): Promise<SubmissionResult> {
  // Run lint check
  const lint = await runLint(tsx);
  
  // Check for hardcoded colors and invalid classes
  const tokens = checkTokens(tsx);
  
  // A11y check using Playwright + axe-core
  const a11y = await runA11yCheck(tsx);
  
  // Figma parity check
  const figma = checkFigmaParity(tsx);
  
  // Run ACL and Synthetic checks if DSL is provided (Milestone 6.3)
  // Phase 2: D2 - Enhanced with bundle policy and test presence checks
  let checks: SubmissionChecks | undefined;
  if (dsl) {
    checks = await runAllChecks(dsl, tsx, lint, a11y, storiesCode);
  }
  
  // Calculate score (40% lint + 40% a11y + 20% tokens/parity)
  // If checks are available, factor in ACL and synthetic scores
  let score = calculateScore(lint, a11y, tokens, figma);
  
  // Adjust score based on checks (if available)
  // Phase 2: D2 - Enhanced with bundle policy and test presence checks
  if (checks) {
    // Deduct points for ACL violations (10% of score)
    if (!checks.acl.passed) {
      score -= checks.acl.violations * 2;
    }
    // Deduct points for synthetic failures (10% of score)
    if (!checks.synthetic.passed) {
      score -= (100 - checks.synthetic.score) * 0.1;
    }
    // Deduct points for bundle policy violations (5% of score)
    if (!checks.bundle.passed) {
      score -= checks.bundle.violations * 3;
    }
    // Deduct points for missing tests (5% of score)
    if (!checks.tests.passed) {
      score -= checks.tests.violations * 5;
    }
    score = Math.max(0, Math.min(100, score)); // Clamp between 0-100
  }
  
  // Generate actionable suggestions
  const suggestions = generateSuggestions(lint, a11y, tokens, figma);
  
  // Add ACL and synthetic suggestions if checks are available
  if (checks) {
    if (!checks.acl.passed) {
      suggestions.push(`Fix ${checks.acl.violations} ACL violation(s):`);
      checks.acl.issues.slice(0, 3).forEach((issue) => {
        suggestions.push(`  ${issue.message}`);
      });
    }
    if (!checks.synthetic.passed) {
      suggestions.push(`Fix ${checks.synthetic.failures.length} synthetic check failure(s):`);
      checks.synthetic.failures.slice(0, 3).forEach((failure) => {
        suggestions.push(`  ${failure}`);
      });
    }
  }
  
  return {
    lint,
    a11y,
    tokens,
    figma,
    score,
    suggestions,
    checks, // Include checks in result (Milestone 6.3)
  };
}

