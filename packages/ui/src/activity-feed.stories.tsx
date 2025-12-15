import type { Meta, StoryObj } from "@storybook/react";
import { ActivityFeed } from "./activity-feed";

const meta: Meta<typeof ActivityFeed> = {
  title: "Core/ActivityFeed",
  component: ActivityFeed,
  tags: ["autodocs"],
  parameters: {
    a11y: {
      element: "#root",
    },
  },
};

export default meta;
type Story = StoryObj<typeof ActivityFeed>;

const sampleActivities = [
  {
    id: "1",
    type: "action" as const,
    title: "John Doe created a new project",
    description: "Project 'Marketing Campaign 2024' was created",
    timestamp: new Date(Date.now() - 5 * 60000), // 5 minutes ago
    user: {
      name: "John Doe",
      avatar: "https://i.pravatar.cc/150?img=1",
    },
  },
  {
    id: "2",
    type: "update" as const,
    title: "Jane Smith updated settings",
    description: "Changed notification preferences",
    timestamp: new Date(Date.now() - 30 * 60000), // 30 minutes ago
    user: {
      name: "Jane Smith",
      avatar: "https://i.pravatar.cc/150?img=2",
    },
  },
  {
    id: "3",
    type: "comment" as const,
    title: "Mike Johnson commented",
    description: "Great work on the dashboard design!",
    timestamp: new Date(Date.now() - 2 * 3600000), // 2 hours ago
    user: {
      name: "Mike Johnson",
    },
  },
  {
    id: "4",
    type: "system" as const,
    title: "System backup completed",
    description: "Daily backup finished successfully",
    timestamp: new Date(Date.now() - 24 * 3600000), // 1 day ago
    icon: "🔒",
  },
];

export const Default: Story = {
  args: {
    items: sampleActivities,
  },
};

export const WithoutTimestamps: Story = {
  args: {
    items: sampleActivities,
    showTimestamps: false,
  },
};

export const LimitedItems: Story = {
  args: {
    items: sampleActivities,
    maxItems: 2,
  },
};

export const WithIcons: Story = {
  args: {
    items: [
      {
        id: "1",
        type: "action" as const,
        title: "Project created",
        timestamp: new Date(),
        icon: "✨",
      },
      {
        id: "2",
        type: "update" as const,
        title: "Settings updated",
        timestamp: new Date(Date.now() - 60000),
        icon: "⚙️",
      },
    ],
  },
};

