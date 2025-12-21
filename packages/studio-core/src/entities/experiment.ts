/**
 * Experiment entity - A/B test configuration
 */

export interface Experiment {
  id: string;                    // UUID v4
  projectId: string;
  slug: string;                   // URL-friendly identifier
  name: string;
  posthogFlagKey: string;        // PostHog feature flag key (e.g., "exp_landing_2025_11")
  variantMap: Record<string, string>;  // variantKey -> submissionId (e.g., { control: "sub_1", test: "sub_2" })
  trafficAllocation?: Record<string, number>;  // variantKey -> percentage (0-100) - optional, managed by PostHog
  primaryMetric: {
    event: string;                // e.g., "cta_clicked", "form_submitted"
  };
  guardrails?: Array<{
    event: string;
    threshold?: number;
  }>;
  status: "draft" | "running" | "stopped" | "completed";
  startedAt?: string;             // ISO 8601
  endedAt?: string;               // ISO 8601
  createdAt: string;             // ISO 8601
  createdBy: string;             // User ID
  updatedAt?: string;             // ISO 8601
}

