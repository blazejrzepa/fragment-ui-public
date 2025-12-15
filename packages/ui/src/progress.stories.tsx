import type { Meta, StoryObj } from "@storybook/react";
import { Progress, StepProgress } from "./progress";
import { useState } from "react";

const meta: Meta<typeof Progress> = {
  title: "Feedback/Progress",
  component: Progress,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Progress>;

export const Default: Story = {
  args: {
    value: 33,
  },
};

export const WithLabel: Story = {
  args: {
    value: 65,
    label: "Upload Progress",
    showValue: true,
  },
};

export const Circular: Story = {
  args: {
    value: 75,
    variant: "circular",
    showValue: true,
  },
};

export const CircularWithLabel: Story = {
  args: {
    value: 50,
    variant: "circular",
    label: "Loading",
    showValue: true,
  },
};

export const Colors: Story = {
  render: () => (
    <div className="space-y-4">
      <Progress value={60} color="default" label="Default" showValue />
      <Progress value={60} color="success" label="Success" showValue />
      <Progress value={60} color="warning" label="Warning" showValue />
      <Progress value={60} color="error" label="Error" showValue />
      <Progress value={60} color="info" label="Info" showValue />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="space-y-4">
      <Progress value={60} size="sm" label="Small" />
      <Progress value={60} size="md" label="Medium" />
      <Progress value={60} size="lg" label="Large" />
    </div>
  ),
};

export const CircularSizes: Story = {
  render: () => (
    <div className="flex gap-8 items-center">
      <Progress value={75} variant="circular" size="sm" showValue />
      <Progress value={75} variant="circular" size="md" showValue />
      <Progress value={75} variant="circular" size="lg" showValue />
    </div>
  ),
};

export const Animated: Story = {
  render: () => {
    const [progress, setProgress] = useState(13);

    return (
      <div className="space-y-2">
        <Progress value={progress} label="Progress" showValue />
        <div className="flex gap-2">
          <button onClick={() => setProgress(Math.max(0, progress - 10))}>-10</button>
          <button onClick={() => setProgress(Math.min(100, progress + 10))}>+10</button>
        </div>
      </div>
    );
  },
};

export const StepProgressHorizontal: Story = {
  render: () => (
    <div className="w-full">
      <StepProgress
        steps={[
          { label: "Step 1", completed: true },
          { label: "Step 2", completed: true },
          { label: "Step 3", current: true },
          { label: "Step 4" },
          { label: "Step 5" },
        ]}
        orientation="horizontal"
      />
    </div>
  ),
};

export const StepProgressVertical: Story = {
  render: () => (
    <div className="w-full max-w-xs">
      <StepProgress
        steps={[
          { label: "Order Placed", completed: true },
          { label: "Processing", completed: true },
          { label: "Shipped", current: true },
          { label: "Out for Delivery" },
          { label: "Delivered" },
        ]}
        orientation="vertical"
      />
    </div>
  ),
};

