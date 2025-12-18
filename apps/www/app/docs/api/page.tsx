import { Metadata } from "next";
import Link from "next/link";
import { DocLayout } from "../../../src/components/doc-layout";
import { DocPager } from "../../../src/components/doc-pager";
import { CodeBlock } from "@fragment_ui/ui";

export const metadata: Metadata = {
  title: "API Reference | Fragment UI",
  description: "API reference for the Fragment UI documentation site.",
};

export default function APIPage() {
  return (
    <DocLayout>
      <div className="flex items-center justify-between mb-1">
        <h1 id="api" className="text-3xl font-medium mb-4">
          API
        </h1>
        <DocPager placement="top" align="end" variant="icon" dense />
      </div>

      <p className="mb-6 intro-text">
        API reference for endpoints exposed by the documentation site.
      </p>

      <div className="max-w-none mt-6 space-y-10">
        <section>
          <h2 id="quick-links">Quick links</h2>
          <ul>
            <li>
              <Link href="/docs/tools" className="text-[color:var(--color-brand-primary)] hover:underline">
                Tools (Analytics / Governance)
              </Link>
            </li>
            <li>
              <Link href="/docs/setup" className="text-[color:var(--color-brand-primary)] hover:underline">
                Setup
              </Link>
            </li>
          </ul>
        </section>

        <section>
          <h2 id="overview">Overview</h2>
          <ul>
            <li>
              <strong>Docs site API</strong> (<code>apps/www</code>): small set of endpoints used by documentation rendering
              and the Tools pages. Base URL: current site origin (<code>http://localhost:3001</code> in your dev setup).
            </li>
          </ul>
        </section>

        <section>
          <h2 id="docs-site">Docs site API (apps/www)</h2>
          <p className="text-sm text-[color:var(--color-fg-muted)]">
            These endpoints are implemented in <code>apps/www/app/api/**</code>.
          </p>

          <h3 id="post-api-highlight-code">POST /api/highlight-code</h3>
          <p>Syntax-highlight code blocks for the docs UI.</p>
          <h4>Request body</h4>
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code" showLineNumbers={false}>
{`{
  code: string;
  language?: string;         // default: "typescript"
  showLineNumbers?: boolean; // default: true
}`}
          </CodeBlock>
          <h4>Response</h4>
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code" showLineNumbers={false}>
{`{
  html: string;
}`}
          </CodeBlock>

          <h3 id="get-api-analytics-component-usage">GET /api/analytics/component-usage</h3>
          <p className="text-sm text-[color:var(--color-fg-muted)]">
            Used by <code>/tools/component-analytics</code>. Currently returns mock data.
          </p>
          <h4>Query params</h4>
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code" showLineNumbers={false}>
{`{
  period?: "monthly" | "weekly" | "daily";
  component?: string;
  sortBy?: "popularity" | "installs" | "uses" | "repositories" | "name";
  limit?: number; // default: 50
}`}
          </CodeBlock>

          <h3 id="get-api-governance-compliance">GET /api/governance/compliance</h3>
          <p className="text-sm text-[color:var(--color-fg-muted)]">
            Used by <code>/tools/governance</code>. Currently returns mock data.
          </p>
          <h4>Query params</h4>
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code" showLineNumbers={false}>
{`{
  component?: string;
}`}
          </CodeBlock>

          <h3 id="post-api-telemetry">POST /api/telemetry</h3>
          <p className="text-sm text-[color:var(--color-fg-muted)]">
            Dev-only logging stub used for telemetry ingestion.
          </p>
          <h4>Request body (shape)</h4>
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code" showLineNumbers={false}>
{`{
  events: any[];
  context?: Record<string, any>;
}`}
          </CodeBlock>
        </section>

        <section>
          <h2 id="errors">Error handling</h2>
          <p className="text-sm text-[color:var(--color-fg-muted)]">
            Most endpoints use standard HTTP status codes (400/401/404/500) and return JSON with an <code>error</code> or <code>message</code>.
          </p>
        </section>
      </div>
    </DocLayout>
  );
}

