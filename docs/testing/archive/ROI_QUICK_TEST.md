# 🚀 ROI Dashboard - Quick Test Guide

Quick reference for testing the ROI Dashboard.

## ⚡ Quick Start

### 1. Run Automated Tests

```bash
# Test ROI metrics functions
node test-roi-metrics.mjs

# Test end-to-end (requires dev server running)
node test-roi-dashboard-e2e.mjs
```

### 2. Start Dev Server

```bash
cd apps/www
pnpm dev
```

### 3. Open Dashboard

```
http://localhost:3000/tools/roi-dashboard
```

### 4. Test API

```bash
curl http://localhost:3000/api/roi | jq
```

---

## ✅ Quick Checklist

### Basic Functionality
- [ ] Dashboard loads without errors
- [ ] All 6 KPI cards are visible
- [ ] Status icons display (✅ ⚠️ ❌)
- [ ] Progress bars render
- [ ] Values are formatted correctly

### API
- [ ] `/api/roi` returns 200
- [ ] Response has all 6 metrics
- [ ] Values are valid (0-100%, positive numbers)

### Visual
- [ ] Status colors match (green/yellow/red)
- [ ] Progress bars fill correctly
- [ ] Responsive on mobile/tablet/desktop

---

## 🧪 Test Scenarios

### Scenario 1: Check All Metrics

```bash
# In browser console on /tools/roi-dashboard
fetch('/api/roi')
  .then(r => r.json())
  .then(data => {
    console.log('Metrics:', data.metrics);
    console.assert(data.metrics.leadTime, 'Has leadTime');
    console.assert(data.metrics.adoptionRate, 'Has adoptionRate');
    console.assert(data.metrics.reuseRate, 'Has reuseRate');
    console.assert(data.metrics.timeToShip, 'Has timeToShip');
    console.assert(data.metrics.maintenanceCost, 'Has maintenanceCost');
    console.assert(data.metrics.onboardingTime, 'Has onboardingTime');
  });
```

### Scenario 2: Verify Status Logic

```bash
# Status should be:
# - "good" if metric meets target
# - "warning" if metric is below target
# - "error" if metric is significantly below target

fetch('/api/roi')
  .then(r => r.json())
  .then(data => {
    const m = data.metrics;
    
    // Lead Time: good if <= target
    console.assert(
      (m.leadTime.current <= m.leadTime.target) === (m.leadTime.status === 'good'),
      'Lead time status logic'
    );
    
    // Adoption Rate: good if >= target
    console.assert(
      (m.adoptionRate.current >= m.adoptionRate.target) === (m.adoptionRate.status === 'good'),
      'Adoption rate status logic'
    );
  });
```

### Scenario 3: Test Performance

```bash
# In browser console
const start = performance.now();
fetch('/api/roi')
  .then(() => {
    const time = performance.now() - start;
    console.log(`API response time: ${time.toFixed(2)}ms`);
    console.assert(time < 100, 'Should be < 100ms');
  });
```

---

## 🐛 Common Issues

### Issue: Dashboard shows no data
**Fix:** Check if dev server is running, verify API endpoint

### Issue: API returns 500
**Fix:** Check server logs, verify route exists

### Issue: Status indicators wrong
**Fix:** Check status calculation in dashboard component

---

## 📚 More Details

See [ROI_DASHBOARD_TESTING.md](./ROI_DASHBOARD_TESTING.md) for comprehensive testing guide.

---

*Last updated: 2025-01-05*

