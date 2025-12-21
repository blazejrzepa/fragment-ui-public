# Copilot for Fragment AI Studio

**Version:** 1.0  
**Status:** Specification Complete, Phase 1 & 2 Implementation Complete

---

## 📋 Overview

Copilot for Fragment AI Studio is an AI-native system for generating and editing complex screens in Fragment UI. It enables:

- **Generate:** From prompt → UI-DSL v2 → TSX (Fragment UI) for dashboards, CRUD, landing pages
- **Edit conversationally:** Patch operations by `data-ui-id` (copy, variant, layout, move)
- **Variant:** Create 2–5 variants (layout/copy/datasource) and compare
- **Validate:** Mandatory quality gates before PR (a11y, size, visual snapshots, DS lint)
- **Promote:** Submissions → PR → review → merge to `@fragment_ui/blocks` / `@fragment_ui/ui`
- **Enrich:** Import from Figma (mapper to DSL), create new elements (with governance approval)
- **Learn:** Telemetry (TTFUI, reuse, acceptance) → quality/ROI dashboard

---

## 📚 Documentation

### Core Documents

1. **[Contract & Specification](./contract.md)** - Complete technical specification
   - Architecture overview
   - UI-DSL v2 type definitions
   - Patch operations
   - Registry contract
   - Skills (MCP/HTTP) interfaces
   - Quality gates
   - Security & compliance

2. **[Implementation Plan](./implementation-plan.md)** - Detailed task breakdown
   - Phase 1: Foundation (2-3 weeks)
   - Phase 2: Complex Screens & Variants (2-4 weeks)
   - Phase 3: Submissions & Promotion (2 weeks)
   - Phase 4: Landing Generator (Optional, 2-3 weeks)
   - Phase 5: Figma Import (2-4 weeks)

### Related Documents

- [A/B Testing Specification](./ab-testing-spec.md) - 🆕 **PostHog Experiments integration**
- [A/B Testing Strategic Plan](../roadmap/AB_TESTING_STRATEGIC_PLAN.md) - 🆕 **Strategic implementation plan**
- [Submissions Workflow](../submissions.md) - Submissions documentation
- [Variants Guide](../variants.md) - Variants documentation
- [Quality Dashboard](../../../apps/demo/src/components/quality/README.md) - Quality testing dashboard

---

## 🚀 Quick Start

### For Developers

1. Read [Contract](./contract.md) to understand the architecture
2. Review [Implementation Plan](./implementation-plan.md) for task breakdown
3. Start with Phase 1: Foundation
4. Follow the phase-by-phase approach

### For Product/Design

1. Review [Contract](./contract.md) - Section 0 (Goals) and Section 15 (Example Conversations)
2. Understand the user flows and capabilities
3. Review quality gates and compliance requirements

---

## 🎯 Key Features

### 1. UI-DSL v2
Layout-first DSL with datasources, slots, and bindings. Type-safe, validated, and registry-compliant.

### 2. Conversational Editing
Edit screens through natural language:
- "Change CTA to 'Get started'"
- "Button to outline, size lg"
- "Add card with icon on left"
- "Move table up"

### 3. Variants & Comparison
Generate multiple variants and compare them based on:
- Clarity
- Hierarchy
- A11y compliance
- Token compliance

### 4. Quality Gates
Mandatory checks before PR:
- A11y Level AA (axe = 0 violations)
- Bundle size budgets
- Visual snapshots (no regressions)
- E2E smoke tests
- DS lint (no raw HTML, no hardcoded colors)

### 5. Submissions & Promotion
End-to-end workflow:
- Create submission → PR generation
- Quality gates → Checklist
- Review → Promote → Merge
- Version bump + Changelog

### 6. 🆕 A/B Testing with PostHog Experiments
True A/B testing for generated screens:
- Generate 2-5 variants → Submissions
- Create experiments with variant mapping
- Public experiment URL (`/exp/{slug}`)
- PostHog feature flags for variant selection
- Automatic exposure and conversion metrics
- Promote winner to Block

---

## 📊 Implementation Status

| Phase | Status | Duration | Progress |
|-------|--------|----------|----------|
| Phase 1: Foundation | ✅ **COMPLETED** | 2-3 weeks | **100% (8/8 tasks)** |
| ├─ 1.1 UI-DSL v2 Types & Validation | ✅ Completed | ~10h | 100% |
| ├─ 1.2 DSL Generation API | ✅ Completed | ~14h | 100% |
| │  └─ Schema validation fixed (circular reference resolved) | ✅ Fixed | 2025-01-XX | 100% |
| ├─ 1.3 DSL Patch Operations | ✅ Completed | ~18h | 100% |
| ├─ 1.4 Code Generation | ✅ Completed | ~18h | 100% |
| ├─ 1.5 Quality Run API | ✅ Completed | ~22h | 100% |
| ├─ 1.6 Registry Enhancement | ✅ Completed | ~10h | 100% |
| ├─ 1.7 Inspector → Patch Integration | ✅ Completed | ~14h | 100% |
| └─ 1.8 Lint DS in CI | ✅ Completed | ~1h | 100% |
| Phase 2: Complex Screens & Patch Workflow | ✅ **COMPLETED** | 2-3 weeks | **100% (7/7 tasks)** |
| ├─ B1: Extend UI-DSL for Complex Screens | ✅ Completed | ~8-12h | 100% |
| │  └─ Layout types: stack, twoColumn, threeColumn, sidebar | ✅ Added | 2025-01-XX | 100% |
| ├─ B2: Screen Scaffolds | ✅ Completed | ~12-16h | 100% |
| ├─ B3: Enhanced DSL Generator | ✅ Completed | ~16-20h | 90% |
| │  └─ Sections → Blocks mapping with helper | ✅ Added | 2025-01-XX | 90% |
| ├─ C1: Chat Mode Detection | ✅ Completed | ~8-12h | 100% |
| │  └─ Chat Orchestrator added | ✅ Added | 2025-01-XX | 100% |
| ├─ C2: Patch Intent Parser | ✅ Completed | ~12-16h | 100% |
| ├─ C3: Patch Application + Regeneration | ✅ Completed | ~8-12h | 100% |
| │  └─ Optional revision creation in patch API | ✅ Added | 2025-01-XX | 100% |
| └─ C4: Inspector Integration | ✅ Completed | ~8-12h | 100% |
| Phase 3: Submissions & Promotion + A/B Testing | 📋 Planned | 3-4 weeks | 0% |
| ├─ 3.1 Submissions Workflow | 📋 Planned | 40-56h | 0% |
| └─ 3.2 A/B Testing Infrastructure | 📋 Planned | 50-70h | 0% 🆕 |
| Phase 4: Releases + Experiments | 📋 Planned | 2-3 weeks | 0% |
| Phase 5: Landing Generator | 📋 Optional | 2-3 weeks | 0% |
| Phase 6: Figma Import | 📋 Planned | 2-4 weeks | 0% |

**Total Estimated Duration:** 10-16 weeks  
**Current Progress:** Phase 1 ✅ (100%) + Phase 2 ✅ (100%) completed (2025-01-XX)

---

## 🔗 Related Resources

- [Fragment UI Main README](../../../README.md)
- [Project Status](../../../STATUS_AND_NEXT_STEPS.md)
- [Remaining Tasks Summary](../../../REMAINING_TASKS_SUMMARY.md)
- [Component Testing Standards](../testing/component-testing-standards.md)

---

## 📝 Notes

- This is a **strategic initiative** (P0 priority)
- Implementation should follow the phased approach
- Each phase builds on the previous one
- Quality gates are mandatory at every step
- Telemetry is built-in from Phase 1

---

**Last Updated:** 2025-01-XX  
**Next Review:** After Phase 3 completion

