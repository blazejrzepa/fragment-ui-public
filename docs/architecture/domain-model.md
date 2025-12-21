# Fragment UI Studio - Domain Model

**Version:** 1.0  
**Status:** Specification  
**Last Updated:** 2025-01-XX

---

## 📋 Overview

This document defines the core domain model for Fragment UI Studio, establishing the single source of truth for all modules: Studio (Create), Library (Reuse), Drafts (Review), Releases (Ship), Experiments (Measure), and Governance (Scale).

---

## 🎯 Core Principle

**All modules operate on the same ID system:**
- Studio creates `assetId` + `revisionId`
- Submissions operates on `revisionId`
- Releases maps `releaseId` → `revisionId`
- Experiments maps `variantKey` → `revisionId`/`releaseId`
- Governance validates `revisionId` and returns `violations[]`

This ensures system coherence and prevents "feature soup".

---

## 📦 Core Entities

### Asset

**Definition:** A reusable artifact in the Fragment UI ecosystem.

```typescript
type AssetType = "component" | "block" | "screen" | "page" | "flow" | "tokenSet" | "theme";

interface Asset {
  id: string;                    // UUID v4 - stable identifier
  type: AssetType;
  name: string;
  description?: string;
  tags: string[];
  source: "dsl" | "tsx" | "figma" | "imported";
  createdAt: string;
  createdBy: string;
  updatedAt?: string;
  lifecycleState: LifecycleState;
  
  // Ownership & Governance
  owner?: string;                // User/team ID
  projectId?: string;
  orgId?: string;
  
  // Metadata
  metadata?: Record<string, any>;
}
```

**Key Properties:**
- `id`: Immutable, UUID v4
- `type`: Determines which module can operate on it
- `lifecycleState`: Current state in the lifecycle
- `source`: Origin of the asset (for traceability)

---

### Revision

**Definition:** Immutable snapshot of an Asset at a point in time.

```typescript
interface Revision {
  revisionId: string;            // UUID v4 - unique per snapshot
  assetId: string;               // References Asset.id
  createdAt: string;
  createdBy: string;
  
  // Content
  dslJson: UiDsl;                // UI-DSL v2 structure
  tsxCode: string;               // Generated TSX code
  metadata: RevisionMetadata;
  previewArtifacts?: {
    screenshot?: string;         // Base64 or URL
    bundleSize?: number;
    renderTime?: number;
  };
  
  // Context
  parentRevisionId?: string;     // For patch-based revisions
  patches?: Patch[];             // Patches applied to create this revision
  prompt?: string;               // Original prompt (if AI-generated)
  chatSessionId?: string;        // Link to chat context
}
```

**Key Properties:**
- `revisionId`: Immutable, unique identifier
- `assetId`: Links to parent Asset
- `dslJson`: Source of truth for UI structure
- `tsxCode`: Generated code (derived from DSL)
- `parentRevisionId`: Enables revision history/tree

**Lifecycle:**
- Created as `draft` in Studio
- Can be `submitted` for review
- Can be `approved` for release
- Can be `published` in Releases
- Can be `deprecated` when superseded

---

### LifecycleState

**Definition:** State machine for Asset/Revision lifecycle.

```typescript
type LifecycleState = 
  | "draft"           // Created in Studio, not yet submitted
  | "submitted"       // Submitted for review
  | "approved"        // Approved for release
  | "published"       // Published in Releases
  | "deprecated";     // Superseded by newer version

interface LifecycleTransition {
  from: LifecycleState;
  to: LifecycleState;
  timestamp: string;
  userId: string;
  reason?: string;
}
```

**State Transitions:**
```
draft → submitted    (via Submissions)
submitted → approved (via Review/Approval)
submitted → draft    (via Request Changes)
approved → published (via Release)
published → deprecated (via Governance)
```

---

### Patch

**Definition:** Atomic operation for conversational editing.

```typescript
type PatchOperation = 
  | "setCopy"        // Change text/label/placeholder
  | "setProp"        // Change component prop
  | "addNode"        // Add component
  | "removeNode"     // Remove component
  | "moveNode"       // Move component
  | "wrapWith"       // Wrap in container
  | "reorder"        // Change order
  | "rename"         // Rename field/section
  | "setToken"       // Change design token
  | "toggleVariant"  // Change variant
  | "setBinding"     // Bind datasource
  | "setDataSource"; // Set datasource

interface Patch {
  op: PatchOperation;
  target: NodeRef;              // data-ui-id reference
  [key: string]: any;           // Operation-specific fields
}

interface NodeRef {
  type: "byId" | "byPath" | "byTestId";
  id?: string;
  path?: string;
  testId?: string;
}
```

**Key Properties:**
- `op`: Operation type
- `target`: Reference to node in DSL (via `data-ui-id`)
- Operation-specific fields vary by operation type

**Usage:**
- Generated from chat intent in Studio
- Applied to DSL to create new Revision
- Stored in Revision for history/undo

---

### CheckResult / Violations

**Definition:** Results of quality checks and policy enforcement.

```typescript
type CheckType = 
  | "a11y"           // Accessibility violations
  | "lint"            // Design System linting
  | "policy"          // Governance policy violations
  | "bundle"          // Bundle size/import issues
  | "perfBudget";     // Performance budget violations

type ViolationLevel = "error" | "warning" | "info";

interface Violation {
  id: string;
  type: CheckType;
  level: ViolationLevel;
  message: string;
  target?: NodeRef;              // data-ui-id or path
  rule?: string;                 // Rule identifier
  suggestion?: string;           // Auto-fix suggestion
  metadata?: Record<string, any>;
}

interface CheckResult {
  revisionId: string;
  checks: Violation[];
  passed: boolean;               // true if no errors
  timestamp: string;
  checkDuration?: number;
}
```

**Key Properties:**
- `level`: Determines if blocking (error) or warning
- `target`: Links violation to specific node in DSL
- `suggestion`: Optional auto-fix proposal

---

### DependencyGraph

**Definition:** Dependency relationships between Assets.

```typescript
interface Dependency {
  from: string;                  // Asset ID
  to: string;                    // Asset ID
  type: "component" | "token" | "block" | "vendor";
  version?: string;              // Version constraint
}

interface DependencyGraph {
  assets: Map<string, Asset>;
  dependencies: Dependency[];
  
  // Computed
  getDependents(assetId: string): Asset[];
  getDependencies(assetId: string): Asset[];
  hasCircularDependency(assetId: string): boolean;
}
```

**Usage:**
- Impact analysis (what breaks if Asset changes)
- Import planning (what to bundle)
- Governance (forbidden dependencies)

---

### ExperimentVariantRef

**Definition:** Reference to a Revision or Release version for A/B testing.

```typescript
interface ExperimentVariantRef {
  variantKey: string;            // "control" | "test" | "test2"
  revisionId?: string;           // Direct revision reference
  releaseId?: string;            // Release version reference
  releaseVersion?: string;       // Semantic version (if release)
}

interface Experiment {
  experimentId: string;
  assetId: string;               // Asset being tested
  name: string;
  hypothesis?: string;
  
  variants: ExperimentVariantRef[];
  
  // PostHog Integration
  posthogFlagKey: string;
  posthogExperimentId?: string;
  
  // Metrics
  primaryMetric: {
    event: string;               // e.g., "cta_clicked"
    property?: string;
  };
  guardrails?: Array<{
    event: string;
    threshold?: number;
  }>;
  
  // Status
  status: "draft" | "running" | "stopped" | "completed";
  startedAt?: string;
  endedAt?: string;
  
  // Results
  winner?: string;               // variantKey
  confidence?: number;
}
```

**Key Properties:**
- `variants`: Must reference `revisionId` or `releaseId` (not arbitrary code)
- `posthogFlagKey`: PostHog feature flag identifier
- `winner`: Determined after experiment completion

---

## 🔄 Cross-Cutting Concerns

### RBAC (Role-Based Access Control)

```typescript
type Role = "admin" | "developer" | "designer" | "viewer";
type Scope = "org" | "team" | "project";

interface Permission {
  role: Role;
  scope: Scope;
  actions: string[];            // e.g., ["create", "approve", "publish"]
}
```

### Audit Log

```typescript
interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  action: string;               // e.g., "AssetCreated", "RevisionApproved"
  entityType: string;          // "Asset" | "Revision" | "Submission"
  entityId: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
}
```

### Search/Index

```typescript
interface SearchIndex {
  // Full-text search
  search(query: string, filters?: SearchFilters): SearchResult[];
  
  // Embeddings (optional)
  semanticSearch(query: string, limit?: number): SearchResult[];
}

interface SearchResult {
  entityType: "Asset" | "Revision" | "Component" | "Block";
  entityId: string;
  score: number;
  highlights?: string[];
}
```

### Event Bus (Domain Events)

```typescript
type DomainEvent = 
  | "AssetCreated"
  | "RevisionCreated"
  | "SubmissionOpened"
  | "ChecksCompleted"
  | "ReleasePublished"
  | "ExperimentStarted"
  | "ExperimentResultReady";

interface DomainEventPayload {
  event: DomainEvent;
  timestamp: string;
  entityId: string;
  metadata?: Record<string, any>;
}
```

---

## 📊 Entity Relationships

```
Asset (1) ──< (N) Revision
  │
  ├── (1) ──< (N) Submission
  │
  ├── (1) ──< (N) Release
  │
  └── (1) ──< (N) Experiment
        │
        └── (N) ExperimentVariantRef ──> (1) Revision/Release

Revision (1) ──< (N) Patch
Revision (1) ──< (N) CheckResult
Revision (1) ──< (1) DependencyGraph
```

---

## 🎯 Key Principles

1. **Immutability:** Revisions are immutable snapshots
2. **Traceability:** Every change is linked to a Revision
3. **Idempotency:** Operations on same Revision produce same result
4. **Separation of Concerns:** Each module operates on shared entities but has distinct responsibilities
5. **Event-Driven:** Domain events enable loose coupling between modules

---

## 📝 Notes

- All IDs are UUID v4 for global uniqueness
- Timestamps are ISO 8601 strings
- DSL is the source of truth; TSX is derived
- Patches enable conversational editing without full regeneration
- Governance policies operate on Revisions, not raw code

---

**Next Steps:**
- See [MODULES_BOUNDARIES.md](./MODULES_BOUNDARIES.md) for module responsibilities
- See [implementation-plan.md](../copilot/implementation-plan.md) for implementation tasks

