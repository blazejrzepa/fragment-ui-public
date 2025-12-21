#!/usr/bin/env tsx
/**
 * Script to collect real test results and update quality dashboard data
 * 
 * Usage:
 *   pnpm tsx apps/demo/scripts/collect-test-results.ts
 * 
 * This script:
 * 1. Runs vitest tests with JSON reporter
 * 2. Parses test results
 * 3. Updates apps/demo/data/quality/*.json files
 */

import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import type {
  KpiSummary,
  ComponentTestCell,
  IssueItem,
  RunMeta,
  TestCategory,
  TestStatus,
  Severity,
} from "../src/types/quality";

const DATA_DIR = path.join(process.cwd(), "apps/demo/data/quality");
const UI_PACKAGE_DIR = path.join(process.cwd(), "packages/ui");

interface VitestResult {
  numTotalTestSuites: number;
  numPassedTestSuites: number;
  numFailedTestSuites: number;
  numTotalTests: number;
  numPassedTests: number;
  numFailedTests: number;
  testResults: Array<{
    file: string;
    name: string;
    status: "passed" | "failed" | "skipped";
    duration?: number;
    errors?: Array<{
      message: string;
      stack?: string;
    }>;
  }>;
}

function extractComponentName(filePath: string): string | null {
  // Extract component name from file path like:
  // packages/ui/src/button.test.tsx -> Button
  // packages/ui/src/alert.test.tsx -> Alert
  const match = filePath.match(/\/([^/]+)\.test\.tsx?$/);
  if (!match) return null;
  
  const fileName = match[1];
  // Convert kebab-case or snake_case to PascalCase
  return fileName
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

function categorizeTest(filePath: string, testName: string): TestCategory {
  const lowerPath = filePath.toLowerCase();
  const lowerName = testName.toLowerCase();
  
  // A11y tests
  if (lowerName.includes("a11y") || lowerName.includes("accessibility") || lowerPath.includes("a11y")) {
    return "a11y";
  }
  
  // E2E tests
  if (lowerName.includes("e2e") || lowerName.includes("integration") || lowerPath.includes("e2e")) {
    return "e2e";
  }
  
  // Visual tests
  if (lowerName.includes("visual") || lowerName.includes("snapshot") || lowerName.includes("screenshot")) {
    return "visual";
  }
  
  // Performance tests
  if (lowerName.includes("performance") || lowerName.includes("perf") || lowerName.includes("bundle")) {
    return "performance";
  }
  
  // Responsive tests
  if (lowerName.includes("responsive") || lowerName.includes("mobile") || lowerName.includes("viewport")) {
    return "responsive";
  }
  
  // Interaction tests
  if (lowerName.includes("interaction") || lowerName.includes("keyboard") || lowerName.includes("focus")) {
    return "interactions";
  }
  
  // State tests
  if (lowerName.includes("state") || lowerName.includes("loading") || lowerName.includes("error") || lowerName.includes("disabled")) {
    return "states";
  }
  
  // Default to unit tests
  return "unit";
}

function determineSeverity(error: string): Severity {
  const lower = error.toLowerCase();
  if (lower.includes("critical") || lower.includes("blocker")) return "critical";
  if (lower.includes("high") || lower.includes("serious")) return "high";
  if (lower.includes("medium") || lower.includes("moderate")) return "medium";
  return "low";
}

async function collectTestResults(): Promise<VitestResult | null> {
  try {
    console.log("Running vitest tests...");
    
    // Run vitest with JSON reporter
    const output = execSync(
      "pnpm --filter @fragment_ui/ui test --reporter=json --reporter=verbose",
      {
        cwd: process.cwd(),
        encoding: "utf-8",
        stdio: ["pipe", "pipe", "pipe"],
      }
    );
    
    // Try to parse JSON from output
    // Vitest JSON reporter outputs to stdout, but might be mixed with other output
    const lines = output.split("\n");
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
    
    if (jsonStart === -1 || jsonEnd === -1) {
      console.warn("Could not find JSON in vitest output, using fallback");
      return null;
    }
    
    const jsonStr = lines.slice(jsonStart, jsonEnd + 1).join("\n");
    return JSON.parse(jsonStr);
  } catch (error: any) {
    console.error("Error running tests:", error.message);
    return null;
  }
}

function generateQualityData(testResults: VitestResult | null): {
  summary: KpiSummary[];
  heatmap: ComponentTestCell[];
  issues: IssueItem[];
  runs: RunMeta[];
} {
  // If no test results, return empty data structure
  if (!testResults) {
    console.log("No test results available, using empty structure");
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
  
  // Process test results
  testResults.testResults.forEach((result) => {
    const component = extractComponentName(result.file);
    if (!component) return;
    
    const category = categorizeTest(result.file, result.name);
    const stats = categoryStats.get(category);
    if (stats) {
      stats.total++;
      if (result.status === "passed") stats.passed++;
      if (result.status === "failed") stats.failed++;
      if (result.status === "skipped") stats.warned++;
    }
    
    if (!components.has(component)) {
      components.set(component, new Map());
    }
    
    const componentTests = components.get(component)!;
    
    // Determine status for this component+category
    let status: TestStatus = "missing";
    let issueCount = 0;
    const topIssues: string[] = [];
    
    if (result.status === "passed") {
      status = "pass";
    } else if (result.status === "failed") {
      status = "fail";
      issueCount = result.errors?.length || 1;
      if (result.errors) {
        result.errors.forEach((error) => {
          const severity = determineSeverity(error.message);
          issues.push({
            id: `issue-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            component,
            category,
            severity,
            title: error.message.split("\n")[0] || "Test failed",
            short: error.message.substring(0, 100),
            runId: `run-${new Date().toISOString().split("T")[0]}`,
            createdAt: new Date().toISOString(),
            links: {
              story: `https://storybook.fragment-ui.dev/?path=/docs/core-${component.toLowerCase()}--docs`,
            },
          });
          topIssues.push(error.message.split("\n")[0] || "Test failed");
        });
      }
    } else if (result.status === "skipped") {
      status = "warn";
      issueCount = 1;
      topIssues.push("Test skipped");
    }
    
    // Update or create cell
    const existing = componentTests.get(category);
    if (existing) {
      // Merge results
      if (status === "fail" || (existing.status === "pass" && status === "warn")) {
        existing.status = status;
      }
      existing.issues = (existing.issues || 0) + issueCount;
      if (topIssues.length > 0) {
        existing.topIssues = [...(existing.topIssues || []), ...topIssues].slice(0, 3);
      }
    } else {
      componentTests.set(category, {
        component,
        category,
        status,
        issues: issueCount,
        topIssues: topIssues.slice(0, 3),
      });
    }
  });
  
  // Generate heatmap array
  const heatmap: ComponentTestCell[] = [];
  components.forEach((componentTests, component) => {
    categories.forEach((category) => {
      const cell = componentTests.get(category);
      if (cell) {
        heatmap.push(cell);
      } else {
        // Add missing entry
        heatmap.push({
          component,
          category,
          status: "missing",
          issues: 0,
        });
      }
    });
  });
  
  // Generate KPI summary
  const summary: KpiSummary[] = categories.map((category) => {
    const stats = categoryStats.get(category)!;
    const total = stats.total || 1;
    const passRate = stats.passed / total;
    
    return {
      category,
      passRate,
      total: stats.total,
      fails: stats.failed,
      warns: stats.warned,
      isGate: category === "a11y", // A11y is a gate
    };
  });
  
  // Helper function to get branch name (without Git dependency)
  function getBranchName(): string {
    // Try environment variable first (CI/CD systems often set this)
    if (process.env.GIT_BRANCH) {
      return process.env.GIT_BRANCH;
    }
    if (process.env.BRANCH_NAME) {
      return process.env.BRANCH_NAME;
    }
    if (process.env.CI_COMMIT_REF_NAME) {
      return process.env.CI_COMMIT_REF_NAME;
    }
    // Default fallback
    return "local";
  }

  // Helper function to get commit hash (without Git dependency)
  function getCommitHash(): string {
    // Try environment variable first (CI/CD systems often set this)
    if (process.env.GIT_COMMIT) {
      return process.env.GIT_COMMIT.substring(0, 7);
    }
    if (process.env.COMMIT_SHA) {
      return process.env.COMMIT_SHA.substring(0, 7);
    }
    if (process.env.CI_COMMIT_SHA) {
      return process.env.CI_COMMIT_SHA.substring(0, 7);
    }
    // Default fallback
    return "unknown";
  }

  // Generate run metadata
  const runs: RunMeta[] = [
    {
      id: `run-${Date.now()}`,
      startedAt: new Date().toISOString(),
      finishedAt: new Date().toISOString(),
      branch: getBranchName(),
      commit: getCommitHash(),
      triggeredBy: "manual",
      stats: {
        totalIssues: issues.length,
        critical: issues.filter((i) => i.severity === "critical").length,
        passRate: testResults.numPassedTests / testResults.numTotalTests,
      },
    },
  ];
  
  return { summary, heatmap, issues, runs };
}

async function main() {
  console.log("Collecting test results...\n");
  
  // Ensure data directory exists
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  
  // Collect test results
  const testResults = await collectTestResults();
  
  // Generate quality data
  const { summary, heatmap, issues, runs } = generateQualityData(testResults);
  
  // Write files with error handling
  const filesToWrite = [
    { name: "summary.json", data: summary },
    { name: "heatmap.json", data: heatmap },
    { name: "issues.json", data: issues },
    { name: "runs.json", data: runs },
  ];
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const file of filesToWrite) {
    try {
      fs.writeFileSync(
        path.join(DATA_DIR, file.name),
        JSON.stringify(file.data, null, 2)
      );
      successCount++;
    } catch (error: any) {
      console.error(`⚠️  Failed to write ${file.name}:`, error.message);
      errorCount++;
      // Continue with other files even if one fails
    }
  }
  
  if (errorCount === 0) {
    console.log("\n✅ Quality data updated!");
    console.log(`   - Summary: ${summary.length} categories`);
    console.log(`   - Heatmap: ${heatmap.length} cells`);
    console.log(`   - Issues: ${issues.length} issues`);
    console.log(`   - Runs: ${runs.length} run(s)`);
  } else {
    console.log(`\n⚠️  Quality data partially updated (${successCount}/${filesToWrite.length} files written)`);
    if (errorCount > 0) {
      console.log(`   - ${errorCount} file(s) failed to write (this may be a Cursor worktree sync issue)`);
    }
  }
}

main().catch(console.error);

