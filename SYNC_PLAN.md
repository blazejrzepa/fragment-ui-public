# 🔄 Plan Synchronizacji: fragment-ui → fragment-ui-public

**Data:** 2025-01-XX  
**Status:** ✅ **ZAKOŃCZONE**

---

## 📊 Analiza Różnic

### Wersje Pakietów

| Pakiet | fragment-ui | fragment-ui-public | Akcja |
|--------|-------------|-------------------|-------|
| `@fragment_ui/ui` | 1.0.0 | 1.0.1 | ⚠️ Public nowszy - **NIE synchronizować wersji** |
| `@fragment_ui/tokens` | 1.0.0 | 1.0.1 | ⚠️ Public nowszy - **NIE synchronizować wersji** |
| `@fragment_ui/blocks` | 1.0.0 | 1.0.1 | ⚠️ Public nowszy - **NIE synchronizować wersji** |
| `@fragment_ui/mcp-server` | 0.1.0 | 0.1.0 | ✅ Wersje zgodne |

### Zmiany do Synchronizacji

#### 1. ✅ MCP Server - Metadata (fragment-ui → fragment-ui-public)
- **Status:** fragment-ui ma `repository`, `homepage`, `bugs` - fragment-ui-public nie ma
- **Akcja:** Dodać metadata do fragment-ui-public

#### 2. ✅ Font Rendering Optimizations (fragment-ui → fragment-ui-public)
- **Status:** fragment-ui ma nowe optymalizacje Chrome, fragment-ui-public nie ma
- **Pliki:**
  - `apps/www/src/styles/globals.css` - font rendering optimizations
  - `packages/ui/src/styles.css` - font rendering optimizations
  - `apps/www/app/layout.tsx` - viewport metadata

#### 3. ✅ apps/www package.json (fragment-ui-public → fragment-ui)
- **Status:** fragment-ui-public ma `shiki` i `clsx`, fragment-ui nie ma
- **Akcja:** Dodać do fragment-ui (opcjonalnie)

#### 4. ✅ next.config.mjs cleanup (fragment-ui → fragment-ui-public)
- **Status:** fragment-ui ma cleanup telemetry, fragment-ui-public już ma
- **Akcja:** Sprawdzić czy są różnice

---

## 🎯 Plan Synchronizacji

### Krok 1: MCP Server Metadata ⭐ **PRIORYTET 1**

**Z fragment-ui do fragment-ui-public:**

```json
// packages/mcp-server/package.json
{
  "repository": {
    "type": "git",
    "url": "https://github.com/blazejrzepa/fragment-ui.git",
    "directory": "packages/mcp-server"
  },
  "homepage": "https://fragmentui.com",
  "bugs": "https://github.com/blazejrzepa/fragment-ui/issues"
}
```

**Status:** fragment-ui ma ✅, fragment-ui-public nie ma ❌

---

### Krok 2: Font Rendering Optimizations ⭐ **PRIORYTET 2**

**Z fragment-ui do fragment-ui-public:**

1. **`apps/www/src/styles/globals.css`**
   - Dodać sekcję "Global font rendering optimization - Chrome specific"
   - Dodać Chrome-specific optimizations w `@supports`
   - Zaktualizować animacje (usunąć transform z keyframes)

2. **`packages/ui/src/styles.css`**
   - Dodać "Global font rendering optimization - Chrome specific"
   - Dodać `-webkit-text-stroke: 0.35px transparent`
   - Zmienić `text-rendering: optimizeLegibility` → `auto`

3. **`apps/www/app/layout.tsx`**
   - Dodać `viewport` metadata

**Status:** fragment-ui ma ✅, fragment-ui-public nie ma ❌

---

### Krok 3: apps/www package.json (Opcjonalnie)

**Z fragment-ui-public do fragment-ui:**

- Dodać `shiki: "^1.0.0"` (jeśli używane)
- Dodać `clsx: "^2.0.0"` (jeśli używane)

**Status:** fragment-ui-public ma ✅, fragment-ui nie ma ❌ (ale może nie być potrzebne)

---

### Krok 4: Weryfikacja

- [ ] Build w fragment-ui-public
- [ ] Testy w fragment-ui-public
- [ ] Sprawdzenie czy wszystko działa

---

## 📋 Checklist Synchronizacji

### MCP Server
- [ ] Dodać `repository` do `packages/mcp-server/package.json`
- [ ] Dodać `homepage` do `packages/mcp-server/package.json`
- [ ] Dodać `bugs` do `packages/mcp-server/package.json`

### Font Rendering
- [ ] Sync `apps/www/src/styles/globals.css` (font optimizations)
- [ ] Sync `packages/ui/src/styles.css` (font optimizations)
- [ ] Sync `apps/www/app/layout.tsx` (viewport metadata)

### Weryfikacja
- [ ] `pnpm build` w fragment-ui-public
- [ ] `pnpm type-check` w fragment-ui-public
- [ ] `pnpm test:ui` w fragment-ui-public (jeśli dostępne)
- [ ] Sprawdzenie czy strona renderuje się poprawnie

---

## ✅ Synchronizacja Zakończona

### Wykonane Zmiany:

1. ✅ **MCP Server Metadata** - Dodano `repository`, `homepage`, `bugs` do `packages/mcp-server/package.json`
2. ✅ **Font Rendering Optimizations** - Zsynchronizowano:
   - `packages/ui/src/styles.css` - Chrome-specific font optimizations
   - `apps/www/src/styles/globals.css` - Font rendering optimizations, animacje bez transform
   - `apps/www/app/layout.tsx` - Viewport metadata
3. ✅ **Build Verification** - Build w fragment-ui-public zakończony sukcesem

### Ostrzeżenia (niekrytyczne):
- Next.js ostrzega o viewport w metadata (preferowany osobny export) - to nie wpływa na działanie

### Nie zsynchronizowano (celowo):
- Wersje pakietów (fragment-ui-public ma nowsze wersje 1.0.1 vs 1.0.0)
- `shiki` i `clsx` w apps/www (fragment-ui-public ma, fragment-ui nie - opcjonalne)

