import type { Meta, StoryObj } from "@storybook/react";
import { Rating } from "./rating";
import { useState } from "react";

const meta: Meta<typeof Rating> = {
  title: "Components/Rating",
  component: Rating,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    max: {
      control: { type: "number", min: 1, max: 10, step: 1 },
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    half: {
      control: "boolean",
    },
    readOnly: {
      control: "boolean",
    },
    disabled: {
      control: "boolean",
    },
    showValue: {
      control: "boolean",
    },
    allowClear: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    defaultValue: 3,
  },
};

export const Interactive: Story = {
  render: () => {
    const [value, setValue] = useState(0);
    return (
      <div className="space-y-4">
        <Rating value={value} onChange={setValue} />
        <p className="text-sm text-gray-600">Current rating: {value}</p>
      </div>
    );
  },
};

export const WithHalfStars: Story = {
  args: {
    defaultValue: 3.5,
    half: true,
  },
};

export const ReadOnly: Story = {
  args: {
    value: 4,
    readOnly: true,
  },
};

export const WithValue: Story = {
  args: {
    defaultValue: 4,
    showValue: true,
  },
};

export const CustomMax: Story = {
  args: {
    defaultValue: 7,
    max: 10,
    showValue: true,
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-xs text-gray-600 mb-2">Small</p>
        <Rating defaultValue={3} size="sm" />
      </div>
      <div>
        <p className="text-xs text-gray-600 mb-2">Medium (default)</p>
        <Rating defaultValue={3} size="md" />
      </div>
      <div>
        <p className="text-xs text-gray-600 mb-2">Large</p>
        <Rating defaultValue={3} size="lg" />
      </div>
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    defaultValue: 3,
    disabled: true,
  },
};

export const AllowClear: Story = {
  render: () => {
    const [value, setValue] = useState(3);
    return (
      <div className="space-y-4">
        <Rating
          value={value}
          onChange={setValue}
          allowClear
        />
        <p className="text-sm text-gray-600">
          Current rating: {value} (click same value to clear)
        </p>
      </div>
    );
  },
};

export const HalfStarsInteractive: Story = {
  render: () => {
    const [value, setValue] = useState(0);
    return (
      <div className="space-y-4">
        <Rating
          value={value}
          onChange={setValue}
          half
          showValue
        />
        <p className="text-sm text-gray-600">Current rating: {value}</p>
      </div>
    );
  },
};

