import type { Meta, StoryObj } from "@storybook/react";
import { Breadcrumbs } from "./breadcrumbs";

const meta: Meta<typeof Breadcrumbs> = {
  title: "Core/Breadcrumbs",
  component: Breadcrumbs,
  tags: ["autodocs"],
  parameters: {
    a11y: {
      element: "#root",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Breadcrumbs>;

export const Default: Story = {
  args: {
    items: [
      { label: "Home", href: "/" },
      { label: "Components", href: "/components" },
      { label: "Button" },
    ],
  },
};

export const WithCustomSeparator: Story = {
  args: {
    items: [
      { label: "Home", href: "/" },
      { label: "Documentation", href: "/docs" },
      { label: "Components", href: "/docs/components" },
      { label: "Breadcrumbs" },
    ],
    separator: <span className="text-[color:var(--color-fg-muted)]/50">›</span>,
  },
};

export const WithOnClick: Story = {
  args: {
    items: [
      { label: "Home", onClick: () => console.log("Home clicked") },
      { label: "Products", onClick: () => console.log("Products clicked") },
      { label: "Current Page" },
    ],
  },
};

export const LongPath: Story = {
  args: {
    items: [
      { label: "Home", href: "/" },
      { label: "Documentation", href: "/docs" },
      { label: "Components", href: "/docs/components" },
      { label: "Navigation", href: "/docs/components/navigation" },
      { label: "Breadcrumbs" },
    ],
  },
};

export const SingleItem: Story = {
  args: {
    items: [{ label: "Home" }],
  },
};

