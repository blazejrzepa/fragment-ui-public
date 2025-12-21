import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

/**
 * Aggregate test results from multiple sources
 * This endpoint can be extended to read from:
 * - CI/CD artifacts (GitHub Actions, CircleCI, etc.)
 * - Test result files (JUnit XML, JSON, etc.)
 * - Database (if storing test results)
 */
export async function GET() {
  try {
    // For now, read from JSON files
    // In production, this would aggregate from:
    // 1. CI/CD runs (GitHub Actions artifacts)
    // 2. Local test results (vitest, playwright)
    // 3. External services (Chromatic, Lighthouse CI)
    
    const summaryPath = path.join(process.cwd(), "data", "quality", "summary.json");
    const heatmapPath = path.join(process.cwd(), "data", "quality", "heatmap.json");
    const issuesPath = path.join(process.cwd(), "data", "quality", "issues.json");
    const runsPath = path.join(process.cwd(), "data", "quality", "runs.json");

    const [summary, heatmap, issues, runs] = await Promise.all([
      fs.promises.readFile(summaryPath, "utf8").then(JSON.parse).catch(() => []),
      fs.promises.readFile(heatmapPath, "utf8").then(JSON.parse).catch(() => []),
      fs.promises.readFile(issuesPath, "utf8").then(JSON.parse).catch(() => []),
      fs.promises.readFile(runsPath, "utf8").then(JSON.parse).catch(() => []),
    ]);

    // Calculate overall stats
    const totalComponents = new Set(heatmap.map((c: any) => c.component)).size;
    const totalTests = heatmap.length;
    const passingTests = heatmap.filter((c: any) => c.status === "pass").length;
    const failingTests = heatmap.filter((c: any) => c.status === "fail").length;
    const warningTests = heatmap.filter((c: any) => c.status === "warn").length;
    const missingTests = heatmap.filter((c: any) => c.status === "missing").length;

    const overallPassRate = totalTests > 0 ? passingTests / totalTests : 0;
    const criticalIssues = issues.filter((i: any) => i.severity === "critical").length;

    return NextResponse.json({
      summary: {
        totalComponents,
        totalTests,
        passingTests,
        failingTests,
        warningTests,
        missingTests,
        overallPassRate,
        criticalIssues,
        lastRun: runs[0] || null,
      },
      kpi: summary,
      heatmap,
      issues,
      runs,
    });
  } catch (error) {
    console.error("Error aggregating test data:", error);
    return NextResponse.json(
      { error: "Failed to aggregate test data" },
      { status: 500 }
    );
  }
}

