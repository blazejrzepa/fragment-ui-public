"use client";

import { useState } from "react";
import { Slider, DocumentContent, CodeBlock, Collapsible, CollapsibleTrigger, CollapsibleContent } from "@fragment_ui/ui";
import { ExampleSection } from "../../../../src/components/example-section";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const sliderCode = `import { Slider } from "@fragment_ui/ui";
import { useState } from "react";

export function SliderDemo() {
  const [value, setValue] = useState([50]);
  
  return (
    <div className="w-full max-w-md space-y-[var(--space-2)]">
      <p className="text-sm text-[color:var(--color-fg-muted)]">Value: {value[0]}</p>
      <Slider value={value} onValueChange={setValue} max={100} />
    </div>
  );
}`;

const sliderRangeCode = `import { Slider } from "@fragment_ui/ui";
import { useState } from "react";

export function SliderRangeDemo() {
  const [rangeValue, setRangeValue] = useState([20, 80]);
  
  return (
    <div className="w-full max-w-md space-y-[var(--space-2)]">
      <Slider value={rangeValue} onValueChange={setRangeValue} max={100} step={5} />
      <p className="text-sm text-[color:var(--color-fg-muted)]">
        Range: {rangeValue[0]} - {rangeValue[1]}
      </p>
    </div>
  );
}`;

export default function SliderPage() {
  const [value, setValue] = useState([50]);
  const [rangeValue, setRangeValue] = useState([20, 80]);

  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-[var(--space-4)] mb-[var(--space-1)]">
        <h1 id="slider">Slider</h1>
      </div>
      <p className="mb-[var(--space-6)] intro-text">Adjust a numeric value along a track.</p>

      <ExampleSection
        id="slider-example"
        title="Example"
        code={sliderCode}
      >
        <div className="flex gap-[var(--space-2)] items-center justify-center w-full">
          <div className="w-full max-w-md space-y-[var(--space-2)]">
            <p className="text-[length:var(--typography-size-sm)] text-[color:var(--color-fg-muted)]">Value: {value[0]}</p>
            <Slider value={value} onValueChange={setValue} max={100} />
          </div>
        </div>
      </ExampleSection>

      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code" showLineNumbers={false} showCopyButton={false}>
        {`npx fragmentui@latest add slider`}
      </CodeBlock>

      <ExampleSection
        id="slider-range"
        title="Range"
        code={sliderRangeCode}
        marginTop="mt-[var(--space-8)]"
      >
        <div className="flex gap-[var(--space-2)] items-center justify-center w-full">
          <div className="w-full max-w-md space-y-[var(--space-2)]">
            <Slider value={rangeValue} onValueChange={setRangeValue} max={100} step={5} />
            <p className="text-[length:var(--typography-size-sm)] text-[color:var(--color-fg-muted)]">
              Range: {rangeValue[0]} - {rangeValue[1]}
            </p>
          </div>
        </div>
      </ExampleSection>

      <h2 id="api-reference">API Reference</h2>
      <div className="mt-[var(--space-4)] border border-[color:var(--color-border-base)] rounded-[var(--radius-lg)] overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <th className="text-left py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]" font-semibold>Component</th>
              <th className="text-left py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]" font-semibold>Props</th>
              <th className="text-left py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]" font-semibold>Default</th>
              <th className="text-left py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]" font-semibold>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>Slider</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>value?, defaultValue?, onValueChange?, min?, max?, step?, disabled?, className?</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Range slider component for selecting numeric values</td>
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
            <code>Slider</code> is a component for picking a value from a continuous range. Use it when you need to allow users to select a numeric value by dragging a handle along a track. The component supports both single value and range selection, with customizable min, max, and step values.
          </p>

          <h3>When to use</h3>
          <ul>
            <li>Volume or brightness controls</li>
            <li>Price range filters</li>
            <li>Numeric input with visual feedback</li>
            <li>Settings with continuous values</li>
            <li>Any scenario requiring range selection</li>
          </ul>

          <h3>UI-DSL Usage</h3>
          <p>
            Use <code>type: "component"</code> with <code>component: "Slider"</code>.
          </p>
          <p><strong>Props:</strong></p>
          <ul>
            <li><code>value?</code> – number[]. Controlled value (array of numbers) (optional)</li>
            <li><code>defaultValue?</code> – number[]. Default value (array of numbers) (optional)</li>
            <li><code>onValueChange?</code> – function. Callback when value changes: <code>(value: number[]) {'=>'} void</code> (optional)</li>
            <li><code>min?</code> – number (default: 0). Minimum value (optional)</li>
            <li><code>max?</code> – number (default: 100). Maximum value (optional)</li>
            <li><code>step?</code> – number (default: 1). Step increment (optional)</li>
            <li><code>disabled?</code> – boolean. Disable the slider (optional)</li>
            <li><code>className?</code> – string. Additional CSS classes (optional)</li>
          </ul>
          <p><strong>Note:</strong> For single value, use <code>value={[50]}</code>. For range, use <code>value={[20, 80]}</code>.</p>

          <h3>Example</h3>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`{
  "type": "component",
  "component": "Slider",
  "props": {
    "value": [50],
    "onValueChange": "handleValueChange",
    "min": 0,
    "max": 100,
    "step": 1
  }
}`}</CodeBlock>
          <p className="mt-6"><strong>Range slider example:</strong></p>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`{
  "type": "component",
  "component": "Slider",
  "props": {
    "value": [20, 80],
    "onValueChange": "handleRangeChange",
    "min": 0,
    "max": 100,
    "step": 5
  }
}`}</CodeBlock>
        </CollapsibleContent>
      </Collapsible>
    </DocumentContent>
  );
}
