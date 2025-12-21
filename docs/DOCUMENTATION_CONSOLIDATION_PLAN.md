# Documentation Consolidation Plan

**Date:** 2025-01-XX  
**Status:** Analysis and Recommendations  
**Purpose:** Identify redundant, outdated, or unnecessary documents in `docs/` directory

---

## 📊 Current State Analysis

### Statistics
- **Total .md files in `docs/` root:** 29 files
- **Duplicates identified:** 8+ groups
- **Outdated documents:** 5+ files
- **Low-value documents:** 3+ files
- **Must-have documents:** ~10 files

---

## 🔍 Document Analysis

### 1. Next Steps Documents (6 files) - **CONSOLIDATE**

**Files:**
- `NEXT_STEPS.md` - Main next steps (active)
- `NEXT_STEPS_CONSOLIDATED.md` - Consolidated version (duplicate?)
- `CONCRETE_NEXT_STEPS.md` - Concrete next steps
- `NEXT_ACTION_PLAN.md` - Action plan
- `NEXT_STEPS_PUBLIC_RELEASE.md` - Public release steps
- `REMAINING_TASKS_SUMMARY.md` - Remaining tasks

**Analysis:**
- ❌ **6 different documents** covering similar topics
- ❌ **Confusing** - which one is the source of truth?
- ❌ **Maintenance burden** - need to update multiple files

**Recommendation:**
- ✅ **Keep:** `NEXT_STEPS.md` (already consolidated)
- ✅ **Archive:** All others → `docs/archive/planning/`
- ✅ **Action:** Verify `NEXT_STEPS.md` contains all important info, then archive others

---

### 2. DS Component Editing Documents (4 files) - **CONSOLIDATE**

**Files:**
- `DS_COMPONENT_EDITING_SUMMARY.md` - Summary (Polish)
- `HOW_TO_EDIT_DS_COMPONENTS.md` - How-to guide (Polish)
- `DS_ENHANCEMENT_STRATEGY.md` - Enhancement strategy
- `DS_USAGE_ANALYSIS.md` - Usage analysis

**Analysis:**
- ❌ **Mixed languages** (Polish + English)
- ❌ **Overlapping content** - multiple guides for same topic
- ❌ **Some outdated** - references old migration examples

**Recommendation:**
- ✅ **Keep:** `HOW_TO_EDIT_DS_COMPONENTS.md` (translate to English if needed)
- ✅ **Archive:** `DS_COMPONENT_EDITING_SUMMARY.md` → `docs/archive/`
- ✅ **Archive:** `DS_ENHANCEMENT_STRATEGY.md` → `docs/archive/` (if outdated)
- ✅ **Archive:** `DS_USAGE_ANALYSIS.md` → `docs/archive/` (if outdated)
- ✅ **Action:** Consolidate into one comprehensive guide

---

### 3. Portal DS Documents (2 files) - **CONSOLIDATE**

**Files:**
- `PORTAL_DS_COMPLIANCE_CHECKLIST.md` - Compliance checklist
- `PORTAL_DS_REFACTORING_STRATEGY.md` - Refactoring strategy

**Analysis:**
- ⚠️ **Related but different purposes**
- ⚠️ **Checklist might be outdated** (many items already completed)
- ⚠️ **Strategy might be outdated** (refactoring might be done)

**Recommendation:**
- ✅ **Keep:** `PORTAL_DS_REFACTORING_STRATEGY.md` (if still relevant)
- ✅ **Archive:** `PORTAL_DS_COMPLIANCE_CHECKLIST.md` → `docs/archive/` (if all items completed)
- ✅ **Action:** Review both, keep only if still relevant

---

### 4. Milestone Documents (2 files) - **ARCHIVE**

**Files:**
- `MILESTONE_B_TEST_RESULTS.md` - Test results
- `MILESTONE_C_COMPLETE.md` - Completion status

**Analysis:**
- ❌ **Historical documents** - milestones already completed
- ❌ **Not needed for ongoing work**
- ❌ **Should be in archive**

**Recommendation:**
- ✅ **Archive:** Both → `docs/archive/milestones/`
- ✅ **Action:** Move immediately

---

### 5. Documentation Meta Documents (4 files) - **KEEP 2, ARCHIVE 2**

**Files:**
- `DOCUMENTATION_AUDIT_REPORT.md` - Audit report ✅ **KEEP**
- `DOCUMENTATION_CLEANUP_SUMMARY.md` - Cleanup summary ⚠️ **ARCHIVE** (historical)
- `DOCUMENTATION_STRUCTURE_PROPOSAL.md` - Structure proposal ⚠️ **ARCHIVE** (implemented)
- `DOCUMENTATION_MAINTENANCE_POLICY.md` - Maintenance policy ✅ **KEEP**

**Analysis:**
- ✅ **Audit report** - useful reference
- ⚠️ **Cleanup summary** - historical, can archive
- ⚠️ **Structure proposal** - already implemented, can archive
- ✅ **Maintenance policy** - active policy, must keep

**Recommendation:**
- ✅ **Keep:** `DOCUMENTATION_AUDIT_REPORT.md`, `DOCUMENTATION_MAINTENANCE_POLICY.md`
- ✅ **Archive:** `DOCUMENTATION_CLEANUP_SUMMARY.md`, `DOCUMENTATION_STRUCTURE_PROPOSAL.md` → `docs/archive/`

---

### 6. User Guides (2 files) - **CONSOLIDATE**

**Files:**
- `QUICK_START.md` - Quick start guide
- `USER_GUIDE.md` - Complete user guide

**Analysis:**
- ⚠️ **Both serve different purposes** but might overlap
- ⚠️ **QUICK_START.md** might be redundant if `getting-started/quick-start.md` exists
- ✅ **USER_GUIDE.md** - comprehensive, should keep

**Recommendation:**
- ✅ **Check:** Does `getting-started/quick-start.md` exist? If yes, remove `QUICK_START.md`
- ✅ **Keep:** `USER_GUIDE.md` (comprehensive guide)
- ✅ **Action:** Verify if `QUICK_START.md` is referenced anywhere

---

### 7. Planning Documents (3 files) - **REVIEW**

**Files:**
- `PUBLIC_RELEASE_PRIORITIES.md` - Release priorities
- `MISSING_COMPONENTS_FOR_ADMIN_DASHBOARD.md` - Missing components
- `OPEN_QUESTIONS.md` - Open questions

**Analysis:**
- ⚠️ **PUBLIC_RELEASE_PRIORITIES.md** - might be outdated (release already done?)
- ⚠️ **MISSING_COMPONENTS_FOR_ADMIN_DASHBOARD.md** - might be outdated (components added?)
- ✅ **OPEN_QUESTIONS.md** - active tracking, should keep

**Recommendation:**
- ✅ **Review:** Check if priorities are still relevant
- ✅ **Review:** Check if missing components are still missing
- ✅ **Keep:** `OPEN_QUESTIONS.md` (active tracking)
- ✅ **Archive:** Others if outdated → `docs/archive/planning/`

---

### 8. Site Map - **KEEP OR REMOVE?**

**Files:**
- `SITE_MAP.md` - Site map for apps/www

**Analysis:**
- ⚠️ **Might be outdated** - site structure might have changed
- ⚠️ **Low value** - can be generated from code
- ⚠️ **Not referenced** in main README

**Recommendation:**
- ✅ **Archive:** → `docs/archive/` (if not actively maintained)
- ✅ **Or keep:** If actively maintained and useful

---

### 9. Must-Have Documents (Keep These)

**Essential Documents:**
- ✅ `README.md` - Main documentation index
- ✅ `OSS_PUBLIC_DS_GUIDELINES.md` - Public DS guidelines
- ✅ `OSS_FAQ.md` - FAQ
- ✅ `ARCHIVE_INDEX.md` - Archive reference
- ✅ `NEXT_STEPS.md` - Consolidated next steps
- ✅ `USER_GUIDE.md` - User guide
- ✅ `OPEN_QUESTIONS.md` - Open questions tracking
- ✅ `DOCUMENTATION_AUDIT_REPORT.md` - Audit reference
- ✅ `DOCUMENTATION_MAINTENANCE_POLICY.md` - Maintenance policy

---

## 📋 Consolidation Actions

### Priority 1: Immediate Actions

1. **Archive Milestone Documents**
   ```bash
   mkdir -p docs/archive/milestones
   mv docs/MILESTONE_B_TEST_RESULTS.md docs/archive/milestones/
   mv docs/MILESTONE_C_COMPLETE.md docs/archive/milestones/
   ```

2. **Archive Documentation Meta (Historical)**
   ```bash
   mv docs/DOCUMENTATION_CLEANUP_SUMMARY.md docs/archive/
   mv docs/DOCUMENTATION_STRUCTURE_PROPOSAL.md docs/archive/
   ```

3. **Consolidate Next Steps**
   - Verify `NEXT_STEPS.md` is complete
   - Archive all other Next Steps documents → `docs/archive/planning/`

### Priority 2: Review and Archive

4. **Review DS Component Documents**
   - Check if `DS_ENHANCEMENT_STRATEGY.md` is still relevant
   - Check if `DS_USAGE_ANALYSIS.md` is still relevant
   - Archive if outdated

5. **Review Portal DS Documents**
   - Check if `PORTAL_DS_COMPLIANCE_CHECKLIST.md` items are all completed
   - Archive if completed

6. **Review Planning Documents**
   - Check if `PUBLIC_RELEASE_PRIORITIES.md` is still relevant
   - Check if `MISSING_COMPONENTS_FOR_ADMIN_DASHBOARD.md` is still relevant
   - Archive if outdated

### Priority 3: Optional Cleanup

7. **Check QUICK_START.md**
   - Verify if `getting-started/quick-start.md` exists
   - Remove `QUICK_START.md` if redundant

8. **Review SITE_MAP.md**
   - Check if actively maintained
   - Archive if not maintained

---

## 📊 Expected Results

### Before
- **29 files** in `docs/` root
- **6 Next Steps documents** (confusing)
- **4 DS editing documents** (overlapping)
- **Multiple outdated documents**

### After
- **~10-12 essential files** in `docs/` root
- **1 consolidated Next Steps** document
- **1 comprehensive DS editing guide**
- **All outdated documents archived**

### Benefits
- ✅ **Clearer structure** - easier to find documents
- ✅ **Less confusion** - single source of truth
- ✅ **Easier maintenance** - fewer documents to update
- ✅ **Better organization** - historical docs in archive

---

## 🎯 Summary

### Documents to Keep (10-12 files)
1. `README.md` - Main index
2. `OSS_PUBLIC_DS_GUIDELINES.md` - Guidelines
3. `OSS_FAQ.md` - FAQ
4. `ARCHIVE_INDEX.md` - Archive reference
5. `NEXT_STEPS.md` - Consolidated next steps
6. `USER_GUIDE.md` - User guide
7. `OPEN_QUESTIONS.md` - Questions tracking
8. `DOCUMENTATION_AUDIT_REPORT.md` - Audit reference
9. `DOCUMENTATION_MAINTENANCE_POLICY.md` - Policy
10. `HOW_TO_EDIT_DS_COMPONENTS.md` - DS editing guide (if still relevant)
11. `PORTAL_DS_REFACTORING_STRATEGY.md` - Strategy (if still relevant)
12. `SITE_MAP.md` - Site map (if actively maintained)

### Documents to Archive (~17 files)
- All Next Steps duplicates (5 files)
- DS editing summaries/analyses (3 files)
- Milestone documents (2 files)
- Documentation meta historical (2 files)
- Planning documents if outdated (2 files)
- Other low-value documents (3 files)

---

**Next Step:** Review this plan and execute consolidation actions.

