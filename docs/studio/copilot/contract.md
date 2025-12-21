# Copilot for Fragment AI Studio — Contract & Specification

**Version:** 1.0  
**Status:** Specification (Implementation in progress)  
**Last Updated:** 2025-01-XX

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [UI-DSL v2](#ui-dsl-v2)
4. [Patch Operations](#patch-operations)
5. [Registry Contract](#registry-contract)
6. [Skills (MCP/HTTP)](#skills-mcphttp)
7. [Submissions Workflow](#submissions-workflow)
8. [Conversational Editing](#conversational-editing)
9. [Quality Gates](#quality-gates)
10. [Telemetry & KPIs](#telemetry--kpis)
11. [Security & Compliance](#security--compliance)
12. [Implementation Plan](#implementation-plan)
13. [System Prompts](#system-prompts)
14. [Example Conversations](#example-conversations)

---

## 0. Overview

### Goals

**Generate:** From prompt → UI-DSL v2 → TSX (Fragment UI) for complex screens (dashboards, CRUD, landing pages).

**Edit conversationally:** Patch operations by `data-ui-id` (copy, variant, layout, move).

**Variant:** Create 2–5 variants (layout/copy/datasource) and compare.

**Validate:** Mandatory quality gates before PR (a11y, size, visual snapshots, DS lint).

**Promote:** Submissions → PR → review → merge to `@fragment_ui/blocks` / `@fragment_ui/ui`.

**Enrich:** Import from Figma (mapper to DSL), create new elements (with governance approval).

**Learn:** Telemetry (TTFUI, reuse, acceptance) → quality/ROI dashboard.

---

## 1. Architecture

```
Copilot (planner + skills)
  ├─ Skills (MCP/HTTP):
  │   ├─ registry.get/list
  │   ├─ dsl.generate / dsl.patch / dsl.validate
  │   ├─ code.gen / code.lint / code.fix
  │   ├─ quality.run (axe, size, stories, e2e-smoke)
  │   ├─ variants.create/score/compare
  │   ├─ submissions.create/status/promote
  │   ├─ figma.import → dsl.map
  │   └─ research.summarize (docs + web*)
  ├─ Policy layer (DS rules, a11y, import guards)
  └─ Memory (project/session context)

UI (Playground/Studio)
  ├─ Preview same-origin (esbuild-wasm)
  ├─ Inspector (props/variants/copy)
  ├─ Chat (conversational editing)
  ├─ Variants comparer
  └─ Submissions feed (statuses, diffs)

CI/Governance
  ├─ Quality gates (axe/size/visual/e2e/lint)
  └─ Promotion PR flow
```

*Web research only if user enables and accepts source policy.

---

## 2. UI-DSL v2 (Layout-First, Datasources, Slots)

### Type Definitions

```typescript
type Id = string; // uuid-v4
type Size = "sm" | "md" | "lg" | "xl"; // maxWidth etc.

type UiNode =
  | UiPage
  | UiSection
  | UiGrid
  | UiBlockRef
  | UiComponent;

type UiCommon = {
  id: Id;
  name?: string;
  a11y?: { ariaLabel?: string; describedBy?: string };
  layout?: { maxWidth?: Size; gap?: number; colSpan?: number };
  testId?: string;                 // for E2E
  dataUiId?: string;               // for patch-ops (mirror = id)
};

type UiPage = UiCommon & {
  type: "page";
  title?: string;
  children: UiNode[];              // sections, grids, blocks, components
  dataSources?: DataSource[];      // global
};

type UiSection = UiCommon & {
  type: "section";
  title?: string;
  variant?: "card" | "panel" | "hero" | "plain";
  children: UiNode[];
};

type UiGrid = UiCommon & {
  type: "grid";
  columns: number;                 // 2, 3, 4...
  children: UiNode[];
};

type UiBlockRef = UiCommon & {
  type: "block";
  ref: string;                     // "@fragment_ui/blocks/pricing-table"
  inputs?: Record<string, any>;    // e.g., plan list, CTA copy
};

type UiComponent = UiCommon & {
  type: "component";
  component: string;               // "Button" | "Input" | "DataTable"...
  props?: Record<string, any>;     // only props from registry
  children?: UiNode[];
  slots?: Record<string, UiNode[]>;// e.g., header/body/footer
  variant?: string;                // from registry
  copy?: string;                   // simple microcopy
  bind?: Binding[];                // datasource→prop mappings
};

type DataSource =
  | { id: Id; kind: "placeholder"; shape?: "table" | "cards" | "metrics" }
  | { id: Id; kind: "static"; data: any }
  | { id: Id; kind: "url"; url: string; method?: "GET" | "POST"; path?: string };

type Binding = { sourceId: Id; path: string; prop: string };
```

### Generator Rules

- Only components from registry
- Auto-set `data-ui-id = id`
- Map slots to Fragment UI structure (e.g., Card → header/content/footer)
- Datasource "placeholder" generates seed data (faker)
- Validation: zod/JSON Schema (fail → return `diagnostics[]`)

---

## 3. Patch Operations (Conversational Edits)

### Format

```typescript
type Patch = {
  targetId: string; // uuid
  op: 
    | "setProp" 
    | "setCopy" 
    | "toggleVariant" 
    | "addNode" 
    | "removeNode"
    | "moveNode" 
    | "wrapWith" 
    | "reorder" 
    | "rename" 
    | "setToken";
  args: Record<string, any>; // e.g., { path: "props.variant", value: "outline" }
};
```

### Handling (Copilot)

1. Extract intent from user prompt → set of `patch[]`
2. Verify in registry (variant exists, prop allowed)
3. Apply patch to DSL (`dsl.patch`)
4. Generate TSX (idempotently), refresh Preview
5. Return diff (DSL + TSX) and brief justification

---

## 4. Registry Contract (Source of Truth)

```typescript
type Registry = {
  version: string;
  components: Record<string, {
    import: string;                // "@fragment_ui/ui/button"
    variants?: string[];           // ["solid","outline","ghost"]
    props: Record<string, "string" | "number" | "boolean" | "enum" | "function" | "node" | string[]>;
    slots?: string[];              // ["header","content","footer"]
    a11y: { role?: string; notes?: string[] };
    examples?: string[];           // TSX/DSL sample
    forbiddenHtml?: string[];      // ["button","input"...]
  }>;
  blocks: Record<string, { 
    ref: string; 
    inputs: string[]; 
    notes?: string[] 
  }>;
  rules: {
    noRawHtml: true;
    noHardcodedColors: true;
    importOnlyFrom: ["@fragment_ui/ui", "@fragment_ui/blocks"];
  };
};
```

---

## 5. Skills (MCP/HTTP) — Copilot Interfaces

### 5.1 `dsl.generate`

**Input:**
```typescript
{
  prompt: string;
  intent?: "page" | "dashboard" | "form" | "landing";
  constraints?: { maxWidth?: Size; theme?: string };
}
```

**Output:** `UiPage`

**Rules:** Layout-first, sections, grids, datasources (min. placeholder).

---

### 5.2 `dsl.patch`

**Input:**
```typescript
{
  dsl: UiPage;
  patches: Patch[];
}
```

**Output:**
```typescript
{
  dsl: UiPage;
  diagnostics?: Issue[];
}
```

---

### 5.3 `code.gen`

**Input:**
```typescript
{
  dsl: UiPage;
}
```

**Output:**
```typescript
{
  tsx: string;
  imports: string[];
  stories?: string;
}
```

**Rules:** No `.css` imports, only registry imports; `data-ui-id` mirrors `id`.

---

### 5.4 `quality.run`

**Input:**
```typescript
{
  tsx: string;
}
```

**Output:**
```typescript
{
  axe: { violations: []; passes: number };
  size: { indexBytes: number; budgetsOk: boolean };
  visual: { snapshotUrl: string; changed: boolean };
  lint: { errors: []; warnings: [] };
  e2e: { smokePass: boolean };
}
```

---

### 5.5 `variants.create` / `variants.compare`

**create Input:**
```typescript
{
  dsl: UiPage;
  count?: number;
  emphasis?: "layout" | "copy" | "datasource";
}
```

**create Output:**
```typescript
{
  variants: UiPage[];
}
```

**compare Input:**
```typescript
{
  variants: UiPage[];
  criteria?: string[];
}
```

**compare Output:**
```typescript
{
  scores: Array<{
    idx: number;
    score: number;
    notes: string[];
  }>;
}
```

---

### 5.6 `submissions.create` / `status` / `promote`

**create Input:**
```typescript
{
  dsl: UiPage;
  tsx: string;
  meta: {
    title: string;
    description: string;
    tags: string[];
  };
}
```

**create Output:**
```typescript
{
  submissionId: string;
  prUrl: string;
  checklist: Record<string, boolean>;
}
```

**promote Input:**
```typescript
{
  submissionId: string;
  target: "blocks" | "ui";
  ref?: string;
}
```

**promote Output:**
```typescript
{
  merged: boolean;
  versionBump: "minor" | "patch" | "major";
}
```

---

### 5.7 `figma.import` → `dsl.map`

**import Input:**
```typescript
{
  framesExport: any;
  mappingHints?: Record<string, any>;
}
```

**import Output:**
```typescript
{
  raw: any;
}
```

**map Input:**
```typescript
{
  raw: any;
}
```

**map Output:**
```typescript
{
  dsl: UiPage;
  report: {
    mapped: number;
    skipped: string[];
  };
}
```

**Rules:** Without Enterprise — use exports (JSON/Frame descriptions), map to known blocks/components.

---

### 5.8 `research.summarize` (Optional, with consent)

**Input:**
```typescript
{
  docs?: File[];
  urls?: string[];
  queries?: string[];
}
```

**Output:**
```typescript
{
  facts: string[];
  contentBrief: string;
  sections: string[];
  suggestedBlocks: string[];
}
```

**Usage:** For landing pages/event screens.

**Privacy:** Display source list to user, request acceptance; cache results locally for session.

---

## 6. Submissions (End-to-End Contract)

### API (Studio)

- `POST /api/submissions` → validation, PR generation, checklists, status "Pending Review"
- `GET /api/submissions/:id` → status, quality logs, links to diffs/Chromatic
- `POST /api/submissions/:id/promote` → merge + changelog + publish block/ui

### Checklist (Auto-generated by Copilot)

- [ ] A11y AA = 0 violations
- [ ] Size budgets OK
- [ ] Storybook story added
- [ ] Visual snapshots (no regressions)
- [ ] E2E smoke passed
- [ ] Lint DS (noRawHtml/noHardcodedColors/importOnly)
- [ ] Docs: README snippet + usage + tokens

**On gate failure:** Copilot generates fix plan (patch list + diff), proposes re-run quality.

---

## 7. Conversational Editing — Copilot Instructions

Interpret user sentences as:

- **Set copy:** "change CTA to 'Get started'" → `setCopy(targetId, "Get started")`
- **Variant:** "Button to outline, size lg" → `setProp(..., "props.variant", "outline")`
- **Structure:** "add card with icon on left" → `addNode(parentId, UiComponent{...})`
- **Layout:** "move table up" → `moveNode(tableId, newIndex)`
- **Theme/Token:** "density compact" → `setToken("density", "compact")`

Return to user:

- Brief diff (what changed, where, why)
- Preview (refresh)
- Undo hook: "Undo?" (Copilot stores `inversePatches`)

---

## 8. Landing Generator (from Documents & Web)

### Flow (Copilot)

1. If user provides files/URL/queries → `research.summarize`
2. Build Content Brief (sections, copy proposal, value props)
3. Generate 3 DSL variants:
   - **A:** hero + 3 features + CTA + trust
   - **B:** hero + social proof + pricing + FAQ
   - **C:** hero (visual heavy) + metrics + comparison
4. `variants.compare` (criteria: clarity, hierarchy, a11y, token compliance)
5. Show comparer, allow patching conversationally, then Submissions

---

## 9. Inspector (UI) ↔ Copilot (Alignment)

- Every element in Preview has `data-ui-id`
- Inspector edits props/variant/copy → generates patch and sends to Copilot
- Copilot updates DSL → TSX → refreshes Preview (idempotently)
- **Single source of truth:** DSL. TSX = build artifact.

---

## 10. Quality Gates — How Copilot Runs

- **axe:** Level AA (tags wcag2a, wcag2aa, best-practice)
- **size:** `.size-limit.json` per component/block
- **visual:** Chromatic/Percy (at least 1 story)
- **lint DS:** Custom rules — no raw HTML, no colors outside tokens, import only
- **e2e smoke:** "renders & basic interaction" on preview (Playwright)

**Fail policy:** fail → propose-fix → rerun (max 2 times in one loop).

---

## 11. Telemetry/KPIs (What Copilot Logs)

### Events (with projectId, sessionId, submissionId)

- `copilot_generate_started` | `finished` | `failed`
- `copilot_patch_applied`
- `quality_run_*` (axe/size/visual/e2e)
- `submission_created` | `promoted` | `failed`
- `variant_created` | `compared` | `selected`

### KPIs

- **TTFUI** (ms: prompt → first preview)
- **Acceptance rate** (submissions → merged)
- **Reuse rate** (% screens using blocks/components)
- **Fix loop count** (iterations needed for green gates)

---

## 12. Security & DS Compliance

- **Import guards:** Only `@fragment_ui/ui`, `@fragment_ui/blocks`; zero `.css` imports in ESM
- **Sanity checks:** No `dangerouslySetInnerHTML`, no inline SVG from unknown source
- **Tokens only:** Colors/spacing/typography exclusively via tokens/Tailwind plugin
- **A11y default:** role/aria required per registry for interactive elements

---

## 13. Implementation Plan

### Phase 1 — Foundation (2–3 weeks)

- [ ] Add UI-DSL v2 (types, validation)
- [ ] Add `dsl.generate`, `dsl.patch`, `code.gen` (MCP/HTTP)
- [ ] Connect Inspector → patch-ops → refresh preview
- [ ] Add `quality.run` (axe/size/lint) — min. gates
- [ ] Unify registry (props/variants/slots/a11y)
- [ ] Enable lint DS in CI for demo and packages

### Phase 2 — Complex Screens & Variants (2–4 weeks)

- [ ] `variants.create/compare`, comparer in UI
- [ ] Blocks v1: dashboard, data table, pricing, auth, settings
- [ ] Seed-data fixtures + datasources binding

### Phase 3 — Submissions & Promotion (2 weeks)

- [ ] `/api/submissions` + statuses
- [ ] PR generator + checklists + CI comments
- [ ] `submissions.promote` (merge + version bump + changelog)

### Phase 4 — Landing Generator & Research (Optional, 2–3 weeks)

- [ ] `research.summarize` enabled per project (with consent policy)
- [ ] Landing variant templates
- [ ] Scoring criteria and acceptance flow

### Phase 5 — Figma Import (Without Enterprise) (2–4 weeks)

- [ ] `figma.import` (exports/JSON) → `dsl.map`
- [ ] Mapping report (what mapped / skipped)
- [ ] Same quality + submissions pipeline

---

## 14. System Prompts

### System (Short)

You are Copilot for Fragment AI Studio. Your source of truth: Registry + UI-DSL. Never use raw HTML elements or colors outside tokens. Generate DSL v2 layout-first, then TSX (Fragment UI). Every UI change = patch on DSL. Before PR, run quality gates. For complex screens, use Blocks and datasources. For copy/variants, use patch-ops. If fails, propose fix and retry.

### Enforced Rules

- Imports only from `@fragment_ui/ui` and `@fragment_ui/blocks`
- `data-ui-id = id` of node in DSL
- A11y Level AA (axe = 0 violations)
- Size budgets from `.size-limit.json`
- Always add story for new component/block

---

## 15. Example Conversations

### A. "Build sales dashboard..."

**U:** "Create dashboard: 3 KPI cards, orders table with date filter, revenue chart."

**C:** `dsl.generate(intent:"dashboard")` → `Page{Section KPIs, Grid(3 Cards), Section Filters+DataTable, Section Chart}`

**C:** `code.gen` → TSX; run preview + `quality.run`.

**C:** If axe fail → fix with patches (aria-label, contrast); refresh; show diff.

**U:** "Change third KPI to 'MRR', unfreeze 'Client' column."

**C:** `dsl.patch` (setCopy / setProp), `code.gen`, preview.

### B. "Give 3 landing variants from documents"

**U:** upload files → enables research.

**C:** `research.summarize` → brief → `variants.create(count:3)`.

**C:** `variants.compare` (criteria: clarity, a11y, hierarchy).

**U:** "Choose B, add FAQ, CTA to 'Get quote'."

**C:** patches, quality, Submissions.

---

## 16. Files/Configurations to Add

- `apps/demo/app/api/dsl/{generate,patch}.ts`
- `apps/demo/app/api/code/gen.ts`
- `apps/demo/app/api/quality/run.ts`
- `apps/demo/app/api/variants/{create,compare}.ts`
- `apps/demo/app/api/submissions/{create,status,promote}.ts`
- `packages/registry/registry.json` (complete slots/variants/a11y)
- `packages/dsl/schema.ts` (zod + JSON Schema)
- `tooling/lint` (DS rules active in demo + CI)
- `.github/workflows/ci.yml` (axe/size/lint/e2e; optionally Chromatic)
- `docs/copilot/contract.md`, `docs/submissions.md`, `docs/variants.md`

---

## 17. "Ready to Use" Criteria

✅ With one prompt, generate dashboard with table and filters; then edit copy/variants conversationally without breaking a11y.

✅ Variants comparer works and allows promoting winning variant.

✅ Submissions opens PR with artifacts (story, reports, snapshots) and quality gates pass/fail with clear diagnosis.

✅ Code contains no raw elements/colors and does not import CSS in ESM.

---

**Next Steps:** See [Implementation Plan](./implementation-plan.md) for detailed task breakdown.

