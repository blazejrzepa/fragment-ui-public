# 🧪 ROI Dashboard - Comprehensive Testing Guide

Complete guide for testing the Telemetry & ROI Dashboard functionality.

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Unit Tests](#unit-tests)
3. [API Testing](#api-testing)
4. [Dashboard UI Testing](#dashboard-ui-testing)
5. [Integration Testing](#integration-testing)
6. [End-to-End Scenarios](#end-to-end-scenarios)
7. [Edge Cases](#edge-cases)
8. [Performance Testing](#performance-testing)

---

## 🚀 Quick Start

### 1. Run Automated Tests

```bash
# Test ROI metrics functions
node test-roi-metrics.mjs

# Build telemetry package first if needed
cd packages/telemetry
pnpm build
cd ../..
node test-roi-metrics.mjs
```

### 2. Start Development Server

```bash
# Start the dashboard
cd apps/www
pnpm dev

# Open in browser
open http://localhost:3000/tools/roi-dashboard
```

### 3. Test API Endpoint

```bash
# Test API directly
curl http://localhost:3000/api/roi

# Or use browser
open http://localhost:3000/api/roi
```

---

## 🔬 Unit Tests

### Test 1: Lead Time Tracking

```typescript
import { trackLeadTime } from "@fragment_ui/telemetry/roi-metrics";

// Test case 1: Good lead time (< 1 day)
const startTime = Date.now() - 12 * 60 * 60 * 1000; // 12 hours ago
const endTime = Date.now();
const metric = trackLeadTime(startTime, endTime, {
  figmaUrl: "https://figma.com/file/123",
  prUrl: "https://github.com/repo/pull/456",
  componentName: "button",
});

console.assert(metric.value < 1.0, "Lead time should be < 1 day");
console.assert(metric.unit === "days", "Unit should be days");
console.assert(metric.type === "lead_time", "Type should be lead_time");

// Test case 2: Warning lead time (> 1 day)
const badStartTime = Date.now() - 2 * 24 * 60 * 60 * 1000; // 2 days ago
const badMetric = trackLeadTime(badStartTime, endTime);
console.assert(badMetric.value > 1.0, "Lead time should be > 1 day");
```

### Test 2: Adoption Rate

```typescript
import { trackAdoptionRate } from "@fragment_ui/telemetry/roi-metrics";

// Test case 1: Good adoption (≥ 80%)
const goodMetric = trackAdoptionRate("monthly", 100, 85);
console.assert(goodMetric.percentage >= 80, "Adoption should be ≥ 80%");
console.assert(goodMetric.status === "good", "Status should be good");

// Test case 2: Warning adoption (< 80%)
const warningMetric = trackAdoptionRate("monthly", 100, 75);
console.assert(warningMetric.percentage < 80, "Adoption should be < 80%");
console.assert(warningMetric.status === "warning", "Status should be warning");
```

### Test 3: Reuse Rate

```typescript
import { trackReuseRate } from "@fragment_ui/telemetry/roi-metrics";

// Test case 1: Good reuse (≥ 70%)
const goodMetric = trackReuseRate("button", 8, 10);
console.assert(goodMetric.percentage >= 70, "Reuse should be ≥ 70%");

// Test case 2: Warning reuse (< 70%)
const warningMetric = trackReuseRate("button", 5, 10);
console.assert(warningMetric.percentage < 70, "Reuse should be < 70%");
```

### Test 4: Time-to-Ship Reduction

```typescript
import { trackTimeToShip } from "@fragment_ui/telemetry/roi-metrics";

// Test case 1: Good reduction (≥ 40%)
const goodMetric = trackTimeToShip(10, 5, { projectId: "project-1" });
console.assert(goodMetric.reduction >= 40, "Reduction should be ≥ 40%");

// Test case 2: Warning reduction (< 40%)
const warningMetric = trackTimeToShip(10, 7, { projectId: "project-2" });
console.assert(warningMetric.reduction < 40, "Reduction should be < 40%");
```

### Test 5: Maintenance Cost Reduction

```typescript
import { trackMaintenanceCost } from "@fragment_ui/telemetry/roi-metrics";

// Test case 1: Good reduction (≥ 30%)
const goodMetric = trackMaintenanceCost("monthly", 100, 65);
console.assert(goodMetric.reduction >= 30, "Reduction should be ≥ 30%");

// Test case 2: Warning reduction (< 30%)
const warningMetric = trackMaintenanceCost("monthly", 100, 75);
console.assert(warningMetric.reduction < 30, "Reduction should be < 30%");
```

### Test 6: Onboarding Time

```typescript
import { trackOnboardingTime } from "@fragment_ui/telemetry/roi-metrics";

// Test case 1: Good onboarding (< 30 min)
const startTime = Date.now() - 20 * 60 * 1000; // 20 minutes ago
const endTime = Date.now();
const goodMetric = trackOnboardingTime(startTime, endTime, true, {
  userId: "user-123",
});
console.assert(goodMetric.value < 30, "Onboarding should be < 30 min");

// Test case 2: Warning onboarding (> 30 min)
const badStartTime = Date.now() - 45 * 60 * 1000; // 45 minutes ago
const badMetric = trackOnboardingTime(badStartTime, endTime, true);
console.assert(badMetric.value > 30, "Onboarding should be > 30 min");
```

---

## 🌐 API Testing

### Test API Endpoint

```bash
# Test GET /api/roi
curl -X GET http://localhost:3000/api/roi \
  -H "Content-Type: application/json" \
  | jq

# Expected response:
# {
#   "metrics": {
#     "leadTime": { "current": 0.8, "target": 1.0, "status": "good" },
#     "adoptionRate": { "current": 75, "target": 80, "status": "warning" },
#     ...
#   }
# }
```

### Test with Different Scenarios

```javascript
// test-api.js
async function testROIAPI() {
  const response = await fetch("http://localhost:3000/api/roi");
  const data = await response.json();
  
  // Verify structure
  console.assert(data.metrics, "Should have metrics object");
  console.assert(data.metrics.leadTime, "Should have leadTime");
  console.assert(data.metrics.adoptionRate, "Should have adoptionRate");
  console.assert(data.metrics.reuseRate, "Should have reuseRate");
  console.assert(data.metrics.timeToShip, "Should have timeToShip");
  console.assert(data.metrics.maintenanceCost, "Should have maintenanceCost");
  console.assert(data.metrics.onboardingTime, "Should have onboardingTime");
  
  // Verify values
  console.assert(data.metrics.leadTime.current >= 0, "Lead time should be >= 0");
  console.assert(data.metrics.adoptionRate.current >= 0 && data.metrics.adoptionRate.current <= 100, "Adoption rate should be 0-100%");
  
  console.log("✅ API test passed!");
}

testROIAPI();
```

---

## 🎨 Dashboard UI Testing

### Manual Testing Checklist

#### 1. Visual Rendering
- [ ] All 6 KPI cards are visible
- [ ] Status icons (✅ ⚠️ ❌) display correctly
- [ ] Progress bars render correctly
- [ ] Values are formatted correctly (days, %, min)
- [ ] Target values are displayed
- [ ] Colors match status (green/yellow/red)

#### 2. Status Indicators
- [ ] ✅ Green for "good" status
- [ ] ⚠️ Yellow for "warning" status
- [ ] ❌ Red for "error" status (if implemented)

#### 3. Progress Bars
- [ ] Progress bars fill correctly
- [ ] Progress bars don't exceed 100%
- [ ] Progress bars use correct colors

#### 4. Responsive Design
- [ ] Dashboard works on mobile (1 column)
- [ ] Dashboard works on tablet (2 columns)
- [ ] Dashboard works on desktop (3 columns)
- [ ] Cards stack properly on smaller screens

### Browser Console Testing

```javascript
// Open browser console on /tools/roi-dashboard

// Test 1: Check if metrics are loaded
console.log("Metrics:", window.metrics); // Should be undefined (server-side)

// Test 2: Check API call
fetch("/api/roi")
  .then(r => r.json())
  .then(data => {
    console.log("API Response:", data);
    console.assert(data.metrics, "Should have metrics");
  });

// Test 3: Test status colors
const statusColors = {
  good: "text-green-600",
  warning: "text-yellow-600",
  error: "text-red-600",
};
console.log("Status colors:", statusColors);
```

---

## 🔗 Integration Testing

### Test Full Flow

```typescript
// test-integration.ts
import {
  trackLeadTime,
  trackAdoptionRate,
  trackReuseRate,
  trackTimeToShip,
  trackMaintenanceCost,
  trackOnboardingTime,
  roiMetricToEvent,
} from "@fragment_ui/telemetry/roi-metrics";

async function testFullFlow() {
  // 1. Track metrics
  const leadTime = trackLeadTime(
    Date.now() - 12 * 60 * 60 * 1000,
    Date.now(),
    { figmaUrl: "https://figma.com/file/123", prUrl: "https://github.com/repo/pull/1" }
  );
  
  const adoption = trackAdoptionRate("monthly", 100, 85);
  const reuse = trackReuseRate("button", 8, 10);
  const timeToShip = trackTimeToShip(10, 5);
  const maintenance = trackMaintenanceCost("monthly", 100, 65);
  const onboarding = trackOnboardingTime(
    Date.now() - 20 * 60 * 1000,
    Date.now(),
    true
  );
  
  // 2. Convert to events
  const events = [
    roiMetricToEvent(leadTime),
    roiMetricToEvent(adoption),
    roiMetricToEvent(reuse),
    roiMetricToEvent(timeToShip),
    roiMetricToEvent(maintenance),
    roiMetricToEvent(onboarding),
  ];
  
  // 3. Send to telemetry API (if implemented)
  // await fetch("/api/telemetry", {
  //   method: "POST",
  //   body: JSON.stringify(events),
  // });
  
  // 4. Verify dashboard shows updated metrics
  const dashboardResponse = await fetch("/api/roi");
  const dashboardData = await dashboardResponse.json();
  
  console.log("✅ Integration test complete!");
  console.log("Metrics tracked:", events.length);
  console.log("Dashboard data:", dashboardData);
}

testFullFlow();
```

---

## 🎯 End-to-End Scenarios

### Scenario 1: New Developer Onboarding

```typescript
// Simulate new developer onboarding
const onboardingStart = Date.now();

// Step 1: Install Fragment UI
await installFragmentUI();

// Step 2: First component render
const firstRenderTime = Date.now();
const onboarding = trackOnboardingTime(
  onboardingStart,
  firstRenderTime,
  true,
  { userId: "new-dev-1" }
);

console.log(`Onboarding time: ${onboarding.value.toFixed(1)} minutes`);
console.assert(onboarding.value < 30, "Should be < 30 minutes");
```

### Scenario 2: Component Development Workflow

```typescript
// Simulate Figma → PR workflow
const figmaCreated = Date.now();

// ... designer creates Figma design ...

// Developer starts implementation
const implementationStart = Date.now();

// ... developer implements component ...

// PR created
const prCreated = Date.now();
const leadTime = trackLeadTime(figmaCreated, prCreated, {
  figmaUrl: "https://figma.com/file/button-design",
  prUrl: "https://github.com/repo/pull/123",
  componentName: "button",
});

console.log(`Lead time: ${leadTime.value.toFixed(2)} days`);
console.assert(leadTime.value <= 1.0, "Should be ≤ 1 day");
```

### Scenario 3: Monthly Metrics Review

```typescript
// Simulate monthly metrics collection
const monthlyAdoption = trackAdoptionRate("monthly", 100, 85);
const monthlyReuse = trackReuseRate("button", 8, 10);
const monthlyMaintenance = trackMaintenanceCost("monthly", 100, 65);

console.log("Monthly Metrics:");
console.log(`  Adoption: ${monthlyAdoption.percentage}%`);
console.log(`  Reuse: ${monthlyReuse.percentage}%`);
console.log(`  Maintenance Reduction: ${monthlyMaintenance.reduction}%`);

// Verify all metrics meet targets
const allGood = 
  monthlyAdoption.percentage >= 80 &&
  monthlyReuse.percentage >= 70 &&
  monthlyMaintenance.reduction >= 30;

console.assert(allGood, "All metrics should meet targets");
```

---

## ⚠️ Edge Cases

### Test 1: Zero Values

```typescript
// Test with zero values
const zeroAdoption = trackAdoptionRate("monthly", 0, 0);
console.assert(zeroAdoption.percentage === 0, "Should handle zero total");

const zeroReuse = trackReuseRate("button", 0, 10);
console.assert(zeroReuse.percentage === 0, "Should handle zero repositories");
```

### Test 2: Negative Values

```typescript
// Test with negative values (should not happen, but test anyway)
const negativeTime = trackTimeToShip(-10, 5);
console.assert(negativeTime.reduction >= 0, "Should handle negative values");
```

### Test 3: Very Large Values

```typescript
// Test with very large values
const largeLeadTime = trackLeadTime(
  Date.now() - 365 * 24 * 60 * 60 * 1000, // 1 year ago
  Date.now()
);
console.assert(largeLeadTime.value > 0, "Should handle large time spans");
```

### Test 4: Missing Metadata

```typescript
// Test with missing optional metadata
const minimalLeadTime = trackLeadTime(Date.now() - 86400000, Date.now());
console.assert(minimalLeadTime.value > 0, "Should work without metadata");
```

---

## ⚡ Performance Testing

### Test API Response Time

```javascript
// test-performance.js
async function testAPIPerformance() {
  const iterations = 100;
  const times = [];
  
  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    await fetch("http://localhost:3000/api/roi");
    const end = performance.now();
    times.push(end - start);
  }
  
  const avg = times.reduce((a, b) => a + b, 0) / times.length;
  const min = Math.min(...times);
  const max = Math.max(...times);
  
  console.log(`API Performance (${iterations} requests):`);
  console.log(`  Average: ${avg.toFixed(2)}ms`);
  console.log(`  Min: ${min.toFixed(2)}ms`);
  console.log(`  Max: ${max.toFixed(2)}ms`);
  
  // Should be < 100ms for simple API
  console.assert(avg < 100, "API should respond in < 100ms");
}

testAPIPerformance();
```

### Test Dashboard Load Time

```javascript
// In browser console on /tools/roi-dashboard
performance.mark("dashboard-start");

// Wait for page load
window.addEventListener("load", () => {
  performance.mark("dashboard-end");
  performance.measure("dashboard-load", "dashboard-start", "dashboard-end");
  
  const measure = performance.getEntriesByName("dashboard-load")[0];
  console.log(`Dashboard load time: ${measure.duration.toFixed(2)}ms`);
  
  // Should be < 2 seconds
  console.assert(measure.duration < 2000, "Dashboard should load in < 2s");
});
```

---

## 📊 Test Data Generation

### Generate Test Metrics

```typescript
// generate-test-data.ts
import {
  trackLeadTime,
  trackAdoptionRate,
  trackReuseRate,
  trackTimeToShip,
  trackMaintenanceCost,
  trackOnboardingTime,
} from "@fragment_ui/telemetry/roi-metrics";

function generateTestMetrics() {
  return {
    // Good metrics
    good: {
      leadTime: trackLeadTime(Date.now() - 12 * 60 * 60 * 1000, Date.now()),
      adoptionRate: trackAdoptionRate("monthly", 100, 85),
      reuseRate: trackReuseRate("button", 8, 10),
      timeToShip: trackTimeToShip(10, 5),
      maintenanceCost: trackMaintenanceCost("monthly", 100, 65),
      onboardingTime: trackOnboardingTime(
        Date.now() - 20 * 60 * 1000,
        Date.now(),
        true
      ),
    },
    
    // Warning metrics
    warning: {
      leadTime: trackLeadTime(Date.now() - 1.5 * 24 * 60 * 60 * 1000, Date.now()),
      adoptionRate: trackAdoptionRate("monthly", 100, 75),
      reuseRate: trackReuseRate("button", 5, 10),
      timeToShip: trackTimeToShip(10, 7),
      maintenanceCost: trackMaintenanceCost("monthly", 100, 75),
      onboardingTime: trackOnboardingTime(
        Date.now() - 35 * 60 * 1000,
        Date.now(),
        true
      ),
    },
    
    // Error metrics (if implemented)
    error: {
      leadTime: trackLeadTime(Date.now() - 3 * 24 * 60 * 60 * 1000, Date.now()),
      adoptionRate: trackAdoptionRate("monthly", 100, 50),
      reuseRate: trackReuseRate("button", 2, 10),
      timeToShip: trackTimeToShip(10, 9),
      maintenanceCost: trackMaintenanceCost("monthly", 100, 95),
      onboardingTime: trackOnboardingTime(
        Date.now() - 60 * 60 * 1000,
        Date.now(),
        true
      ),
    },
  };
}

export { generateTestMetrics };
```

---

## ✅ Testing Checklist

### Functionality
- [ ] All 6 metric types track correctly
- [ ] Status calculation works (good/warning/error)
- [ ] Progress bars display correctly
- [ ] API returns correct structure
- [ ] Dashboard renders all metrics
- [ ] Edge cases handled gracefully

### UI/UX
- [ ] Dashboard is responsive
- [ ] Status icons display correctly
- [ ] Colors match status
- [ ] Values are formatted correctly
- [ ] Progress bars are accurate
- [ ] Loading states work (if implemented)

### Performance
- [ ] API responds in < 100ms
- [ ] Dashboard loads in < 2s
- [ ] No memory leaks
- [ ] Handles large datasets

### Integration
- [ ] Metrics can be sent to telemetry API
- [ ] Dashboard fetches from API
- [ ] End-to-end flow works
- [ ] Error handling works

---

## 🐛 Troubleshooting

### Issue: API returns 500 error
**Solution:** Check server logs, verify API route exists

### Issue: Dashboard shows no data
**Solution:** Check API endpoint, verify metrics are being tracked

### Issue: Status indicators wrong
**Solution:** Verify status calculation logic in dashboard component

### Issue: Progress bars not rendering
**Solution:** Check CSS classes, verify width calculations

---

## 📝 Next Steps

1. **Add Database Integration** - Store metrics in database
2. **Add Historical Data** - Show trends over time
3. **Add Export Functionality** - Export reports as PDF/CSV
4. **Add Filters** - Filter by date range, project, team
5. **Add Alerts** - Notify when metrics drop below targets
6. **Add GitHub Integration** - Automatically track PR metrics

---

*Last updated: 2025-01-05*

