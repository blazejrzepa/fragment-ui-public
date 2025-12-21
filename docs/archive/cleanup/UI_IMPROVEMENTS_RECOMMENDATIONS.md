# Rekomendacje UI dla Fragment UI Design System i Playground

## 📋 Podsumowanie

Po implementacji wszystkich 10 zadań z DEVELOPMENT_ROADMAP, poniżej znajdują się rekomendacje dotyczące elementów interfejsu użytkownika, które powinny zostać dodane, aby w pełni wykorzystać nowe funkcjonalności.

---

## 🎯 Priorytet P1 (Krytyczne - brakuje podstawowej funkcjonalności)

### 1. **Submissions Dashboard** (`/submissions`)

**Status:** ❌ Brakuje UI  
**Funkcjonalność:** Task 3-5 (Submissions API, Verify runner, PR-bot)

**Co powinno być:**
- Lista wszystkich submissions z filtrowaniem po statusie (draft, verifying, verified, rejected, promoted)
- Karty dla każdego submission z:
  - Preview miniaturki (screenshot lub iframe)
  - Status badge (kolorowy)
  - Score z weryfikacji
  - Autor i data utworzenia
  - Quick actions: "View", "Verify", "Promote", "Delete"
- Szczegóły submission:
  - Pełny preview komponentu
  - Wyniki weryfikacji (lint errors, a11y violations, hardcoded colors)
  - Wygenerowany TSX code
  - DSL JSON
  - Historia zmian (jeśli będzie)
- Filtry i sortowanie:
  - Po statusie
  - Po dacie
  - Po score
  - Po autorze

**Pliki do utworzenia:**
- `apps/demo/app/submissions/page.tsx` - główna strona dashboard
- `apps/demo/app/submissions/[id]/page.tsx` - szczegóły submission
- `apps/demo/src/components/submissions/submission-card.tsx`
- `apps/demo/src/components/submissions/submission-filters.tsx`
- `apps/demo/src/components/submissions/verification-results.tsx`

**Przykładowy layout:**
```
┌─────────────────────────────────────────────────┐
│ Submissions Dashboard                           │
├─────────────────────────────────────────────────┤
│ [Filters] [Status: All ▼] [Sort: Date ▼]       │
├─────────────────────────────────────────────────┤
│ ┌─────────┐ ┌─────────┐ ┌─────────┐           │
│ │ Card 1  │ │ Card 2  │ │ Card 3  │           │
│ │ [Preview│ │ [Preview│ │ [Preview│           │
│ │  Score] │ │  Score] │ │  Score] │           │
│ │ [Actions│ │ [Actions│ │ [Actions│           │
│ └─────────┘ └─────────┘ └─────────┘           │
└─────────────────────────────────────────────────┘
```

---

### 2. **Conversational Editing UI** (w Playground)

**Status:** ⚠️ Częściowo - infrastruktura gotowa, brak UI  
**Funkcjonalność:** Task 6 (Conversational Editing)

**Co powinno być:**
- **Selection Indicator:**
  - Toolbar pokazujący wybrany element (gdy kliknięto w preview)
  - Wyświetlanie `data-ui-id` i typu komponentu
  - Quick actions: "Edit", "Delete", "Duplicate"
  
- **Undo/Redo Controls:**
  - Przyciski Undo/Redo w toolbarze Playground
  - Keyboard shortcuts (Cmd+Z, Cmd+Shift+Z)
  - Wskaźnik historii (np. "3/10 changes")
  
- **Patch Command Interface:**
  - Rozszerzenie chat o obsługę patch commands
  - Parser dla komend typu:
    - "zmień tytuł na 'Nowy Tytuł'"
    - "dodaj przycisk 'Anuluj' obok Submit"
    - "przenieś formularz nad tabelę"
  - Wizualne potwierdzenie wykonania patch

- **Element Inspector:**
  - Sidebar pokazujący właściwości wybranego elementu
  - Możliwość edycji props bezpośrednio
  - Podgląd DSL dla wybranego elementu

**Pliki do utworzenia:**
- `apps/demo/src/components/playground/selection-toolbar.tsx`
- `apps/demo/src/components/playground/undo-redo-controls.tsx`
- `apps/demo/src/components/playground/element-inspector.tsx`
- `apps/demo/app/playground/dsl/patch-parser.ts` - parser komend do patch operations

**Przykładowy layout:**
```
┌─────────────────────────────────────────────────┐
│ [Undo] [Redo] | Selected: Button#submit-btn    │
│ [Edit] [Delete] [Duplicate]                    │
├─────────────────────────────────────────────────┤
│ Preview          │ Element Inspector            │
│ [Component]      │ Label: "Submit"              │
│                  │ Variant: "primary"           │
│                  │ [Edit Props]                │
└─────────────────────────────────────────────────┘
```

---

## 🎯 Priorytet P2 (Ważne - poprawia UX)

### 3. **Variant Generator - Ulepszenia**

**Status:** ✅ Podstawowe UI istnieje, ale można poprawić  
**Funkcjonalność:** Task 7 (Variant Generator)

**Co powinno być dodane:**
- **Porównanie wariantów:**
  - Side-by-side view dla wszystkich wariantów
  - Highlight różnic między wariantami
  - Możliwość merge'owania elementów z różnych wariantów
  
- **Lepsze preview:**
  - Screenshot/thumbnail dla każdego wariantu
  - Quick preview w hover
  - Pełnoekranowy preview
  
- **Filtrowanie i sortowanie:**
  - Sortowanie po score weryfikacji
  - Filtrowanie po source sections
  - Tagi dla wariantów (np. "mobile-friendly", "accessible")

**Pliki do modyfikacji:**
- `apps/demo/app/variants/page.tsx` - dodać comparison view
- `apps/demo/src/components/variants/variant-comparison.tsx` - nowy komponent

---

### 4. **A11y Telemetry - Integracja z Playground**

**Status:** ✅ Dashboard istnieje, ale brak integracji  
**Funkcjonalność:** Task 8 (A11y Telemetry)

**Co powinno być dodane:**
- **Inline A11y Warnings:**
  - Badge w preview pokazujący liczbę violations
  - Click na badge → otwiera panel z listą violations
  - Highlight problematycznych elementów w preview
  
- **Quick Fix Suggestions:**
  - Dla każdego violation → sugestia jak naprawić
  - One-click fix dla prostych problemów (np. dodanie aria-label)
  
- **A11y Score Indicator:**
  - Progress bar pokazujący A11y score
  - Kolorowy wskaźnik (zielony/żółty/czerwony)
  - Widoczny w toolbarze Playground

**Pliki do utworzenia:**
- `apps/demo/src/components/playground/a11y-panel.tsx`
- `apps/demo/src/components/playground/a11y-badge.tsx`
- `apps/demo/src/components/playground/a11y-quick-fix.tsx`

---

### 5. **Styling Controls - Lepsza Widoczność**

**Status:** ✅ UI istnieje, ale mogłoby być bardziej prominentne  
**Funkcjonalność:** Task 10 (Styling Grunt)

**Co powinno być dodane:**
- **Styling Toolbar:**
  - Przeniesienie StylingControls do bardziej widocznego miejsca
  - Możliwość zapisania presetów (np. "Dark Compact", "Light Comfortable")
  - Quick toggle dla każdego ustawienia
  
- **Preview w różnych trybach:**
  - Tabs pokazujące preview w różnych theme/density/motion/contrast
  - Side-by-side comparison
  
- **Export Settings:**
  - Możliwość eksportu ustawień jako JSON
  - Share link z zapisanymi ustawieniami

**Pliki do modyfikacji:**
- `apps/demo/src/components/styling-controls.tsx` - ulepszyć UI
- `apps/demo/src/components/styling-presets.tsx` - nowy komponent

---

## 🎯 Priorytet P3 (Nice to have - polish)

### 6. **Playground - Quick Actions Toolbar**

**Status:** ❌ Brakuje  
**Funkcjonalność:** Ogólne ulepszenie UX

**Co powinno być:**
- Floating toolbar z quick actions:
  - "Save to Submissions"
  - "Export Code"
  - "Share Link"
  - "Copy DSL"
  - "Download as ZIP"
  
- Keyboard shortcuts panel:
  - Help dialog z listą wszystkich shortcuts
  - Customizable shortcuts

**Pliki do utworzenia:**
- `apps/demo/src/components/playground/quick-actions-toolbar.tsx`
- `apps/demo/src/components/playground/keyboard-shortcuts-dialog.tsx`

---

### 7. **Component Library Browser**

**Status:** ❌ Brakuje  
**Funkcjonalność:** Pomoc w wyborze komponentów

**Co powinno być:**
- Sidebar z przeglądarką dostępnych komponentów
- Kategorie: Forms, Layout, Navigation, Data Display, Feedback
- Dla każdego komponentu:
  - Preview
  - Props documentation
  - Przykłady użycia
  - "Add to Playground" button
  
- Search i filtry:
  - Wyszukiwanie po nazwie
  - Filtrowanie po kategorii
  - Filtrowanie po dostępności w DS

**Pliki do utworzenia:**
- `apps/demo/app/components/page.tsx` - component library browser
- `apps/demo/src/components/component-library/component-card.tsx`
- `apps/demo/src/components/component-library/component-preview.tsx`

---

### 8. **DSL Visual Editor**

**Status:** ❌ Brakuje  
**Funkcjonalność:** Wizualna edycja DSL bez pisania kodu

**Co powinno być:**
- Tree view DSL z możliwością edycji
- Drag & drop dla reorderowania elementów
- Form editor dla props każdego elementu
- Live preview zmian

**Pliki do utworzenia:**
- `apps/demo/src/components/dsl-editor/dsl-tree-view.tsx`
- `apps/demo/src/components/dsl-editor/dsl-props-editor.tsx`
- `apps/demo/src/components/dsl-editor/dsl-visual-editor.tsx`

---

## 📊 Podsumowanie Priorytetów

| Priorytet | Zadanie | Status | Estymacja |
|-----------|---------|--------|-----------|
| **P1** | Submissions Dashboard | ❌ Brakuje | 8-12h |
| **P1** | Conversational Editing UI | ⚠️ Częściowo | 12-16h |
| **P2** | Variant Generator - Ulepszenia | ✅ Podstawowe | 4-6h |
| **P2** | A11y Telemetry - Integracja | ✅ Dashboard | 6-8h |
| **P2** | Styling Controls - Widoczność | ✅ Podstawowe | 2-4h |
| **P3** | Quick Actions Toolbar | ❌ Brakuje | 4-6h |
| **P3** | Component Library Browser | ❌ Brakuje | 8-12h |
| **P3** | DSL Visual Editor | ❌ Brakuje | 16-24h |

**Całkowita estymacja:** ~60-88h pracy

---

## 🚀 Quick Wins (można zrobić szybko)

1. **Dodanie linku do Submissions Dashboard w menu** (15 min)
2. **Undo/Redo buttons w Playground toolbar** (1h)
3. **A11y badge w preview** (2h)
4. **Styling presets** (2h)
5. **Quick Actions floating button** (3h)

**Total Quick Wins:** ~8h pracy

---

## 💡 Rekomendacje Implementacji

### Faza 1: Krytyczne (P1)
1. Submissions Dashboard - pełna funkcjonalność zarządzania
2. Conversational Editing UI - podstawowe elementy (selection, undo/redo, patch parser)

### Faza 2: Ważne (P2)
3. A11y integracja z Playground
4. Variant Generator ulepszenia
5. Styling Controls polish

### Faza 3: Polish (P3)
6. Quick Actions
7. Component Library Browser
8. DSL Visual Editor (opcjonalnie, może być w przyszłości)

---

## 📝 Uwagi Techniczne

1. **Submissions Dashboard** powinien używać istniejących komponentów z `@fragment_ui/ui` (Table, Card, Badge, Button)
2. **Conversational Editing UI** wymaga integracji z istniejącym `useUndoRedo` hook i `patch.ts`
3. **A11y Panel** powinien być zintegrowany z istniejącym `SameOriginPreview` i `onA11yResults` callback
4. Wszystkie nowe komponenty powinny przechodzić przez **Submissions workflow** (Task 3-5) przed dodaniem do DS

---

## ✅ Checklist przed implementacją

- [ ] Zdefiniować dokładne wymagania dla każdego elementu UI
- [ ] Stworzyć mockupy/wireframes dla kluczowych ekranów
- [ ] Zidentyfikować istniejące komponenty DS, które można wykorzystać
- [ ] Zaplanować integrację z istniejącymi API endpoints
- [ ] Ustalić priorytety z zespołem/stakeholderami
- [ ] Rozpocząć od Quick Wins dla szybkich rezultatów

