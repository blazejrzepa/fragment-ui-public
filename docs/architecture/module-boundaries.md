# Fragment UI Studio - Module Boundaries

**Version:** 1.0  
**Status:** Specification  
**Last Updated:** 2025-01-XX

---

## 📋 Overview

This document defines the boundaries and responsibilities of each module in Fragment UI Studio, ensuring clear separation of concerns and preventing "feature soup".

---

## 🎯 Core Principle

**Each module operates on shared Core Domain entities (Asset, Revision, Patch, etc.) but has distinct responsibilities and cannot directly access other modules' internals.**

---

## 📦 Module Structure

### 0. Core Domain (packages/studio-core)

**Purpose:** Shared domain model and interfaces.

**Responsibilities:**
- Define Asset, Revision, Patch, CheckResult, Experiment entities
- Define interfaces for repositories (AssetRepository, RevisionRepository, etc.)
- Define domain events
- Provide validation utilities

**Exports:**
```typescript
// packages/studio-core/src/index.ts
export * from './entities';
export * from './repositories';
export * from './events';
export * from './validation';
```

**Dependencies:**
- `@fragment_ui/ui-dsl` (for UiDsl types)
- No dependencies on other Studio modules

**Files:**
- `packages/studio-core/src/entities/asset.ts`
- `packages/studio-core/src/entities/revision.ts`
- `packages/studio-core/src/entities/patch.ts`
- `packages/studio-core/src/repositories/interfaces.ts`
- `packages/studio-core/src/events/domain-events.ts`

---

### 1. Studio (Create) - apps/demo/app/studio

**Purpose:** AI-powered creation and iterative editing of UI.

**Responsibilities:**
- Chat interface for prompts
- Intent detection and DSL generation
- Patch-based conversational editing
- Preview rendering
- Draft Revision persistence

**Key Services:**
- `ChatOrchestrator`: Manages chat context and mode (generate vs edit)
- `DslService`: Schema validation + normalization
- `PatchService`: Intent parser + patch application + conflict resolution
- `CodegenService`: DSL → TSX + import planning
- `PreviewService`: Worker/iframe rendering
- `ValidationService`: Quick lint/a11y checks

**Data:**
- `chat_sessions` (localStorage/DB)
- `draft_revisions` (localStorage/DB)
- `patch_history` (in Revision)

**API Endpoints:**
- `POST /api/dsl/generate` - Generate DSL from prompt
- `POST /api/dsl/patch` - Apply patches to DSL
- `POST /api/code/gen` - Generate TSX from DSL
- `GET /api/preview` - Render preview

**UI Routes:**
- `/studio` - Main Studio interface
- `/studio/chat` - Dedicated chat interface

**Boundaries:**
- ✅ Creates Asset + Revision (draft)
- ✅ Generates DSL and TSX
- ✅ Applies patches
- ❌ Does NOT know about Submissions workflow
- ❌ Does NOT know about Experiments
- ❌ Does NOT enforce governance policies (only warnings)

**Integration Points:**
- Uses `@fragment_ui/registry` for component info
- Uses `@fragment_ui/ui-dsl` for DSL types
- Emits `RevisionCreated` domain event

---

### 2. Library (Reuse) - apps/demo/app/library

**Purpose:** Component/Block/Token catalog and reuse.

**Responsibilities:**
- Browse components, blocks, tokens
- Search and filter
- View examples and stories
- Dependency-aware imports
- AI Read API (knowledge base for LLM)

**Key Services:**
- `RegistryService`: Components + props + aliases + constraints
- `DocService`: MDX/Storybook metadata
- `SearchService`: Full-text + embeddings (optional)
- `GraphService`: Dependency graph, impact analysis

**Data:**
- `component_defs` (from `@fragment_ui/registry`)
- `block_defs` (from `@fragment_ui/blocks`)
- `token_sets` (from `@fragment_ui/tokens`)
- `examples`, `stories_index`, `dep_graph`

**API Endpoints:**
- `GET /api/library/components` - List components
- `GET /api/library/blocks` - List blocks
- `GET /api/library/search` - Search components/blocks
- `GET /api/library/dependencies` - Get dependency graph

**UI Routes:**
- `/studio?tab=library` - Library browser

**Boundaries:**
- ✅ Provides component/block information
- ✅ Provides dependency information
- ✅ Provides examples and stories
- ❌ Does NOT create or edit Assets
- ❌ Does NOT manage Submissions
- ❌ Does NOT manage Experiments

**Integration Points:**
- Reads from `@fragment_ui/registry`
- Reads from `@fragment_ui/blocks`
- Provides data to Studio (via API)

---

### 3. Drafts (Review) - apps/demo/app/submissions

**Purpose:** Quality gate and review workflow.

**Responsibilities:**
- Create Submission from draft Revision
- Run quality checks (lint, a11y, bundle, policy)
- Review interface (comments, approvals)
- State machine: draft → submitted → approved/rejected

**Key Services:**
- `SubmissionService`: State machine, assignments
- `CIOrchestrator`: Runs checks locally/CI
- `PolicyEngine`: Governance rules enforcement
- `ReviewService`: Comments, approvals
- `AutoFixService`: Optional patch proposals

**Data:**
- `submissions` (DB/file)
- `submission_checks` (results)
- `review_comments` (inline comments)
- `approvals` (approval records)
- `policy_results` (violations)

**API Endpoints:**
- `POST /api/submissions` - Create submission
- `GET /api/submissions` - List submissions
- `GET /api/submissions/[id]` - Get submission details
- `POST /api/submissions/[id]/approve` - Approve submission
- `POST /api/submissions/[id]/request-changes` - Request changes
- `POST /api/submissions/[id]/run-checks` - Run quality checks

**UI Routes:**
- `/studio?tab=drafts` - Submissions list
- `/submissions/[id]` - Submission details

**Boundaries:**
- ✅ Operates on `revisionId`
- ✅ Runs quality checks
- ✅ Manages review workflow
- ❌ Does NOT publish to Releases
- ❌ Does NOT create Assets/Revisions
- ❌ Does NOT manage Experiments

**Integration Points:**
- Consumes `Revision` from Core Domain
- Uses `PolicyEngine` from Governance
- Emits `SubmissionOpened`, `ChecksCompleted` events

---

### 4. Releases (Ship) - apps/demo/app/releases

**Purpose:** Versioning and publishing.

**Responsibilities:**
- Create Release from approved Revision
- Semantic versioning (semver)
- Generate changelog
- Generate migration notes
- Publish to registry
- Tag in repository (GitHub integration)

**Key Services:**
- `ReleaseService`: Semver, tags, channels (rc/stable)
- `MigrationService`: Breaking changes detector + codemods plan
- `PublishingService`: Registry publish + docs refresh

**Data:**
- `releases` (DB/file)
- `release_assets` (mapped to Revision)
- `changelogs` (generated)
- `migration_guides` (generated)

**API Endpoints:**
- `POST /api/releases` - Create release
- `GET /api/releases` - List releases
- `GET /api/releases/[id]` - Get release details
- `POST /api/releases/[id]/publish` - Publish to registry

**UI Routes:**
- `/studio?tab=releases` - Releases list
- `/releases/[id]` - Release details

**Boundaries:**
- ✅ Operates on approved `revisionId`
- ✅ Manages versioning
- ✅ Publishes to registry
- ❌ Does NOT create or edit Assets/Revisions
- ❌ Does NOT manage Submissions
- ❌ Does NOT manage Experiments

**Integration Points:**
- Consumes approved `Revision` from Submissions
- Publishes to `@fragment_ui/registry`
- Emits `ReleasePublished` event

---

### 5. Experiments (Measure) - apps/demo/app/experiments

**Purpose:** A/B testing with PostHog.

**Responsibilities:**
- Create Experiment with variant mapping
- PostHog integration (feature flags, events)
- Exposure tracking
- Results aggregation
- Winner promotion to Submission/Release

**Key Services:**
- `ExperimentService`: Definitions, variant mapping
- `PosthogClient`: SDK + server-side API
- `ExposureService`: Exposure logging
- `MetricsService`: Event schema, naming
- `ResultService`: Results + recommendations

**Data:**
- `experiments` (DB/file)
- `experiment_variants` (mapping to revisionId/releaseId)
- `metric_specs` (event definitions)
- `exposures` (exposure logs)

**Note:** Event data and results stored in PostHog; local DB stores mapping and decision history.

**API Endpoints:**
- `POST /api/experiments` - Create experiment
- `GET /api/experiments` - List experiments
- `GET /api/experiments/[id]` - Get experiment details
- `POST /api/experiments/[id]/start` - Start experiment
- `POST /api/experiments/[id]/stop` - Stop experiment
- `GET /api/experiments/[id]/results` - Get results (from PostHog)
- `POST /api/experiments/[id]/promote-winner` - Promote winner to Submission

**UI Routes:**
- `/studio?tab=experiments` - Experiments list
- `/experiments/[id]` - Experiment details
- `/exp/[slug]` - Public experiment page (renders variant)

**Boundaries:**
- ✅ Maps variants to `revisionId`/`releaseId`
- ✅ Integrates with PostHog
- ✅ Tracks exposure and events
- ❌ Does NOT create Assets/Revisions
- ❌ Does NOT manage Submissions
- ❌ Does NOT publish Releases

**Integration Points:**
- Consumes `Revision`/`Release` from Core Domain
- Integrates with PostHog SDK
- Can promote winner to Submissions
- Emits `ExperimentStarted`, `ExperimentResultReady` events

---

### 6. Governance (Scale) - apps/demo/app/governance

**Purpose:** Policies, compliance, standards.

**Responsibilities:**
- Policy bundles (Core DS, Enterprise, Marketing)
- Enforcement points (Studio warnings, Submissions gates, Release gates)
- Ownership/RACI management
- Deprecation management
- Audit logging

**Key Services:**
- `PolicyRegistry`: Rule sets
- `RuleEngine`: Rule execution on DSL/TSX
- `AuditService`: Change tracking, approvals, exceptions
- `RiskService`: Risk assessment (P0: forbidden deps, CSS imports, a11y critical)

**Data:**
- `policies` (rule definitions)
- `rule_sets` (bundles)
- `exceptions` (approved violations)
- `owners` (ownership records)
- `audit_log` (all actions)

**API Endpoints:**
- `GET /api/governance/policies` - List policies
- `POST /api/governance/validate` - Validate Revision against policies
- `GET /api/governance/violations` - Get violations for Revision
- `POST /api/governance/exceptions` - Request exception
- `GET /api/governance/audit` - Get audit log

**UI Routes:**
- `/studio?tab=governance` - Governance dashboard

**Boundaries:**
- ✅ Validates `revisionId` and returns `violations[]`
- ✅ Enforces policies at enforcement points
- ✅ Manages ownership and exceptions
- ❌ Does NOT create or edit Assets/Revisions
- ❌ Does NOT manage Submissions
- ❌ Does NOT manage Experiments

**Integration Points:**
- Used by Studio (soft warnings)
- Used by Submissions (hard gates)
- Used by Releases (final gates)
- Emits audit events

---

## 🔄 Module Interactions

### Flow: Create → Review → Ship → Measure

```
Studio (Create)
  ↓ creates Asset + Revision (draft)
  ↓ emits RevisionCreated
  ↓
Submissions (Review)
  ↓ consumes Revision
  ↓ runs checks (uses Governance)
  ↓ approves → emits ChecksCompleted
  ↓
Releases (Ship)
  ↓ consumes approved Revision
  ↓ creates Release → emits ReleasePublished
  ↓
Experiments (Measure)
  ↓ consumes Release/Revision
  ↓ creates Experiment
  ↓ tracks results
  ↓ promotes winner → back to Submissions
```

### Integration via Domain Events

All modules communicate via domain events:

```typescript
// Studio emits
AssetCreated { assetId, type }
RevisionCreated { revisionId, assetId }

// Submissions emits
SubmissionOpened { submissionId, revisionId }
ChecksCompleted { submissionId, passed, violations }

// Releases emits
ReleasePublished { releaseId, revisionId, version }

// Experiments emits
ExperimentStarted { experimentId }
ExperimentResultReady { experimentId, winner }
```

---

## 📝 Key Rules

1. **No Direct Module Dependencies:** Modules communicate via Core Domain entities and events
2. **ID-Based Integration:** All modules operate on shared IDs (assetId, revisionId)
3. **Single Source of Truth:** DSL in Revision is source of truth; TSX is derived
4. **Immutable Revisions:** Revisions are snapshots; edits create new Revisions
5. **Event-Driven:** Use domain events for cross-module communication

---

## 🎯 Navigation Mapping

| Category | Module | Purpose | Route |
|----------|--------|---------|-------|
| Studio | Create | AI generation + editing | `/studio` |
| Library | Reuse | Component/Block catalog | `/studio?tab=library` |
| Drafts | Review | Submissions workflow | `/studio?tab=drafts` |
| Releases | Ship | Versioning + publishing | `/studio?tab=releases` |
| Experiments | Measure | A/B testing | `/studio?tab=experiments` |
| Governance | Scale | Policies + compliance | `/studio?tab=governance` |

---

**Next Steps:**
- See [STUDIO_DOMAIN_MODEL.md](./STUDIO_DOMAIN_MODEL.md) for entity definitions
- See [implementation-plan.md](../copilot/implementation-plan.md) for implementation tasks

