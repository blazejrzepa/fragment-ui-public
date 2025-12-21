# Testing the Versioning System

This document outlines how to test the versioning system in development and production environments.

## Development Testing

### 1. Version Switcher

Test the version switcher component:
- Navigate to any docs page (e.g., `/docs/foundations/tokens`)
- Click the version switcher in the navigation
- Select a different version (e.g., `0.9.0 (Beta)`)
- Verify:
  - URL changes to `/docs/v0.9.0/foundations/tokens`
  - Page loads correctly
  - Version warning/badge displays if deprecated/beta

### 2. Direct URL Access

Test accessing versioned URLs directly:
- `/docs/v0.9.0` → Should show version 0.9.0 index
- `/docs/v0.9.0/changelog` → Should show version 0.9.0 changelog
- `/docs/v0.9.0/foundations/tokens` → Should show versioned tokens page
- `/docs/v1.0.0/changelog` → Should redirect to `/docs/changelog` (current version)

### 3. Navigation

Test navigation between pages while maintaining version:
- Start at `/docs/v0.9.0/foundations/tokens`
- Click a link to another page
- Verify version is preserved in URL

### 4. Invalid Versions

Test error handling:
- `/docs/v9.9.9/changelog` → Should show 404
- `/docs/vinvalid/changelog` → Should show 404

### 5. Middleware

Check middleware is working:
- Open browser DevTools Network tab
- Access `/docs/v0.9.0/changelog`
- Verify request shows correct path
- Check server logs for middleware rewrite messages (in dev mode)

## Production Testing Checklist

### Build Verification
- [ ] `pnpm build` completes without errors
- [ ] All TypeScript types are correct
- [ ] No linting errors
- [ ] All routes compile successfully

### Functional Tests
- [ ] Version switcher displays all versions
- [ ] Current version redirects correctly
- [ ] Older versions display versioned content
- [ ] Deprecated versions show warning
- [ ] Beta versions show badge
- [ ] 404 page shows for invalid versions

### Performance
- [ ] Page load times acceptable
- [ ] Middleware doesn't add significant latency
- [ ] No console errors in browser

### Browser Compatibility
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari
- [ ] Mobile browsers

## Automated Testing

### Manual Test Script

Run these commands to verify:

```bash
# 1. Build the project
pnpm build

# 2. Start production server
pnpm start

# 3. Test URLs
curl http://localhost:3000/docs/v0.9.0/changelog
curl http://localhost:3000/docs/v1.0.0/changelog  # Should redirect
curl http://localhost:3000/docs/v9.9.9/changelog  # Should 404
```

### Expected Results

1. **Valid older version**: Returns 200 with versioned content
2. **Current version**: Redirects (301/302) to non-versioned URL
3. **Invalid version**: Returns 404

## Common Issues

### Issue: Version switcher not updating URL
**Solution**: Check `VersionSwitcher` component handles version selection correctly

### Issue: Middleware not rewriting
**Solution**: 
- Verify middleware is in correct location (`apps/www/middleware.ts`)
- Check matcher configuration
- Clear Next.js cache

### Issue: Import path errors
**Solution**: Verify relative paths match directory structure depth

### Issue: Duplicate keys in TOC
**Solution**: Ensure all headings have unique IDs (see `extractHeadings` function)

