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
      <div className="flex items-center gap-[var(--space-4)] mb-[var(--space-1)]">
        <h1 id="avatar">Avatar</h1>
      </div>
      <p className="mb-[var(--space-6)] intro-text">Display user profile image or initials.</p>
      
      <ExampleSection
        id="avatar-with-image"
        title="Avatar with Image"
        code={avatarWithImageCode}
      >
        <div className="flex gap-[var(--space-2)] items-center justify-center">
          <Avatar src="https://blakerzepa.com/assets/blake.avif" alt="User" />
        </div>
      </ExampleSection>

      <ExampleSection
        id="avatar-with-fallback"
        title="Avatar with Fallback"
        code={avatarWithFallbackCode}
        marginTop="mt-8"
      >
        <div className="flex gap-[var(--space-2)] items-center justify-center">
          <Avatar alt="User">JD</Avatar>
        </div>
      </ExampleSection>

      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code" showLineNumbers={false} showCopyButton={false}>
        {`npx fragmentui@latest add avatar`}
      </CodeBlock>

      {/* API Reference */}
      <h2 id="api" className="mt-[var(--space-8)]">API Reference</h2>
      <div className="mt-[var(--space-4)] border border-[color:var(--color-border-base)] rounded-[var(--radius-lg)] overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <th className="text-left py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]" font-semibold>Prop</th>
              <th className="text-left py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]" font-semibold>Type</th>
              <th className="text-left py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]" font-semibold>Default</th>
              <th className="text-left py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]" font-semibold>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>src</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>string</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Image URL to display</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>alt</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>string</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Alternative text for accessibility. Used for fallback if image fails to load</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>fallback</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>React.ReactNode</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Custom fallback content. Defaults to first letter of <code>alt</code> if not provided</td>
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

          <h3 className="mt-[var(--space-6)] mb-[var(--space-4)]">Basic Example</h3>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`{
  "type": "component",
  "component": "Avatar",
  "props": {
    "src": "https://example.com/avatar.jpg",
    "alt": "John Doe"
  }
}`}</CodeBlock>

          <h3 className="mt-[var(--space-6)] mb-[var(--space-4)]">With Fallback</h3>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`{
  "type": "component",
  "component": "Avatar",
  "props": {
    "alt": "John Doe",
    "fallback": "JD"
  }
}`}</CodeBlock>

          <h3 className="mt-[var(--space-6)] mb-[var(--space-4)]">Fallback Only</h3>
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
