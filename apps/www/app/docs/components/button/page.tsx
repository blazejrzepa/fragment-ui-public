"use client";

import { Button, DocumentContent, Collapsible, CollapsibleTrigger, CollapsibleContent, CodeBlock } from "@fragment_ui/ui";
import { ExampleSection } from "../../../../src/components/example-section";
import { Download, Settings, ArrowRight } from "lucide-react";

const example1Code = `import { Button } from "@fragment_ui/ui";
import { Settings } from "lucide-react";

export function ButtonExample1() {
  return (
    <>
      <Button variant="outline">Button</Button>
      <Button variant="outline" aria-label="Settings">
        <Settings className="h-4 w-4" />
      </Button>
    </>
  );
}`;

const sizeCode = `import { Button } from "@fragment_ui/ui";

export function ButtonSizeDemo() {
  return (
    <>
      <Button variant="outline" size="sm">Small</Button>
      <Button variant="outline" size="md">Medium</Button>
      <Button variant="outline" size="lg">Large</Button>
    </>
  );
}`;

const variantsCode = `import { Button } from "@fragment_ui/ui";

export function ButtonVariantsDemo() {
  return (
    <>
      <Button variant="solid">Solid</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="secondary">Secondary</Button>
    </>
  );
}`;

const iconCode = `import { Button } from "@fragment_ui/ui";
import { Settings } from "lucide-react";

export function ButtonIconDemo() {
  return (
    <Button variant="outline" size="sm" aria-label="Settings">
      <Settings className="h-4 w-4" />
    </Button>
  );
}`;

const withIconCode = `import { Button } from "@fragment_ui/ui";
import { Download, ArrowRight } from "lucide-react";

export function ButtonWithIconDemo() {
  return (
    <>
      <Button variant="outline" leadingIcon={<Download className="h-4 w-4" />}>
        Download
      </Button>
      <Button variant="outline" trailingIcon={<ArrowRight className="h-4 w-4" />}>
        Next
      </Button>
    </>
  );
}`;

const roundedCode = `import { Button } from "@fragment_ui/ui";
import { Settings } from "lucide-react";

export function ButtonRoundedDemo() {
  return (
    <Button 
      variant="outline" 
      size="sm" 
      radius="full"
      aria-label="Settings"
    >
      <Settings className="h-4 w-4" />
    </Button>
  );
}`;

const radiusCode = `import { Button } from "@fragment_ui/ui";

export function ButtonRadiusDemo() {
  return (
    <>
      <Button variant="outline" radius="none">None</Button>
      <Button variant="outline" radius="sm">Small</Button>
      <Button variant="outline" radius="md">Medium</Button>
      <Button variant="outline" radius="lg">Large</Button>
      <Button variant="outline" radius="full">Full</Button>
    </>
  );
}`;

const spinnerCode = `import { Button } from "@fragment_ui/ui";

export function ButtonSpinnerDemo() {
  return (
    <>
      <Button variant="outline" loading>Loading</Button>
      <Button variant="outline" loading loadingText="Processing...">
        Submit
      </Button>
    </>
  );
}`;

const buttonGroupCode = `import { Button } from "@fragment_ui/ui";

export function ButtonGroupDemo() {
  return (
    <>
      <Button variant="outline" className="rounded-r-none border-r-0">
        First
      </Button>
      <Button variant="outline" className="rounded-none border-r-0">
        Second
      </Button>
      <Button variant="outline" className="rounded-l-none">
        Third
      </Button>
    </>
  );
}`;

export default function ButtonPage() {
  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-[var(--space-4)] mb-[var(--space-1)]">
        <h1 id="button">Button</h1>
      </div>
      <p className="mb-[var(--space-6)] intro-text">Trigger actions or submit forms.</p>
      
      {/* Example 1: outline with text + icon button */}
      <ExampleSection
        id="button-example-1"
        title="Example"
        code={example1Code}
      >
        <div className="flex gap-[var(--space-2)] items-center justify-center">
          <Button variant="outline">Button</Button>
          <Button variant="outline" aria-label="Settings">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </ExampleSection>

      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code" showLineNumbers={false} showCopyButton={false}>
        {`npx fragmentui@latest add button`}
      </CodeBlock>

      {/* Size: text + icon, Outline small Medium Large */}
      <ExampleSection
        id="button-size"
        title="Size"
        code={sizeCode}
        marginTop="mt-[var(--space-8)]"
      >
        <div className="flex flex-col gap-[var(--space-4)]">
          <div className="flex gap-[var(--space-2)] items-center justify-center">
            <Button variant="outline" size="sm">Small</Button>
            <Button variant="outline" size="md">Medium</Button>
            <Button variant="outline" size="lg">Large</Button>
          </div>
        </div>
      </ExampleSection>

      {/* Variants: solid, outline, ghost, secondary */}
      <ExampleSection
        id="button-variants"
        title="Variants"
        code={variantsCode}
        marginTop="mt-[var(--space-8)]"
      >
        <div className="flex gap-[var(--space-2)] items-center justify-center">
          <Button variant="solid">Solid</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="secondary">Secondary</Button>
        </div>
      </ExampleSection>

      {/* Icon: only icon */}
      <ExampleSection
        id="button-icon"
        title="Icon"
        code={iconCode}
        marginTop="mt-[var(--space-8)]"
      >
        <div className="flex gap-[var(--space-2)] items-center justify-center">
          <Button variant="outline" size="sm" aria-label="Settings">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </ExampleSection>

      {/* With icon: text + icon */}
      <ExampleSection
        id="button-with-icon"
        title="With Icon"
        code={withIconCode}
        marginTop="mt-[var(--space-8)]"
      >
        <div className="flex gap-[var(--space-2)] items-center justify-center">
          <Button variant="outline" leadingIcon={<Download className="h-4 w-4" />}>
            Download
          </Button>
          <Button variant="outline" trailingIcon={<ArrowRight className="h-4 w-4" />}>
            Next
          </Button>
        </div>
      </ExampleSection>

      {/* Radius: all radius options */}
      <ExampleSection
        id="button-radius"
        title="Radius"
        code={radiusCode}
        marginTop="mt-[var(--space-8)]"
      >
        <div className="flex gap-[var(--space-2)] items-center justify-center">
          <Button variant="outline" radius="none">None</Button>
          <Button variant="outline" radius="sm">Small</Button>
          <Button variant="outline" radius="md">Medium</Button>
          <Button variant="outline" radius="lg">Large</Button>
          <Button variant="outline" radius="full">Full</Button>
        </div>
      </ExampleSection>

      {/* Rounded: icon, outline and high border radius */}
      <ExampleSection
        id="button-rounded"
        title="Rounded"
        code={roundedCode}
        marginTop="mt-[var(--space-8)]"
      >
        <div className="flex gap-[var(--space-2)] items-center justify-center">
          <Button 
            variant="outline" 
            size="sm" 
            radius="full"
            aria-label="Settings"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </ExampleSection>

      {/* Spinner: spinner and text */}
      <ExampleSection
        id="button-spinner"
        title="Spinner"
        code={spinnerCode}
        marginTop="mt-[var(--space-8)]"
      >
        <div className="flex gap-[var(--space-2)] items-center justify-center">
          <Button variant="outline" loading>Loading</Button>
          <Button variant="outline" loading loadingText="Processing...">
            Submit
          </Button>
        </div>
      </ExampleSection>

      {/* Button group */}
      <ExampleSection
        id="button-group"
        title="Button Group"
        code={buttonGroupCode}
        marginTop="mt-[var(--space-8)]"
      >
        <div className="flex gap-[var(--space-0)] justify-center">
          <Button variant="outline" className="rounded-r-none border-r-0">
            First
          </Button>
          <Button variant="outline" className="rounded-none border-r-0">
            Second
          </Button>
          <Button variant="outline" className="rounded-l-none">
            Third
          </Button>
        </div>
      </ExampleSection>

      {/* Disabled */}
      <ExampleSection
        id="button-disabled"
        title="Disabled"
        code={`import { Button } from "@fragment_ui/ui";

export function ButtonDisabledDemo() {
  return (
    <>
      <Button variant="solid" disabled>Disabled</Button>
      <Button variant="outline" disabled>Disabled</Button>
      <Button variant="ghost" disabled>Disabled</Button>
      <Button variant="secondary" disabled>Disabled</Button>
    </>
  );
}`}
        marginTop="mt-[var(--space-8)]"
      >
        <div className="flex gap-[var(--space-2)] items-center justify-center">
          <Button variant="solid" disabled style={{ backgroundColor: "var(--color-brand-primary)", color: "var(--color-brand-primary-600)" }}>Disabled</Button>
          <Button variant="outline" disabled>Disabled</Button>
          <Button variant="ghost" disabled>Disabled</Button>
          <Button variant="secondary" disabled>Disabled</Button>
        </div>
      </ExampleSection>

      {/* API Reference */}
      <h2 id="api" className="mt-[var(--space-8)]">API Reference</h2>
      <div className="mt-[var(--space-4)] border border-[color:var(--color-border-base)] rounded-[var(--radius-lg)] overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <th className="text-left py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)] font-semibold">Prop</th>
              <th className="text-left py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)] font-semibold">Type</th>
              <th className="text-left py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)] font-semibold">Default</th>
              <th className="text-left py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)] font-semibold">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>variant</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">
                <div className="flex gap-[var(--space-1)] flex-wrap">
                  <code>"solid"</code>
                  <code>"outline"</code>
                  <code>"ghost"</code>
                  <code>"secondary"</code>
                </div>
              </td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>"solid"</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Visual style variant of the button</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>size</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">
                <div className="flex gap-[var(--space-1)] flex-wrap">
                  <code>"sm"</code>
                  <code>"md"</code>
                  <code>"lg"</code>
                </div>
              </td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>"md"</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Size of the button</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>radius</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">
                <div className="flex gap-[var(--space-1)] flex-wrap">
                  <code>"none"</code>
                  <code>"sm"</code>
                  <code>"md"</code>
                  <code>"lg"</code>
                  <code>"full"</code>
                </div>
              </td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>"sm"</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Border radius of the button</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>leadingIcon</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>React.ReactNode</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Icon displayed before the button text</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>trailingIcon</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>React.ReactNode</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Icon displayed after the button text</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>loading</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>boolean</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>false</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Shows loading spinner and disables the button</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>loadingText</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>string</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Custom text to display when loading (overrides children)</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>disabled</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>boolean</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>false</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Disables the button</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>children</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>React.ReactNode</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Button text content (required)</td>
            </tr>
            <tr>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>className</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>string</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Additional CSS classes</td>
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
          <p><strong>Intent</strong></p>
          <p>
            <code>Button</code> is a primary interactive component for triggering user actions. Use it to provide clear, actionable controls for form submissions, navigation, confirmations, or any user-initiated process.
          </p>

          <p><strong>When to use</strong></p>
          <ul>
            <li>Primary actions that require user confirmation (submit, save, confirm)</li>
            <li>Secondary actions (cancel, back, skip)</li>
            <li>Navigation triggers (next, previous, go to)</li>
            <li>Opening modals, dialogs, or dropdowns</li>
            <li>Any explicit user interaction that initiates a process</li>
          </ul>

          <p><strong>UI-DSL Usage</strong></p>
          <p>
            Use <code>type: "component"</code> with <code>component: "Button"</code>.
          </p>
          
          <p><strong>Props</strong></p>
          <ul>
            <li><code>variant?</code> – <code>"solid"</code> (default), <code>"outline"</code>, <code>"ghost"</code>, or <code>"secondary"</code>. Use <code>"solid"</code> for primary actions, <code>"outline"</code> for secondary, <code>"ghost"</code> for tertiary, and <code>"secondary"</code> as an alternative to outline.</li>
            <li><code>size?</code> – <code>"sm"</code>, <code>"md"</code> (default), or <code>"lg"</code></li>
            <li><code>radius?</code> – <code>"none"</code>, <code>"sm"</code> (default), <code>"md"</code>, <code>"lg"</code>, or <code>"full"</code></li>
            <li><code>leadingIcon?</code> – React element or icon object displayed before text</li>
            <li><code>trailingIcon?</code> – React element or icon object displayed after text</li>
            <li><code>loading?</code> – boolean (default: <code>false</code>). Shows spinner and disables button</li>
            <li><code>loadingText?</code> – string. Custom text shown during loading (overrides children)</li>
            <li><code>disabled?</code> – boolean (default: <code>false</code>). Disables interaction</li>
            <li><code>children</code> – string or React node. Button label (required, except for icon-only buttons)</li>
            <li><code>onClick?</code> – function. Click handler: <code>(event: MouseEvent) =&gt; void</code></li>
            <li><code>aria-label?</code> – string. Required for icon-only buttons for accessibility</li>
            <li><code>className?</code> – string. Additional CSS classes</li>
          </ul>

          <h3 className="mt-[var(--space-6)] mb-[var(--space-4)]">Basic Example</h3>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`{
  "type": "component",
  "component": "Button",
  "props": {
    "variant": "solid",
    "size": "md"
  },
  "children": "Submit"
}`}</CodeBlock>

          <h3 className="mt-[var(--space-6)] mb-[var(--space-4)]">Variants</h3>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`[
  {
    "type": "component",
    "component": "Button",
    "props": { "variant": "solid" },
    "children": "Primary Action"
  },
  {
    "type": "component",
    "component": "Button",
    "props": { "variant": "outline" },
    "children": "Secondary Action"
  },
  {
    "type": "component",
    "component": "Button",
    "props": { "variant": "ghost" },
    "children": "Tertiary Action"
  },
  {
    "type": "component",
    "component": "Button",
    "props": { "variant": "secondary" },
    "children": "Alternative Action"
  }
]`}</CodeBlock>

          <h3 className="mt-[var(--space-6)] mb-[var(--space-4)]">With Leading Icon</h3>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`{
  "type": "component",
  "component": "Button",
  "props": {
    "variant": "solid",
    "leadingIcon": {
      "type": "icon",
      "name": "Download",
      "size": 16
    }
  },
  "children": "Download"
}`}</CodeBlock>

          <h3 className="mt-[var(--space-6)] mb-[var(--space-4)]">With Trailing Icon</h3>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`{
  "type": "component",
  "component": "Button",
  "props": {
    "variant": "outline",
    "trailingIcon": {
      "type": "icon",
      "name": "ArrowRight",
      "size": 16
    }
  },
  "children": "Next"
}`}</CodeBlock>

          <h3 className="mt-[var(--space-6)] mb-[var(--space-4)]">Icon-Only Button</h3>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`{
  "type": "component",
  "component": "Button",
  "props": {
    "variant": "outline",
    "size": "sm",
    "aria-label": "Settings",
    "children": {
      "type": "icon",
      "name": "Settings",
      "size": 16
    }
  }
}`}</CodeBlock>

          <h3 className="mt-[var(--space-6)] mb-[var(--space-4)]">Loading State</h3>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`{
  "type": "component",
  "component": "Button",
  "props": {
    "variant": "solid",
    "loading": true,
    "disabled": true,
    "children": "Submitting..."
  }
}`}</CodeBlock>

          <h3 className="mt-[var(--space-6)] mb-[var(--space-4)]">Loading with Custom Text</h3>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`{
  "type": "component",
  "component": "Button",
  "props": {
    "variant": "solid",
    "loading": true,
    "loadingText": "Processing...",
    "disabled": true,
    "children": "Submit"
  }
}`}</CodeBlock>

          <h3 className="mt-[var(--space-6)] mb-[var(--space-4)]">Disabled State</h3>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`{
  "type": "component",
  "component": "Button",
  "props": {
    "variant": "outline",
    "disabled": true
  },
  "children": "Disabled"
}`}</CodeBlock>

          <h3 className="mt-[var(--space-6)] mb-[var(--space-4)]">Custom Radius</h3>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`{
  "type": "component",
  "component": "Button",
  "props": {
    "variant": "outline",
    "radius": "full",
    "size": "sm",
    "aria-label": "Settings",
    "children": {
      "type": "icon",
      "name": "Settings",
      "size": 16
    }
  }
}`}</CodeBlock>

          <h3 className="mt-[var(--space-6)] mb-[var(--space-4)]">Accessibility Notes</h3>
          <ul>
            <li>Icon-only buttons must include <code>aria-label</code> for screen readers</li>
            <li>Buttons are keyboard accessible (Enter/Space keys)</li>
            <li>Focus states are automatically handled</li>
            <li>Disabled buttons are not interactive and have reduced opacity</li>
            <li>Loading buttons are automatically disabled</li>
          </ul>
        </CollapsibleContent>
      </Collapsible>
    </DocumentContent>
  );
}
