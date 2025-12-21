# API Contracts

**Purpose:** API endpoint specifications  
**Audience:** Engineers implementing or using APIs  
**When to read:** When implementing API endpoints or clients

---

## Overview

Fragment UI exposes several API endpoints for component registry, Studio features, and quality checks.

---

## Registry APIs

### GET /r/{component}.json

**Purpose:** Get component registry entry

**Request:**
```
GET /r/button.json
```

**Response:**
```json
{
  "name": "button",
  "type": "components:ui",
  "files": [
    {
      "path": "button.tsx",
      "content": "..."
    }
  ],
  "dependencies": ["@radix-ui/react-slot"],
  "registryDependencies": []
}
```

---

## Studio APIs

### POST /api/dsl/generate

**Purpose:** Generate UI-DSL from prompt

**Request:**
```json
{
  "prompt": "Create a login form",
  "intent": "form",
  "constraints": {
    "components": ["Button", "Input"]
  }
}
```

**Response:**
```json
{
  "dsl": {
    "type": "page",
    "id": "page_123",
    ...
  },
  "diagnostics": []
}
```

---

### POST /api/dsl/patch

**Purpose:** Apply patches to DSL

**Request:**
```json
{
  "dsl": { ... },
  "patches": [
    {
      "op": "setCopy",
      "target": { "type": "byId", "id": "btn_123" },
      "path": "label",
      "value": "Sign In"
    }
  ]
}
```

**Response:**
```json
{
  "dsl": { ... },  // Patched DSL
  "inversePatches": [ ... ]  // For undo
}
```

---

### POST /api/code/gen

**Purpose:** Generate TSX from DSL

**Request:**
```json
{
  "dsl": { ... },
  "options": {
    "generateStory": true
  }
}
```

**Response:**
```json
{
  "code": "export function Component() { ... }",
  "story": "export const Default: Story = { ... }"
}
```

---

## Quality APIs

### POST /api/quality/run

**Purpose:** Run quality checks on code

**Request:**
```json
{
  "code": "...",
  "checks": ["a11y", "lint", "bundle"]
}
```

**Response:**
```json
{
  "results": {
    "a11y": {
      "passed": true,
      "violations": []
    },
    "lint": {
      "passed": true,
      "errors": []
    },
    "bundle": {
      "size": 12345,
      "gzipSize": 4567
    }
  }
}
```

---

## Submissions APIs

### POST /api/submissions

**Purpose:** Create submission

**Request:**
```json
{
  "revisionId": "rev_123",
  "type": "component",
  "runChecks": true
}
```

**Response:**
```json
{
  "id": "sub_123",
  "status": "checks_running",
  "checks": { ... }
}
```

---

### POST /api/submissions/{id}/approve

**Purpose:** Approve submission

**Request:**
```json
{
  "comment": "Looks good!"
}
```

**Response:**
```json
{
  "id": "sub_123",
  "status": "approved",
  "approvedBy": "user_123"
}
```

---

## Error Responses

All APIs return errors in this format:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid DSL structure",
    "details": { ... }
  }
}
```

---

## Authentication

**Current State:** No authentication (TODO: verify for production)

**Future:** May require API keys or OAuth for production Studio APIs.

---

## Rate Limiting

**Current State:** No rate limiting (TODO: verify)

**Future:** May implement rate limiting for OpenAI API calls.

---

## Gotchas

- **Content-Type:** All requests must be `application/json`
- **Error Handling:** Always check for error responses
- **Validation:** APIs validate input, return errors if invalid

---

## Next Steps

- [Studio Documentation](../studio/README.md) - Studio features
- [Development Guide](../development/README.md) - Development workflows

---

**Last Updated:** 2025-01-XX

