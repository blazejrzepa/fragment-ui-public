import type { Meta, StoryObj } from "@storybook/react";
import { Stepper } from "./stepper";
import { useState } from "react";
import { Package, CreditCard, Truck, CheckCircle } from "lucide-react";

const meta: Meta<typeof Stepper> = {
  title: "Core/Stepper",
  component: Stepper,
  tags: ["autodocs"],
  parameters: {
    a11y: {
      element: "#root",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Stepper>;

const steps = [
  { id: "1", label: "Order Placed" },
  { id: "2", label: "Processing" },
  { id: "3", label: "Shipped" },
  { id: "4", label: "Delivered" },
];

const stepsWithIcons = [
  { id: "1", label: "Order Placed", icon: <Package className="w-5 h-5" /> },
  { id: "2", label: "Payment", icon: <CreditCard className="w-5 h-5" /> },
  { id: "3", label: "Shipping", icon: <Truck className="w-5 h-5" /> },
  { id: "4", label: "Delivered", icon: <CheckCircle className="w-5 h-5" /> },
];

const stepsWithDescriptions = [
  {
    id: "1",
    label: "Order Placed",
    description: "Your order has been placed successfully",
  },
  {
    id: "2",
    label: "Processing",
    description: "We're preparing your order",
  },
  {
    id: "3",
    label: "Shipped",
    description: "Your order is on the way",
  },
  {
    id: "4",
    label: "Delivered",
    description: "Your order has been delivered",
  },
];

export const Default: Story = {
  render: () => {
    const [currentStep, setCurrentStep] = useState(2);
    return (
      <div className="w-full max-w-2xl">
        <Stepper steps={steps} currentStep={currentStep} />
        <div className="mt-8 flex gap-2">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            className="px-4 py-2 rounded bg-brand text-white"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
            className="px-4 py-2 rounded bg-brand text-white"
          >
            Next
          </button>
        </div>
      </div>
    );
  },
};

export const Horizontal: Story = {
  render: () => {
    const [currentStep, setCurrentStep] = useState(1);
    return (
      <div className="w-full max-w-4xl">
        <Stepper
          steps={steps}
          currentStep={currentStep}
          orientation="horizontal"
        />
        <div className="mt-8 flex gap-2">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            className="px-4 py-2 rounded bg-brand text-white"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
            className="px-4 py-2 rounded bg-brand text-white"
          >
            Next
          </button>
        </div>
      </div>
    );
  },
};

export const Vertical: Story = {
  render: () => {
    const [currentStep, setCurrentStep] = useState(1);
    return (
      <div className="w-full max-w-md">
        <Stepper steps={steps} currentStep={currentStep} orientation="vertical" />
        <div className="mt-8 flex gap-2">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            className="px-4 py-2 rounded bg-brand text-white"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
            className="px-4 py-2 rounded bg-brand text-white"
          >
            Next
          </button>
        </div>
      </div>
    );
  },
};

export const WithIcons: Story = {
  render: () => {
    const [currentStep, setCurrentStep] = useState(2);
    return (
      <div className="w-full max-w-2xl">
        <Stepper steps={stepsWithIcons} currentStep={currentStep} />
        <div className="mt-8 flex gap-2">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            className="px-4 py-2 rounded bg-brand text-white"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentStep(Math.min(stepsWithIcons.length - 1, currentStep + 1))}
            className="px-4 py-2 rounded bg-brand text-white"
          >
            Next
          </button>
        </div>
      </div>
    );
  },
};

export const WithDescriptions: Story = {
  render: () => {
    const [currentStep, setCurrentStep] = useState(1);
    return (
      <div className="w-full max-w-2xl">
        <Stepper
          steps={stepsWithDescriptions}
          currentStep={currentStep}
          showDescriptions
        />
        <div className="mt-8 flex gap-2">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            className="px-4 py-2 rounded bg-brand text-white"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentStep(Math.min(stepsWithDescriptions.length - 1, currentStep + 1))}
            className="px-4 py-2 rounded bg-brand text-white"
          >
            Next
          </button>
        </div>
      </div>
    );
  },
};

export const Clickable: Story = {
  render: () => {
    const [currentStep, setCurrentStep] = useState(2);
    return (
      <div className="w-full max-w-2xl">
        <Stepper
          steps={steps}
          currentStep={currentStep}
          clickable
          onStepClick={setCurrentStep}
        />
        <div className="mt-4 text-sm text-[color:var(--color-fg-muted)]">
          Current step: {currentStep + 1}
        </div>
      </div>
    );
  },
};

