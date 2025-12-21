# Incident Response Runbook

**Purpose:** Respond to production incidents  
**Audience:** On-call engineers  
**When to use:** When production issue is detected

---

## Prerequisites

- Access to Vercel dashboard
- Access to GitHub
- Access to PostHog dashboard
- Communication channel (Slack/Discord)

---

## Incident Response Steps

### 1. Acknowledge Incident

- [ ] Acknowledge in incident channel
- [ ] Assess severity (P0/P1/P2)
- [ ] Notify team if P0/P1

### 2. Assess Impact

- [ ] Check Vercel dashboard for deployment status
- [ ] Check application logs for errors
- [ ] Check PostHog for error events
- [ ] Determine affected users/services

### 3. Investigate

- [ ] Review recent deployments
- [ ] Check application logs
- [ ] Review error messages
- [ ] Check environment variables

### 4. Mitigate

- [ ] If deployment issue: Rollback to previous version
- [ ] If configuration issue: Update configuration
- [ ] If code issue: Create hotfix branch

### 5. Resolve

- [ ] Fix root cause
- [ ] Deploy fix
- [ ] Verify fix works
- [ ] Monitor for recurrence

### 6. Post-Incident

- [ ] Document incident
- [ ] Create post-mortem
- [ ] Update runbooks if needed
- [ ] Follow up on action items

---

## Rollback Procedure

### Vercel Rollback

1. **Vercel Dashboard:** Deployments → Select previous deployment
2. **Promote to Production:** Click "Promote to Production"
3. **Verify:** Check application is working

### Git Rollback

```bash
# Revert last commit
git revert HEAD
git push

# Or rollback to specific commit
git revert <commit-hash>
git push
```

---

## Communication

### Incident Channel

- **Create:** Incident channel in Slack/Discord
- **Update:** Regular status updates
- **Resolve:** Post resolution message

### Status Updates

- **Initial:** "Investigating [issue description]"
- **Update:** "Status: [current status], ETA: [estimated time]"
- **Resolved:** "Resolved: [resolution summary]"

---

## Severity Levels

### P0 - Critical

- **Impact:** Service down, data loss
- **Response:** Immediate, all hands on deck
- **Communication:** Alert all stakeholders

### P1 - High

- **Impact:** Major feature broken, significant user impact
- **Response:** Within 1 hour
- **Communication:** Alert team leads

### P2 - Medium

- **Impact:** Minor feature broken, limited user impact
- **Response:** Within 4 hours
- **Communication:** Update in incident channel

### P3 - Low

- **Impact:** Cosmetic issue, no user impact
- **Response:** Next business day
- **Communication:** Create issue ticket

---

## Verification

After resolution:

- [ ] Application is accessible
- [ ] No errors in logs
- [ ] Key features working
- [ ] Monitoring shows normal metrics

---

## Gotchas

- **Don't Panic:** Follow the process
- **Document Everything:** Log all actions
- **Communicate:** Keep team informed
- **Verify:** Always verify before declaring resolved

---

**Last Updated:** 2025-01-XX

