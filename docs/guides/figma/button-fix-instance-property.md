# 🔧 Naprawa: Instance jako Variant Property

## ✅ Co jest już dobrze:
- `State` ma poprawne wartości: `default, loading, disabled` ✓
- `Variant`, `Size` są poprawne ✓

## 🚨 Problem:
`Instance` (ikonka `circle-user-round`) jest w sekcji **"Properties"** jako **Variant Property**.

To powoduje błąd: *"Some variants have the same property values applied"*

**Dlaczego to problem?**
- Jeśli `Instance` jest Variant Property, każda kombinacja ikon tworzy nowy wariant
- To powoduje konflikty, bo masz wiele wariantów z identycznymi wartościami `Variant × Size × State`, ale różnymi ikonami
- W kodzie ikony są opcjonalne props, nie warianty!

---

## ✅ Rozwiązanie - krok po kroku

### KROK 1: Usuń `Instance` z Variant Properties

1. Otwórz Component Set "Buttons" w Figma
2. Kliknij na **dowolny wariant**
3. W Properties panel znajdź sekcję **"Properties"** (Variant Properties)
4. Znajdź `Instance` w tej sekcji
5. Kliknij na **"..."** (trzy kropki) obok `Instance`
6. Wybierz **"Delete property"** lub **"Remove property"**

**Uwaga:** Figma może zapytać, czy chcesz usunąć ze wszystkich wariantów - wybierz **"Yes"** lub **"Delete from all"**.

### KROK 2: Dodaj ikony jako Instance Properties

1. W Properties panel znajdź sekcję **"Instance Properties"** (poniżej "Properties")
2. Jeśli nie widzisz tej sekcji, kliknij **"+"** obok "Properties" i wybierz "Add instance property"
3. Dodaj nowe property:
   - **Nazwa:** `Leading Icon` (lub `Icon` jeśli wolisz)
   - **Typ:** Instance
4. Kliknij **"+"** ponownie
5. Dodaj drugie property:
   - **Nazwa:** `Trailing Icon`
   - **Typ:** Instance

**Alternatywa:** Jeśli chcesz mieć jedną property dla ikon:
- **Nazwa:** `Icon`
- **Typ:** Instance
- Możesz użyć tej samej property dla leading i trailing (ustawiasz w wariancie)

### KROK 3: Ustaw ikony na wariantach (opcjonalnie)

Po przeniesieniu ikon do Instance Properties:

1. Wybierz wariant (np. `solid, md, default`)
2. W sekcji **"Instance Properties"** znajdź `Leading Icon` (lub `Icon`)
3. Ustaw ikonę - to nie tworzy nowego wariantu, tylko modyfikuje wygląd

### KROK 4: Usuń duplikaty wariantów

Teraz, gdy `Instance` nie jest Variant Property:

1. Kliknij link **"Select conflicting variants"** w błędzie
2. Figma pokaże Ci warianty z konfliktem
3. Dla każdego konfliktu:
   - Sprawdź wartości `Variant × Size × State`
   - Jeśli dwa warianty mają identyczne wartości → usuń jeden z nich
   - Zostaw tylko warianty z unikalnymi kombinacjami `Variant × Size × State`

**Powinieneś mieć dokładnie 27 wariantów:**
- 3 Variant × 3 Size × 3 State = 27

### KROK 5: Weryfikacja końcowa

**Sprawdź Properties panel:**

**Variant Properties (dokładnie 3):**
- ✅ `Variant`: solid, outline, ghost
- ✅ `Size`: sm, md, lg
- ✅ `State`: default, loading, disabled

**Instance Properties:**
- ✅ `Text`: Button
- ✅ `Leading Icon`: Instance (lub `Icon`)
- ✅ `Trailing Icon`: Instance (opcjonalnie)

**NIE powinieneś mieć:**
- ❌ `Instance` w Variant Properties
- ❌ Więcej niż 27 wariantów (chyba że masz dodatkowe kombinacje, które są potrzebne)

---

## 🎯 Checklist naprawy

- [ ] Usunąłem `Instance` z Variant Properties
- [ ] Dodałem `Leading Icon` jako Instance Property
- [ ] Dodałem `Trailing Icon` jako Instance Property (opcjonalnie)
- [ ] Mam dokładnie 27 wariantów (Variant × Size × State)
- [ ] Każdy wariant ma unikalną kombinację `Variant × Size × State`
- [ ] Kliknąłem "Select conflicting variants" i usunąłem duplikaty
- [ ] Błąd zniknął

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
3. Dla każdego konfliktu:
   - Sprawdź wartości `Variant × Size × State`
   - Jeśli są identyczne → usuń jeden z wariantów
   - Zostaw tylko warianty z unikalnymi kombinacjami

### Problem: Nie mogę usunąć `Instance` z Variant Properties

**Rozwiązanie:**
1. Upewnij się, że klikasz na właściwe property
2. Spróbuj kliknąć prawym przyciskiem myszy na `Instance`
3. Wybierz "Delete property" lub "Remove property"
4. Jeśli to nie działa:
   - Możesz spróbować zmienić typ property z "Variant" na "Instance"
   - Lub utworzyć Component Set od nowa (kopiując style)

---

## 📋 Finalna struktura Properties

### Variant Properties (tylko 3):
1. `Variant`: solid, outline, ghost
2. `Size`: sm, md, lg
3. `State`: default, loading, disabled

**Razem: 27 wariantów**

### Instance Properties:
4. `Text`: Button (dowolny tekst)
5. `Leading Icon`: Instance (ikonka, opcjonalne)
6. `Trailing Icon`: Instance (ikonka, opcjonalne)

**Te properties można ustawić na dowolnym wariancie bez tworzenia nowych kombinacji.**

---

## 📚 Powiązane dokumenty

- [Naprawa duplikatu State](./figma-button-fix-state-duplicate.md)
- [Kompletna lista wariantów](./figma-button-variants-complete-list.md)

---

*Ostatnia aktualizacja: 2025-11-07*

