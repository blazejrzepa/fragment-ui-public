"use client";

import { DocLayout } from "../../../../src/components/doc-layout";
import { DocPager } from "../../../../src/components/doc-pager";
import { useState } from "react";
import tokens from "@fragment_ui/tokens/json";

const TYPOGRAPHY_TOKENS = tokens.typography as any;

const DISPLAY_ORDER = ["2xl", "xl", "lg", "md", "sm", "xs"] as const;
const TEXT_ORDER = ["2xl", "xl", "lg", "md", "intro", "sm", "xs"] as const;
const WEIGHT_ORDER = ["light", "regular", "medium", "semibold", "bold"] as const;

const formatPercent = (value: number) => `${Math.round(value * 100)}%`;
const formatPx = (value: number) => `${value}px`;

const DISPLAY_STYLES = DISPLAY_ORDER.map((key) => {
  const t = TYPOGRAPHY_TOKENS.display?.[key];
  return {
    key,
    name: `Display ${key}`,
    size: t?.size,
    lineHeight: t?.["line-height"] ?? TYPOGRAPHY_TOKENS["line-height"]?.display,
    letterSpacing: t?.["letter-spacing"],
    className: `text-display-${key}`,
  };
});

const TEXT_STYLES = TEXT_ORDER.map((key) => {
  const size = TYPOGRAPHY_TOKENS.size?.[key];
  return {
    key,
    name: `Text ${key}`,
    size,
    lineHeight: key === "2xl" || key === "xl" || key === "lg"
      ? (TYPOGRAPHY_TOKENS["line-height"]?.text ?? 1.5)
      : (TYPOGRAPHY_TOKENS["line-height"]?.body ?? 1.6),
    className: `text-${key}`,
  };
});

const FONT_WEIGHTS = WEIGHT_ORDER.map((key) => {
  const value = TYPOGRAPHY_TOKENS.weight?.[key];
  const name = key === "semibold" ? "Semibold" : key.charAt(0).toUpperCase() + key.slice(1);
  return { key, name, value };
});

export default function TypographyPage() {
  const [selectedWeight, setSelectedWeight] = useState<number>(400);

  return (
    <DocLayout>
      <div className="flex items-center justify-between mb-1">
        <h1 id="typography" className="text-3xl font-medium mb-4">
          Typography
        </h1>
        <DocPager placement="top" align="end" variant="icon" dense />
      </div>
      <p className="mb-6 intro-text">
        Typography tokens for consistent text across the design system.
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
            style={{ fontFamily: TYPOGRAPHY_TOKENS.font.sans }}
            className="text-lg"
          >
            The quick brown fox jumps over the lazy dog
          </div>
          <div 
            style={{ fontFamily: TYPOGRAPHY_TOKENS.font.sans }}
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
        The typography system provides a font-size scale driven by tokens:
      </p>

      <div className="my-8 space-y-4">
        {Object.entries(TYPOGRAPHY_TOKENS.size ?? {}).map(([key, rawValue]) => {
          const px =
            typeof rawValue === "number"
              ? rawValue
              : typeof rawValue === "string"
                ? Number.parseFloat(rawValue)
                : Number(rawValue);

          const hasValidPx = Number.isFinite(px);
          const label = hasValidPx ? `${px}px` : String(rawValue);

          return (
            <div
              key={key}
              className="border border-[color:var(--color-border-base)] rounded-lg p-4"
            >
              <div className="flex items-center gap-4 mb-3">
                <code className="text-sm font-mono bg-[color:var(--color-surface-1)] px-2 py-1 rounded">
                  --typography-size-{key}
                </code>
                <span className="text-sm text-[color:var(--color-fg-muted)]">
                  {label}
                </span>
              </div>
              <div
                style={hasValidPx ? { fontSize: `${px}px` } : undefined}
                className="font-sans"
              >
                The quick brown fox jumps over the lazy dog ({label})
              </div>
            </div>
          );
        })}
      </div>

      <h2 id="font-weights">Font Weights</h2>
      <p>
        Fragment UI supports five font weights for different text hierarchies and emphasis:
      </p>

      <div className="my-8 space-y-4">
        {FONT_WEIGHTS.map((weight) => (
          <div
            key={weight.key}
            className={`border rounded-lg p-4 transition-all ${
              selectedWeight === weight.value
                ? "border-[color:var(--color-brand-primary)] bg-[color:var(--color-surface-2)]"
                : "border-[color:var(--color-border-base)]"
            }`}
            onClick={() => typeof weight.value === "number" && setSelectedWeight(weight.value)}
          >
            <div className="flex items-center gap-4 mb-3">
              <code className="text-sm font-mono bg-[color:var(--color-surface-1)] px-2 py-1 rounded">
                --typography-weight-{weight.key}
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
            key={style.key}
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
                {typeof style.size === "number" && <div>Size: {formatPx(style.size)}</div>}
                {typeof style.lineHeight === "number" && <div>Line height: {formatPercent(style.lineHeight)}</div>}
                {typeof style.letterSpacing === "number" && <div>Letter spacing: {formatPx(style.letterSpacing)}</div>}
              </div>
            </div>
            <div className={`${style.className} font-sans font-medium text-[color:var(--color-fg-base)]`}>
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
            key={style.key}
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
                {typeof style.size === "number" ? `Size: ${formatPx(style.size)}` : "Size: —"}
                {" • "}
                {typeof style.lineHeight === "number" ? `Line height: ${formatPercent(style.lineHeight)}` : "Line height: —"}
              </div>
            </div>
            <div className={`${style.className} font-sans font-normal text-[color:var(--color-fg-base)]`}>
              The quick brown fox jumps over the lazy dog. This is sample text to demonstrate the {style.name.toLowerCase()} style.
            </div>
          </div>
        ))}
      </div>

      <h2 id="semantic-elements">Semantic elements</h2>
      <p>
        In Fragment UI docs, semantic HTML elements (headings, paragraphs, lists, inline code, strong/emphasis) are styled by <code>DocumentContent</code> using DS typography tokens. This avoids duplicating (and potentially drifting) hardcoded values in the documentation.
      </p>

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
font-size: var(--typography-size-xs); /* 12px */
font-size: var(--typography-size-intro); /* 15px */
font-size: var(--typography-size-sm); /* 14px */
font-size: var(--typography-size-md); /* 16px */
font-size: var(--typography-size-lg); /* 18px */
font-size: var(--typography-size-xl); /* 20px */
font-size: var(--typography-size-2xl); /* 22px */

/* Using with density multipliers */
font-size: calc(var(--typography-size-md) * var(--density-typography-size-multiplier));`}</code>
      </pre>

      <h3 id="tailwind-classes">Tailwind Classes</h3>
      <p className="text-sm text-[color:var(--color-fg-muted)]">
        Note: Tailwind utilities like <code>text-xs</code> are fixed rem-based sizes. If you want typography to be driven by
        design tokens (and respond to Theme Builder / density), prefer <code>text-[length:var(--typography-size-*)]</code> (or inline
        styles with <code>var(--typography-size-*)</code>).
      </p>
      <pre className="bg-[color:var(--color-surface-1)] p-4 rounded-lg overflow-x-auto my-4">
        <code>{`/* Display styles */
<h1 className="text-display-2xl">Display Heading</h1>
<h2 className="text-display-xl">Large Display</h2>

/* Text styles */
<p className="text-[length:var(--typography-size-lg)]">Large text</p>
<p className="text-[length:var(--typography-size-md)]">Medium text</p>
<p className="text-[length:var(--typography-size-sm)]">Small text</p>
<p className="text-[length:var(--typography-size-xs)]">Extra small text</p>

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

    </DocLayout>
  );
}

