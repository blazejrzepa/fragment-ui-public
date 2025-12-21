# 🔧 Jak przenieść Instance Swap Property z Variant do Instance Properties

## ✅ Rozumiem problem!

To **JEST** Instance Swap Property (widzę w modal "Edit instance swap property"), ale jest dodane jako **Variant Property** (z ikoną diamentu 💎).

W Figma Instance Swap Property może być w dwóch miejscach:
1. **Variant Property** (w sekcji "Properties") - tworzy nowe warianty ❌
2. **Instance Property** (w sekcji "Instance Properties") - nie tworzy nowych wariantów ✅

Musimy przenieść je z Variant Properties do Instance Properties!

---

## ✅ Rozwiązanie - krok po kroku

### KROK 1: Usuń Instance Swap Property z Variant Properties

1. W modal "Edit instance swap property" kliknij **"Cancel"** (zamknij modal)
2. W Properties panel znajdź `Leading Icon` (z ikoną diamentu 💎) w sekcji **"Properties"**
3. Kliknij na **"..."** (trzy kropki) obok `Leading Icon`
4. Wybierz **"Delete property"** lub **"Remove property"**
5. **Powtórz** dla `Trailing Icon`

**Uwaga:** Figma może zapytać, czy chcesz usunąć ze wszystkich wariantów - wybierz **"Yes"**.

### KROK 2: Utwórz Instance Swap Property w sekcji Instance Properties

**Metoda A: Przez kliknięcie na ikonę (rekomendowana)**

1. Wybierz wariant buttona (np. `solid, md, default`)
2. **Kliknij bezpośrednio na ikonę** w buttonie (nie na property w panelu!)
3. W menu, które się pojawi, znajdź **"Create instance swap property"**
4. Kliknij na tę opcję
5. Figma zapyta o nazwę - wpisz **"Leading Icon"**
6. **WAŻNE:** Sprawdź, że property pojawiło się w sekcji **"Instance Properties"** (nie w "Properties"!)

**Metoda B: Ręcznie przez Properties panel**

1. W Properties panel znajdź sekcję **"Instance Properties"** (poniżej "Properties")
2. Kliknij **"+"** obok "Instance Properties"
3. W menu wybierz typ: **"Instance swap"**
4. Nazwij property: **"Leading Icon"**
5. **WAŻNE:** Upewnij się, że property pojawiło się w sekcji **"Instance Properties"**, nie w "Properties"!
6. Powtórz dla **"Trailing Icon"**

### KROK 3: Zweryfikuj lokalizację property

**Sprawdź Properties panel:**

**Variant Properties (tylko 3, w sekcji "Properties"):**
- ✅ `Variant`: solid, outline, ghost
- ✅ `Size`: sm, md, lg
- ✅ `State`: default, loading, disabled

**Instance Properties (w sekcji "Instance Properties"):**
- ✅ `Text`: Button
- ✅ `Leading Icon`: Instance swap (w sekcji "Instance Properties"!)
- ✅ `Trailing Icon`: Instance swap (w sekcji "Instance Properties"!)

**NIE powinieneś mieć:**
- ❌ `Leading Icon` w sekcji "Properties" (Variant Properties)
- ❌ `Trailing Icon` w sekcji "Properties" (Variant Properties)

### KROK 4: Usuń duplikaty wariantów

Po przeniesieniu ikon do Instance Properties:

1. Kliknij link **"Select conflicting variants"** w błędzie
2. Figma pokaże Ci warianty z konfliktem
3. Dla każdego konfliktu:
   - Sprawdź wartości `Variant × Size × State`
   - Jeśli dwa warianty mają identyczne wartości → usuń jeden z nich
   - Zostaw tylko warianty z unikalnymi kombinacjami

**Powinieneś mieć dokładnie 27 wariantów:**
- 3 Variant × 3 Size × 3 State = 27

---

## 🔍 Jak rozpoznać, gdzie jest property

### Instance Swap Property jako Variant Property (złe):
- Jest w sekcji **"Properties"** (Variant Properties)
- Ma **ikonę diamentu** 💎
- Każda kombinacja wartości = nowy wariant
- ❌ NIE używaj dla ikon!

### Instance Swap Property jako Instance Property (dobre):
- Jest w sekcji **"Instance Properties"**
- Ma **ikonę swap** 🔄 lub inną (nie diament!)
- Możesz zmieniać wartości bez tworzenia nowych wariantów
- ✅ Używaj dla ikon!

---

## 🚨 Jeśli nadal masz problem

### Problem: Po utworzeniu "Create instance swap property" nadal jest w sekcji "Properties"

**Przyczyna:**
Figma automatycznie dodało property jako Variant Property zamiast Instance Property.

**Rozwiązanie:**
1. Usuń property całkowicie
2. Upewnij się, że używasz metody B (ręcznie przez Properties panel)
3. Kliknij **"+"** obok sekcji **"Instance Properties"** (nie "Properties"!)
4. Wybierz typ: **"Instance swap"**
5. Sprawdź, że property pojawiło się w **"Instance Properties"**

### Problem: Nie widzę sekcji "Instance Properties"

**Rozwiązanie:**
1. W Properties panel kliknij **"+"** obok sekcji "Properties"
2. W menu wybierz **"Add instance property"**
3. To utworzy sekcję "Instance Properties"
4. Teraz dodaj Instance Swap Property w tej sekcji

### Problem: Nadal mam błąd konfliktu

**Sprawdź:**
1. Czy `Leading Icon` i `Trailing Icon` są w sekcji "Instance Properties"? → Jeśli nie, przenieś je
2. Czy masz więcej niż 27 wariantów? → Usuń duplikaty
3. Czy niektóre warianty mają identyczne wartości `Variant × Size × State`? → Usuń duplikaty

**Rozwiązanie:**
1. Kliknij **"Select conflicting variants"**
2. Usuń wszystkie duplikaty
3. Zostaw tylko 27 unikalnych wariantów

---

## 📋 Checklist naprawy

- [ ] Zamknąłem modal "Edit instance swap property"
- [ ] Usunąłem `Leading Icon` z sekcji "Properties" (Variant Properties)
- [ ] Usunąłem `Trailing Icon` z sekcji "Properties" (Variant Properties)
- [ ] Kliknąłem **"+"** obok sekcji **"Instance Properties"** (nie "Properties"!)
- [ ] Dodałem "Instance swap" property w sekcji "Instance Properties"
- [ ] Sprawdziłem, że property jest w sekcji "Instance Properties" (nie w "Properties")
- [ ] Sprawdziłem, że property NIE ma ikony diamentu 💎
- [ ] Mam dokładnie 27 wariantów (Variant × Size × State)
- [ ] Usunąłem wszystkie duplikaty wariantów
- [ ] Błąd konfliktu zniknął

---

## 🎯 Finalna struktura Properties

### Sekcja "Properties" (Variant Properties - 3):
1. `Variant`: solid, outline, ghost
2. `Size`: sm, md, lg
3. `State`: default, loading, disabled

### Sekcja "Instance Properties":
4. `Text`: Button
5. `Leading Icon`: Instance swap (w sekcji "Instance Properties"!)
6. `Trailing Icon`: Instance swap (w sekcji "Instance Properties"!)

**Razem: 27 wariantów + możliwość zmiany ikon bez tworzenia nowych wariantów**

---

## 📚 Powiązane dokumenty

- [Konwertowanie Variant na Instance](./figma-button-convert-variant-to-instance.md)
- [Instance Swap Property](./figma-button-instance-swap-property.md)

---

*Ostatnia aktualizacja: 2025-11-07*

