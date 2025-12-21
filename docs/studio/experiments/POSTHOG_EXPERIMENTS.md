# PostHog Experiments Integration

**Version:** 1.0  
**Status:** Specification  
**Last Updated:** 2025-01-XX

---

## 📋 Overview

This document details the PostHog Experiments integration for Fragment UI Studio, enabling true A/B testing of generated UI screens.

---

## 🎯 Goals

1. Generate 2-5 variants of a screen (landing page, dashboard, section)
2. Expose variants under a single URL
3. Automatically assign users to variants via PostHog feature flags
4. Measure conversion and other KPIs
5. Choose winner and "merge" to Design System (as block/screen)

---

## 🏗️ Architecture

### Key Components

```
Experiment (Studio)
  ↓ creates
Experiment Model (revisionId mapping)
  ↓ publishes
PostHog Feature Flag
  ↓ runtime
ExperimentRunner (renders variant)
  ↓ tracks
PostHog Events (conversion metrics)
  ↓ results
Winner Selection → Promote to Submission
```

---

## 📦 Data Model

### Experiment

```typescript
interface Experiment {
  experimentId: string;          // UUID v4
  assetId: string;               // Asset being tested
  name: string;
  slug: string;                  // For public URL: /exp/{slug}
  hypothesis?: string;
  
  // Variant Mapping (CRITICAL: maps to revisionId/releaseId)
  variants: ExperimentVariantRef[];
  
  // PostHog Integration
  posthogFlagKey: string;        // e.g., "exp_landing_black_friday_2025_11"
  posthogExperimentId?: string;  // PostHog experiment ID (if created via API)
  
  // Metrics
  primaryMetric: {
    event: string;               // e.g., "cta_clicked"
    property?: string;
  };
  guardrails?: Array<{
    event: string;               // e.g., "error_rate"
    threshold?: number;
  }>;
  
  // Traffic Allocation
  trafficAllocation: Record<string, number>; // e.g., { control: 50, test: 50 }
  
  // Status
  status: "draft" | "running" | "stopped" | "completed";
  startedAt?: string;
  endedAt?: string;
  
  // Results
  winner?: string;               // variantKey
  confidence?: number;
  
  // Metadata
  createdAt: string;
  createdBy: string;
  updatedAt?: string;
}
```

### ExperimentVariantRef

```typescript
interface ExperimentVariantRef {
  variantKey: string;            // "control" | "test" | "test2"
  revisionId?: string;           // Direct revision reference (preferred)
  releaseId?: string;            // Release version reference
  releaseVersion?: string;       // Semantic version (if release)
  
  // Metadata
  name?: string;                 // Human-readable name
  description?: string;
}
```

**Key Rule:** Variants MUST map to `revisionId` or `releaseId`, NOT arbitrary code.

---

## 🔄 Workflow

### 1. Create Experiment (Studio)

**User Flow:**
1. User generates variants in Studio (or selects from Submissions)
2. User creates Experiment via Wizard
3. User maps variants: control → revisionId1, test → revisionId2
4. User configures PostHog flag key, metrics, traffic allocation
5. System creates Experiment record

**API:**
```typescript
POST /api/experiments
{
  "name": "Landing Page - Black Friday 2025",
  "slug": "landing-bf-2025",
  "assetId": "asset_123",
  "variants": [
    { "variantKey": "control", "revisionId": "rev_abc" },
    { "variantKey": "test", "revisionId": "rev_def" }
  ],
  "posthogFlagKey": "exp_landing_bf_2025",
  "primaryMetric": { "event": "cta_clicked" },
  "trafficAllocation": { "control": 50, "test": 50 }
}
```

---

### 2. Runtime: Variant Selection + Exposure

**Public Route:** `/exp/[slug]/page.tsx`

**Flow:**
1. User visits `/exp/{slug}`
2. System fetches Experiment by slug
3. System calls PostHog: `posthog.getFeatureFlag(flagKey)`
4. PostHog returns variant assignment (e.g., "control" or "test")
5. **Exposure tracked automatically** (PostHog sends `$feature_flag_called` event)
6. System maps variant → revisionId
7. System renders Revision via ExperimentRunner

**Code:**
```typescript
// apps/demo/app/exp/[slug]/page.tsx
export default async function ExperimentPage({ params }: { params: { slug: string } }) {
  const experiment = await getExperimentBySlug(params.slug);
  const variant = await getVariantFromPostHog(experiment.posthogFlagKey);
  const revisionId = experiment.variants.find(v => v.variantKey === variant)?.revisionId;
  const revision = await getRevision(revisionId);
  
  return <ExperimentRunner experiment={experiment} revision={revision} variant={variant} />;
}
```

---

### 3. Event Tracking

**Event Schema:**

All events include context properties:
```typescript
{
  experiment_key: string;        // posthogFlagKey
  experiment_slug: string;
  variant: string;                // "control" | "test"
  submission_id?: string;         // If variant is from Submission
  revision_id: string;
  project_id?: string;
  artifact_hash?: string;
}
```

**Standard Events:**

1. **Global Events:**
   - `studio_experiment_viewed` - Page view
   - `studio_variant_rendered` - Variant rendered
   - `studio_flag_variant_unavailable` - Fallback used

2. **Conversion Events:**
   - `cta_clicked` - CTA button clicked
   - `form_started` - Form interaction started
   - `form_submitted` - Form submitted
   - `pricing_plan_selected` - Pricing plan selected
   - `purchase_completed` - Purchase completed (if ecom)

3. **Diagnostic Events:**
   - `studio_submission_fetch_failed` - Failed to fetch revision

**Implementation:**
```typescript
// apps/demo/src/lib/analytics/capture-with-context.ts
export function captureWithContext(
  eventName: string,
  props: Record<string, any>,
  context: ExperimentContext
) {
  posthog.capture(eventName, {
    ...props,
    experiment_key: context.experimentKey,
    variant: context.variant,
    revision_id: context.revisionId,
    // ... other context
  });
}
```

---

### 4. Results + Winner Selection

**Flow:**
1. System fetches results from PostHog API
2. System displays results in Studio UI
3. System identifies winner based on primary metric
4. User can promote winner to Submission

**API:**
```typescript
GET /api/experiments/[id]/results
// Returns aggregated results from PostHog

POST /api/experiments/[id]/promote-winner
// Creates Submission from winner revisionId
```

---

## 🔧 Implementation Details

### PostHog Client Setup

**File:** `apps/demo/src/lib/posthog/client.ts`

```typescript
import posthog from 'posthog-js';

export function initPostHog() {
  if (typeof window === 'undefined') return;
  
  posthog.init(
    process.env.NEXT_PUBLIC_POSTHOG_KEY!,
    {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
      loaded: (posthog) => {
        if (process.env.NODE_ENV === 'development') {
          posthog.debug();
        }
      },
    }
  );
  
  return posthog;
}
```

**Environment Variables:**
```bash
NEXT_PUBLIC_POSTHOG_KEY=phc_xxx
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

---

### useExperimentVariant Hook

**File:** `apps/demo/src/hooks/use-experiment-variant.ts`

```typescript
export function useExperimentVariant(
  flagKey: string,
  variantKeys: string[],
  fallback: string = "control"
) {
  const [variant, setVariant] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const posthog = getPostHog();
    if (!posthog) {
      setVariant(fallback);
      setIsReady(true);
      return;
    }
    
    // Get variant (this triggers exposure automatically)
    const assignedVariant = posthog.getFeatureFlag(flagKey);
    
    // Validate variant
    if (assignedVariant && variantKeys.includes(assignedVariant)) {
      setVariant(assignedVariant);
    } else {
      setVariant(fallback);
      if (assignedVariant) {
        // Log unavailable variant
        posthog.capture('studio_flag_variant_unavailable', {
          flag_key: flagKey,
          assigned_variant: assignedVariant,
          expected_variants: variantKeys,
        });
      }
    }
    
    setIsReady(true);
  }, [flagKey, variantKeys, fallback]);
  
  return { variant: variant || fallback, isReady };
}
```

**Key Points:**
- Hook must be called once per page view
- Exposure happens automatically via `getFeatureFlag()`
- Fallback to control if variant unavailable
- No flicker (use Suspense boundary)

---

### ExperimentRunner Component

**File:** `apps/demo/src/components/experiments/ExperimentRunner.tsx`

```typescript
interface ExperimentRunnerProps {
  experiment: Experiment;
  submissionsByVariant: Record<string, Submission>;
  renderMode?: "dsl" | "tsx";
  debug?: boolean;
}

export function ExperimentRunner({
  experiment,
  submissionsByVariant,
  renderMode = "tsx",
  debug = false,
}: ExperimentRunnerProps) {
  const { variant, isReady } = useExperimentVariant(
    experiment.posthogFlagKey,
    Object.keys(submissionsByVariant)
  );
  
  const posthog = usePostHog();
  
  useEffect(() => {
    if (!isReady || !posthog) return;
    
    // Track experiment view
    posthog.capture('studio_experiment_viewed', {
      experiment_key: experiment.posthogFlagKey,
      experiment_slug: experiment.slug,
      variant,
    });
  }, [isReady, variant]);
  
  if (!isReady) {
    return <ExperimentSkeleton />;
  }
  
  const submission = submissionsByVariant[variant] || submissionsByVariant["control"];
  
  if (!submission) {
    return <ErrorFallback message="Variant not found" />;
  }
  
  // Track variant rendered
  useEffect(() => {
    posthog?.capture('studio_variant_rendered', {
      experiment_key: experiment.posthogFlagKey,
      variant,
      submission_id: submission.id,
      revision_id: submission.dsl.id,
    });
  }, [variant, submission.id]);
  
  return (
    <div data-experiment-slug={experiment.slug} data-variant={variant}>
      {renderMode === "dsl" ? (
        <DSLRenderer dsl={submission.dsl} />
      ) : (
        <TSXRenderer code={submission.tsx} />
      )}
      {debug && <ExperimentDebugOverlay experiment={experiment} variant={variant} />}
    </div>
  );
}
```

---

### Experiment Wizard UI

**File:** `apps/demo/src/components/experiments/ExperimentWizard.tsx`

**Features:**
- Select Asset/Screen
- Select variants (from Submissions or Revisions)
- Configure PostHog flag key
- Set primary metric
- Set traffic allocation
- Generate public URL

**Flow:**
1. User selects Asset
2. User selects variants (control + test variants)
3. User configures PostHog settings
4. User sets metrics
5. System creates Experiment
6. System shows public URL: `/exp/{slug}`

---

## 🧪 Testing

### Unit Tests

**File:** `apps/demo/src/hooks/__tests__/use-experiment-variant.test.ts`

**Test Cases:**
- Fallback to control when PostHog not ready
- Fallback to control when variant not in list
- Correct variant returned when valid
- Exposure tracked correctly

---

### E2E Tests

**File:** `apps/demo/e2e/experiments.spec.ts`

**Test Cases:**
- `/exp/{slug}?forceVariant=control` → renders control
- `/exp/{slug}?forceVariant=test` → renders test
- Events tracked correctly
- No console errors

---

## 🚨 Known Risks & Mitigations

1. **Risk: Flicker (user sees control, then test)**
   - **Mitigation:** Suspense boundary, skeleton loader, bootstrap flags early

2. **Risk: Events without exposure (metrics don't work)**
   - **Mitigation:** Ensure `getFeatureFlag()` called before any events, validate exposure in PostHog

3. **Risk: Test accounts pollute results**
   - **Mitigation:** Use PostHog test account filtering, exclude internal users

4. **Risk: Multi-device/cookie reset → user sees 2 variants**
   - **Mitigation:** PostHog strategy: "Exclude from analysis" or "Use first seen variant"

---

## 📝 Acceptance Criteria

### Hard Requirements

1. ✅ `GET /exp/{slug}` renders variant according to PostHog flag
2. ✅ No flicker (doesn't show control before variant known)
3. ✅ Event `studio_variant_rendered` has correct variant/submission_id
4. ✅ CTA click generates `cta_clicked` with experiment context
5. ✅ E2E test passes on forceVariant
6. ✅ No new bundling issues (CSS/jsx-runtime)

---

## 🔗 Related Documents

- [A/B Testing Specification](../copilot/ab-testing-spec.md) - Detailed spec
- [A/B Testing Strategic Plan](../roadmap/AB_TESTING_STRATEGIC_PLAN.md) - Strategic plan
- [STUDIO_DOMAIN_MODEL.md](../architecture/STUDIO_DOMAIN_MODEL.md) - Domain model
- [MODULES_BOUNDARIES.md](../architecture/MODULES_BOUNDARIES.md) - Module boundaries

---

**Last Updated:** 2025-01-XX

