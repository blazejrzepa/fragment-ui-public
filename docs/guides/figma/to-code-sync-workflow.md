# 🔄 Workflow: Synchronizacja Button z Figma → Code → Docs → Storybook

## 📋 Overview

Ten przewodnik pokazuje, jak zsynchronizować buttony z Figma do kodu, dokumentacji i Storybooka.

---

## 🎯 Krok 1: Sprawdź, co masz w Figma

### W Figma:
1. Otwórz Component Set "Buttons"
2. Sprawdź wszystkie warianty:
   - **Variant:** solid, outline, ghost
   - **Size:** sm, md, lg
   - **State:** default, loading, disabled
3. Sprawdź style:
   - Kolory (używają tokenów?)
   - Wysokości (32px, 40px, 48px?)
   - Padding (12px, 16px, 20px?)
   - Border radius (token `--radius-md`?)
4. Sprawdź ikony:
   - Leading Icon (Instance Property?)
   - Trailing Icon (Instance Property?)

### Zapisz notatki:
- Jakie warianty masz w Figma?
- Jakie style są używane?
- Czy są jakieś różnice w stosunku do kodu?

---

## 🔍 Krok 2: Porównaj Figma z kodem

### Sprawdź kod (`packages/ui/src/button.tsx`):

**Obecne wartości w kodzie:**
- Variant: `solid`, `outline`, `ghost`
- Size: `sm`, `md`, `lg`
- State: `default` (normalny), `loading` (z spinnerem), `disabled` (opacity 60%)

**Style w kodzie:**
- sm: h-8 (32px), px-3 (12px), text-sm (14px)
- md: h-10 (40px), px-4 (16px), text-sm (14px)
- lg: h-12 (48px), px-5 (20px), text-base (16px)

### Porównaj z Figma:
- Czy wszystkie warianty są w kodzie?
- Czy style się zgadzają?
- Czy są jakieś różnice?

---

## ✅ Krok 3: Zaktualizuj kod (jeśli potrzeba)

### Jeśli w Figma są nowe warianty:

1. **Dodaj nowy variant do typu:**
   ```typescript
   type Variant = "solid" | "outline" | "ghost" | "new-variant";
   ```

2. **Dodaj style:**
   ```typescript
   variant: {
     solid: "...",
     outline: "...",
     ghost: "...",
     "new-variant": "bg-new-color text-white ...", // ← nowy
   }
   ```

3. **Dodaj do interface (jeśli potrzeba):**
   ```typescript
   export interface ButtonProps {
     // ... istniejące props
     newProp?: string; // ← jeśli potrzeba
   }
   ```

### Jeśli style się różnią:

1. **Zaktualizuj wartości w `classesBy`:**
   ```typescript
   size: {
     sm: "h-8 px-3 text-sm", // ← zaktualizuj jeśli potrzeba
     md: "h-10 px-4 text-sm",
     lg: "h-12 px-5 text-base",
   }
   ```

2. **Użyj tokenów zamiast hardcoded wartości:**
   ```typescript
   // Zamiast:
   "bg-blue-500"
   
   // Użyj:
   "bg-[color:var(--color-brand-primary)]"
   ```

---

## 📚 Krok 4: Zaktualizuj dokumentację

### Plik: `apps/www/app/docs/components/button/page.tsx`

#### Jeśli dodano nowe warianty:

1. **Zaktualizuj opis:**
   ```tsx
   <p>Button component for user actions. Supports variants: solid, outline, ghost, new-variant and sizes: sm, md, lg.</p>
   ```

2. **Dodaj przykład:**
   ```tsx
   <div className="flex gap-2">
     <Button variant="solid">Solid</Button>
     <Button variant="outline">Outline</Button>
     <Button variant="ghost">Ghost</Button>
     <Button variant="new-variant">New Variant</Button> {/* ← nowy */}
   </div>
   ```

3. **Zaktualizuj code examples:**
   ```tsx
   <pre><code>{`
   // Variants
   <Button variant="solid">Solid</Button>
   <Button variant="outline">Outline</Button>
   <Button variant="ghost">Ghost</Button>
   <Button variant="new-variant">New Variant</Button> {/* ← nowy */}
   `}</code></pre>
   ```

#### Jeśli zmieniono style:

1. **Zaktualizuj opis rozmiarów:**
   ```tsx
   <p>Button component supports sizes: sm (32px), md (40px), lg (48px).</p>
   ```

---

## 📖 Krok 5: Zaktualizuj Storybook

### Plik: `packages/ui/src/button.stories.tsx`

#### Jeśli dodano nowe warianty:

1. **Dodaj nowy story:**
   ```typescript
   export const NewVariant: Story = {
     args: {
       variant: "new-variant",
       children: "New Variant",
     },
   };
   ```

2. **Zaktualizuj AllVariants:**
   ```typescript
   export const AllVariants: Story = {
     render: () => (
       <div className="flex gap-2 flex-wrap">
         <Button variant="solid">Solid</Button>
         <Button variant="outline">Outline</Button>
         <Button variant="ghost">Ghost</Button>
         <Button variant="new-variant">New Variant</Button> {/* ← nowy */}
       </div>
     ),
   };
   ```

#### Jeśli dodano nowe rozmiary:

1. **Zaktualizuj AllSizes:**
   ```typescript
   export const AllSizes: Story = {
     render: () => (
       <div className="flex items-center gap-2">
         <Button size="sm">Small</Button>
         <Button size="md">Medium</Button>
         <Button size="lg">Large</Button>
         <Button size="xl">Extra Large</Button> {/* ← jeśli dodano */}
       </div>
     ),
   };
   ```

#### Jeśli dodano nowe stany:

1. **Dodaj nowy story:**
   ```typescript
   export const Loading: Story = {
     args: {
       loading: true,
       loadingText: "Loading...",
       children: "Submit",
     },
   };
   ```

---

## 🧪 Krok 6: Zaktualizuj testy (jeśli potrzeba)

### Plik: `packages/ui/src/button.test.tsx` (jeśli istnieje)

1. **Dodaj testy dla nowych wariantów:**
   ```typescript
   it("renders new variant correctly", () => {
     render(<Button variant="new-variant">New</Button>);
     // ... assertions
   });
   ```

2. **Zaktualizuj istniejące testy:**
   - Sprawdź, czy wszystkie testy przechodzą
   - Dodaj testy dla nowych funkcjonalności

---

## ✅ Krok 7: Weryfikacja

### 1. Sprawdź kod:
```bash
pnpm build
```

### 2. Sprawdź Storybook:
```bash
pnpm storybook
```
- Otwórz: `http://localhost:6006`
- Sprawdź wszystkie stories
- Porównaj z Figma

### 3. Sprawdź DS Portal:
```bash
pnpm dev
```
- Otwórz: `http://localhost:3000/docs/components/button`
- Sprawdź dokumentację
- Porównaj z Figma

### 4. Porównaj wizualnie:
- Figma → Storybook → DS Portal
- Wszystkie powinny wyglądać identycznie!

---

## 📋 Checklist synchronizacji

### Figma:
- [ ] Wszystkie warianty są utworzone (27 kombinacji)
- [ ] Style używają tokenów (nie HEX)
- [ ] Wysokości: sm=32px, md=40px, lg=48px
- [ ] Padding: sm=12px, md=16px, lg=20px
- [ ] Border radius = token `--radius-md`
- [ ] Ikony jako Instance Properties

### Kod:
- [ ] Wszystkie warianty z Figma są w kodzie
- [ ] Style są zsynchronizowane
- [ ] Używane są tokeny (nie hardcoded wartości)
- [ ] Testy przechodzą

### Dokumentacja:
- [ ] Opis jest aktualny
- [ ] Przykłady pokazują wszystkie warianty
- [ ] Code examples są poprawne
- [ ] Linki do Storybook działają

### Storybook:
- [ ] Wszystkie stories są zaktualizowane
- [ ] Wszystkie warianty są pokazane
- [ ] Wszystkie rozmiary są pokazane
- [ ] Wszystkie stany są pokazane

---

## 🚨 Częste problemy

### Problem: Style w Figma różnią się od kodu
**Rozwiązanie:**
1. Sprawdź, czy w Figma używasz tokenów
2. Sprawdź, czy tokeny są zsynchronizowane z `packages/tokens`
3. Zaktualizuj kod, aby używał tych samych tokenów

### Problem: Nowe warianty w Figma nie są w kodzie
**Rozwiązanie:**
1. Dodaj nowe warianty do typu `Variant`
2. Dodaj style dla nowych wariantów
3. Zaktualizuj dokumentację i Storybook

### Problem: Storybook nie pokazuje nowych wariantów
**Rozwiązanie:**
1. Sprawdź, czy dodałeś nowe stories
2. Sprawdź, czy `AllVariants` jest zaktualizowane
3. Uruchom `pnpm storybook` ponownie

---

## 📚 Powiązane dokumenty

- [Button Sync Guide](./figma-button-sync-guide.md)
- [Button Component Code](../../packages/ui/src/button.tsx)
- [Button Documentation](../../apps/www/app/docs/components/button/page.tsx)
- [Button Stories](../../packages/ui/src/button.stories.tsx)

---

*Ostatnia aktualizacja: 2025-11-07*

