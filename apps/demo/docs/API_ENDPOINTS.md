# API Endpoints Documentation

Complete reference for all API endpoints in the Playground application.

## Table of Contents

1. [Generation Endpoints](#generation-endpoints)
2. [Submissions Endpoints](#submissions-endpoints)
3. [Variants Endpoints](#variants-endpoints)
4. [Metrics Endpoints](#metrics-endpoints)
5. [Registry Endpoints](#registry-endpoints)
6. [Figma Endpoints](#figma-endpoints)
7. [Utility Endpoints](#utility-endpoints)

---

## Generation Endpoints

### `POST /api/generate`

Generate React component code from a natural language prompt.

**Request Body:**
```typescript
{
  prompt: string;           // Natural language description
  demoName?: string;        // Optional name for the demo
  existingCode?: string;    // Optional existing code to modify
}
```

**Response:**
```typescript
{
  code: string;             // Generated TSX code
  metadata?: {
    type: "form" | "page" | "table" | "dashboard";
    method: "rule-based" | "ui-dsl" | "ai";
    title?: string;
    fields?: Array<{ name: string; label: string; component: string }>;
    actions?: Array<{ type: string; label: string }>;
    dsl?: UiDsl;            // UI-DSL structure if available
  };
}
```

**Example:**
```bash
curl -X POST http://localhost:3002/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Create a registration form with email and password",
    "demoName": "registration-form"
  }'
```

**Status Codes:**
- `200 OK` - Success
- `400 Bad Request` - Invalid prompt or missing required fields
- `500 Internal Server Error` - Generation failed

---

### `POST /api/generate-dsl`

Generate UI-DSL structure from a prompt, with optional recipe matching.

**Request Body:**
```typescript
{
  prompt: string;           // Natural language description
  dsl?: UiDsl;              // Optional existing DSL to modify
}
```

**Response:**
```typescript
{
  code: string;             // Generated TSX code
  dsl: UiDsl;               // UI-DSL structure
  metadata: {
    method: "recipe-based" | "dsl-generator";
    confidence: number;      // 0.0 - 1.0
    type: string;
    recipe?: string;         // Recipe name if used
  };
}
```

**Example:**
```bash
curl -X POST http://localhost:3002/api/generate-dsl \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Create a dashboard with analytics and KPIs"
  }'
```

**Features:**
- Automatic recipe matching for common patterns (dashboard, marketing, form)
- Intent classification (dashboard, marketing, form, other)
- Slot filling for recipe-based generation

---

## Submissions Endpoints

### `GET /api/submissions`

Get list of all submissions.

**Query Parameters:**
- `status?: "pending" | "verified" | "rejected" | "draft"` - Filter by status
- `type?: "component" | "block" | "screen"` - Filter by type
- `limit?: number` - Maximum number of results (default: 50)
- `offset?: number` - Pagination offset (default: 0)

**Response:**
```typescript
{
  submissions: Array<{
    id: string;
    type: "component" | "block" | "screen";
    dsl: UiDsl;
    tsx: string;
    author: string;
    createdAt: string;
    status: "pending" | "verified" | "rejected" | "draft";
    result?: {
      score: number;
      lint: { errors: number; warnings: number; issues: Array<any> };
      a11y: { violations: number; issues: Array<any> };
      tokens: { violations: number; issues: Array<any> };
      figma: { coverage: number; missing: Array<any> };
      suggestions: string[];
    };
  }>;
  total: number;
}
```

---

### `GET /api/submissions/[id]`

Get a specific submission by ID.

**Response:**
```typescript
{
  id: string;
  type: "component" | "block" | "screen";
  dsl: UiDsl;
  tsx: string;
  stories?: string;         // Storybook story if available
  author: string;
  createdAt: string;
  status: "pending" | "verified" | "rejected" | "draft";
  result?: VerifyResult;
}
```

---

### `POST /api/submissions/[id]/verify`

Verify a submission (run lint, a11y, token guard, and figma parity checks).

**Response:**
```typescript
{
  id: string;
  result: {
    score: number;          // 0-100, weighted: 40% lint + 40% a11y + 20% tokens/parity
    lint: {
      errors: number;
      warnings: number;
      issues: Array<{
        line: number;
        message: string;
        rule: string;
      }>;
    };
    a11y: {
      violations: number;
      issues: Array<{
        id: string;
        impact: "critical" | "serious" | "moderate" | "minor";
        description: string;
      }>;
    };
    tokens: {
      violations: number;
      issues: Array<{
        line: number;
        code: string;
        suggestion: string;
      }>;
    };
    figma: {
      coverage: number;      // 0-100, percentage of figma variants covered
      missing: Array<{
        variant: string;
        prop: string;
      }>;
    };
    suggestions: string[];   // Actionable suggestions for improvement
  };
}
```

**Status Codes:**
- `200 OK` - Verification complete
- `404 Not Found` - Submission not found
- `500 Internal Server Error` - Verification failed

---

### `POST /api/submissions/[id]/promote`

Promote a verified submission to a GitHub PR.

**Request Body:**
```typescript
{
  // No body required, uses submission data
}
```

**Response:**
```typescript
{
  prUrl: string;            // GitHub PR URL
  prNumber: number;         // PR number
  branch: string;           // Branch name (feat/submission-{id})
}
```

**Status Codes:**
- `200 OK` - PR created successfully
- `400 Bad Request` - Submission not verified or missing required data
- `401 Unauthorized` - GitHub token missing or invalid
- `404 Not Found` - Submission not found
- `500 Internal Server Error` - PR creation failed

**Requirements:**
- Submission must have `status: "verified"`
- `GITHUB_TOKEN` environment variable must be set
- `GITHUB_REPO` environment variable must be set (format: `owner/repo`)

**What it does:**
1. Creates a new branch: `feat/submission-{id}`
2. Adds component/block file to appropriate directory
3. Adds Storybook story file
4. Updates `registry.json` with new component entry
5. Updates `CHANGELOG.md`
6. Creates PR with verification report and screenshot

---

## Variants Endpoints

### `POST /api/variants`

Generate multiple UI-DSL variants from an uploaded document.

**Request:**
- `Content-Type: multipart/form-data`
- `file: File` - PDF, MD, or TXT file
- `variantCount?: number` - Number of variants to generate (default: 3, max: 5)

**Response:**
```typescript
{
  variants: Array<{
    id: string;
    dsl: UiDsl;
    code: string;
    rationale: string;       // Explanation of design choices
    chunkReferences: Array<{
      chunkId: string;
      chunkTitle: string;
      relevance: string;
    }>;
    preview?: string;        // Base64 encoded screenshot
  }>;
  metadata: {
    sourceFile: string;
    variantCount: number;
    processingTime: number;  // milliseconds
  };
}
```

**Example:**
```bash
curl -X POST http://localhost:3002/api/variants \
  -F "file=@product-spec.md" \
  -F "variantCount=3"
```

**Status Codes:**
- `200 OK` - Variants generated successfully
- `400 Bad Request` - Invalid file or missing file
- `500 Internal Server Error` - Generation failed

**Features:**
- Extracts text from PDF, MD, or TXT files
- Chunks content by markdown headers
- Generates 3-5 distinct variants using AI
- Each variant includes rationale with chunk references

---

## Metrics Endpoints

### `GET /api/metrics`

Get telemetry metrics for the playground.

**Query Parameters:**
- `type?: "ttfui" | "acceptance_rate" | "a11y_violations"` - Filter by metric type
- `days?: number` - Number of days to include (default: 7, max: 90)
- `startDate?: string` - ISO date string for start date
- `endDate?: string` - ISO date string for end date

**Response:**
```typescript
{
  metrics: Array<{
    type: "ttfui" | "acceptance_rate" | "a11y_violations";
    value: number;
    timestamp: string;
    metadata?: Record<string, any>;
  }>;
  summary: {
    ttfui: {
      average: number;
      min: number;
      max: number;
      p95: number;
    };
    acceptanceRate: {
      current: number;
      trend: "up" | "down" | "stable";
    };
    a11yViolations: {
      total: number;
      critical: number;
      serious: number;
    };
  };
}
```

---

### `POST /api/metrics`

Record a new metric.

**Request Body:**
```typescript
{
  type: "ttfui" | "acceptance_rate" | "a11y_violations";
  value: number;
  metadata?: Record<string, any>;
}
```

**Response:**
```typescript
{
  success: boolean;
  id: string;              // Metric ID
}
```

---

## Registry Endpoints

### `GET /api/registry`

Get the component registry.

**Response:**
```typescript
{
  $schema: string;
  version: string;
  components: Array<{
    name: string;
    type: "component" | "block" | "screen";
    path: string;
    props?: Array<{
      name: string;
      type: string;
      required?: boolean;
      defaultValue?: any;
    }>;
    variants?: Array<{
      name: string;
      props: Record<string, any>;
    }>;
  }>;
}
```

**Status Codes:**
- `200 OK` - Registry loaded successfully
- `500 Internal Server Error` - Registry file not found (returns empty registry)

---

## Figma Endpoints

### `POST /api/figma/validate`

Validate Figma metadata against the registry and design tokens.

**Request Body:**
```typescript
{
  component: {
    name: string;
    figmaComponentId: string;
    variants: Array<{
      name: string;
      figmaPath: string;
      tokens: Record<string, string>;
    }>;
    props: Array<{
      name: string;
      figmaName: string;
      values: string[];
    }>;
    constraints?: {
      minWidth?: number;
      maxWidth?: number;
    };
  };
}
```

**Response:**
```typescript
{
  valid: boolean;
  coverage: number;         // 0-100, percentage coverage
  issues: Array<{
    type: "missing_variant" | "missing_prop" | "invalid_token" | "constraint_violation";
    message: string;
    severity: "error" | "warning";
  }>;
  mapping: {
    variants: Record<string, {
      figma: string;
      code: string;
      tokens: Record<string, string>;
    }>;
    props: Record<string, {
      figma: string;
      code: string;
      values: string[];
    }>;
  };
}
```

**Status Codes:**
- `200 OK` - Validation complete
- `400 Bad Request` - Invalid metadata structure
- `500 Internal Server Error` - Validation failed

**Requirements:**
- Coverage must be ≥ 90% for `valid: true`
- All variants must be mapped
- All tokens must exist in design system

---

## Utility Endpoints

### `POST /api/bundle`

Bundle and transform TSX code for preview.

**Request Body:**
```typescript
{
  code: string;             // TSX code to bundle
  options?: {
    minify?: boolean;
    sourcemap?: boolean;
  };
}
```

**Response:**
```typescript
{
  code: string;             // Bundled code
  map?: string;             // Source map if requested
  errors?: Array<{
    message: string;
    line: number;
    column: number;
  }>;
}
```

---

### `POST /api/bundle-css`

Extract and bundle CSS from code.

**Request Body:**
```typescript
{
  code: string;
}
```

**Response:**
```typescript
{
  css: string;              // Extracted CSS
  imports: string[];        // List of CSS imports found
}
```

---

### `GET /api/a11y-stats`

Get accessibility statistics.

**Response:**
```typescript
{
  total: number;
  byImpact: {
    critical: number;
    serious: number;
    moderate: number;
    minor: number;
  };
  byRule: Record<string, number>;
  trends: Array<{
    date: string;
    violations: number;
  }>;
}
```

---

## Error Responses

All endpoints may return error responses in the following format:

```typescript
{
  error: string;            // Error message
  message?: string;         // Detailed error message
  code?: string;            // Error code
  details?: any;            // Additional error details
}
```

**Common Status Codes:**
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Authentication required
- `404 Not Found` - Resource not found
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error

---

## Rate Limiting

Some endpoints may have rate limiting:
- `/api/generate` - 10 requests per minute per session
- `/api/variants` - 5 requests per minute per session
- `/api/submissions/[id]/promote` - 1 request per minute per submission

Rate limit headers:
- `X-RateLimit-Limit` - Maximum requests allowed
- `X-RateLimit-Remaining` - Remaining requests
- `X-RateLimit-Reset` - Unix timestamp when limit resets

---

## Authentication

Most endpoints are public. The following require authentication:
- `/api/submissions/[id]/promote` - Requires `GITHUB_TOKEN` environment variable

---

## Versioning

API versioning is handled via headers:
- `Accept: application/vnd.fragment-ui.v1+json` (future)

Currently, all endpoints use version 1.0.

---

## Examples

### Complete Workflow: Generate → Verify → Promote

```bash
# 1. Generate component
RESPONSE=$(curl -X POST http://localhost:3002/api/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Create a button component"}')

CODE=$(echo $RESPONSE | jq -r '.code')

# 2. Create submission (via UI or API)
# ... submission creation ...

# 3. Verify submission
curl -X POST http://localhost:3002/api/submissions/{id}/verify

# 4. Promote to PR (if verified)
curl -X POST http://localhost:3002/api/submissions/{id}/promote
```

---

## Support

For issues or questions:
- Check [HOW_IT_WORKS.md](./HOW_IT_WORKS.md) for workflow documentation
- See [QUICK_TEST_GUIDE.md](./QUICK_TEST_GUIDE.md) for testing examples
- Review [PLAYGROUND_AI_V1.1_API_DOCUMENTATION.md](./PLAYGROUND_AI_V1.1_API_DOCUMENTATION.md) for DSL API

