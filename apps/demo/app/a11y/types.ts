/**
 * Types for A11y Telemetry
 */

export interface A11yStats {
  id: string;
  submissionId?: string;
  viewId?: string;
  timestamp: number;
  violations: number;
  critical: number;
  serious: number;
  moderate: number;
  minor: number;
  passes: number;
  incomplete: number;
  inapplicable: number;
  violationsByRule: Record<string, number>;
}

