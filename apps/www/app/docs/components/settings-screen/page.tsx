"use client";

import { DocumentContent, CodeBlock } from "@fragment_ui/ui";
import { SettingsScreen } from "@fragment_ui/blocks";
import { StorybookLinkWrapper as StorybookLink } from "../../../../src/components/storybook-link-wrapper";

export default function SettingsScreenPage() {
  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 className="text-3xl font-medium mb-4" id="page">
          Settings Screen
        </h1>
      </div>
      <p className="mb-6 intro-text">Template for account/app settings pages.</p>
      <h2>Overview</h2>
      
      <h2>Install</h2>
      <pre>
        <code>npx shadcn@latest add /r/settings-screen.json</code>
      </pre>
      
      <h2>Examples</h2>
      
      {/* Settings Screen */}
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[300px] p-10">
          <div className="w-full max-w-4xl">
            <SettingsScreen />
          </div>
        </div>
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">
            {`import { SettingsScreen } from "@fragment_ui/blocks";

<SettingsScreen />`}
          </CodeBlock>
        </div>
      </div>
      
      <h2>Features</h2>
      <ul>
        <li>Preferences section with switches</li>
        <li>Profile section with form fields</li>
        <li>Save button for changes</li>
        <li>Responsive layout</li>
      </ul>
      
      <h2>Accessibility</h2>
      <p>The screen uses accessible components from @fragment_ui/ui and is fully keyboard accessible.</p>
      
    </DocumentContent>
  );
}
