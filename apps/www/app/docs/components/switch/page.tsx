"use client";

import { useState } from "react";
import { Switch, DocumentContent, CodeBlock } from "@fragment_ui/ui";
import { StorybookLinkWrapper as StorybookLink } from "../../../../src/components/storybook-link-wrapper";

export default function SwitchPage() {
  const [enabled, setEnabled] = useState(false);

  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 className="text-3xl font-medium mb-4" id="page">
          Switch
        </h1>
      </div>
      <p className="mb-6 intro-text">Toggle a setting on or off.</p>

      {/* Default */}
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[150px] p-10">
          <div className="flex items-center gap-2">
            <Switch id="switch1" defaultChecked />
            <label htmlFor="switch1">Enable notifications</label>
          </div>
        </div>
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">
            {`import { Switch } from "@fragment_ui/ui";

<div className="flex items-center gap-2">
  <Switch id="switch1" defaultChecked />
  <label htmlFor="switch1">Enable notifications</label>
</div>`}
          </CodeBlock>
        </div>
      </div>

      {/* Controlled */}
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[150px] p-10">
          <div className="flex items-center gap-2">
            <Switch id="switch3" checked={enabled} onCheckedChange={setEnabled} />
            <label htmlFor="switch3">Controlled switch (Status: {enabled ? "ON" : "OFF"})</label>
          </div>
        </div>
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">
            {`import { Switch } from "@fragment_ui/ui";
import { useState } from "react";

const [enabled, setEnabled] = useState(false);

<div className="flex items-center gap-2">
  <Switch id="switch3" checked={enabled} onCheckedChange={setEnabled} />
  <label htmlFor="switch3">Controlled switch (Status: {enabled ? "ON" : "OFF"})</label>
</div>`}
          </CodeBlock>
        </div>
      </div>

      <h2>Accessibility</h2>
      <p>Switch supports keyboard (space/Enter), ARIA attributes and is compliant with WAI-ARIA switch pattern.</p>

      <h2>Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code">
        npx shadcn@latest add /r/switch.json
      </CodeBlock>
    </DocumentContent>
  );
}

