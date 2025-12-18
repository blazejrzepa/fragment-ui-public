"use client";

import { Progress, DocumentContent, CodeBlock, Collapsible, CollapsibleTrigger, CollapsibleContent } from "@fragment_ui/ui";
import { ExampleSection } from "../../../../src/components/example-section";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const progressLinearCode = `import { Progress } from "@fragment_ui/ui";

export function ProgressLinearDemo() {
  return (
    <div className="space-y-[var(--space-4)]">
      <Progress value={30} label="Uploading" showValue />
      <Progress value={75} color="success" />
    </div>
  );
}`;

const progressCircularCode = `import { Progress } from "@fragment_ui/ui";

export function ProgressCircularDemo() {
  return (
    <div className="flex gap-[var(--space-8)] items-center">
      <Progress value={40} variant="circular" size="sm" />
      <Progress value={65} variant="circular" size="md" />
      <Progress value={90} variant="circular" size="lg" color="info" />
    </div>
  );
}`;

const progressColorsCode = `import { Progress } from "@fragment_ui/ui";

export function ProgressColorsDemo() {
  return (
    <div className="space-y-[var(--space-4)]">
      <Progress value={40} color="default" />
      <Progress value={60} color="warning" />
      <Progress value={80} color="error" />
    </div>
  );
}`;

export default function ProgressPage() {
  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 id="progress">Progress</h1>
      </div>
      <p className="mb-6 intro-text">Visualize completion or loading state.</p>
      
      <ExampleSection
        id="progress-linear"
        title="Linear Progress"
        code={progressLinearCode}
      >
        <div className="flex gap-2 items-center justify-center w-full">
          <div className="w-full max-w-md space-y-[var(--space-4)]">
            <Progress value={30} label="Uploading" showValue />
            <Progress value={75} color="success" />
          </div>
        </div>
      </ExampleSection>

      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code" showLineNumbers={false} showCopyButton={false}>
        {`npx fragmentui@latest add progress`}
      </CodeBlock>

      <ExampleSection
        id="progress-circular"
        title="Circular Progress"
        code={progressCircularCode}
        marginTop="mt-8"
      >
        <div className="flex gap-2 items-center justify-center w-full">
          <div className="flex gap-[var(--space-8)] items-center justify-center w-full">
            <Progress value={40} variant="circular" size="sm" />
            <Progress value={65} variant="circular" size="md" />
            <Progress value={90} variant="circular" size="lg" color="info" />
          </div>
        </div>
      </ExampleSection>

      <ExampleSection
        id="progress-colors"
        title="Progress Colors"
        code={progressColorsCode}
        marginTop="mt-8"
      >
        <div className="flex gap-2 items-center justify-center w-full">
          <div className="w-full max-w-md space-y-[var(--space-4)]">
            <Progress value={40} color="default" />
            <Progress value={60} color="warning" />
            <Progress value={80} color="error" />
          </div>
        </div>
      </ExampleSection>

      <h2 id="api-reference">API Reference</h2>
      <div className="mt-4 border border-[color:var(--color-border-base)] rounded-lg overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <th className="text-left py-2 px-4 font-semibold text-sm">Component</th>
              <th className="text-left py-2 px-4 font-semibold text-sm">Props</th>
              <th className="text-left py-2 px-4 font-semibold text-sm">Default</th>
              <th className="text-left py-2 px-4 font-semibold text-sm">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-2 px-4"><code>Progress</code></td>
              <td className="py-2 px-4"><code>value?, max?, variant?, size?, color?, label?, showValue?, className?</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Progress indicator component (linear or circular)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <Collapsible className="mt-8">
        <CollapsibleTrigger className="w-full text-left">
          <h2 id="for-ai-automation" className="m-0">
            Agents & Copilots
          </h2>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4">
          <h3>Intent</h3>
          <p>
            <code>Progress</code> is a component for indicating completion of a task or process. Use it when you need to show the progress of an operation, upload, download, or any process that takes time. The component supports both linear and circular variants, with customizable colors, sizes, and labels.
          </p>

          <h3>When to use</h3>
          <ul>
            <li>File upload/download progress</li>
            <li>Form submission progress</li>
            <li>Loading states with progress indication</li>
            <li>Multi-step process tracking</li>
            <li>Task completion indicators</li>
            <li>Any scenario requiring progress visualization</li>
          </ul>

          <h3>UI-DSL Usage</h3>
          <p>
            Use <code>type: "component"</code> with <code>component: "Progress"</code>.
          </p>
          <p><strong>Props:</strong></p>
          <ul>
            <li><code>value?</code> – number (default: 0). Progress value (0-100) (optional)</li>
            <li><code>max?</code> – number (default: 100). Maximum value (optional)</li>
            <li><code>variant?</code> – "linear" | "circular" (default: "linear"). Progress variant (optional)</li>
            <li><code>size?</code> – "sm" | "md" | "lg" (default: "md"). Size of the progress indicator (optional)</li>
            <li><code>color?</code> – "default" | "success" | "warning" | "error" | "info" (default: "default"). Progress color (optional)</li>
            <li><code>label?</code> – string. Label text displayed above or inside the progress (optional)</li>
            <li><code>showValue?</code> – boolean (default: false). Show value percentage (optional)</li>
            <li><code>className?</code> – string. Additional CSS classes (optional)</li>
          </ul>

          <h3>Example</h3>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`{
  "type": "component",
  "component": "Progress",
  "props": {
    "value": 75,
    "variant": "linear",
    "color": "success",
    "label": "Uploading",
    "showValue": true
  }
}`}</CodeBlock>
        </CollapsibleContent>
      </Collapsible>
    </DocumentContent>
  );
}
