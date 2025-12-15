"use client";

import { Avatar, Collapsible, CollapsibleTrigger, CollapsibleContent } from "@fragment_ui/ui";
import { OptimizedImage } from "../../../../src/components/optimized-image";
import { StorybookLinkWrapper as StorybookLink } from "../../../../src/components/storybook-link-wrapper";
import { CodeBlock, DocumentContent } from "@fragment_ui/ui";

export default function AvatarPage() {
  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 id="avatar" className="text-3xl font-medium mb-4">Avatar</h1>
      </div>
      <p className="mb-6 intro-text">
        Show a user's profile image or initials.
      </p>
      
      
      {/* With Image */}
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[400px] p-10">
          <div className="flex gap-4">
            <Avatar src="https://blakerzepa.com/assets/blake.avif" alt="User" />
          </div>
        </div>
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">{`import { Avatar } from "@fragment_ui/ui";

<Avatar src="https://blakerzepa.com/assets/blake.avif" alt="User" />`}</CodeBlock>
        </div>
      </div>

      {/* With Fallback */}
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[400px] p-10">
          <div className="flex gap-4">
            <Avatar alt="User">JD</Avatar>
          </div>
        </div>
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">{`import { Avatar } from "@fragment_ui/ui";

<Avatar alt="User">JD</Avatar>`}</CodeBlock>
        </div>
      </div>

      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code">{`npx shadcn@latest add https://fragmentui.com/r/avatar.json`}</CodeBlock>

      <Collapsible>
        <CollapsibleTrigger className="w-full text-left">
          <h2 id="for-ai-automation">
            Agents & Copilots
          </h2>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4">
          <p><strong>Intent</strong></p>
          <p>
            <code>Avatar</code> is a component for displaying user profile images or initials.<br />
            Use it when you need to show a user's identity, profile picture, or a visual representation of a person or entity in your interface.
          </p>

          <p><strong>When to use</strong></p>
          <ul>
            <li>User profiles and account pages</li>
            <li>Comments and activity feeds</li>
            <li>Navigation menus with user info</li>
            <li>Team member displays</li>
            <li>Contact lists and directories</li>
          </ul>

          <p><strong>UI-DSL usage</strong></p>
          <p>
            Use <code>type: "component"</code> with <code>component: "Avatar"</code>.
          </p>
          <p>Props:</p>
          <ul>
            <li><code>src?</code> – image URL (optional)</li>
            <li><code>alt</code> – alternative text for accessibility (required)</li>
            <li><code>fallback?</code> – custom fallback content (optional, defaults to first letter of alt)</li>
            <li><code>className?</code> – additional CSS classes (optional)</li>
          </ul>
          <p>If <code>src</code> is provided, the image will be displayed. If the image fails to load or <code>src</code> is not provided, the fallback content (or first letter of <code>alt</code>) will be shown.</p>

          <p><strong>Example</strong></p>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`{
  "type": "component",
  "component": "Avatar",
  "props": {
    "src": "https://example.com/avatar.jpg",
    "alt": "John Doe"
  }
}`}</CodeBlock>
          <p className="mt-4"><strong>With fallback:</strong></p>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`{
  "type": "component",
  "component": "Avatar",
  "props": {
    "alt": "John Doe",
    "fallback": "JD"
  }
}`}</CodeBlock>
        </CollapsibleContent>
      </Collapsible>

      <h2 id="links">Links</h2>
      <ul>
        <li>
          <StorybookLink path="/docs/display-avatar--docs">Storybook</StorybookLink>
        </li>
      </ul>

    </DocumentContent>
  );
}

