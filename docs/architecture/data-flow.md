# Data Flow

**Purpose:** Understand how data flows through the system  
**Audience:** Engineers working on data flows  
**When to read:** When implementing features that involve data flow

---

## Overview

This document describes how data flows through Fragment UI, from user input to component generation to deployment.

---

## Key Data Flows

### 1. Component Installation Flow

```mermaid
sequenceDiagram
    participant User
    participant CLI
    participant RegistryAPI
    participant Registry
    participant UserProject
    
    User->>CLI: npx shadcn add https://fragment-ui.dev/r/button.json
    CLI->>RegistryAPI: GET /r/button.json
    RegistryAPI->>Registry: Read button.json
    Registry-->>RegistryAPI: JSON data
    RegistryAPI-->>CLI: JSON response
    CLI->>CLI: Parse registry JSON
    CLI->>CLI: Download component files
    CLI->>CLI: Install dependencies
    CLI->>UserProject: Write component files
    CLI-->>User: Component installed
```

**Key Points:**
- Registry JSON is static (no database)
- CLI handles all file operations
- User owns the code after installation

---

### 2. Studio Generation Flow

```mermaid
sequenceDiagram
    participant User
    participant Chat
    participant DSLGen
    participant OpenAI
    participant Patch
    participant CodeGen
    participant Preview
    
    User->>Chat: "Create a login form"
    Chat->>DSLGen: Generate DSL from prompt
    DSLGen->>OpenAI: Call API with prompt
    OpenAI-->>DSLGen: Generated DSL
    DSLGen->>DSLGen: Validate against schema
    DSLGen-->>Chat: UI-DSL JSON
    Chat->>CodeGen: Convert DSL to TSX
    CodeGen->>CodeGen: Generate imports
    CodeGen->>CodeGen: Generate component code
    CodeGen-->>Preview: TSX code
    Preview->>Preview: Render in iframe
    Preview-->>User: Preview displayed
    
    User->>Chat: "Change button text to 'Sign in'"
    Chat->>Patch: Parse patch intent
    Patch->>Patch: Apply patch to DSL
    Patch->>CodeGen: Regenerate TSX
    CodeGen-->>Preview: Updated TSX
    Preview-->>User: Updated preview
```

**Key Points:**
- DSL is source of truth
- TSX is derived from DSL
- Patches modify DSL, not TSX directly
- Preview updates without full regeneration

---

### 3. Submission Workflow Flow

```mermaid
sequenceDiagram
    participant User
    participant Studio
    participant Submissions
    participant Quality
    participant Review
    participant Releases
    
    User->>Studio: Create draft revision
    Studio->>Studio: Generate DSL + TSX
    Studio-->>User: Draft ready
    
    User->>Submissions: Submit for review
    Submissions->>Quality: Run checks
    Quality->>Quality: Lint, A11y, Bundle, Policy
    Quality-->>Submissions: Check results
    Submissions->>Submissions: Update status
    
    alt Checks Pass
        Submissions->>Review: Ready for review
        Review->>Review: Approve
        Review->>Releases: Create release candidate
    else Checks Fail
        Submissions->>User: Request changes
        User->>Studio: Fix issues
    end
```

**Key Points:**
- Revisions are immutable
- Quality checks are automatic
- Review is manual
- Releases created from approved submissions

---

### 4. Experiment Flow (A/B Testing)

```mermaid
sequenceDiagram
    participant User
    participant Studio
    participant Experiment
    participant PostHog
    participant Runtime
    participant Analytics
    
    User->>Studio: Create experiment
    Studio->>Experiment: Map variants to revisions
    Experiment->>PostHog: Create feature flag
    PostHog-->>Experiment: Flag key
    
    Runtime->>PostHog: Get variant assignment
    PostHog-->>Runtime: Variant (control/test)
    Runtime->>Runtime: Load revision for variant
    Runtime->>Runtime: Render variant
    Runtime->>Analytics: Track view event
    
    User->>Runtime: Click CTA
    Runtime->>Analytics: Track conversion event
    Analytics->>PostHog: Send event with context
    PostHog->>PostHog: Aggregate results
    
    Experiment->>PostHog: Fetch results
    PostHog-->>Experiment: Winner identified
    Experiment->>Studio: Promote winner
```

**Key Points:**
- Variants map to revisions (not arbitrary code)
- PostHog handles variant assignment
- Events include experiment context
- Winner can be promoted to submission

---

## Data Storage

### Current State (File-Based)

- **Registry:** JSON files in `packages/registry/registry.json`
- **Submissions:** JSON files in `apps/demo/data/submissions.json`
- **Quality Data:** JSON files in `apps/demo/data/quality/`
- **Revisions:** In-memory (TODO: verify persistence)

### Future State (Database)

- **Assets:** Database table
- **Revisions:** Database table with immutable snapshots
- **Submissions:** Database table with state machine
- **Experiments:** Database table with PostHog integration

---

## Data Models

### Registry JSON

```json
{
  "name": "button",
  "type": "components:ui",
  "files": ["button.tsx"],
  "dependencies": ["@radix-ui/react-slot"],
  "registryDependencies": []
}
```

### UI-DSL v2

```json
{
  "type": "page",
  "id": "page_123",
  "sections": [
    {
      "type": "section",
      "kind": "hero",
      "id": "hero_123",
      "title": "Welcome"
    }
  ]
}
```

### Revision

```typescript
{
  revisionId: "rev_123",
  assetId: "asset_123",
  dslJson: { ... },
  tsxCode: "...",
  createdAt: "2025-01-XX",
  createdBy: "user_123"
}
```

---

## Gotchas

- **Immutability:** Revisions are immutable snapshots
- **DSL First:** DSL is source of truth, TSX is derived
- **File-Based:** Current storage is file-based, may need DB for scale
- **No Transactions:** File-based storage has no transactions

---

## Next Steps

- [Domain Model](./domain-model.md) - Core entities
- [Module Boundaries](./module-boundaries.md) - Module responsibilities
- [Operations Guide](../operations/README.md) - Production operations

---

**Last Updated:** 2025-01-XX

