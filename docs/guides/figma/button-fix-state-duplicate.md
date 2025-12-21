# 🔧 Naprawa duplikatu w State property

## ✅ Dobra wiadomość
Ikony są już jako **Instance Properties** - to jest poprawne! ✓

## 🚨 Problem
`State` property ma duplikat: `Default, default`

To powoduje błąd: *"Some variants have the same property values"*

---

## ✅ Rozwiązanie - krok po kroku

### KROK 1: Napraw `State` property

1. Otwórz Component Set "Buttons" w Figma
2. Kliknij na **dowolny wariant** (np. główny komponent)
3. W Properties panel znajdź `State` w sekcji **"Variant Properties"**
4. Kliknij na `State` property
5. Zobaczysz wartości: `Default, default` (duplikat!)

### KROK 2: Usuń duplikat i dodaj brakujące wartości

**Opcja A: Edycja wartości (rekomendowana)**

1. Kliknij na wartość `Default` (z dużej litery)
2. Zmień ją na `default` (małe litery) lub usuń
3. Sprawdź, czy masz już `default` (małe litery) - jeśli tak, usuń `Default`
4. Dodaj brakujące wartości:
   - Kliknij **"+"** obok wartości State
   - Dodaj `loading`
   - Dodaj `disabled`

**Opcja B: Usuń i dodaj od nowa**

1. Kliknij na `State` property
2. Usuń wszystkie wartości (`Default, default`)
3. Dodaj nowe wartości:
   - Kliknij **"+"** → dodaj `default`
   - Kliknij **"+"** → dodaj `loading`
   - Kliknij **"+"** → dodaj `disabled`

### KROK 3: Zweryfikuj wartości State

**Powinieneś mieć dokładnie 3 wartości (małe litery):**
- ✅ `default`
- ✅ `loading`
- ✅ `disabled`

**NIE powinieneś mieć:**
- ❌ `Default` (z dużej litery)
- ❌ `default` (duplikat)
- ❌ `Default, default` (oba)

### KROK 4: Utwórz wszystkie 27 wariantów

Teraz, gdy `State` ma poprawne wartości, musisz utworzyć wszystkie kombinacje:

**3 × 3 × 3 = 27 wariantów**

**Lista wszystkich kombinacji:**

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

**Szybka metoda:**
1. Kliknij na Component Set "Buttons"
2. Kliknij **"+"** w sekcji Variants (dodaj brakujące)
3. Dla każdego nowego wariantu ustaw: `Variant`, `Size`, `State`

### KROK 5: Napraw konflikty

1. Kliknij link **"Select conflicting variants"** w błędzie
2. Figma pokaże Ci warianty z konfliktem
3. Dla każdego konfliktu:
   - Sprawdź, jakie wartości `Variant × Size × State` ma
   - Jeśli dwa warianty mają identyczne wartości → usuń jeden lub zmień `State`
   - Upewnij się, że każdy wariant ma unikalną kombinację

### KROK 6: Weryfikacja końcowa

**Sprawdź Properties panel:**

**Variant Properties (dokładnie 3):**
- ✅ `Variant`: solid, outline, ghost
- ✅ `Size`: sm, md, lg
- ✅ `State`: default, loading, disabled (małe litery, bez duplikatów!)

**Instance Properties:**
- ✅ `Text`: Button
- ✅ `Instance` (ikonka): circle-user-round

**Błąd powinien zniknąć!**

---

## 🎯 Checklist

- [ ] Usunąłem duplikat `Default` z `State` property
- [ ] `State` ma dokładnie 3 wartości: `default, loading, disabled` (małe litery)
- [ ] Utworzyłem wszystkie 27 wariantów (Variant × Size × State)
- [ ] Każdy wariant ma unikalną kombinację
- [ ] Kliknąłem "Select conflicting variants" i naprawiłem wszystkie konflikty
- [ ] Błąd zniknął

---

## 🚨 Jeśli nadal masz błąd

### Problem: "Some variants have the same property values"

**Sprawdź:**
1. Czy `State` nadal ma duplikat? → Usuń go
2. Czy masz wszystkie 27 wariantów? → Utwórz brakujące
3. Czy niektóre warianty mają identyczne wartości `Variant × Size × State`? → Zmień lub usuń duplikaty

**Rozwiązanie:**
1. Kliknij **"Select conflicting variants"**
2. Figma pokaże Ci dokładnie, które warianty mają konflikt
3. Dla każdego konfliktu zmień wartości lub usuń duplikat

---

## 📚 Powiązane dokumenty

- [Dokładne kroki naprawy](./figma-button-fix-exact-steps.md)
- [Kompletna lista wariantów](./figma-button-variants-complete-list.md)

---

*Ostatnia aktualizacja: 2025-11-07*

