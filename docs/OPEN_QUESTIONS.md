# Open Questions

**Purpose:** Track items that need verification  
**Audience:** Engineers, maintainers  
**When to read:** When verifying system details

---

## TODO(verify) Items

### Infrastructure

- [ ] **Deployment URLs:** Verify actual production URLs for Portal, Studio, Storybook
- [ ] **Database:** Verify if database is used or planned (currently file-based)
- [ ] **Authentication:** Verify if Studio requires authentication in production
- [ ] **Rate Limiting:** Verify if rate limiting is implemented for APIs
- [ ] **Error Tracking:** Verify if error tracking service is used (Sentry, etc.)

### Monitoring

- [ ] **Log Retention:** Verify Vercel log retention limits
- [ ] **Event Sampling:** Verify PostHog event sampling configuration
- [ ] **Alerts:** Verify if alerts are configured and what they monitor

### Storage

- [ ] **Revision Persistence:** Verify how Revisions are persisted (currently in-memory?)
- [ ] **File vs Database:** Verify migration plan from file-based to database storage
- [ ] **Backup Strategy:** Verify backup strategy for file-based storage

### Security

- [ ] **API Authentication:** Verify authentication requirements for Studio APIs
- [ ] **API Keys:** Verify where API keys are stored and how they're rotated
- [ ] **PII Handling:** Verify if any PII is stored and how it's handled

### Configuration

- [ ] **Environment Variables:** Verify all required environment variables
- [ ] **Feature Flags:** Verify if feature flags are used and where
- [ ] **Configuration Management:** Verify how configuration is managed

---

## Verification Steps

For each TODO(verify) item:

1. **Check Code:** Search codebase for relevant files
2. **Check Documentation:** Review existing documentation
3. **Check Configuration:** Review config files
4. **Ask Team:** Ask team members if unclear
5. **Update Docs:** Update documentation with verified information

---

## How to Resolve

1. **Investigate:** Use codebase search, read files, check configs
2. **Verify:** Confirm with team or by testing
3. **Document:** Update relevant documentation
4. **Remove:** Remove TODO(verify) from this list

---

**Last Updated:** 2025-01-XX

