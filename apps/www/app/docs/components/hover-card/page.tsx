"use client";

import { HoverCard, HoverCardContent, HoverCardTrigger, DocumentContent, Collapsible, CollapsibleTrigger, CollapsibleContent } from "@fragment_ui/ui";
import { Avatar } from "@fragment_ui/ui";
import { StorybookLinkWrapper as StorybookLink } from "../../../../src/components/storybook-link-wrapper";
import { CodeBlock } from "@fragment_ui/ui";

export default function HoverCardPage() {
  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 className="text-3xl font-medium mb-4" id="page">Hover Card</h1>
      </div>
      <p className="mb-6 intro-text">
        For sighted users to preview content available behind a link.
      </p>
      
      {/* Preview */}
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[400px] p-10">
          <div className="flex flex-col gap-8 items-center">
            <div className="flex flex-col gap-4 items-center">
              <p className="text-sm" style={{ color: "var(--color-fg-muted)" }}>Default</p>
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
                  <div className="flex gap-4">
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold !mt-0">Fragment UI</h4>
                      <p className="text-sm" style={{ color: "var(--color-fg-muted)" }}>
                        @fragmentui
                      </p>
                      <p className="text-sm">
                        Components, icons, colors, and templates for building high-quality, accessible UI. Free and open-source.
                      </p>
                      <div className="flex gap-4 mt-2">
                        <div className="flex gap-1">
                          <span className="text-sm font-semibold">0</span>
                          <span className="text-sm" style={{ color: "var(--color-fg-muted)" }}>Following</span>
                        </div>
                        <div className="flex gap-1">
                          <span className="text-sm font-semibold">2,900</span>
                          <span className="text-sm" style={{ color: "var(--color-fg-muted)" }}>Followers</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div>

            <div className="flex flex-col gap-4 items-center">
              <p className="text-sm" style={{ color: "var(--color-fg-muted)" }}>With Avatar</p>
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
                  <div className="flex gap-4">
                    <Avatar className="h-12 w-12" src="https://github.com/blazejrzepa.png" alt="Blake Rzepa" fallback="BR" />
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold !mt-0">Blake Rzepa</h4>
                      <p className="text-sm" style={{ color: "var(--color-fg-muted)" }}>
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
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">{`import { HoverCard, HoverCardContent, HoverCardTrigger } from "@fragment_ui/ui";

<HoverCard>
  <HoverCardTrigger asChild>
    <button className="text-[color:var(--color-fg-base)] underline">
      @fragmentui
    </button>
  </HoverCardTrigger>
  <HoverCardContent>
    <div className="flex gap-4">
      <div className="space-y-1">
        <h4 className="text-sm font-semibold">Fragment UI</h4>
        <p className="text-sm" style={{ color: "var(--color-fg-muted)" }}>
          @fragmentui
        </p>
        <p className="text-sm">
          Components, icons, colors, and templates for building high-quality, accessible UI.
        </p>
      </div>
    </div>
  </HoverCardContent>
</HoverCard>`}</CodeBlock>
        </div>
      </div>

      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code">{`npx shadcn@latest add https://fragmentui.com/r/hover-card.json`}</CodeBlock>

      <Collapsible>
        <CollapsibleTrigger className="w-full text-left">
          <h2 id="for-ai-automation">
            Agents & Copilots
          </h2>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4">
          <p><strong>Intent</strong></p>
          <p>
            <code>HoverCard</code> is a component for sighted users to preview content available behind a link.<br />
            Use it when you want to provide additional context, information, or preview content without navigating away from the current page. Hover cards are ideal for user profiles, tooltips with rich content, and contextual information that enhances the user experience.
          </p>

          <p><strong>When to use</strong></p>
          <ul>
            <li>User profile previews (avatars, usernames, bios)</li>
            <li>Rich tooltips with images or formatted content</li>
            <li>Product or item previews</li>
            <li>Social media mentions or tags</li>
            <li>Contextual help or documentation links</li>
            <li>Any scenario where you want to show additional information on hover</li>
          </ul>

          <p><strong>UI-DSL usage</strong></p>
          <p>
            Use <code>type: "component"</code> with <code>component: "HoverCard"</code>.
          </p>
          <p>Props for <code>HoverCard</code>:</p>
          <ul>
            <li><code>children</code> – Must include <code>HoverCardTrigger</code> and <code>HoverCardContent</code> (required)</li>
            <li><code>open?</code> – Controlled open state (optional, for controlled component)</li>
            <li><code>onOpenChange?</code> – Callback when open state changes (optional)</li>
            <li><code>openDelay?</code> – Delay before opening in milliseconds (optional, default: 700)</li>
            <li><code>closeDelay?</code> – Delay before closing in milliseconds (optional, default: 300)</li>
          </ul>
          <p>Props for <code>HoverCardTrigger</code>:</p>
          <ul>
            <li><code>asChild?</code> – Render as child element instead of button (optional)</li>
          </ul>
          <p>Props for <code>HoverCardContent</code>:</p>
          <ul>
            <li><code>side?</code> – Side of trigger: "top" | "right" | "bottom" | "left" (optional, default: "bottom")</li>
            <li><code>align?</code> – Alignment: "start" | "center" | "end" (optional, default: "center")</li>
            <li><code>sideOffset?</code> – Distance from trigger in pixels (optional, default: 4)</li>
            <li><code>className?</code> – Additional CSS classes (optional)</li>
          </ul>

          <p><strong>Example</strong></p>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`{
  "type": "component",
  "component": "HoverCard",
  "props": {
    "openDelay": 700,
    "closeDelay": 300
  },
  "children": [
    {
      "type": "component",
      "component": "HoverCardTrigger",
      "props": { "asChild": true },
      "children": {
        "type": "component",
        "component": "Button",
        "children": "@username"
      }
    },
    {
      "type": "component",
      "component": "HoverCardContent",
      "children": [
        {
          "type": "component",
          "component": "div",
          "props": { "className": "space-y-1" },
          "children": [
            {
              "type": "component",
              "component": "h4",
              "props": { "className": "text-sm font-semibold" },
              "children": "Username"
            },
            {
              "type": "component",
              "component": "p",
              "props": { "className": "text-sm" },
              "children": "User description goes here."
            }
          ]
        }
      ]
    }
  ]
}`}</CodeBlock>
        </CollapsibleContent>
      </Collapsible>
      
      <h2 id="links">Links</h2>
      <ul>
        <li>
          <StorybookLink path="/docs/core-hover-card--docs">Storybook</StorybookLink>
        </li>
      </ul>

    </DocumentContent>
  );
}
