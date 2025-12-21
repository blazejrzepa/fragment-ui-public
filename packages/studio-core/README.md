# @fragment_ui/studio-core

Core domain model for Fragment UI Studio.

## Overview

This package provides the shared domain model and interfaces for all Studio modules:
- **Studio (Create)**: AI generation + conversational editing
- **Library (Reuse)**: Component/Block catalog
- **Drafts (Review)**: Submissions workflow
- **Releases (Ship)**: Versioning + publishing
- **Experiments (Measure)**: A/B testing
- **Governance (Scale)**: Policies + compliance

## Core Entities

- `Asset`: Reusable artifact (component, block, screen, page, flow, tokenSet, theme)
- `Revision`: Immutable snapshot of an Asset
- `Patch`: Atomic operation for conversational editing
- `CheckResult`: Quality check results
- `Experiment`: A/B test configuration
- `LifecycleState`: State machine (draft → submitted → approved → published → deprecated)

## Repository Interfaces

- `AssetRepository`: CRUD operations for Assets
- `RevisionRepository`: CRUD operations for Revisions
- `SubmissionRepository`: CRUD operations for Submissions
- `ExperimentRepository`: CRUD operations for Experiments
- `ReleaseRepository`: CRUD operations for Releases

## File-Based Storage

Default implementation uses JSON files stored in `apps/demo/data/studio-core/`.

**Note:** This is a temporary implementation. The repository interfaces allow for easy migration to a database later without changing the API.

## Domain Events

Event-driven architecture for cross-module communication:
- `AssetCreated`, `AssetUpdated`, `AssetDeleted`
- `RevisionCreated`, `RevisionUpdated`
- `SubmissionOpened`, `SubmissionApproved`, `SubmissionRejected`
- `ChecksCompleted`
- `ReleasePublished`
- `ExperimentStarted`, `ExperimentStopped`, `ExperimentResultReady`

## Usage

```typescript
import { 
  Asset, 
  createAsset, 
  FileAssetRepository,
  InMemoryEventEmitter 
} from "@fragment_ui/studio-core";

// Create an asset
const asset = createAsset({
  type: "screen",
  name: "Landing Page",
  createdBy: "user-123"
});

// Use repository
const assetRepo = new FileAssetRepository();
await assetRepo.create(asset);

// Use event emitter
const emitter = new InMemoryEventEmitter();
emitter.on("AssetCreated", (payload) => {
  console.log("Asset created:", payload.metadata.asset);
});
```

## See Also

- [Domain Model Documentation](../../docs/architecture/domain-model.md)
- [Module Boundaries](../../docs/architecture/module-boundaries.md)
- [Implementation Plan](../../docs/roadmap/FRAGMENT_UI_STUDIO_PLAN.md)

