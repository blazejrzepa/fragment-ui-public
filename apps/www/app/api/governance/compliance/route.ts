import { NextRequest, NextResponse } from "next/server";

/**
 * Governance Compliance API
 * 
 * Returns compliance metrics and governance data
 */

interface ComplianceMetric {
  category: string;
  score: number; // 0-100
  status: "compliant" | "warning" | "non-compliant";
  issues: number;
  total: number;
}

interface ComponentCompliance {
  componentName: string;
  complianceScore: number;
  issues: Array<{
    type: "deprecated" | "accessibility" | "performance" | "documentation" | "testing";
    severity: "low" | "medium" | "high";
    message: string;
  }>;
}

// Mock data
const mockComplianceMetrics: ComplianceMetric[] = [
  {
    category: "Accessibility",
    score: 92,
    status: "compliant",
    issues: 3,
    total: 64,
  },
  {
    category: "Performance",
    score: 88,
    status: "compliant",
    issues: 5,
    total: 64,
  },
  {
    category: "Documentation",
    score: 95,
    status: "compliant",
    issues: 2,
    total: 64,
  },
  {
    category: "Testing",
    score: 85,
    status: "warning",
    issues: 8,
    total: 64,
  },
  {
    category: "Deprecation",
    score: 100,
    status: "compliant",
    issues: 0,
    total: 64,
  },
];

const mockComponentCompliance: ComponentCompliance[] = [
  {
    componentName: "button",
    complianceScore: 98,
    issues: [],
  },
  {
    componentName: "input",
    complianceScore: 95,
    issues: [
      {
        type: "accessibility",
        severity: "low",
        message: "Missing aria-label in some variants",
      },
    ],
  },
  {
    componentName: "dialog",
    complianceScore: 92,
    issues: [
      {
        type: "performance",
        severity: "medium",
        message: "Consider lazy loading for large dialogs",
      },
    ],
  },
  {
    componentName: "table",
    complianceScore: 88,
    issues: [
      {
        type: "testing",
        severity: "medium",
        message: "Missing test coverage for edge cases",
      },
      {
        type: "documentation",
        severity: "low",
        message: "Documentation could be more detailed",
      },
    ],
  },
];

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const componentName = searchParams.get("component");

  if (componentName) {
    const component = mockComponentCompliance.find(
      (c) => c.componentName === componentName
    );
    if (!component) {
      return NextResponse.json({ error: "Component not found" }, { status: 404 });
    }
    return NextResponse.json(component);
  }

  // Calculate overall compliance score
  const overallScore = Math.round(
    mockComplianceMetrics.reduce((sum, m) => sum + m.score, 0) / mockComplianceMetrics.length
  );

  // Count issues by severity
  const issuesBySeverity = {
    high: mockComponentCompliance.reduce(
      (sum, c) => sum + c.issues.filter((i) => i.severity === "high").length,
      0
    ),
    medium: mockComponentCompliance.reduce(
      (sum, c) => sum + c.issues.filter((i) => i.severity === "medium").length,
      0
    ),
    low: mockComponentCompliance.reduce(
      (sum, c) => sum + c.issues.filter((i) => i.severity === "low").length,
      0
    ),
  };

  return NextResponse.json({
    overallScore,
    metrics: mockComplianceMetrics,
    components: mockComponentCompliance,
    issuesBySeverity,
    totalComponents: mockComponentCompliance.length,
    compliantComponents: mockComponentCompliance.filter((c) => c.complianceScore >= 90).length,
  });
}

