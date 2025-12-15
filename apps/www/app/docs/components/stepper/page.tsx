"use client";

import { useState } from "react";
import { Stepper, DocumentContent, CodeBlock, Button } from "@fragment_ui/ui";
import { Package, CreditCard, Truck, CheckCircle } from "lucide-react";
import { StorybookLinkWrapper as StorybookLink } from "../../../../src/components/storybook-link-wrapper";

export default function StepperPage() {
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    { id: "1", label: "Order Placed" },
    { id: "2", label: "Processing" },
    { id: "3", label: "Shipped" },
    { id: "4", label: "Delivered" },
  ];

  const stepsWithIcons = [
    { id: "1", label: "Order", icon: <Package size={16} /> },
    { id: "2", label: "Payment", icon: <CreditCard size={16} /> },
    { id: "3", label: "Shipping", icon: <Truck size={16} /> },
    { id: "4", label: "Complete", icon: <CheckCircle size={16} /> },
  ];

  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 className="text-3xl font-medium mb-4" id="page">
          Stepper
        </h1>
      </div>
      <p className="mb-6 intro-text">Guide users through multi-step flows.</p>

      {/* Horizontal Stepper */}
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[200px] p-10">
          <div className="w-full max-w-2xl space-y-4">
            <Stepper steps={steps} currentStep={currentStep} clickable onStepClick={setCurrentStep} />
            <div className="mt-2 flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}>
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">
            {`import { Stepper, Button } from "@fragment_ui/ui";
import { useState } from "react";

const steps = [
  { id: "1", label: "Order Placed" },
  { id: "2", label: "Processing" },
  { id: "3", label: "Shipped" },
  { id: "4", label: "Delivered" },
];

const [currentStep, setCurrentStep] = useState(1);

<Stepper steps={steps} currentStep={currentStep} clickable onStepClick={setCurrentStep} />`}
          </CodeBlock>
        </div>
      </div>

      {/* With Icons */}
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[200px] p-10">
          <div className="w-full max-w-2xl">
            <Stepper steps={stepsWithIcons} currentStep={2} />
          </div>
        </div>
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">
            {`import { Stepper } from "@fragment_ui/ui";
import { Package, CreditCard, Truck, CheckCircle } from "lucide-react";

const steps = [
  { id: "1", label: "Order", icon: <Package size={16} /> },
  { id: "2", label: "Payment", icon: <CreditCard size={16} /> },
  { id: "3", label: "Shipping", icon: <Truck size={16} /> },
  { id: "4", label: "Complete", icon: <CheckCircle size={16} /> },
];

<Stepper steps={steps} currentStep={2} />`}
          </CodeBlock>
        </div>
      </div>

      <h2 id="features">Features</h2>
      <ul>
        <li>Horizontal and vertical orientations</li>
        <li>Custom icons support</li>
        <li>Step descriptions</li>
        <li>Clickable steps (optional)</li>
        <li>Visual status indicators (completed, current, upcoming)</li>
        <li>Connector lines between steps</li>
        <li>Fully accessible</li>
      </ul>

      <h2 id="props">Props</h2>
      <div className="overflow-x-auto my-4">
        <table className="min-w-full border border-[color:var(--color-fg-muted)]">
          <thead>
            <tr>
              <th className="border border-[color:var(--color-fg-muted)] px-4 py-2 text-left">Prop</th>
              <th className="border border-[color:var(--color-fg-muted)] px-4 py-2 text-left">Type</th>
              <th className="border border-[color:var(--color-fg-muted)] px-4 py-2 text-left">Default</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-[color:var(--color-fg-muted)] px-4 py-2">steps</td>
              <td className="border border-[color:var(--color-fg-muted)] px-4 py-2">StepperStep[]</td>
              <td className="border border-[color:var(--color-fg-muted)] px-4 py-2">required</td>
            </tr>
            <tr>
              <td className="border border-[color:var(--color-fg-muted)] px-4 py-2">currentStep</td>
              <td className="border border-[color:var(--color-fg-muted)] px-4 py-2">number</td>
              <td className="border border-[color:var(--color-fg-muted)] px-4 py-2">required</td>
            </tr>
            <tr>
              <td className="border border-[color:var(--color-fg-muted)] px-4 py-2">orientation</td>
              <td className="border border-[color:var(--color-fg-muted)] px-4 py-2">"horizontal" | "vertical"</td>
              <td className="border border-[color:var(--color-fg-muted)] px-4 py-2">"horizontal"</td>
            </tr>
            <tr>
              <td className="border border-[color:var(--color-fg-muted)] px-4 py-2">clickable</td>
              <td className="border border-[color:var(--color-fg-muted)] px-4 py-2">boolean</td>
              <td className="border border-[color:var(--color-fg-muted)] px-4 py-2">false</td>
            </tr>
            <tr>
              <td className="border border-[color:var(--color-fg-muted)] px-4 py-2">onStepClick</td>
              <td className="border border-[color:var(--color-fg-muted)] px-4 py-2">(stepIndex: number) =&gt; void</td>
              <td className="border border-[color:var(--color-fg-muted)] px-4 py-2">-</td>
            </tr>
            <tr>
              <td className="border border-[color:var(--color-fg-muted)] px-4 py-2">showLabels</td>
              <td className="border border-[color:var(--color-fg-muted)] px-4 py-2">boolean</td>
              <td className="border border-[color:var(--color-fg-muted)] px-4 py-2">true</td>
            </tr>
            <tr>
              <td className="border border-[color:var(--color-fg-muted)] px-4 py-2">showDescriptions</td>
              <td className="border border-[color:var(--color-fg-muted)] px-4 py-2">boolean</td>
              <td className="border border-[color:var(--color-fg-muted)] px-4 py-2">false</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code">
        npx shadcn@latest add /r/stepper.json
      </CodeBlock>
      <h2 id="accessibility">Accessibility</h2>
      <p>Stepper provides proper ARIA labels and keyboard navigation support. Each step has an accessible label and role.</p>

      <h2 id="links">Links</h2>
      <ul>
        <li>
          <StorybookLink path="/story/core-stepper--default">View in Storybook</StorybookLink>
        </li>
      </ul>
    </DocumentContent>
  );
}

