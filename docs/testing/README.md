# Testing Documentation

**Purpose:** Testing guidelines and standards  
**Audience:** Engineers writing tests  
**When to read:** When writing or updating tests

---

## 📋 Overview

This section contains testing documentation, including standards, guides, and test results.

---

## 🚀 Quick Navigation

1. **[Testing Guide](./guide.md)** - Main testing guide (consolidated)
2. **[Standards](./standards.md)** - Component testing standards
3. **[Registry](./registry.md)** - Test registry
4. **[Results](./results/)** - Test results

---

## 📊 Test Types

### Unit Tests

- **Framework:** Vitest
- **Location:** `packages/*/src/**/*.test.tsx`
- **Coverage:** Minimum 80%

### E2E Tests

- **Framework:** Playwright
- **Location:** `apps/*/e2e/**/*.spec.ts`
- **Coverage:** Critical user flows

### Visual Regression

- **Framework:** Chromatic
- **Location:** Storybook stories
- **Coverage:** All component variants

### Accessibility

- **Framework:** axe-core
- **Location:** Component tests
- **Coverage:** All components

---

## 📚 Related Documentation

- [Development - Testing](../development/testing.md) - Testing strategy
- [Component Testing Standards](./standards.md) - Detailed standards

---

**Last Updated:** 2025-01-XX

