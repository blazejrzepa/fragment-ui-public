# ✅ Jak użyć "Create instance swap property" dla ikon

## 🎯 Tak, to jest dokładnie to, czego potrzebujesz!

**"Create instance swap property"** w Figma tworzy **Instance Property**, nie Variant Property. To jest właściwa metoda dla ikon!

---

## ✅ Jak to zrobić - krok po kroku

### KROK 1: Kliknij na ikonę w buttonie

1. Otwórz Component Set "Buttons" w Figma
2. Wybierz dowolny wariant buttona
3. Kliknij na **ikonę** w buttonie (np. `circle-user-round`)

### KROK 2: Utwórz Instance Swap Property

1. Po kliknięciu na ikonę, zobaczysz opcję **"Create instance swap property"**
2. Kliknij na tę opcję
3. Figma zapyta o nazwę property - wpisz:
   - **"Leading Icon"** (jeśli ikona jest z lewej strony)
   - **"Trailing Icon"** (jeśli ikona jest z prawej strony)
   - Lub po prostu **"Icon"** (jeśli chcesz jedną property)

### KROK 3: Powtórz dla drugiej ikony (jeśli masz)

Jeśli masz buttony z ikonami z obu stron:
1. Kliknij na ikonę z prawej strony
2. Kliknij **"Create instance swap property"**
3. Nazwij ją **"Trailing Icon"**

### KROK 4: Sprawdź Properties panel

Po utworzeniu Instance Swap Property:

1. Otwórz Properties panel
2. Sprawdź sekcję **"Instance Properties"** (poniżej "Properties")
3. Powinieneś zobaczyć:
   - ✅ `Leading Icon` (lub `Icon`) w **Instance Properties**
   - ✅ `Trailing Icon` w **Instance Properties** (jeśli utworzyłeś)

**NIE powinieneś mieć:**
- ❌ `Instance` w Variant Properties
- ❌ `Leading Icon` w Variant Properties

### KROK 5: Usuń `Instance` z Variant Properties (jeśli nadal tam jest)

Jeśli nadal widzisz `Instance` w sekcji "Properties" (Variant Properties):

1. Kliknij na `Instance` w Variant Properties
2. Kliknij **"..."** obok
3. Wybierz **"Delete property"**

**Teraz ikony są jako Instance Properties, nie Variant Properties!**

---

## 🎯 Jak to działa

### Przed (błędnie):
- `Instance` jako Variant Property
- Każda kombinacja ikon tworzy nowy wariant
- 3 Variant × 3 Size × 3 State × 5 Icon = 135 wariantów! ❌

### Po (poprawnie):
- `Leading Icon` i `Trailing Icon` jako Instance Properties
- Ikony można zmieniać bez tworzenia nowych wariantów
- 3 Variant × 3 Size × 3 State = 27 wariantów ✓
- Ikony ustawiasz jako Instance Property na dowolnym wariancie

---

## ✅ Weryfikacja

**Sprawdź Properties panel:**

**Variant Properties (tylko 3):**
- ✅ `Variant`: solid, outline, ghost
- ✅ `Size`: sm, md, lg
- ✅ `State`: default, loading, disabled

**Instance Properties:**
- ✅ `Text`: Button
- ✅ `Leading Icon`: Instance swap property ✓
- ✅ `Trailing Icon`: Instance swap property ✓

**Błąd konfliktu powinien zniknąć!**

---

## 🎨 Jak używać Instance Swap Property

Po utworzeniu Instance Swap Property:

1. Wybierz wariant buttona (np. `solid, md, default`)
2. W sekcji **"Instance Properties"** znajdź `Leading Icon`
3. Kliknij na dropdown obok `Leading Icon`
4. Wybierz inną ikonę z biblioteki
5. Ikona zmieni się, ale **nie utworzy nowego wariantu**!

**To jest dokładnie to, czego potrzebujesz!**

---

## 📋 Checklist

- [ ] Kliknąłem na ikonę w buttonie
- [ ] Użyłem "Create instance swap property"
- [ ] Nazwałem property "Leading Icon" (lub "Trailing Icon")
- [ ] Sprawdziłem, że property jest w "Instance Properties" (nie w "Properties")
- [ ] Usunąłem `Instance` z Variant Properties (jeśli nadal tam było)
- [ ] Mam dokładnie 27 wariantów (Variant × Size × State)
- [ ] Mogę zmieniać ikony bez tworzenia nowych wariantów
- [ ] Błąd konfliktu zniknął

---

## 🚨 Jeśli nadal masz błąd

### Problem: "Some variants have the same property values"

**Sprawdź:**
1. Czy `Instance` nadal jest w Variant Properties? → Usuń go
2. Czy masz więcej niż 27 wariantów? → Usuń duplikaty
3. Czy niektóre warianty mają identyczne wartości `Variant × Size × State`? → Usuń duplikaty

**Rozwiązanie:**
1. Kliknij **"Select conflicting variants"**
2. Figma pokaże Ci dokładnie, które warianty mają konflikt
3. Dla każdego konfliktu usuń duplikaty

---

## 💡 Wskazówki

### Różnica między Variant Property a Instance Property:

**Variant Property:**
- Tworzy nowe warianty
- Każda kombinacja wartości = nowy wariant
- Używaj dla: Variant, Size, State

**Instance Property (Instance Swap Property):**
- Nie tworzy nowych wariantów
- Możesz zmieniać wartości bez tworzenia kombinacji
- Używaj dla: Ikony, Tekst, Kolory (opcjonalne)

### Dla ikon zawsze używaj Instance Swap Property!

---

## 📚 Powiązane dokumenty

- [Naprawa Instance Property](./figma-button-fix-instance-property.md)
- [Kompletna lista wariantów](./figma-button-variants-complete-list.md)

---

*Ostatnia aktualizacja: 2025-11-07*

