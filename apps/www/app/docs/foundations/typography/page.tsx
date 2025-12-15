"use client";

import Link from "next/link";
import { DocLayout } from "../../../../src/components/doc-layout";
import { useState } from "react";
import { EditOnGitHub, Button } from "@fragment_ui/ui";
import { ArrowLeft, ArrowRight } from "lucide-react";

// Typography tokens from tokens.json
const TYPOGRAPHY_TOKENS = {
  font: {
    sans: "ui-sans-serif, system-ui",
    mono: "ui-monospace, SFMono-Regular",
  },
  size: {
    sm: 14,
    md: 16,
    lg: 18,
  },
} as const;

// Display styles
const DISPLAY_STYLES = [
  { name: "Display 2xl", size: "72px", lineHeight: "110%", letterSpacing: "-1.44px", className: "text-display-2xl" },
  { name: "Display xl", size: "60px", lineHeight: "110%", letterSpacing: "-1.2px", className: "text-display-xl" },
  { name: "Display lg", size: "48px", lineHeight: "110%", letterSpacing: "-0.96px", className: "text-display-lg" },
  { name: "Display md", size: "36px", lineHeight: "110%", letterSpacing: "-0.72px", className: "text-display-md" },
  { name: "Display sm", size: "24px", lineHeight: "110%", className: "text-display-sm" }, // zaktualizowane z 30px
  { name: "Display xs", size: "20px", lineHeight: "110%", className: "text-display-xs" }, // zaktualizowane z 24px
] as const;

// Text styles
const TEXT_STYLES = [
  { name: "Text 2xl", size: "22px", lineHeight: "150%", className: "text-2xl" },
  { name: "Text xl", size: "20px", lineHeight: "150%", className: "text-xl" },
  { name: "Text lg", size: "18px", lineHeight: "150%", className: "text-lg" },
  { name: "Text md", size: "16px", lineHeight: "160%", className: "text-md" },
  { name: "Text sm", size: "14px", lineHeight: "160%", className: "text-sm" },
  { name: "Text xs", size: "12px", lineHeight: "160%", className: "text-xs" },
] as const;

// Font weights
const FONT_WEIGHTS = [
  { name: "Light", value: 300 },
  { name: "Regular", value: 400 },
  { name: "Medium", value: 500 },
  { name: "Semibold", value: 600 },
  { name: "Bold", value: 700 },
] as const;

export default function TypographyPage() {
  const [selectedWeight, setSelectedWeight] = useState<number>(400);

  return (
    <DocLayout>
      <div className="flex items-center justify-between mb-1">
        <h1 id="typography" className="text-3xl font-medium mb-4">
        Typography
      </h1>
        <div className="flex items-center gap-2">
          <Link href={"/docs/foundations/spacing"}>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <Link href={"/docs/guides/cli-usage"}>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
      <p className="mb-6 intro-text">
        Comprehensive typography system with font families, sizes, weights, and text styles for consistent text rendering across all components.
      </p>

      <h2 id="font-families">Font Families</h2>
      <p>
        Fragment UI uses Geist as the primary font family with system fallbacks. The typography system supports both sans-serif and monospace fonts.
      </p>

      <div className="my-8 space-y-4">
        <div className="border border-[color:var(--color-border-base)] rounded-lg p-6 bg-[color:var(--color-surface-1)]">
          <div className="mb-4">
            <code className="text-sm font-mono bg-[color:var(--color-surface-2)] px-2 py-1 rounded">
              --typography-font-sans
            </code>
            <span className="text-sm text-[color:var(--color-fg-muted)] ml-2">
              {TYPOGRAPHY_TOKENS.font.sans}
            </span>
          </div>
          <div 
            style={{ fontFamily: "Geist, " + TYPOGRAPHY_TOKENS.font.sans }}
            className="text-lg"
          >
            The quick brown fox jumps over the lazy dog
          </div>
          <div 
            style={{ fontFamily: "Geist, " + TYPOGRAPHY_TOKENS.font.sans }}
            className="text-sm text-[color:var(--color-fg-muted)] mt-2"
          >
            ABCDEFGHIJKLMNOPQRSTUVWXYZ<br />
            abcdefghijklmnopqrstuvwxyz<br />
            0123456789 !@#$%^&*()
          </div>
        </div>

        <div className="border border-[color:var(--color-border-base)] rounded-lg p-6 bg-[color:var(--color-surface-1)]">
          <div className="mb-4">
            <code className="text-sm font-mono bg-[color:var(--color-surface-2)] px-2 py-1 rounded">
              --typography-font-mono
            </code>
            <span className="text-sm text-[color:var(--color-fg-muted)] ml-2">
              {TYPOGRAPHY_TOKENS.font.mono}
            </span>
          </div>
          <div 
            style={{ fontFamily: TYPOGRAPHY_TOKENS.font.mono }}
            className="text-lg font-mono"
          >
            const fragment = "design system";
          </div>
          <div 
            style={{ fontFamily: TYPOGRAPHY_TOKENS.font.mono }}
            className="text-sm font-mono text-[color:var(--color-fg-muted)] mt-2"
          >
            ABCDEFGHIJKLMNOPQRSTUVWXYZ<br />
            abcdefghijklmnopqrstuvwxyz<br />
            0123456789 !@#$%^&*()
          </div>
        </div>
      </div>

      <h2 id="font-sizes">Font Sizes</h2>
      <p>
        The typography system provides three base font sizes that can be used with density multipliers:
      </p>

      <div className="my-8 space-y-4">
        {Object.entries(TYPOGRAPHY_TOKENS.size).map(([key, value]) => (
          <div
            key={key}
            className="border border-[color:var(--color-border-base)] rounded-lg p-4"
          >
            <div className="flex items-center gap-4 mb-3">
              <code className="text-sm font-mono bg-[color:var(--color-surface-1)] px-2 py-1 rounded">
                --typography-size-{key}
              </code>
              <span className="text-sm text-[color:var(--color-fg-muted)]">
                {value}px
              </span>
            </div>
            <div style={{ fontSize: `${value}px` }} className="font-sans">
              The quick brown fox jumps over the lazy dog ({value}px)
            </div>
          </div>
        ))}
      </div>

      <h2 id="font-weights">Font Weights</h2>
      <p>
        Fragment UI supports five font weights for different text hierarchies and emphasis:
      </p>

      <div className="my-8 space-y-4">
        {FONT_WEIGHTS.map((weight) => (
          <div
            key={weight.value}
            className={`border rounded-lg p-4 transition-all ${
              selectedWeight === weight.value
                ? "border-[color:var(--color-brand-primary)] bg-[color:var(--color-surface-2)]"
                : "border-[color:var(--color-border-base)]"
            }`}
            onClick={() => setSelectedWeight(weight.value)}
          >
            <div className="flex items-center gap-4 mb-3">
              <code className="text-sm font-mono bg-[color:var(--color-surface-1)] px-2 py-1 rounded">
                font-weight: {weight.value}
              </code>
              <span className="text-sm font-semibold">{weight.name}</span>
            </div>
            <div style={{ fontWeight: weight.value }} className="text-lg">
              The quick brown fox jumps over the lazy dog
            </div>
          </div>
        ))}
      </div>

      <h2 id="display-styles">Display Styles</h2>
      <p>
        Large display text styles for headings and hero sections. These styles use tighter line heights and negative letter spacing for impact.
      </p>

      <div className="my-8 space-y-6">
        {DISPLAY_STYLES.map((style) => (
          <div
            key={style.name}
            className="border border-[color:var(--color-border-base)] rounded-lg p-6 bg-[color:var(--color-surface-1)]"
          >
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-semibold">{style.name}</span>
                <code className="text-xs font-mono bg-[color:var(--color-surface-2)] px-2 py-1 rounded">
                  {style.className}
                </code>
              </div>
              <div className="text-xs text-[color:var(--color-fg-muted)] space-y-1">
                <div>Size: {style.size}</div>
                <div>Line height: {style.lineHeight}</div>
                {'letterSpacing' in style && style.letterSpacing && <div>Letter spacing: {style.letterSpacing}</div>}
              </div>
            </div>
            <div
              style={{
                fontSize: style.size,
                lineHeight: style.lineHeight,
                ...('letterSpacing' in style && style.letterSpacing ? { letterSpacing: style.letterSpacing } : {}),
                fontFamily: "Geist, sans-serif",
                fontWeight: 500,
              }}
              className="text-[color:var(--foreground-primary)]"
            >
              {style.name}
            </div>
          </div>
        ))}
      </div>

      <h2 id="text-styles">Text Styles</h2>
      <p>
        Body text styles for paragraphs and content. These styles use comfortable line heights for readability.
      </p>

      <div className="my-8 space-y-4">
        {TEXT_STYLES.map((style) => (
          <div
            key={style.name}
            className="border border-[color:var(--color-border-base)] rounded-lg p-4"
          >
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-semibold">{style.name}</span>
                <code className="text-xs font-mono bg-[color:var(--color-surface-1)] px-2 py-1 rounded">
                  {style.className}
                </code>
              </div>
              <div className="text-xs text-[color:var(--color-fg-muted)]">
                Size: {style.size} • Line height: {style.lineHeight}
              </div>
            </div>
            <div
              style={{
                fontSize: style.size,
                lineHeight: style.lineHeight,
                fontFamily: "Geist, sans-serif",
                fontWeight: 400,
              }}
              className="text-[color:var(--foreground-primary)]"
            >
              The quick brown fox jumps over the lazy dog. This is sample text to demonstrate the {style.name.toLowerCase()} style.
            </div>
          </div>
        ))}
      </div>

      <h2 id="headings">Headings</h2>
      <p>
        Semantic heading styles for document structure. Headings use Geist font with medium weight (500) for clear hierarchy.
      </p>

      <div className="my-8 space-y-4">
        <div className="border border-[color:var(--color-border-base)] rounded-lg p-6 bg-[color:var(--color-surface-1)]">
          <h1 id="heading-1-h1" style={{ fontFamily: "Geist, sans-serif", fontSize: "36px", fontWeight: 500, lineHeight: "110%", letterSpacing: "-0.72px", margin: 0 }}>
            Heading 1 (h1)
          </h1>
          <p className="text-xs text-[color:var(--color-fg-muted)] mt-2">
            36px • font-weight: 500 • line-height: 110% • letter-spacing: -0.72px
          </p>
        </div>

        <div className="border border-[color:var(--color-border-base)] rounded-lg p-6 bg-[color:var(--color-surface-1)]">
          <h2 id="heading-2-h2" style={{ fontFamily: "Geist, sans-serif", fontSize: "24px", fontWeight: 500, lineHeight: "110%", margin: 0 }}>
            Heading 2 (h2)
          </h2>
          <p className="text-xs text-[color:var(--color-fg-muted)] mt-2">
            24px • font-weight: 500 • line-height: 110%
          </p>
        </div>

        <div className="border border-[color:var(--color-border-base)] rounded-lg p-6 bg-[color:var(--color-surface-1)]">
          <h3 id="heading-3-h3" style={{ fontFamily: "Geist, sans-serif", fontSize: "20px", fontWeight: 500, lineHeight: "110%", margin: 0 }}>
            Heading 3 (h3)
          </h3>
          <p className="text-xs text-[color:var(--color-fg-muted)] mt-2">
            20px • font-weight: 500 • line-height: 110%
          </p>
        </div>

        <div className="border border-[color:var(--color-border-base)] rounded-lg p-6 bg-[color:var(--color-surface-1)]">
          <h4 id="heading-4-h4" style={{ fontFamily: "Geist, sans-serif", fontSize: "22px", fontWeight: 500, lineHeight: "150%", margin: 0 }}>
            Heading 4 (h4)
          </h4>
          <p className="text-xs text-[color:var(--color-fg-muted)] mt-2">
            22px • font-weight: 500 • line-height: 150%
          </p>
        </div>

        <div className="border border-[color:var(--color-border-base)] rounded-lg p-6 bg-[color:var(--color-surface-1)]">
          <h5 id="heading-5-h5" style={{ fontFamily: "Geist, sans-serif", fontSize: "20px", fontWeight: 500, lineHeight: "150%", margin: 0 }}>
            Heading 5 (h5)
          </h5>
          <p className="text-xs text-[color:var(--color-fg-muted)] mt-2">
            20px • font-weight: 500 • line-height: 150%
          </p>
        </div>

        <div className="border border-[color:var(--color-border-base)] rounded-lg p-6 bg-[color:var(--color-surface-1)]">
          <h6 id="heading-6-h6" style={{ fontFamily: "Geist, sans-serif", fontSize: "18px", fontWeight: 500, lineHeight: "150%", margin: 0 }}>
            Heading 6 (h6)
          </h6>
          <p className="text-xs text-[color:var(--color-fg-muted)] mt-2">
            18px • font-weight: 500 • line-height: 150%
          </p>
        </div>
      </div>

      <h2 id="body-text">Body Text</h2>
      <p>
        Standard body text styles for paragraphs and content. Body text uses light weight (300) for comfortable reading.
      </p>

      <div className="my-8 space-y-4">
        <div className="border border-[color:var(--color-border-base)] rounded-lg p-6 bg-[color:var(--color-surface-1)]">
          <p
            style={{
              fontFamily: "Geist, sans-serif",
              fontSize: "var(--typography-size-md)",
              fontWeight: 300,
              lineHeight: "160%",
              margin: 0,
              color: "var(--color-fg-muted)",
            }}
          >
            This is body text using the standard paragraph style. It uses Geist font with light weight (300) and 160% line height for optimal readability. The quick brown fox jumps over the lazy dog.
          </p>
          <p className="text-xs text-[color:var(--color-fg-muted)] mt-2">
            16px • font-weight: 300 • line-height: 160%
          </p>
        </div>

        <div className="border border-[color:var(--color-border-base)] rounded-lg p-6 bg-[color:var(--color-surface-1)]">
          <p
            style={{
              fontFamily: "Geist, sans-serif",
              fontSize: "var(--typography-size-lg)",
              fontWeight: 300,
              lineHeight: "160%",
              margin: 0,
              color: "var(--color-fg-muted)",
            }}
          >
            This is an intro paragraph style, typically used for the first paragraph on a page. It uses a slightly larger font size (18px) to draw attention and establish context.
          </p>
          <p className="text-xs text-[color:var(--color-fg-muted)] mt-2">
            18px • font-weight: 300 • line-height: 160%
          </p>
        </div>
      </div>

      <h2 id="lists">Lists</h2>
      <p>
        List styles for ordered and unordered lists:
      </p>

      <div className="my-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border border-[color:var(--color-border-base)] rounded-lg p-6 bg-[color:var(--color-surface-1)]">
          <h4 id="unordered-list" className="text-sm font-semibold mb-3">Unordered List</h4>
          <ul className="list-disc pl-6 space-y-2" style={{ fontFamily: "Geist, sans-serif", fontSize: "var(--typography-size-md)", fontWeight: 300, lineHeight: "160%" }}>
            <li>First item in the list</li>
            <li>Second item with more content to demonstrate wrapping</li>
            <li>Third item</li>
            <li>Fourth item</li>
          </ul>
        </div>

        <div className="border border-[color:var(--color-border-base)] rounded-lg p-6 bg-[color:var(--color-surface-1)]">
          <h4 id="ordered-list" className="text-sm font-semibold mb-3">Ordered List</h4>
          <ol className="list-decimal pl-6 space-y-2" style={{ fontFamily: "Geist, sans-serif", fontSize: "var(--typography-size-md)", fontWeight: 300, lineHeight: "160%" }}>
            <li>First numbered item</li>
            <li>Second numbered item</li>
            <li>Third numbered item</li>
            <li>Fourth numbered item</li>
          </ol>
        </div>
      </div>

      <h2 id="code">Code & Monospace</h2>
      <p>
        Monospace font styles for code blocks and inline code:
      </p>

      <div className="my-8 space-y-4">
        <div className="border border-[color:var(--color-border-base)] rounded-lg p-6 bg-[color:var(--color-surface-1)]">
          <h4 id="inline-code" className="text-sm font-semibold mb-3">Inline Code</h4>
          <p style={{ fontFamily: "Geist, sans-serif", fontSize: "var(--typography-size-md)", fontWeight: 300, lineHeight: "160%" }}>
            Use <code className="font-mono bg-[color:var(--color-surface-2)] px-1.5 py-0.5 rounded text-sm">inline code</code> for short code snippets within paragraphs.
          </p>
        </div>

        <div className="border border-[color:var(--color-border-base)] rounded-lg p-6 bg-[color:var(--color-surface-1)]">
          <h4 id="code-block" className="text-sm font-semibold mb-3">Code Block</h4>
          <pre className="bg-[color:var(--color-surface-2)] p-4 rounded-lg overflow-x-auto">
            <code className="font-mono text-sm" style={{ fontFamily: "ui-monospace, SFMono-Regular" }}>
{`const fragment = "design system";
const tokens = { typography: "system" };
console.log(fragment, tokens);`}
            </code>
          </pre>
        </div>
      </div>

      <h2 id="usage-examples">Usage Examples</h2>
      <p>
        Here are practical examples of how to use typography tokens and styles in your components:
      </p>

      <h3 id="css-variables">CSS Variables</h3>
      <pre className="bg-[color:var(--color-surface-1)] p-4 rounded-lg overflow-x-auto my-4">
        <code>{`/* Font families */
font-family: var(--typography-font-sans);
font-family: var(--typography-font-mono);

/* Font sizes */
font-size: var(--typography-size-sm); /* 14px */
font-size: var(--typography-size-md); /* 16px */
font-size: var(--typography-size-lg); /* 18px */

/* Using with density multipliers */
font-size: calc(var(--typography-size-md) * var(--density-normal-typography-size-multiplier));`}</code>
      </pre>

      <h3 id="tailwind-classes">Tailwind Classes</h3>
      <pre className="bg-[color:var(--color-surface-1)] p-4 rounded-lg overflow-x-auto my-4">
        <code>{`/* Display styles */
<h1 className="text-display-2xl">Display Heading</h1>
<h2 className="text-display-xl">Large Display</h2>

/* Text styles */
<p className="text-lg">Large text</p>
<p className="text-md">Medium text</p>
<p className="text-sm">Small text</p>

/* Font weights */
<p className="font-light">Light (300)</p>
<p className="font-normal">Regular (400)</p>
<p className="font-medium">Medium (500)</p>
<p className="font-semibold">Semibold (600)</p>
<p className="font-bold">Bold (700)</p>

/* Font families */
<p className="font-sans">Sans-serif text</p>
<code className="font-mono">Monospace code</code>`}</code>
      </pre>

      <h3 id="react-components">React Components</h3>
      <pre className="bg-[color:var(--color-surface-1)] p-4 rounded-lg overflow-x-auto my-4">
        <code>{`import { cn } from "@/lib/utils";

// Display heading
<h1 
  className={cn(
    "text-display-lg",
    "font-medium",
    "text-[color:var(--foreground-primary)]"
  )}
>
  Hero Title
</h1>

// Body text
<p 
  style={{
    fontFamily: "Geist, sans-serif",
    fontSize: "var(--typography-size-md)",
    fontWeight: 300,
    lineHeight: "160%",
  }}
>
  Body text content
</p>

// Code block
<pre className="font-mono text-sm bg-[color:var(--color-surface-2)] p-4 rounded">
  <code>const code = "example";</code>
</pre>`}</code>
      </pre>

      <h2 id="best-practices">Best Practices</h2>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li>
          <strong>Use semantic HTML:</strong> Always use proper heading tags (h1-h6) instead of styled divs for accessibility
        </li>
        <li>
          <strong>Maintain hierarchy:</strong> Use heading levels in order (h1 → h2 → h3) without skipping levels
        </li>
        <li>
          <strong>Limit display styles:</strong> Use display styles sparingly for hero sections and major headings only
        </li>
        <li>
          <strong>Consistent line heights:</strong> Use the predefined line heights (110% for display, 150-160% for text) for optimal readability
        </li>
        <li>
          <strong>Font weights:</strong> Use medium (500) for headings and light (300) for body text to maintain visual hierarchy
        </li>
        <li>
          <strong>Responsive typography:</strong> Consider using smaller font sizes on mobile devices
        </li>
        <li>
          <strong>Density modes:</strong> Typography scales automatically with density modes (compact, normal, comfortable)
        </li>
      </ul>

      <h2 id="density">Density Modes</h2>
      <p>
        Typography scales automatically with density modes. See{" "}
        <a href="/docs/foundations/tokens#density" className="underline text-[color:var(--color-brand-primary)]">
          Density documentation
        </a>{" "}
        for more details on how typography adapts to different density settings.
      </p>

      <div className="my-6 p-4 rounded-lg bg-[color:var(--color-surface-1)] border border-[color:var(--color-border-base)]">
              <h4 id="density-typography-multipliers" className="text-sm font-semibold mb-2">Density Typography Multipliers</h4>
        <ul className="list-disc pl-6 space-y-1 text-sm">
          <li><strong>Compact:</strong> 0.875x size multiplier, 1.3 line height</li>
          <li><strong>Normal:</strong> 1x size multiplier, 1.5 line height</li>
          <li><strong>Comfortable:</strong> 1.125x size multiplier, 1.7 line height</li>
        </ul>
      </div>

      <EditOnGitHub filePath="apps/www/app/docs/foundations/typography/page.tsx" />
    </DocLayout>
  );
}

