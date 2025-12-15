import type { Meta, StoryObj } from "@storybook/react";
import { DashboardWidgets } from "./dashboard-widgets";
import { MetricCard, ActivityFeed, QuickActions } from "@fragment_ui/ui";

const meta: Meta<typeof DashboardWidgets> = {
  title: "Blocks/DashboardWidgets",
  component: DashboardWidgets,
  tags: ["autodocs"],
  parameters: {
    a11y: {
      element: "#root",
    },
  },
};

export default meta;
type Story = StoryObj<typeof DashboardWidgets>;

const sampleActivities = [
  {
    id: "1",
    type: "action" as const,
    title: "John Doe created a new project",
    timestamp: new Date(Date.now() - 5 * 60000),
    user: { name: "John Doe" },
  },
  {
    id: "2",
    type: "update" as const,
    title: "Jane Smith updated settings",
    timestamp: new Date(Date.now() - 30 * 60000),
    user: { name: "Jane Smith" },
  },
];

export const Default: Story = {
  args: {
    widgets: [
      {
        id: "1",
        type: "metric",
        title: "Revenue",
        content: <MetricCard title="Total Revenue" value="$45,231" trend="up" trendValue="+20.1%" />,
        span: 1,
      },
      {
        id: "2",
        type: "metric",
        title: "Users",
        content: <MetricCard title="Active Users" value="2,350" trend="up" trendValue="+12.5%" />,
        span: 1,
      },
      {
        id: "3",
        type: "activity",
        title: "Recent Activity",
        content: <ActivityFeed items={sampleActivities} />,
        span: 2,
      },
    ],
    columns: 12,
  },
};

export const MixedWidgets: Story = {
  args: {
    widgets: [
      {
        id: "1",
        type: "metric",
        content: <MetricCard title="Revenue" value="$45,231" />,
        span: 1,
      },
      {
        id: "2",
        type: "metric",
        content: <MetricCard title="Users" value="2,350" />,
        span: 1,
      },
      {
        id: "3",
        type: "quickActions",
        title: "Quick Actions",
        content: (
          <QuickActions
            actions={[
              { id: "1", label: "New Project", icon: "➕", onClick: () => {} },
              { id: "2", label: "Import", icon: "📥", onClick: () => {} },
            ]}
            columns={2}
          />
        ),
        span: 2,
      },
    ],
    columns: 12,
  },
};

export const FourColumnGrid: Story = {
  args: {
    widgets: [
      {
        id: "1",
        type: "metric",
        content: <MetricCard title="Metric 1" value="100" />,
        span: 1,
      },
      {
        id: "2",
        type: "metric",
        content: <MetricCard title="Metric 2" value="200" />,
        span: 1,
      },
      {
        id: "3",
        type: "metric",
        content: <MetricCard title="Metric 3" value="300" />,
        span: 1,
      },
      {
        id: "4",
        type: "metric",
        content: <MetricCard title="Metric 4" value="400" />,
        span: 1,
      },
    ],
    columns: 4,
  },
};

