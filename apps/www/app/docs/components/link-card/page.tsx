"use client";

import { DocumentContent, CodeBlock, Collapsible, CollapsibleTrigger, CollapsibleContent } from "@fragment_ui/ui";
import { LinkCard, LinkCardGroup } from "@fragment_ui/blocks/link-card";
import { ExampleSection } from "../../../../src/components/example-section";
import { Settings, Palette, Package, Blocks, Sparkles, Code } from "lucide-react";

const basicLinkCardCode = `import { LinkCard } from "@fragment_ui/blocks/link-card";
import { Settings } from "lucide-react";

export function BasicLinkCardDemo() {
  return (
    <LinkCard
      href="/docs/setup"
      icon={Settings}
      title="Setup"
      description="Install Fragment UI in your React project"
      variant="solid"
    />
  );
}`;

const linkCardGroupCode = `import { LinkCardGroup } from "@fragment_ui/blocks/link-card";
import { Settings, Palette, Package } from "lucide-react";

export function LinkCardGroupDemo() {
  return (
    <LinkCardGroup
      cards={[
        {
          href: "/docs/setup",
          icon: Settings,
          title: "Setup",
          description: "Install Fragment UI in your React project",
        },
        {
          href: "/docs/foundations/tokens",
          icon: Palette,
          title: "Design Tokens",
          description: "Learn about colors, spacing, typography, and more",
        },
        {
          href: "/docs/foundations/theming",
          icon: Package,
          title: "Theming & Modes",
          description: "Configure themes, dark mode, and density",
        },
      ]}
      columns={{ sm: 1, md: 2, lg: 3 }}
    />
  );
}`;

const externalLinkCardCode = `import { LinkCard } from "@fragment_ui/blocks/link-card";
import { Code } from "lucide-react";

export function ExternalLinkCardDemo() {
  return (
    <LinkCard
      href="https://github.com/blazejrzepa/fragment-ui-public"
      icon={Code}
      title="GitHub Repository"
      description="View the source code on GitHub"
      external={true}
    />
  );
}`;

export default function LinkCardPage() {
  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 id="link-card">Link Card</h1>
      </div>
      <p className="mb-6 intro-text">
        A card component that acts as a link.
      </p>

      <ExampleSection
        id="basic-link-card"
        title="Basic Link Card (Solid)"
        code={basicLinkCardCode}
      >
        <div className="flex gap-2 items-center justify-center w-full">
          <div className="w-full max-w-sm">
            <LinkCard
              href="/docs/setup"
              icon={Settings}
              title="Setup"
              description="Install Fragment UI in your React project"
              variant="solid"
            />
          </div>
        </div>
      </ExampleSection>

      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code" showLineNumbers={false} showCopyButton={false}>
        {`npx fragmentui@latest add link-card`}
      </CodeBlock>

      <ExampleSection
        id="link-card-group"
        title="Link Card Group"
        code={linkCardGroupCode}
        marginTop="mt-8"
        maxWidth="max-w-4xl"
        previewPadding="px-[var(--space-4)]"
      >
        <div className="w-full">
          <LinkCardGroup
            cards={[
              {
                href: "/docs/setup",
                icon: Settings,
                title: "Setup",
                description: "Install Fragment UI in your React project",
              },
              {
                href: "/docs/foundations/tokens",
                icon: Palette,
                title: "Design Tokens",
                description: "Learn about colors, spacing, typography, and more",
              },
              {
                href: "/docs/foundations/theming",
                icon: Package,
                title: "Theming & Modes",
                description: "Configure themes, dark mode, and density",
              },
            ]}
            columns={{ sm: 1, md: 2, lg: 3 }}
          />
        </div>
      </ExampleSection>

      <ExampleSection
        id="external-link-card"
        title="External Link Card"
        code={externalLinkCardCode}
        marginTop="mt-8"
      >
        <div className="flex gap-2 items-center justify-center w-full">
          <div className="w-full max-w-sm">
            <LinkCard
              href="https://github.com/blazejrzepa/fragment-ui-public"
              icon={Code}
              title="GitHub Repository"
              description="View the source code on GitHub"
              external={true}
            />
          </div>
        </div>
      </ExampleSection>

      <ExampleSection
        id="outline-variant"
        title="Outline Variant"
        code={`import { LinkCard } from "@fragment_ui/blocks/link-card";
import { Settings } from "lucide-react";

export function OutlineLinkCardDemo() {
  return (
    <LinkCard
      href="/docs/setup"
      icon={Settings}
      title="Setup"
      description="Install Fragment UI in your React project"
      variant="outline"
    />
  );
}`}
        marginTop="mt-8"
      >
        <div className="flex gap-2 items-center justify-center w-full">
          <div className="w-full max-w-sm">
            <LinkCard
              href="/docs/setup"
              icon={Settings}
              title="Setup"
              description="Install Fragment UI in your React project"
              variant="outline"
            />
          </div>
        </div>
      </ExampleSection>

      <ExampleSection
        id="variants-comparison"
        title="Variants Comparison"
        code={`import { LinkCard, LinkCardGroup } from "@fragment_ui/blocks/link-card";
import { Settings, Palette } from "lucide-react";

export function VariantsComparisonDemo() {
  return (
    <LinkCardGroup
      cards={[
        {
          href: "/docs/setup",
          icon: Settings,
          title: "Solid Variant",
          description: "Default variant with background",
          variant: "solid",
        },
        {
          href: "/docs/foundations/tokens",
          icon: Palette,
          title: "Outline Variant",
          description: "Transparent background with border",
          variant: "outline",
        },
      ]}
      columns={{ sm: 1, md: 2 }}
    />
  );
}`}
        marginTop="mt-8"
        maxWidth="max-w-4xl"
        previewPadding="px-[var(--space-4)]"
      >
        <div className="w-full flex justify-center">
          <LinkCardGroup
            cards={[
              {
                href: "/docs/setup",
                icon: Settings,
                title: "Solid Variant",
                description: "Default variant with background",
                variant: "solid",
              },
              {
                href: "/docs/foundations/tokens",
                icon: Palette,
                title: "Outline Variant",
                description: "Transparent background with border",
                variant: "outline",
              },
            ]}
            columns={{ sm: 1, md: 2 }}
          />
        </div>
      </ExampleSection>

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
              <td className="py-2 px-4"><code>LinkCard</code></td>
              <td className="py-2 px-4"><code>href</code></td>
              <td className="py-2 px-4"><code>string</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">URL to navigate to (required)</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-2 px-4"><code>LinkCard</code></td>
              <td className="py-2 px-4"><code>icon</code></td>
              <td className="py-2 px-4"><code>LucideIcon</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Icon component from lucide-react (required)</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-2 px-4"><code>LinkCard</code></td>
              <td className="py-2 px-4"><code>title</code></td>
              <td className="py-2 px-4"><code>string</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Card title (required)</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-2 px-4"><code>LinkCard</code></td>
              <td className="py-2 px-4"><code>description</code></td>
              <td className="py-2 px-4"><code>string</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Card description (required)</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-2 px-4"><code>LinkCard</code></td>
              <td className="py-2 px-4"><code>variant</code></td>
              <td className="py-2 px-4"><code>"solid" | "outline"</code></td>
              <td className="py-2 px-4"><code>"solid"</code></td>
              <td className="py-2 px-4 text-sm">Visual variant of the card</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-2 px-4"><code>LinkCard</code></td>
              <td className="py-2 px-4"><code>external</code></td>
              <td className="py-2 px-4"><code>boolean</code></td>
              <td className="py-2 px-4"><code>false</code></td>
              <td className="py-2 px-4 text-sm">Whether the link opens in a new tab</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-2 px-4"><code>LinkCard</code></td>
              <td className="py-2 px-4"><code>className</code></td>
              <td className="py-2 px-4"><code>string</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Additional CSS classes</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-2 px-4"><code>LinkCardGroup</code></td>
              <td className="py-2 px-4"><code>cards</code></td>
              <td className="py-2 px-4"><code>Omit&lt;LinkCardProps, "className"&gt;[]</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Array of LinkCard items (required)</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-2 px-4"><code>LinkCardGroup</code></td>
              <td className="py-2 px-4"><code>columns</code></td>
              <td className="py-2 px-4"><code>{`{ sm?: number; md?: number; lg?: number }`}</code></td>
              <td className="py-2 px-4"><code>{`{ sm: 1, md: 2, lg: 3 }`}</code></td>
              <td className="py-2 px-4 text-sm">Number of columns on different breakpoints</td>
            </tr>
            <tr>
              <td className="py-2 px-4"><code>LinkCardGroup</code></td>
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
            <code>LinkCard</code> is a card component that acts as a navigational link. Use it to create clickable cards for navigation, feature highlights, or directing users to related content. Perfect for landing pages, documentation sections, or any scenario where you need an interactive card that navigates to another page.
          </p>

          <p><strong>When to use</strong></p>
          <ul>
            <li>Navigation cards on landing pages</li>
            <li>Feature highlights or promotional sections</li>
            <li>Related content suggestions</li>
            <li>Documentation sections or guides</li>
            <li>Any scenario requiring a clickable card with icon, title, and description</li>
          </ul>

          <p><strong>UI-DSL Usage</strong></p>
          <p>
            Use <code>type: "component"</code> with <code>component: "LinkCard"</code> for single cards, or <code>component: "LinkCardGroup"</code> for multiple cards in a grid layout.
          </p>
          
          <p><strong>Props</strong></p>
          <ul>
            <li><code>href</code> – string. URL to navigate to (required)</li>
            <li><code>icon</code> – LucideIcon. Icon component from lucide-react (required)</li>
            <li><code>title</code> – string. Card title (required)</li>
            <li><code>description</code> – string. Card description (required)</li>
            <li><code>variant?</code> – <code>"solid"</code> (default) or <code>"outline"</code>. Use <code>"solid"</code> for cards with background, <code>"outline"</code> for transparent cards with border</li>
            <li><code>external?</code> – boolean (default: <code>false</code>). Whether the link opens in a new tab</li>
            <li><code>className?</code> – string. Additional CSS classes</li>
          </ul>

          <p><strong>LinkCardGroup Props</strong></p>
          <ul>
            <li><code>cards</code> – array of LinkCard props (required). Array of card items to display</li>
            <li><code>columns?</code> – object. Number of columns on different breakpoints: <code>{`{ sm?: number; md?: number; lg?: number }`}</code> (default: <code>{`{ sm: 1, md: 2, lg: 3 }`}</code>)</li>
            <li><code>className?</code> – string. Additional CSS classes</li>
          </ul>

          <h3 className="mt-6 mb-4">Basic Example</h3>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`{
  "type": "component",
  "component": "LinkCard",
  "props": {
    "href": "/docs/setup",
    "icon": {
      "type": "icon",
      "name": "Settings",
      "size": 24
    },
    "title": "Setup",
    "description": "Install Fragment UI in your React project",
    "variant": "solid"
  }
}`}</CodeBlock>

          <h3 className="mt-6 mb-4">Outline Variant</h3>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`{
  "type": "component",
  "component": "LinkCard",
  "props": {
    "href": "/docs/setup",
    "icon": {
      "type": "icon",
      "name": "Settings",
      "size": 24
    },
    "title": "Setup",
    "description": "Install Fragment UI in your React project",
    "variant": "outline"
  }
}`}</CodeBlock>

          <h3 className="mt-6 mb-4">External Link</h3>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`{
  "type": "component",
  "component": "LinkCard",
  "props": {
    "href": "https://github.com/blazejrzepa/fragment-ui-public",
    "icon": {
      "type": "icon",
      "name": "Code",
      "size": 24
    },
    "title": "GitHub Repository",
    "description": "View the source code on GitHub",
    "external": true
  }
}`}</CodeBlock>

          <h3 className="mt-6 mb-4">LinkCardGroup Example</h3>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`{
  "type": "component",
  "component": "LinkCardGroup",
  "props": {
    "cards": [
      {
        "href": "/docs/setup",
        "icon": {
          "type": "icon",
          "name": "Settings",
          "size": 24
        },
        "title": "Setup",
        "description": "Install Fragment UI in your React project"
      },
      {
        "href": "/docs/foundations/tokens",
        "icon": {
          "type": "icon",
          "name": "Palette",
          "size": 24
        },
        "title": "Design Tokens",
        "description": "Learn about colors, spacing, typography, and more"
      },
      {
        "href": "/docs/foundations/theming",
        "icon": {
          "type": "icon",
          "name": "Package",
          "size": 24
        },
        "title": "Theming & Modes",
        "description": "Configure themes, dark mode, and density"
      }
    ],
    "columns": {
      "sm": 1,
      "md": 2,
      "lg": 3
    }
  }
}`}</CodeBlock>

          <h3 className="mt-6 mb-4">Accessibility Notes</h3>
          <ul>
            <li>LinkCard uses semantic HTML link elements for proper navigation</li>
            <li>Focus states are automatically handled with visible focus rings</li>
            <li>External links automatically include <code>rel="noopener noreferrer"</code> for security</li>
            <li>Cards are keyboard accessible (Enter/Space keys activate the link)</li>
            <li>Hover states provide visual feedback for interactivity</li>
          </ul>
        </CollapsibleContent>
      </Collapsible>
    </DocumentContent>
  );
}

