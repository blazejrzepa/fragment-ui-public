import type { Meta, StoryObj } from "@storybook/react";
import { Recommendation } from "./recommendation";

const meta: Meta<typeof Recommendation> = {
  title: "Blocks/Decision/Recommendation",
  component: Recommendation,
  tags: ["autodocs"],
  parameters: {
    a11y: {
      element: "#root",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Recommendation>;

const defaultOptions = [
  {
    id: "option-1",
    name: "Pro Plan",
    description: "Best for most users",
    rank: 1,
    reasoning: "Offers the best balance of features and price for professional use",
    score: 95,
    ctaText: "Get Started",
    ctaOnClick: () => console.log("Pro clicked"),
    actionContractId: "action-pro",
  },
  {
    id: "option-2",
    name: "Enterprise Plan",
    description: "For large teams",
    rank: 2,
    reasoning: "Great for teams that need advanced features and support",
    score: 85,
    ctaText: "Contact Sales",
    ctaOnClick: () => console.log("Enterprise clicked"),
    actionContractId: "action-enterprise",
  },
  {
    id: "option-3",
    name: "Starter Plan",
    description: "For individuals",
    rank: 3,
    reasoning: "Good starting point, but may need to upgrade soon",
    score: 70,
    ctaText: "Get Started",
    ctaOnClick: () => console.log("Starter clicked"),
    actionContractId: "action-starter",
  },
];

export const Default: Story = {
  args: {
    title: "Recommended for You",
    description: "Based on your needs, we recommend these options",
    options: defaultOptions,
  },
};

export const WithoutScore: Story = {
  args: {
    title: "Top Recommendations",
    options: defaultOptions.map(({ score, ...rest }) => rest),
  },
};

