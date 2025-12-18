"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { DocLayout } from "../../../../src/components/doc-layout";
import { EditOnGitHub, Button, CodeBlock } from "@fragment_ui/ui";

export default function SemanticColorsPage() {
  return (
    <DocLayout>
      <div className="flex items-center justify-between mb-1">
        <h1 id="semantic-color-tokens" className="text-3xl font-medium mb-4">Semantic Color Tokens</h1>
        <div className="flex items-center gap-2">
          <Link href={"/docs/foundations/theming"}>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <Link href={"/docs/foundations/spacing"}>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
      <p className="mb-6 intro-text">
        Semantic color tokens for status indicators (success, error, warning, info) that work across all themes.
      </p>

      <h2 id="overview">Overview</h2>
      <p>
        Semantic color tokens provide a consistent way to communicate status and feedback across
        your application. Each status type includes multiple color variants:
      </p>
      <ul>
        <li>
          <strong>base</strong> - Primary status color
        </li>
        <li>
          <strong>bg</strong> - Background color for status containers
        </li>
        <li>
          <strong>fg</strong> - Foreground/text color for status content
        </li>
        <li>
          <strong>border</strong> - Border color for status elements
        </li>
        <li>
          <strong>muted</strong> - Muted variant for secondary status indicators
        </li>
      </ul>

      <h2 id="available-colors">Available Status Colors</h2>

      <h3>Success</h3>
      <div className="space-y-4 my-4">
        <div className="p-4 rounded-lg border" style={{ backgroundColor: "var(--color-status-success-bg)", borderColor: "var(--color-status-success-border)", color: "var(--color-status-success-fg)" }}>
          <strong>Success:</strong> Operation completed successfully
        </div>
      </div>
      <CodeBlock language="css" highlightApiUrl="/api/highlight-code">{`--color-status-success-base: #22C55E
--color-status-success-bg: #F0FDF4 (light) / #052E16 (dark)
--color-status-success-fg: #15803D (light) / #86EFAC (dark)
--color-status-success-border: #BBF7D0 (light) / #166534 (dark)
--color-status-success-muted: #86EFAC (light) / #15803D (dark)`}</CodeBlock>

      <h3>Error</h3>
      <div className="space-y-4 my-4">
        <div className="p-4 rounded-lg border" style={{ backgroundColor: "var(--color-status-error-bg)", borderColor: "var(--color-status-error-border)", color: "var(--color-status-error-fg)" }}>
          <strong>Error:</strong> Something went wrong. Please try again.
        </div>
      </div>
      <CodeBlock language="css" highlightApiUrl="/api/highlight-code">{`--color-status-error-base: #EF4444
--color-status-error-bg: #FEF2F2 (light) / #7F1D1D (dark)
--color-status-error-fg: #DC2626 (light) / #FCA5A5 (dark)
--color-status-error-border: #FECACA (light) / #991B1B (dark)
--color-status-error-muted: #FCA5A5 (light) / #DC2626 (dark)`}</CodeBlock>

      <h3>Warning</h3>
      <div className="space-y-4 my-4">
        <div className="p-4 rounded-lg border" style={{ backgroundColor: "var(--color-status-warning-bg)", borderColor: "var(--color-status-warning-border)", color: "var(--color-status-warning-fg)" }}>
          <strong>Warning:</strong> Please review this action before proceeding.
        </div>
      </div>
      <CodeBlock language="css" highlightApiUrl="/api/highlight-code">{`--color-status-warning-base: #F59E0B
--color-status-warning-bg: #FFFBEB (light) / #78350F (dark)
--color-status-warning-fg: #D97706 (light) / #FCD34D (dark)
--color-status-warning-border: #FDE68A (light) / #92400E (dark)
--color-status-warning-muted: #FCD34D (light) / #D97706 (dark)`}</CodeBlock>

      <h3>Info</h3>
      <div className="space-y-4 my-4">
        <div className="p-4 rounded-lg border" style={{ backgroundColor: "var(--color-status-info-bg)", borderColor: "var(--color-status-info-border)", color: "var(--color-status-info-fg)" }}>
          <strong>Info:</strong> Here's some helpful information for you.
        </div>
      </div>
      <CodeBlock language="css" highlightApiUrl="/api/highlight-code">{`--color-status-info-base: #3B82F6
--color-status-info-bg: #EFF6FF (light) / #1E3A8A (dark)
--color-status-info-fg: #2563EB (light) / #93C5FD (dark)
--color-status-info-border: #DBEAFE (light) / #1E40AF (dark)
--color-status-info-muted: #93C5FD (light) / #2563EB (dark)`}</CodeBlock>

      <h2 id="usage">Usage</h2>

      <h3>CSS Variables</h3>
      <CodeBlock language="css" highlightApiUrl="/api/highlight-code">{`/* Success alert */
.success-alert {
  background-color: var(--color-status-success-bg);
  color: var(--color-status-success-fg);
  border-color: var(--color-status-success-border);
}

/* Error badge */
.error-badge {
  background-color: var(--color-status-error-bg);
  color: var(--color-status-error-fg);
}

/* Use "base" for accents (e.g., left border or icon), and bg/fg for containers */
.warning-accent {
  border-left: 3px solid var(--color-status-warning-base);
  background: var(--color-status-warning-bg);
  color: var(--color-status-warning-fg);
}

/* Info text */
.info-text {
  color: var(--color-status-info-fg);
}`}</CodeBlock>

      <h3>React Components</h3>
      <p>Use semantic colors in your components:</p>
      <CodeBlock language="tsx" highlightApiUrl="/api/highlight-code">{`
<Alert variant="success">
  <AlertTitle>Success</AlertTitle>
  <AlertDescription>Operation completed successfully.</AlertDescription>
</Alert>

<Alert variant="destructive">
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>Something went wrong.</AlertDescription>
</Alert>

<Alert variant="warning">
  <AlertTitle>Warning</AlertTitle>
  <AlertDescription>Please review this action.</AlertDescription>
</Alert>

<Alert variant="info">
  <AlertTitle>Info</AlertTitle>
  <AlertDescription>Here's some helpful information.</AlertDescription>
</Alert>

// Custom alert using semantic colors
<div style={{
  backgroundColor: "var(--color-status-success-bg)",
  color: "var(--color-status-success-fg)",
  borderColor: "var(--color-status-success-border)"
}}>
  Success message
</div>`}</CodeBlock>

      <h3 id="tailwind-usage">Using semantic colors with Tailwind</h3>
      <p>
        Semantic colors should be consumed via CSS variables (so they can adapt to light/dark/high-contrast).
        In Tailwind, use arbitrary values:
      </p>
      <CodeBlock language="tsx" highlightApiUrl="/api/highlight-code">{`<div
  className="    border
    bg-[color:var(--color-status-success-bg)]
    text-[color:var(--color-status-success-fg)]
    border-[color:var(--color-status-success-border)]
    p-[var(--space-4)]
    rounded-[var(--radius-md)]
  \">
  Success
</div>`}</CodeBlock>

      <h2 id="theme-support">Theme Support</h2>
      <p>
        Semantic colors automatically adapt to the current theme (light, dark, high-contrast). The
        colors are optimized for each theme to ensure proper contrast and readability.
      </p>

      <h3>High Contrast Mode</h3>
      <p>
        In high contrast mode, semantic colors use maximum contrast values for better accessibility:
      </p>
      <ul>
        <li>Success: Bright green (#00FF00)</li>
        <li>Error: Bright red (#FF0000)</li>
        <li>Warning: Bright yellow (#FFFF00)</li>
        <li>Info: Bright cyan (#00FFFF)</li>
      </ul>

      <h2 id="best-practices">Best Practices</h2>
      <ul>
        <li>
          <strong>Use semantic colors consistently:</strong> Always use status color tokens instead
          of hardcoded colors
        </li>
        <li>
          <strong>Consider context:</strong> Use bg/fg variants for containers, base for accents
        </li>
        <li>
          <strong>Test contrast:</strong> Ensure text is readable in all themes
        </li>
        <li>
          <strong>Use appropriate variants:</strong> Use muted for secondary indicators, base for
          primary actions
        </li>
      </ul>

      <h2 id="links">Links</h2>
      <ul>
        <li>
          <a href="/docs/foundations/tokens" className="underline text-[color:var(--color-brand-primary)]">
            Design Tokens
          </a>
        </li>
        <li>
          <a href="/docs/foundations/theming" className="underline text-[color:var(--color-brand-primary)]">
            Theming & Modes
          </a>
        </li>
      </ul>

      <EditOnGitHub filePath="apps/www/app/docs/foundations/semantic-colors/page.tsx" />
    </DocLayout>
  );
}

