import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const component = searchParams.get("component");
    const category = searchParams.get("category");

    if (!component || !category) {
      return NextResponse.json(
        { error: "Component and category are required" },
        { status: 400 }
      );
    }

    // Read issues to get details for this component/category
    const issuesPath = path.join(process.cwd(), "data", "quality", "issues.json");
    const issuesContents = fs.readFileSync(issuesPath, "utf8");
    const issues = JSON.parse(issuesContents);

    const relevantIssues = issues.filter(
      (issue: any) => issue.component === component && issue.category === category
    );

    // Read heatmap to get status
    const heatmapPath = path.join(process.cwd(), "data", "quality", "heatmap.json");
    const heatmapContents = fs.readFileSync(heatmapPath, "utf8");
    const heatmap = JSON.parse(heatmapContents);

    const cell = heatmap.find(
      (c: any) => c.component === component && c.category === category
    );

    // Mock A11y results if category is a11y
    let a11yResults = undefined;
    if (category === "a11y" && cell?.status === "fail") {
      a11yResults = relevantIssues
        .filter((issue: any) => issue.severity === "critical" || issue.severity === "high")
        .map((issue: any) => ({
          id: issue.id,
          impact: issue.severity === "critical" ? "critical" : "serious",
          description: issue.title,
          helpUrl: issue.links?.story || `https://dequeuniversity.com/rules/axe/${issue.id}`,
          nodes: [
            {
              html: `<${component.toLowerCase()} />`,
              target: [`#${component.toLowerCase()}`],
            },
          ],
        }));
    }

    const details = {
      component,
      category,
      status: cell?.status || "missing",
      issues: relevantIssues,
      summary: {
        passRate: cell?.status === "pass" ? 1.0 : cell?.status === "warn" ? 0.5 : 0.0,
        total: 1,
        fails: cell?.status === "fail" ? 1 : 0,
        warns: cell?.status === "warn" ? 1 : 0,
      },
      logs: `[${new Date().toISOString()}] Running tests for ${component}...
[${new Date().toISOString()}] Category: ${category}
[${new Date().toISOString()}] Status: ${cell?.status?.toUpperCase() || "MISSING"}
[${new Date().toISOString()}] Test execution completed.`,
      visualDiff: category === "visual" && cell?.status !== "pass" ? "Visual diff available" : undefined,
      a11yResults,
    };

    return NextResponse.json(details);
  } catch (error) {
    console.error("Error reading test details:", error);
    return NextResponse.json(
      { error: "Failed to load test details" },
      { status: 500 }
    );
  }
}

