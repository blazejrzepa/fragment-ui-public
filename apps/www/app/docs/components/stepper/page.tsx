"use client";

import { useState } from "react";
import { Stepper, DocumentContent, CodeBlock, Button, Collapsible, CollapsibleTrigger, CollapsibleContent } from "@fragment_ui/ui";
import { Package, CreditCard, Truck, CheckCircle } from "lucide-react";
import { ExampleSection } from "../../../../src/components/example-section";

const stepperCode = `import { Stepper, Button } from "@fragment_ui/ui";
import { useState } from "react";

const steps = [
  { id: "1", label: "Order Placed" },
  { id: "2", label: "Processing" },
  { id: "3", label: "Shipped" },
  { id: "4", label: "Delivered" },
];

const [currentStep, setCurrentStep] = useState(1);

<Stepper steps={steps} currentStep={currentStep} clickable onStepClick={setCurrentStep} />`;

const stepperIconsCode = `import { Stepper } from "@fragment_ui/ui";
import { Package, CreditCard, Truck, CheckCircle } from "lucide-react";

const steps = [
  { id: "1", label: "Order", icon: <Package className="h-4 w-4" /> },
  { id: "2", label: "Payment", icon: <CreditCard className="h-4 w-4" /> },
  { id: "3", label: "Shipping", icon: <Truck className="h-4 w-4" /> },
  { id: "4", label: "Complete", icon: <CheckCircle className="h-4 w-4" /> },
];

<Stepper steps={steps} currentStep={2} />`;

export default function StepperPage() {
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    { id: "1", label: "Order Placed" },
    { id: "2", label: "Processing" },
    { id: "3", label: "Shipped" },
    { id: "4", label: "Delivered" },
  ];

  const stepsWithIcons = [
    { id: "1", label: "Order", icon: <Package className="h-4 w-4" /> },
    { id: "2", label: "Payment", icon: <CreditCard className="h-4 w-4" /> },
    { id: "3", label: "Shipping", icon: <Truck className="h-4 w-4" /> },
    { id: "4", label: "Complete", icon: <CheckCircle className="h-4 w-4" /> },
  ];

  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 id="stepper" className="text-[length:var(--typography-display-md-size)] font-medium">Stepper</h1>
      </div>
      <p className="mb-6 intro-text">Guide users through multi-step flows.</p>

      <ExampleSection
        id="stepper-example"
        title="Example"
        code={stepperCode}
      >
        <div className="flex gap-2 items-center justify-center w-full">
          <div className="w-full max-w-2xl space-y-[var(--space-4)]">
            <Stepper steps={steps} currentStep={currentStep} clickable onStepClick={setCurrentStep} />
            <div className="mt-[var(--space-2)] flex gap-[var(--space-2)]">
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
      </ExampleSection>

      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code" showLineNumbers={false} showCopyButton={false}>
        {`npx fragmentui@latest add stepper`}
      </CodeBlock>

      <ExampleSection
        id="stepper-icons"
        title="With Icons"
        code={stepperIconsCode}
        marginTop="mt-[var(--space-8)]"
      >
        <div className="flex gap-2 items-center justify-center w-full">
          <div className="w-full max-w-2xl">
            <Stepper steps={stepsWithIcons} currentStep={2} />
          </div>
        </div>
      </ExampleSection>

      <h2 id="api-reference">API Reference</h2>
      <div className="mt-[var(--space-4)] border border-[color:var(--color-border-base)] rounded-[var(--radius-lg)] overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <th className="text-left py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)] font-semibold">Component</th>
              <th className="text-left py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)] font-semibold">Props</th>
              <th className="text-left py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)] font-semibold">Default</th>
              <th className="text-left py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)] font-semibold">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>Stepper</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>steps, currentStep, orientation?, clickable?, onStepClick?, showLabels?, showDescriptions?, className?</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Multi-step progress indicator component</td>
            </tr>
          </tbody>
        </table>
      </div>

      <Collapsible className="mt-[var(--space-8)]">
        <CollapsibleTrigger className="w-full text-left">
          <h2 id="for-ai-automation" className="m-0">
            Agents & Copilots
          </h2>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-[var(--space-4)]">
          <h3>Intent</h3>
          <p>
            <code>Stepper</code> is a component for guiding users through multi-step flows. Use it when you need to show progress through a sequence of steps, such as forms, wizards, or processes. The component supports horizontal and vertical orientations, custom icons, and clickable steps.
          </p>

          <h3>When to use</h3>
          <ul>
            <li>Multi-step forms or wizards</li>
            <li>Order or process tracking</li>
            <li>Onboarding flows</li>
            <li>Progress indicators</li>
            <li>Any scenario requiring step-by-step guidance</li>
          </ul>

          <h3>UI-DSL Usage</h3>
          <p>
            Use <code>type: "component"</code> with <code>component: "Stepper"</code>.
          </p>
          <p><strong>Props:</strong></p>
          <ul>
            <li><code>steps</code> – StepperStep[]. Array of step objects, each with <code>id</code> (string), <code>label</code> (string), and optional <code>icon</code> (ReactNode) and <code>description</code> (string) (required)</li>
            <li><code>currentStep</code> – number. Current step index (0-based) (required)</li>
            <li><code>orientation?</code> – "horizontal" | "vertical" (default: "horizontal"). Stepper orientation (optional)</li>
            <li><code>clickable?</code> – boolean (default: false). Allow clicking steps to navigate (optional)</li>
            <li><code>onStepClick?</code> – function. Callback when step is clicked: <code>(stepIndex: number) {'=>'} void</code> (optional)</li>
            <li><code>showLabels?</code> – boolean (default: true). Show step labels (optional)</li>
            <li><code>showDescriptions?</code> – boolean (default: false). Show step descriptions (optional)</li>
            <li><code>className?</code> – string. Additional CSS classes (optional)</li>
          </ul>

          <h3>Example</h3>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`{
  "type": "component",
  "component": "Stepper",
  "props": {
    "steps": [
      { "id": "1", "label": "Order Placed" },
      { "id": "2", "label": "Processing" },
      { "id": "3", "label": "Shipped" },
      { "id": "4", "label": "Delivered" }
    ],
    "currentStep": 1,
    "clickable": true,
    "onStepClick": "handleStepClick"
  }
}`}</CodeBlock>
        </CollapsibleContent>
      </Collapsible>
    </DocumentContent>
  );
}
