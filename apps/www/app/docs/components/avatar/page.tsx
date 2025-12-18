"use client";

import { Avatar, Collapsible, CollapsibleTrigger, CollapsibleContent, CodeBlock, DocumentContent, Badge } from "@fragment_ui/ui";
import { ExampleSection } from "../../../../src/components/example-section";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const avatarWithImageCode = `import { Avatar } from "@fragment_ui/ui";

export function AvatarWithImageDemo() {
  return <Avatar src="https://blakerzepa.com/assets/blake.avif" alt="User" />;
}`;

const avatarWithFallbackCode = `import { Avatar } from "@fragment_ui/ui";

export function AvatarWithFallbackDemo() {
  return <Avatar alt="User">JD</Avatar>;
}`;

export default function AvatarPage() {
  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 id="avatar">Avatar</h1>
      </div>
      <p className="mb-6 intro-text">Display user profile image or initials.</p>
      
      <ExampleSection
        id="avatar-with-image"
        title="Avatar with Image"
        code={avatarWithImageCode}
      >
        <div className="flex gap-2 items-center justify-center">
          <Avatar src="https://blakerzepa.com/assets/blake.avif" alt="User" />
        </div>
      </ExampleSection>

      <ExampleSection
        id="avatar-with-fallback"
        title="Avatar with Fallback"
        code={avatarWithFallbackCode}
        marginTop="mt-8"
      >
        <div className="flex gap-2 items-center justify-center">
          <Avatar alt="User">JD</Avatar>
        </div>
      </ExampleSection>

      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code" showLineNumbers={false} showCopyButton={false}>
        {`npx fragmentui@latest add avatar`}
      </CodeBlock>

      {/* API Reference */}
      <h2 id="api" className="mt-8">API Reference</h2>
      <div className="mt-4 border border-[color:var(--color-border-base)] rounded-lg overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <th className="text-left py-2 px-4 font-semibold text-sm">Prop</th>
              <th className="text-left py-2 px-4 font-semibold text-sm">Type</th>
              <th className="text-left py-2 px-4 font-semibold text-sm">Default</th>
              <th className="text-left py-2 px-4 font-semibold text-sm">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-2 px-4"><code>src</code></td>
              <td className="py-2 px-4"><code>string</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Image URL to display</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-2 px-4"><code>alt</code></td>
              <td className="py-2 px-4"><code>string</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Alternative text for accessibility. Used for fallback if image fails to load</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-2 px-4"><code>fallback</code></td>
              <td className="py-2 px-4"><code>React.ReactNode</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Custom fallback content. Defaults to first letter of <code>alt</code> if not provided</td>
            </tr>
            <tr>
              <td className="py-2 px-4"><code>className</code></td>
              <td className="py-2 px-4"><code>string</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Additional CSS classes</td>
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
          <p><strong>Intent</strong></p>
          <p>
            <code>Avatar</code> is a component for displaying user profile images or initials. Use it when you need to show a user's identity, profile picture, or a visual representation of a person or entity in your interface.
          </p>

          <p><strong>When to use</strong></p>
          <ul>
            <li>User profiles and account pages</li>
            <li>Comments and activity feeds</li>
            <li>Navigation menus with user info</li>
            <li>Team member displays</li>
            <li>Contact lists and directories</li>
          </ul>

          <p><strong>UI-DSL Usage</strong></p>
          <p>
            Use <code>type: "component"</code> with <code>component: "Avatar"</code>.
          </p>
          
          <p><strong>Props</strong></p>
          <ul>
            <li><code>src?</code> – string. Image URL (optional). If provided, the image will be displayed.</li>
            <li><code>alt?</code> – string. Alternative text for accessibility (optional). Used for fallback if image fails to load.</li>
            <li><code>fallback?</code> – React.ReactNode. Custom fallback content (optional). Defaults to first letter of <code>alt</code> if not provided.</li>
            <li><code>className?</code> – string. Additional CSS classes</li>
          </ul>
          <p>If <code>src</code> is provided, the image will be displayed. If the image fails to load or <code>src</code> is not provided, the fallback content (or first letter of <code>alt</code>) will be shown.</p>

          <h3 className="mt-6 mb-4">Basic Example</h3>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`{
  "type": "component",
  "component": "Avatar",
  "props": {
    "src": "https://example.com/avatar.jpg",
    "alt": "John Doe"
  }
}`}</CodeBlock>

          <h3 className="mt-6 mb-4">With Fallback</h3>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`{
  "type": "component",
  "component": "Avatar",
  "props": {
    "alt": "John Doe",
    "fallback": "JD"
  }
}`}</CodeBlock>

          <h3 className="mt-6 mb-4">Fallback Only</h3>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`{
  "type": "component",
  "component": "Avatar",
  "props": {
    "alt": "User"
  },
  "children": "U"
}`}</CodeBlock>
        </CollapsibleContent>
      </Collapsible>
    </DocumentContent>
  );
}
