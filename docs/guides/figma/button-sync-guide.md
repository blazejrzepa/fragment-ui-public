# 🔄 Synchronizacja Button w Figma z kodem

## Problem
Buttony w Figma wyglądają inaczej niż w DS portalu i Storybooku. Ten przewodnik pomoże zsynchronizować design w Figma z implementacją w kodzie.

---

## 📋 Dokładne wartości z kodu

### Warianty Buttona

#### **Solid (domyślny)**
- **Tło:** `bg-brand` (token `--color-brand-primary`)
- **Tekst:** `text-white` (biały)
- **Hover:** `opacity-90` (90% przezroczystości)
- **Disabled:** `opacity-60` (60% przezroczystości)

#### **Outline**
- **Tło:** przezroczyste
- **Border:** `border-[color:var(--color-fg-muted)]` (1px)
- **Tekst:** `text-[color:var(--color-fg-base)]`
- **Hover:** `bg-[color:var(--color-surface-2)]`

#### **Ghost**
- **Tło:** przezroczyste
- **Border:** brak
- **Tekst:** `text-[color:var(--color-fg-base)]`
- **Hover:** `bg-[color:var(--color-surface-2)]`

### Rozmiary

| Rozmiar | Padding (vertical horizontal) | Gap | Font Size | Line Height | Font Weight |
|---------|------------------------------|-----|-----------|-------------|-------------|
| **sm** | 6px 12px | 8px | 14px (text-sm) | 160% (22.4px) | 500 (medium) |
| **md** | 6px 16px | 10px | 16px (text-base) | 160% (25.6px) | 500 (medium) |
| **lg** | 8px 20px | 8px | 18px (text-lg) | 150% (27px) | 500 (medium) |

### Wspólne właściwości
- **Border Radius:** `var(--Corner-Radius-2xs, 6px)`
- **Box Shadow:** `0 1px 3px 0 rgba(0, 0, 0, 0.10), 0 1px 2px 0 rgba(0, 0, 0, 0.06)` (tylko dla solid variant)
- **Font Weight:** `font-medium` (500)
- **Display:** `inline-flex items-center justify-center`
- **Transition:** `transition-colors` (200ms ease-in-out)
- **Focus:** `ring-2 ring-brand` (outline ring)

---

## ✅ Krok po kroku: Synchronizacja w Figma

### Krok 1: Otwórz komponent Button w Figma
1. Otwórz bibliotekę Fragment UI w Figma
2. Znajdź komponent **"Buttons"** (Component Set)
3. Kliknij na główny komponent (nie na warianty)

### Krok 2: Sprawdź użycie tokenów
1. **Kliknij na warstwę tła** (dla variant=solid)
2. Sprawdź czy używa **Color Style** → powinno być `Color / Brand / Primary` (nie ręczny HEX!)
3. Jeśli widzisz ręczny kolor (np. `#0066FF`), zmień na token z biblioteki

### Krok 3: Ustaw właściwości dla każdego wariantu

#### **Variant: solid**
- **Fill:** `Color / Foreground / Primary` (token `--foreground-primary`, fallback `#FAFAFA`)
- **Text Color:** `Color / Background / Primary` (token `--background-primary`, fallback `#09090B`)
- **Font Family:** Geist
- **Font Size:** 
  - sm: 14px
  - md: 16px
  - lg: 18px
- **Line Height:**
  - sm: 160% (22.4px)
  - md: 160% (25.6px)
  - lg: 150% (27px)
- **Font Weight:** 500 (medium)
- **Border Radius:** `Radius / 2xs` (token `--Corner-Radius-2xs`, fallback `6px`)
- **Box Shadow:** `0 1px 3px 0 rgba(0, 0, 0, 0.10), 0 1px 2px 0 rgba(0, 0, 0, 0.06)`
- **Effects (Hover):** Opacity 90%
- **Effects (Disabled):** Opacity 60%

#### **Variant: outline**
- **Fill:** przezroczyste (0% opacity)
- **Stroke:** `Color / Border / Muted` (token `--color-fg-muted`)
- **Stroke Width:** 1px
- **Text:** `Color / Text / Base` (token `--color-fg-base`)
- **Border Radius:** `Radius / Medium`
- **Effects (Hover):** Fill `Color / Surface / 2` (token `--color-surface-2`)

#### **Variant: ghost**
- **Fill:** przezroczyste (0% opacity)
- **Stroke:** brak
- **Text:** `Color / Text / Base` (token `--color-fg-base`)
- **Border Radius:** `Radius / Medium`
- **Effects (Hover):** Fill `Color / Surface / 2` (token `--color-surface-2`)

### Krok 4: Ustaw rozmiary

Dla każdego rozmiaru (sm, md, lg) ustaw:

| Rozmiar | Padding (vertical horizontal) | Gap | Text Style |
|---------|------------------------------|-----|------------|
| **sm** | 6px 12px | 8px | Text / Body / Small (14px, medium) |
| **md** | 6px 16px | 10px | Text / Body / Small (14px, medium) |
| **lg** | 8px 20px | 8px | Text / Body / Base (16px, medium) |

**Wskazówka:** Użyj **Auto Layout** w Figma:
- Padding: `12px 16px` (dla md)
- Spacing: `8px` (między ikoną a tekstem)

### Krok 5: Ustaw typografię
1. **Font Weight:** Medium (500)
2. **Text Align:** Center
3. **Line Height:** Auto (lub 1.2)

### Krok 6: Dodaj stany interakcji
1. **Hover:** 
   - Solid: Opacity 90%
   - Outline/Ghost: Fill `Color / Surface / 2`
2. **Pressed:** Opacity 80% (opcjonalnie)
3. **Disabled:** Opacity 60%
4. **Focus:** Dodaj ring (2px, `Color / Brand / Primary`)

### Krok 7: Sprawdź ikony
- **Spacing między ikoną a tekstem:** 8px (`mr-2` / `ml-2` w kodzie = 0.5rem = 8px)
- **Ikony:** Użyj komponentu placeholder lub ikony z biblioteki

### Krok 8: Opublikuj zmiany
1. Zapisz wszystkie zmiany
2. Kliknij **"Publish"** w bibliotece Figma
3. Zaktualizuj wersję (np. v1.1.0)

---

## 🔍 Weryfikacja

### Porównaj wizualnie:
1. Otwórz Storybook: `https://6908c46a37e9c1c1fe40b48d-wvgljbvydh.chromatic.com?path=/docs/core-button--docs`
2. Otwórz DS Portal: `https://fragment-ui-www.vercel.app/docs/components/button`
3. Porównaj z Figma - powinny wyglądać identycznie

### Sprawdź tokeny:
- Wszystkie kolory powinny używać **tokenów** (nie ręcznych wartości)
- Border radius powinien używać tokena `--radius-md`
- Spacing powinien używać tokenów spacing scale

---

## 📝 Checklist synchronizacji

- [ ] Wszystkie kolory używają tokenów (nie HEX)
- [ ] Border radius = token `--radius-md`
- [ ] Padding: sm=6px 12px, md=6px 16px, lg=8px 20px
- [ ] Gap: sm=8px, md=10px, lg=8px
- [ ] Font size: sm=14px, md=16px, lg=18px
- [ ] Line height: sm/md=160%, lg=150%
- [ ] Font weight: 500 (medium)
- [ ] Text color (solid): `--background-primary, #09090B`
- [ ] Hover states: solid=opacity 90%, outline/ghost=fill surface-2
- [ ] Disabled state: opacity 60%
- [ ] Focus ring: 2px, brand color
- [ ] Ikony: spacing 8px od tekstu
- [ ] Opublikowano zmiany w bibliotece

---

## 🚨 Częste problemy

### Problem: Kolory nie pasują
**Rozwiązanie:** Upewnij się, że używasz tokenów z biblioteki, nie ręcznych wartości HEX. Sprawdź czy tokeny są zsynchronizowane z `packages/tokens`.

### Problem: Wysokości się nie zgadzają
**Rozwiązanie:** Użyj Auto Layout w Figma i ustaw dokładne wysokości (32px, 40px, 48px).

### Problem: Padding wygląda inaczej
**Rozwiązanie:** Sprawdź czy Auto Layout ma ustawiony padding poziomy (nie vertical).

### Problem: Border radius się różni
**Rozwiązanie:** Użyj tokena `Radius / Medium` zamiast ręcznej wartości.

---

## 📚 Powiązane dokumenty

- [Button Component Code](../../packages/ui/src/button.tsx)
- [Button Documentation](../../apps/www/app/docs/components/button/page.tsx)
- [Design Tokens](../../packages/tokens/src/tokens.json)

---

*Ostatnia aktualizacja: 2025-11-07*

