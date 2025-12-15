import type { Meta, StoryObj } from "@storybook/react";
import { Chart } from "./chart";

const meta: Meta<typeof Chart> = {
  title: "Core/Chart",
  component: Chart,
  tags: ["autodocs"],
  parameters: {
    a11y: {
      element: "#root",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Chart>;

const sampleData = [
  { label: "Jan", value: 1000 },
  { label: "Feb", value: 1500 },
  { label: "Mar", value: 1200 },
  { label: "Apr", value: 1800 },
  { label: "May", value: 2000 },
  { label: "Jun", value: 2500 },
];

export const LineChart: Story = {
  args: {
    title: "Revenue Over Time",
    description: "Monthly revenue for the past 6 months",
    data: sampleData,
    type: "line",
    height: 300,
  },
};

export const BarChart: Story = {
  args: {
    title: "Sales by Month",
    data: sampleData,
    type: "bar",
    height: 300,
  },
};

export const AreaChart: Story = {
  args: {
    title: "User Growth",
    data: sampleData,
    type: "area",
    height: 300,
  },
};

export const WithoutGrid: Story = {
  args: {
    title: "Revenue",
    data: sampleData,
    type: "line",
    showGrid: false,
    height: 300,
  },
};

export const WithoutLegend: Story = {
  args: {
    title: "Sales",
    data: sampleData,
    type: "bar",
    showLegend: false,
    height: 300,
  },
};

export const CustomHeight: Story = {
  args: {
    title: "Metrics",
    data: sampleData,
    type: "line",
    height: 200,
  },
};

export const WithCustomColors: Story = {
  args: {
    title: "Categories",
    data: [
      { label: "Category A", value: 100, color: "#ef4444" },
      { label: "Category B", value: 200, color: "#3b82f6" },
      { label: "Category C", value: 150, color: "#10b981" },
    ],
    type: "bar",
    height: 300,
  },
};

