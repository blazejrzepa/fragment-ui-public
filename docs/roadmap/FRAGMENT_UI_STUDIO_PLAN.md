# Fragment UI Studio - Comprehensive Development Plan

**Version:** 2.0  
**Status:** Updated with Domain-Driven Architecture  
**Last Updated:** 2025-01-XX

---

## 📋 Overview

This document provides a comprehensive, actionable plan for implementing Fragment UI Studio based on domain-driven architecture principles. It organizes work into epics, stories, and tasks with clear acceptance criteria.

**🆕 Update (2025-01-XX):** Added Phase MVP-Demo for safe isolation of experimental features. See `docs/copilot/mvp-isolation-plan.md` for detailed implementation guide.

---

## 🎯 Strategic Goals

1. **Generate:** Complex screens (dashboards, landing pages, flows) from prompts and user intents
2. **Edit:** Conversational editing via patch workflow
3. **Reuse:** Component/Block/Token library with dependency awareness
4. **Review:** Quality gates and approval workflow (Submissions)
5. **Ship:** Versioning and publishing (Releases)
6. **Measure:** A/B testing with PostHog (Experiments)
7. **Scale:** Governance policies and compliance (Governance)
8. **AI-Native UX:** Enable intent-based UI generation following AI-first principles - showcase through realistic demos across industries

---

## 🏗️ Architecture Overview

### Core Domain (packages/studio-core)

**Purpose:** Shared domain model and interfaces for all modules.

**Key Entities:**
- `Asset`: component | block | screen | page | flow | tokenSet | theme
- `Revision`: Immutable snapshot of Asset
- `Patch`: Atomic operations for editing
- `CheckResult`: Quality check results
- `Experiment`: A/B test configuration
- `LifecycleState`: draft → submitted → approved → published → deprecated

**See:** [STUDIO_DOMAIN_MODEL.md](../architecture/STUDIO_DOMAIN_MODEL.md)

### Module Boundaries

1. **Studio (Create):** AI generation + conversational editing
2. **Library (Reuse):** Component/Block catalog
3. **Drafts (Review):** Submissions workflow
4. **Releases (Ship):** Versioning + publishing
5. **Experiments (Measure):** A/B testing
6. **Governance (Scale):** Policies + compliance

**See:** [MODULES_BOUNDARIES.md](../architecture/MODULES_BOUNDARIES.md)

---

## 📊 Implementation Phases

### Phase 0: Core Domain Foundation (1 week)

**Status:** 📋 To be implemented  
**Priority:** P0 (Critical - Foundation for all modules)

#### EPIC A: Core Domain Model

**Goal:** Establish shared domain model and interfaces.

**Stories:**

**A1: Define Core Entities**
- [ ] Create `packages/studio-core/src/entities/asset.ts`
- [ ] Create `packages/studio-core/src/entities/revision.ts`
- [ ] Create `packages/studio-core/src/entities/patch.ts`
- [ ] Create `packages/studio-core/src/entities/check-result.ts`
- [ ] Create `packages/studio-core/src/entities/experiment.ts`
- [ ] Create `packages/studio-core/src/entities/lifecycle-state.ts`

**Files:**
- `packages/studio-core/src/entities/asset.ts` (new)
- `packages/studio-core/src/entities/revision.ts` (new)
- `packages/studio-core/src/entities/patch.ts` (new)
- `packages/studio-core/src/entities/check-result.ts` (new)
- `packages/studio-core/src/entities/experiment.ts` (new)
- `packages/studio-core/src/entities/lifecycle-state.ts` (new)

**Acceptance Criteria:**
- All entities defined with TypeScript interfaces
- Entities match domain model specification
- Types exported from `packages/studio-core/src/index.ts`

**Estimation:** 8-12h

---

**A2: Repository Interfaces**
- [ ] Define `AssetRepository` interface
- [ ] Define `RevisionRepository` interface
- [ ] Define `SubmissionRepository` interface
- [ ] Define `ExperimentRepository` interface
- [ ] Define `ReleaseRepository` interface

**Files:**
- `packages/studio-core/src/repositories/interfaces.ts` (new)

**Acceptance Criteria:**
- All repository interfaces defined
- Methods for CRUD operations
- Methods for querying by filters

**Estimation:** 4-6h

---

**A3: Domain Events**
- [ ] Define domain event types
- [ ] Create event emitter interface
- [ ] Create event payload types

**Files:**
- `packages/studio-core/src/events/domain-events.ts` (new)
- `packages/studio-core/src/events/event-emitter.ts` (new)

**Acceptance Criteria:**
- All domain events defined (AssetCreated, RevisionCreated, etc.)
- Event emitter interface defined
- Type-safe event payloads

**Estimation:** 4-6h

---

**A4: Storage Implementation (Local/File)**
- [ ] Implement `AssetRepository` (file-based)
- [ ] Implement `RevisionRepository` (file-based)
- [ ] Implement `SubmissionRepository` (file-based)
- [ ] Implement `ExperimentRepository` (file-based)
- [ ] Add migration path for future DB

**Files:**
- `packages/studio-core/src/repositories/file/asset-repository.ts` (new)
- `packages/studio-core/src/repositories/file/revision-repository.ts` (new)
- `packages/studio-core/src/repositories/file/submission-repository.ts` (new)
- `packages/studio-core/src/repositories/file/experiment-repository.ts` (new)

**Acceptance Criteria:**
- All repositories implement interfaces
- File-based storage works (JSON files)
- Can migrate to DB later without changing interfaces

**Estimation:** 12-16h

---

**Phase 0 Total:** 28-40h (1 week)

---

### Phase 2: Studio (Create) - Complex Screens + Patch Workflow (2-3 weeks)

**Status:** ✅ Completed (100% - all tasks completed)  
**Priority:** P0 (Critical)

#### EPIC B: Complex Screens Generation

**Goal:** Generate complex screens (dashboards, landing pages) with sections, grids, navigation.

**Stories:**

**B1: Extend UI-DSL for Complex Screens**
- [ ] Add section types: hero, pricing, featureGrid, stats, testimonials, faq, dataTable, chartPlaceholder
- [ ] Add layout types: grid, stack, two-column, three-column, sidebar-left/right, full-width
- [ ] Add responsive rules
- [ ] Add container maxWidth constraints

**Files:**
- `packages/ui-dsl/src/types-v2.ts` (update)
- `packages/ui-dsl/src/schema.ts` (update)

**Acceptance Criteria:**
- DSL supports all section types
- DSL supports all layout types
- Schema validates correctly

**Estimation:** 8-12h

---

**B2: Screen Scaffolds (Templates)**
- [ ] Create dashboard scaffold
- [ ] Create landing page scaffold
- [ ] Create settings flow scaffold
- [ ] Create auth flow scaffold
- [ ] Add scaffold registry

**Files:**
- `apps/demo/src/lib/scaffolds/dashboard.ts` (new)
- `apps/demo/src/lib/scaffolds/landing.ts` (new)
- `apps/demo/src/lib/scaffolds/settings.ts` (new)
- `apps/demo/src/lib/scaffolds/auth.ts` (new)
- `apps/demo/src/lib/scaffolds/registry.ts` (new)

**Acceptance Criteria:**
- Scaffolds generate valid DSL
- Scaffolds use @fragment_ui/blocks where possible
- Scaffolds are composable

**Estimation:** 12-16h

---

**B3: Enhanced DSL Generator**
- [ ] Map sections to @fragment_ui/blocks (preferred)
- [ ] Fallback to @fragment_ui/ui composition
- [ ] Import planner based on registry
- [ ] Generate responsive layouts

**Files:**
- `apps/demo/src/lib/dsl-generator.ts` (update)
- `apps/demo/app/api/dsl/generate/route.ts` (update)

**Acceptance Criteria:**
- Prompt "dashboard for SaaS admin" generates screen with sidebar/nav + header + widgets + table
- Prompt "landing page for webinar" generates hero + value props + CTA + FAQ
- All renders without bundler errors

**Estimation:** 16-20h

---

**EPIC B Total:** 36-48h

---

#### EPIC C: Patch Workflow (Conversational Editing)

**Goal:** Enable iterative editing via patches without full regeneration.

**Stories:**

**C1: Chat Mode Detection**
- [ ] Detect "generate" vs "edit" mode in chat
- [ ] Track current Asset/Revision in chat session
- [ ] Maintain patch history

**Files:**
- `apps/demo/src/lib/chat-orchestrator.ts` (new)
- `apps/demo/app/api/chat/route.ts` (update)

**Acceptance Criteria:**
- Chat detects edit intent
- Chat maintains context of current Revision
- Can switch between generate and edit modes

**Estimation:** 8-12h

---

**C2: Patch Intent Parser**
- [ ] Parse natural language to Patch operations
- [ ] Support all patch operations (setCopy, setProp, addNode, etc.)
- [ ] Validate patches against DSL schema

**Files:**
- `apps/demo/src/lib/patch-intent-parser.ts` (new)
- `apps/demo/app/api/dsl/patch/route.ts` (update)

**Acceptance Criteria:**
- "Change button text to 'Book demo'" → setCopy patch
- "Add second CTA next to it" → addNode patch
- "Change button variant to outline" → toggleVariant patch
- "Move FAQ section up" → moveNode/reorder patch

**Estimation:** 12-16h

---

**C3: Patch Application + Regeneration**
- [ ] Apply patches to DSL
- [ ] Regenerate TSX from patched DSL
- [ ] Update preview
- [ ] Create new Revision

**Files:**
- `apps/demo/src/lib/dsl-patch.ts` (update - already exists)
- `apps/demo/app/api/dsl/patch/route.ts` (update)
- `apps/demo/app/api/code/gen/route.ts` (update)

**Acceptance Criteria:**
- Patches applied correctly
- TSX regenerated from patched DSL
- Preview updates without full reload
- New Revision created with parent link

**Estimation:** 8-12h

---

**C4: Inspector Integration**
- [ ] Click in preview → select data-ui-id
- [ ] Show context for patching
- [ ] Generate patches from inspector changes

**Files:**
- `apps/demo/src/components/playground/element-inspector.tsx` (update)
- `apps/demo/app/studio/page.tsx` (update)

**Acceptance Criteria:**
- Inspector generates patches
- Patches applied via API
- Preview updates after patch

**Estimation:** 8-12h

---

**EPIC C Total:** 36-52h

---

#### EPIC I: Figma Plugin Integration

**Goal:** Enable design-to-code workflow via Figma Plugin with DSL generation and MCP integration.

**Stories:**

**I1: Plugin Foundation + Structure**
- [ ] Create plugin project structure (TypeScript + Vite)
- [ ] Set up manifest.json
- [ ] Create plugin UI (React)
- [ ] Set up build system

**Files:**
- `fragment-ui-figma-plugin/manifest.json` (new)
- `fragment-ui-figma-plugin/package.json` (new)
- `fragment-ui-figma-plugin/tsconfig.json` (new)
- `fragment-ui-figma-plugin/vite.config.ts` (new)
- `fragment-ui-figma-plugin/src/plugin/index.ts` (new)
- `fragment-ui-figma-plugin/src/ui/App.tsx` (new)

**Acceptance Criteria:**
- Plugin loads in Figma
- UI panel displays
- Build system works
- TypeScript compiles

**Estimation:** 8-12h

---

**I2: Parser Engine**
- [ ] Implement `normalizeNode` function
- [ ] Parse Figma nodes to NormalizedNode model
- [ ] Handle AutoLayout (horizontal/vertical)
- [ ] Extract padding, gap, fills, text styles
- [ ] Handle component variants

**Files:**
- `fragment-ui-figma-plugin/src/plugin/parser/normalize.ts` (new)
- `fragment-ui-figma-plugin/src/plugin/parser/inspect.ts` (new)
- `fragment-ui-figma-plugin/src/plugin/utils/types.ts` (new)

**Acceptance Criteria:**
- Can parse selected Figma nodes
- NormalizedNode model matches specification
- AutoLayout converted correctly
- All style properties extracted

**Estimation:** 8-12h

---

**I3: Component Mapper**
- [ ] Implement mapping rules (Button, Input, Card, etc.)
- [ ] Create `mapToFragmentComponent` function
- [ ] Handle edge cases (nested components, variants)
- [ ] Generate Fragment UI component suggestions

**Files:**
- `fragment-ui-figma-plugin/src/plugin/mapping/components.ts` (new)
- `fragment-ui-figma-plugin/src/plugin/mapping/infer.ts` (new)

**Acceptance Criteria:**
- Button-like structures mapped to `<Button>`
- Input-like structures mapped to `<Input>`
- Card-like structures mapped to `<Card>`
- Mapping rules are configurable

**Estimation:** 8-12h

---

**I4: Token Extractor**
- [ ] Extract colors from Figma styles
- [ ] Extract radius values
- [ ] Extract typography (font, size, weight)
- [ ] Map to Fragment UI token format
- [ ] Generate token JSON output

**Files:**
- `fragment-ui-figma-plugin/src/plugin/tokens/extract-colors.ts` (new)
- `fragment-ui-figma-plugin/src/plugin/tokens/extract-radius.ts` (new)
- `fragment-ui-figma-plugin/src/plugin/tokens/extract-typography.ts` (new)

**Acceptance Criteria:**
- Colors extracted from Figma styles
- Radius values extracted
- Typography extracted
- Output matches Fragment UI token format

**Estimation:** 6-8h

---

**I5: Layout Analyzer**
- [ ] Convert AutoLayout to Flexbox/Tailwind
- [ ] Handle padding/gap conversion
- [ ] Generate responsive classes
- [ ] Handle min/max width constraints

**Files:**
- `fragment-ui-figma-plugin/src/plugin/layout/autolayout.ts` (new)
- `fragment-ui-figma-plugin/src/plugin/layout/spacing.ts` (new)

**Acceptance Criteria:**
- AutoLayout horizontal → `flex flex-row`
- AutoLayout vertical → `flex flex-col`
- Gap converted to Tailwind classes
- Padding converted correctly

**Estimation:** 6-8h

---

**I6: UI-DSL Generator**
- [ ] Generate Fragment UI DSL from NormalizedNode
- [ ] Support component structures
- [ ] Support layout structures
- [ ] Generate valid DSL syntax

**Files:**
- `fragment-ui-figma-plugin/src/plugin/dsl/generate-dsl.ts` (new)
- `fragment-ui-figma-plugin/src/plugin/dsl/builders.ts` (new)

**Acceptance Criteria:**
- DSL generated from Figma selection
- DSL is valid (can be parsed by AI Studio)
- DSL includes component structure
- DSL includes layout information

**Estimation:** 8-12h

---

**I7: MCP Integration**
- [ ] Send DSL to MCP server
- [ ] Handle MCP responses
- [ ] Display generated code/patches
- [ ] Error handling

**Files:**
- `fragment-ui-figma-plugin/src/plugin/mcp/send-to-mcp.ts` (new)

**Acceptance Criteria:**
- DSL sent to MCP server (localhost:8765)
- Can receive generated code
- Can receive patches
- Errors handled gracefully

**Estimation:** 4-6h

---

**I8: Plugin UI + Export Options**
- [ ] Export TSX button
- [ ] Export DSL button
- [ ] Export Tokens button
- [ ] Preview mapping rules
- [ ] Display generated code/DSL

**Files:**
- `fragment-ui-figma-plugin/src/ui/components/ExportButtons.tsx` (new)
- `fragment-ui-figma-plugin/src/ui/components/CodeBlock.tsx` (new)
- `fragment-ui-figma-plugin/src/ui/App.tsx` (update)

**Acceptance Criteria:**
- All export buttons work
- Code/DSL displayed in UI
- Can copy to clipboard
- UI is responsive

**Estimation:** 6-8h

---

**EPIC I Total:** 54-78h

---

#### EPIC J: Abstract UI Model Integration (Node-based DSL)

**Goal:** Integrate abstract UI model (Node-based DSL) to enable more flexible and AI-native UI generation while maintaining Fragment UI components and design system architecture.

**Technical Approach:** Node-based DSL with abstract representation (id, tag, attrs, style, children, slots, metadata) that can be mapped to Fragment UI components.

**Stories:**

**J1: Abstract Node Model (Node-based DSL)**
- [ ] Define `Node` interface with `id`, `tag`, `attrs`, `style`, `children`, `slots`, `metadata`
- [ ] Create `studio/dsl/nodes.ts` with Node types
- [ ] Create `studio/dsl/elements/` directory for component examples
- [ ] Support metadata: `category`, `label`, `icon`, `ai` (prompt aliases)

**Files:**
- `apps/demo/src/lib/studio/dsl/nodes.ts` (new)
- `apps/demo/src/lib/studio/dsl/elements/` (new directory)
- `apps/demo/src/lib/studio/dsl/elements/button.json` (example)
- `apps/demo/src/lib/studio/dsl/elements/form.json` (example)

**Acceptance Criteria:**
- Node interface supports abstract UI representation (id, tag, attrs, style, children, slots, metadata)
- Elements directory contains example components
- Metadata supports AI prompt aliases
- Types exported and documented

**Estimation:** 12-16h

---

**J2: DSL → Fragment UI Adapter**
- [ ] Create tag → component mapping (`map.json`)
- [ ] Implement token mapping (spacing, color) to props/CSS classes
- [ ] Add fallback handling for unmapped tags
- [ ] Support slots mapping

**Files:**
- `apps/demo/src/lib/studio/runtime/render.tsx` (new)
- `apps/demo/src/lib/studio/registry/map.json` (new)
- `apps/demo/src/lib/studio/runtime/node-to-jsx.ts` (new)

**Acceptance Criteria:**
- "form-button" → Button component
- Tokens map to Fragment UI props/classes
- Unmapped tags fallback gracefully
- Slots render correctly

**Estimation:** 16-20h

---

**J3: Patch Engine Enhancement**
- [ ] Extend patch operations for Node model (update, add, delete)
- [ ] Support path-based operations (`path: string[]`)
- [ ] Add prop/value updates
- [ ] Create patch examples

**Files:**
- `apps/demo/src/lib/studio/patch/apply.ts` (new)
- `apps/demo/src/lib/studio/patch/examples.json` (new)
- `apps/demo/src/lib/studio/patch/node-patch.ts` (new)

**Acceptance Criteria:**
- Patches work on Node model
- Path-based operations work correctly
- Examples demonstrate all patch types
- Patches validate before application

**Estimation:** 12-16h

---

**J4: Prompt → Node DSL (LLM Bridge)**
- [ ] Create prompt templates for Node generation
- [ ] Integrate with OpenAI/local LLM for Node[] generation
- [ ] Use element aliases from metadata
- [ ] Build semantic UI structure from prompts

**Files:**
- `apps/demo/src/lib/studio/ai/generate.ts` (new)
- `apps/demo/src/lib/studio/prompts/templates/` (new directory)
- `apps/demo/src/lib/studio/ai/node-generator.ts` (new)

**Acceptance Criteria:**
- Prompts generate valid Node[] structures
- Uses element aliases from metadata
- Semantic structure matches prompt intent
- Generated DSL validates correctly

**Estimation:** 16-20h

---

**J5: Component Registry Enhancement**
- [ ] Extend registry with ComponentMeta (tag, component, props, tokens, examples, a11y)
- [ ] Create `components.json` with Fragment UI components
- [ ] Create `tokens.json` with design tokens
- [ ] Support AI prompt aliases in registry

**Files:**
- `apps/demo/src/lib/studio/registry/components.json` (new)
- `apps/demo/src/lib/studio/registry/tokens.json` (new)
- `apps/demo/src/lib/studio/registry/registry-loader.ts` (new)

**Acceptance Criteria:**
- Registry contains all Fragment UI components
- Tokens mapped correctly
- Examples provided for each component
- A11y info included
- AI aliases work

**Estimation:** 12-16h

---

**J6: Integration with Existing UI-DSL v2**
- [ ] Create bidirectional converter: Node ↔ UI-DSL v2
- [ ] Maintain backward compatibility
- [ ] Support both models in Studio
- [ ] Update codegen to support both

**Files:**
- `apps/demo/src/lib/studio/dsl/node-to-ui-dsl.ts` (new)
- `apps/demo/src/lib/studio/dsl/ui-dsl-to-node.ts` (new)
- `apps/demo/src/lib/dsl-codegen.ts` (update)

**Acceptance Criteria:**
- Node model converts to UI-DSL v2
- UI-DSL v2 converts to Node model
- Both models work in Studio
- Codegen supports both

**Estimation:** 16-20h

---

**EPIC J Total:** 84-108h (2-3 weeks)

**Notes:**
- This EPIC extends the current UI-DSL v2 system with a more abstract, AI-native model
- Maintains compatibility with Fragment UI components and design system
- Enables more flexible prompt-to-UI generation
- Can be implemented incrementally alongside existing EPICs

---

#### EPIC K: AI-Native Demos Showcase 🆕

**Goal:** Create 4 realistic, working demos showcasing intent-based UI generation across different industries (SaaS, E-commerce, Fintech). Demonstrates the full cycle: prompt → UI structure → interaction → value, aligned with AI-native UX principles.

**Stories:**

**K1: Demo 1 - SaaS CRM (Customer Ticket Management)**
- [ ] Create `apps/demo/app/studio/demo/saas-crm-intents/` directory
- [ ] Create `ticketsSummary.dsl.json` (prompt: "Pokaż klientów z największą liczbą nierozwiązanych ticketów")
- [ ] Implement DataTable with Badge, SortDropdown, Tag, DateColumn components
- [ ] Create `shared/fakeApi.ts` → `fetchTicketsSummary()`
- [ ] Add interaction: sorting by "Unresolved" column, click row → modal with details
- [ ] Add agent logic: generate table structure with column aliases
- [ ] Add UX: editor-frame + sidebar tooltip "Prompt-generated interface"
- [ ] Write tests (`ticketsSummary.spec.ts`)
- [ ] Create README.md with demo documentation

**Files:**
- `apps/demo/app/studio/demo/saas-crm-intents/ticketsSummary.dsl.json` (new)
- `apps/demo/app/studio/demo/saas-crm-intents/ticketsSummary.spec.ts` (new)
- `apps/demo/app/studio/demo/saas-crm-intents/README.md` (new)

**Estimation:** 8-12h

---

**K2: Demo 2 - SaaS Survey BI (Customer Feedback Analysis)**
- [ ] Create `apps/demo/app/studio/demo/saas-survey-intents/` directory
- [ ] Create `feedbackTrends.dsl.json` (prompt: "Jakie były najczęstsze tematy w komentarzach klientów w Q4?")
- [ ] Implement BarChart, TagList, TextareaSummary, Dropdown[quarter] components
- [ ] Create `shared/fakeApi.ts` → `fetchSurveyKeywords(quarter)`
- [ ] Add interaction: change quarter → regenerate chart, hover bar → show comments
- [ ] Add agent logic: select BarChart as default viz + map semantic fields
- [ ] Add UX: AI tooltip "Interfejs dla analizy semantycznej"
- [ ] Write tests (`feedbackTrends.spec.ts`)
- [ ] Create README.md

**Files:**
- `apps/demo/app/studio/demo/saas-survey-intents/feedbackTrends.dsl.json` (new)
- `apps/demo/app/studio/demo/saas-survey-intents/feedbackTrends.spec.ts` (new)
- `apps/demo/app/studio/demo/saas-survey-intents/README.md` (new)

**Estimation:** 8-12h

---

**K3: Demo 3 - E-commerce (Shopping Assistant)**
- [ ] Create `apps/demo/app/studio/demo/ecommerce-assistant/` directory
- [ ] Create `addWatch.dsl.json` (prompt: "Dodaj zegarek do mojego koszyka")
- [ ] Implement ProductCard, CartSummary, ActionButton, RatingStars components
- [ ] Create `shared/fakeApi.ts` → `findProduct("zegarek")`, `updateCart()`
- [ ] Add interaction: click "Dodaj do koszyka" → API mutation + UI update
- [ ] Add agent logic: use intent `'addToCart'` → generate ProductCard + ActionButton
- [ ] Add UX: generative card + snackbar "Produkt dodany do koszyka"
- [ ] Write tests (`addWatch.spec.ts`)
- [ ] Create README.md

**Files:**
- `apps/demo/app/studio/demo/ecommerce-assistant/addWatch.dsl.json` (new)
- `apps/demo/app/studio/demo/ecommerce-assistant/addWatch.spec.ts` (new)
- `apps/demo/app/studio/demo/ecommerce-assistant/README.md` (new)

**Estimation:** 8-12h

---

**K4: Demo 4 - Fintech (Savings Goal Tracker)**
- [ ] Create `apps/demo/app/studio/demo/fintech-budget-goals/` directory
- [ ] Create `savingsGoal.dsl.json` (prompt: "Pokaż mi postęp mojego celu 500 zł oszczędności")
- [ ] Implement GoalProgressBar, SavingsChart, ActionSuggestion, AlertBanner components
- [ ] Create `shared/fakeApi.ts` → `fetchUserGoal(userId)`
- [ ] Add interaction: click suggestion → card, interactive simulation
- [ ] Add agent logic: combine intent `trackGoal` with Progress + Chart components
- [ ] Add UX: GoalProgressBar + interactive savings simulation
- [ ] Write tests (`savingsGoal.spec.ts`)
- [ ] Create README.md

**Files:**
- `apps/demo/app/studio/demo/fintech-budget-goals/savingsGoal.dsl.json` (new)
- `apps/demo/app/studio/demo/fintech-budget-goals/savingsGoal.spec.ts` (new)
- `apps/demo/app/studio/demo/fintech-budget-goals/README.md` (new)

**Estimation:** 8-12h

---

**K5: Shared Infrastructure & Agent Logic**
- [ ] Create `apps/demo/app/studio/demo/shared/fakeApi.ts` with all mock API functions
- [ ] Create `apps/demo/app/studio/demo/shared/templates/` with reusable DSL templates
- [ ] Create `apps/demo/app/studio/demo/shared/agent.ts` for prompt → DSL mapping
- [ ] Create `apps/demo/app/studio/demo/shared/intent-detector.ts` (CRM, Survey, E-commerce, Fintech)
- [ ] Create `apps/demo/app/studio/demo/shared/component-selector.ts` (intent → components)
- [ ] Create `apps/demo/app/studio/demo/DemoNavigator.tsx` (demo loader/navigator UI)
- [ ] Add "Generate Demo" button in Studio editor
- [ ] Add AI-generated labels and tooltips UI
- [ ] Create `apps/demo/app/studio/demo/playwright-snapshots.ts` for visual regression

**Files:**
- `apps/demo/app/studio/demo/shared/fakeApi.ts` (new)
- `apps/demo/app/studio/demo/shared/templates/` (new directory)
- `apps/demo/app/studio/demo/shared/agent.ts` (new)
- `apps/demo/app/studio/demo/shared/intent-detector.ts` (new)
- `apps/demo/app/studio/demo/shared/component-selector.ts` (new)
- `apps/demo/app/studio/demo/DemoNavigator.tsx` (new)
- `apps/demo/app/studio/demo/playwright-snapshots.ts` (new)
- `apps/demo/app/studio/page.tsx` (update - add demo button)

**Estimation:** 16-20h

---

**K6: Testing & Quality**
- [ ] Write unit tests for all 4 demos (.spec.ts files)
- [ ] Create Playwright snapshots for visual regression testing
- [ ] Test prompt → DSL → TSX → Preview flow end-to-end
- [ ] Test interactions (clicks, sorting, filtering, API calls)
- [ ] Test API integration (fakeApi.ts)
- [ ] A11y tests for generated interfaces
- [ ] Create `.github/workflows/demo-tests.yml` CI workflow

**Files:**
- `apps/demo/app/studio/demo/**/*.spec.ts` (4 test files)
- `apps/demo/app/studio/demo/playwright-snapshots.ts` (update)
- `.github/workflows/demo-tests.yml` (new)

**Estimation:** 8-12h

---

**EPIC K Total:** 56-80h (1-2 weeks)

**Notes:**
- These demos showcase AI-native UX: prompt → UI → interaction → value
- Ready for use in pitch decks, portfolios, or live demonstrations
- Demonstrates intent-based UI generation across different industries
- Each demo is fully functional with realistic data and interactions

---

**Phase 1 Total:** 266-366h (5-7 weeks)

---

### Phase 2: Submissions (Review) + Governance (Scale) (2 weeks)

**Status:** 🚧 Partially implemented (needs enhancement)  
**Priority:** P0 (Critical)

#### EPIC D: Submissions Workflow

**Goal:** Quality gate and review workflow.

**Stories:**

**D1: Enhanced Submission Model**
- [ ] Add `revisionId` field (link to Revision)
- [ ] Add `experimentId` and `variantKey` fields (for A/B testing)
- [ ] Add `artifactHash` field (for deduplication)
- [ ] Update state machine: draft → submitted → approved → rejected

**Files:**
- `apps/demo/app/submissions/types.ts` (update)
- `packages/studio-core/src/entities/revision.ts` (reference)

**Acceptance Criteria:**
- Submission links to Revision
- Submission supports experiment tracking
- State machine works correctly

**Estimation:** 4-6h

---

**D2: Quality Checks Runner**
- [ ] DS lint rules (no raw HTML, DS imports only, no hardcoded colors)
- [ ] A11y baseline (axe) - P0: no critical violations
- [ ] Bundle policy (no CSS import ESM, no forbidden deps)
- [ ] Test presence (minimum: story + unit for new components)

**Files:**
- `apps/demo/app/api/submissions/[id]/run-checks/route.ts` (update)
- `apps/demo/src/lib/quality-checks.ts` (update - already exists)

**Acceptance Criteria:**
- All checks run automatically
- Results stored in CheckResult
- Violations block approval

**Estimation:** 8-12h

---

**D3: Review Interface**
- [ ] Inline comments on DSL/TSX
- [ ] Request changes workflow
- [ ] Approval workflow
- [ ] Diff visualization

**Files:**
- `apps/demo/src/components/submissions/review-interface.tsx` (new)
- `apps/demo/app/api/submissions/[id]/approve/route.ts` (update)
- `apps/demo/app/api/submissions/[id]/request-changes/route.ts` (update)

**Acceptance Criteria:**
- Can add comments
- Can request changes
- Can approve
- Diff shows changes

**Estimation:** 12-16h

---

**EPIC D Total:** 24-34h

---

#### EPIC F: Governance (Policies + Enforcement)

**Goal:** Policies, compliance, standards enforcement.

**Stories:**

**F1: Policy Registry**
- [ ] Define policy bundles (Core DS, Enterprise, Marketing)
- [ ] Define rule types (lint, a11y, bundle, forbidden-deps)
- [ ] Create policy registry

**Files:**
- `apps/demo/src/lib/governance/policy-registry.ts` (new)
- `apps/demo/src/lib/governance/policies/core-ds.ts` (new)
- `apps/demo/src/lib/governance/policies/enterprise.ts` (new)

**Acceptance Criteria:**
- Policies defined
- Rules can be bundled
- Policies can be queried

**Estimation:** 8-12h

---

**F2: Rule Engine**
- [ ] Execute rules on DSL/TSX
- [ ] Return violations
- [ ] Support auto-fix suggestions

**Files:**
- `apps/demo/src/lib/governance/rule-engine.ts` (new)
- `apps/demo/src/lib/governance/rules/lint-rule.ts` (new)
- `apps/demo/src/lib/governance/rules/a11y-rule.ts` (new)
- `apps/demo/src/lib/governance/rules/bundle-rule.ts` (new)

**Acceptance Criteria:**
- Rules execute on Revision
- Violations returned
- Auto-fix suggestions provided

**Estimation:** 12-16h

---

**F3: Enforcement Points**
- [ ] Studio: Soft warnings (P0 blocks)
- [ ] Submissions: Hard gates
- [ ] Releases: Final gates

**Files:**
- `apps/demo/app/studio/page.tsx` (update)
- `apps/demo/app/api/submissions/[id]/run-checks/route.ts` (update)
- `apps/demo/app/api/releases/[id]/publish/route.ts` (new - future)

**Acceptance Criteria:**
- Studio shows warnings
- Submissions block on errors
- Releases enforce final gates

**Estimation:** 8-12h

---

**F4: Ownership + Exceptions**
- [ ] Owner management
- [ ] Exception requests
- [ ] Audit logging

**Files:**
- `apps/demo/src/lib/governance/ownership.ts` (new)
- `apps/demo/src/lib/governance/exceptions.ts` (new)
- `apps/demo/src/lib/governance/audit.ts` (new)

**Acceptance Criteria:**
- Can assign owners
- Can request exceptions
- Audit log tracks all actions

**Estimation:** 8-12h

---

**EPIC F Total:** 36-52h

---

**Phase 2 Total:** 60-86h (2 weeks)

---

### Phase MVP-Demo: Safe MVP Isolation (2-3 weeks) 🆕

**Status:** 📋 To be implemented  
**Priority:** P0 (Strategic - After Copilot Stabilization)  
**Estimated Duration:** 2-3 weeks (80-120h)

**Goal:** Build isolated MVP application that demonstrates core flows without affecting main Studio.

**Why separate MVP:**
- 🔐 **Isolation from core project** - No impact on existing workflows
- 🧪 **Experimental nature** - Test unstable features safely
- 🧼 **Minimalism and control** - Minimal surface API, refactor without breaking core

**Key Features:**
- ✅ Stable runtime renderer (no React Live dependency)
- ✅ Dashboard builder + Inspector
- ✅ Variant generator (deterministic + optional LLM)
- ✅ Submissions minimal workflow (3 entry paths)
- ✅ Governance minimal checks (2-3 checks)
- ✅ A/B test runner (mock or PostHog optional)

**Architecture:**
- New isolated app: `apps/demo-mvp/`
- Runtime renderer: ComponentRegistry → React.createElement
- Error boundaries + crash-safe preview
- Fallback mode for stability

**See:** `docs/copilot/mvp-isolation-plan.md` for detailed implementation guide.

**EPIC MVP: MVP-Demo Implementation**

**MVP1: Setup & Runtime Renderer**
- [ ] Create `apps/demo-mvp/` in monorepo
- [ ] Configure workspace and dependencies
- [ ] Implement `componentRegistry.ts` (map names → components)
- [ ] Implement `renderNode.tsx` (React.createElement renderer)
- [ ] Implement `renderDashboard.tsx` (layout renderer)
- [ ] Add ErrorBoundary wrapper
- [ ] Implement fallback mode

**Estimation:** 24-32h

---

**MVP2: Dashboard & Inspector**
- [ ] Create `dashboard.base.json` fixture
- [ ] Implement Playground route with runtime renderer
- [ ] Implement Inspector panel (props editing)
- [ ] Implement revision tracking (local state)
- [ ] Add "Save revision" functionality

**Estimation:** 16-24h

---

**MVP3: Variant Generator**
- [ ] Implement `variantGenerator.ts` (deterministic transformations)
- [ ] Generate 2-4 variants (A, B, C, D)
- [ ] Optional LLM for narrative text
- [ ] Variant comparison UI

**Estimation:** 16-24h

---

**MVP4: Submissions Minimal Workflow**
- [ ] Create Submission model (JSON schema)
- [ ] Implement 3 entry paths:
  - From Playground: "Promote block to component"
  - Paste Code: "Submit from code"
  - Figma Import: "Import from Figma" (mock)
- [ ] Origin type tracking
- [ ] Status workflow UI

**Estimation:** 12-16h

---

**MVP5: Governance Minimal Checks**
- [ ] Implement A11y check (axe-core)
- [ ] Implement Token compliance check
- [ ] Implement Visual snapshot (mock)
- [ ] Results UI with badges
- [ ] "Run checks" panel

**Estimation:** 12-16h

---

**MVP6: A/B Test Runner**
- [ ] Variant selection UI
- [ ] Mock metrics generation (CTR, time-to-insight, engagement)
- [ ] Results dashboard
- [ ] Optional PostHog integration

**Estimation:** 12-16h

---

**EPIC MVP Total:** 80-120h (2-3 weeks)

**Definition of Done:**
- ✅ `pnpm --filter demo-mvp dev` runs without errors
- ✅ Playground renders `dashboard.base.json` and 2 variants without crashes
- ✅ Inspector edits component props without runtime errors
- ✅ Submissions accepts component (from 3 paths) and shows status
- ✅ Governance runs 2-3 checks and shows results
- ✅ Experiments allows A/B comparison and shows metrics
- ✅ ErrorBoundary + "Preview Errors" works (no crash kills entire app)

**After MVP-Demo:**
- If MVP proves stable → Phase Re-integrate (merge modules to core Studio)
- If MVP needs more work → Continue iteration in isolated app

---

### Phase 3: Releases (Ship) + Experiments (Measure) (2-3 weeks)

**Status:** 📋 To be implemented (After Phase MVP-Demo)  
**Priority:** P0 (Strategic)

#### EPIC G: Releases (Versioning + Publishing)

**Goal:** Versioning and publishing workflow.

**Stories:**

**G1: Release Model**
- [ ] Create Release entity
- [ ] Link Release to approved Revision
- [ ] Support semantic versioning

**Files:**
- `packages/studio-core/src/entities/release.ts` (new)
- `apps/demo/app/releases/types.ts` (new)

**Acceptance Criteria:**
- Release links to Revision
- Semantic versioning works
- Releases are immutable

**Estimation:** 4-6h

---

**G2: Release Service**
- [ ] Create release from approved Revision
- [ ] Generate changelog
- [ ] Generate migration notes
- [ ] Detect breaking changes

**Files:**
- `apps/demo/src/lib/releases/release-service.ts` (new)
- `apps/demo/src/lib/releases/changelog-generator.ts` (new)
- `apps/demo/src/lib/releases/migration-generator.ts` (new)

**Acceptance Criteria:**
- Release created from approved Revision
- Changelog generated
- Migration notes generated
- Breaking changes detected

**Estimation:** 12-16h

---

**G3: Publishing Service**
- [ ] Publish to registry
- [ ] Tag in repository (GitHub)
- [ ] Update Library with "stable" status

**Files:**
- `apps/demo/src/lib/releases/publishing-service.ts` (new)
- `apps/demo/app/api/releases/[id]/publish/route.ts` (new)

**Acceptance Criteria:**
- Registry updated
- GitHub tagged
- Library shows stable version

**Estimation:** 8-12h

---

**EPIC G Total:** 24-34h

---

#### EPIC E: Experiments (A/B Testing with PostHog)

**Goal:** True A/B testing infrastructure for generated screens (Submissions) with PostHog integration, enabling variant selection, exposure tracking, conversion measurement, and winner promotion.

**Key Requirements:**
- Experiments map variants (control/test/...) to Submissions via `submissionId`
- PostHog Feature Flags (multivariate) control variant selection
- Exposure tracked automatically via `posthog.getFeatureFlag()` at point of exposure
- Conversion events include experiment context (experiment_key, variant, submission_id, project_id)
- Winner can be promoted to Design System block

**Stories:**

**E1: PostHog Client Integration**
- [ ] Install PostHog SDK (`posthog-js`)
- [ ] Create client initialization module
- [ ] Configure with env vars (`NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST`)
- [ ] Initialize early in app lifecycle (reduce flicker)
- [ ] Bootstrap flags early (client-side only)

**Files:**
- `apps/demo/src/lib/posthog/client.ts` (new)
- `apps/demo/package.json` (update - add posthog-js)
- `.env.local` (add `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST`)
- `apps/demo/app/layout.tsx` (update - initialize PostHog)

**Acceptance Criteria:**
- PostHog initialized in browser only
- Feature flags accessible via `posthog.getFeatureFlag()`
- Events tracked via `posthog.capture()`
- Early initialization prevents flicker

**Estimation:** 4-6h

---

**E2: Experiment Model + Storage**
- [ ] Update Experiment entity: `variantMap` maps `variantKey → submissionId` (not revisionId)
- [ ] Ensure `control` variant always exists (validation)
- [ ] Implement file-based storage (migrate to DB later)
- [ ] Link Experiment to Submissions via `variantMap`

**Files:**
- `packages/studio-core/src/entities/experiment.ts` (update - change variantMap to submissionId)
- `packages/studio-core/src/repositories/file/experiment-repository.ts` (update - already exists)
- `apps/demo/app/experiments/types.ts` (new - client-side types)

**Acceptance Criteria:**
- Experiment model uses `submissionId` in `variantMap`
- Validation ensures `control` variant exists
- Storage works (file-based, can migrate to DB)
- Can query experiments by project, status, slug

**Estimation:** 6-8h

---

**E3: Experiment CRUD API**
- [ ] POST /api/experiments - Create experiment (validate control exists)
- [ ] GET /api/experiments - List experiments (filter by project, status)
- [ ] GET /api/experiments/[id] - Get experiment
- [ ] GET /api/experiments/slug/[slug] - Get experiment by slug (for public route)
- [ ] POST /api/experiments/[id]/start - Start experiment (update status)
- [ ] POST /api/experiments/[id]/stop - Stop experiment (update status)
- [ ] PUT /api/experiments/[id] - Update experiment

**Files:**
- `apps/demo/app/api/experiments/route.ts` (new)
- `apps/demo/app/api/experiments/[id]/route.ts` (new)
- `apps/demo/app/api/experiments/slug/[slug]/route.ts` (new)

**Acceptance Criteria:**
- All CRUD operations work
- API validates `control` variant exists
- API validates `variantMap` references valid Submissions
- Experiments stored correctly
- Can fetch by slug for public route

**Estimation:** 8-12h

---

**E4: Experiment Runtime Components**
- [ ] `useExperimentVariant(flagKey, variantKeys, fallback="control")` hook
  - Returns `{ variant, isReady }`
  - Handles PostHog readiness
  - Fetches variant via `posthog.getFeatureFlag(flagKey)`
  - Falls back to "control" if variant invalid/missing
  - Ensures single exposure per page view (no loops)
- [ ] `ExperimentRunner` component
  - Props: `experiment`, `submissionsByVariant`, `renderMode` ("dsl" | "tsx"), `debug?`
  - Algorithm:
    1. Fetch variant via `useExperimentVariant`
    2. If `!isReady` → show skeleton/loader (prevent flicker)
    3. Select submission: `submissionsByVariant[variant] ?? submissionsByVariant["control"]`
    4. Emit `studio_variant_rendered` event
    5. Render UI (DSL pipeline or sandboxed TSX)
  - Mandatory events:
    - `studio_experiment_viewed` (once per page view, after isReady)
    - `studio_variant_rendered` (when variant rendered)
    - `studio_flag_variant_unavailable` (if variant not in map)
  - Event properties: `experiment_key`, `experiment_slug`, `variant`, `submission_id`, `project_id`, `artifact_hash`
- [ ] `ExperimentContextProvider` component
  - Provides experiment context to children
  - Stores: `experiment_key`, `variant`, `submission_id`, `project_id`, `screen_slug`
  - Used by `captureWithContext` helper

**Files:**
- `apps/demo/src/hooks/use-experiment-variant.ts` (new)
- `apps/demo/src/components/experiments/ExperimentRunner.tsx` (new)
- `apps/demo/src/components/experiments/ExperimentContextProvider.tsx` (new)

**Acceptance Criteria:**
- Hook fetches variant from PostHog correctly
- Hook handles PostHog readiness (isReady state)
- Hook falls back to "control" if variant invalid
- Component renders correct variant (Submission)
- Exposure tracked automatically (via `getFeatureFlag()`)
- No flicker (skeleton shown until variant ready)
- All mandatory events emitted with correct properties
- Context provider works for `captureWithContext`

**Estimation:** 16-20h

---

**E5: Public Experiment Route**
- [ ] Create `/exp/[slug]/page.tsx`
- [ ] Fetch Experiment by slug
- [ ] Fetch Submissions for all variants in `variantMap`
- [ ] Render via `ExperimentRunner` component
- [ ] Support `forceVariant` query param (dev mode only)
- [ ] Support `debug` query param (show variant info)

**Files:**
- `apps/demo/app/exp/[slug]/page.tsx` (new)

**Acceptance Criteria:**
- Public route accessible at `/exp/[slug]`
- Experiment fetched by slug
- Submissions fetched for all variants
- Variant renders correctly (DSL or TSX)
- `forceVariant` works in dev mode
- `debug` mode shows variant info
- Exposure tracked on page view

**Estimation:** 8-10h

---

**E6: Experiment Wizard UI**
- [ ] Create "Experiment Wizard" in Studio
- [ ] Step 1: Basic info (name, slug, posthogFlagKey)
- [ ] Step 2: Select variants from Submissions
  - Map `control` → Submission (required)
  - Map `test`, `test2`, etc. → Submissions (optional)
  - Show preview of each variant
- [ ] Step 3: Configure metrics
  - Set `primaryMetric.event` (e.g., "cta_clicked")
  - Set guardrails (optional)
- [ ] Step 4: Review and create
  - Show public URL: `/exp/[slug]`
  - Link to PostHog (flagKey)
  - CTA: "Start experiment" or "Mark as running"
- [ ] Integration: Add "Experiments" tab in Studio

**Files:**
- `apps/demo/src/components/experiments/ExperimentWizard.tsx` (new)
- `apps/demo/src/components/experiments/VariantSelector.tsx` (new)
- `apps/demo/app/studio/page.tsx` (update - add experiments tab)
- `apps/demo/app/studio/experiments/page.tsx` (new)

**Acceptance Criteria:**
- Wizard creates experiment with all required fields
- Variants selected from Submissions (not Revisions)
- `control` variant required and validated
- PostHog flag key configured
- Primary metric configured
- Public URL generated and displayed
- Link to PostHog works

**Estimation:** 16-20h

---

**E7: Conversion Instrumentation (KPI)**
- [ ] Define standard conversion events:
  - `cta_clicked` (primary CTA)
  - `form_submitted` (form submission)
  - `pricing_plan_selected` (pricing selection)
  - `purchase_completed` (e-commerce, optional)
- [ ] Create `captureWithContext(eventName, props)` helper
  - Automatically appends: `experiment_key`, `variant`, `submission_id`, `project_id`, `screen_slug`
  - Uses `ExperimentContextProvider` for context
- [ ] Update code generator to auto-instrument CTAs
  - When DSL has `action: "primaryCTA"` → add `onClick={() => captureWithContext("cta_clicked", { cta_id, label })}`
  - When DSL has `action: "secondaryCTA"` → add `onClick={() => captureWithContext("cta_clicked", { cta_id, label, type: "secondary" })}`
  - When DSL has form → add `onSubmit={() => captureWithContext("form_submitted", { form_id })}`

**Files:**
- `apps/demo/src/lib/analytics/capture-with-context.ts` (new)
- `apps/demo/src/lib/dsl-codegen.ts` (update - add instrumentation)
- `apps/demo/src/lib/dsl-generator.ts` (update - add action types to DSL)

**Acceptance Criteria:**
- `captureWithContext` appends experiment context automatically
- Generated code includes analytics for CTAs
- Generated code includes analytics for forms
- Events tracked with correct context properties
- Action types (`primaryCTA`, `secondaryCTA`) supported

**Estimation:** 12-16h

---

**E8: Results + Promote Winner**
- [ ] Fetch experiment results from PostHog API
  - Exposure counts per variant
  - Conversion counts per variant
  - Statistical significance
- [ ] Display results in UI
  - Table/graph showing variant performance
  - Primary metric highlighted
  - Guardrails shown (if configured)
- [ ] Promote winner workflow
  - Select winning variant
  - "Promote winner → Block" button
  - Validations run (lint/a11y/tests)
  - Create PR to `packages/blocks` or `packages/ui`
  - Update Submission status

**Files:**
- `apps/demo/app/api/experiments/[id]/results/route.ts` (new)
- `apps/demo/src/components/experiments/ExperimentResults.tsx` (new)
- `apps/demo/app/api/experiments/[id]/promote-winner/route.ts` (new)
- `apps/demo/src/lib/experiments/promote-winner.ts` (new)

**Acceptance Criteria:**
- Results fetched from PostHog (exposure + conversion)
- Results displayed clearly (table/graph)
- Winner can be selected
- "Promote winner" triggers validations
- Validations pass → PR created
- Submission updated with promotion status

**Estimation:** 12-16h

---

**EPIC E Total:** 78-108h (2-2.5 weeks)

---

#### EPIC E: End-to-End Flow & Risk Mitigation

**End-to-End Flow:**

1. **User generates variants in Studio:**
   - User clicks "Generate variants" (e.g., "Create 3 variants of landing page")
   - Copilot generates 3 variants → saved as 3 Submissions
   - Each Submission has unique `id`, `dslJson`, `tsxCode`, `artifactHash`

2. **User creates Experiment:**
   - Opens Experiment Wizard
   - Maps variants: `control → submission A`, `test → submission B`, `test2 → submission C`
   - Configures `posthogFlagKey` (e.g., "exp_landing_black_friday_2025_11")
   - Sets `primaryMetric.event` (e.g., "cta_clicked")
   - Creates Experiment → stored with `variantMap`

3. **User drives traffic to experiment URL:**
   - Public URL: `/exp/[slug]`
   - Campaign, newsletter, or direct link

4. **On user entry (runtime):**
   - Page loads → `ExperimentRunner` mounts
   - `useExperimentVariant` calls `posthog.getFeatureFlag(flagKey)`
   - **Exposure registered automatically** (PostHog sends `$feature_flag_called` event)
   - PostHog returns variant (e.g., "test")
   - Runtime selects Submission: `submissionsByVariant["test"]`
   - Emits `studio_variant_rendered` event
   - Renders Submission UI (DSL → TSX or direct TSX)

5. **User interacts (conversion):**
   - User clicks CTA → `captureWithContext("cta_clicked", { cta_id, label })`
   - Event includes context: `experiment_key`, `variant`, `submission_id`, `project_id`
   - PostHog tracks event (only post-exposure events count)

6. **PostHog shows results:**
   - Exposure counts per variant
   - Conversion counts per variant (only post-exposure)
   - Statistical significance calculated

7. **After completion:**
   - User selects winner in Studio
   - "Promote winner → Block" button
   - Validations run (lint/a11y/tests)
   - PR created to `packages/blocks` or `packages/ui`
   - Winner Submission promoted to Design System

**Risk Mitigation:**

1. **Flicker (user sees variant A, then B):**
   - **Mitigation:** Bootstrap PostHog flags early, use skeleton/loader until `isReady`
   - **Implementation:** `ExperimentRunner` shows skeleton when `!isReady`, only renders variant after PostHog ready

2. **Events without exposure (metrics "don't work"):**
   - **Mitigation:** Ensure `getFeatureFlag()` called at real point of exposure (when variant rendered)
   - **Implementation:** `useExperimentVariant` called in `ExperimentRunner` at mount, not in parent component

3. **Test accounts corrupting results:**
   - **Mitigation:** Enable test account filtering in PostHog
   - **Implementation:** Configure PostHog to filter test accounts from experiment analysis

4. **Multi-device/cookie reset (user sees 2 variants):**
   - **Mitigation:** Use PostHog strategy "Exclude from analysis (recommended)" or "Use first seen variant"
   - **Implementation:** Configure in PostHog Experiment settings

---

**Phase 3 Total:** 102-154h (2-3 weeks)

---

### Phase 4: Library (Reuse) Enhancement (1 week)

**Status:** 📋 To be implemented  
**Priority:** P1 (High)

#### EPIC H: Library Enhancement

**Goal:** Enhanced component/block catalog with dependency awareness.

**Stories:**

**H1: Dependency Graph**
- [ ] Build dependency graph from registry
- [ ] Impact analysis (what breaks if component changes)
- [ ] Import planning

**Files:**
- `apps/demo/src/lib/library/dependency-graph.ts` (new)
- `apps/demo/app/api/library/dependencies/route.ts` (new)

**Acceptance Criteria:**
- Dependency graph built
- Impact analysis works
- Import planning works

**Estimation:** 8-12h

---

**H2: Enhanced Search**
- [ ] Full-text search
- [ ] Filter by type, tags, status
- [ ] Semantic search (optional - embeddings)

**Files:**
- `apps/demo/src/lib/library/search-service.ts` (new)
- `apps/demo/app/api/library/search/route.ts` (new)

**Acceptance Criteria:**
- Search works
- Filters work
- Results relevant

**Estimation:** 8-12h

---

**H3: AI Read API**
- [ ] `get_component_info` endpoint
- [ ] `suggest_component` endpoint
- [ ] `get_tokens` endpoint
- [ ] Examples endpoint

**Files:**
- `apps/demo/app/api/library/ai/component-info/route.ts` (new)
- `apps/demo/app/api/library/ai/suggest/route.ts` (new)
- `apps/demo/app/api/library/ai/tokens/route.ts` (new)

**Acceptance Criteria:**
- All endpoints work
- Data formatted for LLM
- Examples included

**Estimation:** 8-12h

---

**EPIC H Total:** 24-36h

---

**Phase 4 Total:** 24-36h (1 week)

---

## 📊 Summary

| Phase | Epics | Duration | Estimation | Priority |
|-------|-------|----------|------------|----------|
| Phase 0: Core Domain | A | 1 week | 28-40h | P0 |
| Phase 1: Studio | B, C, I, J, K | 6-8 weeks | 410-542h | P0 |
| Phase 2: Submissions + Governance | D, F | 2 weeks | 60-86h | P0 |
| **Phase MVP-Demo** | **MVP** | **2-3 weeks** | **80-120h** | **P0** |
| Phase 3: Releases + Experiments | G, E | 2-3 weeks | 102-154h | P0 |
| Phase 4: Library | H | 1 week | 24-36h | P1 |
| **Phase DS-Public: Adoption Pack** | **R, S, T, U** | **4-6 weeks** | **208-272h** | **P0** |
| Phase 5: Context Engine | L | 4-6 weeks | 340-460h | P0 |
| Phase DS: Design System Maturity | M, N, O, P, Q | 4-6 weeks | 236-322h | P0 |
| **Total** | **21 Epics** | **26-34 weeks** | **1488-1972h** | |

**Notes:**
- **Phase MVP-Demo** is new strategic phase for safe isolation of experimental features
- Phase MVP-Demo should be implemented after Copilot Stabilization (Phase 1 completion)
- **Phase DS-Public** is critical for external adoption and can be implemented in parallel with Phase DS
- Phase 3 (Releases + Experiments) should be implemented after Phase MVP-Demo (if MVP proves stable)
- Phase DS (Design System Maturity) can be implemented in parallel with Phase DS-Public
- Level 1-2 (EPIC M, N) can start immediately
- Level 3-4 (EPIC O, P) depend on Level 1-2 completion
- Level 5 (EPIC Q) requires completing Levels 1-4 first

---

## 🎯 Implementation Iterations

### Iteration 1: Foundation + Complex Screens (3-4 weeks)

**Goal:** Enable complex screen generation, patch workflow, and Figma integration.

**Epics:**
- EPIC A: Core Domain (1 week)
- EPIC B: Complex Screens (1 week)
- EPIC C: Patch Workflow (1 week)
- EPIC I: Figma Plugin (1 week, can be parallel with C)

**Deliverables:**
- Core domain model
- Complex screen generation
- Conversational editing
- Figma Plugin (PoC)

---

### Iteration 2: Review + Governance (2 weeks)

**Goal:** Quality gates and policy enforcement.

**Epics:**
- EPIC D: Submissions (1 week)
- EPIC F: Governance (1 week)

**Deliverables:**
- Submissions workflow
- Policy enforcement
- Review interface

---

### Iteration 3: Ship + Measure + Abstract UI Model (3-4 weeks)

**Goal:** Publishing, A/B testing, and abstract UI model integration.

**Epics:**
- EPIC G: Releases (1 week)
- EPIC E: Experiments (1-2 weeks)
- EPIC J: Abstract UI Model Integration (2-3 weeks, can be parallel with G/E)

**Deliverables:**
- Release workflow
- A/B testing infrastructure
- PostHog integration
- Abstract Node-based DSL model
- Node-to-Fragment-UI adapter

---

### Iteration 4: Reuse Enhancement (1 week)

**Goal:** Enhanced library with dependencies.

**Epics:**
- EPIC H: Library Enhancement (1 week)

**Deliverables:**
- Dependency graph
- Enhanced search
- AI Read API

---

### Iteration 5: Design System Maturity - Foundation (Level 1-2) (2-3 weeks)

**Goal:** Complete UI Kit foundation and Design Library capabilities.

**Epics:**
- EPIC M: Level 1 - UI Kit Foundation (1-1.5 weeks)
- EPIC N: Level 2 - Design Library (1-1.5 weeks)

**Deliverables:**
- ✅ Structured token files (colors, spacing, typography, elevation)
- ✅ Complete UI-native components with full prop support
- ✅ Styleguide DSL instances
- ✅ PreviewLayout component
- ✅ Component registry with status/version
- ✅ UX patterns documentation
- ✅ Telemetry integration for Studio
- ✅ UX guidelines documentation

**Acceptance Criteria:**
- All tokens structured and validated
- All UI-native components have full prop support
- Styleguide displays all component variants
- Component registry tracks status and versions
- UX patterns documented with examples
- Telemetry tracks Studio actions
- Guidelines comprehensive and usable

**Estimation:** 86-116h (2-3 weeks)

**Notes:**
- Can be implemented in parallel with Iterations 2-4
- Foundation for all subsequent maturity levels

---

### Iteration 6: Design System Maturity - Integration (Level 3-4) (2-3 weeks)

**Goal:** Integrated design system with automation and scaling capabilities.

**Epics:**
- EPIC O: Level 3 - Design System (1-1.5 weeks)
- EPIC P: Level 4 - Scaled System (1-1.5 weeks)

**Deliverables:**
- ✅ Intent engine with prompt mapping
- ✅ Design system glossary
- ✅ Automated changelog generation
- ✅ ARIA and accessibility in DSL
- ✅ DSL linter
- ✅ Snapshot tests for components
- ✅ Semantic versioning for packages
- ✅ Component contribution template
- ✅ Context configuration system

**Acceptance Criteria:**
- Intent engine correctly maps prompts to patterns
- Glossary defines all key terms
- Changelog generated automatically from registry changes
- All interactive components have ARIA attributes
- DSL linter validates syntax and references
- Snapshot tests cover major components
- Versioning follows semver
- Contribution template generates valid components
- Context affects DSL generation

**Estimation:** 84-116h (2-3 weeks)

**Notes:**
- Requires Iteration 5 (Level 1-2) completion
- Enables automated quality gates and scaling

---

### Iteration 7: Design System Maturity - Public (Level 5) (1.5-2 weeks)

**Goal:** Public design system with community, open source, and AI-native capabilities.

**Epics:**
- EPIC Q: Level 5 - Public Design System (1.5-2 weeks)

**Deliverables:**
- ✅ Open source foundation (LICENSE, CONTRIBUTING, CODE_OF_CONDUCT)
- ✅ Versioned documentation
- ✅ Public playground
- ✅ Community infrastructure
- ✅ AI-native MCP agent
- ✅ Certification system
- ✅ Public roadmap

**Acceptance Criteria:**
- License and contribution guides present
- Documentation versioned and accessible
- Playground works standalone with sharing
- Community channels active
- MCP agent correctly parses intent and generates DSL
- Certification system validates competency
- Roadmap public with milestone tracking

**Estimation:** 68-90h (1.5-2 weeks)

**Notes:**
- Requires Iterations 5-6 (Level 1-4) completion
- Transforms Fragment UI into public, community-driven design system

---

## 🎨 Design System Maturity Model Integration

This section integrates requirements from the Design System Maturity Model (Levels 1-5) into the development plan, ensuring Fragment UI Studio achieves full design system maturity.

---

### Phase DS-Public: Public Design System Adoption Pack 🆕

**Status:** 📋 To be implemented  
**Priority:** P0 (Critical - Enables external adoption)  
**Estimated Duration:** 4-6 weeks (4 sprints)

**Goal:** Transform Fragment UI into a genuinely useful, installable Design System for external users by providing:
- Curated **Blocks library** (20-30 composable compositions)
- **Screen Templates** (6-10 full pages)
- **Example Apps** (2 working applications)
- Enhanced **Documentation** (blocks, templates, quickstart)
- **Registry & Install Experience** (copy-paste ready)

**Strategic Value:**
- Enables real-world adoption by external teams
- Provides "shortest path to value" (blocks > components)
- Demonstrates system maturity and completeness
- Creates proof-of-usability through example apps

**See:** `docs/copilot/BLOCKS_AND_TEMPLATES_IMPLEMENTATION_PLAN.md` for detailed implementation guide.

#### EPIC R: Blocks Library Expansion

**Goal:** Expand from ~20 existing blocks to 30+ production-ready blocks organized by category.

**Stories:**

**R1: Navigation & Shell Blocks**
- [ ] Implement `AppShell` (sidebar + header + content)
- [ ] Implement `TopNav` (header only)
- [ ] Implement `BreadcrumbHeader` (title + breadcrumbs + actions)
- [ ] Adapt existing `navigation-header` to match new patterns

**Estimation:** 12-16h

**R2: Dashboard & Analytics Blocks**
- [ ] Implement `KpiStrip` (standalone, reusable)
- [ ] Implement `ChartCard` (header + chart area + legend slot)
- [ ] Implement `InsightListCard` (insights list)
- [ ] Enhance existing `kpi-dashboard` and `analytics-dashboard`

**Estimation:** 16-20h

**R3: Enterprise Data Table Blocks**
- [ ] Implement `DataTableToolbar` (search + filters + column view + export)
- [ ] Implement `BulkActionsBar` (selected rows actions)
- [ ] Implement `PaginationFooter` (standalone)
- [ ] Enhance existing `data-table` with TanStack Table integration

**Estimation:** 20-24h

**R4: Forms & Settings Blocks**
- [ ] Implement `SettingsSection` (section headline + description + content)
- [ ] Implement `ProfileForm` (fields + save)
- [ ] Implement `BillingForm` (plan + invoice + payment)
- [ ] Implement `InlineValidationSummary`

**Estimation:** 16-20h

**R5: Auth Blocks**
- [ ] Implement `LoginFormBlock` (separate from authentication-block)
- [ ] Implement `SignupFormBlock`
- [ ] Implement `OtpVerifyBlock`
- [ ] Implement `PasswordResetBlock`

**Estimation:** 12-16h

**R6: Commerce & Feedback Blocks**
- [ ] Implement `ProductCard`
- [ ] Implement `ProductGrid`
- [ ] Implement `CartSummary`
- [ ] Implement `CheckoutStepper`
- [ ] Implement `NotificationBanner`
- [ ] Implement `ErrorState`
- [ ] Implement `LoadingSkeletonPanel`

**Estimation:** 16-20h

**EPIC R Total:** 92-120h (2-3 weeks)

---

#### EPIC S: Screen Templates

**Goal:** Create 6-10 full-page templates that demonstrate real-world usage patterns.

**Stories:**

**S1: Core Templates (P0)**
- [ ] Implement `DashboardTemplate` (analytics overview)
- [ ] Implement `UsersListTemplate` (table + filters + detail drawer)
- [ ] Implement `UserDetailTemplate` (profile + activity + permissions)
- [ ] Implement `SettingsTemplate` (profile + security + billing sections)
- [ ] Implement `AuthLoginTemplate`
- [ ] Implement `BillingTemplate` (plans + invoices)

**Estimation:** 24-32h

**S2: Extended Templates (P1)**
- [ ] Implement `OnboardingTemplate` (empty states + checklist)
- [ ] Implement `ErrorPagesTemplate` (403/404/500)
- [ ] Implement `EcommerceAdminTemplate` (orders + products + analytics)
- [ ] Implement `PricingTemplate` (B2B SaaS pricing)

**Estimation:** 16-20h

**EPIC S Total:** 40-52h (1 week)

---

#### EPIC T: Example Apps

**Goal:** Create 2 working example applications that demonstrate real-world usage.

**Stories:**

**T1: SaaS Admin Example App**
- [ ] Create `examples/saas-admin/` structure
- [ ] Implement `/dashboard` page
- [ ] Implement `/users` page (list + filters)
- [ ] Implement `/users/[id]` page (detail view)
- [ ] Implement `/settings` page
- [ ] Add README with setup instructions

**Estimation:** 16-20h

**T2: E-commerce Admin Example App**
- [ ] Create `examples/ecommerce-admin/` structure
- [ ] Implement `/overview` page
- [ ] Implement `/orders` page
- [ ] Implement `/products` page
- [ ] Implement `/catalog/[id]` page
- [ ] Add README with setup instructions

**Estimation:** 16-20h

**EPIC T Total:** 32-40h (1 week)

---

#### EPIC U: Documentation & Registry Enhancement

**Goal:** Enhance documentation and registry to support blocks and templates.

**Stories:**

**U1: Blocks Documentation**
- [ ] Add `/blocks` index page in `apps/www`
- [ ] Create documentation page for each P0 block
- [ ] Include: What it is, Install/use snippet, Props summary, 2 examples, A11y notes

**Estimation:** 16-20h

**U2: Templates Documentation**
- [ ] Add `/templates` index page in `apps/www`
- [ ] Create documentation page for each template
- [ ] Include: Use case, Required blocks, Customization instructions, Data wiring points

**Estimation:** 12-16h

**U3: Registry Enhancement**
- [ ] Update registry to include blocks and templates
- [ ] Add copy-paste install snippets
- [ ] Create public `registry.json` with blocks/templates entrypoints

**Estimation:** 8-12h

**U4: Quickstart Guide**
- [ ] Update root README with 10-minute quickstart
- [ ] Add "Getting Started" section for blocks/templates
- [ ] Create example app setup guides

**Estimation:** 8-12h

**EPIC U Total:** 44-60h (1-1.5 weeks)

---

**Phase DS-Public Total:** 208-272h (4-6 weeks)

**Notes:**
- Can be implemented in parallel with Phase DS (Design System Maturity)
- Focuses on external adoption and usability
- Studio/Playground remains internal/experimental
- All public packages must be publishable and stable

---

### Phase DS: Design System Maturity (Level 1-5)

**Status:** 📋 To be implemented  
**Priority:** P0 (Foundation for all modules)  
**Estimated Duration:** 4-6 weeks

---

#### EPIC M: Level 1 - UI Kit Foundation

**Goal:** Complete UI Kit foundation with tokens, components, and styleguide.

**Stories:**

**L1: Token Structure Enhancement**
- [ ] Create structured token files in `packages/tokens/src/`:
  - `colors.json` (structured color palette)
  - `spacing.json` (spacing scale)
  - `typography.json` (font families, sizes, weights)
  - `elevation.json` (shadows, z-index)
- [ ] Ensure all tokens follow DTCG format
- [ ] Add token validation script

**Files:**
- `packages/tokens/src/colors.json` (update)
- `packages/tokens/src/spacing.json` (new)
- `packages/tokens/src/typography.json` (new)
- `packages/tokens/src/elevation.json` (new)
- `packages/tokens/scripts/validate.ts` (new)

**Acceptance Criteria:**
- All token categories defined and structured
- Tokens follow consistent naming convention
- Validation script catches errors

**Estimation:** 8-12h

---

**L2: UI-Native Component Completion**
- [ ] Complete `packages/ui-native` implementations:
  - Button (all variants: primary, secondary, outline, ghost, link)
  - Input (text, email, password, number)
  - Select (single, multi, searchable)
  - Card (default, elevated, outlined)
  - Modal (with backdrop, scrollable, fullscreen variants)
- [ ] Full prop parameterization for all components
- [ ] TypeScript types for all props

**Files:**
- `packages/ui-native/src/components/button.tsx` (update)
- `packages/ui-native/src/components/input.tsx` (update)
- `packages/ui-native/src/components/select.tsx` (update)
- `packages/ui-native/src/components/card.tsx` (update)
- `packages/ui-native/src/components/modal.tsx` (update)

**Acceptance Criteria:**
- All components have full prop support
- All variants implemented
- TypeScript types complete

**Estimation:** 16-20h

---

**L3: Styleguide DSL Instances**
- [ ] Create `dsl/styleguide.dsl.json` with component instances:
  - All Button variants
  - All Input variants
  - All Select variants
  - All Card variants
  - All Modal variants
- [ ] Each instance demonstrates different prop combinations

**Files:**
- `apps/demo/src/lib/dsl/styleguide.dsl.json` (new)

**Acceptance Criteria:**
- All component variants represented
- DSL instances are valid and renderable
- Can be used for documentation generation

**Estimation:** 8-12h

---

**L4: PreviewLayout Component**
- [ ] Create `PreviewLayout.tsx` component for token/DSL preview
- [ ] Display all tokens (colors, spacing, typography, elevation)
- [ ] Display UI DSL component instances
- [ ] Interactive token picker
- [ ] Export to DSL functionality

**Files:**
- `apps/demo/src/components/preview/PreviewLayout.tsx` (new)
- `apps/demo/app/preview/page.tsx` (new)

**Acceptance Criteria:**
- All tokens displayed visually
- Component instances render correctly
- Interactive features work
- Can export previews to DSL

**Estimation:** 12-16h

---

**EPIC M Total:** 44-60h (1-1.5 weeks)

---

#### EPIC N: Level 2 - Design Library

**Goal:** Wzorce UX, rejestr komponentów, telemetria i zasady użycia.

**Stories:**

**M1: Component Registry Enhancement**
- [ ] Create `registry/components.json` with status and version:
  ```json
  {
    "Button": { "status": "stable", "version": "1.0.0" },
    "Input": { "status": "beta", "version": "0.9.1" }
  }
  ```
- [ ] Add status field: `stable`, `beta`, `alpha`, `deprecated`
- [ ] Add version tracking per component
- [ ] Create registry update script

**Files:**
- `packages/registry/components.json` (new)
- `packages/registry/scripts/update-status.ts` (new)

**Acceptance Criteria:**
- All components have status and version
- Registry can be queried by status
- Version history tracked

**Estimation:** 6-8h

---

**M2: UX Patterns Documentation**
- [ ] Create `docs/patterns/` directory structure
- [ ] Each pattern folder contains:
  - `example.dsl.json` (DSL instance)
  - `README.md` (description, when to use, examples)
  - `preview.png` (visual example)
- [ ] Create initial patterns:
  - Form patterns (validation, multi-step, inline)
  - Navigation patterns (sidebar, top nav, breadcrumbs)
  - Data display patterns (tables, cards, lists)
  - Feedback patterns (toast, modal, inline)

**Files:**
- `docs/patterns/forms/README.md` (new)
- `docs/patterns/forms/example.dsl.json` (new)
- `docs/patterns/navigation/README.md` (new)
- `docs/patterns/navigation/example.dsl.json` (new)
- `docs/patterns/data-display/README.md` (new)
- `docs/patterns/data-display/example.dsl.json` (new)
- `docs/patterns/feedback/README.md` (new)
- `docs/patterns/feedback/example.dsl.json` (new)

**Acceptance Criteria:**
- All pattern folders structured correctly
- DSL examples render correctly
- Documentation is comprehensive
- Preview images included

**Estimation:** 16-20h

---

**M3: Telemetry Integration for Studio**
- [ ] Enhance `packages/telemetry/` with Studio-specific events:
  - Component usage tracking (which components inserted)
  - Pattern usage tracking (which patterns used)
  - DSL generation events
  - Patch application events
- [ ] Add telemetry to Studio UI:
  - `studio-core/telemetry.ts` module
  - Log events: `{ component: "Card", event: "inserted", userId: "abc" }`

**Files:**
- `packages/studio-core/src/telemetry.ts` (new)
- `apps/demo/src/lib/studio/telemetry.ts` (new)

**Acceptance Criteria:**
- All Studio actions tracked
- Events include context (component, user, session)
- Telemetry can be disabled for privacy

**Estimation:** 8-12h

---

**M4: UX Guidelines Documentation**
- [ ] Create `docs/guidelines.md` with:
  - When to use each component
  - Common UX mistakes and how to avoid them
  - Design principles
  - Accessibility guidelines
  - Performance considerations
- [ ] Create component-specific guidelines:
  - `docs/guidelines/buttons.md`
  - `docs/guidelines/forms.md`
  - `docs/guidelines/navigation.md`

**Files:**
- `docs/guidelines.md` (new)
- `docs/guidelines/buttons.md` (new)
- `docs/guidelines/forms.md` (new)
- `docs/guidelines/navigation.md` (new)

**Acceptance Criteria:**
- Guidelines cover all major components
- Examples of correct and incorrect usage
- Clear decision trees

**Estimation:** 12-16h

---

**EPIC N Total:** 42-56h (1-1.5 weeks)

---

#### EPIC O: Level 3 - Design System

**Goal:** Zintegrowany system design/code/content z semantyką i intent engine.

**Stories:**

**N1: Intent Engine with Prompt Mapping**
- [ ] Create `studio-core/intent-engine.ts`:
  - Map prompt → pattern (PromptMap)
  - Intent detection from natural language
  - Pattern suggestion based on intent
- [ ] Create prompt templates library
- [ ] Integrate with Studio chat

**Files:**
- `packages/studio-core/src/intent-engine.ts` (new)
- `packages/studio-core/src/prompts/prompt-map.ts` (new)
- `packages/studio-core/src/prompts/templates.ts` (new)

**Acceptance Criteria:**
- Prompts correctly mapped to patterns
- Intent detection accurate
- Can suggest patterns from prompts

**Estimation:** 16-20h

---

**N2: Design System Glossary**
- [ ] Create `docs/glossary.md` with definitions:
  - `variant` (component variant)
  - `slot` (component slot)
  - `dsl-tag` (DSL element tag)
  - `context` (UI context: form, modal, etc.)
  - `token` (design token)
  - `pattern` (UX pattern)
- [ ] Add cross-references between terms
- [ ] Include examples for each term

**Files:**
- `docs/glossary.md` (new)

**Acceptance Criteria:**
- All key terms defined
- Examples provided
- Cross-references work

**Estimation:** 6-8h

---

**N3: Automated Changelog Generation**
- [ ] Create `scripts/generate-changelog.ts`:
  - Analyzes changes in registry
  - Detects component status changes
  - Detects version bumps
  - Generates `CHANGELOG.md` entries
- [ ] Integrate with CI/CD pipeline
- [ ] Support semantic versioning

**Files:**
- `scripts/generate-changelog.ts` (new)
- `.github/workflows/changelog.yml` (new)

**Acceptance Criteria:**
- Changelog generated automatically
- Format follows conventional commits
- CI/CD integration works

**Estimation:** 8-12h

---

**N4: ARIA and Accessibility in DSL**
- [ ] Add ARIA attributes support to UI-DSL:
  - `aria-label`, `aria-labelledby`, `aria-describedby`
  - `role` attribute
  - `aria-*` attributes for all interactive components
- [ ] Auto-generate ARIA attributes where possible
- [ ] Validate ARIA in DSL schema

**Files:**
- `packages/ui-dsl/src/types-v2.ts` (update - add ARIA fields)
- `packages/ui-dsl/src/validation/aria.ts` (new)

**Acceptance Criteria:**
- All interactive components have ARIA
- Auto-generation works
- Validation catches missing ARIA

**Estimation:** 12-16h

---

**EPIC O Total:** 42-56h (1-1.5 weeks)

---

#### EPIC P: Level 4 - Scaled System

**Goal:** Automatyzacja, CI/CD, wersjonowanie i kontrybucje.

**Stories:**

**O1: DSL Linter**
- [ ] Create `tools/lint-dsl.ts`:
  - Validate required keys in DSL
  - Check DSL syntax errors
  - Validate component references
  - Check token references
- [ ] Add CLI command: `pnpm lint:dsl`
- [ ] Integrate with CI/CD

**Files:**
- `tools/lint-dsl.ts` (new)
- `scripts/lint-dsl.sh` (new)

**Acceptance Criteria:**
- DSL linter catches all syntax errors
- Validates component references
- Can run as CLI and in CI/CD

**Estimation:** 12-16h

---

**O2: Snapshot Tests for Components**
- [ ] Add snapshot tests to component test suite:
  - `Button.test.tsx` (snapshot)
  - `Card.test.tsx` (snapshot)
  - `Modal.test.tsx` (snapshot)
- [ ] Use Vitest snapshot feature
- [ ] Update snapshots on intentional changes

**Files:**
- `packages/ui/src/components/button/button.test.tsx` (update)
- `packages/ui/src/components/card/card.test.tsx` (update)
- `packages/ui/src/components/modal/modal.test.tsx` (update)

**Acceptance Criteria:**
- Snapshot tests for all major components
- Snapshots updated on changes
- Tests run in CI/CD

**Estimation:** 8-12h

---

**O3: Semantic Versioning for Packages**
- [ ] Create `release.config.js` with semver configuration:
  - `packages/ui-native/` versioning
  - `packages/blocks/` versioning
- [ ] Set up automated version bumping
- [ ] Create release workflow

**Files:**
- `release.config.js` (new)
- `scripts/release.ts` (new)
- `.github/workflows/release.yml` (new)

**Acceptance Criteria:**
- Versioning follows semver
- Automated version bumps work
- Release workflow creates tags

**Estimation:** 8-12h

---

**O4: Component Contribution Template**
- [ ] Create `contrib/component.template.ts`:
  - Component structure template
  - DSL metadata template
  - Styles template
  - Test template
- [ ] Create contribution guide

**Files:**
- `contrib/component.template.ts` (new)
- `contrib/COMPONENT_GUIDE.md` (new)

**Acceptance Criteria:**
- Template includes all required files
- Guide is comprehensive
- Template generates valid components

**Estimation:** 6-8h

---

**O5: Context Configuration System**
- [ ] Create `contexts/context.json`:
  ```json
  {
    "productId": "admin-dashboard",
    "locale": "en-US",
    "theme": "dark"
  }
  ```
- [ ] Support context-based DSL generation
- [ ] Context-aware component selection

**Files:**
- `apps/demo/src/lib/contexts/context.json` (new)
- `apps/demo/src/lib/contexts/context-loader.ts` (new)

**Acceptance Criteria:**
- Context affects DSL generation
- Can switch contexts
- Context persists

**Estimation:** 8-12h

---

**EPIC P Total:** 42-60h (1-1.5 weeks)

---

#### EPIC Q: Level 5 - Public Design System

**Goal:** Fragment UI jako open-source, społeczność, MCP, AI-native.

**Stories:**

**P1: Open Source Foundation**
- [ ] Create `LICENSE` file (MIT)
- [ ] Create `CONTRIBUTING.md` guide
- [ ] Create `CODE_OF_CONDUCT.md`
- [ ] Set up public repository structure

**Files:**
- `LICENSE` (new)
- `CONTRIBUTING.md` (new)
- `CODE_OF_CONDUCT.md` (new)

**Acceptance Criteria:**
- License file present
- Contribution guide comprehensive
- Code of conduct included

**Estimation:** 4-6h

---

**P2: Versioned Documentation**
- [ ] Create versioned documentation structure:
  - `docs/v1/` (v1.x documentation)
  - `docs/v2/` (v2.x documentation)
  - `docs/latest/` (latest version)
- [ ] Set up documentation versioning system
- [ ] Add version switcher to documentation site

**Files:**
- `docs/v1/` (new directory structure)
- `docs/v2/` (new directory structure)
- `docs/latest/` (symlink or copy)
- `apps/www/src/components/VersionSwitcher.tsx` (new)

**Acceptance Criteria:**
- Documentation versioned correctly
- Version switcher works
- Old versions accessible

**Estimation:** 12-16h

---

**P3: Public Playground**
- [ ] Create `playground/` directory with standalone playground:
  - DSL editor
  - Live preview
  - Component picker
  - Token explorer
- [ ] Deploy to public URL
- [ ] Add sharing functionality

**Files:**
- `playground/playground.tsx` (new)
- `playground/package.json` (new)
- `playground/README.md` (new)

**Acceptance Criteria:**
- Playground works standalone
- Can edit DSL and see preview
- Can share playground links

**Estimation:** 16-20h

---

**P4: Community Infrastructure**
- [ ] Create `community.md`:
  - Links to Discord/Slack
  - Blog link
  - Repository links
  - Contributor list
- [ ] Set up community channels
- [ ] Create contributor recognition system

**Files:**
- `community.md` (new)
- `CONTRIBUTORS.md` (new)

**Acceptance Criteria:**
- Community links present
- Contributor list maintained
- Channels active

**Estimation:** 4-6h

---

**P5: AI-Native MCP Agent**
- [ ] Create `copilot-agent.ts` with MCP-style intent → UI DSL generation:
  - Intent parsing
  - Component selection
  - DSL generation
  - Code generation
- [ ] Integrate with existing MCP server
- [ ] Add AI-specific optimizations

**Files:**
- `packages/mcp-server/src/copilot-agent.ts` (new)
- `packages/mcp-server/src/intent-parser.ts` (new)

**Acceptance Criteria:**
- Intent correctly parsed
- DSL generation works
- Integrates with MCP server

**Estimation:** 16-20h

---

**P6: Certification System**
- [ ] Create `examples/certification/`:
  - Quiz system
  - Badge system
  - Competency tests for DSL
- [ ] Create certification levels
- [ ] Issue certificates

**Files:**
- `examples/certification/quiz.ts` (new)
- `examples/certification/badges.ts` (new)
- `examples/certification/tests.ts` (new)

**Acceptance Criteria:**
- Quiz system works
- Badges awarded
- Tests validate competency

**Estimation:** 12-16h

---

**P7: Public Roadmap**
- [ ] Create `roadmap.md` with milestones
- [ ] Set up public milestone tracker (GitHub Projects)
- [ ] Add voting system for features

**Files:**
- `roadmap.md` (new - public version)
- `.github/ISSUE_TEMPLATE/feature_request.md` (new)

**Acceptance Criteria:**
- Roadmap public and accessible
- Milestones tracked
- Community can vote

**Estimation:** 4-6h

---

**EPIC Q Total:** 68-90h (1.5-2 weeks)

---

**Phase DS Total:** 236-322h (4-6 weeks)

**Notes:**
- This phase can be implemented in parallel with other phases
- Some epics can start immediately (Level 1-2)
- Level 5 requires completing Levels 1-4 first
- Each level builds on the previous one

---

### Phase 5: Context Engine (AI-Native Layer) (4-6 weeks)

**Status:** 📋 To be implemented  
**Priority:** P0 (Strategic - Transforms Studio to AI-native)  
**Estimated Duration:** 4-6 weeks

#### EPIC L: Context Engine Implementation

**Goal:** Implement multi-agent Context Engine that transforms Fragment UI Studio from prompt-based to context-driven, goal-oriented UI generation system.

**Strategic Value:**
- Enables semantic blueprint matching (intent → UI pattern)
- Implements multi-agent architecture (Planner, Executor, Validator, Tracer)
- Builds context-aware UI generation with vector embeddings
- Provides full transparency via execution traces
- Enables independent development as separate AI layer

**See:** [CONTEXT_ENGINE_STRATEGY.md](./CONTEXT_ENGINE_STRATEGY.md) for detailed strategy

**Stories:**

**L1: Context Engine Foundation**
- [ ] Create `fragment-context-engine/` project structure
- [ ] Implement Context Engine orchestrator (`context-engine.ts`)
- [ ] Set up agent registry and capability system
- [ ] Implement basic execution trace system
- [ ] Create agent communication protocol (MCP-based)

**Files:**
- `fragment-context-engine/context-engine.ts` (new)
- `fragment-context-engine/agents/registry.ts` (new)
- `fragment-context-engine/memory/execution-trace.ts` (new)

**Acceptance Criteria:**
- Context Engine can initialize and coordinate agents
- Agent registry tracks available agents and capabilities
- Execution traces record all agent actions
- MCP protocol enables agent communication

**Estimation:** 40-60h

---

**L2: Intent Resolver (Context Librarian)**
- [ ] Implement intent detection from natural language
- [ ] Set up vector embedding system (OpenAI/ChromaDB)
- [ ] Create Context Library with blueprint storage
- [ ] Implement blueprint matching using cosine similarity
- [ ] Add confidence scoring and threshold logic

**Files:**
- `fragment-context-engine/agents/intent-resolver.ts` (new)
- `fragment-context-engine/embeddings/embedder.ts` (new)
- `fragment-context-engine/embeddings/similarity.ts` (new)
- `fragment-context-engine/context-library/` (new directory)
- `fragment-context-engine/context-library/blueprints/` (new directory)

**Acceptance Criteria:**
- Intent correctly parsed from user input
- Blueprints stored in vector database
- Matching accuracy > 70% for common intents
- Confidence scores provided with matches

**Estimation:** 60-80h

---

**L3: Planner & Executor Agents**
- [ ] Implement Planner agent (goal → plan generation)
- [ ] Implement Executor agent (plan → execution dispatch)
- [ ] Create plan structure (steps, dependencies, priorities)
- [ ] Implement agent task assignment logic
- [ ] Add error handling and fallback mechanisms

**Files:**
- `fragment-context-engine/agents/planner.ts` (new)
- `fragment-context-engine/agents/executor.ts` (new)
- `fragment-context-engine/types/plan.ts` (new)

**Acceptance Criteria:**
- Planner generates valid multi-step plans
- Executor dispatches tasks to correct agents
- Dependencies handled correctly
- Error recovery works

**Estimation:** 60-80h

---

**L4: UI Generator (Writer) Agent**
- [ ] Implement blueprint instruction parser
- [ ] Create code generation from blueprints
- [ ] Support both JSX/TSX and DSL output formats
- [ ] Apply style constraints from blueprints
- [ ] Integrate with Fragment UI component system

**Files:**
- `fragment-context-engine/agents/ui-generator.ts` (new)
- `fragment-context-engine/agents/blueprint-parser.ts` (new)
- `fragment-context-engine/generators/code-generator.ts` (new)
- `fragment-context-engine/generators/dsl-generator.ts` (new)

**Acceptance Criteria:**
- Blueprints correctly parsed and applied
- Generated code follows blueprint constraints
- Both JSX and DSL formats supported
- Fragment UI components used correctly

**Estimation:** 60-80h

---

**L5: Knowledge Store & Data Retriever**
- [ ] Set up vector database (ChromaDB/Pinecone)
- [ ] Implement Knowledge Store (factual data storage)
- [ ] Create Data Retriever agent (API/component docs)
- [ ] Add semantic search for technical information
- [ ] Populate initial knowledge base

**Files:**
- `fragment-context-engine/knowledge-store/` (new directory)
- `fragment-context-engine/agents/data-fetcher.ts` (new)
- `fragment-context-engine/services/chroma.ts` (new)
- `fragment-context-engine/knowledge-store/api-specs/` (new)
- `fragment-context-engine/knowledge-store/component-docs/` (new)

**Acceptance Criteria:**
- Vector database operational
- Knowledge Store contains component docs and API specs
- Data Retriever can find relevant information
- Semantic search returns accurate results

**Estimation:** 40-60h

---

**L6: Validator Agent**
- [ ] Implement WCAG accessibility validation
- [ ] Add style consistency checks
- [ ] Create code quality validators
- [ ] Implement requirement compliance checking
- [ ] Generate improvement suggestions

**Files:**
- `fragment-context-engine/agents/validator.ts` (new)
- `fragment-context-engine/validators/a11y-validator.ts` (new)
- `fragment-context-engine/validators/style-validator.ts` (new)
- `fragment-context-engine/validators/code-validator.ts` (new)

**Acceptance Criteria:**
- Validator checks all required criteria
- WCAG AA compliance verified
- Suggestions provided for violations
- Validation results structured and actionable

**Estimation:** 40-60h

---

**L7: MVP Blueprints & Examples**
- [ ] Create 5-10 initial blueprints (login form, dashboard, data table, etc.)
- [ ] Implement example test cases
- [ ] Create blueprint documentation
- [ ] Add blueprint validation

**Files:**
- `fragment-context-engine/context-library/blueprints/login-form.json` (new)
- `fragment-context-engine/context-library/blueprints/dashboard.json` (new)
- `fragment-context-engine/context-library/blueprints/data-table.json` (new)
- `fragment-context-engine/examples/` (new directory)

**Acceptance Criteria:**
- Blueprints cover common UI patterns
- All blueprints valid and testable
- Examples demonstrate Context Engine capabilities
- Documentation clear and comprehensive

**Estimation:** 40-60h

---

**EPIC L Total:** 340-460h (4-6 weeks)

**Notes:**
- This epic transforms Fragment UI Studio into AI-native platform
- Can be developed as separate module/package
- Integrates with Studio via API
- Foundation for future AI enhancements

---

## 🚨 Risk Log

### Top 5 Risks

1. **Risk: PostHog Integration Complexity**
   - **Impact:** High
   - **Probability:** Medium
   - **Mitigation:** Start with basic feature flags, add experiments incrementally
   - **Owner:** TBD

2. **Risk: Patch Conflict Resolution**
   - **Impact:** High
   - **Probability:** Medium
   - **Mitigation:** Implement conflict detection, manual resolution UI
   - **Owner:** TBD

3. **Risk: Performance with Complex Screens**
   - **Impact:** Medium
   - **Probability:** High
   - **Mitigation:** Code splitting, lazy loading, preview optimization
   - **Owner:** TBD

4. **Risk: Governance Policy Complexity**
   - **Impact:** Medium
   - **Probability:** Medium
   - **Mitigation:** Start with core policies, expand incrementally
   - **Owner:** TBD

5. **Risk: Migration from Current Structure**
   - **Impact:** High
   - **Probability:** Low
   - **Mitigation:** Gradual migration, backward compatibility layer
   - **Owner:** TBD

---

## 📝 Acceptance Criteria Template

For each Epic/Story, acceptance criteria should include:

1. **Functional:** What the feature does
2. **Technical:** Code quality, tests, documentation
3. **Integration:** How it integrates with other modules
4. **Performance:** Response times, bundle size
5. **Accessibility:** A11y compliance

---

## 🔗 Related Documents

- [STUDIO_DOMAIN_MODEL.md](../architecture/STUDIO_DOMAIN_MODEL.md) - Core domain entities
- [MODULES_BOUNDARIES.md](../architecture/MODULES_BOUNDARIES.md) - Module responsibilities
- [implementation-plan.md](../studio/copilot/implementation-plan.md) - Detailed task breakdown
- [ab-testing-spec.md](../studio/copilot/ab-testing-spec.md) - A/B testing specification
- [contract.md](../studio/copilot/contract.md) - Full Copilot specification
- [FIGMA_PLUGIN.md](../figma/FIGMA_PLUGIN.md) - Figma Plugin technical documentation
- [FIGMA_PLUGIN_COPILOT_GUIDELINES.md](../figma/FIGMA_PLUGIN_COPILOT_GUIDELINES.md) - Figma Plugin implementation guidelines for AI assistants

---

**Last Updated:** 2025-01-XX  
**Next Review:** After Iteration 1 completion

