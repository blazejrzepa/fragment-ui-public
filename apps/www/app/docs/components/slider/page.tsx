"use client";

import { useState } from "react";
import { Slider, DocumentContent, CodeBlock } from "@fragment_ui/ui";
import { StorybookLinkWrapper as StorybookLink } from "../../../../src/components/storybook-link-wrapper";

export default function SliderPage() {
  const [value, setValue] = useState([50]);
  const [rangeValue, setRangeValue] = useState([20, 80]);

  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 className="text-3xl font-medium mb-4" id="page">
          Slider
        </h1>
      </div>
      <p className="mb-6 intro-text">Pick a value from a continuous range.</p>

      {/* Default */}
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[200px] p-10">
          <div className="w-full max-w-md space-y-2">
            <p className="text-sm text-[color:var(--color-fg-muted)]">Value: {value[0]}</p>
            <Slider value={value} onValueChange={setValue} max={100} />
          </div>
        </div>
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">
            {`import { Slider } from "@fragment_ui/ui";
import { useState } from "react";

const [value, setValue] = useState([50]);

<div className="w-full max-w-md space-y-2">
  <p className="text-sm text-[color:var(--color-fg-muted)]">Value: {value[0]}</p>
  <Slider value={value} onValueChange={setValue} max={100} />
</div>`}
          </CodeBlock>
        </div>
      </div>

      {/* Range */}
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[200px] p-10">
          <div className="w-full max-w-md space-y-2">
            <Slider value={rangeValue} onValueChange={setRangeValue} max={100} step={5} />
            <p className="text-sm text-[color:var(--color-fg-muted)]">
              Range: {rangeValue[0]} - {rangeValue[1]}
            </p>
          </div>
        </div>
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">
            {`import { Slider } from "@fragment_ui/ui";
import { useState } from "react";

const [rangeValue, setRangeValue] = useState([20, 80]);

<div className="w-full max-w-md space-y-2">
  <Slider value={rangeValue} onValueChange={setRangeValue} max={100} step={5} />
  <p className="text-sm text-[color:var(--color-fg-muted)]">
    Range: {rangeValue[0]} - {rangeValue[1]}
  </p>
</div>`}
          </CodeBlock>
        </div>
      </div>

      <h2 id="props">Props</h2>
      <ul>
        <li>
          <code>value</code> - Controlled value (array of numbers)
        </li>
        <li>
          <code>defaultValue</code> - Default value (array of numbers)
        </li>
        <li>
          <code>onValueChange</code> - Callback when value changes
        </li>
        <li>
          <code>min</code> - Minimum value (default: 0)
        </li>
        <li>
          <code>max</code> - Maximum value (default: 100)
        </li>
        <li>
          <code>step</code> - Step increment (default: 1)
        </li>
        <li>
          <code>disabled</code> - Disable the slider
        </li>
        <li>
          <code>className</code> - Additional CSS classes
        </li>
      </ul>

      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code">
        npx shadcn@latest add /r/slider.json
      </CodeBlock>
      <h2 id="accessibility">Accessibility</h2>
      <p>
        Slider is fully keyboard accessible with arrow keys, Home/End keys, and Page Up/Down. It includes proper ARIA
        attributes and is compliant with WCAG 2.1.
      </p>

      <h2 id="links">Links</h2>
      <ul>
        <li></li>
      </ul>
    </DocumentContent>
  );
}

