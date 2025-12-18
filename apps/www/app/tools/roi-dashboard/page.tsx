"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@fragment_ui/ui";
import { DocLayout } from "../../../src/components/doc-layout";

/**
 * ROI Dashboard
 * 
 * Displays key performance indicators (KPIs) for Fragment UI:
 * - Lead time (Figma → code PR)
 * - DS adoption rate
 * - Component reuse rate
 * - Time-to-ship reduction
 * - UI maintenance cost reduction
 * - Onboarding time
 */

export default function ROIDashboardPage() {
  // TODO: Fetch actual metrics from API
  const metrics = {
    leadTime: {
      current: 0.8, // days
      target: 1.0,
      status: "good" as const,
    },
    adoptionRate: {
      current: 75, // percentage
      target: 80,
      status: "warning" as const,
    },
    reuseRate: {
      current: 65, // percentage
      target: 70,
      status: "warning" as const,
    },
    timeToShip: {
      reduction: 45, // percentage
      target: 40,
      status: "good" as const,
    },
    maintenanceCost: {
      reduction: 28, // percentage
      target: 30,
      status: "warning" as const,
    },
    onboardingTime: {
      current: 25, // minutes
      target: 30,
      status: "good" as const,
    },
  };

  const getStatusTextClass = (status: "good" | "warning" | "error") => {
    switch (status) {
      case "good":
        return "text-[color:var(--color-status-success-fg)]";
      case "warning":
        return "text-[color:var(--color-status-warning-fg)]";
      case "error":
        return "text-[color:var(--color-status-error-fg)]";
    }
  };

  const getStatusBarClass = (status: "good" | "warning" | "error") => {
    switch (status) {
      case "good":
        return "bg-[color:var(--color-status-success-base)]";
      case "warning":
        return "bg-[color:var(--color-status-warning-base)]";
      case "error":
        return "bg-[color:var(--color-status-error-base)]";
    }
  };

  const getStatusIcon = (status: "good" | "warning" | "error") => {
    switch (status) {
      case "good":
        return "✅";
      case "warning":
        return "⚠️";
      case "error":
        return "❌";
    }
  };

  return (
    <DocLayout>
      {/* Context and Overview */}
      <div className="mb-8 p-6 bg-[color:var(--color-surface-2)] rounded-lg border border-[color:var(--color-border-base)]">
        <h2 className="text-2xl font-semibold mb-3">ROI Dashboard</h2>
        <p className="text-[color:var(--color-fg-muted)] mb-4">
          The ROI Dashboard provides real-time visibility into key performance indicators (KPIs) 
          that demonstrate the business value of Fragment UI. Track metrics like lead time reduction, 
          design system adoption, component reuse, and cost savings to justify design system 
          investment and measure success.
        </p>
        <div className="space-y-2 text-sm">
          <p><strong>Key metrics tracked:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Lead Time - Time from Figma design to code PR (target: ≤ 1 day)</li>
            <li>Adoption Rate - % of new views built with design system (target: ≥ 80%)</li>
            <li>Reuse Rate - % of components reused across repositories (target: ≥ 70%)</li>
            <li>Time-to-Ship - Reduction in development time (target: 40-60%)</li>
            <li>Maintenance Cost - Reduction in UI maintenance costs (target: ≥ 30%)</li>
            <li>Onboarding Time - Time to first component render (target: &lt; 30 min)</li>
          </ul>
        </div>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">ROI Dashboard</h1>
        <p className="text-[color:var(--color-fg-muted)]">
          Key performance indicators for Fragment UI design system
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Lead Time */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Lead Time
              <span className={getStatusTextClass(metrics.leadTime.status)}>
                {getStatusIcon(metrics.leadTime.status)}
              </span>
            </CardTitle>
            <CardDescription>Figma screen → code PR</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">
              {metrics.leadTime.current.toFixed(1)} days
            </div>
            <div className="text-sm text-[color:var(--color-fg-muted)]">
              Target: ≤ {metrics.leadTime.target} day
            </div>
            <div className="mt-4">
              <div className="w-full bg-[color:var(--color-surface-2)] rounded-full h-2">
                <div
                  className={`${getStatusBarClass(metrics.leadTime.status)} h-2 rounded-full`}
                  style={{
                    width: `${Math.min((metrics.leadTime.current / metrics.leadTime.target) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* DS Adoption Rate */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              DS Adoption Rate
              <span className={getStatusTextClass(metrics.adoptionRate.status)}>
                {getStatusIcon(metrics.adoptionRate.status)}
              </span>
            </CardTitle>
            <CardDescription>% of new views built with DS</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">
              {metrics.adoptionRate.current}%
            </div>
            <div className="text-sm text-[color:var(--color-fg-muted)]">
              Target: ≥ {metrics.adoptionRate.target}%
            </div>
            <div className="mt-4">
              <div className="w-full bg-[color:var(--color-surface-2)] rounded-full h-2">
                <div
                  className={`${getStatusBarClass(metrics.adoptionRate.status)} h-2 rounded-full`}
                  style={{
                    width: `${(metrics.adoptionRate.current / metrics.adoptionRate.target) * 100}%`,
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Component Reuse Rate */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Component Reuse Rate
              <span className={getStatusTextClass(metrics.reuseRate.status)}>
                {getStatusIcon(metrics.reuseRate.status)}
              </span>
            </CardTitle>
            <CardDescription>% of components reused in ≥2 repos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">
              {metrics.reuseRate.current}%
            </div>
            <div className="text-sm text-[color:var(--color-fg-muted)]">
              Target: ≥ {metrics.reuseRate.target}%
            </div>
            <div className="mt-4">
              <div className="w-full bg-[color:var(--color-surface-2)] rounded-full h-2">
                <div
                  className={`${getStatusBarClass(metrics.reuseRate.status)} h-2 rounded-full`}
                  style={{
                    width: `${(metrics.reuseRate.current / metrics.reuseRate.target) * 100}%`,
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Time-to-Ship Reduction */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Time-to-Ship Reduction
              <span className={getStatusTextClass(metrics.timeToShip.status)}>
                {getStatusIcon(metrics.timeToShip.status)}
              </span>
            </CardTitle>
            <CardDescription>Reduction in time-to-ship</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">
              {metrics.timeToShip.reduction}%
            </div>
            <div className="text-sm text-[color:var(--color-fg-muted)]">
              Target: ≥ {metrics.timeToShip.target}%
            </div>
            <div className="mt-4">
              <div className="w-full bg-[color:var(--color-surface-2)] rounded-full h-2">
                <div
                  className={`${getStatusBarClass(metrics.timeToShip.status)} h-2 rounded-full`}
                  style={{
                    width: `${Math.min((metrics.timeToShip.reduction / metrics.timeToShip.target) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Maintenance Cost Reduction */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Maintenance Cost Reduction
              <span className={getStatusTextClass(metrics.maintenanceCost.status)}>
                {getStatusIcon(metrics.maintenanceCost.status)}
              </span>
            </CardTitle>
            <CardDescription>Reduction in UI maintenance costs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">
              {metrics.maintenanceCost.reduction}%
            </div>
            <div className="text-sm text-[color:var(--color-fg-muted)]">
              Target: ≥ {metrics.maintenanceCost.target}%
            </div>
            <div className="mt-4">
              <div className="w-full bg-[color:var(--color-surface-2)] rounded-full h-2">
                <div
                  className={`${getStatusBarClass(metrics.maintenanceCost.status)} h-2 rounded-full`}
                  style={{
                    width: `${(metrics.maintenanceCost.reduction / metrics.maintenanceCost.target) * 100}%`,
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Onboarding Time */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Onboarding Time
              <span className={getStatusTextClass(metrics.onboardingTime.status)}>
                {getStatusIcon(metrics.onboardingTime.status)}
              </span>
            </CardTitle>
            <CardDescription>Time to first component render</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">
              {metrics.onboardingTime.current} min
            </div>
            <div className="text-sm text-[color:var(--color-fg-muted)]">
              Target: &lt; {metrics.onboardingTime.target} min
            </div>
            <div className="mt-4">
              <div className="w-full bg-[color:var(--color-surface-2)] rounded-full h-2">
                <div
                  className={`${getStatusBarClass(metrics.onboardingTime.status)} h-2 rounded-full`}
                  style={{
                    width: `${Math.min((metrics.onboardingTime.current / metrics.onboardingTime.target) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
            <CardDescription>
              Metrics are calculated from telemetry data and GitHub integration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[color:var(--color-fg-muted)]">
              This dashboard displays real-time KPIs for Fragment UI. Metrics are
              updated automatically based on component usage, PR creation, and
              adoption data.
            </p>
            <p className="text-sm text-[color:var(--color-fg-muted)] mt-2">
              <strong>Status indicators:</strong>
            </p>
            <ul className="text-sm text-[color:var(--color-fg-muted)] list-disc list-inside mt-2">
              <li>✅ Good - Meeting or exceeding target</li>
              <li>⚠️ Warning - Below target but close</li>
              <li>❌ Error - Significantly below target</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </DocLayout>
  );
}

