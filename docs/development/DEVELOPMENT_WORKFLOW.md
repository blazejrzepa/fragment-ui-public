# Development Workflow Guide

**Data:** 2025-01-XX  
**Cel:** Dokumentacja procesu developmentu w projekcie Fragment UI

---

## 🚀 Quick Start

### Pierwsze uruchomienie

```bash
# 1. Zainstaluj zależności
pnpm install

# 2. Zbuduj tokeny (wymagane przed pierwszym uruchomieniem)
pnpm tokens:build

# 3. Uruchom serwery deweloperskie
pnpm dev
```

Serwery będą dostępne na:
- **Portal (www):** http://localhost:3000
- **Storybook:** http://localhost:6006
- **Demo:** http://localhost:3002

---

## 📦 Struktura Monorepo

```
fragment-ui/
├── packages/
│   ├── ui/          # Komponenty Design System
│   ├── blocks/      # Bloki i kompozycje
│   ├── tokens/      # Design tokens (CSS variables)
│   └── ...
├── apps/
│   ├── www/         # Portal dokumentacji
│   └── demo/         # Demo aplikacja
└── ...
```

---

## 🔧 Development Commands

### Podstawowe komendy

```bash
# Uruchom wszystkie serwery deweloperskie
pnpm dev

# Zbuduj wszystkie pakiety
pnpm build

# Sprawdź typy TypeScript we wszystkich pakietach
pnpm type-check

# Uruchom testy
pnpm test

# Lint
pnpm lint
```

### Komendy dla konkretnych pakietów

```bash
# UI Package
pnpm --filter @fragment_ui/ui dev          # Watch mode dla TypeScript
pnpm --filter @fragment_ui/ui build        # Build pakietu
pnpm --filter @fragment_ui/ui type-check    # Type check pakietu
pnpm --filter @fragment_ui/ui test         # Testy pakietu

# Blocks Package
pnpm --filter @fragment_ui/blocks dev      # Watch mode
pnpm --filter @fragment_ui/blocks build    # Build pakietu
pnpm --filter @fragment_ui/blocks type-check # Type check

# Portal (www)
pnpm --filter fragment-www dev          # Next.js dev server
pnpm --filter fragment-www build        # Next.js build
pnpm --filter fragment-www type-check   # Type check
```

### Watch Mode

Dla automatycznej przebudowy pakietów podczas developmentu:

```bash
# Watch mode dla wszystkich workspace packages
pnpm watch

# Watch mode dla konkretnego pakietu
pnpm watch:ui      # @fragment_ui/ui
pnpm watch:blocks  # @fragment_ui/blocks
```

**Uwaga:** Watch mode automatycznie przebudowuje pakiety przy zmianach, co pozwala na hot reload w aplikacjach używających tych pakietów.

---

## 🔄 Hot Reload

### Jak działa hot reload

1. **Workspace Packages (`@fragment_ui/ui`, `@fragment_ui/blocks`):**
   - Zmiany w pakietach są automatycznie wykrywane przez Next.js (`transpilePackages`)
   - Next.js automatycznie przebudowuje zmienione moduły
   - Hot reload działa dla większości zmian

2. **Watch Mode:**
   - Uruchom `pnpm watch` w osobnym terminalu dla automatycznej przebudowy pakietów
   - Przydatne gdy hot reload nie działa automatycznie

3. **Manual Rebuild:**
   ```bash
   # Przebuduj pakiet po zmianach
   pnpm --filter @fragment_ui/ui build
   pnpm --filter @fragment_ui/blocks build
   
   # Restart dev server jeśli potrzeba
   # Ctrl+C i ponownie: pnpm dev
   ```

### Troubleshooting Hot Reload

**Problem:** Zmiany w `packages/ui` nie są widoczne w `apps/www`

**Rozwiązanie:**
1. Sprawdź czy `transpilePackages` jest skonfigurowane w `next.config.mjs`
2. Uruchom watch mode: `pnpm watch:ui`
3. Jeśli nie pomaga, przebuduj pakiet: `pnpm --filter @fragment_ui/ui build`
4. Restart dev server: `pnpm dev`

---

## ✅ Pre-commit Checks

Przed każdym commitem automatycznie uruchamiane są:

1. **Type Checking** - sprawdza błędy TypeScript we wszystkich pakietach
2. **Design System Linting** - sprawdza zgodność z DS w `apps/demo`

Jeśli któryś check się nie powiedzie, commit zostanie zablokowany.

### Pomijanie pre-commit hooks (niezalecane)

```bash
git commit --no-verify -m "message"
```

**⚠️ Uwaga:** Używaj tylko w wyjątkowych sytuacjach. Zawsze sprawdź typy przed push.

---

## 🧪 Type Checking

### Lokalne sprawdzanie typów

```bash
# Wszystkie pakiety
pnpm type-check

# Konkretny pakiet
pnpm type-check:ui      # @fragment_ui/ui
pnpm type-check:blocks  # @fragment_ui/blocks
pnpm type-check:www     # fragment-www
```

### CI/CD

Type checking jest automatycznie uruchamiane w CI przed build:
- Sprawdza wszystkie pakiety
- Blokuje merge jeśli są błędy TypeScript

---

## 🏗️ Build Process

### Kolejność build

1. **Tokens** - buduje design tokens (`pnpm tokens:build`)
2. **UI Package** - kompiluje TypeScript do JavaScript
3. **Blocks Package** - kompiluje TypeScript (zależy od UI)
4. **Apps** - buduje aplikacje (zależą od pakietów)

### Turbo Cache

Build używa Turbo cache dla przyspieszenia:
- Cache jest automatycznie używany dla niezmienionych pakietów
- Cache jest invalidowany gdy zmieniają się zależności

### Manual Build

```bash
# Build wszystkich pakietów
pnpm build

# Build konkretnego pakietu
pnpm --filter @fragment_ui/ui build
pnpm --filter @fragment_ui/blocks build

# Build aplikacji
pnpm --filter fragment-www build
```

---

## 📝 Tworzenie Nowych Komponentów

### 1. Utwórz komponent w `packages/ui/src/`

```typescript
// packages/ui/src/my-component.tsx
import * as React from "react";

export interface MyComponentProps {
  // props
}

export function MyComponent({ ...props }: MyComponentProps) {
  return <div>...</div>;
}
```

### 2. Eksportuj w `packages/ui/src/index.ts`

```typescript
export { MyComponent } from "./my-component";
export type { MyComponentProps } from "./my-component";
```

### 3. Zbuduj pakiet

```bash
pnpm --filter @fragment_ui/ui build
```

### 4. Użyj w aplikacji

```typescript
import { MyComponent } from "@fragment_ui/ui";
```

---

## 🎨 Design Tokens

### Budowanie tokenów

```bash
pnpm tokens:build
```

Tokeny są budowane z `packages/tokens/scripts/build.mjs` i generują:
- `packages/tokens/dist/tokens.css` - CSS variables

### Używanie tokenów

```typescript
// W komponentach
className="bg-[color:var(--color-surface-1)]"
className="text-[color:var(--color-fg-base)]"
className="border border-[color:var(--color-border-base)]"
```

### Dostępne tokeny

Zobacz: `apps/www/app/docs/foundations/tokens`

---

## 🐛 Debugging

### Problemy z build

```bash
# Wyczyść cache Turbo
rm -rf .turbo

# Wyczyść node_modules
rm -rf node_modules **/node_modules
pnpm install

# Przebuduj wszystko od zera
pnpm build
```

### Problemy z typami

```bash
# Sprawdź błędy TypeScript
pnpm type-check

# Sprawdź konkretny pakiet
pnpm --filter @fragment_ui/ui type-check
```

### Problemy z hot reload

1. Sprawdź czy watch mode działa: `pnpm watch`
2. Przebuduj pakiet: `pnpm --filter @fragment_ui/ui build`
3. Restart dev server

---

## 📚 Dodatkowe Zasoby

- [Design System Tokens](docs/foundations/tokens)
- [Component Documentation](docs/components)
- [DS Compliance Audit](docs/development/DS_COMPLIANCE_AUDIT.md)
- [Refactoring Plan](docs/development/REFACTORING_AND_OPTIMIZATION_PLAN.md)

---

## 🎯 Best Practices

1. **Zawsze sprawdzaj typy przed commitem** - `pnpm type-check`
2. **Używaj watch mode** - `pnpm watch` dla automatycznej przebudowy
3. **Buduj tokeny po zmianach** - `pnpm tokens:build`
4. **Testuj lokalnie** - przed push sprawdź czy wszystko działa
5. **Używaj DS tokens** - nie hardcoduj kolorów/spacing

---

**Ostatnia aktualizacja:** 2025-01-XX

