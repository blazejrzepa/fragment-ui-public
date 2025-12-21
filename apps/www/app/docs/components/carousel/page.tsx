"use client";

import { Carousel, DocumentContent, Collapsible, CollapsibleTrigger, CollapsibleContent, CodeBlock, Badge } from "@fragment_ui/ui";
import { ExampleSection } from "../../../../src/components/example-section";

const basicCode = `import { Carousel } from "@fragment_ui/ui";

export function CarouselBasicDemo() {
  return (
    <Carousel>
      <div className="h-64 flex items-center justify-center bg-[color:var(--color-surface-2)] text-[color:var(--color-fg-base)] text-2xl font-normal rounded-lg">
        Slide 1
      </div>
      <div className="h-64 flex items-center justify-center bg-[color:var(--color-surface-2)] text-[color:var(--color-fg-base)] text-2xl font-normal rounded-lg">
        Slide 2
      </div>
      <div className="h-64 flex items-center justify-center bg-[color:var(--color-surface-2)] text-[color:var(--color-fg-base)] text-2xl font-normal rounded-lg">
        Slide 3
      </div>
    </Carousel>
  );
}`;

const withDotsCode = `import { Carousel } from "@fragment_ui/ui";

export function CarouselWithDotsDemo() {
  return (
    <Carousel showDots={true}>
      <div className="h-64 flex items-center justify-center bg-[color:var(--color-surface-2)] text-[color:var(--color-fg-base)] text-2xl font-normal rounded-lg">
        Slide 1
      </div>
      <div className="h-64 flex items-center justify-center bg-[color:var(--color-surface-2)] text-[color:var(--color-fg-base)] text-2xl font-normal rounded-lg">
        Slide 2
      </div>
      <div className="h-64 flex items-center justify-center bg-[color:var(--color-surface-2)] text-[color:var(--color-fg-base)] text-2xl font-normal rounded-lg">
        Slide 3
      </div>
    </Carousel>
  );
}`;

const autoPlayCode = `import { Carousel } from "@fragment_ui/ui";

export function CarouselAutoPlayDemo() {
  return (
    <Carousel autoPlay={true} autoPlayInterval={3000} showDots={true}>
      <div className="h-64 flex items-center justify-center bg-[color:var(--color-surface-2)] text-[color:var(--color-fg-base)] text-2xl font-normal rounded-lg">
        Slide 1
      </div>
      <div className="h-64 flex items-center justify-center bg-[color:var(--color-surface-2)] text-[color:var(--color-fg-base)] text-2xl font-normal rounded-lg">
        Slide 2
      </div>
      <div className="h-64 flex items-center justify-center bg-[color:var(--color-surface-2)] text-[color:var(--color-fg-base)] text-2xl font-normal rounded-lg">
        Slide 3
      </div>
    </Carousel>
  );
}`;

export default function CarouselPage() {
  const Slide = ({ children, color }: { children: React.ReactNode; color: string }) => (
    <div
      className="h-64 flex items-center justify-center text-[color:var(--color-fg-base)] text-[length:var(--typography-size-2xl)] font-normal rounded-[var(--radius-md)]"
      style={{ backgroundColor: color }}
    >
      {children}
    </div>
  );

  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-[var(--space-4)] mb-[var(--space-1)]">
        <h1 id="carousel" className="text-[length:var(--typography-display-md-size)] font-medium">Carousel</h1>
      </div>
      <p className="mb-[var(--space-6)] intro-text">Cycle through multiple items in a single area.</p>
      
      {/* Basic Carousel */}
      <ExampleSection
        id="carousel-basic"
        title="Example"
        code={basicCode}
        maxWidth="max-w-2xl"
      >
        <div className="flex gap-[var(--space-2)] items-center justify-center w-full">
          <Carousel>
            <Slide color="var(--color-surface-2)">Slide 1</Slide>
            <Slide color="var(--color-surface-2)">Slide 2</Slide>
            <Slide color="var(--color-surface-2)">Slide 3</Slide>
          </Carousel>
        </div>
      </ExampleSection>

      {/* With Dots */}
      <ExampleSection
        id="carousel-with-dots"
        title="With Dots"
        code={withDotsCode}
        marginTop="mt-[var(--space-8)]"
        maxWidth="max-w-2xl"
      >
        <div className="flex gap-[var(--space-2)] items-center justify-center w-full">
          <Carousel showDots={true}>
            <Slide color="var(--color-surface-2)">Slide 1</Slide>
            <Slide color="var(--color-surface-2)">Slide 2</Slide>
            <Slide color="var(--color-surface-2)">Slide 3</Slide>
          </Carousel>
        </div>
      </ExampleSection>

      {/* Auto Play */}
      <ExampleSection
        id="carousel-auto-play"
        title="Auto Play"
        code={autoPlayCode}
        marginTop="mt-[var(--space-8)]"
        maxWidth="max-w-2xl"
      >
        <div className="flex gap-[var(--space-2)] items-center justify-center w-full">
          <Carousel autoPlay={true} autoPlayInterval={3000} showDots={true}>
            <Slide color="var(--color-surface-2)">Slide 1</Slide>
            <Slide color="var(--color-surface-2)">Slide 2</Slide>
            <Slide color="var(--color-surface-2)">Slide 3</Slide>
          </Carousel>
        </div>
      </ExampleSection>

      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code" showLineNumbers={false} showCopyButton={false}>
        {`npx fragmentui@latest add carousel`}
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
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>children</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>React.ReactNode</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Slides to display (required)</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>autoPlay</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>boolean</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>false</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Enable automatic slide progression</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>autoPlayInterval</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>number</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>3000</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Auto-play interval in milliseconds</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>showArrows</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>boolean</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>true</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Show navigation arrows</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>showDots</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>boolean</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>false</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Show dots pagination indicators</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>onSlideChange</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>(index: number) =&gt; void</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Callback when slide changes</td>
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
            <code>Carousel</code> is a component for displaying multiple items in a sliding container. Use it when you need to showcase a series of images, cards, or content items that users can navigate through one at a time, such as product galleries, testimonials, feature highlights, or image sliders.
          </p>

          <p><strong>When to use</strong></p>
          <ul>
            <li>Image galleries and photo sliders</li>
            <li>Product showcases and catalogs</li>
            <li>Testimonials or reviews</li>
            <li>Feature highlights or announcements</li>
            <li>Any sequential content that benefits from one-at-a-time viewing</li>
          </ul>

          <p><strong>UI-DSL Usage</strong></p>
          <p>
            Use <code>type: "component"</code> with <code>component: "Carousel"</code>. Carousel accepts children as slides.
          </p>
          
          <p><strong>Props</strong></p>
          <ul>
            <li><code>children</code> – React.ReactNode. Slides to display (required). Each child becomes a slide.</li>
            <li><code>autoPlay?</code> – boolean (default: <code>false</code>). Enable automatic slide progression</li>
            <li><code>autoPlayInterval?</code> – number (default: <code>3000</code>). Auto-play interval in milliseconds</li>
            <li><code>showArrows?</code> – boolean (default: <code>true</code>). Show navigation arrows</li>
            <li><code>showDots?</code> – boolean (default: <code>false</code>). Show dots pagination indicators</li>
            <li><code>onSlideChange?</code> – function. Callback when slide changes: <code>(index: number) =&gt; void</code></li>
            <li><code>className?</code> – string. Additional CSS classes</li>
          </ul>
          <p>The carousel supports keyboard navigation (Arrow keys), touch/swipe gestures, and automatically pauses auto-play on hover.</p>

          <h3 className="mt-[var(--space-6)] mb-[var(--space-4)]">Basic Example</h3>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`{
  "type": "component",
  "component": "Carousel",
  "children": [
    {
      "type": "element",
      "tag": "div",
      "props": {
        "className": "h-64 flex items-center justify-center bg-[color:var(--color-surface-2)]"
      },
      "children": "Slide 1"
    },
    {
      "type": "element",
      "tag": "div",
      "props": {
        "className": "h-64 flex items-center justify-center bg-[color:var(--color-surface-2)]"
      },
      "children": "Slide 2"
    }
  ]
}`}</CodeBlock>

          <h3 className="mt-[var(--space-6)] mb-[var(--space-4)]">With Dots</h3>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`{
  "type": "component",
  "component": "Carousel",
  "props": {
    "showDots": true
  },
  "children": [
    {
      "type": "element",
      "tag": "div",
      "children": "Slide 1"
    },
    {
      "type": "element",
      "tag": "div",
      "children": "Slide 2"
    }
  ]
}`}</CodeBlock>

          <h3 className="mt-[var(--space-6)] mb-[var(--space-4)]">Auto Play</h3>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`{
  "type": "component",
  "component": "Carousel",
  "props": {
    "autoPlay": true,
    "autoPlayInterval": 3000,
    "showDots": true
  },
  "children": [
    {
      "type": "element",
      "tag": "div",
      "children": "Slide 1"
    },
    {
      "type": "element",
      "tag": "div",
      "children": "Slide 2"
    }
  ]
}`}</CodeBlock>
        </CollapsibleContent>
      </Collapsible>
    </DocumentContent>
  );
}
