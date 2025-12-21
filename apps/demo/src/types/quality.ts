export type TestCategory =
  | "a11y"
  | "unit"
  | "e2e"
  | "visual"
  | "performance"
  | "responsive"
  | "interactions"
  | "states";

export type TestStatus = "pass" | "warn" | "fail" | "missing";

export type Severity = "critical" | "high" | "medium" | "low";

export interface KpiSummary {
  category: TestCategory;
  passRate: number; // 0..1
  total: number; // liczba jednostek testowanych (komponentów/scenariuszy)
  fails: number;
  warns: number;
  isGate?: boolean; // np. a11y = gate
}

export interface ComponentTestCell {
  component: string; // np. "Button"
  category: TestCategory;
  status: TestStatus;
  issues?: number; // ile problemów w tej komórce
  topIssues?: string[]; // top 3 problemy dla tooltipa
}

export interface IssueItem {
  id: string;
  component: string;
  category: TestCategory;
  severity: Severity;
  title: string;
  short: string;
  runId: string;
  createdAt: string;
  links?: {
    story?: string;
    chromatic?: string;
    log?: string;
    pr?: string;
  };
}

export interface RunMeta {
  id: string;
  startedAt: string;
  finishedAt?: string;
  branch: string;
  commit: string;
  triggeredBy: string;
  stats: {
    totalIssues: number;
    critical: number;
    passRate: number;
  };
}

export interface TestDetails {
  component: string;
  category: TestCategory;
  status: TestStatus;
  issues: IssueItem[];
  summary: {
    passRate: number;
    total: number;
    fails: number;
    warns: number;
  };
  logs?: string;
  visualDiff?: string;
  a11yResults?: Array<{
    id: string;
    impact: Severity;
    description: string;
    helpUrl: string;
    nodes: Array<{
      html: string;
      target: string[];
    }>;
  }>;
}

export interface TestHistoryEntry {
  runId: string;
  timestamp: string;
  component: string;
  category: TestCategory;
  status: TestStatus;
  passRate: number;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  issues: number;
  commit?: string;
  branch?: string;
}

export interface ComponentTestHistory {
  component: string;
  category: TestCategory;
  entries: TestHistoryEntry[];
}

