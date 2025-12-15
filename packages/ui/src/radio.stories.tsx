import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Radio, RadioGroup } from "./radio";

const meta = {
  title: "Core/Radio",
  component: RadioGroup,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="option1">
      <Radio value="option1" label="Option 1" />
      <Radio value="option2" label="Option 2" />
      <Radio value="option3" label="Option 3" />
    </RadioGroup>
  ),
};

export const WithDefaultValue: Story = {
  render: () => (
    <RadioGroup defaultValue="banana">
      <Radio value="apple" label="Apple" />
      <Radio value="banana" label="Banana" />
      <Radio value="orange" label="Orange" />
    </RadioGroup>
  ),
};

export const Disabled: Story = {
  render: () => (
    <RadioGroup defaultValue="option1" disabled>
      <Radio value="option1" label="Option 1 (selected)" />
      <Radio value="option2" label="Option 2 (disabled)" />
      <Radio value="option3" label="Option 3 (disabled)" />
    </RadioGroup>
  ),
};

export const ManyOptions: Story = {
  render: () => (
    <RadioGroup defaultValue="option1">
      <Radio value="option1" label="First Option" />
      <Radio value="option2" label="Second Option" />
      <Radio value="option3" label="Third Option" />
      <Radio value="option4" label="Fourth Option" />
      <Radio value="option5" label="Fifth Option" />
    </RadioGroup>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <RadioGroup defaultValue="option1" className="flex gap-4">
      <Radio value="option1" label="Option 1" />
      <Radio value="option2" label="Option 2" />
      <Radio value="option3" label="Option 3" />
    </RadioGroup>
  ),
};

export const WithDescriptions: Story = {
  render: () => (
    <RadioGroup defaultValue="basic">
      <Radio
        value="basic"
        label="Basic Plan"
        description="Perfect for individuals. Includes all core features."
      />
      <Radio
        value="pro"
        label="Pro Plan"
        description="For professionals. Advanced features and priority support."
      />
      <Radio
        value="enterprise"
        label="Enterprise Plan"
        description="For large organizations. Custom solutions and dedicated support."
      />
    </RadioGroup>
  ),
};

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState("option1");
    return (
      <div className="space-y-4">
        <RadioGroup value={value} onValueChange={setValue}>
          <Radio value="option1" label="Option 1" />
          <Radio value="option2" label="Option 2" />
          <Radio value="option3" label="Option 3" />
        </RadioGroup>
        <p className="text-sm text-gray-600">Selected: {value}</p>
      </div>
    );
  },
};

export const InForm: Story = {
  render: () => (
    <form className="w-full max-w-md space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Payment Method</label>
        <RadioGroup defaultValue="credit" name="payment">
          <Radio value="credit" label="Credit Card" />
          <Radio value="debit" label="Debit Card" />
          <Radio value="paypal" label="PayPal" />
        </RadioGroup>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Shipping Option <span className="text-red-500">*</span>
        </label>
        <RadioGroup defaultValue="standard" required>
          <Radio value="standard" label="Standard Shipping (5-7 days)" />
          <Radio value="express" label="Express Shipping (2-3 days)" />
          <Radio value="overnight" label="Overnight Shipping" />
        </RadioGroup>
      </div>
    </form>
  ),
};

export const SingleDisabled: Story = {
  render: () => (
    <RadioGroup defaultValue="option1">
      <Radio value="option1" label="Option 1 (enabled)" />
      <Radio value="option2" label="Option 2 (disabled)" disabled />
      <Radio value="option3" label="Option 3 (enabled)" />
    </RadioGroup>
  ),
};

