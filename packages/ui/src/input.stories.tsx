import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "./input";

const meta: Meta<typeof Input> = {
  title: "Core/Input",
  component: Input,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    placeholder: "Enter text...",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: "Disabled input",
  },
};

export const WithValue: Story = {
  args: {
    defaultValue: "Pre-filled value",
  },
};

export const Password: Story = {
  args: {
    type: "password",
    placeholder: "Enter password",
  },
};

export const Email: Story = {
  args: {
    type: "email",
    placeholder: "your@email.com",
  },
};

export const Number: Story = {
  args: {
    type: "number",
    placeholder: "Enter number",
  },
};

export const WithLabel: Story = {
  render: () => (
    <div className="space-y-2">
      <label htmlFor="input-label" className="text-sm font-medium">
        Label
      </label>
      <Input id="input-label" placeholder="With label" />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="space-y-2">
      <Input size="sm" placeholder="Small input" />
      <Input size="md" placeholder="Medium input (default)" />
      <Input size="lg" placeholder="Large input" />
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div className="space-y-2">
      <Input 
        size="sm"
        leadingIcon={<span>🔍</span>}
        placeholder="Search..."
      />
      <Input 
        size="sm"
        trailingIcon={<span>✓</span>}
        placeholder="With trailing icon"
      />
    </div>
  ),
};

export const Loading: Story = {
  args: {
    loading: true,
    placeholder: "Loading...",
  },
};

export const WithError: Story = {
  render: () => (
    <div className="space-y-2">
      <Input error placeholder="Error state" />
      <p className="text-sm text-[color:var(--color-accent-red)]">This field is required</p>
    </div>
  ),
};

export const FormExample: Story = {
  render: () => (
    <form className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <Input type="email" placeholder="your@email.com" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Password</label>
        <Input type="password" placeholder="••••••••" />
      </div>
    </form>
  ),
};

