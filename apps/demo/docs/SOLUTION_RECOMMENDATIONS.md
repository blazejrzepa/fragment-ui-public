# Rekomendacje Rozwiązań dla AI Playground

## 🔴 Obecne Problemy

1. **Rule-based parsing jest bardzo ograniczony**
   - Nie rozumie kontekstu
   - Trudno dodać nowe wzorce
   - Ograniczone możliwości modyfikacji kodu

2. **Problemy z transpilacją TypeScript**
   - Regex do usuwania typów jest skomplikowany i podatny na błędy
   - Ciągle są problemy z `React.FormEvent`, `string`, `any`
   - Regex przypadkowo usuwa wartości w obiektach (`: value`)

3. **React Live ma ograniczenia**
   - Nie obsługuje TypeScript natywnie
   - Wymaga ręcznego czyszczenia kodu
   - Problemy z niektórymi składniami

## ✅ Sprawdzone Rozwiązania

### Opcja 1: OpenAI API + Sandpack (REKOMENDOWANE)

**Dlaczego to najlepsze rozwiązanie:**

1. **OpenAI API (GPT-4/GPT-3.5)**
   - ✅ Rozumie kontekst i intencję
   - ✅ Generuje poprawny kod TypeScript/React
   - ✅ Może modyfikować istniejący kod
   - ✅ Obsługuje złożone wymagania
   - ⚠️ Wymaga API key (koszt ~$0.01-0.03 per request)

2. **Sandpack (CodeSandbox)**
   - ✅ Profesjonalne narzędzie używane przez CodeSandbox
   - ✅ Natively obsługuje TypeScript
   - ✅ Live editing i preview
   - ✅ Syntax highlighting
   - ✅ Eksport do CodeSandbox
   - ✅ Nie wymaga ręcznego czyszczenia kodu
   - ⚠️ Większy bundle (~500KB)

**Implementacja:**

```typescript
// apps/demo/app/api/generate/route.ts
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  const { prompt, code } = await request.json();
  
  const systemPrompt = `You are an expert React developer. Generate React components using Fragment UI design system.
  
Available components: Button, Input, Card, FormField, Select, Checkbox, etc.
Always use TypeScript.
Always include proper validation.
Generate complete, working code.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview", // or "gpt-3.5-turbo" for cheaper
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: code ? `Modify this code: ${code}\n\nRequest: ${prompt}` : prompt }
    ],
    temperature: 0.7,
  });

  return NextResponse.json({ code: completion.choices[0].message.content });
}
```

```tsx
// apps/demo/src/components/sandpack-renderer.tsx
import { Sandpack } from "@codesandbox/sandpack-react";
import "@codesandbox/sandpack-react/dist/index.css";

export function SandpackRenderer({ code }: { code: string }) {
  return (
    <Sandpack
      template="react-ts"
      theme="dark"
      files={{
        "/App.tsx": code,
        "/package.json": JSON.stringify({
          dependencies: {
            react: "^18.0.0",
            "react-dom": "^18.0.0",
            "@fragment_ui/ui": "*",
          },
        }),
      }}
      customSetup={{
        dependencies: {
          "@fragment_ui/ui": "*",
        },
      }}
    />
  );
}
```

**Koszty:**
- GPT-4: ~$0.03 per request
- GPT-3.5: ~$0.002 per request
- Sandpack: darmowe (open source)

### Opcja 2: OpenAI API + Dynamic Imports (NAJNIEZAWODNIEJSZE)

**Dlaczego to najlepsze dla produkcji:**

1. **OpenAI API** - jak wyżej
2. **Dynamic Imports + Server Components**
   - ✅ Używa prawdziwych komponentów (nie transpilacji)
   - ✅ Type-safe
   - ✅ Najszybsze (brak transpilacji w przeglądarce)
   - ✅ Brak problemów z escapowaniem
   - ⚠️ Wymaga bundlingu (esbuild/webpack)

**Implementacja:**

```typescript
// apps/demo/app/api/generate/route.ts
// ... OpenAI API jak wyżej ...

// apps/demo/app/api/bundle/route.ts
import { build } from 'esbuild';

export async function POST(request: NextRequest) {
  const { code } = await request.json();
  
  const result = await build({
    stdin: {
      contents: code,
      resolveDir: process.cwd(),
    },
    bundle: true,
    format: 'esm',
    target: 'es2020',
    jsx: 'automatic',
  });

  return NextResponse.json({ bundled: result.outputFiles[0].text });
}
```

### Opcja 3: Hybrid Approach (KOMPROMIS)

**Dlaczego to dobre rozwiązanie:**

1. **Proste prompty** → Rule-based (szybkie, darmowe)
2. **Złożone prompty** → OpenAI API (elastyczne)
3. **Sandpack** → Renderowanie (niezawodne)

**Implementacja:**

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
    // Use OpenAI API (flexible, but costs money)
    return await generateWithOpenAI(prompt, existingCode);
  }
}

function checkIfSimple(prompt: string): boolean {
  const simplePatterns = [
    /formularz.*z polami/i,
    /create.*form.*with fields/i,
    /zbuduj.*formularz/i,
  ];
  return simplePatterns.some(pattern => pattern.test(prompt));
}
```

## 📊 Porównanie Rozwiązań

| Rozwiązanie | Jakość kodu | Niezawodność | Koszt | Złożoność |
|------------|-------------|--------------|-------|-----------|
| **Rule-based (obecne)** | ⭐⭐ | ⭐⭐ | $0 | ⭐⭐⭐ |
| **OpenAI + Sandpack** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | $0.01-0.03/req | ⭐⭐⭐ |
| **OpenAI + Dynamic Imports** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | $0.01-0.03/req | ⭐⭐⭐⭐ |
| **Hybrid** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | $0.005-0.01/req | ⭐⭐⭐ |

## 🎯 Rekomendacja

**Dla MVP/Development:**
- **OpenAI API (GPT-3.5)** + **Sandpack**
- Szybka implementacja
- Wysoka jakość kodu
- Niskie koszty (~$0.002 per request)

**Dla Produkcji:**
- **Hybrid Approach** (proste → rule-based, złożone → OpenAI)
- **Sandpack** dla renderowania
- Optymalizacja kosztów
- Wysoka niezawodność

**Dla Najwyższej Niezawodności:**
- **OpenAI API** + **Dynamic Imports**
- Używa prawdziwych komponentów
- Type-safe
- Najszybsze

## 🚀 Plan Implementacji (OpenAI + Sandpack)

1. **Zainstaluj zależności:**
   ```bash
   pnpm add openai @codesandbox/sandpack-react
   ```

2. **Dodaj API key do `.env.local`:**
   ```
   OPENAI_API_KEY=sk-...
   ```

3. **Zaktualizuj `/api/generate`:**
   - Dodaj integrację z OpenAI
   - Zachowaj fallback do rule-based dla prostych promptów

4. **Zastąp ReactLiveRenderer SandpackRenderer:**
   - Usuń całą logikę czyszczenia kodu
   - Sandpack obsługuje TypeScript natywnie

5. **Testuj i optymalizuj:**
   - Dostosuj system prompt dla OpenAI
   - Optymalizuj koszty (użyj GPT-3.5 dla prostych przypadków)

## 💡 Alternatywa: Lepsze Regex (SZYBKA NAPRAWA)

Jeśli nie chcesz teraz integrować OpenAI, możemy poprawić obecny system:

1. **Użyj Babel do usuwania typów** zamiast regex
2. **Użyj TypeScript compiler API** do transpilacji
3. **Lepsze wykrywanie kontekstu** (funkcje vs obiekty)

Ale to nadal będzie miało ograniczenia rule-based parsingu.

## ❓ Pytania do Rozważenia

1. **Budżet:** Czy możesz pozwolić sobie na ~$0.01-0.03 per request?
2. **Czas:** Czy masz czas na implementację Sandpack/OpenAI?
3. **Priorytet:** Co jest ważniejsze - szybkość czy jakość?

## 📝 Rekomendacja Końcowa

**Zacznij od OpenAI API + Sandpack:**
- Najszybsza droga do wysokiej jakości
- Sprawdzone rozwiązania
- Można zoptymalizować koszty później (hybrid approach)

