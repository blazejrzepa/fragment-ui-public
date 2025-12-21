/**
 * ROI Metrics Collection
 * 
 * Tracks KPIs required for business justification:
 * - Lead time (Figma → code PR)
 * - DS adoption rate
 * - Component reuse rate
 * - Time-to-ship reduction
 * - UI maintenance cost reduction
 * - Onboarding time
 */

import type { TelemetryEvent } from "./types.js";

export type ROIMetricType =
  | "lead_time"
  | "adoption_rate"
  | "reuse_rate"
  | "time_to_ship"
  | "maintenance_cost"
  | "onboarding_time"
  | "acceptance_rate"
  | "a11y_violations"
  | "ttfui";

export interface ROIMetric {
  type: ROIMetricType;
  value: number;
  unit: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

export interface LeadTimeMetric extends ROIMetric {
  type: "lead_time";
  figmaUrl?: string;
  prUrl?: string;
  componentName?: string;
  startTime: number;
  endTime: number;
}

export interface AdoptionRateMetric extends ROIMetric {
  type: "adoption_rate";
  period: "daily" | "weekly" | "monthly";
  totalViews: number;
  dsViews: number;
  percentage: number;
}

export interface ReuseRateMetric extends ROIMetric {
  type: "reuse_rate";
  componentName: string;
  repositoryCount: number;
  totalRepositories: number;
  percentage: number;
}

export interface TimeToShipMetric extends ROIMetric {
  type: "time_to_ship";
  projectId?: string;
  beforeDS: number; // days
  afterDS: number; // days
  reduction: number; // percentage
}

export interface MaintenanceCostMetric extends ROIMetric {
  type: "maintenance_cost";
  period: "monthly" | "quarterly" | "yearly";
  beforeDS: number; // cost in hours or currency
  afterDS: number;
  reduction: number; // percentage
}

export interface OnboardingTimeMetric extends ROIMetric {
  type: "onboarding_time";
  userId?: string;
  startTime: number;
  endTime: number;
  firstComponentRendered: boolean;
}

/**
 * Track lead time: Figma screen → code PR
 */
export function trackLeadTime(
  startTime: number,
  endTime: number,
  metadata?: {
    figmaUrl?: string;
    prUrl?: string;
    componentName?: string;
  }
): LeadTimeMetric {
  const leadTime = endTime - startTime; // milliseconds
  const leadTimeDays = leadTime / (1000 * 60 * 60 * 24);

  return {
    type: "lead_time",
    value: leadTimeDays,
    unit: "days",
    timestamp: Date.now(),
    startTime,
    endTime,
    ...metadata,
  };
}

/**
 * Track DS adoption rate
 */
export function trackAdoptionRate(
  period: "daily" | "weekly" | "monthly",
  totalViews: number,
  dsViews: number
): AdoptionRateMetric {
  const percentage = totalViews > 0 ? (dsViews / totalViews) * 100 : 0;

  return {
    type: "adoption_rate",
    value: percentage,
    unit: "percentage",
    timestamp: Date.now(),
    period,
    totalViews,
    dsViews,
    percentage,
  };
}

/**
 * Track component reuse rate
 */
export function trackReuseRate(
  componentName: string,
  repositoryCount: number,
  totalRepositories: number
): ReuseRateMetric {
  const percentage =
    totalRepositories > 0 ? (repositoryCount / totalRepositories) * 100 : 0;

  return {
    type: "reuse_rate",
    value: percentage,
    unit: "percentage",
    timestamp: Date.now(),
    componentName,
    repositoryCount,
    totalRepositories,
    percentage,
  };
}

/**
 * Track time-to-ship reduction
 */
export function trackTimeToShip(
  beforeDS: number,
  afterDS: number,
  metadata?: { projectId?: string }
): TimeToShipMetric {
  const reduction = beforeDS > 0 ? ((beforeDS - afterDS) / beforeDS) * 100 : 0;

  return {
    type: "time_to_ship",
    value: reduction,
    unit: "percentage",
    timestamp: Date.now(),
    beforeDS,
    afterDS,
    reduction,
    ...metadata,
  };
}

/**
 * Track maintenance cost reduction
 */
export function trackMaintenanceCost(
  period: "monthly" | "quarterly" | "yearly",
  beforeDS: number,
  afterDS: number
): MaintenanceCostMetric {
  const reduction = beforeDS > 0 ? ((beforeDS - afterDS) / beforeDS) * 100 : 0;

  return {
    type: "maintenance_cost",
    value: reduction,
    unit: "percentage",
    timestamp: Date.now(),
    period,
    beforeDS,
    afterDS,
    reduction,
  };
}

/**
 * Track onboarding time
 */
export function trackOnboardingTime(
  startTime: number,
  endTime: number,
  firstComponentRendered: boolean,
  metadata?: { userId?: string }
): OnboardingTimeMetric {
  const onboardingTime = endTime - startTime; // milliseconds
  const onboardingTimeMinutes = onboardingTime / (1000 * 60);

  return {
    type: "onboarding_time",
    value: onboardingTimeMinutes,
    unit: "minutes",
    timestamp: Date.now(),
    startTime,
    endTime,
    firstComponentRendered,
    ...metadata,
  };
}

/**
 * Convert ROI metric to telemetry event
 */
export function roiMetricToEvent(metric: ROIMetric): TelemetryEvent {
  return {
    type: "custom",
    name: `roi_${metric.type}`,
    properties: {
      value: metric.value,
      unit: metric.unit,
      ...metric.metadata,
    },
    timestamp: metric.timestamp,
  };
}

