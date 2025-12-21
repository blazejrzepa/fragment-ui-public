# Release Process

**Purpose:** Standardized release workflow  
**Audience:** Engineers releasing new versions  
**When to read:** Before creating a release

---

## Overview

Fragment UI follows **semantic versioning** (SemVer) for releases.

---

## Release Checklist

### Pre-Release

- [ ] All tests passing (`pnpm test`)
- [ ] Linting passes (`pnpm lint`)
- [ ] Build succeeds (`pnpm build`)
- [ ] Documentation updated
- [ ] Changelog updated
- [ ] Version bumped in `package.json`

### Release Steps

1. **Update Version**
   ```bash
   # Update version in root package.json
   # Update version in packages/*/package.json
   ```

2. **Update Changelog**
   ```bash
   # Add release notes to CHANGELOG.md
   ```

3. **Create Release Branch**
   ```bash
   git checkout -b release/v1.x.x
   git add .
   git commit -m "chore: release v1.x.x"
   ```

4. **Create GitHub Release**
   ```bash
   # Use GitHub CLI or web interface
   gh release create v1.x.x --notes-file CHANGELOG.md
   ```

5. **Merge to Main**
   ```bash
   git checkout main
   git merge release/v1.x.x
   git push
   ```

6. **Deploy**
   - Automatic via Vercel (on push to main)
   - Or manual: `vercel --prod`

### Post-Release

- [ ] Verify deployment
- [ ] Check registry JSON files
- [ ] Monitor for issues
- [ ] Update documentation if needed

---

## Version Numbering

Follow **Semantic Versioning** (MAJOR.MINOR.PATCH):

- **MAJOR:** Breaking changes
- **MINOR:** New features (backward compatible)
- **PATCH:** Bug fixes (backward compatible)

### Examples

- `1.0.0` → `1.0.1` (patch: bug fix)
- `1.0.1` → `1.1.0` (minor: new feature)
- `1.1.0` → `2.0.0` (major: breaking change)

---

## Changelog Format

```markdown
## [1.x.x] - YYYY-MM-DD

### Added
- New feature X

### Changed
- Updated feature Y

### Fixed
- Bug fix Z

### Breaking Changes
- Breaking change description
```

---

## Release Types

### Regular Release

Standard release with version bump and changelog.

### Hotfix Release

Emergency release for critical bugs:

1. Create hotfix branch from main
2. Fix bug
3. Bump patch version
4. Release immediately
5. Merge back to main and develop

---

## Automation

### GitHub Actions

Release process can be automated via GitHub Actions:

- **Trigger:** On tag creation
- **Actions:** Build, test, create release, deploy

### Scripts

```bash
# Generate versions from Git tags
pnpm versions:generate

# Create GitHub release
node scripts/create-github-release.mjs
```

---

## Gotchas

- **Version Sync:** All packages should use same version
- **Changelog:** Must be updated before release
- **Registry:** Registry JSON files don't need version bump
- **Breaking Changes:** Must be documented in changelog

---

## Next Steps

- [Deployment](./deployment.md) - Deployment process
- [Monitoring](./monitoring.md) - Post-release monitoring

---

**Last Updated:** 2025-01-XX
