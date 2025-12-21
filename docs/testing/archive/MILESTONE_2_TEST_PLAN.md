# Test Plan - Milestone 2: Edit Loop

**Status:** ✅ Wszystkie funkcje zaimplementowane  
**Data:** 2025-01-XX

---

## ✅ Ukończone funkcje

### 2.1. Patch System ✅
- ✅ Format patchy (addNode, removeNode, setProp, setCopy, etc.)
- ✅ `applyPatch(dsl, patch[])` zaimplementowane
- ✅ Operation log z metadanymi (timestamp, prompt, userId)
- ✅ Undo/redo funkcjonalność

### 2.2. Focused Element ✅
- ✅ `selectedElementId` tracking
- ✅ Visual highlighting w Preview
- ✅ Subtree snapshot extraction
- ✅ Allowed props extraction
- ✅ Element context przekazywany do AI

### 2.3. Inspector ✅
- ✅ Props panel (variant, size, label, placeholder, disabled)
- ✅ Tokens panel (spacing, radius)
- ✅ Copy panel (label, title, placeholder, description)
- ✅ Wszystkie pola w jednej liście (bez zakładek)
- ✅ Styling (border-radius 8px, border-color foreground 5%)

---

## 🧪 Plan testów

### Test 1: Podstawowy flow - zmiana tekstu przycisku
**Cel:** Sprawdzić, czy podstawowy flow działa end-to-end

**Kroki:**
1. Wygeneruj przycisk: `Create a button with text 'Test Button'`
2. Zaznacz przycisk w Preview
3. W Copilot wpisz: `Zmień tekst na 'Zapisz'`
4. Sprawdź:
   - ✅ Tekst przycisku zmienił się na "Zapisz"
   - ✅ Kod został zaktualizowany
   - ✅ Struktura kodu jest prosta (bez niepotrzebnych wrapperów)
   - ✅ DSL został zaktualizowany

**Status:** ✅ **PASSED** (przetestowane)

---

### Test 2: Wszystkie komendy AI Copilot dla przycisku
**Cel:** Sprawdzić wszystkie dostępne komendy

#### 2.1. Zmiana tekstu
- [ ] `Zmień tekst na 'Zapisz'`
- [ ] `Change button text to 'Save'`
- [ ] `Ustaw tekst na 'Anuluj'`

#### 2.2. Zmiana wariantu
- [ ] `Zmień wariant na solid`
- [ ] `Change variant to outline`
- [ ] `Ustaw wariant na ghost`

#### 2.3. Zmiana rozmiaru
- [ ] `Zmień rozmiar na small`
- [ ] `Change size to md`
- [ ] `Ustaw rozmiar na large`

#### 2.4. Włączenie/wyłączenie
- [ ] `Wyłącz przycisk`
- [ ] `Disable button`
- [ ] `Włącz przycisk`

#### 2.5. Łączenie komend
- [ ] `Zmień tekst na 'Zapisz' i wariant na solid`
- [ ] `Change text to 'Save' and size to large`

---

### Test 3: Inspector - ręczna edycja
**Cel:** Sprawdzić, czy Inspector działa bez użycia AI

**Kroki:**
1. Wygeneruj przycisk: `Create a button with text 'Test Button'`
2. Zaznacz przycisk w Preview
3. Przejdź do zakładki **Inspector**
4. Zmień w Inspector:
   - [ ] Variant: solid → outline → ghost
   - [ ] Size: md → sm → lg
   - [ ] Label: "Test Button" → "Zapisz"
   - [ ] Disabled: false → true → false
5. Sprawdź:
   - ✅ Zmiany są widoczne natychmiast w Preview
   - ✅ Kod został zaktualizowany
   - ✅ DSL został zaktualizowany

---

### Test 4: Undo/Redo
**Cel:** Sprawdzić historię zmian

**Kroki:**
1. Wygeneruj przycisk: `Create a button with text 'Test Button'`
2. Wykonaj kilka zmian:
   - Zmień tekst na "Zapisz"
   - Zmień wariant na "outline"
   - Zmień rozmiar na "large"
3. Sprawdź Undo:
   - [ ] Kliknij Undo - rozmiar wraca do poprzedniego
   - [ ] Kliknij Undo - wariant wraca do poprzedniego
   - [ ] Kliknij Undo - tekst wraca do "Test Button"
4. Sprawdź Redo:
   - [ ] Kliknij Redo - tekst zmienia się na "Zapisz"
   - [ ] Kliknij Redo - wariant zmienia się na "outline"
   - [ ] Kliknij Redo - rozmiar zmienia się na "large"

---

### Test 5: Focused Element - kontekst dla AI
**Cel:** Sprawdzić, czy AI otrzymuje poprawny kontekst

**Kroki:**
1. Wygeneruj formularz z kilkoma przyciskami
2. Zaznacz pierwszy przycisk
3. W Copilot wpisz: `Zmień wariant na outline`
4. Sprawdź:
   - ✅ Tylko zaznaczony przycisk został zmieniony
   - ✅ Inne przyciski pozostały bez zmian
5. Zaznacz drugi przycisk
6. W Copilot wpisz: `Zmień tekst na 'Anuluj'`
7. Sprawdź:
   - ✅ Tylko drugi przycisk został zmieniony
   - ✅ Pierwszy przycisk nadal ma outline

---

### Test 6: Multiple sequential patches
**Cel:** Sprawdzić, czy wiele zmian działa poprawnie

**Kroki:**
1. Wygeneruj przycisk: `Create a button with text 'Test Button'`
2. Wykonaj serię zmian:
   - `Zmień tekst na 'Zapisz'`
   - `Zmień wariant na outline`
   - `Zmień rozmiar na large`
   - `Wyłącz przycisk`
3. Sprawdź:
   - ✅ Wszystkie zmiany są zastosowane
   - ✅ Kod jest spójny
   - ✅ DSL jest spójny
   - ✅ Preview wyświetla wszystkie zmiany

---

### Test 7: Operation Log - metadane
**Cel:** Sprawdzić, czy metadane są zapisywane

**Kroki:**
1. Wygeneruj przycisk: `Create a button with text 'Test Button'`
2. Wykonaj kilka zmian z różnymi promptami
3. Sprawdź historię (jeśli dostępna w UI):
   - [ ] Każda zmiana ma timestamp
   - [ ] Każda zmiana ma zapisany prompt
   - [ ] Historia jest dostępna do przeglądania

---

### Test 8: Różne komponenty
**Cel:** Sprawdzić, czy działa dla różnych komponentów

#### 8.1. Input
- [ ] Wygeneruj: `Create an input field`
- [ ] Zaznacz input
- [ ] W Copilot: `Zmień placeholder na 'Wpisz tekst'`
- [ ] W Copilot: `Zmień label na 'Nazwa'`

#### 8.2. Formularz
- [ ] Wygeneruj: `Create a form with email and password fields`
- [ ] Zaznacz pole email
- [ ] W Copilot: `Zmień label na 'Adres email'`
- [ ] Zaznacz przycisk submit
- [ ] W Copilot: `Zmień tekst na 'Zaloguj się'`

---

## 📊 Raport testów

### Wyniki:

#### Test 1: Podstawowy flow ✅
- Status: ✅ PASSED
- Notatki: Działa poprawnie, struktura kodu jest prosta

#### Test 2: Wszystkie komendy AI Copilot
- Status: ⏳ DO PRZETESTOWANIA
- Notatki: _________________

#### Test 3: Inspector - ręczna edycja
- Status: ⏳ DO PRZETESTOWANIA
- Notatki: _________________

#### Test 4: Undo/Redo
- Status: ⏳ DO PRZETESTOWANIA
- Notatki: _________________

#### Test 5: Focused Element - kontekst
- Status: ⏳ DO PRZETESTOWANIA
- Notatki: _________________

#### Test 6: Multiple sequential patches
- Status: ⏳ DO PRZETESTOWANIA
- Notatki: _________________

#### Test 7: Operation Log - metadane
- Status: ⏳ DO PRZETESTOWANIA
- Notatki: _________________

#### Test 8: Różne komponenty
- Status: ⏳ DO PRZETESTOWANIA
- Notatki: _________________

---

## 🐛 Znalezione problemy

1. **Problem:** _________________
   - Opis: _________________
   - Status: ⏳ DO NAPRAWY

---

## ✅ Następne kroki

Po zakończeniu testów Milestone 2:

1. **Napraw znalezione problemy**
2. **Przejdź do Milestone 3:** Złożone Ekrany (Dashboardy, Landing Pages, Warianty)
3. **Lub przetestuj Milestone 6:** Agentic Experience Layer (AXL)

---

**Data testów:** _______________  
**Tester:** _______________

