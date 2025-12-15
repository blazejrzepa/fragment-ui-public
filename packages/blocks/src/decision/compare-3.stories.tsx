import type { Meta, StoryObj } from "@storybook/react";
import { Compare3 } from "./compare-3";

const meta: Meta<typeof Compare3> = {
  title: "Blocks/Decision/Compare3",
  component: Compare3,
  tags: ["autodocs"],
  parameters: {
    a11y: {
      element: "#root",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Compare3>;

const defaultOptions = [
  {
    id: "option-1",
    name: "Starter",
    description: "Perfect for getting started",
    price: "$9",
    pricePeriod: "month",
    features: [
      { key: "storage", label: "Storage", value: "10GB" },
      { key: "support", label: "Support", value: "Email" },
      { key: "projects", label: "Projects", value: "5" },
      { key: "analytics", label: "Analytics", value: false },
    ],
    ctaText: "Get Started",
    ctaOnClick: () => console.log("Starter clicked"),
    actionContractId: "action-starter",
  },
  {
    id: "option-2",
    name: "Pro",
    description: "For professionals",
    price: "$29",
    pricePeriod: "month",
    popular: true,
    features: [
      { key: "storage", label: "Storage", value: "100GB" },
      { key: "support", label: "Support", value: "Priority" },
      { key: "projects", label: "Projects", value: "Unlimited" },
      { key: "analytics", label: "Analytics", value: true },
    ],
    ctaText: "Get Started",
    ctaOnClick: () => console.log("Pro clicked"),
    actionContractId: "action-pro",
  },
  {
    id: "option-3",
    name: "Enterprise",
    description: "For large teams",
    price: "$99",
    pricePeriod: "month",
    features: [
      { key: "storage", label: "Storage", value: "1TB" },
      { key: "support", label: "Support", value: "24/7" },
      { key: "projects", label: "Projects", value: "Unlimited" },
      { key: "analytics", label: "Analytics", value: true },
    ],
    ctaText: "Contact Sales",
    ctaOnClick: () => console.log("Enterprise clicked"),
    actionContractId: "action-enterprise",
  },
];

export const Default: Story = {
  args: {
    title: "Choose Your Plan",
    description: "Compare our plans and find the one that fits your needs",
    options: defaultOptions,
  },
};

export const WithoutTitle: Story = {
  args: {
    options: defaultOptions,
  },
};

export const TwoOptions: Story = {
  args: {
    title: "Compare Plans",
    options: defaultOptions.slice(0, 2),
  },
};

