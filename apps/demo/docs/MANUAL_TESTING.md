# Instrukcja Testowania Manualnego

## Sprawdzenie czy serwer działa

1. **Sprawdź czy serwer Next.js działa:**
   ```bash
   # W terminalu sprawdź procesy
   ps aux | grep next
   
   # Lub sprawdź port
   lsof -ti:3002
   ```

2. **Jeśli serwer nie działa, uruchom go:**
   ```bash
   cd apps/demo
   pnpm dev
   ```

## Testowanie Czatu

### Opcja 1: Główny Playground (z czatem w sidebarze)

1. **Otwórz przeglądarkę:**
   ```
   http://localhost:3002/studio
   ```

2. **Sprawdź czy widzisz:**
   - Lewą kolumnę z preview/code
   - Prawą kolumnę z czatem (PlaygroundCopilotInspector)
   - Pole do wpisywania wiadomości

3. **Przetestuj podstawowe funkcje:**
   - Wpisz prompt: `"Create a landing page with hero section, pricing table with 3 tiers, and FAQ section"`
   - Naciśnij Enter lub kliknij przycisk wysyłania
   - Sprawdź czy:
     - Wiadomość pojawia się w czacie
     - Kod jest generowany
     - Preview pokazuje wygenerowany komponent
     - Nie ma błędów w konsoli przeglądarki

### Opcja 2: Chat Playground (dedykowana strona czatu)

1. **Otwórz przeglądarkę:**
   ```
   http://localhost:3002/studio/chat
   ```

2. **Sprawdź czy widzisz:**
   - Header z tytułem "AI Chat Playground"
   - Przyciski "New Component" i "Clear Chat"
   - Dwie kolumny: lewa (preview/code), prawa (czat)

3. **Przetestuj funkcje:**
   - Wpisz prompt: `"Create a registration form with email and password"`
   - Sprawdź czy kod jest generowany i wyświetlany
   - Wpisz kolejny prompt: `"Add a phone number field"`
   - Sprawdź czy kod jest modyfikowany (nie zastępowany)

## Testowanie Endpointu API bezpośrednio

Możesz przetestować endpoint `/api/generate` bezpośrednio:

```bash
curl -X POST http://localhost:3002/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Create a landing page with hero section, pricing table with 3 tiers, and FAQ section",
    "demoName": "test"
  }'
```

Oczekiwany wynik:
- Status: 200 OK
- Body: JSON z `code` (string TSX) i `metadata` (obiekt)

## Testowanie Różnych Typów Promptów

### 1. Landing Page (Screen DSL)
```
"Create a landing page with hero section, pricing table with 3 tiers, and FAQ section"
```
**Oczekiwany rezultat:** Kod z `UiPage` DSL, regions (header, content, footer), moduły (hero, pricing, faq)

### 2. Formularz
```
"Create a registration form with email and password"
```
**Oczekiwany rezultat:** Kod z formularzem React, walidacją

### 3. Modyfikacja istniejącego kodu
```
"Add a phone number field"
```
**Oczekiwany rezultat:** Kod z dodanym polem telefonu

## Sprawdzanie Logów

1. **Logi serwera Next.js:**
   - Sprawdź terminal gdzie uruchomiono `pnpm dev`
   - Szukaj błędów, warningów

2. **Logi przeglądarki:**
   - Otwórz DevTools (F12)
   - Sprawdź Console dla błędów JavaScript
   - Sprawdź Network dla błędów API

3. **Logi API:**
   - W `apps/demo/app/api/generate/route.ts` są `console.log` które pokazują:
     - Jaki parser został użyty
     - Jaki DSL został wygenerowany
     - Jaki kod został wygenerowany

## Typowe Problemy

### Problem: "Failed to generate code"
- **Sprawdź:** Czy endpoint `/api/generate` zwraca błąd
- **Sprawdź:** Logi w terminalu serwera
- **Sprawdź:** Console w przeglądarce

### Problem: Kod się nie renderuje
- **Sprawdź:** Console w przeglądarce dla błędów składni
- **Sprawdź:** Czy `ReactLiveRenderer` otrzymuje poprawny kod
- **Sprawdź:** Czy są błędy Babel transpilacji

### Problem: Czat nie odpowiada
- **Sprawdź:** Czy `isGenerating` nie jest zablokowane
- **Sprawdź:** Network tab w DevTools - czy request do `/api/generate` został wysłany
- **Sprawdź:** Czy response z API jest poprawny

## Checklist Testowania

- [ ] Serwer działa na porcie 3002
- [ ] Strona `/playground` się ładuje
- [ ] Strona `/studio/chat` się ładuje
- [ ] Czat wysyła wiadomości
- [ ] API `/api/generate` odpowiada
- [ ] Kod jest generowany poprawnie
- [ ] Preview renderuje komponent
- [ ] Nie ma błędów w konsoli
- [ ] Modyfikacja istniejącego kodu działa
- [ ] Layout (grid/stack) działa
- [ ] DataBindings (placeholder/static/mock) działają
- [ ] Moduły (testimonials, KPI header, data table) działają

