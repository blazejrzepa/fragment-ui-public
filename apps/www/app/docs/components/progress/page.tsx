"use client";

import { Progress, StepProgress, DocumentContent, CodeBlock } from "@fragment_ui/ui";
import { StorybookLinkWrapper as StorybookLink } from "../../../../src/components/storybook-link-wrapper";

export default function ProgressPage() {
  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 className="text-3xl font-medium mb-4" id="page">
          Progress
        </h1>
      </div>
      <p className="mb-6 intro-text">Indicate completion of a task or process.</p>
      
      {/* Linear Progress */}
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[200px] p-10">
          <div className="w-full max-w-md space-y-4">
            <Progress value={30} label="Uploading" showValue />
            <Progress value={75} color="success" />
          </div>
        </div>
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">
            {`import { Progress } from "@fragment_ui/ui";

<div className="space-y-4">
  <Progress value={30} label="Uploading" showValue />
  <Progress value={75} color="success" />
</div>`}
          </CodeBlock>
        </div>
      </div>

      {/* Circular Progress */}
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[200px] p-10">
          <div className="flex gap-8 items-center">
            <Progress value={40} variant="circular" size="sm" />
            <Progress value={65} variant="circular" size="md" />
            <Progress value={90} variant="circular" size="lg" color="info" />
          </div>
        </div>
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">
            {`import { Progress } from "@fragment_ui/ui";

<div className="flex gap-8 items-center">
  <Progress value={40} variant="circular" size="sm" />
  <Progress value={65} variant="circular" size="md" />
  <Progress value={90} variant="circular" size="lg" color="info" />
</div>`}
          </CodeBlock>
        </div>
      </div>

      {/* Colors */}
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[200px] p-10">
          <div className="w-full max-w-md space-y-4">
            <Progress value={40} color="default" />
            <Progress value={60} color="warning" />
            <Progress value={80} color="error" />
          </div>
        </div>
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">
            {`import { Progress } from "@fragment_ui/ui";

<div className="space-y-4">
  <Progress value={40} color="default" />
  <Progress value={60} color="warning" />
  <Progress value={80} color="error" />
</div>`}
          </CodeBlock>
        </div>
      </div>
      
      <h2 id="features">Features</h2>
      <ul>
        <li>Linear and circular progress variants</li>
        <li>Step progress for multi-step workflows</li>
        <li>Custom colors (success, warning, error, info)</li>
        <li>Labels and value display</li>
        <li>Multiple sizes (sm, md, lg)</li>
        <li>Animated progress bar</li>
        <li>Customizable max value</li>
        <li>Accessible via Radix UI</li>
        <li>Smooth transitions</li>
      </ul>
      
      <h2 id="step-progress">Step Progress</h2>
      <p>Use StepProgress for multi-step workflows:</p>
      <div className="my-6">
        <StepProgress
          steps={[
            { label: "Order Placed", completed: true },
            { label: "Processing", completed: true },
            { label: "Shipped", current: true },
            { label: "Out for Delivery" },
            { label: "Delivered" },
          ]}
          orientation="horizontal"
        />
      </div>

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
              <td className="border border-[color:var(--color-fg-muted)] px-4 py-2">value</td>
              <td className="border border-[color:var(--color-fg-muted)] px-4 py-2">number</td>
              <td className="border border-[color:var(--color-fg-muted)] px-4 py-2">0</td>
            </tr>
            <tr>
              <td className="border border-[color:var(--color-fg-muted)] px-4 py-2">max</td>
              <td className="border border-[color:var(--color-fg-muted)] px-4 py-2">number</td>
              <td className="border border-[color:var(--color-fg-muted)] px-4 py-2">100</td>
            </tr>
            <tr>
              <td className="border border-[color:var(--color-fg-muted)] px-4 py-2">label</td>
              <td className="border border-[color:var(--color-fg-muted)] px-4 py-2">string</td>
              <td className="border border-[color:var(--color-fg-muted)] px-4 py-2">-</td>
            </tr>
            <tr>
              <td className="border border-[color:var(--color-fg-muted)] px-4 py-2">showValue</td>
              <td className="border border-[color:var(--color-fg-muted)] px-4 py-2">boolean</td>
              <td className="border border-[color:var(--color-fg-muted)] px-4 py-2">false</td>
            </tr>
            <tr>
              <td className="border border-[color:var(--color-fg-muted)] px-4 py-2">variant</td>
              <td className="border border-[color:var(--color-fg-muted)] px-4 py-2">"linear" | "circular"</td>
              <td className="border border-[color:var(--color-fg-muted)] px-4 py-2">"linear"</td>
            </tr>
            <tr>
              <td className="border border-[color:var(--color-fg-muted)] px-4 py-2">size</td>
              <td className="border border-[color:var(--color-fg-muted)] px-4 py-2">"sm" | "md" | "lg"</td>
              <td className="border border-[color:var(--color-fg-muted)] px-4 py-2">"md"</td>
            </tr>
            <tr>
              <td className="border border-[color:var(--color-fg-muted)] px-4 py-2">color</td>
              <td className="border border-[color:var(--color-fg-muted)] px-4 py-2">"default" | "success" | "warning" | "error" | "info"</td>
              <td className="border border-[color:var(--color-fg-muted)] px-4 py-2">"default"</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code">
        npx shadcn@latest add /r/progress.json
      </CodeBlock>
      <h2 id="accessibility">Accessibility</h2>
      <p>Progress uses Radix UI which provides proper ARIA attributes for screen readers.</p>
      
      <h2 id="links">Links</h2>
      <ul>
        <li>
          <StorybookLink path="/docs/feedback-progress--docs">View in Storybook</StorybookLink>
        </li>
      </ul>
    </DocumentContent>
  );
}

