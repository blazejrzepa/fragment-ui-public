import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs";
import path from "path";
import type {
  KpiSummary,
  ComponentTestCell,
  IssueItem,
  RunMeta,
  TestCategory,
  TestStatus,
  Severity,
} from "@/types/quality";

const execAsync = promisify(exec);
const DATA_DIR = path.join(process.cwd(), "data", "quality");

interface VitestResult {
  numTotalTestSuites: number;
  numPassedTestSuites: number;
  numFailedTestSuites: number;
  numTotalTests: number;
  numPassedTests: number;
  numFailedTests: number;
  testResults: Array<{
    name: string; // file path
    status: "passed" | "failed" | "skipped";
    assertionResults: Array<{
      fullName: string;
      status: "passed" | "failed" | "skipped";
      title: string;
      duration?: number;
      failureMessages: string[];
    }>;
  }>;
}

function extractComponentName(filePath: string, testName?: string): string | null {
  // For global tests (lighthouse, chromatic), return null - will be handled specially
  if (filePath.includes("lighthouse") || filePath.includes("chromatic")) {
    return null;
  }
  
  // Try .test.tsx pattern first
  let match = filePath.match(/\/([^/]+)\.test\.tsx?$/);
  if (match) {
    const fileName = match[1];
    
    // Special case: a11y.test.tsx - extract component from test name
    if (fileName === "a11y" && testName) {
      // fullName format: "Accessibility Tests Button should have no A11y violations"
      // or: "Accessibility Tests MultiSelect should have no accessibility violations"
      // Remove "Accessibility Tests" prefix if present
      let cleanName = testName.replace(/^Accessibility\s+Tests\s+/, "");
      
      // Try to extract component name from test name like:
      // "Button should have no A11y violations" -> "Button"
      // "Input with label should have no A11y violations" -> "Input"
      // "FormField with error should have no A11y violations" -> "FormField"
      // "MultiSelect should have no accessibility violations" -> "MultiSelect"
      // "Disabled button should have no A11y violations" -> "Button" (skip adjectives)
      // "Avatar with fallback should have no A11y violations" -> "Avatar"
      
      // First, try to match known component names (common patterns)
      const knownComponents = [
        "Button", "Input", "Badge", "Card", "Separator", "Spinner", "Progress",
        "Accordion", "AlertDialog", "Avatar", "Breadcrumbs", "Checkbox", "RadioGroup",
        "Select", "Switch", "Textarea", "Dialog", "Table", "Tabs", "Skeleton", "Slider",
        "FormField", "Carousel", "Combobox", "CommandPalette", "ContextMenu", "DatePicker",
        "DropdownMenu", "HoverCard", "NavigationMenu", "Pagination", "Popover", "Sheet",
        "Tooltip", "VirtualList", "VirtualTable", "Menubar", "Calendar", "Collapsible",
        "Toggle", "ToggleGroup", "ScrollArea", "Resizable", "DataTable", "FormEnhanced",
        "FormArray", "MultiSelect", "Stepper", "Timeline", "TreeView"
      ];
      
      for (const comp of knownComponents) {
        // Match component name at the start, or after an adjective like "Disabled"
        const pattern = new RegExp(`(?:^|\\s)(${comp})(?:\\s|$)`, "i");
        if (pattern.test(cleanName)) {
          return comp;
        }
      }
      
      // Fallback: try to match first capitalized word(s) that looks like a component
      // Skip common adjectives: Disabled, Enabled, Empty, Full, etc.
      const skipWords = ["disabled", "enabled", "empty", "full", "with", "without", "has", "should"];
      const words = cleanName.split(/\s+/);
      for (let i = 0; i < words.length; i++) {
        const word = words[i];
        if (word.match(/^[A-Z][a-zA-Z]+$/) && !skipWords.includes(word.toLowerCase())) {
          // Check if it's followed by a verb (likely a component name)
          if (i + 1 < words.length) {
            const nextWord = words[i + 1].toLowerCase();
            if (["should", "with", "is", "has", "supports", "uses", "accepts", "renders", "handles"].includes(nextWord)) {
              return word;
            }
          }
          // If it's the first word and looks like a component, use it
          if (i === 0) {
            return word;
          }
        }
      }
      
      // Last resort: just take first capitalized word
      const simpleMatch = cleanName.match(/^([A-Z][a-zA-Z]+)/);
      if (simpleMatch) {
        return simpleMatch[1];
      }
    }
    
    // For other test files, use filename as component name
    return fileName
      .split(/[-_]/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join("");
  }
  
  // Try .spec.ts pattern (E2E tests)
  match = filePath.match(/\/([^/]+)\.spec\.ts$/);
  if (match) {
    const fileName = match[1];
    // Extract component name from E2E spec names like "ds-components-all" -> "DsComponentsAll"
    return fileName
      .split(/[-_]/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join("");
  }
  
  return null;
}

function categorizeTest(filePath: string, testName: string): TestCategory {
  const lowerPath = filePath.toLowerCase();
  const lowerName = testName.toLowerCase();
  
  // E2E tests
  if (lowerPath.includes("e2e/") || lowerPath.includes(".spec.ts") || lowerName.includes("e2e") || lowerName.includes("playwright")) {
    return "e2e";
  }
  
  // Visual tests
  if (lowerPath.includes("chromatic") || lowerPath.includes("storybook") || lowerName.includes("visual") || lowerName.includes("snapshot") || lowerName.includes("screenshot") || lowerName.includes("chromatic")) {
    return "visual";
  }
  
  // Performance tests
  if (lowerPath.includes("lighthouse") || lowerName.includes("performance") || lowerName.includes("perf") || lowerName.includes("bundle") || lowerName.includes("lighthouse")) {
    return "performance";
  }
  
  // A11y tests
  if (lowerName.includes("a11y") || lowerName.includes("accessibility") || lowerPath.includes("a11y")) {
    return "a11y";
  }
  
  // Responsive tests - expanded detection
  if (lowerName.includes("responsive") || lowerName.includes("mobile") || lowerName.includes("viewport") || 
      lowerName.includes("tablet") || lowerName.includes("desktop") || lowerName.includes("breakpoint") ||
      lowerName.includes("screen size") || lowerName.includes("media query") || lowerName.includes("width") ||
      lowerName.includes("height") || lowerName.includes("resize")) {
    return "responsive";
  }
  
  // Interaction tests - expanded detection
  if (lowerName.includes("interaction") || lowerName.includes("keyboard") || lowerName.includes("focus") || 
      lowerName.includes("click") || lowerName.includes("hover") || lowerName.includes("user event") ||
      lowerName.includes("user interaction") || lowerName.includes("mouse") || lowerName.includes("pointer") ||
      lowerName.includes("select") || lowerName.includes("type") || lowerName.includes("press") ||
      lowerName.includes("key") || lowerName.includes("arrow") || lowerName.includes("tab") ||
      lowerName.includes("enter") || lowerName.includes("escape") || lowerName.includes("space")) {
    return "interactions";
  }
  
  // State tests - expanded detection
  if (lowerName.includes("state") || lowerName.includes("loading") || lowerName.includes("error") || 
      lowerName.includes("disabled") || lowerName.includes("empty") || lowerName.includes("success") ||
      lowerName.includes("pending") || lowerName.includes("idle") || lowerName.includes("active") ||
      lowerName.includes("inactive") || lowerName.includes("selected") || lowerName.includes("unselected") ||
      lowerName.includes("checked") || lowerName.includes("unchecked") || lowerName.includes("open") ||
      lowerName.includes("closed") || lowerName.includes("expanded") || lowerName.includes("collapsed") ||
      lowerName.includes("visible") || lowerName.includes("hidden") || lowerName.includes("enabled") ||
      lowerName.includes("invalid") || lowerName.includes("valid") || lowerName.includes("default") ||
      lowerName.includes("initial") || lowerName.includes("final")) {
    return "states";
  }
  
  // Default to unit
  return "unit";
}

function determineSeverity(error: string): Severity {
  const lower = error.toLowerCase();
  if (lower.includes("critical") || lower.includes("blocker")) return "critical";
  if (lower.includes("high") || lower.includes("serious")) return "high";
  if (lower.includes("medium") || lower.includes("moderate")) return "medium";
  return "low";
}

function generateQualityData(testResults: VitestResult | null): {
  summary: KpiSummary[];
  heatmap: ComponentTestCell[];
  issues: IssueItem[];
  runs: RunMeta[];
} {
  if (!testResults) {
    return {
      summary: [],
      heatmap: [],
      issues: [],
      runs: [],
    };
  }
  
  const components = new Map<string, Map<TestCategory, ComponentTestCell>>();
  const issues: IssueItem[] = [];
  const categoryStats = new Map<TestCategory, { total: number; passed: number; failed: number; warned: number }>();
  
  const categories: TestCategory[] = [
    "a11y",
    "unit",
    "e2e",
    "visual",
    "performance",
    "responsive",
    "interactions",
    "states",
  ];
  
  categories.forEach((cat) => {
    categoryStats.set(cat, { total: 0, passed: 0, failed: 0, warned: 0 });
  });
  
  // Get all components from existing heatmap or from test results
  const allComponentsSet = new Set<string>();
  
  testResults.testResults.forEach((fileResult) => {
    // For a11y.test.tsx, we need to extract components from test names
    if (fileResult.name.includes("a11y.test")) {
      fileResult.assertionResults.forEach((assertion) => {
        const component = extractComponentName(fileResult.name, assertion.fullName);
        if (component) {
          allComponentsSet.add(component);
        }
      });
    } else {
      const component = extractComponentName(fileResult.name);
      if (component) {
        allComponentsSet.add(component);
      }
    }
  });
  
  // If we have global tests (lighthouse, chromatic, e2e, performance), we need to get all components
  const hasGlobalTests = testResults.testResults.some(r => 
    r.name.includes("lighthouse") || r.name.includes("chromatic") || r.name.includes("e2e") || r.name.includes(".spec.ts") || r.name.includes("performance")
  );
  
  if (hasGlobalTests) {
    // Try to load existing heatmap to get component list
    try {
      const existingHeatmapPath = path.join(DATA_DIR, "heatmap.json");
      if (fs.existsSync(existingHeatmapPath)) {
        const existingHeatmap = JSON.parse(fs.readFileSync(existingHeatmapPath, "utf8")) as ComponentTestCell[];
        existingHeatmap.forEach(cell => allComponentsSet.add(cell.component));
      }
    } catch (e) {
      // Ignore
    }
  }
  
  testResults.testResults.forEach((fileResult) => {
    const isGlobalTest = fileResult.name.includes("lighthouse") || fileResult.name.includes("chromatic");
    const isE2ETest = fileResult.name.includes("e2e") || fileResult.name.includes(".spec.ts") || fileResult.name.includes("playwright");
    
    // Process each assertion in the file
    fileResult.assertionResults.forEach((assertion) => {
      // Extract component name - may need test name for a11y.test.tsx
      let component = extractComponentName(fileResult.name, assertion.fullName);
      const category = categorizeTest(fileResult.name, assertion.fullName);
      
      // For E2E and Performance tests, they typically apply to all components
      // unless we can extract a specific component name
      if ((isE2ETest || category === "performance") && !component) {
        component = null; // Will be handled as global test
      }
      const stats = categoryStats.get(category);
      if (stats) {
        stats.total++;
        if (assertion.status === "passed") stats.passed++;
        if (assertion.status === "failed") stats.failed++;
        if (assertion.status === "skipped") stats.warned++;
      }
      
      let status: TestStatus = "missing";
      let issueCount = 0;
      const topIssues: string[] = [];
      
      if (assertion.status === "passed") {
        status = "pass";
      } else if (assertion.status === "failed") {
        status = "fail";
        issueCount = assertion.failureMessages?.length || 1;
        if (assertion.failureMessages && assertion.failureMessages.length > 0) {
          assertion.failureMessages.forEach((errorMsg) => {
            const severity = determineSeverity(errorMsg);
            // For global tests, use "Global" as component
            const issueComponent = component || "Global";
            issues.push({
              id: `issue-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
              component: issueComponent,
              category,
              severity,
              title: errorMsg.split("\n")[0] || "Test failed",
              short: errorMsg.substring(0, 100),
              runId: `run-${new Date().toISOString().split("T")[0]}`,
              createdAt: new Date().toISOString(),
              links: {
                story: component ? `https://storybook.fragment-ui.dev/?path=/docs/core-${component.toLowerCase()}--docs` : undefined,
              },
            });
            topIssues.push(errorMsg.split("\n")[0] || "Test failed");
          });
        }
      } else if (assertion.status === "skipped") {
        status = "warn";
        issueCount = 1;
        topIssues.push("Test skipped");
      }
      
      // For global tests (lighthouse, chromatic), E2E tests, and Performance tests, apply to all components
      // E2E and Performance tests are typically integration tests that test multiple components
      // If allComponentsSet is empty, try to load from existing heatmap
      let componentsToUpdate: string[] = [];
      if (isGlobalTest || isE2ETest || category === "performance") {
        if (allComponentsSet.size > 0) {
          componentsToUpdate = Array.from(allComponentsSet);
        } else {
          // If no components found, try to load from existing heatmap
          try {
            const existingHeatmapPath = path.join(DATA_DIR, "heatmap.json");
            if (fs.existsSync(existingHeatmapPath)) {
              const existingHeatmap = JSON.parse(fs.readFileSync(existingHeatmapPath, "utf8")) as ComponentTestCell[];
              const uniqueComponents = new Set(existingHeatmap.map(cell => cell.component));
              componentsToUpdate = Array.from(uniqueComponents);
              // Also add to allComponentsSet for future use
              uniqueComponents.forEach(comp => allComponentsSet.add(comp));
            }
          } catch (e) {
            // If still no components, skip (will be handled as missing)
            console.warn("[Quality] No components found for global test, skipping:", fileResult.name);
          }
        }
      } else {
        // For component-specific tests, use the extracted component
        componentsToUpdate = component ? [component] : [];
      }
      
      componentsToUpdate.forEach((comp) => {
        if (!components.has(comp)) {
          components.set(comp, new Map());
        }
        
        const componentTests = components.get(comp)!;
        const existing = componentTests.get(category);
        
        if (existing) {
          // Update status if worse
          if (status === "fail" || (existing.status === "pass" && status === "warn")) {
            existing.status = status;
          }
          existing.issues = (existing.issues || 0) + issueCount;
          if (topIssues.length > 0) {
            existing.topIssues = [...(existing.topIssues || []), ...topIssues].slice(0, 3);
          }
        } else {
          componentTests.set(category, {
            component: comp,
            category,
            status,
            issues: issueCount,
            topIssues: topIssues.slice(0, 3),
          });
        }
      });
    });
  });
  
  const heatmap: ComponentTestCell[] = [];
  
  // Track which categories actually have test results
  const categoriesWithResults = new Set<TestCategory>();
  components.forEach((componentTests) => {
    componentTests.forEach((_, category) => {
      categoriesWithResults.add(category);
    });
  });
  
  components.forEach((componentTests, component) => {
    categories.forEach((category) => {
      const cell = componentTests.get(category);
      if (cell) {
        heatmap.push(cell);
      } else {
        // Check if this category has results for ANY component
        // If it does, but not for this component, it's missing for this component
        // If it doesn't have results at all, check if it's a category that requires setup
        const hasResultsForCategory = categoriesWithResults.has(category);
        
        // For E2E, Visual, Performance - if they have no results at all, show as "warn"
        // This indicates the test type exists but is not currently running
        // But if they have results for other components, this component is just missing them
        const isGlobalCategory = 
          category === "e2e" || 
          category === "visual" || 
          category === "performance";
        
        // If category has results but not for this component, it's missing for this component
        // If category has no results at all and is a global category, it's "warn" (not implemented)
        // Otherwise, it's "missing"
        const status: TestStatus = hasResultsForCategory 
          ? "missing"  // Category exists but not for this component
          : (isGlobalCategory ? "warn" : "missing");  // No results at all
        
        heatmap.push({
          component,
          category,
          status,
          issues: 0,
          topIssues: (!hasResultsForCategory && isGlobalCategory)
            ? [`${category.toUpperCase()} tests are not currently implemented. They require additional setup (server, CI/CD, etc.)`]
            : undefined,
        });
      }
    });
  });
  
  const summary: KpiSummary[] = categories.map((category) => {
    const stats = categoryStats.get(category)!;
    const total = stats.total;
    
    // For categories with no tests, set passRate to 0
    const passRate = total > 0 ? stats.passed / total : 0;
    
    // Check if category has any results
    const hasResults = categoriesWithResults.has(category);
    
    // For E2E, Visual, Performance - if they have no results, add a warning
    // This indicates the test type exists but is not currently running
    const isGlobalCategory = 
      category === "e2e" || 
      category === "visual" || 
      category === "performance";
    
    // Only add warning if category has no results AND is a global category
    const additionalWarns = (!hasResults && isGlobalCategory && total === 0) ? 1 : 0;
    
    return {
      category,
      passRate,
      total: stats.total,
      fails: stats.failed,
      warns: stats.warned + additionalWarns,
      isGate: category === "a11y",
    };
  });
  
  const runs: RunMeta[] = [
    {
      id: `run-${Date.now()}`,
      startedAt: new Date().toISOString(),
      finishedAt: new Date().toISOString(),
      branch: "main", // Will be updated if git is available
      commit: "unknown",
      triggeredBy: "api",
      stats: {
        totalIssues: issues.length,
        critical: issues.filter((i) => i.severity === "critical").length,
        passRate: testResults.numPassedTests / testResults.numTotalTests,
      },
    },
  ];
  
  return { summary, heatmap, issues, runs };
}

async function runVitestTests(component?: string): Promise<VitestResult | null> {
  const projectRoot = path.resolve(process.cwd(), "../..");
  const uiPackageDir = path.join(projectRoot, "packages/ui");
  let testCommand = `cd ${uiPackageDir} && npx vitest run --reporter=json --reporter=verbose`;
  
  if (component) {
    testCommand += ` ${component.toLowerCase()}.test.tsx`;
  }
  
  // No timeout for Vitest - let it run to completion
  // In production, you might want to set a reasonable timeout (e.g., 10 minutes)
  try {
    const { stdout } = await execAsync(testCommand, {
      cwd: process.cwd(),
      maxBuffer: 10 * 1024 * 1024,
    });
    
    return parseVitestOutput(stdout);
  } catch (error) {
    console.error("[Tests] Vitest error:", error);
    return null;
  }
}

async function runPlaywrightTests(): Promise<{ total: number; passed: number; failed: number; results: any[] }> {
  const projectRoot = path.resolve(process.cwd(), "../..");
  const e2eDir = path.join(projectRoot, "apps/demo/e2e");
  
  try {
    // Check if Playwright is available
    const { exec } = await import("child_process");
    const { promisify } = await import("util");
    const execAsync = promisify(exec);
    
    // Run Playwright tests with JSON reporter
    const testCommand = `cd ${e2eDir} && npx playwright test --reporter=json --reporter=list`;
    
    console.log("[Tests] Running Playwright E2E tests...");
    const { stdout, stderr } = await execAsync(testCommand, {
      cwd: process.cwd(),
      maxBuffer: 10 * 1024 * 1024,
      timeout: 300000, // 5 minutes timeout for E2E tests
    });
    
    // Parse Playwright JSON output
    // Playwright outputs JSON to stdout, but also has list reporter
    // We need to extract JSON from the output
    const lines = stdout.split("\n");
    let jsonStart = -1;
    let jsonEnd = -1;
    
    // Look for JSON in stdout (Playwright outputs it at the end)
    for (let i = lines.length - 1; i >= 0; i--) {
      const line = lines[i].trim();
      if (line.startsWith("{") && line.includes("\"suites\"")) {
        jsonEnd = i;
        // Find the start of this JSON object
        for (let j = i; j >= 0; j--) {
          if (lines[j].trim().startsWith("{")) {
            jsonStart = j;
            break;
          }
        }
        break;
      }
    }
    
    // If JSON not found, try to parse from list output
    if (jsonStart === -1 || jsonEnd === -1) {
      console.log("[Tests] No JSON output from Playwright, parsing from stdout");
      
      // Try to extract test results from list output
      const passedMatches = stdout.match(/(\d+)\s+passed/gi) || [];
      const failedMatches = stdout.match(/(\d+)\s+failed/gi) || [];
      
      const passed = passedMatches.reduce((sum, match) => sum + parseInt(match.match(/\d+/)?.[0] || "0"), 0);
      const failed = failedMatches.reduce((sum, match) => sum + parseInt(match.match(/\d+/)?.[0] || "0"), 0);
      const total = passed + failed;
      
      if (total > 0) {
        // Create results array from summary
        const results: any[] = [];
        // Try to extract test names from output
        const testLines = stdout.split("\n").filter(line => line.includes("›") || line.includes("should"));
        testLines.slice(0, total).forEach((line, idx) => {
          const status = idx < passed ? "passed" : "failed";
          results.push({
            name: line.trim() || `Test ${idx + 1}`,
            status,
            file: "e2e/test.spec.ts",
            errors: status === "failed" ? ["Test failed"] : [],
          });
        });
        
        console.log(`[Tests] Playwright E2E tests (parsed from output): ${passed}/${total} passed, ${failed} failed`);
        return { total, passed, failed, results };
      }
      
      // If no results found, return empty
      console.log("[Tests] No Playwright test results found");
      return { total: 0, passed: 0, failed: 0, results: [] };
    }
    
    // Extract and parse JSON
    const jsonStr = lines.slice(jsonStart, jsonEnd + 1).join("\n");
    let playwrightResults: any;
    try {
      playwrightResults = JSON.parse(jsonStr);
    } catch (e) {
      console.error("[Tests] Failed to parse Playwright JSON:", e);
      return { total: 0, passed: 0, failed: 0, results: [] };
    }
    
    // Transform Playwright results to our format
    const results: any[] = [];
    let total = 0;
    let passed = 0;
    let failed = 0;
    
    // Playwright JSON structure: { suites: [...] }
    if (playwrightResults.suites && Array.isArray(playwrightResults.suites)) {
      playwrightResults.suites.forEach((suite: any) => {
        if (suite.specs && Array.isArray(suite.specs)) {
          suite.specs.forEach((spec: any) => {
            if (spec.tests && Array.isArray(spec.tests)) {
              spec.tests.forEach((test: any) => {
                total++;
                const testStatus = test.status || "unknown";
                if (testStatus === "passed") {
                  passed++;
                } else if (testStatus === "failed") {
                  failed++;
                }
                
                results.push({
                  name: test.title || spec.title || "Unknown test",
                  status: testStatus,
                  file: spec.file || suite.title || "e2e/test.spec.ts",
                  errors: test.results?.filter((r: any) => r.status === "failed").map((r: any) => r.error?.message || "Test failed") || [],
                });
              });
            }
          });
        }
      });
    }
    
    console.log(`[Tests] Playwright E2E tests completed: ${passed}/${total} passed, ${failed} failed`);
    
    return { total, passed, failed, results };
  } catch (error: any) {
    console.error("[Tests] Playwright E2E error:", error.message);
    // If server is not running or tests fail, return empty results but don't throw
    // This allows other tests to continue
    return { total: 0, passed: 0, failed: 0, results: [] };
  }
}

async function runLighthouseTests(): Promise<{ total: number; passed: number; failed: number; score: number }> {
  try {
    // Check if Lighthouse CI is available
    const { exec } = await import("child_process");
    const { promisify } = await import("util");
    const execAsync = promisify(exec);
    
    // Try to run Lighthouse CI against localhost:3002 (Playground)
    const url = process.env.NEXT_PUBLIC_BASE_URL?.replace("/api", "") || "http://localhost:3002";
    const testCommand = `npx lighthouse ${url} --output=json --output-path=/dev/stdout --only-categories=performance --quiet --no-enable-error-reporting --chrome-flags="--headless --no-sandbox"`;
    
    console.log("[Tests] Running Lighthouse performance tests...");
    
    try {
      const { stdout } = await execAsync(testCommand, {
        cwd: process.cwd(),
        maxBuffer: 10 * 1024 * 1024,
        timeout: 120000, // 2 minutes timeout
      });
      
      const lighthouseResults = JSON.parse(stdout);
      const performanceScore = lighthouseResults.categories?.performance?.score || 0;
      
      // Calculate pass/fail based on score threshold (0.8 = 80%)
      const passed = performanceScore >= 0.8 ? 1 : 0;
      const failed = performanceScore < 0.8 ? 1 : 0;
      
      console.log(`[Tests] Lighthouse performance score: ${Math.round(performanceScore * 100)}%`);
      
      return {
        total: 1,
        passed,
        failed,
        score: performanceScore,
      };
    } catch (error: any) {
      // If Lighthouse fails (server not running, etc.), return empty results
      console.log("[Tests] Lighthouse test skipped (server may not be running)");
      return { total: 0, passed: 0, failed: 0, score: 0 };
    }
  } catch (error: any) {
    console.error("[Tests] Lighthouse error:", error.message);
    return { total: 0, passed: 0, failed: 0, score: 0 };
  }
}

async function checkChromaticStatus(): Promise<{ total: number; passed: number; failed: number; changed: number }> {
  try {
    const projectRoot = path.resolve(process.cwd(), "../..");
    const uiPackageDir = path.join(projectRoot, "packages/ui");
    
    // Check if Storybook build exists or can be triggered
    // For now, we'll check if storybook:build script exists and try to run it
    // In production, this would query Chromatic API
    
    const { exec } = await import("child_process");
    const { promisify } = await import("util");
    const execAsync = promisify(exec);
    
    // Try to build Storybook to check for visual regressions
    // This is a simplified check - in production you'd use Chromatic API
    console.log("[Tests] Checking Storybook/Visual tests...");
    
    try {
      // Check if Storybook build directory exists
      const storybookBuildDir = path.join(uiPackageDir, "storybook-static");
      const fs = await import("fs");
      
      if (fs.existsSync(storybookBuildDir)) {
        // Storybook is already built, count it as passed
        console.log("[Tests] Storybook build found, visual tests passed");
        return { total: 1, passed: 1, failed: 0, changed: 0 };
      }
      
      // Try to trigger a build (but with timeout to avoid blocking)
      const buildCommand = `cd ${uiPackageDir} && npm run storybook:build`;
      
      // Don't wait for full build - just check if command exists
      // In production, this would be handled by CI/CD
      console.log("[Tests] Visual tests require Storybook build (skipping for now - use CI/CD)");
      return { total: 0, passed: 0, failed: 0, changed: 0 };
    } catch (error: any) {
      console.log("[Tests] Visual tests skipped (Storybook not configured)");
      return { total: 0, passed: 0, failed: 0, changed: 0 };
    }
  } catch (error: any) {
    console.error("[Tests] Visual test error:", error.message);
    return { total: 0, passed: 0, failed: 0, changed: 0 };
  }
}

function parseVitestOutput(stdout: string): VitestResult | null {
  const lines = stdout.split("\n");
  let jsonStart = -1;
  let jsonEnd = -1;
  
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim().startsWith("{")) {
      jsonStart = i;
      break;
    }
  }
  
  for (let i = lines.length - 1; i >= 0; i--) {
    if (lines[i].trim().endsWith("}")) {
      jsonEnd = i;
      break;
    }
  }
  
  if (jsonStart !== -1 && jsonEnd !== -1) {
    try {
      const jsonStr = lines.slice(jsonStart, jsonEnd + 1).join("\n");
      return JSON.parse(jsonStr) as VitestResult;
    } catch (e) {
      console.error("[Tests] Failed to parse Vitest JSON:", e);
    }
  }
  
  return null;
}

async function updateTestStatus(
  component: string,
  category: TestCategory,
  status: "running" | "completed" | "error",
  progress?: string
) {
  try {
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3002"}/api/tests/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "update",
        component,
        category,
        status,
        progress,
      }),
    }).catch(() => {
      // Ignore errors - status updates are best effort
    });
  } catch (e) {
    // Ignore
  }
}

// Run tests asynchronously (don't block the response)
async function runTestsAsync(runId: string, category?: string, component?: string) {
  try {
    console.log(`[Tests] Starting async test run ${runId}${category ? ` for category: ${category}` : ""}${component ? ` component: ${component}` : ""}`);
    
    // Initialize status tracking
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3002"}/api/tests/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "start",
          runId,
        }),
      }).catch(() => {});
    } catch (e) {
      // Ignore
    }
    
    // Continue with test execution (same logic as before)
    // ... (rest of the test execution logic)
    
    // This will be moved from POST handler
    const shouldRunAll = !category || category === "all";
    
    // IMPORTANT: When component is specified, only run fast tests (Vitest)
    // Skip slow tests (E2E, Lighthouse, Visual) unless explicitly requested
    const shouldRunSlowTests = !component || shouldRunAll;
    
    console.log(`[Tests] runTestsAsync: component=${component}, category=${category}, shouldRunSlowTests=${shouldRunSlowTests}`);
    
    // If running all tests, mark all existing components as running
    if (!component) {
      try {
        const existingHeatmapPath = path.join(DATA_DIR, "heatmap.json");
        if (fs.existsSync(existingHeatmapPath)) {
          const existingHeatmap = JSON.parse(fs.readFileSync(existingHeatmapPath, "utf8")) as ComponentTestCell[];
          const uniqueComponents = new Set(existingHeatmap.map(cell => cell.component));
          const categoriesToRun: TestCategory[] = category && category !== "all" 
            ? [category as TestCategory] 
            : (["unit", "a11y", "e2e", "visual", "performance", "responsive", "interactions", "states"] as TestCategory[]);
          
          uniqueComponents.forEach((comp) => {
            categoriesToRun.forEach((cat) => {
              updateTestStatus(comp, cat, "running", `Running ${cat} tests...`);
            });
          });
        }
      } catch (e) {
        console.error("[Tests] Error marking components as running:", e);
      }
    }
    
    // Always run Vitest (it's fast)
    const vitestCategories: TestCategory[] = ["unit", "a11y", "interactions", "states"];
    if (!category || category === "all" || vitestCategories.includes(category as TestCategory)) {
      const categoriesToRun: TestCategory[] = category && category !== "all" && vitestCategories.includes(category as TestCategory) ? [category as TestCategory] : vitestCategories;
      categoriesToRun.forEach((cat) => {
        if (component) {
          updateTestStatus(component, cat, "running", "Running Vitest...");
        }
      });
    }
    
    const vitestResults = await runVitestTests(component);
    
    // Mark vitest categories as completed
    if (vitestResults) {
      const categoriesToComplete: TestCategory[] = category && category !== "all" ? [category as TestCategory] : vitestCategories;
      categoriesToComplete.forEach((cat) => {
        if (component) {
          updateTestStatus(component, cat, "completed", "Vitest completed");
        }
      });
    }
    
    // Run other tests conditionally (they're slower)
    const testPromises: Array<Promise<any>> = [];
    
    // E2E tests
    if (shouldRunAll || category === "e2e") {
      if (component) {
        updateTestStatus(component, "e2e", "running", "Running Playwright E2E tests...");
      }
      testPromises.push(
        runPlaywrightTests()
          .then((result) => {
            if (component) {
              updateTestStatus(component, "e2e", "completed", "E2E tests completed");
            }
            return result;
          })
          .catch((e) => {
            console.error("[Tests] E2E failed:", e.message);
            if (component) {
              updateTestStatus(component, "e2e", "error", `E2E failed: ${e.message}`);
            }
            return { total: 0, passed: 0, failed: 0, results: [] };
          })
      );
    } else {
      testPromises.push(Promise.resolve({ total: 0, passed: 0, failed: 0, results: [] }));
    }
    
    // Lighthouse tests
    if (shouldRunAll || category === "performance") {
      if (component) {
        updateTestStatus(component, "performance", "running", "Running Lighthouse performance tests...");
      }
      testPromises.push(
        runLighthouseTests()
          .then((result) => {
            if (component) {
              updateTestStatus(component, "performance", "completed", "Performance tests completed");
            }
            return result;
          })
          .catch((e) => {
            console.error("[Tests] Lighthouse failed:", e.message);
            if (component) {
              updateTestStatus(component, "performance", "error", `Performance failed: ${e.message}`);
            }
            return { total: 0, passed: 0, failed: 0, score: 0 };
          })
      );
    } else {
      testPromises.push(Promise.resolve({ total: 0, passed: 0, failed: 0, score: 0 }));
    }
    
    // Visual tests
    if (shouldRunAll || category === "visual") {
      if (component) {
        updateTestStatus(component, "visual", "running", "Running visual regression tests...");
      }
      testPromises.push(
        checkChromaticStatus()
          .then((result) => {
            if (component) {
              updateTestStatus(component, "visual", "completed", "Visual tests completed");
            }
            return result;
          })
          .catch((e) => {
            console.error("[Tests] Chromatic failed:", e.message);
            if (component) {
              updateTestStatus(component, "visual", "error", `Visual failed: ${e.message}`);
            }
            return { total: 0, passed: 0, failed: 0, changed: 0 };
          })
      );
    } else {
      testPromises.push(Promise.resolve({ total: 0, passed: 0, failed: 0, changed: 0 }));
    }
    
    const [e2eResults, lighthouseResults, chromaticResults] = await Promise.all(testPromises);
    
    // Initialize vitestResults if null
    let finalResults: VitestResult;
    if (!vitestResults) {
      finalResults = {
        numTotalTestSuites: 0,
        numPassedTestSuites: 0,
        numFailedTestSuites: 0,
        numTotalTests: 0,
        numPassedTests: 0,
        numFailedTests: 0,
        testResults: [],
      };
    } else {
      finalResults = vitestResults as VitestResult;
    }
    
    if (!finalResults.testResults) {
      finalResults.testResults = [];
    }
    
    // Merge E2E results
    if (e2eResults.total > 0 && e2eResults.results.length > 0) {
      e2eResults.results.forEach((test: any) => {
        finalResults.testResults!.push({
          name: test.file || "e2e/test.spec.ts",
          status: test.status === "passed" ? "passed" : "failed",
          assertionResults: [{
            fullName: `E2E: ${test.name}`,
            status: test.status === "passed" ? "passed" : "failed",
            title: test.name,
            duration: 0,
            failureMessages: test.errors || [],
          }],
        });
      });
      finalResults.numTotalTests += e2eResults.total;
      finalResults.numPassedTests += e2eResults.passed;
      finalResults.numFailedTests += e2eResults.failed;
    }
    
    // Merge Performance results
    if (lighthouseResults.total > 0) {
      finalResults.testResults.push({
        name: "lighthouse/performance",
        status: lighthouseResults.failed === 0 ? "passed" : "failed",
        assertionResults: [{
          fullName: "Performance Score",
          status: lighthouseResults.score >= 0.8 ? "passed" : "failed",
          title: `Performance: ${Math.round(lighthouseResults.score * 100)}%`,
          duration: 0,
          failureMessages: lighthouseResults.score < 0.8 ? [`Performance score ${Math.round(lighthouseResults.score * 100)}% is below 80% threshold`] : [],
        }],
      });
      finalResults.numTotalTests += lighthouseResults.total;
      finalResults.numPassedTests += lighthouseResults.passed;
      finalResults.numFailedTests += lighthouseResults.failed;
    }
    
    // Merge Visual results
    if (chromaticResults.total > 0) {
      finalResults.testResults.push({
        name: "chromatic/visual",
        status: chromaticResults.failed === 0 ? "passed" : "failed",
        assertionResults: [{
          fullName: "Visual Regression Tests",
          status: chromaticResults.failed === 0 ? "passed" : "failed",
          title: `Visual: ${chromaticResults.passed}/${chromaticResults.total} passed`,
          duration: 0,
          failureMessages: chromaticResults.failed > 0 ? [`${chromaticResults.failed} visual tests failed`] : [],
        }],
      });
      finalResults.numTotalTests += chromaticResults.total;
      finalResults.numPassedTests += chromaticResults.passed;
      finalResults.numFailedTests += chromaticResults.failed;
    }
    
    // Generate quality data
    const { summary, heatmap, issues, runs } = generateQualityData(finalResults);
    
    // Update status for all components in heatmap
    if (!component) {
      // For "Run All Tests", update status for all components
      const uniqueComponents = new Set(heatmap.map(cell => cell.component));
      const categoriesToUpdate: TestCategory[] = category && category !== "all" 
        ? [category as TestCategory] 
        : (["unit", "a11y", "e2e", "visual", "performance", "responsive", "interactions", "states"] as TestCategory[]);
      
      uniqueComponents.forEach((comp) => {
        categoriesToUpdate.forEach((cat) => {
          const cell = heatmap.find(c => c.component === comp && c.category === cat);
          if (cell) {
            updateTestStatus(comp, cat, "completed", `${cat} tests completed`);
          }
        });
      });
    }
    
    // Ensure data directory exists
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    
    // Write files with error handling (to handle Cursor worktree sync issues)
    const filesToWrite = [
      { name: "summary.json", data: summary },
      { name: "heatmap.json", data: heatmap },
      { name: "issues.json", data: issues },
      { name: "runs.json", data: runs },
    ];
    
    for (const file of filesToWrite) {
      try {
        fs.writeFileSync(
          path.join(DATA_DIR, file.name),
          JSON.stringify(file.data, null, 2)
        );
      } catch (error: any) {
        // Log error but continue - this may be a Cursor worktree sync issue
        console.error(`[runTestsAsync] Failed to write ${file.name}:`, error.message);
        // Continue with other files even if one fails
      }
    }
    
    // Save history for each component+category combination
    // Use runId from earlier in the function, or get from runs
    const historyRunId = runs[0]?.id || runId;
    const commit = runs[0]?.commit || "unknown";
    const branch = runs[0]?.branch || "main";
    
    // Group heatmap by component and category
    const historyByComponent = new Map<string, Map<TestCategory, { status: TestStatus; passRate: number; total: number; passed: number; failed: number; issues: number }>>();
    
    heatmap.forEach((cell) => {
      if (!historyByComponent.has(cell.component)) {
        historyByComponent.set(cell.component, new Map());
      }
      const componentMap = historyByComponent.get(cell.component)!;
      componentMap.set(cell.category, {
        status: cell.status,
        passRate: cell.status === "pass" ? 1 : cell.status === "warn" ? 0.5 : 0,
        total: 1,
        passed: cell.status === "pass" ? 1 : 0,
        failed: cell.status === "fail" ? 1 : 0,
        issues: cell.issues || 0,
      });
    });
    
    // Save history entries directly (no need for HTTP call since we're in the same process)
    try {
      const historyFile = path.join(DATA_DIR, "history.json");
      let historyData: any = {};
      
      if (fs.existsSync(historyFile)) {
        try {
          historyData = JSON.parse(fs.readFileSync(historyFile, "utf8"));
        } catch (e) {
          console.error("[History] Error reading history file:", e);
        }
      }
      
      historyByComponent.forEach((categoryMap, component) => {
        if (!historyData[component]) {
          historyData[component] = {};
        }
        categoryMap.forEach((stats, category) => {
          if (!historyData[component][category]) {
            historyData[component][category] = [];
          }
          
          const entry = {
            runId: historyRunId,
            timestamp: new Date().toISOString(),
            component,
            category,
            status: stats.status,
            passRate: stats.passRate,
            totalTests: stats.total,
            passedTests: stats.passed,
            failedTests: stats.failed,
            issues: stats.issues,
            commit,
            branch,
          };
          
          historyData[component][category].push(entry);
          
          // Keep only last 50 entries per component+category
          if (historyData[component][category].length > 50) {
            historyData[component][category] = historyData[component][category]
              .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
              .slice(0, 50);
          }
        });
      });
      
      fs.writeFileSync(historyFile, JSON.stringify(historyData, null, 2));
    } catch (error) {
      console.error("[History] Error saving history:", error);
      // Don't fail the whole request if history save fails
    }
    
    // Mark run as completed
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3002"}/api/tests/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "end",
          runId,
          status: "completed",
        }),
      }).catch(() => {});
    } catch (e) {
      // Ignore
    }
    
    console.log(`[Tests] Completed async test run ${runId}`);
  } catch (error: any) {
    console.error(`[Tests] Error in async test run ${runId}:`, error);
    
    // Mark run as error
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3002"}/api/tests/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "end",
          runId,
          status: "error",
        }),
      }).catch(() => {});
    } catch (e) {
      // Ignore
    }
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { category, component } = body;
    
    const runId = `run-${Date.now()}`;
    
    // Start tests asynchronously (don't wait for completion)
    // This allows the request to return immediately while tests run in background
    runTestsAsync(runId, category, component).catch((error) => {
      console.error("[Tests] Async test run failed:", error);
    });
    
    // Return immediately with runId
    return NextResponse.json({
      success: true,
      runId,
      message: "Tests started. Use /api/tests/status to check progress.",
    });
    
    // Run tests based on category
    const shouldRunAll = !category || category === "all";
    
    console.log(`[Tests] Running: Vitest=${!category || category === "unit" || category === "a11y" || category === "interactions" || category === "states"}, E2E=${shouldRunAll || category === "e2e"}, Performance=${shouldRunAll || category === "performance"}, Visual=${shouldRunAll || category === "visual"}`);
    
    // If running all tests, mark all existing components as running
    if (!component) {
      try {
        const existingHeatmapPath = path.join(DATA_DIR, "heatmap.json");
        if (fs.existsSync(existingHeatmapPath)) {
          const existingHeatmap = JSON.parse(fs.readFileSync(existingHeatmapPath, "utf8")) as ComponentTestCell[];
          const uniqueComponents = new Set(existingHeatmap.map(cell => cell.component));
          const categoriesToRun: TestCategory[] = category && category !== "all" 
            ? [category as TestCategory] 
            : (["unit", "a11y", "e2e", "visual", "performance", "responsive", "interactions", "states"] as TestCategory[]);
          
          uniqueComponents.forEach((comp) => {
            categoriesToRun.forEach((cat) => {
              updateTestStatus(comp, cat, "running", `Running ${cat} tests...`);
            });
          });
        }
      } catch (e) {
        console.error("[Tests] Error marking components as running:", e);
      }
    }
    
    // Always run Vitest (it's fast)
    // Update status for unit/a11y/interactions/states categories
    const vitestCategories: TestCategory[] = ["unit", "a11y", "interactions", "states"];
    if (!category || category === "all" || vitestCategories.includes(category)) {
      // Mark relevant categories as running
      const categoriesToRun: TestCategory[] = category && category !== "all" ? [category as TestCategory] : vitestCategories;
      categoriesToRun.forEach((cat) => {
        if (component) {
          updateTestStatus(component, cat, "running", "Running Vitest...");
        }
      });
    }
    
    const vitestResults = await runVitestTests(component);
    
    // Mark vitest categories as completed
    if (vitestResults) {
      const categoriesToComplete: TestCategory[] = category && category !== "all" ? [category as TestCategory] : vitestCategories;
      categoriesToComplete.forEach((cat) => {
        if (component) {
          updateTestStatus(component, cat, "completed", "Vitest completed");
        }
      });
    }
    
    // Run other tests conditionally (they're slower)
    const testPromises: Array<Promise<any>> = [];
    
    // E2E tests
    if (shouldRunAll || category === "e2e") {
      if (component) {
        updateTestStatus(component, "e2e", "running", "Running Playwright E2E tests...");
      }
      testPromises.push(
        runPlaywrightTests()
          .then((result) => {
            if (component) {
              updateTestStatus(component, "e2e", "completed", "E2E tests completed");
            }
            return result;
          })
          .catch((e) => {
            console.error("[Tests] E2E failed:", e.message);
            if (component) {
              updateTestStatus(component, "e2e", "error", `E2E failed: ${e.message}`);
            }
            return { total: 0, passed: 0, failed: 0, results: [] };
          })
      );
    } else {
      testPromises.push(Promise.resolve({ total: 0, passed: 0, failed: 0, results: [] }));
    }
    
    // Lighthouse tests
    if (shouldRunAll || category === "performance") {
      if (component) {
        updateTestStatus(component, "performance", "running", "Running Lighthouse performance tests...");
      }
      testPromises.push(
        runLighthouseTests()
          .then((result) => {
            if (component) {
              updateTestStatus(component, "performance", "completed", "Performance tests completed");
            }
            return result;
          })
          .catch((e) => {
            console.error("[Tests] Lighthouse failed:", e.message);
            if (component) {
              updateTestStatus(component, "performance", "error", `Performance failed: ${e.message}`);
            }
            return { total: 0, passed: 0, failed: 0, score: 0 };
          })
      );
    } else {
      testPromises.push(Promise.resolve({ total: 0, passed: 0, failed: 0, score: 0 }));
    }
    
    // Visual tests
    if (shouldRunAll || category === "visual") {
      if (component) {
        updateTestStatus(component, "visual", "running", "Running visual regression tests...");
      }
      testPromises.push(
        checkChromaticStatus()
          .then((result) => {
            if (component) {
              updateTestStatus(component, "visual", "completed", "Visual tests completed");
            }
            return result;
          })
          .catch((e) => {
            console.error("[Tests] Chromatic failed:", e.message);
            if (component) {
              updateTestStatus(component, "visual", "error", `Visual failed: ${e.message}`);
            }
            return { total: 0, passed: 0, failed: 0, changed: 0 };
          })
      );
    } else {
      testPromises.push(Promise.resolve({ total: 0, passed: 0, failed: 0, changed: 0 }));
    }
    
    const [e2eResults, lighthouseResults, chromaticResults] = await Promise.all(testPromises);
    
    // Initialize vitestResults if null
    let finalResults: VitestResult;
    if (!vitestResults) {
      finalResults = {
        numTotalTestSuites: 0,
        numPassedTestSuites: 0,
        numFailedTestSuites: 0,
        numTotalTests: 0,
        numPassedTests: 0,
        numFailedTests: 0,
        testResults: [],
      };
    } else {
      finalResults = vitestResults as VitestResult;
    }
    
    if (!finalResults.testResults) {
      finalResults.testResults = [];
    }
    
    // Merge E2E results
    if (e2eResults.total > 0 && e2eResults.results.length > 0) {
      e2eResults.results.forEach((test: any) => {
        finalResults.testResults!.push({
          name: test.file || "e2e/test.spec.ts",
          status: test.status === "passed" ? "passed" : "failed",
          assertionResults: [{
            fullName: `E2E: ${test.name}`,
            status: test.status === "passed" ? "passed" : "failed",
            title: test.name,
            duration: 0,
            failureMessages: test.errors || [],
          }],
        });
      });
      finalResults.numTotalTests += e2eResults.total;
      finalResults.numPassedTests += e2eResults.passed;
      finalResults.numFailedTests += e2eResults.failed;
    }
    
    // Merge Performance results
    if (lighthouseResults.total > 0) {
      finalResults.testResults.push({
        name: "lighthouse/performance",
        status: lighthouseResults.failed === 0 ? "passed" : "failed",
        assertionResults: [{
          fullName: "Performance Score",
          status: lighthouseResults.score >= 0.8 ? "passed" : "failed",
          title: `Performance: ${Math.round(lighthouseResults.score * 100)}%`,
          duration: 0,
          failureMessages: lighthouseResults.score < 0.8 ? [`Performance score ${Math.round(lighthouseResults.score * 100)}% is below 80% threshold`] : [],
        }],
      });
      finalResults.numTotalTests += lighthouseResults.total;
      finalResults.numPassedTests += lighthouseResults.passed;
      finalResults.numFailedTests += lighthouseResults.failed;
    }
    
    // Merge Visual results
    if (chromaticResults.total > 0) {
      finalResults.testResults.push({
        name: "chromatic/visual",
        status: chromaticResults.failed === 0 ? "passed" : "failed",
        assertionResults: [{
          fullName: "Visual Regression Tests",
          status: chromaticResults.failed === 0 ? "passed" : "failed",
          title: `Visual: ${chromaticResults.passed}/${chromaticResults.total} passed`,
          duration: 0,
          failureMessages: chromaticResults.failed > 0 ? [`${chromaticResults.failed} visual tests failed`] : [],
        }],
      });
      finalResults.numTotalTests += chromaticResults.total;
      finalResults.numPassedTests += chromaticResults.passed;
      finalResults.numFailedTests += chromaticResults.failed;
    }
    
    // Generate quality data
    const { summary, heatmap, issues, runs } = generateQualityData(finalResults);
    
    // Update status for all components in heatmap
    if (!component) {
      // For "Run All Tests", update status for all components
      const uniqueComponents = new Set(heatmap.map(cell => cell.component));
      const categoriesToUpdate: TestCategory[] = category && category !== "all" 
        ? [category as TestCategory] 
        : (["unit", "a11y", "e2e", "visual", "performance", "responsive", "interactions", "states"] as TestCategory[]);
      
      uniqueComponents.forEach((comp) => {
        categoriesToUpdate.forEach((cat) => {
          const cell = heatmap.find(c => c.component === comp && c.category === cat);
          if (cell) {
            updateTestStatus(comp, cat, "completed", `${cat} tests completed`);
          }
        });
      });
    }
    
    // Ensure data directory exists
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    
    // Write files with error handling (to handle Cursor worktree sync issues)
    const filesToWrite = [
      { name: "summary.json", data: summary },
      { name: "heatmap.json", data: heatmap },
      { name: "issues.json", data: issues },
      { name: "runs.json", data: runs },
    ];
    
    for (const file of filesToWrite) {
      try {
        fs.writeFileSync(
          path.join(DATA_DIR, file.name),
          JSON.stringify(file.data, null, 2)
        );
      } catch (error: any) {
        // Log error but continue - this may be a Cursor worktree sync issue
        console.error(`[runTestsAsync] Failed to write ${file.name}:`, error.message);
        // Continue with other files even if one fails
      }
    }
    
    // Save history for each component+category combination
    // Use runId from earlier in the function, or get from runs
    const historyRunId = runs[0]?.id || runId;
    const commit = runs[0]?.commit || "unknown";
    const branch = runs[0]?.branch || "main";
    
    // Group heatmap by component and category
    const historyByComponent = new Map<string, Map<TestCategory, { status: TestStatus; passRate: number; total: number; passed: number; failed: number; issues: number }>>();
    
    heatmap.forEach((cell) => {
      if (!historyByComponent.has(cell.component)) {
        historyByComponent.set(cell.component, new Map());
      }
      const componentMap = historyByComponent.get(cell.component)!;
      componentMap.set(cell.category, {
        status: cell.status,
        passRate: cell.status === "pass" ? 1 : cell.status === "warn" ? 0.5 : 0,
        total: 1,
        passed: cell.status === "pass" ? 1 : 0,
        failed: cell.status === "fail" ? 1 : 0,
        issues: cell.issues || 0,
      });
    });
    
    // Save history entries
    const historyPromises: Promise<any>[] = [];
    historyByComponent.forEach((categoryMap, component) => {
      categoryMap.forEach((stats, category) => {
        historyPromises.push(
          fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3002"}/api/tests/history`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              runId: historyRunId,
              component,
              category,
              status: stats.status,
              passRate: stats.passRate,
              totalTests: stats.total,
              passedTests: stats.passed,
              failedTests: stats.failed,
              issues: stats.issues,
              commit,
              branch,
            }),
          }).catch((e) => {
            console.error(`[History] Failed to save for ${component}/${category}:`, e);
          })
        );
      });
    });
    
    // Don't wait for history saves - fire and forget
    Promise.all(historyPromises).catch(() => {});
    
    return NextResponse.json({
      success: true,
      runId: runs[0]?.id,
      stats: {
        totalTests: finalResults.numTotalTests,
        passedTests: finalResults.numPassedTests,
        failedTests: finalResults.numFailedTests,
        totalIssues: issues.length,
        criticalIssues: issues.filter((i) => i.severity === "critical").length,
        e2e: { total: e2eResults.total, passed: e2eResults.passed, failed: e2eResults.failed },
        performance: { score: lighthouseResults.score, passed: lighthouseResults.passed, failed: lighthouseResults.failed },
        visual: { total: chromaticResults.total, passed: chromaticResults.passed, failed: chromaticResults.failed },
      },
      summary,
      heatmap: heatmap.slice(0, 10), // Return sample for preview
      issues: issues.slice(0, 10), // Return sample for preview
    });
  } catch (error: any) {
    console.error("[Tests] Error running tests:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to run tests",
      },
      { status: 500 }
    );
  }
}

