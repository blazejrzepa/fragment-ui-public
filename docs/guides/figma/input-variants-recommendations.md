# 🎯 Rekomendacje dla Properties Input w Figma

## 📊 Analiza obecnej implementacji Input

### Co mamy w kodzie (`packages/ui/src/input.tsx`):

**Props:**
- `loading?: boolean` - pokazuje spinner
- `error?: boolean` - czerwony border i focus ring
- `disabled?: boolean` - opacity 60%
- `type?: string` - HTML input type (text, email, password, number, etc.)

**Style:**
- Wysokość: `h-10` (40px) - fixed
- Padding: `px-3` (12px horizontal)
- Border radius: `var(--radius-md)`
- Background: `var(--color-surface-1)`
- Border: `var(--color-fg-muted)` (normal) lub `var(--color-status-error-border)` (error)
- Focus ring: `ring-2 ring-brand` (normal) lub `ring-[color:var(--color-status-error-base)]` (error)

---

## 🎨 Rekomendowane properties dla Input w Figma

### Wariant 1: Minimalistyczny (rekomendowany)

**Variant Properties (tworzą kombinacje):**
1. **State:** `default | disabled | error | loading`
2. **Size:** `sm | md | lg` (opcjonalnie, jeśli chcesz różne rozmiary)

**Instance Properties (nie tworzą kombinacji):**
3. **Type:** `text | email | password | number | tel | url` (HTML input type)
4. **Placeholder:** string (dowolny tekst)
5. **Value:** string (wartość inputa)
6. **Label:** string (opcjonalnie, jeśli chcesz pokazać label)

**Łączna liczba wariantów:**
- **Z Size:** 4 State × 3 Size = **12 wariantów**
- **Bez Size:** 4 State = **4 warianty** (rekomendowane)

---

### Wariant 2: Rozszerzony (jeśli potrzebujesz więcej kontroli)

**Variant Properties:**
1. **State:** `default | disabled | error | loading`
2. **Size:** `sm | md | lg`
3. **Type:** `text | email | password | number` (jeśli chcesz mieć wizualne różnice)

**Instance Properties:**
4. **Placeholder:** string
5. **Value:** string
6. **Label:** string

**Łączna liczba wariantów:**
- 4 State × 3 Size × 4 Type = **48 wariantów** (zbyt dużo!)

**Rekomendacja:** NIE używaj Type jako Variant Property - użyj jako Instance Property.

---

## ✅ Finalna rekomendacja

### Variant Properties (tylko 2):
1. **State:** `default | disabled | error | loading`
2. **Size:** `sm | md | lg` (opcjonalnie)

**Łączna liczba wariantów:**
- **Z Size:** 4 × 3 = **12 wariantów**
- **Bez Size:** 4 = **4 warianty** (rekomendowane - prostsze)

### Instance Properties:
3. **Type:** `text | email | password | number | tel | url` (HTML input type)
4. **Placeholder:** string
5. **Value:** string
6. **Label:** string (opcjonalnie)

---

## 📐 Style dla każdego wariantu

### State: default
- **Border:** `Color / Border / Muted` (token `--color-fg-muted`)
- **Background:** `Color / Surface / 1` (token `--color-surface-1`)
- **Focus Ring:** `Color / Brand / Primary` (2px ring)

### State: disabled
- **Border:** `Color / Border / Muted`
- **Background:** `Color / Surface / 1`
- **Opacity:** 60%
- **Cursor:** not-allowed

### State: error
- **Border:** `Color / Status / Error / Border` (token `--color-status-error-border`)
- **Background:** `Color / Surface / 1`
- **Focus Ring:** `Color / Status / Error / Base` (2px ring)

### State: loading
- **Border:** `Color / Border / Muted`
- **Background:** `Color / Surface / 1`
- **Spinner:** Dodaj spinner jako Instance Property (po prawej stronie)
- **Padding Right:** Zwiększ, żeby zrobić miejsce na spinner

### Size: sm (jeśli dodasz)
- **Height:** 32px (h-8)
- **Padding:** 8px 12px (vertical horizontal)
- **Font Size:** 14px (text-sm)

### Size: md (domyślny)
- **Height:** 40px (h-10)
- **Padding:** 12px (horizontal, px-3)
- **Font Size:** 14px (text-sm)

### Size: lg (jeśli dodasz)
- **Height:** 48px (h-12)
- **Padding:** 16px (horizontal, px-4)
- **Font Size:** 16px (text-base)

---

## 📋 Kompletna lista wariantów (z Size)

### State: default

| Size | Nazwa wariantu w Figma |
|------|------------------------|
| sm | `default, sm` |
| md | `default, md` |
| lg | `default, lg` |

### State: disabled

| Size | Nazwa wariantu w Figma |
|------|------------------------|
| sm | `disabled, sm` |
| md | `disabled, md` |
| lg | `disabled, lg` |

### State: error

| Size | Nazwa wariantu w Figma |
|------|------------------------|
| sm | `error, sm` |
| md | `error, md` |
| lg | `error, lg` |

### State: loading

| Size | Nazwa wariantu w Figma |
|------|------------------------|
| sm | `loading, sm` |
| md | `loading, md` |
| lg | `loading, lg` |

**Razem: 12 wariantów** (4 State × 3 Size)

---

## 📋 Kompletna lista wariantów (bez Size - rekomendowane)

1. `default`
2. `disabled`
3. `error`
4. `loading`

**Razem: 4 warianty** (tylko State)

---

## 🎯 Rekomendacja końcowa

**Dla Input w Figma użyj:**

### Variant Properties (tylko State):
- `State`: `default | disabled | error | loading`

**4 warianty** - prostsze i wystarczające!

### Instance Properties:
- `Type`: text | email | password | number (HTML input type)
- `Placeholder`: string
- `Value`: string
- `Label`: string (opcjonalnie)

**Dlaczego bez Size?**
- W kodzie Input ma fixed height (h-10 = 40px)
- Nie ma prop `size` w InputProps
- Jeśli potrzebujesz różnych rozmiarów, możesz dodać Size jako Variant Property później

---

## 📚 Powiązane dokumenty

- [Input Component Code](../../packages/ui/src/input.tsx)
- [Input Documentation](../../apps/www/app/docs/components/input/page.tsx)
- [Button Variants Guide](./figma-button-variants-complete-list.md)

---

*Ostatnia aktualizacja: 2025-11-07*

