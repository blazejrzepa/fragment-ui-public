---
title: Performance Tests
---

This document describes the performance testing setup for Fragment UI, including bundle size
limits, Lighthouse CI integration, and Core Web Vitals tracking.

## Overview

Performance tests ensure that Fragment UI components maintain good performance
characteristics and don't introduce bundle size regressions. The tests include:

1. **Bundle Size Limits** - Enforces size limits for individual components and
   the entire package
2. **Lighthouse CI** - Automated performance audits using Lighthouse
3. **Core Web Vitals** - Tracks key performance metrics (LCP, FID, CLS, etc.)

## Bundle Size Limits

### Running Bundle Size Analysis

```bash
pnpm bundle:analyze
```

This command:

- Analyzes all component files
- Calculates gzipped and uncompressed sizes
- Checks against configured limits
- Saves results to `apps/www/public/bundle-sizes/`
- Exits with error code if limits are exceeded

### Current Limits

```json
{
  // Individual component limits (gzipped)
  componentMaxGzipped: 50000,    // 50KB per component
  componentMaxSize: 150000,      // 150KB per component (uncompressed)
  
  // Package limits
  totalMaxGzipped: 500000,       // 500KB total gzipped
  totalMaxSize: 1500000,         // 1.5MB total uncompressed
  
  // Average limits
  averageMaxGzipped: 30000,      // 30KB average per component
  averageMaxSize: 100000,        // 100KB average per component
}
```

### Adjusting Limits

Edit `scripts/analyze-bundle-size.mjs` and modify the `BUNDLE_LIMITS`
constant.

### Viewing Results

Results are available at:

- **Current:** `apps/www/public/bundle-sizes/current.json`
- **History:** `apps/www/public/bundle-sizes/history.json`
- **Web UI:** [/docs/tools/bundle-tracking](/docs/tools/bundle-tracking)
  (after running analysis)

## Lighthouse CI

### Setup

Lighthouse CI is configured in `lighthouserc.js` with performance budgets and
assertions.

### Running Locally

1. Start the Next.js app:

```bash
pnpm --filter @fragment_ui/www start
```

2. In another terminal, run Lighthouse CI:

```bash
pnpm lighthouse
```

### Configuration

The Lighthouse CI configuration (`lighthouserc.js`) includes:

- **Performance budgets:** Minimum scores for Performance (80%),
  Accessibility (90%), Best Practices (80%), SEO (80%)
- **Core Web Vitals:** Maximum values for FCP, LCP, CLS, TBT, Speed Index
- **Resource budgets:** Total byte weight (5MB), DOM size (1500 nodes)

### Adjusting Thresholds

Edit `lighthouserc.js`:

```javascript
assertions: {
  "categories:performance": ["error", { minScore: 0.8 }],
  "first-contentful-paint": ["error", { maxNumericValue: 2000 }],
  // ... adjust thresholds as needed
}
```

## Core Web Vitals

### Metrics Tracked

- **First Contentful Paint (FCP):** Time until first content is rendered
  (target: < 1.8s)
- **Largest Contentful Paint (LCP):** Time until largest content is rendered
  (target: < 2.5s)
- **Cumulative Layout Shift (CLS):** Visual stability score (target: < 0.1)
- **Total Blocking Time (TBT):** Time page is blocked from responding (target:
  < 200ms)
- **Speed Index:** How quickly content is visually displayed (target: <
  3.4s)

## CI/CD Integration

### GitHub Actions

Performance tests run automatically in
`.github/workflows/performance.yml`:

- On every pull request
- On pushes to main branch
- Bundle size checks in CI workflow

### Failing Builds

Builds will fail if:

- Bundle size exceeds configured limits
- Lighthouse scores fall below thresholds
- Core Web Vitals exceed maximum values

## Best Practices

- **Monitor bundle size:** Run bundle analysis before each PR
- **Optimize large components:** Use code splitting and lazy loading
- **Review Lighthouse reports:** Address performance issues early
- **Test on real devices:** Lighthouse CI tests on CI, but real device testing
  is valuable
- **Set realistic budgets:** Adjust limits based on actual requirements

## Troubleshooting

### Bundle Size Exceeded

If bundle size limits are exceeded:

- Check for unnecessary dependencies
- Use code splitting for large components
- Remove unused code and dead code elimination
- Consider lazy loading for rarely used components

### Lighthouse Fails

If Lighthouse tests fail:

- Review Lighthouse report for specific issues
- Optimize images and assets
- Reduce JavaScript execution time
- Minimize render-blocking resources

## Links

- [Test Guide](/docs/testing/test-guide)
- [Visual Regression Testing](/docs/testing/visual-regression)
- [Bundle Size Tracking](/docs/tools/bundle-tracking)
- [Lighthouse CI Documentation](https://github.com/GoogleChrome/lighthouse-ci)

