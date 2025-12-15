import type { Meta, StoryObj } from "@storybook/react";
import { FeatureGridSection } from "./feature-grid-section";

const meta: Meta<typeof FeatureGridSection> = {
  title: "Blocks/FeatureGridSection",
  component: FeatureGridSection,
  tags: ["autodocs"],
  parameters: {
    a11y: {
      element: "#root",
    },
  },
};

export default meta;
type Story = StoryObj<typeof FeatureGridSection>;

const defaultFeatures = [
  {
    title: "Fast & Reliable",
    description: "Lightning-fast performance with 99.9% uptime",
    icon: "⚡",
  },
  {
    title: "Secure",
    description: "Enterprise-grade security for your data",
    icon: "🔒",
  },
  {
    title: "Scalable",
    description: "Grows with your business needs",
    icon: "📈",
  },
];

export const Default: Story = {
  args: {
    title: "Why Choose Us",
    description: "Everything you need to succeed",
    features: defaultFeatures,
    columns: 3,
  },
};

export const TwoColumns: Story = {
  args: {
    title: "Key Features",
    features: [
      ...defaultFeatures,
      {
        title: "24/7 Support",
        description: "Round-the-clock assistance when you need it",
        icon: "💬",
      },
    ],
    columns: 2,
  },
};

export const FourColumns: Story = {
  args: {
    title: "All Features",
    features: [
      ...defaultFeatures,
      {
        title: "24/7 Support",
        description: "Round-the-clock assistance",
        icon: "💬",
      },
      {
        title: "Easy Integration",
        description: "Connect with your favorite tools",
        icon: "🔌",
      },
      {
        title: "Analytics",
        description: "Track your performance metrics",
        icon: "📊",
      },
    ],
    columns: 4,
  },
};

export const WithoutIcons: Story = {
  args: {
    title: "Features",
    features: defaultFeatures.map(({ icon, ...rest }) => rest),
    columns: 3,
  },
};

