# Troubleshooting

**Purpose:** Common issues and solutions  
**Audience:** All engineers  
**When to read:** When encountering issues

---

## Overview

This document covers common issues and their solutions. For detailed troubleshooting guides, see [Troubleshooting Documentation](../troubleshooting/).

---

## Common Issues

### Build Issues

#### Issue: Build fails with "Cannot find module"

**Solution:**
```bash
# Clean and reinstall
rm -rf node_modules
pnpm install
pnpm build
```

#### Issue: TypeScript errors in dependencies

**Solution:**
```bash
# Rebuild dependencies
pnpm tokens:build
pnpm build
```

---

### Development Issues

#### Issue: Hot reload not working

**Solution:**
```bash
# Restart dev server
pnpm dev
```

#### Issue: Port already in use

**Solution:**
```bash
# Find and kill process
lsof -ti:3000 | xargs kill -9
```

---

### Deployment Issues

#### Issue: Deployment fails on Vercel

**Solution:**
1. Check build logs in Vercel dashboard
2. Verify environment variables
3. Check `next.config.mjs` for issues
4. Try building locally: `pnpm build`

#### Issue: Registry JSON not updating

**Solution:**
```bash
# Regenerate registry
pnpm registry:generate
git add packages/registry/registry.json
git commit -m "chore: update registry"
git push
```

---

### Testing Issues

#### Issue: Tests failing locally but passing in CI

**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules .turbo
pnpm install
pnpm test
```

#### Issue: E2E tests timing out

**Solution:**
- Increase timeout in `playwright.config.ts`
- Check if services are running
- Verify network connectivity

---

### Studio Issues

#### Issue: DSL generation fails

**Solution:**
1. Check OpenAI API key in environment variables
2. Verify API quota/limits
3. Check logs for error messages

#### Issue: Preview not rendering

**Solution:**
1. Check browser console for errors
2. Verify iframe permissions
3. Check bundle CSS generation

---

## Debugging Tips

### Enable Debug Logging

```typescript
// In development
if (process.env.NODE_ENV === 'development') {
  console.debug('[Debug]', data)
}
```

### Check Network Requests

- **Browser DevTools:** Network tab
- **Vercel Logs:** Function logs
- **PostHog:** Event tracking

### Verify Configuration

```bash
# Check environment variables
vercel env ls

# Check build output
pnpm build --verbose
```

---

## Getting Help

1. **Check Documentation:** [Troubleshooting Guides](../troubleshooting/)
2. **Search Issues:** GitHub Issues
3. **Ask Team:** Slack/Discord
4. **Create Issue:** GitHub Issues with:
   - Error message
   - Steps to reproduce
   - Environment details
   - Logs (if applicable)

---

## Next Steps

- [Troubleshooting Guides](../troubleshooting/) - Detailed guides
- [Monitoring](./monitoring.md) - Logging and metrics
- [Runbooks](./runbooks/) - Operational procedures

---

**Last Updated:** 2025-01-XX

