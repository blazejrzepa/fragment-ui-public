/**
 * Enhanced Dashboard scaffold
 * 
 * Generates a professional dashboard layout with:
 * - KPI cards (revenue, users, growth, churn)
 * - Charts (line, bar, pie) with real data structure
 * - Data tables with sorting and filtering
 * - Activity feed / Recent actions
 * - Quick actions panel
 * - Filters bar
 */

import type { UiSection, UiGrid, UiComponent, UiBlockRef, DataSource, Binding } from "@fragment_ui/ui-dsl";
import type { UiPage, UiLayout } from "../../../app/studio/dsl/types";

/**
 * Generate UUID v4
 */
function randomUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Create enhanced dashboard scaffold
 */
export function createDashboardScaffold(params?: {
  title?: string;
  includeSidebar?: boolean;
  includeHeader?: boolean;
  widgetCount?: number;
  includeCharts?: boolean;
  includeActivityFeed?: boolean;
  includeFilters?: boolean;
  includeQuickActions?: boolean;
  // Grid parameters for consistent layout
  gridGap?: number; // Gap between grid items (default: 6)
  gridPadding?: number; // Padding for content region (default: 6)
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full"; // Max width for content (default: "full")
}): UiPage {
  const {
    title = "Dashboard",
    includeSidebar = true,
    includeHeader = true,
    widgetCount = 4,
    includeCharts = true,
    includeActivityFeed = true,
    includeFilters = true,
    includeQuickActions = true,
    gridGap = 6, // Default gap between grid items
    gridPadding = 6, // Default padding for content region
    maxWidth = "full", // Full width for dashboard
  } = params || {};

  const pageId = randomUUID();
  
  // Main content sections (will be placed in content region or as regular sections)
  const sections: (UiSection | UiGrid)[] = [];

  // KPI Cards section - Professional metrics with real data structure
  const kpiGrid: UiGrid = {
    type: "grid",
    id: randomUUID(),
    columns: 4,
    responsive: {
      sm: 1,
      md: 2,
      lg: 4,
      xl: 4,
    },
    children: [
      {
        type: "component",
        id: randomUUID(),
        component: "MetricCard",
        props: {
          title: "Revenue",
          value: "{{kpiData.revenue.value}}",
          trend: "{{kpiData.revenue.trend}}",
          trendValue: "{{kpiData.revenue.trendValue}}",
          description: "{{kpiData.revenue.description}}",
        },
      } as UiComponent,
      {
        type: "component",
        id: randomUUID(),
        component: "MetricCard",
        props: {
          title: "New Customers",
          value: "1,234",
          trend: "-20%",
          trendValue: -20,
          trendDirection: "down",
          description: "Down 20% this period",
          status: "needs attention",
        },
      } as UiComponent,
      {
        type: "component",
        id: randomUUID(),
        component: "MetricCard",
        props: {
          title: "Active Accounts",
          value: "45,678",
          trend: "+12.5%",
          trendValue: 12.5,
          trendDirection: "up",
          description: "Strong user retention",
          status: "strong",
        },
      } as UiComponent,
      {
        type: "component",
        id: randomUUID(),
        component: "MetricCard",
        props: {
          title: "Growth Rate",
          value: "4.5%",
          trend: "+4.5%",
          trendValue: 4.5,
          trendDirection: "up",
          description: "Steady performance increase",
          status: "meets projections",
        },
      } as UiComponent,
    ],
  };
  sections.push(kpiGrid);

  // Filters Bar section (if enabled)
  if (includeFilters) {
    const filtersSection: UiSection = {
      type: "section",
      id: randomUUID(),
      variant: "card",
      title: "Filters",
      children: [
        {
          type: "component",
          id: randomUUID(),
          component: "FilterBar",
          props: {
            filters: [
              { key: "dateRange", label: "Date Range", type: "dateRange" },
              { key: "status", label: "Status", type: "select", options: ["All", "Active", "Inactive"] },
              { key: "category", label: "Category", type: "select", options: ["All", "Sales", "Support", "Marketing"] },
            ],
            onFilterChange: "handleFilterChange",
          },
        } as UiComponent,
      ],
    };
    sections.push(filtersSection);
  }

  // Charts section (if enabled) - Two column layout with charts
  if (includeCharts) {
    const chartsGrid: UiGrid = {
      type: "grid",
      id: randomUUID(),
      columns: 2,
      responsive: {
        sm: 1,
        md: 1,
        lg: 2,
        xl: 2,
      },
      children: [
        {
          type: "section",
          id: randomUUID(),
          variant: "card",
          title: "Revenue Trend",
          children: [
            {
              type: "component",
              id: randomUUID(),
              component: "Chart",
              props: {
                type: "line",
                data: "{{chartData.revenue}}",
                xKey: "date",
                yKey: "value",
                height: 300,
              },
            } as UiComponent,
          ],
        } as UiSection,
        {
          type: "section",
          id: randomUUID(),
          variant: "card",
          title: "User Distribution",
          children: [
            {
              type: "component",
              id: randomUUID(),
              component: "Chart",
              props: {
                type: "bar",
                data: "{{chartData.users}}",
                xKey: "category",
                yKey: "count",
                height: 300,
              },
            } as UiComponent,
          ],
        } as UiSection,
      ],
    };
    sections.push(chartsGrid);
  }

  // Main content area - Two column layout: Data Table + Activity Feed / Quick Actions
  const mainContentGrid: UiGrid = {
    type: "grid",
    id: randomUUID(),
    columns: 2,
    responsive: {
      sm: 1,
      md: 1,
      lg: 2,
      xl: 2,
    },
    children: [
      // Data Table section - Enhanced with sorting, filtering, pagination
      {
        type: "section",
        id: randomUUID(),
        kind: "dataTable",
        title: "Recent Activity",
        variant: "card",
        sectionData: {
          kind: "dataTable",
          title: "Recent Activity",
          columns: [
            { key: "id", label: "ID", sortable: true },
            { key: "name", label: "Name", sortable: true },
            { key: "status", label: "Status", kind: "badge" },
            { key: "date", label: "Date", sortable: true, kind: "date" },
            { key: "action", label: "Action", kind: "actions" },
          ],
          sortable: true,
          filterable: true,
          selectable: true,
          pagination: true,
          filters: [
            { type: "text", key: "name" },
            { type: "select", key: "status" },
          ],
        },
        dataSource: {
          id: "tableData",
          kind: "url",
          url: "/api/data/table",
          method: "GET",
        } as DataSource,
        children: [],
      } as UiSection,
      // Right column: Activity Feed or Quick Actions
      ...(includeActivityFeed && includeQuickActions
        ? [
            {
              type: "section",
              id: randomUUID(),
              variant: "card",
              title: "Recent Actions",
              children: [
                {
                  type: "component",
                  id: randomUUID(),
                  component: "ActivityFeed",
                  props: {
                    items: "{{activityData.items}}",
                    maxItems: 10,
                  },
                } as UiComponent,
              ],
            } as UiSection,
            {
              type: "section",
              id: randomUUID(),
              variant: "card",
              title: "Quick Actions",
              children: [
                {
                  type: "component",
                  id: randomUUID(),
                  component: "QuickActions",
                  props: {
                    actions: "{{quickActionsData.actions}}",
                  },
                } as UiComponent,
              ],
            } as UiSection,
          ]
        : includeActivityFeed
        ? [
            {
              type: "section",
              id: randomUUID(),
              variant: "card",
              title: "Recent Actions",
              children: [
                {
                  type: "component",
                  id: randomUUID(),
                  component: "ActivityFeed",
                  props: {
                    items: "{{activityData.items}}",
                    maxItems: 15,
                  },
                } as UiComponent,
              ],
            } as UiSection,
          ]
        : includeQuickActions
        ? [
            {
              type: "section",
              id: randomUUID(),
              variant: "card",
              title: "Quick Actions",
              children: [
                {
                  type: "component",
                  id: randomUUID(),
                  component: "QuickActions",
                  props: {
                    actions: "{{quickActionsData.actions}}",
                  },
                } as UiComponent,
              ],
            } as UiSection,
          ]
        : []),
    ],
  };
  sections.push(mainContentGrid);

  // Widget grid using DashboardWidgets block (optional, if widgetCount > 0)
  if (widgetCount > 0) {
  const dashboardWidgetsSection: UiSection = {
    type: "section",
    id: randomUUID(),
    variant: "card",
      title: "Additional Widgets",
    children: [
      {
        type: "block",
        id: randomUUID(),
        ref: "@fragment_ui/blocks/dashboard-widgets",
        inputs: {
          widgets: Array.from({ length: widgetCount }, (_, i) => ({
            id: `widget-${i + 1}`,
            type: "metric",
            title: `Widget ${i + 1}`,
            content: {
              type: "component",
              id: randomUUID(),
              component: "MetricCard",
              props: {
                title: `Metric ${i + 1}`,
                value: "0",
                description: "Widget description",
              },
            },
              span: i % 2 === 0 ? 1 : 1,
          })),
          columns: 12,
        },
      } as UiBlockRef,
    ],
  };
  sections.push(dashboardWidgetsSection);
  }

  // Define datasources for real data integration
  const dataSources: DataSource[] = [
    {
      id: "kpiData",
      kind: "url",
      url: "/api/data/kpis",
      method: "GET",
    },
    {
      id: "chartData",
      kind: "url",
      url: "/api/data/charts",
      method: "GET",
    },
    {
      id: "tableData",
      kind: "url",
      url: "/api/data/table",
      method: "GET",
    },
    {
      id: "activityData",
      kind: "url",
      url: "/api/data/activity",
      method: "GET",
    },
    {
      id: "quickActionsData",
      kind: "url",
      url: "/api/data/quick-actions",
      method: "GET",
    },
  ];

  // Build page with regions if sidebar or header is enabled
  if (includeSidebar || includeHeader) {
    const regions: any = {};
    
    // Header region with navigation and logo
    if (includeHeader) {
      regions.header = {
        id: randomUUID(),
        modules: [
          {
            id: randomUUID(),
            type: "navigation-header",
            title: "Navigation",
            props: {
              logo: {
                src: "/logo.svg",
                alt: title || "Dashboard",
                text: title || "Dashboard",
              },
              items: [
                { label: "Dashboard", href: "/dashboard", active: true },
                { label: "Analytics", href: "/analytics" },
                { label: "Projects", href: "/projects" },
                { label: "Team", href: "/team" },
                { label: "Settings", href: "/settings" },
              ],
              showSearch: true, // Enable search bar in header
              userMenu: {
                name: "User",
                email: "user@example.com",
                avatar: "/avatar.png",
              },
            },
          },
        ],
        content: [],
      };
    }
    
    // Sidebar region with navigation menu
    if (includeSidebar) {
      regions.sidebar = {
        id: randomUUID(),
        modules: [
          {
    id: randomUUID(),
            type: "navigation-sidebar",
            title: "Navigation",
            props: {
              items: [
                { label: "Dashboard", icon: "LayoutDashboard", href: "/dashboard", active: true },
                { label: "Analytics", icon: "BarChart", href: "/analytics" },
                { label: "Projects", icon: "Folder", href: "/projects" },
                { label: "Team", icon: "Users", href: "/team" },
              ],
              groups: [
                {
                  label: "Documents",
                  collapsed: false,
                  items: [
                    { label: "Data Library", href: "/documents/data-library" },
                    { label: "Reports", href: "/documents/reports" },
                    { label: "Word Assistant", href: "/documents/word-assistant" },
                  ],
                },
              ],
              footer: {
                userMenu: {
                  name: "User",
                  email: "user@example.com",
                  avatar: "/avatar.png",
                },
                label: "Version 1.0.0",
              },
            },
          },
        ],
        content: [],
      };
    }
    
    // Content region with all dashboard sections
    regions.content = {
      id: randomUUID(),
      modules: [],
      content: sections.map(section => ({
        ...section,
      })),
    };
    
    return {
      type: "screen",
      id: pageId,
      title,
      regions,
      sections: [], // Empty for Screen DSL
      layout: {
        columns: 12,
        gap: gridGap,
        maxWidth: maxWidth === "full" || maxWidth === "2xl" ? "xl" : maxWidth,
      } as any,
    };
  }
  
  // Return regular page layout without regions
  return {
    type: "page",
    id: pageId,
    title,
    sections: sections as any,
  };
}

