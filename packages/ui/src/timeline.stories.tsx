import type { Meta, StoryObj } from "@storybook/react";
import { Timeline } from "./timeline";

const meta: Meta<typeof Timeline> = {
  title: "Core/Timeline",
  component: Timeline,
  tags: ["autodocs"],
  parameters: {
    a11y: {
      element: "#root",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Timeline>;

const events = [
  {
    id: "1",
    title: "Order Placed",
    description: "Your order has been placed successfully",
    timestamp: "2024-01-15 10:00 AM",
    status: "completed" as const,
  },
  {
    id: "2",
    title: "Processing",
    description: "We're preparing your order",
    timestamp: "2024-01-15 11:30 AM",
    status: "completed" as const,
  },
  {
    id: "3",
    title: "Shipped",
    description: "Your order is on the way",
    timestamp: "2024-01-16 2:00 PM",
    status: "current" as const,
  },
  {
    id: "4",
    title: "Delivered",
    description: "Your order will be delivered soon",
    timestamp: "2024-01-17",
    status: "upcoming" as const,
  },
];

const eventsWithError = [
  {
    id: "1",
    title: "Order Placed",
    timestamp: "2024-01-15 10:00 AM",
    status: "completed" as const,
  },
  {
    id: "2",
    title: "Processing",
    timestamp: "2024-01-15 11:30 AM",
    status: "completed" as const,
  },
  {
    id: "3",
    title: "Shipping Failed",
    timestamp: "2024-01-16 2:00 PM",
    description: "Unable to process shipping",
    status: "error" as const,
  },
  {
    id: "4",
    title: "Retry Shipping",
    timestamp: "2024-01-17",
    status: "upcoming" as const,
  },
];

export const Default: Story = {
  render: () => (
    <div className="w-full max-w-md">
      <Timeline events={events} />
    </div>
  ),
};

export const WithoutTimestamps: Story = {
  render: () => (
    <div className="w-full max-w-md">
      <Timeline events={events} showTimestamps={false} />
    </div>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <div className="w-full max-w-4xl">
      <Timeline events={events.slice(0, 3)} orientation="horizontal" />
    </div>
  ),
};

export const WithError: Story = {
  render: () => (
    <div className="w-full max-w-md">
      <Timeline events={eventsWithError} />
    </div>
  ),
};

export const ManyEvents: Story = {
  render: () => {
    const manyEvents = Array.from({ length: 10 }, (_, i) => ({
      id: `event-${i}`,
      title: `Event ${i + 1}`,
      description: `Description for event ${i + 1}`,
      timestamp: `2024-01-${15 + i} ${10 + i}:00 AM`,
      status: (i < 3 ? "completed" : i === 3 ? "current" : "upcoming") as const,
    }));
    return (
      <div className="w-full max-w-md">
        <Timeline events={manyEvents} />
      </div>
    );
  },
};

