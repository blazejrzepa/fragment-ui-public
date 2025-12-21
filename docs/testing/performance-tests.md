# Performance Tests

This document describes the performance testing setup for Fragment UI, including bundle size limits, Lighthouse CI integration, and Core Web Vitals tracking.

## Overview

Performance tests ensure that Fragment UI components maintain good performance characteristics and don't introduce bundle size regressions. The tests include:

1. **Bundle Size Limits** - Enforces size limits for individual components and the entire package
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

```javascript
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

Edit `scripts/analyze-bundle-size.mjs` and modify the `BUNDLE_LIMITS` constant:

```javascript
const BUNDLE_LIMITS = {
  componentMaxGzipped: 50000,  // Adjust as needed
  // ... other limits
};
```

### Viewing Results

Results are available at:
- **Current**: `apps/www/public/bundle-sizes/current.json`
- **History**: `apps/www/public/bundle-sizes/history.json`
- **Web UI**: `/docs/tools/bundle-tracking` (after running analysis)

## Lighthouse CI

### Setup

Lighthouse CI is configured in `lighthouserc.js` with performance budgets and assertions.

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

- **Performance budgets**: Minimum scores for Performance (80%), Accessibility (90%), Best Practices (80%), SEO (80%)
- **Core Web Vitals**: Maximum values for FCP, LCP, CLS, TBT, Speed Index
- **Resource budgets**: Total byte weight (5MB), DOM size (1500 nodes)

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

Core Web Vitals are tracked through Lighthouse CI:

- **First Contentful Paint (FCP)**: < 2000ms
- **Largest Contentful Paint (LCP)**: < 2500ms
- **Cumulative Layout Shift (CLS)**: < 0.1
- **Total Blocking Time (TBT)**: < 300ms
- **Speed Index**: < 3000ms

## CI/CD Integration

### GitHub Actions

Performance tests run automatically in CI/CD:

1. **Bundle Size Check** - Runs on every PR and push to main
   - Location: `.github/workflows/performance.yml`
   - Fails build if limits exceeded

2. **Lighthouse CI** - Runs on PRs and main branch
   - Location: `.github/workflows/performance.yml`
   - Note: Requires running server (may need Vercel preview or self-hosted setup)

### Adding to CI

The bundle size check is already integrated into the main CI workflow (`.github/workflows/ci.yml`). It runs after the build step and fails if limits are exceeded.

## Troubleshooting

### Bundle Size Limit Exceeded

If a component exceeds the bundle size limit:

1. **Check the component** - Look for large dependencies or unused code
2. **Consider code splitting** - Split large components into smaller pieces
3. **Optimize imports** - Use tree-shaking friendly imports
4. **Review dependencies** - Check if all dependencies are necessary

### Lighthouse CI Not Running

If Lighthouse CI doesn't run in CI/CD:

1. **Check server availability** - Lighthouse CI needs a running server
2. **Use preview deployments** - Consider using Vercel preview URLs
3. **Self-hosted option** - Set up a Lighthouse CI server for automated runs

### Performance Regressions

If performance scores drop:

1. **Check bundle size** - Large bundles affect performance
2. **Review images** - Ensure images are optimized
3. **Check dependencies** - Large dependencies can slow down the app
4. **Review Core Web Vitals** - Check specific metrics that degraded

## Best Practices

1. **Regular monitoring** - Run `pnpm bundle:analyze` before committing
2. **Incremental checks** - Check bundle sizes when adding new components
3. **Performance budgets** - Keep performance budgets in mind when adding features
4. **Code splitting** - Use dynamic imports for large components
5. **Tree shaking** - Use ESM imports to enable tree shaking

## Resources

- [Lighthouse CI Documentation](https://github.com/GoogleChrome/lighthouse-ci)
- [Core Web Vitals](https://web.dev/vitals/)
- [Bundle Size Best Practices](https://web.dev/reduce-javascript-payloads-with-code-splitting/)

