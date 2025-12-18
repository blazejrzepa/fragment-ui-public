"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@fragment_ui/ui";
import { DocLayout } from "../../../src/components/doc-layout";
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  Shield,
  FileText,
  TestTube,
  Zap,
  Eye,
  TrendingUp,
} from "lucide-react";

interface ComplianceMetric {
  category: string;
  score: number;
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

interface GovernanceData {
  overallScore: number;
  metrics: ComplianceMetric[];
  components: ComponentCompliance[];
  issuesBySeverity: {
    high: number;
    medium: number;
    low: number;
  };
  totalComponents: number;
  compliantComponents: number;
}

export default function GovernanceDashboardPage() {
  const [data, setData] = React.useState<GovernanceData | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/governance/compliance");
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Failed to fetch governance data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "compliant":
        return <CheckCircle className="h-5 w-5 text-[color:var(--color-status-success-fg)]" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-[color:var(--color-status-warning-fg)]" />;
      case "non-compliant":
        return <XCircle className="h-5 w-5 text-[color:var(--color-status-error-fg)]" />;
      default:
        return null;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "accessibility":
        return <Eye className="h-5 w-5" />;
      case "performance":
        return <Zap className="h-5 w-5" />;
      case "documentation":
        return <FileText className="h-5 w-5" />;
      case "testing":
        return <TestTube className="h-5 w-5" />;
      case "deprecation":
        return <Shield className="h-5 w-5" />;
      default:
        return null;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "text-status-error-fg bg-status-error-bg border-status-error-border";
      case "medium":
        return "text-status-warning-fg bg-status-warning-bg border-status-warning-border";
      case "low":
        return "text-status-info-fg bg-status-info-bg border-status-info-border";
      default:
        return "";
    }
  };

  if (loading || !data) {
    return (
      <DocLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[color:var(--color-brand-primary)] mx-auto mb-4"></div>
            <p className="text-[color:var(--color-fg-muted)]">Loading governance data...</p>
          </div>
        </div>
      </DocLayout>
    );
  }

  return (
    <DocLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Design System Governance Dashboard</h1>
        <p className="text-[color:var(--color-fg-muted)]">
          Monitor compliance, track issues, and ensure design system quality standards
        </p>
      </div>

      {/* Overall Score */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-6 w-6" />
            Overall Compliance Score
          </CardTitle>
          <CardDescription>System-wide compliance and quality metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-8">
            <div className="relative w-32 h-32">
              <svg className="transform -rotate-90 w-32 h-32">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-[color:var(--color-surface-2)]"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${(data.overallScore / 100) * 351.86} 351.86`}
                  className="text-[color:var(--color-brand-primary)]"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold">{data.overallScore}</div>
                  <div className="text-xs text-[color:var(--color-fg-muted)]">/ 100</div>
                </div>
              </div>
            </div>
            <div className="flex-1 grid grid-cols-3 gap-4">
              <div>
                <div className="text-2xl font-bold">{data.compliantComponents}</div>
                <div className="text-sm text-[color:var(--color-fg-muted)]">Compliant Components</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{data.totalComponents}</div>
                <div className="text-sm text-[color:var(--color-fg-muted)]">Total Components</div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {data.issuesBySeverity.high + data.issuesBySeverity.medium + data.issuesBySeverity.low}
                </div>
                <div className="text-sm text-[color:var(--color-fg-muted)]">Total Issues</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Compliance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {data.metrics.map((metric) => (
          <Card key={metric.category}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                {getCategoryIcon(metric.category)}
                {metric.category}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <div className="text-2xl font-bold">{metric.score}</div>
                {getStatusIcon(metric.status)}
              </div>
              <div className="w-full bg-[color:var(--color-surface-2)] rounded-full h-2 mb-2">
                <div
                  className={`h-2 rounded-full ${
                    metric.status === "compliant"
                      ? "bg-[color:var(--color-status-success-base)]"
                      : metric.status === "warning"
                        ? "bg-[color:var(--color-status-warning-base)]"
                        : "bg-[color:var(--color-status-error-base)]"
                  }`}
                  style={{ width: `${metric.score}%` }}
                />
              </div>
              <div className="text-xs text-[color:var(--color-fg-muted)]">
                {metric.issues} issues out of {metric.total} components
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Issues by Severity */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Issues by Severity</CardTitle>
          <CardDescription>Breakdown of compliance issues by severity level</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-md border-2 border-[color:var(--color-status-error-border)] bg-[color:var(--color-status-error-bg)]">
              <div className="text-2xl font-bold text-[color:var(--color-status-error-fg)]">{data.issuesBySeverity.high}</div>
              <div className="text-sm text-[color:var(--color-status-error-fg)] font-medium">High Priority</div>
            </div>
            <div className="p-4 rounded-md border-2 border-[color:var(--color-status-warning-border)] bg-[color:var(--color-status-warning-bg)]">
              <div className="text-2xl font-bold text-[color:var(--color-status-warning-fg)]">{data.issuesBySeverity.medium}</div>
              <div className="text-sm text-[color:var(--color-status-warning-fg)] font-medium">Medium Priority</div>
            </div>
            <div className="p-4 rounded-md border-2 border-[color:var(--color-status-info-border)] bg-[color:var(--color-status-info-bg)]">
              <div className="text-2xl font-bold text-[color:var(--color-status-info-fg)]">{data.issuesBySeverity.low}</div>
              <div className="text-sm text-[color:var(--color-status-info-fg)] font-medium">Low Priority</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Component Compliance */}
      <Card>
        <CardHeader>
          <CardTitle>Component Compliance</CardTitle>
          <CardDescription>Detailed compliance status for each component</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.components.map((component) => (
              <div
                key={component.componentName}
                className="p-4 rounded-md border border-[color:var(--color-border-base)]"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="font-medium capitalize">{component.componentName}</div>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-[color:var(--color-surface-2)] rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            component.complianceScore >= 90
                              ? "bg-[color:var(--color-status-success-base)]"
                              : component.complianceScore >= 70
                                ? "bg-[color:var(--color-status-warning-base)]"
                                : "bg-[color:var(--color-status-error-base)]"
                          }`}
                          style={{ width: `${component.complianceScore}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{component.complianceScore}%</span>
                    </div>
                  </div>
                </div>
                {component.issues.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {component.issues.map((issue, index) => (
                      <div
                        key={index}
                        className={`p-2 rounded border ${getSeverityColor(issue.severity)}`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium uppercase">{issue.severity}</span>
                          <span className="text-xs">•</span>
                          <span className="text-xs capitalize">{issue.type}</span>
                        </div>
                        <div className="text-sm">{issue.message}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DocLayout>
  );
}

