# 📝 Fragment UI - Changelog 2025

**Last Updated:** 2025-01-XX

**Note:** This changelog contains 2025-specific updates for the `fragment-ui` monorepo. For the complete changelog, see [CHANGELOG.md](./CHANGELOG.md). For a combined changelog covering all projects, see [CHANGELOG_COMBINED.md](./CHANGELOG_COMBINED.md).

---

## 🎉 Latest Updates

### ✅ Phase 2: Complex Screens & Patch Workflow - COMPLETED (100%)

**Completed:** 2025-01-XX

All tasks for Phase 2 have been completed and integrated:

#### EPIC B: Complex Screens Generation

**B1: Extend UI-DSL for Complex Screens (100%)**
- ✅ Added 5 new layout types: `UiStack`, `UiTwoColumn`, `UiThreeColumn`, `UiSidebar`, and enhanced `UiGrid`
- ✅ All layout types support responsive breakpoints
- ✅ Zod schemas for all layout types
- ✅ Code generation for all layout types in `dsl-codegen.ts`

**Files Added/Modified:**
- `packages/ui-dsl/src/types-v2.ts` - Added layout type definitions
- `packages/ui-dsl/src/schema.ts` - Added Zod schemas for layouts
- `apps/demo/src/lib/dsl-codegen.ts` - Added JSX generation functions

**B2: Screen Scaffolds (100%)**
- ✅ All scaffolds already exist and work correctly
- ✅ Dashboard, landing, settings, auth scaffolds with registry

**B3: Enhanced DSL Generator (90%)**
- ✅ Created `createSectionNode()` helper function for automatic blocks preference
- ✅ Sections → Blocks mapping with fallback to UI composition
- ✅ Section data → block inputs conversion
- ✅ New file: `apps/demo/src/lib/dsl-generator-helpers.ts`

**Files Added:**
- `apps/demo/src/lib/dsl-generator-helpers.ts` - Block mapping helper

#### EPIC C: Patch Workflow (Conversational Editing)

**C1: Chat Mode Detection (100%)**
- ✅ Chat Orchestrator created for session coordination
- ✅ Asset/Revision tracking in chat sessions
- ✅ Patch history maintenance

**Files Added:**
- `apps/demo/src/lib/chat/chat-orchestrator.ts` - Chat Orchestrator class

**C3: Patch Application + Regeneration (100%)**
- ✅ Optional revision creation in patch API
- ✅ Integration with studio-core `FileRevisionRepository`
- ✅ Automatic TSX generation and revision linking

**Files Modified:**
- `apps/demo/app/api/dsl/patch/route.ts` - Added optional revision creation

---

### ✅ Phase 1: Foundation - COMPLETED (100%)

**Completed:** 2025-01-XX (after audit and fixes)

All 8 tasks completed:
1. ✅ UI-DSL v2 Types & Validation
2. ✅ DSL Generation API (schema validation fixed)
3. ✅ DSL Patch Operations
4. ✅ Code Generation
5. ✅ Quality Run API
6. ✅ Registry Enhancement
7. ✅ Inspector → Patch Integration
8. ✅ Lint DS in CI

**Fixes Applied:**
- ✅ Fixed circular reference in Zod schemas (z.discriminatedUnion → z.union)
- ✅ Re-enabled schema validation in DSL generate API
- ✅ Verified Lint DS in CI integration

---

## 📊 Current Project Status

### Completed Phases

| Phase | Status | Progress | Tasks |
|-------|--------|----------|-------|
| **Phase 1: Foundation** | ✅ Complete | 100% | 8/8 tasks |
| **Phase 2: Complex Screens & Patch Workflow** | ✅ Complete | 100% | 7/7 tasks |

### Next Priority

| Phase | Priority | Estimation | Status |
|-------|----------|------------|--------|
| **Phase 3: Submissions + Governance** | P0 | 60-86h (2 weeks) | 📋 Planned |

---

## 🔧 Technical Changes

### New Layout Types Added

```typescript
// Stack Layout
interface UiStack extends UiCommon {
  type: "stack";
  direction?: "vertical" | "horizontal";
  gap?: number;
  children: UiNode[];
}

// Two-Column Layout
interface UiTwoColumn extends UiCommon {
  type: "twoColumn";
  ratio?: "1:1" | "1:2" | "2:1";
  gap?: number;
  responsive?: { breakpoint?: "sm" | "md" | "lg"; stack?: boolean };
  children: UiNode[];
}

// Three-Column Layout
interface UiThreeColumn extends UiCommon {
  type: "threeColumn";
  ratios?: [number, number, number];
  gap?: number;
  responsive?: { breakpoint?: "sm" | "md" | "lg"; stack?: boolean };
  children: UiNode[];
}

// Sidebar Layout
interface UiSidebar extends UiCommon {
  type: "sidebar";
  position: "left" | "right";
  sidebarWidth?: "sm" | "md" | "lg";
  contentMaxWidth?: "sm" | "md" | "lg" | "xl" | "full";
  gap?: number;
  children: UiNode[];
}
```

### New Helper Functions

**Block Mapping Helper:**
```typescript
// Automatically creates UiBlockRef if block exists, falls back to UiSection
const sectionNode = createSectionNode(
  id,
  "hero",
  heroSectionData,
  "Welcome",
  true // preferBlocks
);
```

**Chat Orchestrator:**
```typescript
// Coordinates chat sessions with revision tracking
const orchestrator = createChatOrchestrator({
  sessionId: "session-123",
  context: { assetId: "...", revisionId: "..." }
});
```

### Revision Creation in Patch API

Patch API now supports optional revision creation:

```typescript
// POST /api/dsl/patch
{
  dsl: UiPage,
  patch: Patch | Patch[],
  createRevision: {
    assetId: string,
    parentRevisionId?: string,
    chatSessionId?: string,
    createdBy?: string,
    prompt?: string
  }
}
// Returns: { dsl, diagnostics, revisionId, ... }
```

---

## 📚 Documentation Updates

### Updated Documents

1. **PROJECT_STATUS.md** - New comprehensive status document (English)
2. **docs/studio/copilot/README.md** - Updated with Phase 2 completion
3. **docs/NEXT_STEPS.md** - Updated with Phase 2 completion
4. **docs/studio/copilot/implementation-plan.md** - Updated summary table
5. **docs/roadmap/FRAGMENT_UI_STUDIO_PLAN.md** - Updated Phase 2 status
6. **PHASE_2_STATUS.md** - Detailed Phase 2 status document

---

## 🎯 Next Steps

### Priority 1: Phase 3 - Submissions + Governance (2 weeks)

**Tasks:**
- EPIC D: Submissions Workflow
- EPIC F: Governance

**See:** [FRAGMENT_UI_STUDIO_PLAN.md](./docs/roadmap/FRAGMENT_UI_STUDIO_PLAN.md#phase-3-submissions--governance-2-weeks)

---

**Last Updated:** 2025-01-XX

