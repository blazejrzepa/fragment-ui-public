# 🚀 Szybki Przewodnik Testowania

## 1️⃣ Otwórz Playground

**URL:** http://localhost:3002/playground/chat

Lub z głównej strony: http://localhost:3002 → kliknij "💬 AI Chat Playground"

---

## 2️⃣ Test Podstawowy - Prosty Formularz

### Krok 1: Wyślij prompt
```
Zbuduj formularz rejestracyjny z polami: email, hasło i numer telefonu
```

### Krok 2: Sprawdź Preview
- ✅ Formularz się renderuje?
- ✅ Są 3 pola (email, hasło, telefon)?
- ✅ Jest przycisk "Submit" lub "Zarejestruj się"?

### Krok 3: Sprawdź Code
- Kliknij zakładkę **"Code"**
- ✅ Kod jest sformatowany?
- ✅ Są importy z `@fragment_ui/ui`?
- ✅ Jest walidacja?

### Krok 4: Przetestuj Interakcję
- Wypełnij pola w Preview
- ✅ Czy walidacja działa?
- ✅ Czy błędy się pokazują?

---

## 3️⃣ Test Modyfikacji (Iteracyjne)

### Krok 1: Wyślij pierwszą wiadomość
```
Create a login form with email and password
```

### Krok 2: Dodaj pole
```
Add a "Remember me" checkbox
```

### Krok 3: Zmień tekst
```
Change the submit button text to "Sign In"
```

### Krok 4: Dodaj walidację
```
Add validation: password must be at least 8 characters
```

**Sprawdź:**
- ✅ Czy każda modyfikacja działa?
- ✅ Czy kod się aktualizuje?
- ✅ Czy Preview pokazuje zmiany?

---

## 4️⃣ Test Złożonych Promptów

### Test 1: Formularz z wieloma polami
```
Create a contact form with: name, email, phone, subject (select), message (textarea), and a privacy policy checkbox
```

**Sprawdź:**
- ✅ Wszystkie pola są obecne?
- ✅ Select ma opcje?
- ✅ Textarea jest większe niż Input?

### Test 2: Ekran z tabelą
```
Create a list view with a search input, filter select, data table with columns: name, email, role, and pagination
```

**Sprawdź:**
- ✅ Tabela się renderuje?
- ✅ Pagination ma wszystkie wymagane props?
- ✅ Nie ma błędów w konsoli?

---

## 5️⃣ Sprawdzanie Konsoli

**Otwórz DevTools (F12) → Console**

### Co sprawdzać:
- ❌ **Błędy** (czerwone) - powinno być 0
- ⚠️ **Ostrzeżenia** (żółte) - sprawdź czy są istotne
- ℹ️ **Logi** - `metadata.method` pokazuje czy użyto OpenAI czy rule-based

### Przykładowe logi:
```javascript
// Jeśli użyto OpenAI:
metadata: { method: "openai", model: "gpt-4o-mini" }

// Jeśli użyto rule-based:
metadata: { method: "rule-based" }
```

---

## 6️⃣ Checklist Testowania

### Funkcjonalność
- [ ] Formularz się renderuje
- [ ] Wszystkie pola są widoczne
- [ ] Walidacja działa
- [ ] Przyciski działają
- [ ] Błędy są wyświetlane poprawnie

### Kod
- [ ] Kod jest sformatowany
- [ ] Importy są poprawne
- [ ] Nie ma błędów składniowych
- [ ] TypeScript types są poprawne (jeśli użyto OpenAI)

### UI/UX
- [ ] Komponenty wyglądają dobrze
- [ ] Stylowanie jest spójne z Fragment UI
- [ ] Responsywność działa
- [ ] Loading states działają

### Modyfikacje
- [ ] Iteracyjne zmiany działają
- [ ] Kontekst jest zachowany
- [ ] Kod się aktualizuje poprawnie

---

## 7️⃣ Przykładowe Prompty do Testowania

### Proste (Rule-based)
```
✅ "Zbuduj formularz rejestracyjny z polami: email, hasło"
✅ "Create a contact form with name, email, message"
✅ "Formularz logowania"
```

### Złożone (OpenAI - jeśli masz API key)
```
✅ "Create a registration form with email validation, password strength meter, phone number with country code selector, and terms of service checkbox"
✅ "Build a multi-step form with progress indicator: step 1 (personal info), step 2 (contact details), step 3 (preferences)"
✅ "Create a settings page with tabs: Profile, Security, Notifications, each with relevant form fields"
```

### Modyfikacje
```
✅ "Add a phone number field to the existing form"
✅ "Change all button texts to Polish"
✅ "Add validation: email must be from @company.com domain"
✅ "Make the form wider and center it"
```

---

## 8️⃣ Troubleshooting

### Problem: Kod się nie renderuje
1. Sprawdź konsolę (F12) - są błędy?
2. Sprawdź zakładkę "Code" - czy kod jest poprawny?
3. Spróbuj "Clear Chat" i zacznij od nowa

### Problem: OpenAI nie działa
1. Sprawdź czy `.env.local` istnieje w `apps/demo/`
2. Sprawdź czy `OPENAI_API_KEY` jest ustawiony
3. Zrestartuj serwer
4. Sprawdź konsolę serwera - są błędy API?

### Problem: Walidacja nie działa
1. Sprawdź czy `validateValue` jest zaimportowany
2. Sprawdź czy `validationRules` są zdefiniowane
3. Sprawdź czy `handleSubmit` wywołuje walidację

---

## 9️⃣ Co Działa vs Co Nie Działa

### ✅ Działa (Rule-based)
- Proste formularze z podstawowymi polami
- Podstawowa walidacja
- Standardowe komponenty Fragment UI

### ⚠️ Ograniczenia (Rule-based)
- Bardzo złożone prompty mogą nie być zrozumiane
- Modyfikacje istniejącego kodu są ograniczone
- Niektóre komponenty mogą nie być rozpoznane

### ✅ Działa (OpenAI - z API key)
- Złożone prompty
- Modyfikacje istniejącego kodu
- Lepsze zrozumienie kontekstu
- Większa elastyczność

---

## 🎯 Następne Kroki

1. **Przetestuj podstawowe scenariusze** (punkty 2-4)
2. **Sprawdź konsolę** (punkt 5)
3. **Przetestuj modyfikacje** (punkt 3)
4. **Dodaj API key** i przetestuj złożone prompty (punkt 7)

---

## 📝 Raportowanie Problemów

Jeśli znajdziesz problem:
1. Zapisz prompt, który spowodował problem
2. Sprawdź konsolę przeglądarki (F12)
3. Sprawdź konsolę serwera
4. Zapisz screenshot błędu
5. Sprawdź `metadata.method` - czy użyto OpenAI czy rule-based?

