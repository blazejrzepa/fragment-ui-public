import type { Meta, StoryObj } from "@storybook/react";
import { Toggle } from "./toggle";
import { Bold, Italic, Underline } from "lucide-react";

const meta = {
  title: "Core/Toggle",
  component: Toggle,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Toggle aria-label="Toggle italic">Bold</Toggle>,
};

export const WithIcon: Story = {
  render: () => (
    <Toggle aria-label="Toggle italic">
      <Bold className="h-4 w-4" />
    </Toggle>
  ),
};

export const TextFormatting: Story = {
  render: () => (
    <div className="flex gap-2">
      <Toggle aria-label="Toggle bold">
        <Bold className="h-4 w-4" />
      </Toggle>
      <Toggle aria-label="Toggle italic">
        <Italic className="h-4 w-4" />
      </Toggle>
      <Toggle aria-label="Toggle underline">
        <Underline className="h-4 w-4" />
      </Toggle>
    </div>
  ),
};

export const Pressed: Story = {
  render: () => (
    <Toggle aria-label="Toggle italic" pressed>
      Bold
    </Toggle>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Toggle aria-label="Toggle italic" disabled>
      Bold
    </Toggle>
  ),
};

