# Documentation Cleanup & Archive Plan - 2025

**Date:** 2025-01-XX  
**Status:** In Progress  
**Goal:** Organize documentation for public DS release, archive outdated plans and status documents

---

## 📋 Archive Strategy

### Principles
1. **Keep active:** Current roadmap, implementation plans, public DS guidelines
2. **Archive:** Completed phases, outdated status documents, old test results
3. **Remove:** Duplicates, superseded documents, temporary notes

---

## 📁 Files to Archive

### Root Directory - Status & Plans

**Completed Phase Documents (Archive):**
- `PHASE_2_STATUS.md` → `docs/archive/phases/`
- `PHASE3_TEST_RESULTS.md` → `docs/archive/phases/`
- `COPILOT_STABILIZATION_REPORT.md` → `docs/archive/phases/`

**Old Status Documents (Archive):**
- `PROJECT_STATUS.md` → `docs/archive/status/`
- `PROJECT_STATUS_SUMMARY.md` → `docs/archive/status/`
- `STATUS_AND_NEXT_STEPS.md` → `docs/archive/status/`
- `LAST_SESSION_SUMMARY.md` → `docs/archive/status/`
- `REMAINING_TASKS_SUMMARY.md` → `docs/archive/status/`

**Old Action Plans (Archive):**
- `NEXT_ACTION_PLAN.md` → `docs/archive/plans/` (duplicate of `docs/NEXT_ACTION_PLAN.md`)
- `NEXT_STEPS_RECOMMENDATION.md` → `docs/archive/plans/`

**Old Analysis Documents (Archive):**
- `ARCHITECTURAL_ANALYSIS.md` → `docs/archive/analysis/`
- `AUDIT_REPORT.md` → `docs/archive/analysis/`
- `PROJECT_SIZE_ANALYSIS.md` → `docs/archive/analysis/`

**Old Proposals (Archive):**
- `BLOCKS_EXPANSION_PROPOSAL.md` → `docs/archive/proposals/` (superseded by `docs/copilot/BLOCKS_AND_TEMPLATES_IMPLEMENTATION_PLAN.md`)
- `DOCUMENTATION_EXPANSION_PROPOSAL.md` → `docs/archive/proposals/`
- `DASHBOARD_VARIANTS_WORKFLOW_PLAN.md` → `docs/archive/proposals/`

**Old Test Documents (Archive):**
- `TEST_DASHBOARD_GENERATION.md` → `docs/archive/testing/`
- `QUICK_TEST_DASHBOARD.md` → `docs/archive/testing/`
- `TESTING_PLAN.md` → `docs/archive/testing/` (if superseded)

**Old Fix/Change Documents (Archive):**
- `FIXES_SUMMARY.md` → `docs/archive/changes/`
- `CHANGES_SUMMARY.md` → `docs/archive/changes/`
- `FORM_FIELD_ENHANCED_FIX.md` → `docs/archive/changes/`

**Old Review Documents (Archive):**
- `DOCUMENTATION_REVIEW.md` → `docs/archive/reviews/`
- `ENTERPRISE_CONTENT_REVIEW.md` → `docs/archive/reviews/`
- `FOUNDATIONS_CONTENT_REVIEW.md` → `docs/archive/reviews/`
- `GET_STARTED_CONTENT_REVIEW.md` → `docs/archive/reviews/`
- `GET_STARTED_FINAL_REVIEW.md` → `docs/archive/reviews/`

**Keep (Active):**
- `PROJECT_COMPREHENSIVE_SUMMARY.md` - Main project status
- `CURRENT_PLANS_SUMMARY.md` - Current plans summary
- `README.md` - Main README
- `LICENSE`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, `CONTRIBUTING.md` - Public release docs
- `CHANGELOG.md`, `CHANGELOG_2025.md` - Active changelogs

---

### docs/ Directory - Documentation

**Old Implementation Progress (Archive):**
- `docs/IMPLEMENTATION_PROGRESS.md` → `docs/archive/implementation/`
- `docs/REFACTORING_PROGRESS.md` → `docs/archive/implementation/`
- `docs/REFACTORING_PLAN.md` → `docs/archive/implementation/`

**Old Next Steps (Archive):**
- `docs/NEXT_STEPS.md` → `docs/archive/plans/` (if superseded by roadmap)
- `docs/NEXT_ACTION_PLAN.md` → `docs/archive/plans/` (if outdated)
- `docs/CONCRETE_NEXT_STEPS.md` → `docs/archive/plans/` (if outdated)

**Old Questions (Archive):**
- `docs/OPEN_QUESTIONS.md` → `docs/archive/questions/` (if resolved)

**Old Reorganization (Archive):**
- `docs/REORGANIZATION_SUMMARY.md` → `docs/archive/reorganization/`

**Old Quick Start (Check):**
- `docs/QUICK_START.md` → Check if superseded by `docs/getting-started/quick-start.md`

**Keep (Active):**
- `docs/README.md` - Documentation index
- `docs/roadmap/FRAGMENT_UI_STUDIO_PLAN.md` - Main roadmap
- `docs/copilot/BLOCKS_AND_TEMPLATES_IMPLEMENTATION_PLAN.md` - Current implementation plan
- `docs/OSS_FAQ.md`, `docs/OSS_PUBLIC_DS_GUIDELINES.md`, `docs/PUBLIC_DS_RELEASE_SCOPE.md` - Public DS docs
- All `docs/api/`, `docs/architecture/`, `docs/governance/`, `docs/guides/` - Active documentation

---

### docs/development/ - Development Docs

**Old Test Results (Archive):**
- `docs/development/COMPONENT_TEST_REPORT.md` → `docs/archive/testing/`
- `docs/development/COMPONENT_TEST_RESULTS.md` → `docs/archive/testing/`
- `docs/development/AUTOMATED_TEST_REPORT.md` → `docs/archive/testing/`
- `docs/development/BROWSER_TEST_RESULTS.md` → `docs/archive/testing/`
- `docs/development/TEST_RESULTS.md` → `docs/archive/testing/`

**Old Integration Status (Archive):**
- `docs/development/INTEGRATION_COMPLETE.md` → `docs/archive/implementation/`
- `docs/development/INTEGRATION_PROGRESS.md` → `docs/archive/implementation/`
- `docs/development/TABLE_INTEGRATION_STATUS.md` → `docs/archive/implementation/`
- `docs/development/COMPONENT_INTEGRATION_PLAN.md` → `docs/archive/implementation/`

**Old Component Analysis (Archive):**
- `docs/development/REMAINING_COMPONENTS_ANALYSIS.md` → `docs/archive/analysis/`
- `docs/development/REMAINING_COMPONENTS_SUMMARY.md` → `docs/archive/analysis/`
- `docs/development/REMAINING_TASKS.md` → `docs/archive/tasks/`
- `docs/development/ACCORDION_IMPLEMENTATION_ANALYSIS.md` → `docs/archive/implementation/`

**Old Automation Docs (Archive):**
- `docs/development/AUTOMATION_SUMMARY.md` → `docs/archive/automation/`
- `docs/development/AUTOMATION_GUIDE.md` → `docs/archive/automation/`
- `docs/development/MCP_TEST_PLAN.md` → `docs/archive/testing/`
- `docs/development/TEST_SCRIPT.md` → `docs/archive/testing/`

**Old Component Display (Archive if completed):**
- `docs/development/COMPONENT_DISPLAY_UNIFICATION.md` → `docs/archive/implementation/`

**Keep (Active):**
- `docs/development/README.md`
- `docs/development/setup.md`
- `docs/development/testing.md`
- `docs/development/contributing.md`
- `docs/development/component-implementation.md`
- `docs/development/implementation-next-steps.md` (if still relevant)

---

## 📁 New Archive Structure

```
docs/archive/
├── README.md (updated)
├── phases/          # Completed phase documents
├── status/          # Old status documents
├── plans/           # Old action plans
├── analysis/        # Old analysis documents
├── proposals/       # Old proposals (superseded)
├── testing/         # Old test results
├── changes/         # Old fix/change documents
├── reviews/         # Old review documents
├── implementation/  # Old implementation progress
├── questions/       # Resolved questions
├── reorganization/  # Old reorganization docs
├── automation/      # Old automation docs
├── tasks/           # Old task lists
├── cleanup/         # Existing cleanup docs
├── deployment/      # Existing deployment docs
├── legacy-docs/     # Existing legacy docs
└── roadmap/         # Existing roadmap archive
```

---

## ✅ Action Items

1. Create new archive subdirectories
2. Move files according to plan
3. Update `docs/archive/README.md` with new structure
4. Update any broken links in active documents
5. Create `ARCHIVE_INDEX.md` with quick reference

---

**Last Updated:** 2025-01-XX

