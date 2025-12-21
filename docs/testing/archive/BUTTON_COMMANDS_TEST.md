# Testowanie komend AI Copilot dla przycisku

## 🚀 Szybki start

1. Otwórz http://localhost:3002/playground
2. Wygeneruj przycisk: `Create a button with text 'Test Button'`
3. Zaznacz przycisk w Preview (kliknij na niego)
4. Przejdź do zakładki **Copilot**
5. Wpisz komendę i sprawdź wynik

## ✅ Lista komend do przetestowania

### 1. Zmiana tekstu (setCopy)
- [ ] `Zmień tekst przycisku na 'Zapisz'`
- [ ] `Change button text to 'Save'`
- [ ] `Ustaw tekst na 'Anuluj'`

**Oczekiwany wynik:** Tekst przycisku zmienia się na podaną wartość.

### 2. Zmiana wariantu (setProp - variant)
- [ ] `Zmień wariant na solid`
- [ ] `Change variant to outline`
- [ ] `Ustaw wariant na ghost`

**Oczekiwany wynik:** 
- `solid` - przycisk ma wypełnione tło
- `outline` - przycisk ma tylko obramowanie
- `ghost` - przycisk ma przezroczyste tło

### 3. Zmiana rozmiaru (setProp - size)
- [ ] `Zmień rozmiar na small`
- [ ] `Change size to md`
- [ ] `Ustaw rozmiar na large`

**Oczekiwany wynik:**
- `sm` - przycisk jest mniejszy
- `md` - przycisk średni (domyślny)
- `lg` - przycisk jest większy

### 4. Włączenie/wyłączenie (setProp - disabled)
- [ ] `Wyłącz przycisk`
- [ ] `Disable button`
- [ ] `Włącz przycisk`
- [ ] `Enable button`

**Oczekiwany wynik:**
- Wyłączony - przycisk jest nieaktywny (szary, nie klikalny)
- Włączony - przycisk jest aktywny

### 5. Łączenie komend
- [ ] `Zmień tekst na 'Zapisz' i wariant na solid`
- [ ] `Change text to 'Save' and size to large`

**Oczekiwany wynik:** Wszystkie zmiany są zastosowane jednocześnie.

## 🔍 Jak sprawdzić wynik

### W Preview:
- Tekst przycisku zmienia się natychmiast
- Wariant widoczny jako zmiana stylu (tło, obramowanie)
- Rozmiar widoczny jako zmiana wysokości/szerokości
- Disabled widoczny jako szary, nieaktywny przycisk

### W Inspector:
1. Zaznacz przycisk
2. Przejdź do zakładki **Inspector**
3. Sprawdź wartości w sekcji **Props**:
   - Variant dropdown
   - Size dropdown
   - Disabled checkbox
   - Label/Text input

### W Code:
1. Przejdź do zakładki **Code**
2. Sprawdź, czy kod został zaktualizowany:
   - `variant="solid"` / `variant="outline"` / `variant="ghost"`
   - `size="sm"` / `size="md"` / `size="lg"`
   - `disabled` attribute
   - Tekst w komponencie

## 📝 Raport testów

Po przetestowaniu każdej komendy, zaznacz checkbox i dodaj notatki:

### Wyniki testów:

#### Zmiana tekstu
- [ ] Działa ✅ / ❌
- Notatki: _________________

#### Zmiana wariantu
- [ ] Działa ✅ / ❌
- Notatki: _________________

#### Zmiana rozmiaru
- [ ] Działa ✅ / ❌
- Notatki: _________________

#### Włączenie/wyłączenie
- [ ] Działa ✅ / ❌
- Notatki: _________________

#### Łączenie komend
- [ ] Działa ✅ / ❌
- Notatki: _________________

## 🐛 Znalezione problemy

Jeśli coś nie działa, opisz:
1. Jaka komenda nie działała
2. Co się stało (błąd, brak zmiany, etc.)
3. Co było oczekiwane

---

**Data testów:** _______________
**Tester:** _______________

