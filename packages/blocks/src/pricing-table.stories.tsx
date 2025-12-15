import type { Meta, StoryObj } from "@storybook/react";
import { PricingTable } from "./pricing-table";

const meta: Meta<typeof PricingTable> = {
  title: "Blocks/PricingTable",
  component: PricingTable,
  tags: ["autodocs"],
  parameters: {
    a11y: {
      element: "#root",
    },
  },
};

export default meta;
type Story = StoryObj<typeof PricingTable>;

const defaultTiers = [
  {
    name: "Starter",
    description: "Perfect for getting started",
    price: "$9",
    pricePeriod: "month",
    features: [
      { name: "Up to 5 projects", included: true },
      { name: "10GB storage", included: true },
      { name: "Basic support", included: true },
      { name: "Advanced analytics", included: false },
      { name: "Custom domains", included: false },
    ],
    ctaText: "Get Started",
    ctaOnClick: () => console.log("Starter plan clicked"),
  },
  {
    name: "Pro",
    description: "For professionals",
    price: "$29",
    pricePeriod: "month",
    popular: true,
    features: [
      { name: "Unlimited projects", included: true },
      { name: "100GB storage", included: true },
      { name: "Priority support", included: true },
      { name: "Advanced analytics", included: true },
      { name: "Custom domains", included: true },
    ],
    ctaText: "Get Started",
    ctaOnClick: () => console.log("Pro plan clicked"),
  },
  {
    name: "Enterprise",
    description: "For teams and organizations",
    price: "$99",
    pricePeriod: "month",
    features: [
      { name: "Unlimited projects", included: true },
      { name: "Unlimited storage", included: true },
      { name: "24/7 support", included: true },
      { name: "Advanced analytics", included: true },
      { name: "Custom domains", included: true },
      { name: "SSO", included: true },
    ],
    ctaText: "Contact Sales",
    ctaOnClick: () => console.log("Enterprise plan clicked"),
  },
];

export const Default: Story = {
  args: {
    tiers: defaultTiers,
  },
};

export const TwoTiers: Story = {
  args: {
    tiers: [
      {
        name: "Free",
        description: "For personal projects",
        price: "$0",
        pricePeriod: "month",
        features: [
          { name: "1 project", included: true },
          { name: "1GB storage", included: true },
          { name: "Community support", included: true },
        ],
        ctaText: "Get Started",
      },
      {
        name: "Pro",
        description: "For professionals",
        price: "$29",
        pricePeriod: "month",
        popular: true,
        features: [
          { name: "Unlimited projects", included: true },
          { name: "100GB storage", included: true },
          { name: "Priority support", included: true },
        ],
        ctaText: "Upgrade",
      },
    ],
  },
};

export const FourTiers: Story = {
  args: {
    tiers: [
      {
        name: "Free",
        price: "$0",
        pricePeriod: "month",
        features: [
          { name: "1 project", included: true },
          { name: "1GB storage", included: true },
        ],
        ctaText: "Get Started",
      },
      {
        name: "Starter",
        price: "$9",
        pricePeriod: "month",
        features: [
          { name: "5 projects", included: true },
          { name: "10GB storage", included: true },
        ],
        ctaText: "Get Started",
      },
      {
        name: "Pro",
        price: "$29",
        pricePeriod: "month",
        popular: true,
        features: [
          { name: "Unlimited projects", included: true },
          { name: "100GB storage", included: true },
        ],
        ctaText: "Get Started",
      },
      {
        name: "Enterprise",
        price: "Custom",
        priceDescription: "Contact us for pricing",
        features: [
          { name: "Unlimited everything", included: true },
          { name: "Dedicated support", included: true },
        ],
        ctaText: "Contact Sales",
      },
    ],
  },
};

export const WithDisabledTier: Story = {
  args: {
    tiers: [
      {
        name: "Starter",
        price: "$9",
        pricePeriod: "month",
        features: [
          { name: "Up to 5 projects", included: true },
          { name: "10GB storage", included: true },
        ],
        ctaText: "Get Started",
      },
      {
        name: "Pro",
        price: "$29",
        pricePeriod: "month",
        popular: true,
        features: [
          { name: "Unlimited projects", included: true },
          { name: "100GB storage", included: true },
        ],
        ctaText: "Get Started",
      },
      {
        name: "Enterprise",
        price: "$99",
        pricePeriod: "month",
        disabled: true,
        features: [
          { name: "Unlimited everything", included: true },
        ],
        ctaText: "Coming Soon",
      },
    ],
  },
};

