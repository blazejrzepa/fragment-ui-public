"use client";

import * as React from "react";
import { AppShell } from "../app-shell";
import { KpiStrip } from "../kpi-strip";
import { NavigationHeader } from "../navigation-header";
import type { AppShellProps } from "../app-shell";
import type { KpiStripProps, KpiStripMetric } from "../kpi-strip";

export interface DashboardTemplateProps {
  /**
   * Sidebar navigation content
   */
  sidebar?: React.ReactNode;
  /**
   * Sidebar header (logo, title)
   */
  sidebarHeader?: React.ReactNode;
  /**
   * Sidebar footer (user menu, etc.)
   */
  sidebarFooter?: React.ReactNode;
  /**
   * Header navigation links
   */
  headerLinks?: Array<{ label: string; href: string }>;
  /**
   * Header logo text
   */
  headerLogoText?: string;
  /**
   * KPI metrics to display
   */
  metrics?: KpiStripMetric[];
  /**
   * Number of columns for KPI strip
   * @default 4
   */
  kpiColumns?: 2 | 3 | 4;
  /**
   * Main content area
   */
  children?: React.ReactNode;
  /**
   * Additional AppShell props
   */
  appShellProps?: Omit<AppShellProps, "sidebar" | "sidebarHeader" | "sidebarFooter" | "header" | "children">;
}

/**
 * DashboardTemplate - Complete dashboard page template
 * 
 * A full-screen template combining AppShell, NavigationHeader, and KpiStrip
 * for creating standard dashboard pages.
 * 
 * @example
 * ```tsx
 * <DashboardTemplate
 *   sidebarHeader={<Logo />}
 *   sidebar={<NavigationMenu />}
 *   headerLinks={[
 *     { label: "Overview", href: "/" },
 *     { label: "Analytics", href: "/analytics" },
 *   ]}
 *   metrics={[
 *     { id: "users", title: "Users", value: "1,234", trend: "up", trendValue: "+12%" },
 *   ]}
 * >
 *   <YourDashboardContent />
 * </DashboardTemplate>
 * ```
 */
export function DashboardTemplate({
  sidebar,
  sidebarHeader,
  sidebarFooter,
  headerLinks,
  headerLogoText = "Dashboard",
  metrics,
  kpiColumns = 4,
  children,
  appShellProps,
}: DashboardTemplateProps) {
  const header = headerLinks ? (
    <NavigationHeader
      logoText={headerLogoText}
      links={headerLinks}
    />
  ) : undefined;

  return (
    <AppShell
      sidebar={sidebar}
      sidebarHeader={sidebarHeader}
      sidebarFooter={sidebarFooter}
      header={header}
      {...appShellProps}
    >
      <div className="space-y-6">
        {metrics && metrics.length > 0 && (
          <KpiStrip metrics={metrics} columns={kpiColumns} />
        )}
        {children}
      </div>
    </AppShell>
  );
}

