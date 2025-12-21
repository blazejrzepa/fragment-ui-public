# Operations Documentation

**Purpose:** Production operations, deployment, and runbooks  
**Audience:** DevOps, SRE, on-call engineers  
**When to read:** When deploying, troubleshooting, or responding to incidents

---

## 📋 Overview

This section contains operational documentation for running Fragment UI in production.

---

## 🚀 Quick Navigation

1. **[Deployment](./deployment.md)** - Deployment process and configuration
2. **[Release Process](./release-process.md)** - Release workflow and checklist
3. **[Monitoring](./monitoring.md)** - Logging, metrics, dashboards
4. **[Troubleshooting](./troubleshooting.md)** - Common issues and solutions
5. **[Runbooks](./runbooks/)** - Operational procedures

---

## 🎯 Key Topics

### Deployment

- **Platform:** Vercel (Next.js apps)
- **Static Assets:** Registry JSON files (CDN-cached)
- **Environment Variables:** OpenAI, PostHog keys

### Monitoring

- **Logging:** Application logs (TODO: verify location)
- **Metrics:** PostHog analytics, custom telemetry
- **Dashboards:** ROI dashboard, component analytics

### Release Process

1. **Version Bump:** Semantic versioning
2. **Changelog:** Update CHANGELOG.md
3. **GitHub Release:** Create release with notes
4. **Deploy:** Automatic via Vercel

---

## 📚 Related Documentation

- [Development Guide](../development/README.md) - Development workflows
- [Architecture Documentation](../architecture/README.md) - System design

---

**Last Updated:** 2025-01-XX

