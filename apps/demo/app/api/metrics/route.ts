/**
 * Metrics API endpoint
 * 
 * GET /api/metrics - Get metrics for the last N days
 * POST /api/metrics - Save a new metric
 */

import { NextRequest, NextResponse } from "next/server";
import { getDatabase, insertMetric, getMetricsByTypeAndRange } from "@fragment_ui/telemetry/db/database";
import { list } from "../../submissions/store";
import type { ROIMetric } from "@fragment_ui/telemetry/roi-metrics";

export const runtime = "nodejs";

/**
 * Calculate acceptance rate from submissions
 */
function calculateAcceptanceRate(submissions: any[]): number {
  if (submissions.length === 0) return 0;
  
  const threshold = 80; // 80% score threshold
  const accepted = submissions.filter(
    (s) => s.result?.score !== undefined && s.result.score >= threshold
  );
  
  return (accepted.length / submissions.length) * 100;
}

/**
 * Calculate total A11y violations from submissions
 */
function calculateA11yViolations(submissions: any[]): number {
  return submissions.reduce((sum, s) => {
    return sum + (s.result?.a11y?.violations || 0);
  }, 0);
}

/**
 * GET /api/metrics
 * Returns metrics for the last N days
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get("days") || "7");
    
    const now = Date.now();
    const startDate = now - days * 24 * 60 * 60 * 1000;
    
    // Get TTFUI metrics
    const ttfuiMetrics = getMetricsByTypeAndRange("ttfui", startDate, now);
    
    // Get acceptance rate metrics
    const acceptanceRateMetrics = getMetricsByTypeAndRange("acceptance_rate", startDate, now);
    
    // Get A11y violations metrics
    const a11yMetrics = getMetricsByTypeAndRange("a11y_violations", startDate, now);
    
    // Get recent submissions for table and calculate current metrics
    const submissions = await list();
    
    // Calculate and save current acceptance rate and A11y violations if not already saved today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTimestamp = today.getTime();
    
    // Check if we already have metrics for today
    const todayAcceptanceRate = getMetricsByTypeAndRange("acceptance_rate", todayTimestamp, now);
    const todayA11y = getMetricsByTypeAndRange("a11y_violations", todayTimestamp, now);
    
    // If no metrics for today, calculate and save
    if (todayAcceptanceRate.length === 0 && submissions.length > 0) {
      const acceptanceRate = calculateAcceptanceRate(submissions);
      const acceptanceRateMetric: ROIMetric = {
        type: "acceptance_rate",
        value: acceptanceRate,
        unit: "percentage",
        timestamp: Date.now(),
        metadata: {
          totalSubmissions: submissions.length,
          threshold: 80,
        },
      };
      insertMetric(acceptanceRateMetric);
    }
    
    if (todayA11y.length === 0 && submissions.length > 0) {
      const a11yViolations = calculateA11yViolations(submissions);
      const a11yMetric: ROIMetric = {
        type: "a11y_violations",
        value: a11yViolations,
        unit: "count",
        timestamp: Date.now(),
        metadata: {
          totalSubmissions: submissions.length,
        },
      };
      insertMetric(a11yMetric);
    }
    const recentSubmissions = submissions
      .filter((s) => {
        const createdAt = new Date(s.createdAt).getTime();
        return createdAt >= startDate;
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 20);
    
    return NextResponse.json({
      ttfui: ttfuiMetrics.map((m) => ({
        timestamp: m.timestamp,
        value: m.value,
        date: new Date(m.timestamp).toISOString(),
      })),
      acceptanceRate: acceptanceRateMetrics.map((m) => ({
        timestamp: m.timestamp,
        value: m.value,
        date: new Date(m.timestamp).toISOString(),
      })),
      a11yViolations: a11yMetrics.map((m) => ({
        timestamp: m.timestamp,
        value: m.value,
        date: new Date(m.timestamp).toISOString(),
      })),
      recentSubmissions: recentSubmissions.map((s) => ({
        id: s.id,
        type: s.type,
        status: s.status,
        author: s.author,
        createdAt: s.createdAt,
        score: s.result?.score,
        a11yViolations: s.result?.a11y?.violations || 0,
      })),
    });
  } catch (error: any) {
    console.error("[Metrics API] Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/metrics
 * Save a new metric
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, value, unit = "ms", metadata } = body;
    
    if (!type || value === undefined) {
      return NextResponse.json(
        { error: "type and value are required" },
        { status: 400 }
      );
    }
    
    const metric: ROIMetric = {
      type,
      value: typeof value === "number" ? value : parseFloat(value),
      unit,
      timestamp: Date.now(),
      metadata,
    };
    
    insertMetric(metric);
    
    return NextResponse.json({ success: true, metric });
  } catch (error: any) {
    console.error("[Metrics API] Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/metrics/calculate
 * Calculate and save metrics from submissions
 */
export async function PUT(request: NextRequest) {
  try {
    const submissions = await list();
    
    // Calculate acceptance rate
    const acceptanceRate = calculateAcceptanceRate(submissions);
    const acceptanceRateMetric: ROIMetric = {
      type: "acceptance_rate",
      value: acceptanceRate,
      unit: "percentage",
      timestamp: Date.now(),
      metadata: {
        totalSubmissions: submissions.length,
        threshold: 80,
      },
    };
    insertMetric(acceptanceRateMetric);
    
    // Calculate A11y violations
    const a11yViolations = calculateA11yViolations(submissions);
    const a11yMetric: ROIMetric = {
      type: "a11y_violations",
      value: a11yViolations,
      unit: "count",
      timestamp: Date.now(),
      metadata: {
        totalSubmissions: submissions.length,
      },
    };
    insertMetric(a11yMetric);
    
    return NextResponse.json({
      success: true,
      metrics: {
        acceptanceRate,
        a11yViolations,
      },
    });
  } catch (error: any) {
    console.error("[Metrics API] Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

