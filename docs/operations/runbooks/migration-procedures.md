# Migration Procedures Runbook

**Purpose:** Execute database and data migrations safely  
**Audience:** Engineers performing migrations  
**When to use:** When migrating data or schema

---

## Prerequisites

- Access to production environment
- Backup of current data
- Migration script tested in staging
- Rollback plan prepared

---

## Migration Process

### Pre-Migration

- [ ] **Backup Data:** Create backup of current data
- [ ] **Test in Staging:** Run migration in staging environment
- [ ] **Verify Rollback:** Test rollback procedure
- [ ] **Schedule:** Schedule during low-traffic period
- [ ] **Notify Team:** Inform team of migration

### Migration Execution

1. **Create Migration Script**
   ```bash
   # Example: Create migration file
   touch migrations/YYYY-MM-DD-migration-name.ts
   ```

2. **Run Migration**
   ```bash
   # Run migration script
   pnpm migration:run
   ```

3. **Verify Migration**
   - Check data integrity
   - Verify no data loss
   - Test key functionality

### Post-Migration

- [ ] **Verify:** All systems working
- [ ] **Monitor:** Watch for issues
- [ ] **Document:** Update documentation
- [ ] **Cleanup:** Remove old data if applicable

---

## Rollback Procedure

If migration fails:

1. **Stop Migration:** Stop migration script
2. **Restore Backup:** Restore from backup
3. **Verify:** Check data integrity
4. **Investigate:** Identify root cause
5. **Fix:** Fix migration script
6. **Retry:** Retry migration after fix

---

## Current Storage

### File-Based Storage

Currently using file-based storage:

- **Registry:** `packages/registry/registry.json`
- **Submissions:** `apps/demo/data/submissions.json`
- **Quality Data:** `apps/demo/data/quality/*.json`

### Future Database Migration

When migrating to database:

1. **Create Schema:** Define database schema
2. **Migration Script:** Script to migrate file data to database
3. **Dual Write:** Write to both file and database during transition
4. **Cutover:** Switch reads to database
5. **Cleanup:** Remove file-based storage

---

## Gotchas

- **Backup First:** Always backup before migration
- **Test in Staging:** Never test in production
- **Rollback Plan:** Always have rollback plan
- **Monitor:** Watch for issues after migration

---

**Last Updated:** 2025-01-XX

