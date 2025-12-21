import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const severity = searchParams.get("severity");
    const component = searchParams.get("component");
    const category = searchParams.get("category");

    const filePath = path.join(process.cwd(), "data", "quality", "issues.json");
    const fileContents = fs.readFileSync(filePath, "utf8");
    let data = JSON.parse(fileContents);

    // Apply filters
    if (severity) {
      data = data.filter((item: any) => item.severity === severity);
    }
    if (component) {
      data = data.filter((item: any) => item.component === component);
    }
    if (category) {
      data = data.filter((item: any) => item.category === category);
    }

    // Sort by severity (critical first) and createdAt (newest first)
    const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    data.sort((a: any, b: any) => {
      const severityDiff = severityOrder[a.severity as keyof typeof severityOrder] - severityOrder[b.severity as keyof typeof severityOrder];
      if (severityDiff !== 0) return severityDiff;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error reading issues data:", error);
    return NextResponse.json(
      { error: "Failed to load issues data" },
      { status: 500 }
    );
  }
}

