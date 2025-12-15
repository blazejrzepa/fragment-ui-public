import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./button";

const meta: Meta<typeof Button> = {
  title: "Core/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    a11y: {
      element: "#root",
    },
    docs: {
      description: {
        component: `
**Design Intent:**
The Button component is the primary interactive element for user actions. It provides clear visual hierarchy through variants (solid, outline, ghost) and sizes (sm, md, lg). The component uses design tokens for colors, spacing, and typography, ensuring consistency across themes and density modes.

**Accessibility:**
- Keyboard navigable (Enter/Space)
- Focus indicators
- ARIA attributes for screen readers
- Respects prefers-reduced-motion
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Solid: Story = {
  args: {
    variant: "solid",
    children: "Button",
  },
};

export const Outline: Story = {
  args: {
    variant: "outline",
    children: "Button",
  },
};

export const Ghost: Story = {
  args: {
    variant: "ghost",
    children: "Button",
  },
};

export const Small: Story = {
  args: {
    size: "sm",
    children: "Small",
  },
};

export const Large: Story = {
  args: {
    size: "lg",
    children: "Large",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: "Disabled",
  },
};

export const WithLeadingIcon: Story = {
  args: {
    leadingIcon: "→",
    children: "Continue",
  },
};

export const WithTrailingIcon: Story = {
  args: {
    trailingIcon: "✓",
    children: "Save",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-2 flex-wrap">
      <Button variant="solid">Solid</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};

export const Loading: Story = {
  args: {
    disabled: true,
    children: "Loading...",
  },
};

export const Destructive: Story = {
  render: () => (
    <div className="flex gap-2">
      <Button variant="solid" className="bg-[color:var(--color-accent-red)]">
        Delete
      </Button>
      <Button variant="outline" className="border-[color:var(--color-accent-red)] text-[color:var(--color-accent-red)]">
        Cancel Delete
      </Button>
    </div>
  ),
};

