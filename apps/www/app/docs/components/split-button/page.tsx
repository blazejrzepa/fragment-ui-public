"use client";

import { SplitButton, DocumentContent, CodeBlock } from "@fragment_ui/ui";
import { Download, Save, Share2 } from "lucide-react";
import { StorybookLinkWrapper as StorybookLink } from "../../../../src/components/storybook-link-wrapper";

export default function SplitButtonPage() {
  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 className="text-3xl font-medium mb-4" id="split-button">
          Split Button
        </h1>
      </div>
      <p className="mb-6 intro-text">Main action plus a dropdown of alternatives.</p>

      {/* Default */}
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[200px] p-10">
          <SplitButton
            primaryAction={{
              label: "Save",
              onClick: () => console.log("Save clicked"),
            }}
            options={[
              { label: "Save As", onClick: () => console.log("Save As clicked") },
              { label: "Save All", onClick: () => console.log("Save All clicked") },
            ]}
          />
        </div>
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">
            {`import { SplitButton } from "@fragment_ui/ui";

<SplitButton
  primaryAction={{ label: "Save", onClick: () => console.log("Save clicked") }}
  options={[
    { label: "Save As", onClick: () => console.log("Save As clicked") },
    { label: "Save All", onClick: () => console.log("Save All clicked") },
  ]} />`}
          </CodeBlock>
        </div>
      </div>

      {/* With Icons */}
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[200px] p-10">
          <SplitButton
            primaryAction={{
              label: "Download",
              icon: <Download size={16} />,
              onClick: () => console.log("Download clicked"),
            }}
            options={[
              { label: "Save", icon: <Save size={16} />, onClick: () => console.log("Save clicked") },
              { label: "Share", icon: <Share2 size={16} />, onClick: () => console.log("Share clicked") },
            ]}
          />
        </div>
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">
            {`import { SplitButton } from "@fragment_ui/ui";
import { Download, Save, Share2 } from "lucide-react";

<SplitButton
  primaryAction={{ label: "Download", icon: <Download size={16} />, onClick: () => console.log("Download clicked") }}
  options={[
    { label: "Save", icon: <Save size={16} />, onClick: () => console.log("Save clicked") },
    { label: "Share", icon: <Share2 size={16} />, onClick: () => console.log("Share clicked") },
  ]}
/>`}
          </CodeBlock>
        </div>
      </div>

      <h2 id="api">API</h2>
      <div className="my-6">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <th className="text-left p-2 font-semibold">Prop</th>
              <th className="text-left p-2 font-semibold">Type</th>
              <th className="text-left p-2 font-semibold">Default</th>
              <th className="text-left p-2 font-semibold">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="p-2 font-mono text-sm">primaryAction</td>
              <td className="p-2 text-sm">{"{ label: string; onClick: () => void; icon?: ReactNode }"}</td>
              <td className="p-2 text-sm">-</td>
              <td className="p-2 text-sm">Primary action button configuration</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="p-2 font-mono text-sm">options</td>
              <td className="p-2 text-sm">SplitButtonOption[]</td>
              <td className="p-2 text-sm">-</td>
              <td className="p-2 text-sm">Array of dropdown menu options</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="p-2 font-mono text-sm">variant</td>
              <td className="p-2 text-sm">"solid" | "outline" | "ghost"</td>
              <td className="p-2 text-sm">"solid"</td>
              <td className="p-2 text-sm">Button variant style</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="p-2 font-mono text-sm">size</td>
              <td className="p-2 text-sm">"sm" | "md" | "lg"</td>
              <td className="p-2 text-sm">"md"</td>
              <td className="p-2 text-sm">Button size</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="p-2 font-mono text-sm">disabled</td>
              <td className="p-2 text-sm">boolean</td>
              <td className="p-2 text-sm">false</td>
              <td className="p-2 text-sm">Disable interaction</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="p-2 font-mono text-sm">align</td>
              <td className="p-2 text-sm">"start" | "center" | "end"</td>
              <td className="p-2 text-sm">"end"</td>
              <td className="p-2 text-sm">Dropdown menu alignment</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="p-2 font-mono text-sm">side</td>
              <td className="p-2 text-sm">"top" | "right" | "bottom" | "left"</td>
              <td className="p-2 text-sm">"bottom"</td>
              <td className="p-2 text-sm">Dropdown menu side</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="p-2 font-mono text-sm">className</td>
              <td className="p-2 text-sm">string</td>
              <td className="p-2 text-sm">-</td>
              <td className="p-2 text-sm">Additional CSS classes</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="features">Features</h2>
      <ul className="list-disc list-inside space-y-2 my-4">
        <li>Primary action button</li>
        <li>Dropdown menu for secondary actions</li>
        <li>Icon support in primary action and options</li>
        <li>Three variants: solid, outline, ghost</li>
        <li>Three sizes: sm, md, lg</li>
        <li>Disabled state support</li>
        <li>Customizable dropdown alignment and side</li>
        <li>Fully accessible with keyboard navigation</li>
      </ul>

      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code">
        npx shadcn@latest add /r/split-button.json
      </CodeBlock>
    </DocumentContent>
  );
}

