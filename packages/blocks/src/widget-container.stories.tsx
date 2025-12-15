import type { Meta, StoryObj } from "@storybook/react";
import { WidgetContainer } from "./widget-container";
import { MetricCard } from "@fragment_ui/ui";

const meta: Meta<typeof WidgetContainer> = {
  title: "Blocks/WidgetContainer",
  component: WidgetContainer,
  tags: ["autodocs"],
  parameters: {
    a11y: {
      element: "#root",
    },
  },
};

export default meta;
type Story = StoryObj<typeof WidgetContainer>;

export const Default: Story = {
  args: {
    title: "Revenue Overview",
    children: (
      <div className="space-y-4">
        <MetricCard
          title="Total Revenue"
          value="$45,231"
          trend="up"
          trendValue="+20.1%"
        />
        <MetricCard
          title="Active Users"
          value="2,350"
          trend="up"
          trendValue="+12.5%"
        />
      </div>
    ),
  },
};

export const WithActions: Story = {
  args: {
    title: "Analytics",
    actions: (
      <>
        <button className="text-sm text-[color:var(--color-fg-muted)] hover:text-[color:var(--color-fg-base)]">
          View All
        </button>
      </>
    ),
    children: <div className="p-4">Widget content goes here</div>,
  },
};

export const Collapsible: Story = {
  args: {
    title: "Collapsible Widget",
    collapsible: true,
    defaultCollapsed: false,
    children: (
      <div className="p-4">
        <p>This widget can be collapsed</p>
        <p className="mt-2 text-sm text-[color:var(--color-fg-muted)]">
          Click the collapse button to hide/show content
        </p>
      </div>
    ),
  },
};

export const WithRefresh: Story = {
  args: {
    title: "Data Widget",
    onRefresh: () => alert("Refreshing data..."),
    children: (
      <div className="p-4">
        <p>Click the refresh button to reload data</p>
      </div>
    ),
  },
};

export const WithFooter: Story = {
  args: {
    title: "Widget with Footer",
    children: <div className="p-4">Main content area</div>,
    footer: (
      <div className="text-sm text-[color:var(--color-fg-muted)]">
        Last updated: {new Date().toLocaleString()}
      </div>
    ),
  },
};

