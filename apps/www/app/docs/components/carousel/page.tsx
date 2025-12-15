"use client";

import { Carousel, DocumentContent, Collapsible, CollapsibleTrigger, CollapsibleContent } from "@fragment_ui/ui";
import { Card, CardContent } from "@fragment_ui/ui";
import { StorybookLinkWrapper as StorybookLink } from "../../../../src/components/storybook-link-wrapper";
import { CodeBlock } from "@fragment_ui/ui";

export default function CarouselPage() {
  const Slide = ({ children, color }: { children: React.ReactNode; color: string }) => (
    <div
      className={`h-64 flex items-center justify-center text-white text-2xl font-normal rounded-lg`}
      style={{ backgroundColor: color }}
    >
      {children}
    </div>
  );

  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 className="text-3xl font-medium mb-4" id="page">Carousel</h1>
      </div>
      <p className="mb-6 intro-text">
        Browse items one at a time by sliding.
      </p>
      
      {/* Default Carousel */}
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[400px] p-10">
          <div className="w-full max-w-2xl">
            <Carousel>
              <Slide color="#71717a">Slide 1</Slide>
              <Slide color="#52525b">Slide 2</Slide>
              <Slide color="#3f3f46">Slide 3</Slide>
            </Carousel>
          </div>
        </div>
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">{`import { Carousel } from "@fragment_ui/ui";

<Carousel>
  <div className="h-64 flex items-center justify-center bg-zinc-500 text-white text-2xl font-normal rounded-lg">
    Slide 1
  </div>
  <div className="h-64 flex items-center justify-center bg-zinc-600 text-white text-2xl font-normal rounded-lg">
    Slide 2
  </div>
  <div className="h-64 flex items-center justify-center bg-zinc-700 text-white text-2xl font-normal rounded-lg">
    Slide 3
  </div>
</Carousel>`}</CodeBlock>
        </div>
      </div>

      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code">{`npx shadcn@latest add https://fragmentui.com/r/carousel.json`}</CodeBlock>

      <Collapsible>
        <CollapsibleTrigger className="w-full text-left">
          <h2 id="for-ai-automation">
            Agents & Copilots
          </h2>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4">
          <p><strong>Intent</strong></p>
          <p>
            <code>Carousel</code> is a component for displaying multiple items in a sliding container.<br />
            Use it when you need to showcase a series of images, cards, or content items that users can navigate through one at a time, such as product galleries, testimonials, feature highlights, or image sliders.
          </p>

          <p><strong>When to use</strong></p>
          <ul>
            <li>Image galleries and photo sliders</li>
            <li>Product showcases and catalogs</li>
            <li>Testimonials or reviews</li>
            <li>Feature highlights or announcements</li>
            <li>Any sequential content that benefits from one-at-a-time viewing</li>
          </ul>

          <p><strong>UI-DSL usage</strong></p>
          <p>
            Use <code>type: "component"</code> with <code>component: "Carousel"</code>. Carousel accepts children as slides:
          </p>
          <ul>
            <li><code>children</code> – React nodes to display as slides (required)</li>
            <li><code>autoPlay?</code> – Enable auto-play (optional, default: false)</li>
            <li><code>autoPlayInterval?</code> – Auto-play interval in milliseconds (optional, default: 3000)</li>
            <li><code>showArrows?</code> – Show navigation arrows (optional, default: true)</li>
            <li><code>showDots?</code> – Show dots pagination (optional, default: false)</li>
            <li><code>className?</code> – Additional CSS classes (optional)</li>
            <li><code>onSlideChange?</code> – Callback when slide changes (optional)</li>
          </ul>

          <p><strong>Example</strong></p>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`{
  "type": "component",
  "component": "Carousel",
  "props": {
    "autoPlay": true,
    "autoPlayInterval": 3000,
    "showArrows": true
  },
  "children": [
    {
      "type": "component",
      "component": "Card",
      "children": {
        "type": "component",
        "component": "CardContent",
        "children": "Slide 1 content"
      }
    },
    {
      "type": "component",
      "component": "Card",
      "children": {
        "type": "component",
        "component": "CardContent",
        "children": "Slide 2 content"
      }
    },
    {
      "type": "component",
      "component": "Card",
      "children": {
        "type": "component",
        "component": "CardContent",
        "children": "Slide 3 content"
      }
    }
  ]
}`}</CodeBlock>
        </CollapsibleContent>
      </Collapsible>

      <h2 id="links">Links</h2>
      <ul>
        <li>
          <StorybookLink path="/docs/core-carousel--docs">Storybook</StorybookLink>
        </li>
      </ul>


    </DocumentContent>
  );
}

