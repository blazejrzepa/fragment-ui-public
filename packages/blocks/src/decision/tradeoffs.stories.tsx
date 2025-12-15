import type { Meta, StoryObj } from "@storybook/react";
import { Tradeoffs } from "./tradeoffs";

const meta: Meta<typeof Tradeoffs> = {
  title: "Blocks/Decision/Tradeoffs",
  component: Tradeoffs,
  tags: ["autodocs"],
  parameters: {
    a11y: {
      element: "#root",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tradeoffs>;

const defaultOptions = [
  {
    id: "option-1",
    name: "Quick Solution",
    description: "Fast implementation, higher cost",
    dimensions: [
      { name: "Cost", value: 80, label: "High" },
      { name: "Risk", value: 30, label: "Low" },
      { name: "Time", value: 20, label: "Fast" },
    ],
    ctaText: "Choose This",
    ctaOnClick: () => console.log("Quick solution clicked"),
    actionContractId: "action-quick",
  },
  {
    id: "option-2",
    name: "Balanced Approach",
    description: "Moderate cost, risk, and time",
    dimensions: [
      { name: "Cost", value: 50, label: "Medium" },
      { name: "Risk", value: 50, label: "Medium" },
      { name: "Time", value: 50, label: "Medium" },
    ],
    ctaText: "Choose This",
    ctaOnClick: () => console.log("Balanced clicked"),
    actionContractId: "action-balanced",
  },
  {
    id: "option-3",
    name: "Cost-Effective",
    description: "Lower cost, longer time, some risk",
    dimensions: [
      { name: "Cost", value: 20, label: "Low" },
      { name: "Risk", value: 60, label: "Medium-High" },
      { name: "Time", value: 80, label: "Slow" },
    ],
    ctaText: "Choose This",
    ctaOnClick: () => console.log("Cost-effective clicked"),
    actionContractId: "action-cost-effective",
  },
];

export const Default: Story = {
  args: {
    title: "Compare Tradeoffs",
    description: "Evaluate options across multiple dimensions",
    options: defaultOptions,
  },
};

