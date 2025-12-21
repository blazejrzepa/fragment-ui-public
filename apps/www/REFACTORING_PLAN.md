# Plan Refaktoryzacji Stron Dokumentacji

## Status: W TRAKCIE

## Zidentyfikowane Problemy

### 1. Inline Styles z fontWeight w tabelach API
- **Lokalizacja**: Wszystkie strony components/*/page.tsx
- **Problem**: `style={{ fontWeight: "var(--typography-weight-semibold, 600)" }}`
- **Rozwiązanie**: Zastąpić `font-semibold` klasą Tailwind
- **Status**: ✅ Komponent ApiTable utworzony, częściowo naprawione

### 2. Inline Styles z backgroundColor/color
- **Lokalizacja**: semantic-colors/page.tsx, button/page.tsx
- **Problem**: Inline styles zamiast klas Tailwind
- **Rozwiązanie**: Użyć klas Tailwind z tokenami
- **Status**: ✅ Naprawione w semantic-colors i button

### 3. Hardcoded wartości w tools/page.tsx
- **Problem**: Inline styles z fontFamily, fontSize, etc.
- **Rozwiązanie**: Użyć klas Tailwind i intro-text
- **Status**: ✅ Naprawione

### 4. Brak użycia tokenów dla spacing
- **Problem**: Hardcoded wartości jak `mt-8`, `p-4`
- **Rozwiązanie**: Użyć `mt-[var(--space-8)]`, `p-[var(--space-4)]`
- **Status**: ⏳ W trakcie

## Postęp Refaktoryzacji

### ✅ Ukończone:
- [x] tools/page.tsx - usunięto inline styles
- [x] components/button/page.tsx - usunięto inline styles z backgroundColor
- [x] components/button/page.tsx - naprawiono fontWeight w tabelach
- [x] components/segmented-control/page.tsx - naprawiono fontWeight w tabelach
- [x] foundations/semantic-colors/page.tsx - usunięto wszystkie inline styles
- [x] Utworzono ApiTable component

### ⏳ W trakcie:
- [ ] Refaktoryzacja pozostałych stron components/ (ok. 100+ stron)
- [ ] Refaktoryzacja foundations/ (tokens, typography, spacing, theming)
- [ ] Refaktoryzacja guides/ i get-started/
- [ ] Refaktoryzacja templates/ i examples/

### 📋 Do zrobienia:
- [ ] Masowa refaktoryzacja tabel API we wszystkich stronach components/
- [ ] Sprawdzenie i naprawa hardcoded wartości spacing
- [ ] Weryfikacja użycia tokenów we wszystkich plikach
- [ ] Finalna weryfikacja linting

## Strategia

Ze względu na dużą liczbę plików (151 stron), refaktoryzacja będzie przeprowadzana systematycznie:

1. **Faza 1**: Naprawa najczęstszych problemów (inline styles w tabelach)
2. **Faza 2**: Refaktoryzacja stron foundations/
3. **Faza 3**: Refaktoryzacja stron components/ (masowa)
4. **Faza 4**: Refaktoryzacja pozostałych sekcji
5. **Faza 5**: Finalna weryfikacja

## Wzorce do zastosowania

### Tabele API:
```tsx
// ❌ PRZED
<th style={{ fontWeight: "var(--typography-weight-semibold, 600)" }}>

// ✅ PO
<th className="font-semibold">
```

### Kolory i tła:
```tsx
// ❌ PRZED
<div style={{ backgroundColor: "var(--color-X)", color: "var(--color-Y)" }}>

// ✅ PO
<div className="bg-[color:var(--color-X)] text-[color:var(--color-Y)]">
```

### Spacing:
```tsx
// ❌ PRZED
<div className="mt-8 p-4">

// ✅ PO
<div className="mt-[var(--space-8)] p-[var(--space-4)]">
```
