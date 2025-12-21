# Monitoring

**Purpose:** Logging, metrics, and observability  
**Audience:** DevOps, SRE, on-call engineers  
**When to read:** When setting up monitoring or investigating issues

---

## Overview

Fragment UI uses multiple monitoring and analytics tools for observability.

---

## Monitoring Stack

### Application Monitoring

- **Vercel Analytics:** Built-in Next.js analytics (TODO: verify if enabled)
- **Application Logs:** Vercel function logs
- **Error Tracking:** (TODO: verify if error tracking service used)

### Analytics

- **PostHog:** User analytics, feature flags, A/B testing
- **Custom Telemetry:** Fragment UI telemetry package
- **ROI Dashboard:** Design system metrics

### Performance

- **Lighthouse CI:** Performance budgets
- **Bundle Analysis:** Automated bundle size tracking
- **Vercel Analytics:** Web Vitals

---

## Logging

### Application Logs

**Location:** Vercel Dashboard → Project → Logs

**Log Levels:**
- `error` - Errors requiring attention
- `warn` - Warnings
- `info` - Informational messages
- `debug` - Debug information (development only)

### Log Format

```typescript
console.error('[Studio] Error generating DSL:', error)
console.warn('[Studio] Warning: Invalid patch operation')
console.info('[Studio] DSL generated successfully')
```

---

## Metrics

### PostHog Metrics

- **User Events:** Component usage, feature adoption
- **Experiment Metrics:** A/B test results
- **Custom Events:** Studio events (dsl_generated, patch_applied, etc.)

### Telemetry Metrics

Fragment UI telemetry package tracks:

- **Component Usage:** Which components are used
- **Adoption Rate:** Design system adoption
- **Time to First UI (TTFUI):** Time to generate first UI
- **A11y Violations:** Accessibility issues

### ROI Dashboard

Tracks design system KPIs:

- **Adoption Rate:** % of projects using Fragment UI
- **Component Reuse:** Most used components
- **Time Saved:** Estimated time saved by using components
- **Cost Savings:** Estimated cost savings

---

## Dashboards

### Vercel Dashboard

- **Deployments:** Deployment status and history
- **Analytics:** Web Vitals, traffic
- **Logs:** Application logs
- **Functions:** Serverless function metrics

### PostHog Dashboard

- **Events:** User events and analytics
- **Experiments:** A/B test results
- **Feature Flags:** Flag usage and performance

### ROI Dashboard

- **URL:** `/tools/roi-dashboard` (in Portal app)
- **Metrics:** Adoption, reuse, time saved, cost savings

---

## Alerts

### Current Alerts

- **Build Failures:** GitHub Actions notifications
- **Deployment Failures:** Vercel notifications
- **Test Failures:** CI/CD notifications

### Recommended Alerts

- **Error Rate:** Alert if error rate > threshold
- **Response Time:** Alert if p95 > threshold
- **Uptime:** Alert if service down

---

## Troubleshooting

### Common Issues

1. **High Error Rate**
   - Check Vercel logs
   - Check PostHog for error events
   - Review recent deployments

2. **Slow Response Times**
   - Check Vercel Analytics for Web Vitals
   - Review bundle sizes
   - Check database queries (if applicable)

3. **Missing Events**
   - Verify PostHog configuration
   - Check network requests
   - Verify event tracking code

---

## Gotchas

- **Log Retention:** Vercel logs have retention limits (TODO: verify)
- **Event Sampling:** PostHog may sample events (check config)
- **Bundle Size:** Monitor bundle size increases

---

## Next Steps

- [Troubleshooting](./troubleshooting.md) - Common issues
- [Runbooks](./runbooks/) - Operational procedures

---

**Last Updated:** 2025-01-XX

