# 🔧 Jak przekonwertować Variant Property na Instance Property

## 🚨 Problem

`Leading Icon` i `Trailing Icon` mają **ikonę diamentu** (💎) w Properties panel - to oznacza, że są **Variant Properties**, nie Instance Properties!

To powoduje błąd konfliktu, bo każda kombinacja ikon tworzy nowy wariant.

---

## ✅ Rozwiązanie - krok po kroku

### KROK 1: Usuń `Leading Icon` i `Trailing Icon` z Variant Properties

1. Otwórz Component Set "Buttons" w Figma
2. Kliknij na **dowolny wariant** buttona
3. W Properties panel znajdź sekcję **"Properties"** (Variant Properties)
4. Znajdź `Leading Icon` (z ikoną diamentu 💎)
5. Kliknij na **"..."** (trzy kropki) obok `Leading Icon`
6. Wybierz **"Delete property"** lub **"Remove property"**
7. **Powtórz** dla `Trailing Icon`

**Uwaga:** Figma może zapytać, czy chcesz usunąć ze wszystkich wariantów - wybierz **"Yes"** lub **"Delete from all"**.

### KROK 2: Utwórz Instance Swap Property od nowa (poprawnie)

**Metoda A: Przez kliknięcie na ikonę (rekomendowana)**

1. Wybierz wariant buttona (np. `solid, md, default`)
2. **Kliknij bezpośrednio na ikonę** w buttonie (nie na property!)
3. W menu, które się pojawi, znajdź **"Create instance swap property"**
4. Kliknij na tę opcję
5. Figma zapyta o nazwę - wpisz **"Leading Icon"** (lub "Trailing Icon" jeśli ikona jest z prawej)
6. **WAŻNE:** Upewnij się, że property pojawiło się w sekcji **"Instance Properties"** (nie w "Properties"!)

**Metoda B: Ręcznie przez Properties panel**

1. W Properties panel kliknij **"+"** obok sekcji **"Instance Properties"** (nie "Properties"!)
2. Wybierz typ property: **"Instance swap"**
3. Nazwij property: **"Leading Icon"**
4. Powtórz dla **"Trailing Icon"**

### KROK 3: Zweryfikuj typ property

**Sprawdź Properties panel:**

**Variant Properties (tylko 3, z ikoną diamentu 💎):**
- ✅ `Variant`: solid, outline, ghost
- ✅ `Size`: sm, md, lg
- ✅ `State`: default, loading, disabled

**Instance Properties (bez ikony diamentu, z ikoną swap 🔄 lub inną):**
- ✅ `Text`: Button
- ✅ `Leading Icon`: Instance swap (NIE ma ikony diamentu!)
- ✅ `Trailing Icon`: Instance swap (NIE ma ikony diamentu!)

**NIE powinieneś mieć:**
- ❌ `Leading Icon` z ikoną diamentu 💎 (to oznacza Variant Property)
- ❌ `Trailing Icon` z ikoną diamentu 💎 (to oznacza Variant Property)

### KROK 4: Usuń duplikaty wariantów

Po przekonwertowaniu ikon na Instance Properties:

1. Kliknij link **"Select conflicting variants"** w błędzie
2. Figma pokaże Ci warianty z konfliktem
3. Dla każdego konfliktu:
   - Sprawdź wartości `Variant × Size × State`
   - Jeśli dwa warianty mają identyczne wartości → usuń jeden z nich
   - Zostaw tylko warianty z unikalnymi kombinacjami

**Powinieneś mieć dokładnie 27 wariantów:**
- 3 Variant × 3 Size × 3 State = 27

---

## 🔍 Jak rozpoznać typ property

### Variant Property (złe dla ikon):
- Ma **ikonę diamentu** 💎
- Jest w sekcji **"Properties"**
- Każda kombinacja wartości = nowy wariant
- ❌ NIE używaj dla ikon!

### Instance Property (dobre dla ikon):
- Ma **ikonę swap** 🔄 lub inną (nie diament!)
- Jest w sekcji **"Instance Properties"**
- Możesz zmieniać wartości bez tworzenia nowych wariantów
- ✅ Używaj dla ikon!

---

## 🚨 Jeśli nadal masz problem

### Problem: Po utworzeniu "Create instance swap property" nadal widzę ikonę diamentu

**Możliwe przyczyny:**
1. Figma utworzyło property jako Variant Property zamiast Instance Property
2. Property zostało utworzone w złej sekcji

**Rozwiązanie:**
1. Usuń property całkowicie
2. Upewnij się, że klikasz **bezpośrednio na ikonę** w buttonie (nie na property w panelu)
3. Użyj "Create instance swap property" z menu ikony
4. Sprawdź, że property pojawiło się w **"Instance Properties"**, nie w "Properties"

### Problem: Nie widzę opcji "Create instance swap property"

**Rozwiązanie:**
1. Upewnij się, że klikasz **bezpośrednio na ikonę** (warstwę ikony w buttonie)
2. Jeśli ikona jest w grupie, rozwiń grupę i kliknij na samą ikonę
3. Alternatywnie: użyj metody B (ręcznie przez Properties panel)

### Problem: Nadal mam błąd konfliktu

**Sprawdź:**
1. Czy `Leading Icon` i `Trailing Icon` mają ikonę diamentu? → Usuń je i utwórz od nowa
2. Czy masz więcej niż 27 wariantów? → Usuń duplikaty
3. Czy niektóre warianty mają identyczne wartości `Variant × Size × State`? → Usuń duplikaty

**Rozwiązanie:**
1. Kliknij **"Select conflicting variants"**
2. Usuń wszystkie duplikaty
3. Zostaw tylko 27 unikalnych wariantów

---

## 📋 Checklist naprawy

- [ ] Usunąłem `Leading Icon` z Variant Properties (z ikoną diamentu)
- [ ] Usunąłem `Trailing Icon` z Variant Properties (z ikoną diamentu)
- [ ] Kliknąłem bezpośrednio na ikonę w buttonie
- [ ] Użyłem "Create instance swap property"
- [ ] Sprawdziłem, że property pojawiło się w "Instance Properties" (nie w "Properties")
- [ ] Sprawdziłem, że property NIE ma ikony diamentu 💎
- [ ] Mam dokładnie 27 wariantów (Variant × Size × State)
- [ ] Usunąłem wszystkie duplikaty wariantów
- [ ] Błąd konfliktu zniknął

---

## 🎯 Finalna struktura Properties

### Variant Properties (3, z ikoną diamentu 💎):
1. `Variant`: solid, outline, ghost
2. `Size`: sm, md, lg
3. `State`: default, loading, disabled

### Instance Properties (bez ikony diamentu):
4. `Text`: Button
5. `Leading Icon`: Instance swap (ikonka swap 🔄)
6. `Trailing Icon`: Instance swap (ikonka swap 🔄)

**Razem: 27 wariantów + możliwość zmiany ikon bez tworzenia nowych wariantów**

---

## 📚 Powiązane dokumenty

- [Instance Swap Property](./figma-button-instance-swap-property.md)
- [Naprawa Instance Property](./figma-button-fix-instance-property.md)

---

*Ostatnia aktualizacja: 2025-11-07*

