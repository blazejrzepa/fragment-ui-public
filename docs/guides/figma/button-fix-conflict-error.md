# 🔧 Jak naprawić błąd konfliktu w Button (Figma)

## Problem
Figma pokazuje błąd: *"The properties and values of this variant are conflicting"* dla kombinacji `solid, sm, default`.

## Przyczyna
Błąd występuje, gdy:
1. **Nie masz wszystkich kombinacji wariantów** (potrzebujesz 27: Variant × Size × State)
2. **Ikony są dodane jako Variant Property** zamiast Instance Property

---

## ✅ Rozwiązanie krok po kroku

### Krok 1: Sprawdź, czy ikony są Variant Property

1. Otwórz Component Set "Buttons" w Figma
2. Kliknij na główny komponent
3. W Properties panel sprawdź:
   - Jeśli widzisz `Icon` lub `Leading Icon` w sekcji **"Variant Properties"** → **TO JEST PROBLEM!**
   - Jeśli widzisz `Leading Icon` w sekcji **"Instance Properties"** → to jest OK ✓

### Krok 2: Jeśli ikony są Variant Property - usuń je

1. Kliknij na property `Icon` (lub `Leading Icon` w Variant Properties)
2. Kliknij **"..."** (trzy kropki) obok property
3. Wybierz **"Delete property"**
4. Powtórz dla `Trailing Icon` jeśli też jest Variant Property

### Krok 3: Dodaj ikony jako Instance Properties

1. Kliknij na główny komponent
2. W Properties panel kliknij **"+"** obok "Instance Properties"
3. Dodaj nowe property:
   - **Nazwa:** `Leading Icon`
   - **Typ:** Instance (lub Boolean jeśli chcesz tylko show/hide)
4. Powtórz dla `Trailing Icon`

### Krok 4: Utwórz wszystkie 27 wariantów

Musisz mieć wszystkie kombinacje:

**Variant Properties (tylko te 3):**
- `Variant`: solid, outline, ghost
- `Size`: sm, md, lg
- `State`: default, loading, disabled

**3 × 3 × 3 = 27 wariantów**

#### Szybka metoda:

1. Kliknij na Component Set "Buttons"
2. Kliknij **"+"** w sekcji Variants (26 razy - masz już 1)
3. Dla każdego nowego wariantu:
   - Zmień wartości w Properties panel:
     - `Variant`: solid/outline/ghost
     - `Size`: sm/md/lg
     - `State`: default/loading/disabled
   - Zaktualizuj style wizualne

#### Lista wszystkich 27 kombinacji:

**Solid (9 wariantów):**
- solid, sm, default
- solid, sm, loading
- solid, sm, disabled
- solid, md, default
- solid, md, loading
- solid, md, disabled
- solid, lg, default
- solid, lg, loading
- solid, lg, disabled

**Outline (9 wariantów):**
- outline, sm, default
- outline, sm, loading
- outline, sm, disabled
- outline, md, default
- outline, md, loading
- outline, md, disabled
- outline, lg, default
- outline, lg, loading
- outline, lg, disabled

**Ghost (9 wariantów):**
- ghost, sm, default
- ghost, sm, loading
- ghost, sm, disabled
- ghost, md, default
- ghost, md, loading
- ghost, md, disabled
- ghost, lg, default
- ghost, lg, loading
- ghost, lg, disabled

### Krok 5: Dodaj ikony do wariantów (opcjonalnie)

Po utworzeniu wszystkich 27 wariantów:

1. Wybierz wariant (np. `solid, md, default`)
2. W Properties panel znajdź `Leading Icon` (Instance Property)
3. Ustaw ikonę - to nie tworzy nowego wariantu, tylko modyfikuje wygląd

---

## 🔍 Weryfikacja

### Sprawdź, czy błąd zniknął:

1. Wybierz wariant: `solid, sm, default`
2. Jeśli nie ma błędu konfliktu → **SUKCES!** ✓
3. Sprawdź wszystkie kombinacje (27 razy)

### Sprawdź strukturę Properties:

**Powinieneś mieć:**

**Variant Properties (3):**
- ✅ Variant
- ✅ Size
- ✅ State

**Instance Properties (3+):**
- ✅ Text
- ✅ Leading Icon (Instance Property, NIE Variant Property!)
- ✅ Trailing Icon (Instance Property, NIE Variant Property!)

**NIE powinieneś mieć:**
- ❌ Icon jako Variant Property
- ❌ Leading Icon jako Variant Property
- ❌ Trailing Icon jako Variant Property

---

## 🚨 Częste błędy

### Błąd 1: Ikony jako Variant Property
**Objaw:** Błąd konfliktu nawet po utworzeniu 27 wariantów  
**Rozwiązanie:** Usuń ikony z Variant Properties, dodaj jako Instance Properties

### Błąd 2: Brakuje niektórych kombinacji
**Objaw:** Błąd konfliktu dla konkretnych kombinacji (np. `solid, sm, default`)  
**Rozwiązanie:** Utwórz wszystkie 27 wariantów

### Błąd 3: Złe wartości w Variant Properties
**Objaw:** Błąd konfliktu  
**Rozwiązanie:** Sprawdź, czy masz dokładnie:
- Variant: `solid, outline, ghost` (nie `Solid, Outline, Ghost` - małe litery!)
- Size: `sm, md, lg` (nie `small, medium, large`)
- State: `default, loading, disabled` (nie `Default, Loading, Disabled`)

---

## 📋 Checklist naprawy

- [ ] Usunąłem ikony z Variant Properties (jeśli były)
- [ ] Dodałem `Leading Icon` jako Instance Property
- [ ] Dodałem `Trailing Icon` jako Instance Property
- [ ] Utworzyłem wszystkie 27 wariantów (Variant × Size × State)
- [ ] Sprawdziłem, że wartości są małymi literami (solid, sm, default)
- [ ] Błąd konfliktu zniknął dla wszystkich kombinacji
- [ ] Mogę ustawić ikony na dowolnym wariancie jako Instance Property

---

## 🎯 Szybka diagnoza

**Pytanie 1:** Ile masz wariantów w Component Set?  
- Jeśli mniej niż 27 → utwórz brakujące
- Jeśli 27 lub więcej → sprawdź, czy ikony są Variant Properties

**Pytanie 2:** Czy `Leading Icon` jest w sekcji "Variant Properties"?  
- Jeśli TAK → usuń i dodaj jako Instance Property
- Jeśli NIE → sprawdź, czy masz wszystkie 27 kombinacji

**Pytanie 3:** Czy wartości są małymi literami?  
- `solid` (nie `Solid`)
- `sm` (nie `small` lub `Small`)
- `default` (nie `Default`)

---

## 📚 Powiązane dokumenty

- [Kompletna lista wariantów](./figma-button-variants-complete-list.md)
- [Rekomendacje properties](./figma-button-properties-recommendations.md)
- [Przewodnik synchronizacji](./figma-button-sync-guide.md)

---

*Ostatnia aktualizacja: 2025-11-07*

