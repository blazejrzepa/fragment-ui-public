import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Textarea } from "./textarea";

const meta = {
  title: "Core/Textarea",
  component: Textarea,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Textarea placeholder="Enter your message..." />,
};

export const WithValue: Story = {
  render: () => (
    <Textarea
      defaultValue="This is some pre-filled text in the textarea component."
      placeholder="Enter text..."
    />
  ),
};

export const WithLabel: Story = {
  render: () => (
    <div className="w-full max-w-md space-y-2">
      <label className="text-sm font-medium">Description</label>
      <Textarea placeholder="Enter description..." />
    </div>
  ),
};

export const FixedHeight: Story = {
  render: () => (
    <Textarea
      className="h-32 resize-none"
      placeholder="Fixed height textarea (no resize)..."
    />
  ),
};

export const Disabled: Story = {
  render: () => (
    <Textarea
      disabled
      placeholder="Disabled textarea"
      value="This textarea is disabled"
    />
  ),
};

export const WithError: Story = {
  render: () => (
    <div className="w-full max-w-md space-y-2">
      <label className="text-sm font-medium">Email</label>
      <Textarea
        className="border-[color:var(--color-accent-red)]"
        placeholder="Enter email..."
        defaultValue="invalid@"
      />
      <p className="text-sm text-[color:var(--color-accent-red)]">
        Please enter a valid email address
      </p>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="w-full max-w-md space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Small</label>
        <Textarea className="text-sm" placeholder="Small textarea..." />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Default</label>
        <Textarea placeholder="Default textarea..." />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Large</label>
        <Textarea className="text-lg" placeholder="Large textarea..." />
      </div>
    </div>
  ),
};

export const AutoResize: Story = {
  render: () => (
    <div className="w-full max-w-md space-y-2">
      <label className="text-sm font-medium">Auto-resizing Textarea</label>
      <Textarea
        className="min-h-[100px] resize-none"
        placeholder="This textarea grows as you type..."
      />
    </div>
  ),
};

export const WithCharacterCount: Story = {
  render: () => {
    const [value, setValue] = useState("");
    const maxLength = 200;
    return (
      <div className="w-full max-w-md space-y-2">
        <label className="text-sm font-medium">Message</label>
        <Textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter your message..."
          maxLength={maxLength}
        />
        <div className="flex justify-between text-xs text-[color:var(--color-fg-muted)]">
          <span>{value.length} / {maxLength} characters</span>
          {value.length > maxLength * 0.9 && (
            <span className="text-[color:var(--color-accent-orange)]">
              Approaching limit
            </span>
          )}
        </div>
      </div>
    );
  },
};

export const Required: Story = {
  render: () => (
    <div className="w-full max-w-md space-y-2">
      <label className="text-sm font-medium">
        Description <span className="text-red-500">*</span>
      </label>
      <Textarea
        required
        placeholder="This field is required..."
        className="resize-none"
      />
      <p className="text-xs text-[color:var(--color-fg-muted)]">
        Please provide a detailed description
      </p>
    </div>
  ),
};

export const WithHelperText: Story = {
  render: () => (
    <div className="w-full max-w-md space-y-2">
      <label className="text-sm font-medium">Feedback</label>
      <Textarea
        placeholder="Share your thoughts..."
        rows={4}
      />
      <p className="text-xs text-[color:var(--color-fg-muted)]">
        Your feedback helps us improve our service
      </p>
    </div>
  ),
};

export const ReadOnly: Story = {
  render: () => (
    <div className="w-full max-w-md space-y-2">
      <label className="text-sm font-medium">Terms and Conditions</label>
      <Textarea
        readOnly
        value="By using this service, you agree to our terms and conditions. Please review them carefully before proceeding."
        className="resize-none bg-gray-50"
      />
    </div>
  ),
};

