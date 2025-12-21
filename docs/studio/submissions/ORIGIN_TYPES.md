# 📥 Origin Types - Ścieżki zgłoszeń komponentów

**Version:** 1.0  
**Status:** Implemented (Phase 3)  
**Last Updated:** 2025-01-XX

---

## 🎯 Cel

Śledzenie różnych ścieżek, którymi komponenty trafiają do Submissions, umożliwiając:
- Precyzyjne metryki pokrycia
- Elastyczne governance (różne reguły dla różnych origin types)
- Analizę źródeł komponentów
- Optymalizację workflow

---

## 📋 Typy Origin (Origin Types)

### 1. 🔁 Product → System (`product`)

**Opis:** Zespół produktowy buduje komponent w ramach projektu (np. `StepIndicator`) i uznaje go za wart standaryzacji.

**Flow:**
1. Dev/Tech Lead zgłasza komponent przez CLI/UI
2. Dołącza opis, metadane, kontekst użycia
3. Przechodzi testy jakości + governance review
4. Po approve → trafia do registry

**Zalety:**
- Bottom-up adoption
- Blisko realnych potrzeb produktowych
- Wysoka jakość (przetestowany w produkcji)

**Przykład:**
```typescript
POST /api/submissions
{
  "type": "component",
  "dsl": { ... },
  "tsx": "...",
  "author": "dev@product.com",
  "originType": "product"  // Explicit
  // lub auto-detection: jeśli brak prompt → "product"
}
```

---

### 2. 🎨 Design-driven (`design`)

**Opis:** Projektant systemowy wprowadza nowy wzorzec (np. `ContextualAlert`) i współpracuje z zespołem ds. DS, by go wdrożyć.

**Flow:**
1. Komponent prototypowany w Figma + design tokens
2. Trafia do backlogu DS
3. Wdrożenie wspólnie z devami core teamu
4. Po approve → trafia do registry

**Zalety:**
- Gwarancja spójności designu
- Zgodność z wizją design systemu
- Wysoka jakość UX

**Przykład:**
```typescript
POST /api/submissions
{
  "type": "component",
  "dsl": { ... },
  "tsx": "...",
  "author": "designer@ds.com",
  "originType": "design"  // Explicit
}
```

---

### 3. 🤖 AI/Copilot-assisted (`copilot`)

**Opis:** Użytkownik końcowy lub designer generuje nowy komponent przez prompt lub kreator (np. "Stwórz kartę z produktem").

**Flow:**
1. Komponent generowany przez Copilota z UI-DSL
2. Trafia automatycznie do Submissions jako szkic
3. Po walidacji może zostać zintegrowany
4. Po approve → trafia do registry

**Zalety:**
- AI-native workflow
- Demokratyzacja wkładu
- Szybkie prototypy
- Niskie bariery wejścia

**Przykład:**
```typescript
POST /api/submissions
{
  "type": "component",
  "dsl": { ... },
  "tsx": "...",
  "author": "user@example.com",
  "prompt": "create a product card with image and price",
  "originType": "copilot"  // Auto-detected jeśli prompt istnieje
}
```

**Auto-detection:**
- Jeśli `prompt` istnieje → automatycznie `"copilot"`

---

### 4. 🔍 Refactoring audit / tech debt (`audit`)

**Opis:** Maintainer lub architekt identyfikuje powtarzające się komponenty (np. 8 różnych modalek) i proponuje standaryzację.

**Flow:**
1. Stworzony zostaje docelowy komponent systemowy
2. Zespoły migrują do nowej wersji
3. Historia i migracja opisana w changelogu
4. Po approve → trafia do registry

**Zalety:**
- Redukcja długu technicznego
- Porządek w codebase
- Standaryzacja istniejących wzorców

**Przykład:**
```typescript
POST /api/submissions
{
  "type": "component",
  "dsl": { ... },
  "tsx": "...",
  "author": "architect@ds.com",
  "originType": "audit"  // Explicit
}
```

---

### 5. 🌱 Experimental / R&D (`r&d`)

**Opis:** Zgłoszenie nowego komponentu eksperymentalnego (np. `VoiceInput`, `AICard`) bez gwarancji długoterminowego wsparcia.

**Flow:**
1. Komponent oznaczony jako experimental
2. Może być testowany w sandboxie lub beta feature
3. Tylko część użytkowników ma do niego dostęp
4. Po approve → trafia do registry jako `experimental` status

**Zalety:**
- Przestrzeń na innowację
- Iteracje bez ryzyka
- Testowanie nowych wzorców

**Przykład:**
```typescript
POST /api/submissions
{
  "type": "component",
  "dsl": { ... },
  "tsx": "...",
  "author": "researcher@ds.com",
  "experimentId": "exp_123",
  "originType": "r&d"  // Auto-detected jeśli experimentId istnieje
}
```

**Auto-detection:**
- Jeśli `experimentId` istnieje → automatycznie `"r&d"`

---

## 🔄 Auto-detection Logic

System automatycznie wykrywa `originType` na podstawie kontekstu:

```typescript
if (prompt) {
  originType = "copilot";
} else if (experimentId) {
  originType = "r&d";
} else {
  originType = "product";  // Default
}
```

**Można też podać explicit:**
```typescript
{
  "originType": "design"  // Override auto-detection
}
```

---

## 📊 Użycie w UI

### Submission Filters

Filtr "Origin Type" w `/submissions`:
- All Origins (default)
- Product
- Design
- Copilot
- Audit
- R&D

### Submission Card

Badge z origin type wyświetlany obok status i type:
```
[Status] [Type] [Origin Type]
```

### Submission Detail Page

Origin type wyświetlany w headerze:
```
Submission abc12345
component • Copilot • by user@example.com • 2 hours ago
```

---

## 🎯 Governance per Origin Type

Różne origin types mogą mieć różne wymagania governance:

### Product
- ✅ Wymagane: Unit tests, Storybook story
- ✅ Wymagane: A11y compliance
- ✅ Wymagane: Bundle size check
- ⚠️ Opcjonalne: Visual regression

### Design
- ✅ Wymagane: Figma coverage check
- ✅ Wymagane: Design tokens compliance
- ✅ Wymagane: A11y compliance
- ⚠️ Opcjonalne: Unit tests (może być dodane później)

### Copilot
- ✅ Wymagane: Lint checks
- ✅ Wymagane: A11y baseline
- ⚠️ Opcjonalne: Unit tests (może być dodane w review)
- ⚠️ Opcjonalne: Storybook story

### Audit
- ✅ Wymagane: Migration plan
- ✅ Wymagane: Changelog entry
- ✅ Wymagane: Backward compatibility check
- ✅ Wymagane: All existing tests pass

### R&D
- ✅ Wymagane: Experimental flag
- ⚠️ Opcjonalne: Unit tests (może być dodane później)
- ⚠️ Opcjonalne: Storybook story
- ⚠️ Opcjonalne: A11y (może być dodane w review)

---

## 📈 Metryki

Origin types umożliwiają śledzenie:

1. **Coverage metrics:**
   - Ile komponentów z każdego origin type
   - Procent pokrycia dla każdego typu

2. **Quality metrics:**
   - Średni score dla każdego origin type
   - Częstotliwość approve/reject per origin type

3. **Workflow metrics:**
   - Czas od submission do approve per origin type
   - Liczba iteracji per origin type

4. **Adoption metrics:**
   - Najpopularniejsze origin types
   - Trendy w czasie

---

## 🔗 Related Documents

- [SUBMISSIONS_PLAN.md](./SUBMISSIONS_PLAN.md) - Implementation plan
- [SUBMISSIONS_WORKFLOW.md](./SUBMISSIONS_WORKFLOW.md) - Workflow documentation
- [SUBMISSIONS_FLOW.md](./SUBMISSIONS_FLOW.md) - Detailed flow specification

---

**Last Updated:** 2025-01-XX

