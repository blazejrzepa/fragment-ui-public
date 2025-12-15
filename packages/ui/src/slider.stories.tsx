import type { Meta, StoryObj } from "@storybook/react";
import { Slider } from "./slider";

const meta: Meta<typeof Slider> = {
  title: "Core/Slider",
  component: Slider,
  tags: ["autodocs"],
  parameters: {
    a11y: {
      element: "#root",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Slider>;

export const Default: Story = {
  args: {
    defaultValue: [50],
    max: 100,
    step: 1,
  },
};

export const Range: Story = {
  args: {
    defaultValue: [20, 80],
    max: 100,
    step: 1,
  },
};

export const WithSteps: Story = {
  args: {
    defaultValue: [25],
    max: 100,
    step: 25,
  },
};

export const Disabled: Story = {
  args: {
    defaultValue: [50],
    max: 100,
    step: 1,
    disabled: true,
  },
};

export const MinMax: Story = {
  args: {
    defaultValue: [30],
    min: 0,
    max: 100,
    step: 1,
  },
};


