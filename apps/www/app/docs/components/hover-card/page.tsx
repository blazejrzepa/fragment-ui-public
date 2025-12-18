"use client";

import { HoverCard, HoverCardContent, HoverCardTrigger, DocumentContent, Collapsible, CollapsibleTrigger, CollapsibleContent, CodeBlock, Badge, Avatar } from "@fragment_ui/ui";
import { ExampleSection } from "../../../../src/components/example-section";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const hoverCardCode = `import { HoverCard, HoverCardContent, HoverCardTrigger } from "@fragment_ui/ui";
import { Avatar } from "@fragment_ui/ui";

export function HoverCardDemo() {
  return (
    <div className="flex flex-col gap-[var(--space-8)] items-center">
      <div className="flex flex-col gap-[var(--space-4)] items-center">
        <p className="text-sm text-[color:var(--color-fg-muted)]">Default</p>
        <HoverCard>
          <HoverCardTrigger asChild>
            <button 
              type="button"
              className="text-[color:var(--color-fg-base)] underline"
            >
              @fragmentui
            </button>
          </HoverCardTrigger>
          <HoverCardContent>
            <div className="flex gap-[var(--space-4)]">
              <div className="space-y-1">
                <h4 className="text-sm font-semibold !mt-0">Fragment UI</h4>
                <p className="text-sm text-[color:var(--color-fg-muted)]">
                  @fragmentui
                </p>
                <p className="text-sm">
                  Components, icons, colors, and templates for building high-quality, accessible UI. Free and open-source.
                </p>
                <div className="flex gap-[var(--space-4)] mt-[var(--space-2)]">
                  <div className="flex gap-[var(--space-1)]">
                    <span className="text-sm font-semibold">0</span>
                    <span className="text-sm text-[color:var(--color-fg-muted)]">Following</span>
                  </div>
                  <div className="flex gap-[var(--space-1)]">
                    <span className="text-sm font-semibold">2,900</span>
                    <span className="text-sm text-[color:var(--color-fg-muted)]">Followers</span>
                  </div>
                </div>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>

      <div className="flex flex-col gap-[var(--space-4)] items-center">
        <p className="text-sm text-[color:var(--color-fg-muted)]">With Avatar</p>
        <HoverCard>
          <HoverCardTrigger asChild>
            <button 
              type="button"
              className="text-[color:var(--color-fg-base)] underline"
            >
              @blakerzepa
            </button>
          </HoverCardTrigger>
          <HoverCardContent>
            <div className="flex gap-[var(--space-4)]">
              <Avatar className="h-12 w-12" src="https://github.com/blazejrzepa.png" alt="Blake Rzepa" fallback="BR" />
              <div className="space-y-1">
                <h4 className="text-sm font-semibold !mt-0">Blake Rzepa</h4>
                <p className="text-sm text-[color:var(--color-fg-muted)]">
                  @blakerzepa
                </p>
                <p className="text-sm">
                  Product designer and builder, passionate about systematizing UI.
                </p>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>
    </div>
  );
}`;

export default function HoverCardPage() {
  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 id="hover-card">Hover Card</h1>
      </div>
      <p className="mb-6 intro-text">Show extra info when hovering an element.</p>
      
      <ExampleSection
        id="hover-card-example"
        title="Hover Card Example"
        code={hoverCardCode}
      >
        <div className="flex gap-2 items-center justify-center w-full">
          <div className="flex flex-col gap-[var(--space-8)] items-center w-full">
            <div className="flex flex-col gap-[var(--space-4)] items-center">
              <p className="text-sm text-[color:var(--color-fg-muted)]">Default</p>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <button 
                    type="button"
                    className="text-[color:var(--color-fg-base)] underline"
                  >
                    @fragmentui
                  </button>
                </HoverCardTrigger>
                <HoverCardContent>
                  <div className="flex gap-[var(--space-4)]">
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold !mt-0">Fragment UI</h4>
                      <p className="text-sm text-[color:var(--color-fg-muted)]">
                        @fragmentui
                      </p>
                      <p className="text-sm">
                        Components, icons, colors, and templates for building high-quality, accessible UI. Free and open-source.
                      </p>
                      <div className="flex gap-[var(--space-4)] mt-[var(--space-2)]">
                        <div className="flex gap-[var(--space-1)]">
                          <span className="text-sm font-semibold">0</span>
                          <span className="text-sm text-[color:var(--color-fg-muted)]">Following</span>
                        </div>
                        <div className="flex gap-[var(--space-1)]">
                          <span className="text-sm font-semibold">2,900</span>
                          <span className="text-sm text-[color:var(--color-fg-muted)]">Followers</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div>

            <div className="flex flex-col gap-[var(--space-4)] items-center">
              <p className="text-sm text-[color:var(--color-fg-muted)]">With Avatar</p>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <button 
                    type="button"
                    className="text-[color:var(--color-fg-base)] underline"
                  >
                    @blakerzepa
                  </button>
                </HoverCardTrigger>
                <HoverCardContent>
                  <div className="flex gap-[var(--space-4)]">
                    <Avatar className="h-12 w-12" src="https://github.com/blazejrzepa.png" alt="Blake Rzepa" fallback="BR" />
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold !mt-0">Blake Rzepa</h4>
                      <p className="text-sm text-[color:var(--color-fg-muted)]">
                        @blakerzepa
                      </p>
                      <p className="text-sm">
                        Product designer and builder, passionate about systematizing UI.
                      </p>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div>
          </div>
        </div>
      </ExampleSection>

      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code" showLineNumbers={false} showCopyButton={false}>
        {`npx fragmentui@latest add hover-card`}
      </CodeBlock>

      {/* API Reference */}
      <h2 id="api" className="mt-8">API Reference</h2>
      <div className="mt-4 border border-[color:var(--color-border-base)] rounded-lg overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <th className="text-left py-2 px-4 font-semibold text-sm">Component</th>
              <th className="text-left py-2 px-4 font-semibold text-sm">Prop</th>
              <th className="text-left py-2 px-4 font-semibold text-sm">Type</th>
              <th className="text-left py-2 px-4 font-semibold text-sm">Default</th>
              <th className="text-left py-2 px-4 font-semibold text-sm">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-2 px-4"><code>HoverCard</code></td>
              <td className="py-2 px-4"><code>open?, onOpenChange?, openDelay?, closeDelay?</code></td>
              <td className="py-2 px-4"><code>boolean, function, number, number</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Root component. Must contain <code>HoverCardTrigger</code> and <code>HoverCardContent</code></td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-2 px-4"><code>HoverCardTrigger</code></td>
              <td className="py-2 px-4"><code>asChild?</code></td>
              <td className="py-2 px-4"><code>boolean</code></td>
              <td className="py-2 px-4"><code>false</code></td>
              <td className="py-2 px-4 text-sm">Trigger element that opens the hover card on hover</td>
            </tr>
            <tr>
              <td className="py-2 px-4"><code>HoverCardContent</code></td>
              <td className="py-2 px-4"><code>side?, align?, sideOffset?, className?</code></td>
              <td className="py-2 px-4"><code>string, string, number, string</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Container for hover card content</td>
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
            <code>HoverCard</code> is a component for sighted users to preview content available behind a link. Use it when you want to provide additional context or information about a link or element without requiring the user to navigate away. Hover cards are ideal for user profiles, tooltips with rich content, or preview cards that appear on hover.
          </p>

          <p><strong>When to use</strong></p>
          <ul>
            <li>User profile previews on hover</li>
            <li>Link previews with additional context</li>
            <li>Rich tooltips with images or formatted content</li>
            <li>Product or item previews</li>
            <li>Any scenario where hover reveals additional information</li>
          </ul>

          <p><strong>UI-DSL Usage</strong></p>
          <p>
            Use <code>type: "component"</code> with <code>component: "HoverCard"</code>.
          </p>
          <p><strong>Props:</strong></p>
          <ul>
            <li><code>children</code> – Must include <code>HoverCardTrigger</code> and <code>HoverCardContent</code> (required)</li>
            <li><code>open?</code> – Controlled open state for programmatic control (optional)</li>
            <li><code>onOpenChange?</code> – Callback function that receives the open state when it changes (optional)</li>
            <li><code>openDelay?</code> – Delay in milliseconds before the hover card opens after hovering (optional, default: <code>700</code>)</li>
            <li><code>closeDelay?</code> – Delay in milliseconds before the hover card closes after leaving (optional, default: <code>300</code>)</li>
          </ul>
          <p>Props for <code>HoverCardTrigger</code>:</p>
          <ul>
            <li><code>asChild?</code> – Render as child element instead of default button (optional)</li>
          </ul>
          <p>Props for <code>HoverCardContent</code>:</p>
          <ul>
            <li><code>side?</code> – Side of trigger where the card appears: <code>"top"</code>, <code>"right"</code>, <code>"bottom"</code>, or <code>"left"</code> (optional, default: <code>"top"</code>)</li>
            <li><code>align?</code> – Alignment relative to trigger: <code>"start"</code>, <code>"center"</code>, or <code>"end"</code> (optional, default: <code>"center"</code>)</li>
            <li><code>sideOffset?</code> – Distance in pixels from the trigger element (optional, default: <code>5</code>)</li>
            <li><code>className?</code> – Additional CSS classes to apply to the hover card content (optional)</li>
          </ul>

          <h3>Basic Hover Card</h3>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`{
  "type": "component",
  "component": "HoverCard",
  "children": [
    {
      "type": "component",
      "component": "HoverCardTrigger",
      "props": { "asChild": true },
      "children": {
        "type": "element",
        "tag": "a",
        "props": { "href": "#" },
        "children": "@fragmentui"
      }
    },
    {
      "type": "component",
      "component": "HoverCardContent",
      "children": {
        "type": "element",
        "tag": "div",
        "children": [
          {
            "type": "element",
            "tag": "h4",
            "children": "Fragment UI"
          },
          {
            "type": "element",
            "tag": "p",
            "children": "Components, icons, colors, and templates for building high-quality, accessible UI."
          }
        ]
      }
    }
  ]
}`}</CodeBlock>
        </CollapsibleContent>
      </Collapsible>
    </DocumentContent>
  );
}
