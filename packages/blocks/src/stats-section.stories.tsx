import type { Meta, StoryObj } from "@storybook/react";
import { StatsSection } from "./stats-section";

const meta: Meta<typeof StatsSection> = {
  title: "Blocks/StatsSection",
  component: StatsSection,
  tags: ["autodocs"],
  parameters: {
    a11y: {
      element: "#root",
    },
  },
};

export default meta;
type Story = StoryObj<typeof StatsSection>;

const defaultStats = [
  { label: "Total Users", value: "1,200", trend: "up" as const, trendValue: "+12%" },
  { label: "Revenue", value: "$15,000", trend: "up" as const, trendValue: "+8%" },
  { label: "Active Sessions", value: "450", trend: "down" as const, trendValue: "-3%" },
  { label: "Conversion Rate", value: "3.2%", trend: "neutral" as const, trendValue: "0%" },
];

export const Default: Story = {
  args: {
    title: "Overview",
    items: defaultStats,
    layout: "grid",
    columns: 4,
  },
};

export const ThreeColumns: Story = {
  args: {
    title: "Key Metrics",
    items: defaultStats.slice(0, 3),
    layout: "grid",
    columns: 3,
  },
};

export const Horizontal: Story = {
  args: {
    title: "Dashboard Stats",
    items: defaultStats,
    layout: "horizontal",
  },
};

export const WithoutTrends: Story = {
  args: {
    title: "Simple Stats",
    items: defaultStats.map(({ trend, trendValue, ...rest }) => rest),
    layout: "grid",
    columns: 4,
  },
};

