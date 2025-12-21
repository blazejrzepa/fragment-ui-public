# 📋 Kompletna lista wariantów Button dla Figma

## Problem
Figma pokazuje błąd konfliktu, ponieważ nie wszystkie kombinacje wariantów są zdefiniowane w Component Set.

## Rozwiązanie
Musisz utworzyć **wszystkie możliwe kombinacje** jako osobne warianty w Figma.

---

## 🧮 Obliczenia

### Variant Properties (tworzą kombinacje):
- **Variant:** `solid`, `outline`, `ghost` (3 wartości)
- **Size:** `sm`, `md`, `lg` (3 wartości)
- **State:** `default`, `loading`, `disabled` (3 wartości)

### Łączna liczba wariantów:
**3 × 3 × 3 = 27 wariantów**

### ⚠️ Ważne: Ikony NIE są Variant Properties!

**Leading Icon** i **Trailing Icon** powinny być **Instance Properties** (zwykłe properties), NIE Variant Properties.

**Dlaczego?**
- Jeśli ikony byłyby Variant Properties, musiałbyś utworzyć: 3 × 3 × 3 × 5 = **135 wariantów**!
- W kodzie ikony są opcjonalne i można je dodać do dowolnego wariantu
- W Figma ikony powinny być ustawiane jako Instance Properties, które można zmienić na dowolnym wariancie bez tworzenia nowych kombinacji

---

## ✅ Kompletna lista wszystkich 27 wariantów

### Variant: solid

| Size | State | Nazwa wariantu w Figma |
|------|-------|------------------------|
| sm | default | `solid, sm, default` |
| sm | loading | `solid, sm, loading` |
| sm | disabled | `solid, sm, disabled` |
| md | default | `solid, md, default` |
| md | loading | `solid, md, loading` |
| md | disabled | `solid, md, disabled` |
| lg | default | `solid, lg, default` |
| lg | loading | `solid, lg, loading` |
| lg | disabled | `solid, lg, disabled` |

### Variant: outline

| Size | State | Nazwa wariantu w Figma |
|------|-------|------------------------|
| sm | default | `outline, sm, default` |
| sm | loading | `outline, sm, loading` |
| sm | disabled | `outline, sm, disabled` |
| md | default | `outline, md, default` |
| md | loading | `outline, md, loading` |
| md | disabled | `outline, md, disabled` |
| lg | default | `outline, lg, default` |
| lg | loading | `outline, lg, loading` |
| lg | disabled | `outline, lg, disabled` |

### Variant: ghost

| Size | State | Nazwa wariantu w Figma |
|------|-------|------------------------|
| sm | default | `ghost, sm, default` |
| sm | loading | `ghost, sm, loading` |
| sm | disabled | `ghost, sm, loading` |
| md | default | `ghost, md, default` |
| md | loading | `ghost, md, loading` |
| md | disabled | `ghost, md, disabled` |
| lg | default | `ghost, lg, default` |
| lg | loading | `ghost, lg, loading` |
| lg | disabled | `ghost, lg, disabled` |

---

## 🎨 Jak utworzyć wszystkie warianty w Figma

### Krok 1: Utwórz podstawowy wariant
1. Otwórz Component Set "Buttons"
2. Wybierz główny komponent (lub pierwszy wariant)
3. Upewnij się, że ma właściwe style dla `solid, md, default`

### Krok 2: Duplikuj i modyfikuj
1. **Duplikuj** podstawowy wariant (⌘D) - utworzy nowy wariant
2. W Properties panel zmień wartości:
   - Zmień `Variant` na `outline` lub `ghost`
   - Zmień `Size` na `sm` lub `lg`
   - Zmień `State` na `loading` lub `disabled`
3. Zaktualizuj style wizualne zgodnie z wartościami

### Krok 3: Powtórz dla wszystkich kombinacji
Powtarzaj krok 2, aż będziesz mieć wszystkie **27 wariantów**.

---

## 🚀 Szybsza metoda: użyj "Create Variant"

1. Kliknij na Component Set "Buttons"
2. Kliknij **"+"** w sekcji Variants (lub prawy przycisk → "Add Variant")
3. Figma automatycznie utworzy nowy wariant z domyślnymi wartościami
4. Zmień wartości w Properties panel
5. Zaktualizuj style wizualne

**Powtórz 26 razy** (masz już 1 podstawowy = potrzebujesz jeszcze 26).

---

## 📐 Style dla każdego wariantu

### State: default
- Normalne style (bez zmian)
- **Ikony:** Możesz ustawić `Leading Icon` lub `Trailing Icon` jako Instance Property (nie tworzy nowego wariantu)

### State: loading
- **Solid/Outline/Ghost:** Dodaj spinner jako `Leading Icon` (Instance Property)
- Opcjonalnie: zmień tekst na "Loading..." lub użyj `loadingText`
- Opacity: 60% (disabled state)
- **Uwaga:** W kodzie `loading={true}` automatycznie pokazuje spinner, więc w Figma możesz użyć Instance Property `Leading Icon` z komponentem Spinner

### State: disabled
- Opacity: 60%
- Cursor: not-allowed (wizualnie)
- **Ikony:** Nadal możesz ustawić ikony jako Instance Properties

### Size: sm
- Height: 32px
- Padding: 12px (horizontal)
- Font: 14px, medium

### Size: md
- Height: 40px
- Padding: 16px (horizontal)
- Font: 14px, medium

### Size: lg
- Height: 48px
- Padding: 20px (horizontal)
- Font: 16px, medium

### Variant: solid
- Background: `Color / Brand / Primary`
- Text: White
- Border: None

### Variant: outline
- Background: Transparent
- Text: `Color / Text / Base`
- Border: 1px `Color / Border / Muted`

### Variant: ghost
- Background: Transparent
- Text: `Color / Text / Base`
- Border: None

---

## ✅ Checklist weryfikacji

Po utworzeniu wszystkich wariantów:

- [ ] Masz dokładnie **27 wariantów** w Component Set
- [ ] Każda kombinacja `Variant × Size × State` istnieje
- [ ] Błąd konfliktu zniknął
- [ ] Wszystkie warianty mają poprawne style
- [ ] Loading state pokazuje spinner
- [ ] Disabled state ma opacity 60%
- [ ] Wszystkie rozmiary mają poprawne wysokości i padding

---

## 🔍 Jak sprawdzić, czy masz wszystkie warianty

1. Otwórz Component Set "Buttons"
2. W Properties panel wybierz:
   - `Variant: solid`
   - `Size: sm`
   - `State: default`
3. Jeśli nie ma błędu → ten wariant istnieje ✓
4. Przejdź przez wszystkie kombinacje (27 razy)

**Lub użyj skrótu:**
- Kliknij na Component Set
- Sprawdź liczbę wariantów w panelu po lewej
- Powinno być **27 wariantów**

---

## 🎨 Jak obsługiwać ikony w Figma

### Ikony jako Instance Properties (rekomendowane)

1. **Utwórz Instance Properties:**
   - `Leading Icon` - typ: Instance (lub Boolean dla show/hide)
   - `Trailing Icon` - typ: Instance (lub Boolean dla show/hide)
   - **NIE** dodawaj ich jako Variant Properties!

2. **Dla każdego z 27 wariantów:**
   - Możesz ustawić `Leading Icon` lub `Trailing Icon` jako Instance Property
   - To nie tworzy nowych wariantów, tylko modyfikuje istniejący

3. **Przykład użycia:**
   - Wybierz wariant: `solid, md, default`
   - W Properties panel ustaw `Leading Icon: [ikonka]` (Instance Property)
   - To nie tworzy nowego wariantu, tylko modyfikuje wygląd tego wariantu

### Alternatywa: Ikony jako Variant Property (NIE rekomendowane)

Jeśli chcesz mieć ikony jako Variant Properties, musisz utworzyć:
- **3 × 3 × 3 × 5 = 135 wariantów** (gdzie 5 to: none, leading, trailing, both, only)

**To jest zbyt dużo i nie jest zgodne z kodem!** W kodzie ikony są opcjonalne props, nie warianty.

---

## 🎯 Priorytet tworzenia wariantów

Jeśli nie chcesz tworzyć wszystkich 27 na raz, zacznij od najważniejszych:

### Faza 1: Podstawowe (9 wariantów)
- Wszystkie kombinacje `Variant × Size` z `State: default`
- **3 × 3 = 9 wariantów**
- **Ikony:** Dodaj później jako Instance Properties

### Faza 2: Disabled (9 wariantów)
- Wszystkie kombinacje `Variant × Size` z `State: disabled`
- **3 × 3 = 9 wariantów**
- **Ikony:** Dodaj później jako Instance Properties

### Faza 3: Loading (9 wariantów)
- Wszystkie kombinacje `Variant × Size` z `State: loading`
- **3 × 3 = 9 wariantów**
- **Ikony:** Dla loading state użyj Instance Property `Leading Icon` z komponentem Spinner

---

## 📋 Finalna struktura Properties

### Variant Properties (tworzą kombinacje):
1. **Variant:** `solid | outline | ghost`
2. **Size:** `sm | md | lg`
3. **State:** `default | loading | disabled`

**Razem: 27 wariantów**

### Instance Properties (nie tworzą kombinacji):
4. **Text:** string (dowolny tekst)
5. **Leading Icon:** Instance | placeholder (opcjonalne)
6. **Trailing Icon:** Instance | placeholder (opcjonalne)

**Te properties można ustawić na dowolnym wariancie bez tworzenia nowych kombinacji.**

---

## 📚 Powiązane dokumenty

- [Button Properties Recommendations](./figma-button-properties-recommendations.md)
- [Button Sync Guide](./figma-button-sync-guide.md)
- [Button Component Code](../../packages/ui/src/button.tsx)

---

*Ostatnia aktualizacja: 2025-11-07*

