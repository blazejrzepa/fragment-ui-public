# 🎯 Rekomendacje dla Properties Button w Figma

## 📊 Analiza obecnych properties vs kod

### ✅ Zgodne z kodem
- **Variant:** `solid, outline, ghost` ✓
- **disabled:** boolean ✓
- **Text:** string ✓
- **Leading Icon / Trailing Icon:** props ✓

### ⚠️ Wymagają dostosowania
- **Size:** W Figma `sm, md, lg, xl, 2xl` → w kodzie tylko `sm, md, lg`
- **Icon:** W Figma `No, Only, Trailing, Leading` → w kodzie to kombinacja props
- **State:** W Figma `Default` → w kodzie jest też `loading`
- **Only Icon:** W Figma osobne property → w kodzie to `leadingIcon` bez `children`

---

## 🎨 Rekomendowane properties dla Button

### 1. **Variant** (zostaw jak jest)
```
Type: Variant Property
Values: solid | outline | ghost
Default: solid
```
✅ **Status:** Zgodne z kodem

---

### 2. **Size** (usuń xl, 2xl lub dodaj do kodu)
```
Type: Variant Property
Values: sm | md | lg
Default: md
```

**Rekomendacja:**
- **Opcja A (rekomendowana):** Usuń `xl` i `2xl` z Figma, żeby zachować zgodność z kodem
- **Opcja B:** Dodaj `xl` i `2xl` do kodu (wymaga implementacji w `button.tsx`)

**Aktualne wartości w kodzie:**
- `sm`: h-8 (32px), px-3 (12px), text-sm (14px)
- `md`: h-10 (40px), px-4 (16px), text-sm (14px)
- `lg`: h-12 (48px), px-5 (20px), text-base (16px)

---

### 3. **Icon** (przeprojektuj jako kombinację)
```
Type: Variant Property
Values: none | leading | trailing | both | only
Default: none
```

**Mapowanie na kod:**
- `none` → brak `leadingIcon` i `trailingIcon`
- `leading` → `leadingIcon` ustawiony, `trailingIcon` = null
- `trailing` → `trailingIcon` ustawiony, `leadingIcon` = null
- `both` → oba ustawione
- `only` → `leadingIcon` ustawiony, `children` = "" (pusty tekst)

**Alternatywa (prostsza):**
Zostaw osobne properties `Leading Icon` i `Trailing Icon` (jak masz teraz) i usuń główne property `Icon`.

---

### 4. **State** (rozszerz o Loading)
```
Type: Variant Property
Values: default | loading | disabled
Default: default
```

**Mapowanie na kod:**
- `default` → normalny stan
- `loading` → `loading={true}`, pokazuje Spinner
- `disabled` → `disabled={true}` (lub `loading={true}`)

**Uwaga:** W kodzie `loading` automatycznie ustawia `disabled={true}`, więc możesz mieć:
- `State: default` → normalny button
- `State: loading` → button z spinnerem (disabled)
- `State: disabled` → button disabled bez spinnera

---

### 5. **disabled** (zostaw jako boolean lub usuń)
```
Type: Boolean Property
Values: true | false
Default: false
```

**Rekomendacja:**
- Jeśli masz `State` property (z wartością `disabled`), możesz **usunąć** osobne `disabled` property
- Jeśli chcesz zachować, zostaw jako boolean

---

### 6. **Text** (zostaw jak jest)
```
Type: Text Property
Values: dowolny string
Default: "Button"
```
✅ **Status:** Zgodne z kodem

---

### 7. **Leading Icon / Trailing Icon / Only Icon** (uprość)
```
Type: Instance Property (lub Text Property)
Values: placeholder | [ikonka z biblioteki]
Default: placeholder
```

**Rekomendacja:**
- Zostaw `Leading Icon` i `Trailing Icon` (jak masz)
- **Usuń** `Only Icon` (to jest po prostu `Leading Icon` + pusty `Text`)
- Lub zmień `Only Icon` na warunek: jeśli `Text` jest pusty i `Leading Icon` jest ustawiony → pokaż tylko ikonę

---

## 🔧 Finalna struktura properties (rekomendowana)

### Wariant 1: Minimalistyczny (rekomendowany)
```
1. Variant: solid | outline | ghost
2. Size: sm | md | lg
3. State: default | loading | disabled
4. Text: string
5. Leading Icon: placeholder | [ikonka]
6. Trailing Icon: placeholder | [ikonka]
```

**Usuń:**
- ❌ `Icon` (główne property)
- ❌ `disabled` (boolean - zastąpione przez `State`)
- ❌ `Only Icon` (zastąpione przez `Leading Icon` + pusty `Text`)

---

### Wariant 2: Rozszerzony (jeśli potrzebujesz więcej kontroli)
```
1. Variant: solid | outline | ghost
2. Size: sm | md | lg
3. Icon Mode: none | leading | trailing | both | only
4. State: default | loading | disabled
5. Text: string
6. Leading Icon: placeholder | [ikonka]
7. Trailing Icon: placeholder | [ikonka]
```

**Uwaga:** W tym wariancie `Icon Mode` kontroluje, które ikony są widoczne, a `Leading Icon`/`Trailing Icon` to źródła danych.

---

## 📋 Checklist implementacji w Figma

### Krok 1: Usuń niepotrzebne properties
- [ ] Usuń `xl` i `2xl` z `Size` (lub dodaj do kodu)
- [ ] Usuń główne property `Icon` (lub przeprojektuj jako `Icon Mode`)
- [ ] Usuń `Only Icon` (lub zastąp logiką: `Leading Icon` + pusty `Text`)
- [ ] Usuń `disabled` (boolean) jeśli masz `State` z wartością `disabled`

### Krok 2: Rozszerz State
- [ ] Dodaj `loading` do `State` property
- [ ] Ustaw `default` jako domyślny

### Krok 3: Zweryfikuj mapowanie
- [ ] `Size: sm` → kod: `size="sm"`
- [ ] `Size: md` → kod: `size="md"`
- [ ] `Size: lg` → kod: `size="lg"`
- [ ] `State: loading` → kod: `loading={true}`
- [ ] `State: disabled` → kod: `disabled={true}`
- [ ] `Leading Icon` ustawiony → kod: `leadingIcon={...}`
- [ ] `Trailing Icon` ustawiony → kod: `trailingIcon={...}`

### Krok 4: Testuj warianty
- [ ] Wszystkie kombinacje `Variant × Size × State` działają
- [ ] Ikony wyświetlają się poprawnie
- [ ] Loading state pokazuje spinner (wizualnie w Figma)

---

## 🎨 Wizualna reprezentacja w Figma

### Dla State: loading
W Figma możesz:
1. **Opcja A:** Pokazać spinner jako ikonę (użyj komponentu Spinner z biblioteki)
2. **Opcja B:** Dodać overlay z tekstem "Loading..." (dla dokumentacji)
3. **Opcja C:** Zostawić jako wariant bez wizualnej reprezentacji (tylko w properties)

**Rekomendacja:** Opcja A - użyj komponentu Spinner jako `Leading Icon` gdy `State = loading`.

---

## 🔄 Synchronizacja z kodem

Po wprowadzeniu zmian w Figma:

1. **Zaktualizuj skrypt Dev Resources:**
   ```bash
   # Edytuj scripts/generate-figma-dev-resources.ts
   # Dodaj mapowanie dla nowych properties
   ```

2. **Zaktualizuj dokumentację:**
   - `docs/guides/figma-button-sync-guide.md`
   - `apps/www/app/docs/components/button/page.tsx`

3. **Zweryfikuj w Storybook:**
   - Sprawdź czy wszystkie warianty działają
   - Porównaj z Figma

---

## 📚 Powiązane dokumenty

- [Button Component Code](../../packages/ui/src/button.tsx)
- [Button Sync Guide](./figma-button-sync-guide.md)
- [Figma Dev Resources Setup](./figma-dev-resources-manual-setup.md)

---

*Ostatnia aktualizacja: 2025-11-07*

