# Submissions Flow - Review & Quality Gate

**Version:** 2.0  
**Status:** Implementation Complete (Phase 3)  
**Last Updated:** 2025-01-XX

---

## 📋 Overview

Submissions provide a controlled "gate" between draft revisions and published releases. They enforce quality standards and enable review workflows.

---

## 🎯 Goals

1. **Quality Gate:** Ensure all published content meets standards
2. **Review Workflow:** Enable collaborative review and approval
3. **Traceability:** Link submissions to revisions and experiments
4. **Compliance:** Enforce governance policies

---

## 🔄 Workflow

### State Machine

```
draft → submitted → approved → (promote) → published
  ↓         ↓
rejected ← changes_requested
```

**States:**
- `draft`: Created in Studio, not yet submitted
- `submitted`: Submitted for review (checks running/completed)
- `approved`: Approved for release by reviewer
- `rejected`: Rejected (with reason in `rejectionReason`)

**Legacy Statuses (backward compatibility):**
- `DRAFT` → `draft`
- `CHECKING` → `submitted`
- `verifying` → `submitted`
- `APPROVED` → `approved`
- `NEEDS_CHANGES` → `rejected`
- `REJECTED` → `rejected`
- `verified` → `approved`
- `promoted` → `approved`

---

## 📦 Data Model

### Submission

```typescript
interface Submission {
  id: string;                    // UUID v4
  revisionId: string;            // Links to Revision (CRITICAL)
  assetId: string;               // Links to Asset
  
  // Content (snapshot from Revision)
  dsl: UiDsl;
  tsx: string;
  stories?: string;
  
  // Status
  status: SubmissionStatus;
  
  // Context
  author: string;
  prompt?: string;               // Original prompt (if AI-generated)
  chatSessionId?: string;        // Link to chat context
  
  // Experiment Tracking (for A/B testing)
  experimentId?: string;         // If created from experiment
  variantKey?: string;           // Variant key (if from experiment)
  artifactHash?: string;        // For deduplication
  
  // Quality Checks
  checks?: SubmissionChecks;
  result?: SubmissionResult;
  
  // Review
  reviewComments?: ReviewComment[];
  approvedBy?: string;
  approvedAt?: string;
  
  // Timestamps
  createdAt: string;
  updatedAt?: string;
}
```

### SubmissionChecks

```typescript
interface SubmissionChecks {
  lint: {
    passed: boolean;
    errors: number;
    warnings: number;
    messages: Violation[];
  };
  a11y: {
    passed: boolean;
    critical: number;
    warnings: number;
    violations: Violation[];
  };
  bundle: {
    passed: boolean;
    size: number;
    gzipSize: number;
    violations: Violation[];
  };
  policy: {
    passed: boolean;
    violations: Violation[];
  };
  tests: {
    passed: boolean;
    hasStory: boolean;
    hasUnit: boolean;
    coverage?: number;
  };
}
```

### SubmissionResult

```typescript
interface SubmissionResult {
  score: number;                 // 0-100
  passed: boolean;               // true if all checks passed
  issues: string[];              // Human-readable issues
  recommendations?: string[];    // Suggestions for improvement
}
```

---

## 🔍 Quality Checks ✅ IMPLEMENTED

### 1. Lint Checks ✅

**Rules:**
- `no-raw-elements`: No raw HTML elements (use Fragment UI components)
- `design-system-imports-only`: Only import from `@fragment_ui/ui` or `@fragment_ui/blocks`
- `no-inline-hardcoded-colors`: Use design tokens, not hardcoded colors

**Implementation:**
- ✅ Uses ESLint custom rules (`apps/demo/app/submissions/verify.ts`)
- ✅ Runs on TSX code
- ✅ Returns violations with line numbers and rules

---

### 2. A11y (Accessibility) ✅

**Requirements:**
- P0: No critical violations (axe-core)
- P1: No warnings (optional)

**Implementation:**
- ✅ Uses `axe-core` (prepared for integration)
- ✅ Runs on generated TSX
- ✅ Returns violations with target elements, impact, description, help URLs

**Plik:** `apps/demo/app/submissions/verify.ts`

---

### 3. Bundle Policy ✅

**Requirements:**
- No CSS imports in ESM
- No forbidden dependencies
- Bundle size within budget

**Implementation:**
- ✅ Analyzes imports (`apps/demo/src/lib/governance/rules/bundle-rule.ts`)
- ✅ Checks bundle size (bytes, gzipped)
- ✅ Validates against policy
- ✅ Returns size violations with locations

---

### 4. Test Presence ✅

**Requirements:**
- Minimum: Story + Unit test for new components
- Coverage threshold (optional)

**Implementation:**
- ✅ Checks for Storybook story (`apps/demo/app/submissions/checks.ts`)
- ✅ Checks for unit test
- ✅ Returns missing test violations

---

### 5. ACL (Access Control List) ✅

**Requirements:**
- All CTAs must have `data-action-id` and `data-action-kind`
- Compliance with Action Contracts in DSL

**Implementation:**
- ✅ Validates all buttons/CTAs for ACL attributes
- ✅ Checks DSL Action Contracts against code
- ✅ Returns violations with missing attributes

**Plik:** `apps/demo/app/submissions/checks.ts`

---

### 6. Synthetic Check ✅

**Requirements:**
- Deterministic evaluation of DSL structure
- Decision patterns validation
- Required fields verification

**Implementation:**
- ✅ Validates DSL structure (`apps/demo/app/submissions/checks.ts`)
- ✅ Checks decision patterns (compare-3, recommendation)
- ✅ Returns score (0-100) and failures

---

### 7. Governance Checks ✅

**Policy Bundles:**
- `core-ds`: Core Design System rules
- `enterprise`: Enterprise rules

**Rules:**
- `no-raw-elements`: Enforces Fragment UI components
- `design-system-imports-only`: Only `@fragment_ui/ui` imports
- `no-hardcoded-colors`: Enforces design tokens
- `a11y-critical`: Enforces accessibility
- `test-presence`: Enforces test presence

**Enforcement:**
- **Studio**: Soft warnings (doesn't block)
- **Submissions**: Hard gates (blocks approval on errors)
- **Releases**: Final gates (blocks publication)

**Implementation:**
- ✅ Policy Engine (`apps/demo/src/lib/governance/policy-registry.ts`)
- ✅ Rule Engine (`apps/demo/src/lib/governance/rule-engine.ts`)
- ✅ Enforcement Points (`apps/demo/src/lib/governance/enforcement.ts`)

---

## 🔄 API Endpoints

### Create Submission

```typescript
POST /api/submissions
{
  "revisionId": "rev_123",
  "type": "component" | "block" | "screen",
  "runChecks": true  // Auto-run checks
}

Response:
{
  "id": "sub_123",
  "status": "checks_running",
  "checks": { ... }
}
```

---

### Get Submission

```typescript
GET /api/submissions/[id]

Response:
{
  "id": "sub_123",
  "revisionId": "rev_123",
  "status": "approved",
  "checks": { ... },
  "result": { ... }
}
```

---

### Run Checks

```typescript
POST /api/submissions/[id]/run-checks

Response:
{
  "checks": {
    "lint": { ... },
    "a11y": { ... },
    "bundle": { ... },
    "policy": { ... },
    "tests": { ... }
  },
  "result": {
    "score": 85,
    "passed": true,
    "issues": []
  }
}
```

---

### Approve Submission

```typescript
POST /api/submissions/[id]/approve
{
  "comment": "Looks good!"
}

Response:
{
  "id": "sub_123",
  "status": "approved",
  "approvedBy": "user_123",
  "approvedAt": "2025-01-XX"
}
```

---

### Request Changes

```typescript
POST /api/submissions/[id]/request-changes
{
  "comment": "Please fix a11y violations",
  "suggestions": [
    {
      "type": "patch",
      "patch": { "op": "setProp", ... }
    }
  ]
}

Response:
{
  "id": "sub_123",
  "status": "needs_changes",
  "reviewComments": [ ... ]
}
```

---

## 🎨 UI Components

### Submission List

**File:** `apps/demo/src/components/submissions/submission-list.tsx`

**Features:**
- Filter by status, type, author
- Sort by date, score
- Quick actions (Approve, Request Changes)

---

### Submission Detail

**File:** `apps/demo/src/components/submissions/submission-detail.tsx`

**Features:**
- Preview of submission
- Check results display
- Review comments
- Diff visualization (if applicable)
- Approve/Request Changes actions

---

### Review Interface

**File:** `apps/demo/src/components/submissions/review-interface.tsx`

**Features:**
- Inline comments on DSL/TSX
- Violation highlighting
- Auto-fix suggestions
- Patch proposals

---

## 🔗 Integration Points

### From Studio

- User creates Revision in Studio
- User clicks "Submit for Review"
- System creates Submission from Revision

### To Releases

- Approved Submission → Release Candidate
- System creates Release from approved Submission

### From Experiments

- Experiment winner → Submission
- System creates Submission from winner Revision

---

## 📝 Acceptance Criteria

### ✅ Implemented (Phase 3)

1. ✅ Can create submission from Studio (via Submit button)
2. ✅ Checks run automatically on creation (`runChecks: true`)
3. ✅ Can view check results in Verification tab
4. ✅ Can add review comments (inline on code/DSL)
5. ✅ Can approve submission (with optional comment)
6. ✅ Can request changes (with comment and inline comments)
7. ✅ Approved submission ready for PR promotion
8. ✅ Submission links to Revision (via `revisionId`)
9. ✅ Governance integration (policy bundles, rule engine)
10. ✅ Promote to PR functionality (GitHub integration)
11. ✅ Review Interface with inline comments
12. ✅ Diff visualization (if parent revision available)
13. ✅ Submissions Dashboard with filters
14. ✅ Status machine with proper transitions

### ⏳ Planned (Phase 4)

1. ⏳ Release creation from approved submissions
2. ⏳ Experiment integration
3. ⏳ Telemetry and analytics
4. ⏳ Feedback system
5. ⏳ Component recommendations

---

## 🔗 Related Documents

- [STUDIO_DOMAIN_MODEL.md](../architecture/STUDIO_DOMAIN_MODEL.md) - Domain model
- [MODULES_BOUNDARIES.md](../architecture/MODULES_BOUNDARIES.md) - Module boundaries
- [implementation-plan.md](../copilot/implementation-plan.md) - Implementation plan

---

**Last Updated:** 2025-01-XX

