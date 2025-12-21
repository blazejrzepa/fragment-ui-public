# 🔧 Dokładne kroki naprawy błędu konfliktu w Button

## 🚨 Problem, który widzę w Twoim Properties panel:

1. ❌ `Leading Icon` jest **Variant Property** (powinno być Instance Property)
2. ❌ `Trailing Icon` jest **Variant Property** (powinno być Instance Property)
3. ❌ `State` ma duplikat: `Default, default` (powinno być: `default, loading, disabled`)
4. ❌ Błąd: "Some variants have the same property values"

---

## ✅ Rozwiązanie - krok po kroku

### KROK 1: Usuń `Leading Icon` i `Trailing Icon` z Variant Properties

1. Otwórz Component Set "Buttons" w Figma
2. Kliknij na **dowolny wariant** (np. główny komponent)
3. W Properties panel znajdź sekcję **"Variant Properties"**
4. Znajdź `Leading Icon` w Variant Properties
5. Kliknij na **"..."** (trzy kropki) obok `Leading Icon`
6. Wybierz **"Delete property"**
7. **Powtórz** dla `Trailing Icon` (jeśli też jest w Variant Properties)

**Uwaga:** Jeśli masz wiele wariantów, możesz musieć usunąć property z każdego wariantu osobno, lub Figma zapyta, czy chcesz usunąć ze wszystkich.

---

### KROK 2: Napraw `State` property

1. W Properties panel znajdź `State` w Variant Properties
2. Kliknij na `State` property
3. Sprawdź wartości - powinny być:
   - `default` (małe litery!)
   - `loading`
   - `disabled`
4. Jeśli widzisz `Default, default` (duplikat):
   - Kliknij na wartość `Default` (z dużej litery)
   - Usuń ją lub zmień na `default` (małe litery)
5. Jeśli brakuje `loading` lub `disabled`:
   - Kliknij **"+"** obok wartości State
   - Dodaj `loading`
   - Dodaj `disabled`
6. **Upewnij się, że masz dokładnie 3 wartości:**
   - `default` (małe litery)
   - `loading`
   - `disabled`

---

### KROK 3: Dodaj `Leading Icon` i `Trailing Icon` jako Instance Properties

1. W Properties panel znajdź sekcję **"Instance Properties"** (poniżej Variant Properties)
2. Kliknij **"+"** obok "Instance Properties"
3. Dodaj nowe property:
   - **Nazwa:** `Leading Icon`
   - **Typ:** Instance (lub Boolean jeśli chcesz tylko show/hide)
4. Kliknij **"+"** ponownie
5. Dodaj drugie property:
   - **Nazwa:** `Trailing Icon`
   - **Typ:** Instance (lub Boolean)

**Teraz `Leading Icon` i `Trailing Icon` powinny być w sekcji "Instance Properties", NIE w "Variant Properties"!**

---

### KROK 4: Sprawdź, czy masz dokładnie 27 wariantów

1. Kliknij na Component Set "Buttons"
2. W panelu po lewej stronie sprawdź liczbę wariantów
3. **Powinno być dokładnie 27 wariantów**

**Jeśli masz mniej niż 27:**
- Kliknij **"+"** w sekcji Variants
- Powtarzaj, aż będziesz mieć 27

**Jeśli masz więcej niż 27:**
- Sprawdź, czy niektóre warianty mają identyczne wartości Variant Properties
- Usuń duplikaty

---

### KROK 5: Zweryfikuj wszystkie 27 kombinacji

Dla każdego wariantu sprawdź, czy ma unikalną kombinację:

**Variant Properties (tylko te 3 powinny być):**
- `Variant`: solid, outline, ghost
- `Size`: sm, md, lg
- `State`: default, loading, disabled

**Lista wszystkich 27 kombinacji:**

1. solid, sm, default
2. solid, sm, loading
3. solid, sm, disabled
4. solid, md, default
5. solid, md, loading
6. solid, md, disabled
7. solid, lg, default
8. solid, lg, loading
9. solid, lg, disabled
10. outline, sm, default
11. outline, sm, loading
12. outline, sm, disabled
13. outline, md, default
14. outline, md, loading
15. outline, md, disabled
16. outline, lg, default
17. outline, lg, loading
18. outline, lg, disabled
19. ghost, sm, default
20. ghost, sm, loading
21. ghost, sm, disabled
22. ghost, md, default
23. ghost, md, loading
24. ghost, md, disabled
25. ghost, lg, default
26. ghost, lg, loading
27. ghost, lg, disabled

**Dla każdego wariantu:**
1. Kliknij na wariant
2. Sprawdź Properties panel
3. Upewnij się, że ma unikalną kombinację `Variant × Size × State`
4. Jeśli dwa warianty mają tę samą kombinację → usuń jeden z nich

---

### KROK 6: Kliknij "Select conflicting variants"

1. W Properties panel znajdź błąd: "Some variants have the same property values"
2. Kliknij link **"Select conflicting variants"**
3. Figma pokaże Ci, które warianty mają konflikt
4. Dla każdego konfliktu:
   - Sprawdź, jakie wartości Variant Properties mają
   - Zmień jedną z wartości (np. `State` z `default` na `loading`)
   - Lub usuń duplikat, jeśli nie jest potrzebny

---

### KROK 7: Weryfikacja końcowa

**Sprawdź strukturę Properties:**

**Variant Properties (dokładnie 3):**
- ✅ `Variant`: solid, outline, ghost
- ✅ `Size`: sm, md, lg
- ✅ `State`: default, loading, disabled (małe litery!)

**Instance Properties (3+):**
- ✅ `Text`: Button
- ✅ `Leading Icon`: Instance Property (NIE Variant Property!)
- ✅ `Trailing Icon`: Instance Property (NIE Variant Property!)

**NIE powinieneś mieć:**
- ❌ `Leading Icon` w Variant Properties
- ❌ `Trailing Icon` w Variant Properties
- ❌ `State` z wartościami `Default, default` (duplikat)

---

## 🎯 Szybka checklista

- [ ] Usunąłem `Leading Icon` z Variant Properties
- [ ] Usunąłem `Trailing Icon` z Variant Properties
- [ ] Naprawiłem `State` (usunąłem duplikat `Default`, zostawiłem tylko `default, loading, disabled`)
- [ ] Dodałem `Leading Icon` jako Instance Property
- [ ] Dodałem `Trailing Icon` jako Instance Property
- [ ] Mam dokładnie 27 wariantów
- [ ] Każdy wariant ma unikalną kombinację `Variant × Size × State`
- [ ] Kliknąłem "Select conflicting variants" i naprawiłem wszystkie konflikty
- [ ] Błąd zniknął

---

## 🚨 Jeśli nadal masz błąd

### Problem: "Some variants have the same property values"

**Rozwiązanie:**
1. Kliknij **"Select conflicting variants"**
2. Figma pokaże Ci warianty z konfliktem
3. Dla każdego konfliktu sprawdź:
   - Czy mają identyczne wartości `Variant × Size × State`?
   - Jeśli TAK → zmień jedną z wartości lub usuń duplikat
   - Jeśli NIE → sprawdź, czy `Leading Icon` lub `Trailing Icon` nadal są Variant Properties

### Problem: Nie mogę usunąć `Leading Icon` z Variant Properties

**Rozwiązanie:**
1. Upewnij się, że klikasz na właściwe property
2. Spróbuj kliknąć prawym przyciskiem myszy na property
3. Wybierz "Delete property" lub "Remove property"
4. Jeśli to nie działa, możesz spróbować:
   - Usunąć wszystkie warianty i utworzyć od nowa
   - Lub zmienić typ property z "Variant" na "Instance"

---

## 📚 Powiązane dokumenty

- [Kompletna lista wariantów](./figma-button-variants-complete-list.md)
- [Ogólny przewodnik naprawy](./figma-button-fix-conflict-error.md)

---

*Ostatnia aktualizacja: 2025-11-07*

