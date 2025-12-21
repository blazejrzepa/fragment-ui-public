# Concrete Next Steps - Phase 0 Implementation

**Last Updated:** 2025-01-XX  
**Status:** Ready to start  
**Estimated Time:** 28-40h (1 week)

---

## 🎯 Goal

Implement Phase 0: Core Domain Foundation - the shared domain model for all Studio modules.

---

## 📋 Step-by-Step Implementation Plan

### Step 1: Create Package Structure (15 min)

**Commands:**
```bash
cd /Users/blazejrzepa/Dev/fragment-ui

# Create package directory structure
mkdir -p packages/studio-core/src/{entities,repositories/{file,interfaces},events,utils}

# Navigate to new package
cd packages/studio-core
```

**Create `packages/studio-core/package.json`:**
```json
{
  "name": "@fragment_ui/studio-core",
  "version": "0.1.0",
  "description": "Core domain model for Fragment UI Studio",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "scripts": {
    "build": "tsc",
    "dev": "tsc -w",
    "test": "vitest"
  },
  "dependencies": {
    "@fragment_ui/ui-dsl": "workspace:*"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.5.0",
    "vitest": "^1.0.0"
  },
  "keywords": ["studio", "domain-model", "fragment-ui"],
  "license": "MIT"
}
```

**Create `packages/studio-core/tsconfig.json`:**
```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "noEmit": false
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**Create `packages/studio-core/src/index.ts`:**
```typescript
// Will be populated in later steps
export {};
```

**Install dependencies:**
```bash
cd /Users/blazejrzepa/Dev/fragment-ui
pnpm install
```

---

### Step 2: Define Core Entities (2-3 hours)

**Order:** Start with simplest, build up complexity

#### 2.1 Lifecycle State (30 min)

**File:** `packages/studio-core/src/entities/lifecycle-state.ts`

```typescript
/**
 * Lifecycle state machine for Assets and Revisions
 */

export type LifecycleState = 
  | "draft"           // Created in Studio, not yet submitted
  | "submitted"       // Submitted for review
  | "approved"        // Approved for release
  | "published"       // Published in Releases
  | "deprecated";     // Superseded by newer version

export interface LifecycleTransition {
  from: LifecycleState;
  to: LifecycleState;
  timestamp: string;  // ISO 8601
  userId: string;
  reason?: string;
}

export const LIFECYCLE_STATES: LifecycleState[] = [
  "draft",
  "submitted",
  "approved",
  "published",
  "deprecated"
];

export function isValidTransition(
  from: LifecycleState,
  to: LifecycleState
): boolean {
  const validTransitions: Record<LifecycleState, LifecycleState[]> = {
    draft: ["submitted"],
    submitted: ["approved", "draft"],
    approved: ["published"],
    published: ["deprecated"],
    deprecated: []
  };
  
  return validTransitions[from]?.includes(to) ?? false;
}
```

#### 2.2 Asset Entity (45 min)

**File:** `packages/studio-core/src/entities/asset.ts`

```typescript
/**
 * Asset entity - reusable artifact in Fragment UI ecosystem
 */

import type { LifecycleState } from "./lifecycle-state";

export type AssetType = 
  | "component" 
  | "block" 
  | "screen" 
  | "page" 
  | "flow" 
  | "tokenSet" 
  | "theme";

export interface Asset {
  id: string;                    // UUID v4 - stable identifier
  type: AssetType;
  name: string;
  description?: string;
  tags: string[];
  source: "dsl" | "tsx" | "figma" | "imported";
  createdAt: string;             // ISO 8601
  createdBy: string;             // User ID
  updatedAt?: string;            // ISO 8601
  lifecycleState: LifecycleState;
  
  // Ownership & Governance
  owner?: string;                // User/team ID
  projectId?: string;
  orgId?: string;
  
  // Metadata
  metadata?: Record<string, any>;
}

export function createAsset(params: {
  type: AssetType;
  name: string;
  description?: string;
  tags?: string[];
  source?: Asset["source"];
  createdBy: string;
  owner?: string;
  projectId?: string;
  orgId?: string;
}): Asset {
  return {
    id: crypto.randomUUID(),
    type: params.type,
    name: params.name,
    description: params.description,
    tags: params.tags ?? [],
    source: params.source ?? "dsl",
    createdAt: new Date().toISOString(),
    createdBy: params.createdBy,
    lifecycleState: "draft",
    owner: params.owner,
    projectId: params.projectId,
    orgId: params.orgId,
    metadata: {}
  };
}
```

#### 2.3 Revision Entity (45 min)

**File:** `packages/studio-core/src/entities/revision.ts`

```typescript
/**
 * Revision entity - immutable snapshot of an Asset
 */

import type { UiDsl, Patch as UiDslPatch } from "@fragment_ui/ui-dsl";

export interface RevisionMetadata {
  version?: string;
  notes?: string;
  [key: string]: any;
}

export interface Revision {
  revisionId: string;            // UUID v4 - unique per snapshot
  assetId: string;               // References Asset.id
  createdAt: string;             // ISO 8601
  createdBy: string;             // User ID
  
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
  patches?: UiDslPatch[];        // Patches applied to create this revision
  prompt?: string;               // Original prompt (if AI-generated)
  chatSessionId?: string;        // Link to chat context
}

export function createRevision(params: {
  assetId: string;
  dslJson: UiDsl;
  tsxCode: string;
  createdBy: string;
  parentRevisionId?: string;
  patches?: UiDslPatch[];
  prompt?: string;
  chatSessionId?: string;
  metadata?: RevisionMetadata;
}): Revision {
  return {
    revisionId: crypto.randomUUID(),
    assetId: params.assetId,
    createdAt: new Date().toISOString(),
    createdBy: params.createdBy,
    dslJson: params.dslJson,
    tsxCode: params.tsxCode,
    metadata: params.metadata ?? {},
    parentRevisionId: params.parentRevisionId,
    patches: params.patches,
    prompt: params.prompt,
    chatSessionId: params.chatSessionId
  };
}
```

#### 2.4 Patch Entity (15 min)

**File:** `packages/studio-core/src/entities/patch.ts`

```typescript
/**
 * Patch entity - re-exported from @fragment_ui/ui-dsl
 * Patch operations are already defined in ui-dsl package
 */

export type { Patch, PatchOp } from "@fragment_ui/ui-dsl";
```

#### 2.5 CheckResult Entity (30 min)

**File:** `packages/studio-core/src/entities/check-result.ts`

```typescript
/**
 * CheckResult entity - quality check results
 */

export type CheckType = 
  | "a11y" 
  | "lint" 
  | "tokens" 
  | "forbiddenHtml" 
  | "bundle" 
  | "perfBudget";

export type CheckStatus = "pass" | "fail" | "warning" | "error";

export interface CheckViolation {
  rule: string;
  severity: "error" | "warning" | "info";
  message: string;
  location?: {
    file?: string;
    line?: number;
    column?: number;
  };
  fix?: string;                  // Suggested fix
}

export interface CheckResult {
  checkId: string;               // UUID v4
  revisionId: string;           // References Revision.revisionId
  checkType: CheckType;
  status: CheckStatus;
  message?: string;
  violations?: CheckViolation[];
  metadata?: Record<string, any>;
  createdAt: string;             // ISO 8601
  checkDuration?: number;         // milliseconds
}
```

#### 2.6 Experiment Entity (30 min)

**File:** `packages/studio-core/src/entities/experiment.ts`

```typescript
/**
 * Experiment entity - A/B test configuration
 */

export interface Experiment {
  id: string;                    // UUID v4
  projectId: string;
  slug: string;                   // URL-friendly identifier
  name: string;
  posthogFlagKey: string;        // PostHog feature flag key
  variantMap: Record<string, string>;  // variantKey -> revisionId
  trafficAllocation: Record<string, number>;  // variantKey -> percentage (0-100)
  primaryMetric: {
    event: string;                // e.g., "cta_clicked"
  };
  guardrails?: Array<{
    event: string;
    threshold?: number;
  }>;
  status: "draft" | "running" | "stopped" | "completed";
  startedAt?: string;             // ISO 8601
  endedAt?: string;               // ISO 8601
  createdAt: string;             // ISO 8601
  createdBy: string;             // User ID
  updatedAt?: string;             // ISO 8601
}
```

#### 2.7 Export Entities

**File:** `packages/studio-core/src/entities/index.ts`

```typescript
export * from "./asset";
export * from "./revision";
export * from "./patch";
export * from "./check-result";
export * from "./experiment";
export * from "./lifecycle-state";
```

---

### Step 3: Define Repository Interfaces (1-2 hours)

**File:** `packages/studio-core/src/repositories/interfaces.ts`

```typescript
/**
 * Repository interfaces for domain entities
 */

import type { Asset } from "../entities/asset";
import type { Revision } from "../entities/revision";
import type { CheckResult } from "../entities/check-result";
import type { Experiment } from "../entities/experiment";

// Asset Repository
export interface AssetRepository {
  create(asset: Asset): Promise<Asset>;
  findById(id: string): Promise<Asset | null>;
  findByType(type: Asset["type"]): Promise<Asset[]>;
  findByProject(projectId: string): Promise<Asset[]>;
  update(id: string, updates: Partial<Asset>): Promise<Asset>;
  delete(id: string): Promise<void>;
}

// Revision Repository
export interface RevisionRepository {
  create(revision: Revision): Promise<Revision>;
  findById(revisionId: string): Promise<Revision | null>;
  findByAssetId(assetId: string): Promise<Revision[]>;
  findLatestByAssetId(assetId: string): Promise<Revision | null>;
  findByParent(parentRevisionId: string): Promise<Revision[]>;
  update(revisionId: string, updates: Partial<Revision>): Promise<Revision>;
  delete(revisionId: string): Promise<void>;
}

// Submission Repository (for Phase 3)
export interface Submission {
  id: string;
  revisionId: string;
  status: "draft" | "submitted" | "approved" | "rejected";
  submittedAt?: string;
  approvedAt?: string;
  approvedBy?: string;
  rejectedAt?: string;
  rejectedBy?: string;
  rejectionReason?: string;
  createdAt: string;
  createdBy: string;
}

export interface SubmissionRepository {
  create(submission: Submission): Promise<Submission>;
  findById(id: string): Promise<Submission | null>;
  findByRevisionId(revisionId: string): Promise<Submission | null>;
  findByStatus(status: Submission["status"]): Promise<Submission[]>;
  update(id: string, updates: Partial<Submission>): Promise<Submission>;
}

// Experiment Repository
export interface ExperimentRepository {
  create(experiment: Experiment): Promise<Experiment>;
  findById(id: string): Promise<Experiment | null>;
  findBySlug(slug: string): Promise<Experiment | null>;
  findByProject(projectId: string): Promise<Experiment[]>;
  findByStatus(status: Experiment["status"]): Promise<Experiment[]>;
  update(id: string, updates: Partial<Experiment>): Promise<Experiment>;
  delete(id: string): Promise<void>;
}

// Release Repository (for Phase 4)
export interface Release {
  id: string;
  revisionId: string;
  version: string;                // Semantic version (e.g., "1.2.3")
  changelog?: string;
  migrationNotes?: string;
  publishedAt?: string;
  publishedBy?: string;
  createdAt: string;
  createdBy: string;
}

export interface ReleaseRepository {
  create(release: Release): Promise<Release>;
  findById(id: string): Promise<Release | null>;
  findByVersion(version: string): Promise<Release | null>;
  findByRevisionId(revisionId: string): Promise<Release | null>;
  findLatest(): Promise<Release | null>;
  update(id: string, updates: Partial<Release>): Promise<Release>;
}
```

---

### Step 4: Define Domain Events (1-2 hours)

**File 1:** `packages/studio-core/src/events/domain-events.ts`

```typescript
/**
 * Domain events for cross-module communication
 */

import type { Asset } from "../entities/asset";
import type { Revision } from "../entities/revision";
import type { CheckResult } from "../entities/check-result";
import type { Experiment } from "../entities/experiment";

export type DomainEvent =
  | "AssetCreated"
  | "AssetUpdated"
  | "AssetDeleted"
  | "RevisionCreated"
  | "RevisionUpdated"
  | "SubmissionOpened"
  | "SubmissionApproved"
  | "SubmissionRejected"
  | "ChecksCompleted"
  | "ReleasePublished"
  | "ExperimentStarted"
  | "ExperimentStopped"
  | "ExperimentResultReady";

export interface DomainEventPayload {
  event: DomainEvent;
  timestamp: string;              // ISO 8601
  entityId: string;
  metadata?: Record<string, any>;
}

// Specific event payloads
export interface AssetCreatedPayload extends DomainEventPayload {
  event: "AssetCreated";
  entityId: string;              // Asset.id
  metadata: {
    asset: Asset;
  };
}

export interface RevisionCreatedPayload extends DomainEventPayload {
  event: "RevisionCreated";
  entityId: string;              // Revision.revisionId
  metadata: {
    revision: Revision;
    assetId: string;
  };
}

export interface ChecksCompletedPayload extends DomainEventPayload {
  event: "ChecksCompleted";
  entityId: string;              // Revision.revisionId
  metadata: {
    revisionId: string;
    results: CheckResult[];
    passed: boolean;
  };
}

export interface ExperimentStartedPayload extends DomainEventPayload {
  event: "ExperimentStarted";
  entityId: string;              // Experiment.id
  metadata: {
    experiment: Experiment;
  };
}

// Union type for all event payloads
export type AnyDomainEventPayload =
  | AssetCreatedPayload
  | RevisionCreatedPayload
  | ChecksCompletedPayload
  | ExperimentStartedPayload
  | DomainEventPayload;
```

**File 2:** `packages/studio-core/src/events/event-emitter.ts`

```typescript
/**
 * Event emitter interface for domain events
 */

import type { AnyDomainEventPayload } from "./domain-events";

export type EventHandler = (payload: AnyDomainEventPayload) => void | Promise<void>;

export interface EventEmitter {
  on(event: string, handler: EventHandler): void;
  off(event: string, handler: EventHandler): void;
  emit(payload: AnyDomainEventPayload): void | Promise<void>;
}

// Simple in-memory implementation (can be replaced with event bus later)
export class InMemoryEventEmitter implements EventEmitter {
  private handlers: Map<string, Set<EventHandler>> = new Map();

  on(event: string, handler: EventHandler): void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    this.handlers.get(event)!.add(handler);
  }

  off(event: string, handler: EventHandler): void {
    this.handlers.get(event)?.delete(handler);
  }

  async emit(payload: AnyDomainEventPayload): Promise<void> {
    const handlers = this.handlers.get(payload.event) || new Set();
    await Promise.all(Array.from(handlers).map(handler => handler(payload)));
  }
}
```

---

### Step 5: Implement File-Based Storage (3-4 hours)

**Storage Location:** `apps/demo/data/studio-core/`

**File 1:** `packages/studio-core/src/repositories/file/asset-repository.ts`

```typescript
/**
 * File-based implementation of AssetRepository
 */

import { promises as fs } from "fs";
import { join } from "path";
import type { Asset } from "../../entities/asset";
import type { AssetRepository } from "../interfaces";

const STORAGE_DIR = join(process.cwd(), "apps", "demo", "data", "studio-core");
const ASSETS_FILE = join(STORAGE_DIR, "assets.json");

export class FileAssetRepository implements AssetRepository {
  private async ensureStorage(): Promise<void> {
    await fs.mkdir(STORAGE_DIR, { recursive: true });
    try {
      await fs.access(ASSETS_FILE);
    } catch {
      await fs.writeFile(ASSETS_FILE, JSON.stringify([], null, 2));
    }
  }

  private async readAssets(): Promise<Asset[]> {
    await this.ensureStorage();
    const content = await fs.readFile(ASSETS_FILE, "utf-8");
    return JSON.parse(content);
  }

  private async writeAssets(assets: Asset[]): Promise<void> {
    await this.ensureStorage();
    await fs.writeFile(ASSETS_FILE, JSON.stringify(assets, null, 2));
  }

  async create(asset: Asset): Promise<Asset> {
    const assets = await this.readAssets();
    assets.push(asset);
    await this.writeAssets(assets);
    return asset;
  }

  async findById(id: string): Promise<Asset | null> {
    const assets = await this.readAssets();
    return assets.find(a => a.id === id) ?? null;
  }

  async findByType(type: Asset["type"]): Promise<Asset[]> {
    const assets = await this.readAssets();
    return assets.filter(a => a.type === type);
  }

  async findByProject(projectId: string): Promise<Asset[]> {
    const assets = await this.readAssets();
    return assets.filter(a => a.projectId === projectId);
  }

  async update(id: string, updates: Partial<Asset>): Promise<Asset> {
    const assets = await this.readAssets();
    const index = assets.findIndex(a => a.id === id);
    if (index === -1) {
      throw new Error(`Asset ${id} not found`);
    }
    assets[index] = { 
      ...assets[index], 
      ...updates, 
      updatedAt: new Date().toISOString() 
    };
    await this.writeAssets(assets);
    return assets[index];
  }

  async delete(id: string): Promise<void> {
    const assets = await this.readAssets();
    const filtered = assets.filter(a => a.id !== id);
    await this.writeAssets(filtered);
  }
}
```

**File 2:** `packages/studio-core/src/repositories/file/revision-repository.ts`

Similar structure - implement all methods from `RevisionRepository` interface.

**File 3:** `packages/studio-core/src/repositories/file/submission-repository.ts`

Similar structure - implement all methods from `SubmissionRepository` interface.

**File 4:** `packages/studio-core/src/repositories/file/experiment-repository.ts`

Similar structure - implement all methods from `ExperimentRepository` interface.

---

### Step 6: Update Main Index (15 min)

**File:** `packages/studio-core/src/index.ts`

```typescript
// Entities
export * from "./entities";

// Repository Interfaces
export * from "./repositories/interfaces";

// Repository Implementations
export * from "./repositories/file/asset-repository";
export * from "./repositories/file/revision-repository";
export * from "./repositories/file/submission-repository";
export * from "./repositories/file/experiment-repository";

// Domain Events
export * from "./events/domain-events";
export * from "./events/event-emitter";
```

---

### Step 7: Build and Verify (30 min)

**Build:**
```bash
cd packages/studio-core
pnpm build
```

**Verify:**
```bash
# Check dist folder
ls -la dist/

# Check types exported
head -20 dist/index.d.ts
```

**Test import:**
```bash
# In apps/demo or test file
import { Asset, Revision, createAsset } from "@fragment_ui/studio-core";
```

---

## ✅ Acceptance Criteria

- [ ] All entities defined with TypeScript interfaces
- [ ] Entities match domain model specification
- [ ] Repository interfaces defined
- [ ] File-based implementations work
- [ ] Domain events defined
- [ ] Event emitter implemented
- [ ] Types exported from `packages/studio-core/src/index.ts`
- [ ] Package builds successfully
- [ ] Can import and use in other packages

---

## 🚀 Quick Start Commands

```bash
# 1. Create structure
cd /Users/blazejrzepa/Dev/fragment-ui
mkdir -p packages/studio-core/src/{entities,repositories/{file,interfaces},events,utils}

# 2. Create package.json and tsconfig.json (copy from plan above)

# 3. Install dependencies
pnpm install

# 4. Start implementing (begin with lifecycle-state.ts)
cd packages/studio-core/src/entities
# Create lifecycle-state.ts, asset.ts, revision.ts, etc.

# 5. Build
cd packages/studio-core
pnpm build
```

---

## 📚 Reference Documentation

- [Domain Model](./architecture/domain-model.md) - Complete entity definitions
- [FRAGMENT_UI_STUDIO_PLAN.md](./roadmap/FRAGMENT_UI_STUDIO_PLAN.md#phase-0-core-domain-foundation-1-week) - Full plan with acceptance criteria
- [UI-DSL Types](../packages/ui-dsl/src/types-v2.ts) - Patch type already defined there

---

## 🎯 Next After Phase 0

Once Phase 0 is complete:
- Phase 2: Complex Screens + Patch Workflow
- Phase 3: Submissions + Governance
- Phase 4: Releases + Experiments

---

**Ready to start? Begin with Step 1!**
