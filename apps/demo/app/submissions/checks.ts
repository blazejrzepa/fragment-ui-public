/**
 * Quality checks for Submissions (Milestone 6.3)
 * 
 * Implements ACL check and Synthetic check for agent-readable UI validation
 */

import type { UiDsl, ActionContract, UiDecision } from "../studio/dsl/types";
import type { SubmissionChecks } from "./types";

/**
 * ACL Check - verifies that all CTAs have required data-action-* attributes
 */
export function aclCheck(dsl: UiDsl, code: string): SubmissionChecks['acl'] {
  const issues: Array<{ element: string; missing: string[]; message: string }> = [];
  
  // Extract all buttons/CTAs from code
  const buttonPattern = /<Button[^>]*>/gi;
  const buttons = code.matchAll(buttonPattern);
  
  for (const buttonMatch of buttons) {
    const buttonCode = buttonMatch[0];
    const buttonIndex = buttonMatch.index || 0;
    
    // Check for data-action-id
    const hasActionId = /data-action-id=["'][^"']+["']/i.test(buttonCode);
    // Check for data-action-kind
    const hasActionKind = /data-action-kind=["'][^"']+["']/i.test(buttonCode);
    
    const missing: string[] = [];
    if (!hasActionId) missing.push('data-action-id');
    if (!hasActionKind) missing.push('data-action-kind');
    
    if (missing.length > 0) {
      // Try to extract button text for better error message
      const textMatch = buttonCode.match(/>([^<]+)</);
      const buttonText = textMatch ? textMatch[1].trim() : 'Button';
      
      issues.push({
        element: buttonText,
        missing,
        message: `Button "${buttonText}" is missing ACL attributes: ${missing.join(', ')}. All CTAs must have data-action-id and data-action-kind for agent compatibility.`,
      });
    }
  }
  
  // Also check DSL for Action Contracts
  if ('actions' in dsl && Array.isArray(dsl.actions)) {
    const actionContracts = dsl.actions.filter((a: any) => 'kind' in a) as ActionContract[];
    
    // Verify that each Action Contract has corresponding data-action-id in code
    for (const contract of actionContracts) {
      const actionIdPattern = new RegExp(`data-action-id=["']${contract.id}["']`, 'i');
      if (!actionIdPattern.test(code)) {
        issues.push({
          element: contract.label,
          missing: ['data-action-id'],
          message: `Action Contract "${contract.label}" (id: ${contract.id}) is defined in DSL but not found in generated code.`,
        });
      }
    }
  }
  
  return {
    violations: issues.length,
    issues,
    passed: issues.length === 0,
  };
}

/**
 * Synthetic Check - deterministic evaluation of DSL structure
 * Simulates what an agent would check when "reading" the UI
 */
export function syntheticCheck(dsl: UiDsl): SubmissionChecks['synthetic'] {
  const failures: string[] = [];
  let score = 100; // Start with perfect score, deduct for failures
  
  // Check decision patterns
  if (dsl.type === 'decision') {
    const decision = dsl as UiDecision;
    
    // Rule: compare-3 must have ≥3 options
    if (decision.pattern === 'compare-3') {
      if (!decision.options || decision.options.length < 3) {
        failures.push(`Decision pattern "compare-3" requires at least 3 options, found ${decision.options?.length || 0}`);
        score -= 30;
      }
    }
    
    // Rule: recommendation must have ≥2 options with ranks
    if (decision.pattern === 'recommendation') {
      if (!decision.options || decision.options.length < 2) {
        failures.push(`Decision pattern "recommendation" requires at least 2 options, found ${decision.options?.length || 0}`);
        score -= 30;
      } else {
        // Check that options have ranks
        const optionsWithoutRanks = decision.options.filter((opt: any) => !opt.rank);
        if (optionsWithoutRanks.length > 0) {
          failures.push(`Recommendation pattern requires all options to have rank, ${optionsWithoutRanks.length} option(s) missing rank`);
          score -= 20;
        }
      }
    }
    
    // Rule: review-confirm must have items and actionContractId
    if (decision.pattern === 'review-confirm') {
      if (!(decision as any).items || (decision as any).items.length === 0) {
        failures.push(`Decision pattern "review-confirm" requires items array, found none`);
        score -= 30;
      }
      if (!(decision as any).actionContractId) {
        failures.push(`Decision pattern "review-confirm" requires actionContractId for confirmation action`);
        score -= 20;
      }
    }
  }
  
  // Check constraints
  if ('constraints' in dsl && dsl.constraints) {
    const constraints = dsl.constraints;
    
    // Check hard constraints
    if (constraints.hard && constraints.hard.length > 0) {
      for (const constraint of constraints.hard) {
        // Example: budget <= 500
        if (constraint.type === 'budget' && constraint.condition.includes('<=')) {
          const budgetMatch = constraint.condition.match(/(\d+)/);
          if (budgetMatch) {
            const maxBudget = parseInt(budgetMatch[1]);
            
            // For decision patterns, check if any option satisfies budget constraint
            if (dsl.type === 'decision') {
              const decision = dsl as UiDecision;
              if (decision.options) {
                const optionsWithinBudget = decision.options.filter((opt: any) => {
                  if (!opt.price) return false;
                  const priceMatch = opt.price.match(/(\d+)/);
                  if (priceMatch) {
                    const price = parseInt(priceMatch[1]);
                    return price <= maxBudget;
                  }
                  return false;
                });
                
                if (optionsWithinBudget.length === 0) {
                  failures.push(`Hard constraint "budget <= ${maxBudget}" not satisfied: no options within budget`);
                  score -= 25;
                }
              }
            }
          }
        }
      }
    }
  }
  
  // Check Action Contracts
  if ('actions' in dsl && Array.isArray(dsl.actions)) {
    const actionContracts = dsl.actions.filter((a: any) => 'kind' in a) as ActionContract[];
    
    for (const contract of actionContracts) {
      // Rule: hard actions must require confirmation
      if (contract.kind === 'hard' && !contract.requiresConfirmation) {
        failures.push(`Hard action "${contract.label}" must require confirmation (kind="hard" ⇒ requiresConfirmation=true)`);
        score -= 15;
      }
      
      // Rule: high risk actions must require confirmation
      if (contract.riskLevel === 'high' && !contract.requiresConfirmation) {
        failures.push(`High risk action "${contract.label}" must require confirmation (riskLevel="high" ⇒ requiresConfirmation=true)`);
        score -= 15;
      }
      
      // Rule: preauthAllowed only for soft actions
      if (contract.preauthAllowed && contract.kind !== 'soft') {
        failures.push(`Action "${contract.label}" has preauthAllowed=true but kind is not "soft"`);
        score -= 10;
      }
    }
  }
  
  // Check for missing intent
  if (!('intent' in dsl) || !dsl.intent || !dsl.intent.primary) {
    failures.push('DSL missing primary intent - agents need intent to understand UI purpose');
    score -= 10;
  }
  
  // Ensure score doesn't go below 0
  score = Math.max(0, score);
  
  return {
    score,
    failures,
    passed: failures.length === 0,
  };
}

/**
 * Bundle Policy Check - verifies bundle policies (no CSS import ESM, no forbidden deps)
 * Phase 2: D2 - Quality Checks Runner
 */
export function bundlePolicyCheck(code: string): SubmissionChecks['bundle'] {
  const issues: Array<{ rule: string; message: string; severity: "error" | "warning"; location?: { line?: number; column?: number } }> = [];
  
  // Calculate bundle size (rough estimate)
  const size = new Blob([code]).size;
  const gzipped = Math.floor(code.length * 0.35); // Rough gzip estimate
  
  // Policy 1: No CSS import ESM (should use CSS modules or Tailwind)
  const cssImportPattern = /import\s+["'][^"']*\.css["']/g;
  const cssImports = Array.from(code.matchAll(cssImportPattern));
  
  for (const match of cssImports) {
    const lineMatch = code.substring(0, match.index || 0).split('\n');
    const line = lineMatch.length;
    
    issues.push({
      rule: "no-css-import-esm",
      message: `CSS file imported via ESM: "${match[0]}". Use CSS modules or Tailwind classes instead.`,
      severity: "error",
      location: { line },
    });
  }
  
  // Policy 2: No forbidden dependencies
  const forbiddenDeps = [
    /import\s+.*\s+from\s+["']react-dom\/server["']/g, // SSR imports in client code
    /import\s+.*\s+from\s+["']@emotion\/[^"']+["']/g, // Emotion (use Fragment UI instead)
    /import\s+.*\s+from\s+["']styled-components["']/g, // Styled-components (use Fragment UI instead)
  ];
  
  const forbiddenDepNames = [
    "react-dom/server",
    "@emotion/*",
    "styled-components",
  ];
  
  forbiddenDeps.forEach((pattern, index) => {
    const matches = Array.from(code.matchAll(pattern));
    matches.forEach(match => {
      const lineMatch = code.substring(0, match.index || 0).split('\n');
      const line = lineMatch.length;
      
      issues.push({
        rule: "no-forbidden-deps",
        message: `Forbidden dependency detected: "${forbiddenDepNames[index]}". Use Fragment UI components instead.`,
        severity: "error",
        location: { line },
      });
    });
  });
  
  // Policy 3: Bundle size limits (warning only)
  const bundleLimit = 100 * 1024; // 100KB
  if (size > bundleLimit) {
    issues.push({
      rule: "bundle-size-limit",
      message: `Bundle size exceeds limit: ${(size / 1024).toFixed(2)}KB > ${(bundleLimit / 1024).toFixed(2)}KB. Consider code splitting or optimization.`,
      severity: "warning",
    });
  }
  
  return {
    violations: issues.filter(i => i.severity === "error").length,
    issues,
    passed: issues.filter(i => i.severity === "error").length === 0,
    size,
    gzipped,
  };
}

/**
 * Test Presence Check - verifies minimum test requirements (story + unit for new components)
 * Phase 2: D2 - Quality Checks Runner
 */
export function testPresenceCheck(
  code: string,
  componentName?: string,
  storiesCode?: string
): SubmissionChecks['tests'] {
  const issues: Array<{ type: "story" | "unit"; component: string; message: string }> = [];
  
  // Extract component name from code if not provided
  let extractedComponentName = componentName;
  if (!extractedComponentName) {
    const componentMatch = code.match(/export\s+(?:default\s+)?function\s+(\w+)/);
    if (componentMatch) {
      extractedComponentName = componentMatch[1];
    } else {
      const constMatch = code.match(/export\s+(?:default\s+)?const\s+(\w+)/);
      if (constMatch) {
        extractedComponentName = constMatch[1];
      }
    }
  }
  
  const component = extractedComponentName || "Component";
  
  // Check for Storybook story
  const hasStory = storiesCode !== undefined && storiesCode.trim().length > 0;
  if (!hasStory) {
    // Also check if story might be in a separate file (we can't check that here)
    // But we can check if storiesCode was provided
    issues.push({
      type: "story",
      component,
      message: `Missing Storybook story for "${component}". Minimum requirement: story file (.stories.tsx)`,
    });
  }
  
  // Check for unit tests (look for test files or test code)
  // For now, we assume tests are in separate files, so we check if there's any indication
  // In a real implementation, we'd check the file system for test files
  // For now, we'll mark this as a warning if storiesCode doesn't exist (which often means new component)
  const hasUnit = false; // Would check file system in real implementation
  
  if (!hasUnit && !hasStory) {
    // Only flag if component seems new (no story)
    issues.push({
      type: "unit",
      component,
      message: `Missing unit tests for "${component}". Minimum requirement: unit test file (.test.tsx)`,
    });
  }
  
  return {
    violations: issues.length,
    issues,
    passed: issues.length === 0,
    hasStory,
    hasUnit,
  };
}

/**
 * Run all checks and return SubmissionChecks object
 */
export async function runAllChecks(
  dsl: UiDsl,
  code: string,
  lintResult: { errors: number; warnings: number; issues: Array<{ line: number; column?: number; message: string; rule: string }> },
  a11yResult: { violations: number; issues: Array<{ id: string; impact: string; description: string; help?: string; helpUrl?: string }> },
  storiesCode?: string
): Promise<SubmissionChecks> {
  const acl = aclCheck(dsl, code);
  const synthetic = syntheticCheck(dsl);
  const bundle = bundlePolicyCheck(code);
  
  // Extract component name from code for test presence check
  const componentMatch = code.match(/export\s+(?:default\s+)?function\s+(\w+)/) ||
                        code.match(/export\s+(?:default\s+)?const\s+(\w+)/);
  const componentName = componentMatch ? componentMatch[1] : undefined;
  
  const tests = testPresenceCheck(code, componentName, storiesCode);
  
  return {
    a11y: {
      violations: a11yResult.violations,
      issues: a11yResult.issues,
      passed: a11yResult.violations === 0,
    },
    lint: {
      errors: lintResult.errors,
      warnings: lintResult.warnings,
      issues: lintResult.issues,
      passed: lintResult.errors === 0,
    },
    bundle,
    tests,
    acl,
    synthetic,
  };
}

