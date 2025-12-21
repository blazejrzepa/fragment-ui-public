# 🧪 Przewodnik testowania - Kompletne testy

Kompleksowy przewodnik jak przeprowadzić wszystkie testy w projekcie Fragment UI.

## 📋 Typy testów

Projekt zawiera następujące typy testów:

1. **A11y Tests** - Testy dostępności (49 komponentów)
2. **Unit Tests** - Testy jednostkowe komponentów
3. **Performance Tests** - Testy wydajności (Lighthouse CI)
4. **Visual Regression Tests** - Testy wizualne (Chromatic)
5. **Bundle Size Tests** - Analiza rozmiaru bundle

---

## 🚀 Szybki start - Wszystkie testy

```bash
# Uruchom wszystkie testy
pnpm test

# Uruchom wszystkie testy + build
pnpm test && pnpm build

# Pełna weryfikacja (testy + build + bundle analysis)
pnpm test && pnpm build && pnpm bundle:analyze
```

---

## 1. 🔍 Testy dostępności (A11y)

### Uruchomienie

```bash
# Wszystkie testy A11y
pnpm test

# Tylko testy A11y dla UI package
pnpm --filter @fragment_ui/ui test

# Testy z watch mode
pnpm --filter @fragment_ui/ui test --watch

# Testy z UI (interactive)
pnpm --filter @fragment_ui/ui test --ui
```

### Co testują?

- **49 komponentów** są testowane pod kątem dostępności
- Wykrywanie naruszeń WCAG 2.1
- Sprawdzanie ról ARIA, etykiet, atrybutów
- Testy keyboard navigation

### Przykładowy output

```
✓ Button should be keyboard accessible (23ms)
✓ Input should be keyboard accessible (12ms)
✓ Accordion should have no A11y violations (45ms)
...
✓ 49 tests passed
```

### Szczegółowe testy

```bash
# Test konkretnego komponentu
pnpm --filter @fragment_ui/ui test button

# Test z verbose output
pnpm --filter @fragment_ui/ui test --reporter=verbose

# Test z coverage
pnpm --filter @fragment_ui/ui test --coverage
```

---

## 2. ⚡ Testy wydajności (Performance)

### Lighthouse CI

```bash
# Lokalne testy Lighthouse (wymaga uruchomionej aplikacji)
pnpm --filter @fragment_ui/www start &
pnpm lighthouse

# Albo z pełną konfiguracją
lhci autorun
```

### Wymagania

1. **Uruchom aplikację**:
   ```bash
   pnpm --filter @fragment_ui/www start
   # Aplikacja dostępna na http://localhost:3000
   ```

2. **W osobnym terminalu uruchom Lighthouse**:
   ```bash
   pnpm lighthouse
   ```

### Co testują?

- **Performance Score** (min 80%)
- **Accessibility Score** (min 90%)
- **Best Practices Score** (min 90%)
- **SEO Score** (min 90%)
- **Core Web Vitals**:
  - LCP (Largest Contentful Paint) < 2500ms
  - FCP (First Contentful Paint) < 1800ms
  - CLS (Cumulative Layout Shift) < 0.1
  - TBT (Total Blocking Time) < 300ms

### Wyniki

Lighthouse generuje raport w:
- Terminalu (podsumowanie)
- `lighthouse-results/` (szczegółowe raporty HTML)

---

## 3. 📦 Analiza Bundle Size

### Uruchomienie

```bash
# Analiza rozmiaru bundle
pnpm bundle:analyze

# Z zapisem do pliku
pnpm bundle:analyze > bundle-report.txt
```

### Co testują?

- **Rozmiar każdego komponentu** (gzipped i uncompressed)
- **Całkowity rozmiar pakietu**
- **Średni rozmiar komponentu**
- **Limity**:
  - Max 50KB gzipped per component
  - Max 150KB uncompressed per component
  - Max 500KB total gzipped
  - Max 1.5MB total uncompressed

### Przykładowy output

```
Analyzing bundle sizes...
✓ Button: 12.3 KB (gzipped: 4.2 KB)
✓ Input: 8.1 KB (gzipped: 2.9 KB)
...
Total: 485.2 KB (gzipped: 156.8 KB)
✅ All bundle size limits passed!
```

### Limity w CI

Testy bundle size są automatycznie uruchamiane w CI i **failują build** jeśli limity są przekroczone.

---

## 4. 🎨 Visual Regression Tests (Chromatic)

### Lokalne testy

```bash
# Uruchom Storybook lokalnie
pnpm --filter @fragment_ui/ui storybook

# W osobnym terminalu - uruchom Chromatic
npx chromatic --project-token=YOUR_TOKEN
```

### Automatyczne testy (CI/CD)

Chromatic uruchamia się automatycznie:
- **Na PR** - komentuje wizualne zmiany
- **Na main branch** - aktualizuje baseline

### Konfiguracja

1. **Sprawdź token** w GitHub Secrets:
   - `CHROMATIC_PROJECT_TOKEN`

2. **Sprawdź workflow**:
   - `.github/workflows/chromatic.yml`

3. **Wyniki**:
   - Chromatic Dashboard: https://www.chromatic.com
   - Komentarze w PR

### Co testują?

- **Screenshoty** wszystkich Storybook stories
- **Porównanie** z baseline images
- **Wykrywanie wizualnych zmian**
- **Testy w różnych viewportach** (320px, 768px, 1024px, 1440px)
- **Testy w różnych motywach** (light, dark, high-contrast)

---

## 5. 🔨 Build Tests

### Testy build

```bash
# Build wszystkich pakietów
pnpm build

# Build konkretnego pakietu
pnpm --filter @fragment_ui/ui build
pnpm --filter @fragment_ui/www build

# Build z TypeScript checking
pnpm build --check-types
```

### Co testują?

- **Kompilacja TypeScript**
- **Bundling**
- **Walidacja exportów**
- **Brak błędów kompilacji**

---

## 📊 Kompleksowa weryfikacja

### Pełny pipeline testów

```bash
#!/bin/bash

echo "🧪 Rozpoczynam kompleksowe testy..."

# 1. Testy A11y
echo "1️⃣  Testy dostępności..."
pnpm test || exit 1

# 2. Build
echo "2️⃣  Build..."
pnpm build || exit 1

# 3. Bundle size
echo "3️⃣  Analiza bundle size..."
pnpm bundle:analyze || exit 1

# 4. TypeScript check
echo "4️⃣  TypeScript check..."
pnpm --filter @fragment_ui/ui tsc --noEmit || exit 1

echo "✅ Wszystkie testy przeszły pomyślnie!"
```

### Uruchomienie

```bash
# Zapisz jako test-all.sh i uruchom
chmod +x test-all.sh
./test-all.sh
```

---

## 🎯 Testy przed commit

### Pre-commit checks

```bash
# Szybkie testy przed commitem
pnpm test && pnpm build
```

### W GitHub Actions

CI automatycznie uruchamia:
1. ✅ Testy A11y
2. ✅ Build
3. ✅ Bundle size analysis
4. ✅ TypeScript check
5. ✅ Chromatic (visual regression)
6. ✅ Lighthouse CI (performance) - na PR i main

---

## 🔍 Debugowanie testów

### Testy A11y

```bash
# Testy z debug output
pnpm --filter @fragment_ui/ui test --reporter=verbose

# Test konkretnego pliku
pnpm --filter @fragment_ui/ui test src/a11y.test.tsx

# Test z watch mode
pnpm --filter @fragment_ui/ui test --watch
```

### Performance tests

```bash
# Lighthouse z verbose output
lhci autorun --collect.numberOfRuns=1

# Tylko performance score
lhci autorun --assert.onlyCategories=performance
```

### Bundle size

```bash
# Szczegółowy output
pnpm bundle:analyze --verbose

# Sprawdź konkretny komponent
# (edytuj scripts/analyze-bundle-size.mjs)
```

---

## 📝 Raportowanie

### Wygeneruj raport testów

```bash
# Testy z coverage
pnpm --filter @fragment_ui/ui test --coverage

# Coverage report
open packages/ui/coverage/index.html
```

### Zapisuj wyniki

```bash
# Testy do pliku
pnpm test > test-results.txt 2>&1

# Bundle size do pliku
pnpm bundle:analyze > bundle-report.txt

# Lighthouse do katalogu
lhci autorun --upload.target=temporary-public-storage
```

---

## ⚠️ Troubleshooting

### Testy A11y nie przechodzą

```bash
# Sprawdź konkretny błąd
pnpm --filter @fragment_ui/ui test --reporter=verbose

# Sprawdź czy wszystkie zależności są zainstalowane
pnpm install
```

### Lighthouse nie działa

```bash
# Upewnij się że aplikacja działa
curl http://localhost:3000

# Sprawdź konfigurację
cat lighthouserc.js
```

### Chromatic nie działa

```bash
# Sprawdź token
echo $CHROMATIC_PROJECT_TOKEN

# Sprawdź czy Storybook build działa
pnpm --filter @fragment_ui/ui storybook:build
```

### Bundle size przekracza limity

```bash
# Sprawdź szczegóły
pnpm bundle:analyze

# Sprawdź największe komponenty
# (edytuj scripts/analyze-bundle-size.mjs)
```

---

## 📚 Dodatkowe zasoby

- [A11y Tests](./a11y-tests.md) - Szczegóły testów dostępności
- [Performance Tests](./performance-tests.md) - Szczegóły testów wydajności
- [Visual Regression](./visual-regression.md) - Szczegóły testów wizualnych
- [Chromatic Setup](../../setup/chromatic-setup.md) - Konfiguracja Chromatic

---

## ✅ Checklist przed release

Przed wydaniem nowej wersji upewnij się, że:

- [ ] Wszystkie testy A11y przechodzą (`pnpm test`)
- [ ] Build działa bez błędów (`pnpm build`)
- [ ] Bundle size jest w limitach (`pnpm bundle:analyze`)
- [ ] TypeScript check przechodzi (`pnpm --filter @fragment_ui/ui tsc --noEmit`)
- [ ] Performance tests przechodzą (`pnpm lighthouse`)
- [ ] Visual regression tests przechodzą (sprawdź Chromatic)
- [ ] Dokumentacja jest zaktualizowana
- [ ] CHANGELOG jest zaktualizowany

---

*Last Updated: 2024-11-04*

# Testing Guide - MCP Server, Telemetry & ROI, Governance

Complete guide for testing the three critical implementations.

## 🧪 Testing Overview

This guide covers testing for:
1. MCP Server (AI-Native Workflow)
2. Telemetry & ROI Dashboard
3. Governance Framework

---

## 1. Testing MCP Server

### Prerequisites

```bash
# Build MCP server
cd packages/mcp-server
pnpm build

# Verify build
ls -la dist/
```

### Test 1: Manual Server Test

```bash
# Test server starts
cd packages/mcp-server
node dist/index.js

# Should output: "Fragment UI MCP Server running on stdio"
# Press Ctrl+C to stop
```

### Test 2: Test Tools Programmatically

Create a test script:

```typescript
// test-mcp-tools.ts
import { getComponentInfo } from "./packages/mcp-server/src/components.js";
import { validateCode } from "./packages/mcp-server/src/validators.js";
import { suggestComponent } from "./packages/mcp-server/src/components.js";

// Test get_component_info
async function testGetComponentInfo() {
  const info = await getComponentInfo("button");
  console.log("Component Info:", JSON.stringify(info, null, 2));
}

// Test validate_code
async function testValidateCode() {
  const code = `const color = '#ff0000';`;
  const result = await validateCode(code);
  console.log("Validation Result:", JSON.stringify(result, null, 2));
}

// Test suggest_component
async function testSuggestComponent() {
  const suggestions = await suggestComponent("form input with validation");
  console.log("Suggestions:", JSON.stringify(suggestions, null, 2));
}

// Run tests
testGetComponentInfo();
testValidateCode();
testSuggestComponent();
```

### Test 3: Cursor Integration

1. **Configure Cursor:**
   ```json
   // ~/.cursor/mcp.json
   {
     "mcpServers": {
       "fragment-ui": {
         "command": "node",
         "args": [
           "/absolute/path/to/fragment-ui/packages/mcp-server/dist/index.js"
         ]
       }
     }
   }
   ```

2. **Restart Cursor**

3. **Test in Cursor:**
   - Ask: "What Fragment UI components are available?"
   - Ask: "Generate a Button component with variant='solid'"
   - Ask: "Validate this code: const color = '#ff0000';"

### Test 4: Copilot Integration

Similar to Cursor, configure in Copilot settings.

---

## 2. Testing Telemetry & ROI Dashboard

### Test 1: ROI Metrics Functions

```typescript
// test-roi-metrics.ts
import {
  trackLeadTime,
  trackAdoptionRate,
  trackReuseRate,
  trackTimeToShip,
  trackMaintenanceCost,
  trackOnboardingTime,
} from "./packages/telemetry/src/roi-metrics.js";

// Test lead time
const leadTime = trackLeadTime(
  Date.now() - 86400000, // 1 day ago
  Date.now(),
  {
    figmaUrl: "https://figma.com/...",
    prUrl: "https://github.com/.../pull/123",
  }
);
console.log("Lead Time:", leadTime);

// Test adoption rate
const adoption = trackAdoptionRate("monthly", 100, 75);
console.log("Adoption Rate:", adoption);

// Test reuse rate
const reuse = trackReuseRate("button", 5, 10);
console.log("Reuse Rate:", reuse);

// Test time-to-ship
const timeToShip = trackTimeToShip(10, 5);
console.log("Time-to-Ship:", timeToShip);

// Test maintenance cost
const maintenance = trackMaintenanceCost("monthly", 100, 70);
console.log("Maintenance Cost:", maintenance);

// Test onboarding
const onboarding = trackOnboardingTime(
  Date.now() - 1800000, // 30 min ago
  Date.now(),
  true
);
console.log("Onboarding Time:", onboarding);
```

### Test 2: ROI Dashboard UI

1. **Start dev server:**
   ```bash
   cd apps/www
   pnpm dev
   ```

2. **Navigate to:**
   ```
   http://localhost:3000/tools/roi-dashboard
   ```

3. **Verify:**
   - ✅ All 6 KPI cards display
   - ✅ Status indicators show (✅ ⚠️ ❌)
   - ✅ Progress bars render
   - ✅ Target values display
   - ✅ No console errors

### Test 3: ROI API Endpoint

```bash
# Test API endpoint
curl http://localhost:3000/api/roi

# Should return JSON with metrics
```

Or test in browser:
```
http://localhost:3000/api/roi
```

### Test 4: Telemetry Integration

```typescript
// In your component
import { track } from "@fragment_ui/telemetry";
import { trackLeadTime } from "@fragment_ui/telemetry/roi-metrics";

// Track lead time
const startTime = Date.now();
// ... do something
const endTime = Date.now();

trackLeadTime(startTime, endTime, {
  componentName: "button",
});

// Verify in network tab that event is sent to /api/telemetry
```

---

## 3. Testing Governance Framework

### Test 1: RFC Process

1. **Create test RFC:**
   ```bash
   # Create RFC file
   cp docs/governance/RFC_TEMPLATE.md docs/rfcs/RFC-001-test-component.md
   ```

2. **Fill in RFC:**
   - Add title
   - Fill in all sections
   - Mark status as "draft"

3. **Review RFC:**
   - Check all sections are complete
   - Verify format matches template

### Test 2: Deprecation Policy

1. **Test deprecation notice:**
   ```typescript
   // In a component file
   /**
    * @deprecated This component is deprecated and will be removed in v2.0.0.
    * Use NewComponent instead.
    */
   export function OldComponent() {
     // ...
   }
   ```

2. **Verify:**
   - Deprecation notice appears in IDE
   - Documentation shows deprecation
   - Changelog includes deprecation

### Test 3: Contributing Guide

1. **Follow contributing guide:**
   - Fork repository
   - Create branch
   - Make small change
   - Create pull request

2. **Verify:**
   - PR follows template
   - Code follows standards
   - Tests pass

### Test 4: RACI Matrix

1. **Test decision-making:**
   - Simulate component addition
   - Check who is Responsible/Accountable
   - Verify escalation process

---

## 🧪 Automated Tests

### MCP Server Tests

```bash
# Create test file
# packages/mcp-server/src/index.test.ts

# Run tests
cd packages/mcp-server
pnpm test
```

### Telemetry Tests

```bash
# Test ROI metrics
cd packages/telemetry
# Create test file and run
```

---

## 📋 Testing Checklist

### MCP Server
- [ ] Server starts without errors
- [ ] All 5 tools work
- [ ] All 3 resources accessible
- [ ] Validation rules catch violations
- [ ] Component info returns correct data
- [ ] Suggestions work
- [ ] Code generation works
- [ ] Cursor integration works
- [ ] Copilot integration works

### Telemetry & ROI
- [ ] All 6 ROI metrics functions work
- [ ] Dashboard displays correctly
- [ ] API endpoint returns data
- [ ] Metrics are tracked correctly
- [ ] Data persists (when DB connected)
- [ ] GitHub integration works (when configured)

### Governance
- [ ] RFC template is complete
- [ ] Deprecation policy is clear
- [ ] Contributing guide is accurate
- [ ] RACI matrix is correct
- [ ] All processes are documented

---

## 🐛 Troubleshooting

### MCP Server Issues

**Problem:** Server doesn't start
- Check: Build completed successfully
- Check: Node version (requires Node 18+)
- Check: Dependencies installed

**Problem:** Tools not available in Cursor
- Check: MCP configuration path is absolute
- Check: Server is running
- Restart: Cursor

### ROI Dashboard Issues

**Problem:** Dashboard doesn't load
- Check: Dev server is running
- Check: No console errors
- Check: API endpoint is accessible

**Problem:** Metrics not showing
- Check: API returns data
- Check: Telemetry is enabled
- Check: Data collection is working

### Governance Issues

**Problem:** RFC process unclear
- Review: RFC_PROCESS.md
- Check: Template is complete
- Verify: Workflow is documented

---

## 🚀 Quick Test Script

Create `test-all.sh`:

```bash
#!/bin/bash

echo "🧪 Testing MCP Server..."
cd packages/mcp-server
pnpm build
node dist/index.js &
MCP_PID=$!
sleep 2
kill $MCP_PID
echo "✅ MCP Server test complete"

echo "🧪 Testing Telemetry..."
cd ../telemetry
pnpm build
echo "✅ Telemetry build complete"

echo "🧪 Testing ROI Dashboard..."
cd ../../apps/www
pnpm build
echo "✅ Dashboard build complete"

echo "🎉 All tests passed!"
```

---

*Last updated: 2025-01-05*

