# Implementacja "AI" w AI Playground

## ⚠️ Ważne: To NIE jest prawdziwe AI

Obecna implementacja **NIE używa** zewnętrznego AI (OpenAI, Anthropic, Claude, etc.). Zamiast tego używa **rule-based parsing** - systemu reguł i wzorców do parsowania promptów.

## Jak Działa Obecny System

### 1. Rule-Based Parsing
- **Parser**: `packages/ui-dsl/src/parser.ts`
- **Metoda**: Wzorce regex, słowniki kluczowych słów, szablony
- **Przykład**: 
  - Prompt: "Zbuduj formularz rejestracyjny z polami: email, hasło"
  - System wykrywa: `rejestrac` → scaffold: "form-auth"
  - System ekstrahuje: `email`, `hasło` → pola formularza
  - System używa: szablonu "registration" z predefiniowanymi polami

### 2. Szablony i Reguły
- **Szablony formularzy**: `FORM_TEMPLATES` w `apps/demo/app/api/generate/route.ts`
- **Szablony ekranów**: `SCREEN_TEMPLATES` w `apps/demo/app/api/generate/rules.ts`
- **Reguły wykrywania**: Funkcje `detectFormType`, `detectScreenType`, `extractFieldsFromPrompt`

### 3. Generator Kodu
- **Generator**: `packages/ui-dsl/src/generator.ts`
- **Metoda**: Konwersja UI-DSL → kod React
- **Wynik**: Statyczny kod React z komponentami Fragment UI

## Ograniczenia Obecnego Systemu

### ❌ Co NIE działa:
- **Brak zrozumienia kontekstu**: System nie rozumie intencji, tylko dopasowuje wzorce
- **Ograniczone prompty**: Działa tylko z predefiniowanymi wzorcami
- **Brak elastyczności**: Trudno dodać nowe typy bez modyfikacji kodu
- **Brak uczenia**: System nie uczy się z poprzednich interakcji
- **Proste modyfikacje**: Modyfikacja kodu przez chat jest ograniczona (wysyła cały kod do parsera)

### ✅ Co działa:
- **Proste formularze**: "Zbuduj formularz rejestracyjny z polami: email, hasło"
- **Wykrywanie pól**: Automatyczne wykrywanie typów pól (email, password, phone)
- **Szablony**: Gotowe szablony dla popularnych formularzy
- **Walidacja**: Automatyczna walidacja dla typowych pól

## Propozycja: Integracja z Prawdziwym AI

### Opcja 1: OpenAI GPT-4/GPT-3.5
```typescript
// apps/demo/app/api/generate/route.ts
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// W POST handler:
const completion = await openai.chat.completions.create({
  model: "gpt-4",
  messages: [
    {
      role: "system",
      content: "You are an expert React developer. Generate React components using Fragment UI design system..."
    },
    {
      role: "user",
      content: prompt
    }
  ],
  temperature: 0.7,
});

const code = completion.choices[0].message.content;
```

### Opcja 2: Anthropic Claude
```typescript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const message = await anthropic.messages.create({
  model: "claude-3-5-sonnet-20241022",
  max_tokens: 4096,
  messages: [
    {
      role: "user",
      content: prompt
    }
  ],
});
```

### Opcja 3: Hybrid Approach (Rekomendowane)
1. **Proste prompty** → Rule-based parsing (szybkie, darmowe)
2. **Złożone prompty** → AI API (elastyczne, ale kosztowne)
3. **Modyfikacje kodu** → AI API (lepsze zrozumienie kontekstu)

## Implementacja Hybrid Approach

```typescript
// apps/demo/app/api/generate/route.ts

async function generateCode(prompt: string, existingCode?: string): Promise<string> {
  // Check if prompt is simple enough for rule-based parsing
  const isSimplePrompt = checkIfSimple(prompt);
  
  if (isSimplePrompt && !existingCode) {
    // Use rule-based parsing (fast, free)
    const dsl = parsePromptToUIDSL(prompt);
    return generateCodeFromUIDSL(dsl);
  } else {
    // Use AI API (flexible, but costs money)
    return await generateWithAI(prompt, existingCode);
  }
}

function checkIfSimple(prompt: string): boolean {
  // Simple prompts: "Create form with fields: email, password"
  // Complex prompts: "Create a multi-step wizard form with conditional fields"
  const simplePatterns = [
    /formularz.*z polami/i,
    /create.*form.*with fields/i,
    /zbuduj.*formularz/i,
  ];
  
  return simplePatterns.some(pattern => pattern.test(prompt));
}

async function generateWithAI(prompt: string, existingCode?: string): Promise<string> {
  // Use OpenAI/Anthropic API
  // ...
}
```

## Koszty i Wymagania

### OpenAI GPT-4
- **Koszt**: ~$0.03 per 1K tokens (input), ~$0.06 per 1K tokens (output)
- **Średni prompt**: ~500 tokens → ~$0.015-0.03 per request
- **Wymagania**: API key, konto OpenAI

### Anthropic Claude
- **Koszt**: ~$0.003 per 1K tokens (input), ~$0.015 per 1K tokens (output)
- **Średni prompt**: ~500 tokens → ~$0.0015-0.0075 per request
- **Wymagania**: API key, konto Anthropic

### Rule-Based (Obecny)
- **Koszt**: $0 (darmowe)
- **Ograniczenia**: Tylko proste prompty

## Rekomendacja

### Faza 1: Hybrid Approach (MVP)
1. **Zachowaj rule-based** dla prostych promptów
2. **Dodaj AI API** dla złożonych promptów i modyfikacji
3. **Fallback**: Jeśli AI API nie działa, użyj rule-based

### Faza 2: Full AI (Opcjonalnie)
1. **Wszystkie prompty** przez AI API
2. **Lepsze zrozumienie** kontekstu
3. **Większa elastyczność**

## Przykładowa Implementacja

Zobacz: `apps/demo/docs/AI_INTEGRATION_EXAMPLE.md` (do utworzenia)

## Podsumowanie

**Obecny system:**
- ✅ Rule-based parsing
- ✅ Szablony i reguły
- ✅ Szybkie i darmowe
- ❌ Ograniczone możliwości
- ❌ Brak prawdziwego AI

**Możliwe ulepszenie:**
- ✅ Integracja z OpenAI/Anthropic
- ✅ Lepsze zrozumienie promptów
- ✅ Większa elastyczność
- ❌ Koszty API
- ❌ Wymaga API keys

