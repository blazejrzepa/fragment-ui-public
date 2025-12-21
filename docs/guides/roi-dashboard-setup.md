# ROI Dashboard Setup Guide

Guide for setting up and using the ROI Dashboard to track Fragment UI KPIs.

## Overview

The ROI Dashboard tracks key performance indicators (KPIs) required for business justification:

- **Lead Time** - Figma screen → code PR (target: ≤ 1 day)
- **DS Adoption Rate** - % of new views built with DS (target: ≥ 80%)
- **Component Reuse Rate** - % of components reused in ≥2 repos (target: ≥ 70%)
- **Time-to-Ship Reduction** - Reduction in time-to-ship (target: 40-60%)
- **UI Maintenance Cost Reduction** - Reduction in maintenance costs (target: ≥ 30%)
- **Onboarding Time** - Time to first component render (target: < 30 min)

## Accessing the Dashboard

Navigate to: `https://fragment-ui.dev/tools/roi-dashboard`

## Metrics Collection

### Lead Time Tracking

Track time from Figma design to code PR:

```typescript
import { trackLeadTime } from "@fragment_ui/telemetry/roi-metrics";

// When design is created
const startTime = Date.now();

// When PR is created
const endTime = Date.now();

trackLeadTime(startTime, endTime, {
  figmaUrl: "https://figma.com/...",
  prUrl: "https://github.com/.../pull/123",
  componentName: "button",
});
```

### Adoption Rate Tracking

Track DS adoption:

```typescript
import { trackAdoptionRate } from "@fragment_ui/telemetry/roi-metrics";

trackAdoptionRate("monthly", totalViews, dsViews);
```

### Reuse Rate Tracking

Track component reuse:

```typescript
import { trackReuseRate } from "@fragment_ui/telemetry/roi-metrics";

trackReuseRate("button", repositoryCount, totalRepositories);
```

### Time-to-Ship Tracking

Track time-to-ship reduction:

```typescript
import { trackTimeToShip } from "@fragment_ui/telemetry/roi-metrics";

trackTimeToShip(beforeDS, afterDS, { projectId: "project-1" });
```

### Maintenance Cost Tracking

Track maintenance cost reduction:

```typescript
import { trackMaintenanceCost } from "@fragment_ui/telemetry/roi-metrics";

trackMaintenanceCost("monthly", beforeDS, afterDS);
```

### Onboarding Time Tracking

Track onboarding time:

```typescript
import { trackOnboardingTime } from "@fragment_ui/telemetry/roi-metrics";

const startTime = Date.now();
// ... user installs and renders first component
const endTime = Date.now();

trackOnboardingTime(startTime, endTime, true, { userId: "user-123" });
```

## GitHub Integration

### PR Tracking

To track lead time from Figma to PR:

1. Add Figma link to PR description
2. GitHub webhook triggers metric collection
3. Lead time calculated automatically

### Component Usage Tracking

Track component usage in PRs:

1. Scan PR for Fragment UI component imports
2. Track component usage
3. Calculate reuse rates

## Data Storage

### Current Implementation

- Metrics stored in memory (development)
- API endpoint: `/api/roi`

### Production Setup

For production, implement:

1. **Database Storage**
   - PostgreSQL or MongoDB
   - Store metrics with timestamps
   - Aggregate for reporting

2. **Analytics Service**
   - PostHog, Mixpanel, or custom
   - Real-time analytics
   - Historical data

3. **Data Retention**
   - Keep raw data for 1 year
   - Aggregate data for 3+ years
   - Archive old data

## Dashboard Customization

### Adding New Metrics

1. Add metric type to `roi-metrics.ts`
2. Add tracking function
3. Update dashboard UI
4. Update API endpoint

### Custom Reports

Create custom reports by:
- Filtering by date range
- Filtering by project/team
- Exporting to CSV/PDF

## Best Practices

1. **Track Consistently** - Track all metrics consistently
2. **Set Baselines** - Establish baselines before DS adoption
3. **Regular Reviews** - Review metrics monthly/quarterly
4. **Action on Data** - Use metrics to drive improvements
5. **Share Results** - Share ROI with stakeholders

## Troubleshooting

### Metrics Not Showing

- Check telemetry is enabled
- Verify API endpoint is accessible
- Check data collection is working

### Incorrect Metrics

- Verify tracking functions are called correctly
- Check data aggregation logic
- Review timezone handling

---

*Last updated: 2025-01-05*

