"use client";

import { DocLayout } from "../../../../src/components/doc-layout";
import { DocPager } from "../../../../src/components/doc-pager";
import { CodeBlock } from "@fragment_ui/ui";
import { useState } from "react";

// Spacing scale from tokens.json
const SPACING_SCALE = {
  "0": 0,
  "1": 4,
  "2": 8,
  "3": 12,
  "4": 16,
  "6": 24,
  "8": 32,
} as const;

export default function SpacingPage() {
  const [selectedSpace, setSelectedSpace] = useState<keyof typeof SPACING_SCALE>("4");

  return (
    <DocLayout>
      <div className="flex items-center justify-between mb-[var(--space-1)]">
        <h1 id="spacing" className="text-[length:var(--typography-display-md-size)] font-medium">Spacing</h1>
        <DocPager placement="top" align="end" variant="icon" dense />
      </div>
      <p className="mb-[var(--space-6)] intro-text">
        Spacing tokens for consistent layout and rhythm across the design system.
      </p>

      <h2 id="scale">Spacing Scale</h2>
      <p>The spacing scale provides values from 0 to 32px in increments that follow a logical progression:</p>

      <div className="my-[var(--space-8)] space-y-[var(--space-4)]">
        {Object.entries(SPACING_SCALE).map(([key, value]) => (
          <div
            key={key}
            className={`border rounded-[var(--radius-md)] p-[var(--space-4)] transition-all ${
              selectedSpace === key
                ? "border-[color:var(--color-brand-primary)] bg-[color:var(--color-surface-2)]"
                : "border-[color:var(--color-border-base)]"
            }`}
            onClick={() => setSelectedSpace(key as keyof typeof SPACING_SCALE)}
          >
            <div className="flex items-center gap-[var(--space-4)] mb-[var(--space-3)]">
              <div className="flex items-center gap-[var(--space-2)]">
                <code className="text-[length:var(--typography-size-sm)] font-mono bg-[color:var(--color-surface-1)] px-[var(--space-2)] py-[var(--space-1)] rounded">
                  --space-{key}
                </code>
                <span className="text-[length:var(--typography-size-sm)] text-[color:var(--color-fg-muted)]">
                  {value}px
                </span>
              </div>
              <button
                className="text-[length:var(--typography-size-xs)] text-[color:var(--color-brand-primary)] hover:underline"
                onClick={(e) => {
                  e.stopPropagation();
                  navigator.clipboard.writeText(`var(--space-${key})`);
                }}
              >
                Copy CSS variable
              </button>
            </div>
            <div className="flex items-center gap-[var(--space-2)]">
              <div
                className="bg-[color:var(--color-brand-primary)] h-8 rounded"
                style={{ width: `${value}px` }}
                title={`${value}px`}
              />
              <div className="text-[length:var(--typography-size-xs)] text-[color:var(--color-fg-muted)]">
                Visual representation
              </div>
            </div>
          </div>
        ))}
      </div>

      <h2 id="usage">Usage Examples</h2>
      <p>Here are practical examples of how to use spacing tokens in your components:</p>

      <h3>Padding Examples</h3>
      <div className="space-y-[var(--space-4)] my-[var(--space-6)]">
        <div className="border border-[color:var(--color-border-base)] rounded-lg p-[var(--space-4)]">
          <p className="text-[length:var(--typography-size-sm)] font-semibold mb-[var(--space-2)]">Small padding (space-2 = 8px)</p>
          <div className="bg-[color:var(--color-surface-2)] rounded" style={{ padding: "var(--space-2)" }}>
            <div className="bg-[color:var(--color-brand-primary)] text-white text-[length:var(--typography-size-xs)] px-[var(--space-2)] py-[var(--space-1)] rounded inline-block">
              Content
            </div>
          </div>
        </div>

        <div className="border border-[color:var(--color-border-base)] rounded-lg p-[var(--space-4)]">
          <p className="text-[length:var(--typography-size-sm)] font-semibold mb-[var(--space-2)]">Medium padding (space-4 = 16px)</p>
          <div className="bg-[color:var(--color-surface-2)] rounded" style={{ padding: "var(--space-4)" }}>
            <div className="bg-[color:var(--color-brand-primary)] text-white text-[length:var(--typography-size-xs)] px-[var(--space-2)] py-[var(--space-1)] rounded inline-block">
              Content
            </div>
          </div>
        </div>

        <div className="border border-[color:var(--color-border-base)] rounded-lg p-[var(--space-4)]">
          <p className="text-[length:var(--typography-size-sm)] font-semibold mb-[var(--space-2)]">Large padding (space-8 = 32px)</p>
          <div className="bg-[color:var(--color-surface-2)] rounded" style={{ padding: "var(--space-8)" }}>
            <div className="bg-[color:var(--color-brand-primary)] text-white text-[length:var(--typography-size-xs)] px-[var(--space-2)] py-[var(--space-1)] rounded inline-block">
              Content
            </div>
          </div>
        </div>
      </div>

      <h3>Gap Examples</h3>
      <div className="space-y-4 my-6">
        <div className="border border-[color:var(--color-border-base)] rounded-lg p-4">
          <p className="text-sm font-semibold mb-2">Small gap (space-2 = 8px)</p>
          <div className="flex gap-[var(--space-2)]">
            <div className="bg-[color:var(--color-brand-primary)] text-white text-xs px-3 py-2 rounded">
              Item 1
            </div>
            <div className="bg-[color:var(--color-brand-primary)] text-white text-xs px-3 py-2 rounded">
              Item 2
            </div>
            <div className="bg-[color:var(--color-brand-primary)] text-white text-xs px-3 py-2 rounded">
              Item 3
            </div>
          </div>
        </div>

        <div className="border border-[color:var(--color-border-base)] rounded-lg p-4">
          <p className="text-sm font-semibold mb-2">Medium gap (space-4 = 16px)</p>
          <div className="flex gap-[var(--space-4)]">
            <div className="bg-[color:var(--color-brand-primary)] text-white text-xs px-3 py-2 rounded">
              Item 1
            </div>
            <div className="bg-[color:var(--color-brand-primary)] text-white text-xs px-3 py-2 rounded">
              Item 2
            </div>
            <div className="bg-[color:var(--color-brand-primary)] text-white text-xs px-3 py-2 rounded">
              Item 3
            </div>
          </div>
        </div>

        <div className="border border-[color:var(--color-border-base)] rounded-lg p-4">
          <p className="text-sm font-semibold mb-2">Large gap (space-6 = 24px)</p>
          <div className="flex gap-[var(--space-6)]">
            <div className="bg-[color:var(--color-brand-primary)] text-white text-xs px-3 py-2 rounded">
              Item 1
            </div>
            <div className="bg-[color:var(--color-brand-primary)] text-white text-xs px-3 py-2 rounded">
              Item 2
            </div>
            <div className="bg-[color:var(--color-brand-primary)] text-white text-xs px-3 py-2 rounded">
              Item 3
            </div>
          </div>
        </div>
      </div>

      <h3>Margin Examples</h3>
      <div className="space-y-4 my-6">
        <div className="border border-[color:var(--color-border-base)] rounded-lg p-4">
          <p className="text-sm font-semibold mb-2">Stacked elements with margin (space-4 = 16px)</p>
          <div className="space-y-[var(--space-4)]">
            <div className="bg-[color:var(--color-surface-2)] p-3 rounded">
              <div className="text-sm">Card 1</div>
            </div>
            <div className="bg-[color:var(--color-surface-2)] p-3 rounded">
              <div className="text-sm">Card 2</div>
            </div>
            <div className="bg-[color:var(--color-surface-2)] p-3 rounded">
              <div className="text-sm">Card 3</div>
            </div>
          </div>
        </div>
      </div>

      <h2 id="interactive">Interactive Tool</h2>
      <p>
        Use the interactive tool below to test different spacing values and see how they affect
        component layouts:
      </p>

      <div className="border border-[color:var(--color-border-base)] rounded-lg p-6 my-6 bg-[color:var(--color-surface-1)]">
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">
            Select spacing value:
          </label>
          <select
            value={selectedSpace}
            onChange={(e) => setSelectedSpace(e.target.value as keyof typeof SPACING_SCALE)}
            className="px-3 py-2 border border-[color:var(--color-border-base)] rounded bg-[color:var(--color-surface-1)] text-[color:var(--color-fg-base)]"
          >
            {Object.keys(SPACING_SCALE).map((key) => (
              <option key={key} value={key}>
                --space-{key} ({SPACING_SCALE[key as keyof typeof SPACING_SCALE]}px)
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-[color:var(--color-fg-muted)] mb-2">
              Padding: <code className="text-xs">var(--space-{selectedSpace})</code>
            </p>
            <div
              className="bg-[color:var(--color-surface-2)] rounded border-2 border-dashed border-[color:var(--color-brand-primary)]"
              style={{ padding: `var(--space-${selectedSpace})` }}
            >
              <div className="bg-[color:var(--color-brand-primary)] text-white text-sm px-3 py-2 rounded inline-block">
                Content with {SPACING_SCALE[selectedSpace]}px padding
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm text-[color:var(--color-fg-muted)] mb-2">
              Gap: <code className="text-xs">var(--space-{selectedSpace})</code>
            </p>
            <div
              className="flex bg-[color:var(--color-surface-2)] rounded p-2 border-2 border-dashed border-[color:var(--color-brand-primary)]"
              style={{ gap: `var(--space-${selectedSpace})` }}
            >
              <div className="bg-[color:var(--color-brand-primary)] text-white text-xs px-2 py-1 rounded">
                Item 1
              </div>
              <div className="bg-[color:var(--color-brand-primary)] text-white text-xs px-2 py-1 rounded">
                Item 2
              </div>
              <div className="bg-[color:var(--color-brand-primary)] text-white text-xs px-2 py-1 rounded">
                Item 3
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm text-[color:var(--color-fg-muted)] mb-2">
              Margin: <code className="text-xs">var(--space-{selectedSpace})</code>
            </p>
            <div className="bg-[color:var(--color-surface-2)] rounded p-2">
              <div
                className="bg-[color:var(--color-brand-primary)] text-white text-sm px-3 py-2 rounded inline-block"
                style={{ margin: `var(--space-${selectedSpace})` }}
              >
                Element with {SPACING_SCALE[selectedSpace]}px margin
              </div>
            </div>
          </div>
        </div>
      </div>

      <h2 id="css-variables">CSS Variables</h2>
      <p>All spacing values are available as CSS variables:</p>
      <CodeBlock language="css" highlightApiUrl="/api/highlight-code">{`/* Spacing scale */
--space-0: 0px;
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-6: 24px;
--space-8: 32px;

/* Usage in CSS */
.padding-small {
  padding: var(--space-2); /* 8px */
}

.padding-medium {
  padding: var(--space-4); /* 16px */
}

.padding-large {
  padding: var(--space-8); /* 32px */
}

.gap-medium {
  gap: var(--space-4); /* 16px */
}

.margin-medium {
  margin: var(--space-4); /* 16px */
}`}</CodeBlock>

      <h2 id="best-practices">Best Practices</h2>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li>
          <strong>Use spacing tokens consistently:</strong> Always use CSS variables instead of hardcoded pixel values
        </li>
        <li>
          <strong>Follow the scale:</strong> Stick to the predefined spacing values (0, 1, 2, 3, 4, 6, 8) rather than arbitrary values
        </li>
        <li>
          <strong>Maintain rhythm:</strong> Use consistent spacing throughout your application to create visual rhythm
        </li>
        <li>
          <strong>Consider density:</strong> Adjust spacing based on density mode (compact, normal, comfortable)
        </li>
        <li>
          <strong>Responsive spacing:</strong> Use smaller spacing values on mobile devices and larger values on desktop
        </li>
      </ul>

      <h2 id="density">Density Modes</h2>
      <p>
        Spacing can be adjusted based on density mode. See{" "}
        <a href="/docs/foundations/tokens#density" className="underline text-[color:var(--color-brand-primary)]">
          Density documentation
        </a>{" "}
        for more details.
      </p>
    </DocLayout>
  );
}

