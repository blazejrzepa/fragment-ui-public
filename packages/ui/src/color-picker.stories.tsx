import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { ColorPicker } from "./color-picker";

const { useState } = React;

const meta: Meta<typeof ColorPicker> = {
  title: "Core/ColorPicker",
  component: ColorPicker,
  tags: ["autodocs"],
  parameters: {
    a11y: {
      element: "#root",
    },
  },
};

export default meta;
type Story = StoryObj<typeof ColorPicker>;

export const Default: Story = {
  render: () => {
    const [color, setColor] = useState("#3B82F6");
    return (
      <div className="p-4 space-y-4">
        <ColorPicker value={color} onChange={setColor} />
        <div className="text-sm">
          Selected color: <code className="px-2 py-1 bg-[color:var(--color-surface-2)] rounded">{color}</code>
        </div>
      </div>
    );
  },
};

export const WithHexFormat: Story = {
  render: () => {
    const [color, setColor] = useState("#FF5733");
    return (
      <div className="p-4 space-y-4">
        <ColorPicker value={color} onChange={setColor} format="hex" />
        <div className="text-sm">
          Selected color: <code className="px-2 py-1 bg-[color:var(--color-surface-2)] rounded">{color}</code>
        </div>
      </div>
    );
  },
};

export const WithRgbFormat: Story = {
  render: () => {
    const [color, setColor] = useState("#8B5CF6");
    return (
      <div className="p-4 space-y-4">
        <ColorPicker value={color} onChange={setColor} format="rgb" />
        <div className="text-sm">
          Selected color: <code className="px-2 py-1 bg-[color:var(--color-surface-2)] rounded">{color}</code>
        </div>
      </div>
    );
  },
};

export const WithHslFormat: Story = {
  render: () => {
    const [color, setColor] = useState("#10B981");
    return (
      <div className="p-4 space-y-4">
        <ColorPicker value={color} onChange={setColor} format="hsl" />
        <div className="text-sm">
          Selected color: <code className="px-2 py-1 bg-[color:var(--color-surface-2)] rounded">{color}</code>
        </div>
      </div>
    );
  },
};

export const WithoutPresets: Story = {
  render: () => {
    const [color, setColor] = useState("#EF4444");
    return (
      <div className="p-4 space-y-4">
        <ColorPicker value={color} onChange={setColor} showPresets={false} />
        <div className="text-sm">
          Selected color: <code className="px-2 py-1 bg-[color:var(--color-surface-2)] rounded">{color}</code>
        </div>
      </div>
    );
  },
};

export const CustomPresets: Story = {
  render: () => {
    const [color, setColor] = useState("#3B82F6");
    const customPresets = [
      "#3B82F6", // Blue
      "#10B981", // Green
      "#F59E0B", // Amber
      "#EF4444", // Red
      "#8B5CF6", // Purple
      "#EC4899", // Pink
      "#06B6D4", // Cyan
      "#6366F1", // Indigo
    ];
    return (
      <div className="p-4 space-y-4">
        <ColorPicker value={color} onChange={setColor} presets={customPresets} />
        <div className="text-sm">
          Selected color: <code className="px-2 py-1 bg-[color:var(--color-surface-2)] rounded">{color}</code>
        </div>
      </div>
    );
  },
};

export const Disabled: Story = {
  render: () => {
    return (
      <div className="p-4">
        <ColorPicker value="#3B82F6" disabled />
      </div>
    );
  },
};

