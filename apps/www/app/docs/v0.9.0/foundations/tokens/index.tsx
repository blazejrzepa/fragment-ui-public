"use client";

import { DocLayout } from "../../../../../src/components/doc-layout";

/**
 * Version 0.9.0 of the Tokens documentation
 * This is an example of versioned content - in a real scenario,
 * this would contain the actual v0.9.0 documentation.
 */
export default function TokensPageV090() {
  return (
    <DocLayout>
      <div className="mb-4 p-3 rounded-lg border border-yellow-500/30 bg-yellow-500/10">
        <p className="text-sm text-yellow-200">
          ⚠️ This is version 0.9.0 documentation. Some features may have changed in newer versions.
        </p>
      </div>

      <h1>Design Tokens (v0.9.0)</h1>
      <p>
        Design tokens are foundational values used to build consistent, scalable interfaces.
        This is the documentation for version 0.9.0.
      </p>
      
      <h2 id="colors">Colors</h2>
      <p>All colors are available as CSS variables with semantic naming:</p>
      <pre className="bg-[color:var(--color-surface-1)] p-4 rounded-lg overflow-x-auto"><code>{`/* Background colors */
--color-bg-base: #0B0B0C;
--color-bg-inverse: #FFFFFF;

/* Foreground colors */
--color-fg-base: #EDEDF0;
--color-fg-muted: #B5B8BE;

/* Brand colors */
--color-brand-primary: #6B8CFF;
--color-brand-primary-600: #5B7AF0;

/* Surface colors */
--color-surface-1: #121214;
--color-surface-2: #19191B;

/* Accent colors */
--color-accent-green: #22C55E;
--color-accent-red: #EF4444;`}</code></pre>

      <p className="mt-4 text-sm text-[color:var(--color-fg-muted)]">
        <strong>Note:</strong> Version 0.9.0 did not include high contrast mode or extended tokens.
        These features were added in version 1.0.0.
      </p>

      <h2 id="spacing">Spacing</h2>
      <p>Consistent spacing scale based on 4px base unit:</p>
      <pre className="bg-[color:var(--color-surface-1)] p-4 rounded-lg overflow-x-auto"><code>{`--space-0: 0px;
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-6: 24px;
--space-8: 32px;`}</code></pre>

      <h2 id="typography">Typography</h2>
      <p>Font families and sizes:</p>
      <pre className="bg-[color:var(--color-surface-1)] p-4 rounded-lg overflow-x-auto"><code>{`--font-sans: system-ui, -apple-system, sans-serif;
--font-mono: 'Fira Code', monospace;

--font-size-sm: 0.875rem;
--font-size-base: 1rem;
--font-size-lg: 1.125rem;`}</code></pre>

      <div className="mt-6 p-4 rounded-lg bg-[color:var(--color-surface-1)] border border-[color:var(--color-fg-muted)]/30">
        <p className="text-sm text-[color:var(--color-fg-muted)]">
          💡 <strong>Upgrade tip:</strong> Version 1.0.0 introduced density tokens, motion animations,
          high contrast mode, and RTL support. Consider upgrading for these features.
        </p>
      </div>
    </DocLayout>
  );
}

