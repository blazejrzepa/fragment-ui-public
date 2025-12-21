# Chat AI Integration - Playground AI

## Problem

Użytkownik pytał "czy czat działa?" i otrzymywał automatyczną odpowiedź:
> "I've generated a form component based on your request. The code has been created using the UI-DSL generator."

To nie była prawdziwa odpowiedź AI - tylko hardcoded tekst.

## Rozwiązanie

Dodano integrację z OpenAI API dla konwersacyjnych odpowiedzi:

### 1. Nowy endpoint `/api/chat`

**Lokalizacja**: `apps/demo/app/api/chat/route.ts`

**Funkcjonalność**:
- Przyjmuje wiadomość użytkownika
- Używa OpenAI API do generowania odpowiedzi
- Przekazuje kontekst (DSL, kod, historia wiadomości)
- Fallback do domyślnej wiadomości jeśli API nie działa

**Przykład użycia**:
```typescript
const response = await fetch("/api/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    message: "czy czat działa?",
    context: {
      dsl: currentDsl,
      code: currentCode,
      messages: recentMessages,
    },
  }),
});
```

### 2. Aktualizacja `page.tsx`

**Zmiany**:
- Po wygenerowaniu komponentu, system próbuje uzyskać odpowiedź AI
- Jeśli API nie działa, używa fallback wiadomości
- Dodano wykrywanie pytań (zaczynają się od "what", "how", "czy", kończą się "?")
- Krótkie wiadomości z istniejącym kodem są traktowane jako pytania

**Flow**:
1. Użytkownik wysyła wiadomość
2. System sprawdza czy to pytanie
3. Jeśli tak → używa `/api/chat` dla odpowiedzi
4. Jeśli nie → generuje komponent i używa `/api/chat` dla odpowiedzi po generacji

### 3. System Prompt

AI otrzymuje następujący system prompt:
```
You are an AI assistant helping users build React components using Fragment UI design system.

Your role:
- Help users understand what components were generated
- Explain the generation process
- Answer questions about the UI-DSL system
- Provide helpful guidance on component modifications

Keep responses:
- Concise and helpful
- Technical but accessible
- Focused on the component generation context
```

## Konfiguracja

### Wymagane zmienne środowiskowe

W `apps/demo/.env.local`:
```bash
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini  # opcjonalnie, domyślnie gpt-4o-mini
```

### Bez API Key

Jeśli `OPENAI_API_KEY` nie jest ustawiony:
- System używa fallback wiadomości
- Chat nadal działa, ale bez AI
- Generowanie komponentów działa normalnie

## Testowanie

### 1. Test z API Key

```bash
# Upewnij się że OPENAI_API_KEY jest w .env.local
cd apps/demo
pnpm dev
```

Następnie w playground:
- Wyślij: "czy czat działa?"
- Powinieneś otrzymać odpowiedź AI

### 2. Test bez API Key

```bash
# Usuń OPENAI_API_KEY z .env.local
cd apps/demo
pnpm dev
```

Następnie w playground:
- Wyślij: "czy czat działa?"
- Powinieneś otrzymać fallback wiadomość

## Przykłady pytań

### Pytania które będą obsłużone przez AI:

- ✅ "czy czat działa?"
- ✅ "jak to działa?"
- ✅ "co to jest UI-DSL?"
- ✅ "pomoc"
- ✅ "explain this component"
- ✅ Krótkie wiadomości (< 50 znaków) gdy istnieje kod

### Wiadomości które wygenerują komponent:

- ✅ "Create a login form"
- ✅ "Add email field"
- ✅ "Change button color to blue"
- ✅ Długie wiadomości bez znaku zapytania

## Troubleshooting

### Problem: "OpenAI API key not configured"

**Rozwiązanie**: Dodaj `OPENAI_API_KEY` do `apps/demo/.env.local` i zrestartuj serwer.

### Problem: Chat nie odpowiada

**Sprawdź**:
1. Czy `OPENAI_API_KEY` jest poprawny
2. Czy masz środki na koncie OpenAI
3. Sprawdź console w przeglądarce dla błędów
4. Sprawdź logi serwera

### Problem: Odpowiedzi są zbyt długie

**Rozwiązanie**: Zmień `max_tokens` w `apps/demo/app/api/chat/route.ts`:
```typescript
max_tokens: 500, // Zmniejsz jeśli odpowiedzi są za długie
```

## Koszty

### Przybliżone koszty (gpt-4o-mini):

- **1 odpowiedź chat**: ~100-200 tokens → ~$0.000015-0.00003
- **100 odpowiedzi/dzień**: ~$0.0015-0.003/dzień
- **1000 odpowiedzi/dzień**: ~$0.015-0.03/dzień

**Rekomendacja**: Użyj `gpt-4o-mini` dla chat (domyślnie) - najlepszy stosunek jakości do ceny.

## Status

✅ **Zaimplementowane**:
- Endpoint `/api/chat`
- Integracja w `page.tsx`
- Wykrywanie pytań
- Fallback handling
- System prompt

⏳ **Do zrobienia**:
- Cache odpowiedzi dla podobnych pytań
- Rate limiting
- Lepsze wykrywanie intencji (intent detection)
- Historia konwersacji w localStorage

