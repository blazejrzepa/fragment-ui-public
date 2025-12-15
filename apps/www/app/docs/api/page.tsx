import { Metadata } from "next";
import { DocLayout } from "../../../src/components/doc-layout";
import { CodeBlock } from "@fragment_ui/ui";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@fragment_ui/ui";
import Link from "next/link";

export const metadata: Metadata = {
  title: "API Reference | Fragment UI",
  description: "Complete API reference for Fragment UI Playground endpoints",
};

export default function APIPage() {
  return (
    <DocLayout>
      <h1 className="text-3xl font-medium mb-6">
        API Reference
      </h1>
      <p className="text-lg text-muted-foreground mb-8">
        Complete reference for all API endpoints in Fragment UI, including Studio, Playground, and management endpoints.
      </p>

      <div className="space-y-8">
        {/* Quick Links */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
            <CardDescription>Access the Playground and related resources</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>
                <Link href="http://localhost:3002/studio" className="text-primary hover:underline">
                  → Studio Application
                </Link>
              </li>
              <li>
                <Link href="/docs/get-started/studio" className="text-primary hover:underline">
                  → Studio Guide
                </Link>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Generation Endpoints */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Generation Endpoints</h2>
          
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>POST /api/generate</CardTitle>
              <CardDescription>Generate React component code from a natural language prompt</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Request Body:</h4>
                <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">
{`{
  prompt: string;           // Natural language description
  demoName?: string;        // Optional name for the demo
  existingCode?: string;    // Optional existing code to modify
}`}
                </CodeBlock>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Response:</h4>
                <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">
{`{
  code: string;             // Generated TSX code
  metadata?: {
    componentName?: string;
    estimatedTime?: number;
  };
}`}
                </CodeBlock>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-4">
            <CardHeader>
              <CardTitle>POST /api/generate-dsl</CardTitle>
              <CardDescription>Generate UI-DSL from a natural language prompt</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Request Body:</h4>
                <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">
{`{
  prompt: string;           // Natural language description
  context?: {
    existingDsl?: UiDsl;    // Optional existing DSL to modify
    intent?: string;        // Optional intent classification
  };
}`}
                </CodeBlock>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Response:</h4>
                <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">
{`{
  dsl: UiDsl;              // Generated UI-DSL structure
  metadata?: {
    recipe?: string;        // Recipe used for generation
    slots?: Record<string, any>;
  };
}`}
                </CodeBlock>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Studio Endpoints */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Studio Endpoints</h2>
          
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>POST /api/dsl/generate</CardTitle>
              <CardDescription>Generate UI-DSL v2 from a natural language prompt (Studio)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Request Body:</h4>
                <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">
{`{
  prompt: string;           // Natural language description
  registry?: ComponentRegistry; // Optional component registry override
  context?: {
    existingDsl?: UiPage;   // Optional existing DSL to modify
    intent?: string;        // Optional intent classification
  };
}`}
                </CodeBlock>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Response:</h4>
                <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">
{`{
  dsl: UiPage;             // Generated UI-DSL v2 structure
  diagnostics: Diagnostic[]; // Validation diagnostics
  metadata?: {
    recipe?: string;       // Recipe used for generation
    version?: string;      // UI-DSL version
  };
}`}
                </CodeBlock>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Generates UI-DSL v2 structures using layout-first approach. Supports complex screens (dashboards, landing pages, CRUD interfaces).
              </p>
            </CardContent>
          </Card>

          <Card className="mb-4">
            <CardHeader>
              <CardTitle>POST /api/dsl/patch</CardTitle>
              <CardDescription>Apply patch operations to UI-DSL v2 (Conversational editing)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Request Body:</h4>
                <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">
{`{
  dsl: UiPage;             // Current UI-DSL v2 structure
  patch: Patch | Patch[];  // Single patch or array of patches
  registry?: ComponentRegistry; // Optional component registry
  createRevision?: boolean; // Optional: create revision after patch
}`}
                </CodeBlock>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Response:</h4>
                <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">
{`{
  dsl: UiPage;             // Patched UI-DSL structure
  diagnostics: Diagnostic[]; // Validation diagnostics
  inversePatch?: Patch;    // Inverse patch for undo
  revision?: {
    id: string;            // Revision ID (if createRevision=true)
    parentId?: string;     // Parent revision ID
  };
}`}
                </CodeBlock>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Applies atomic patch operations (setCopy, setProp, addNode, moveNode, etc.) for conversational editing. Optionally creates revisions for history tracking.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-4">
            <CardHeader>
              <CardTitle>POST /api/chat</CardTitle>
              <CardDescription>AI chat orchestrator for Studio (Intent detection, session management)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Request Body:</h4>
                <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">
{`{
  message: string;         // User message
  sessionId?: string;      // Session ID for state tracking
  context?: {
    dsl?: UiPage;          // Current DSL structure
    code?: string;         // Current generated code
    assetId?: string;      // Current asset ID
    revisionId?: string;   // Current revision ID
    messages?: Array<{
      role: "user" | "assistant";
      content: string;
    }>;
  };
}`}
                </CodeBlock>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Response:</h4>
                <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">
{`{
  message: string;         // AI response message
  intent?: {
    type: "generate" | "edit" | "question";
    confidence: number;
  };
  sessionId: string;       // Session ID (created or existing)
  action?: {
    type: "generate_dsl" | "apply_patches" | "no_action";
    patches?: Patch[];     // Patches to apply (if edit intent)
  };
}`}
                </CodeBlock>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Handles chat interactions, detects intent (generate vs edit), manages session state (Asset/Revision tracking), and coordinates patch operations.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-4">
            <CardHeader>
              <CardTitle>POST /api/chat/apply-patches</CardTitle>
              <CardDescription>Apply patches from chat and regenerate code</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Request Body:</h4>
                <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">
{`{
  sessionId: string;       // Session ID
  patches: Patch[];        // Patches to apply
  dsl?: UiPage;            // Optional DSL override
}`}
                </CodeBlock>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Response:</h4>
                <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">
{`{
  dsl: UiPage;             // Updated DSL after patches
  code: string;            // Regenerated TSX code
  diagnostics: Diagnostic[]; // Validation diagnostics
  session: {
    currentDSL: UiPage;
    currentCode: string;
    patchHistory: Patch[];
  };
}`}
                </CodeBlock>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Applies patches to DSL, regenerates code, and updates session state. Used internally by chat orchestrator.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Submissions Endpoints */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Submissions Endpoints</h2>
          
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>POST /api/submissions</CardTitle>
              <CardDescription>Create a new submission</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Request Body:</h4>
                <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">
{`{
  type: "component" | "block" | "screen";
  dsl: UiDsl;
  tsx: string;
  stories?: string;
  author: string;
}`}
                </CodeBlock>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-4">
            <CardHeader>
              <CardTitle>GET /api/submissions</CardTitle>
              <CardDescription>List all submissions</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Returns an array of submissions with their verification status and results.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-4">
            <CardHeader>
              <CardTitle>POST /api/submissions/[id]/verify</CardTitle>
              <CardDescription>Verify a submission (lint, a11y, tokens, figma)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Response:</h4>
                <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">
{`{
  score: number;           // Overall score (0-100)
  lint: {
    errors: number;
    warnings: number;
    issues: Array<LintIssue>;
  };
  a11y: {
    violations: number;
    issues: Array<A11yIssue>;
  };
  tokens: {
    violations: number;
    issues: Array<TokenIssue>;
  };
  figma: {
    coverage: number;      // Percentage (0-100)
    missing: Array<string>;
  };
}`}
                </CodeBlock>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-4">
            <CardHeader>
              <CardTitle>POST /api/submissions/[id]/promote</CardTitle>
              <CardDescription>Promote a verified submission to a GitHub PR</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">
                Creates a pull request with the component code, stories, and registry updates.
              </p>
              <div>
                <h4 className="font-semibold mb-2">Response:</h4>
                <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">
{`{
  prUrl: string;           // URL to the created PR
  prNumber: number;        // PR number
}`}
                </CodeBlock>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Variants Endpoints */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Variants Endpoints</h2>
          
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>POST /api/variants</CardTitle>
              <CardDescription>Upload a document and generate component variants</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Request (FormData):</h4>
                <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">
{`{
  file: File;              // PDF, MD, or TXT file
  componentName?: string;  // Optional component name
}`}
                </CodeBlock>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Response:</h4>
                <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">
{`{
  variants: Array<{
    id: string;
    name: string;
    code: string;
    description: string;
  }>;
}`}
                </CodeBlock>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Metrics Endpoints */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Metrics Endpoints</h2>
          
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>POST /api/metrics</CardTitle>
              <CardDescription>Record a telemetry metric</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Request Body:</h4>
                <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">
{`{
  type: "ttfui" | "acceptance_rate" | "a11y_violations" | ...;
  value: number;
  unit?: string;
  metadata?: Record<string, any>;
}`}
                </CodeBlock>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-4">
            <CardHeader>
              <CardTitle>GET /api/metrics</CardTitle>
              <CardDescription>Get metrics by type and date range</CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                <h4 className="font-semibold mb-2">Query Parameters:</h4>
                <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">
{`{
  type: string;            // Metric type
  startDate?: string;     // ISO date string
  endDate?: string;        // ISO date string
}`}
                </CodeBlock>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Registry Endpoints */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Registry Endpoints</h2>
          
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>GET /api/registry</CardTitle>
              <CardDescription>Get the component registry</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Returns the complete component registry with metadata, props, and variants.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Figma Endpoints */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Figma Endpoints</h2>
          
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>POST /api/figma/validate</CardTitle>
              <CardDescription>Validate Figma metadata against registry and design tokens</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Request Body:</h4>
                <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">
{`{
  component: {
    name: string;
    figmaPath: string;
    variants?: Array<{
      name: string;
      figmaPath: string;
      props?: Record<string, any>;
    }>;
  };
}`}
                </CodeBlock>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Response:</h4>
                <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">
{`{
  valid: boolean;
  errors?: Array<string>;
  warnings?: Array<string>;
  suggestions?: Array<string>;
}`}
                </CodeBlock>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Error Handling */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Error Handling</h2>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-4">
                All endpoints return standard HTTP status codes:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-sm">
                <li><code className="bg-muted px-1 rounded">200</code> - Success</li>
                <li><code className="bg-muted px-1 rounded">400</code> - Bad Request</li>
                <li><code className="bg-muted px-1 rounded">401</code> - Unauthorized</li>
                <li><code className="bg-muted px-1 rounded">404</code> - Not Found</li>
                <li><code className="bg-muted px-1 rounded">500</code> - Internal Server Error</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-4">
                Error responses include a <code className="bg-muted px-1 rounded">message</code> field with details.
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </DocLayout>
  );
}

