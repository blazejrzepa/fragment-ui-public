import type { Meta, StoryObj } from "@storybook/react";
import { QuickActions } from "./quick-actions";

const meta: Meta<typeof QuickActions> = {
  title: "Core/QuickActions",
  component: QuickActions,
  tags: ["autodocs"],
  parameters: {
    a11y: {
      element: "#root",
    },
  },
};

export default meta;
type Story = StoryObj<typeof QuickActions>;

const sampleActions = [
  {
    id: "1",
    label: "New Project",
    icon: "➕",
    description: "Create a new project",
    onClick: () => alert("New project clicked"),
  },
  {
    id: "2",
    label: "Import Data",
    icon: "📥",
    description: "Import data from file",
    onClick: () => alert("Import clicked"),
  },
  {
    id: "3",
    label: "Export Report",
    icon: "📤",
    description: "Export current report",
    onClick: () => alert("Export clicked"),
  },
];

export const Default: Story = {
  args: {
    actions: sampleActions,
    layout: "grid",
    columns: 3,
  },
};

export const FourColumns: Story = {
  args: {
    actions: [
      ...sampleActions,
      {
        id: "4",
        label: "Settings",
        icon: "⚙️",
        description: "Open settings",
        onClick: () => alert("Settings clicked"),
      },
    ],
    layout: "grid",
    columns: 4,
  },
};

export const ListLayout: Story = {
  args: {
    actions: sampleActions,
    layout: "list",
  },
};

export const WithLinks: Story = {
  args: {
    actions: [
      {
        id: "1",
        label: "Dashboard",
        icon: "📊",
        description: "Go to dashboard",
        href: "/dashboard",
      },
      {
        id: "2",
        label: "Settings",
        icon: "⚙️",
        description: "Open settings",
        href: "/settings",
      },
    ],
    layout: "list",
  },
};

export const WithVariants: Story = {
  args: {
    actions: [
      {
        id: "1",
        label: "Primary Action",
        icon: "⭐",
        variant: "solid" as const,
        onClick: () => alert("Primary clicked"),
      },
      {
        id: "2",
        label: "Secondary Action",
        icon: "📝",
        variant: "outline" as const,
        onClick: () => alert("Secondary clicked"),
      },
      {
        id: "3",
        label: "Ghost Action",
        icon: "🔍",
        variant: "ghost" as const,
        onClick: () => alert("Ghost clicked"),
      },
    ],
    layout: "grid",
    columns: 3,
  },
};

