import type { Meta, StoryObj } from "@storybook/react";
import { MetricCard } from "./metric-card";

const meta: Meta<typeof MetricCard> = {
  title: "Core/MetricCard",
  component: MetricCard,
  tags: ["autodocs"],
  parameters: {
    a11y: {
      element: "#root",
    },
  },
};

export default meta;
type Story = StoryObj<typeof MetricCard>;

export const Default: Story = {
  args: {
    title: "Total Revenue",
    value: "$45,231",
    description: "From last month",
  },
};

export const WithTrend: Story = {
  args: {
    title: "Total Revenue",
    value: "$45,231",
    description: "From last month",
    trend: "up",
    trendValue: "+20.1%",
  },
};

export const WithIcon: Story = {
  args: {
    title: "Active Users",
    value: "2,350",
    description: "180.1% increase",
    trend: "up",
    trendValue: "+12.5%",
    icon: "👥",
  },
};

export const WithDownTrend: Story = {
  args: {
    title: "Sales",
    value: "$12,234",
    description: "From last month",
    trend: "down",
    trendValue: "-19%",
    icon: "📉",
  },
};

export const Clickable: Story = {
  args: {
    title: "Clickable Card",
    value: "1,234",
    description: "Click to view details",
    onClick: () => alert("Card clicked!"),
  },
};

export const WithFooter: Story = {
  args: {
    title: "Subscriptions",
    value: "+235",
    description: "New subscriptions this month",
    trend: "up",
    trendValue: "+180.1%",
    footer: <div className="text-xs text-[color:var(--color-fg-muted)]">View all subscriptions →</div>,
  },
};

