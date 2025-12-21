# Copilot Playground AI — Dokumentacja techniczna (MVP → v1)

## Status: Specyfikacja do implementacji

Ten dokument zawiera pełną specyfikację techniczną dla Copilot Playground AI zgodnie z wymaganiami.

## Cel

Umożliwić budowanie działających widoków i komponentów z istniejącego Design Systemu (Fragment UI) z użyciem prostych promptów naturalnego języka (vibe coding), przy zachowaniu spójności z tokenami, zasadami a11y i standardami kodu.

## Zakres

Prompt → UI-DSL (kontrakt) → generator → TSX (Fragment UI) → podgląd live (same-origin iframe).

Bramka jakości: a11y quick-check (axe), linty DS, testy wizualne (CI).

Polityka CSS: zero importów .css w ESM – style podawane linkiem (tokens/ui/vendor).

---

## 1. Architektura wysokiego poziomu

```
apps/demo (Next.js)
 ├─ playground/                   # UI i runtime podglądu
 │   ├─ page.tsx                  # interfejs (prompt, edytor, logi)
 │   ├─ runtime/
 │   │   ├─ iframe.html           # same-origin, <link rel="stylesheet"> do CSS
 │   │   ├─ worker.ts             # esbuild-wasm bundling per-snippet (web worker)
 │   │   └─ bridge.ts             # postMessage API parent <-> iframe
 │   └─ dsl/
 │       ├─ schema.ts             # JSON schema UI-DSL
 │       ├─ types.ts              # typy DSL
 │       └─ generator.ts          # UI-DSL -> TSX (Fragment UI)
 ├─ api/
 │   ├─ bundle/route.ts          # prebundle @fragment_ui/ui (ESM) - external: ["**/*.css"]
 │   └─ bundle-css/route.ts      # tokens.css / ui.css / vendor.css (react-day-picker itp.)
 └─ docs/COPILOT_PLAYGROUND.md   # ten dokument

packages/
 ├─ ui/                           # Fragment UI (komponenty)
 │  ├─ src/...                    # bez importów ".css" w JS/TS !
 │  └─ styles/                    # opcjonalne style sidecar
 └─ tokens/                       # DTCG -> build: CSS vars / Tailwind / TS
    ├─ tokens.json
    ├─ build.css.ts               # generuje tokens.css
    └─ build.tailwind.ts

tooling/
 ├─ mcp/                          # "narzędzia" Copilota
 │  ├─ registry.server.ts         # registry.list/get
 │  ├─ tokens.server.ts           # tokens.semantic/css()
 │  ├─ scaffolds.server.ts        # scaffolds.list/create
 │  └─ storybook.server.ts        # (opcjonalne) stories.json
 ├─ lint/                         # reguły ESLint (ban raw elements, import guards)
 └─ tests/                        # a11y quick, visual baseline (CI)
```

---

## 2. Kontrakty „źródeł prawdy”

### 2.1 design-system/registry.json

Maszynowo-czytelny spis komponentów: importy, propsy, aliasy, reguły.

**Lokalizacja:** `packages/registry/registry.json` (lub `apps/demo/registry.json`)

**Przykład struktury:**
```json
{
  "$schema": "https://your.domain/schemas/registry.schema.json",
  "version": "1.0.0",
  "components": {
    "Form": { "import": "@fragment_ui/ui/form" },
    "FormField": {
      "import": "@fragment_ui/ui/form",
      "props": { "name": "string", "label": "string", "description?": "string" }
    },
    "Input": {
      "import": "@fragment_ui/ui/input",
      "props": { "type?": ["text","email","password"], "invalid?": "boolean" }
    },
    "PasswordInput": { "import": "@fragment_ui/ui/password-input" },
    "Checkbox": { "import": "@fragment_ui/ui/checkbox", "props": { "required?": "boolean" } },
    "Select": { "import": "@fragment_ui/ui/select", "props": { "options": "string[]", "placeholder?":"string" } },
    "Switch": { "import": "@fragment_ui/ui/switch" },
    "Textarea": { "import": "@fragment_ui/ui/textarea" },
    "Button": {
      "import": "@fragment_ui/ui/button",
      "props": { "variant": ["primary","secondary","ghost"], "type?": ["button","submit"] }
    },
    "Card": { "import": "@fragment_ui/ui/card" },
    "Tabs": { "import": "@fragment_ui/ui/tabs" },
    "TabsList": { "import": "@fragment_ui/ui/tabs" },
    "TabTrigger": { "import": "@fragment_ui/ui/tabs" },
    "TabContent": { "import": "@fragment_ui/ui/tabs" },
    "Table": { "import": "@fragment_ui/ui/table" },
    "Badge": { "import": "@fragment_ui/ui/badge" }
  },
  "aliases": {
    "Tab": "TabTrigger",
    "TabsHeader": "TabsList"
  },
  "rules": {
    "forbiddenHtml": ["input","button","select","textarea"],
    "prefer": { "input": "Input", "button": "Button" }
  }
}
```

### 2.2 tokens/tokens.json (DTCG)

Base: color/space/radius/opacity/motion/zIndex.

Semantic: text/primary, btn/bg/default, surface/elev/1 itd.

**Build:**
- `apps/demo/styles/tokens.css` (CSS variables)
- `packages/ui/tailwind.config.ts` (theme)
- `packages/ui/src/tokens.ts` (typy/wartości dla TS)

### 2.3 UI-DSL (kontrakt pośredni)

Minimalny JSON, z którego generator buduje TSX.

**Lokalizacja:** `apps/demo/app/playground/dsl/types.ts`

```typescript
// dsl/types.ts
export type UiDsl =
  | UiForm
  | UiPage
  | UiTable
  | UiDashboard;

export type UiCommon = {
  title?: string;
  layout?: { maxWidth?: "sm"|"md"|"lg"|"xl"; gap?: number };
  a11y?: { ariaDescribedBy?: string };
};

export type UiForm = UiCommon & {
  type: "form";
  fields: Array<{
    name: string;
    label: string;
    component: "Input"|"PasswordInput"|"Checkbox"|"Select"|"Switch"|"Textarea";
    options?: string[];
    validation?: string; // np. "email|required" albo "min:8|required"
    placeholder?: string;
  }>;
  actions?: Array<{ type: "submit"|"reset"|"button"; label: string; variant?: "primary"|"secondary"|"ghost" }>;
};

export type UiPage = UiCommon & {
  type: "page";
  sections: Array<{ kind: "card"|"tabs"|"two-column"; content: UiDsl[] | Record<string, UiDsl[]> }>;
};

export type UiTable = UiCommon & {
  type: "table";
  columns: Array<{ key: string; label: string; kind?: "text"|"badge"|"date"|"actions" }>;
  dataSource: "placeholder"|"url"|"static";
  filters?: Array<{ type: "search"|"select"|"dateRange"; key: string; options?: string[] }>;
  pagination?: { pageSize: number };
};

export type UiDashboard = UiCommon & {
  type: "dashboard";
  widgets: Array<{ kind: "metric"|"chart"|"table"; title?: string }>;
};
```

---

## 3. Polityka CSS (krytyczne)

### Zasada 1 — Zero import ".css" w ESM pakietach

W `packages/ui/src/**` nie umieszczamy `import ".../*.css"`.

Vendorowe style (np. react-day-picker) nie mogą być importowane z JS/TS — wyłącznie `<link>`.

### Zasada 2 — Style podawane centralnie jako <link> (same-origin)

`apps/demo/app/playground/runtime/iframe.html` zawiera:

```html
<link rel="stylesheet" href="/api/bundle-css?name=tokens" />
<link rel="stylesheet" href="/api/bundle-css?name=ui" />
<!-- Vendor CSS, jeśli potrzebne -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/react-day-picker@9/dist/style.css" />
```

`/api/bundle-css` może łączyć tokens.css, ui.css i kopię vendor-CSS.

### Zasada 3 — Bundler serwerowy tnie CSS z ESM

W `/api/bundle/route.ts`:

```typescript
external: ["**/*.css"]  // NIE działa w esbuild - użyj pluginu!
```

**Rozwiązanie:** Plugin esbuild, który przechwytuje wszystkie `.css` i zwraca pusty moduł.

**Kontrola CI:** Skrypt, który buduje paczkę `@fragment_ui/ui` i grepuje output pod `import ".css"` — pipeline fail, jeśli znajdzie.

---

## 4. Runtime podglądu (same-origin iframe)

- `runtime/iframe.html`: własny dokument z `<link>` do CSS i importmap.
- `runtime/worker.ts`: uruchamia esbuild-wasm w web workerze; bundluje per snippet; komunikuje się postMessage.
- Import map mapuje m.in. `@fragment_ui/ui` na `/api/bundle?pkg=@fragment_ui/ui`.
- Atrybut iframe: `sandbox="allow-scripts allow-same-origin"`.

**Uwaga:** Nie używamy Sandpack (cross-origin) ani WebContainers (SAB/COOP/COEP) w MVP — pełna kontrola i brak CORS.

---

## 5. MCP (narzędzia Copilota)

- `registry.list/get` – wgląd w komponenty i propsy.
- `tokens.semantic/css` – lista semantycznych tokenów + CSS.
- `scaffolds.list/create` – gotowe szkielety (auth form, two-column, settings).
- `storybook.stories` (opcjonalnie) – JSON controls/variants dla lepszych decyzji AI.

Każde narzędzie za firewall/em (token), rate-limit (10 req/min), logowanie audytowe.

---

## 6. Generator (UI-DSL → TSX)

**Zasady:**

1. Formularze zawsze budujemy przez `Form + FormField + kontrolki DS`.
2. Walidacja: `zod + react-hook-form` (resolver).
3. Tokeny: wyłącznie przez Tailwind (z mapowaniem na CSS vars); zero hard-coded kolorów.
4. A11y: label, aria-*, focus states zapewnia DS; generator dodaje ID/ariaDescribedBy.
5. Zakaz surowych elementów HTML, jeśli istnieje odpowiednik DS (egzekwowane lintem).

**Przykład skrócony (rejestracja):**

```tsx
import { Form, FormField } from "@fragment_ui/ui/form"
import { Input } from "@fragment_ui/ui/input"
import { PasswordInput } from "@fragment_ui/ui/password-input"
import { Checkbox } from "@fragment_ui/ui/checkbox"
import { Button } from "@fragment_ui/ui/button"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormAuthLayout } from "@/scaffolds/form-auth"

const Schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  accept: z.literal(true, { errorMap: () => ({ message: "Required" }) })
})
type Values = z.infer<typeof Schema>

export default function RegisterPage() {
  const form = useForm<Values>({ resolver: zodResolver(Schema), defaultValues: { accept: false } })
  return (
    <FormAuthLayout title="Create account" description="Fill the fields below to sign up.">
      <Form form={form} onSubmit={form.handleSubmit(console.log)}>
        <FormField name="email" label="Email"><Input type="email" /></FormField>
        <FormField name="password" label="Password"><PasswordInput /></FormField>
        <FormField name="accept" label="I accept Terms"><Checkbox required /></FormField>
        <Button type="submit" variant="primary" className="mt-4">Sign up</Button>
      </Form>
    </FormAuthLayout>
  )
}
```

---

## 7. Interfejs użytkownika (vibe coding)

- Prompt box nad edytorem (PL/EN).
- Komentarze sterujące w kodzie:

```tsx
{/* @agent
   Formularz rejestracji: email, password, checkbox „Akceptuję regulamin”.
   Walidacja: email, min 8 znaków. Użyj scaffold form-auth. Tytuł „Create account”.
*/}
```

- Panel logów: kroki parse → validate → generate → preview → a11y + akcje „Zastosuj diff", „Utwórz story", „Otwórz PR".

---

## 8. Bramka jakości i bezpieczeństwo

### ESLint (custom rules):

- `no-raw-elements` — ban na `<input|button|select|textarea>`.
- `design-system-imports-only` — importy tylko z `@fragment_ui/ui/*`.
- `no-inline-hardcoded-colors` — wymuszaj tokeny/klasy.

### A11y quick check (preview):

- `axe-core` uruchamiane po renderze; krytyczne błędy → blokada „Apply".

### Testy wizualne (CI):

- Auto-rejestracja story dla wygenerowanego widoku.
- Playwright + (Percy/Chromatic) baseline.

### Security:

- Iframe sandbox (bez top-navigation).
- Whitelist importów (import map).
- Brak fetch do niezaufanych originów (lub proxy z whitelistą).

---

## 9. Proces Copilota (flow)

1. Parse prompt → UI-DSL (LLM + reguły; jeśli czegoś brakuje, dopytaj).
2. Validate UI-DSL (schema + reguły DS/props z registry).
3. Generate TSX (scaffold + komponenty DS + walidacja).
4. Preview (iframe render + axe quick).
5. Auto-fix (jeśli lint/a11y wskazuje poprawki).
6. Propozycja diff (git) + opis zmian + link do story.
7. (Opcjonalnie) PR do repo.

---

## 10. Migracja istniejącego Design Systemu (update policy)

### Cel: uodpornić DS na użycie w Playground i w AI.

### 10.1 Usuń importy CSS w ESM

Z `packages/ui/src/**` wyciąć `import ".../*.css"`.

Jeżeli komponent wymaga stylu vendor (np. react-day-picker) — przenieść do sidecar CSS (CDN lub `/api/bundle-css`).

### 10.2 Dodaj styles/ui.css i styles/vendor/*.css

- `tokens.css` z buildu DTCG.
- `ui.css` na bazie DS (reset, base, utilities).
- `vendor.css` (np. DayPicker).

### 10.3 Włącz external: ["**/*.css"] w /api/bundle

**Uwaga:** Esbuild nie obsługuje `**/*.css` w `external` - użyj pluginu!

```typescript
{
  name: "remove-css-imports",
  setup(build) {
    build.onResolve({ filter: /\.css$/ }, () => {
      return { path: "", namespace: "css-stub" };
    });
    build.onLoad({ filter: /.*/, namespace: "css-stub" }, () => ({
      contents: "",
      loader: "js"
    }));
  }
}
```

Zero CSS trafia do finalnego ESM.

### 10.4 Weryfikacja CI

Skrypt `no-css-imports`: grep build artefaktów i fail, jeśli znajdzie `.css` import.

### 10.5 Storybook → stories.json (opcjonalnie)

Eksport kontrolowanych props/variants jako „pamięć" dla AI.

### 10.6 Semver + deprecations

Każdy breaking change w DS → changelog + auto-codemod (jeśli możliwe).

Playground pokazuje „migrację" na panelu (np. rename prop).

---

## 11. Checklisty wdrożeniowe

### A. MVP (1 tydzień):

- [ ] `registry.json` + walidator.
- [ ] `tokens.json` → `tokens.css`.
- [ ] `/api/bundle` (ESM, external CSS - plugin).
- [ ] `/api/bundle-css` (tokens/ui/vendor).
- [ ] `iframe.html` z `<link>` do stylów.
- [ ] UI-DSL schema + generator (form, two-column, tabs, table-basic).
- [ ] ESLint rules (ban raw elements, import guards).
- [ ] axe quick check w preview.

### B. v1 (drugi tydzień):

- [ ] MCP: registry/tokens/scaffolds (+ opcjonalny storybook).
- [ ] Auto-story eksport i minimalna wizualna regresja (CI).
- [ ] Panel logów i diff (git).
- [ ] Zestaw promptów użytkownika (30+).

---

## 12. Telemetria i metryki sukcesu

- **TTFUI** (time-to-first-UI): < 5 s od promptu do podglądu.
- **First-pass acceptance**: > 60% wygenerowanych widoków akceptowanych bez zmian.
- **A11y violations**: 0 krytycznych w preview.
- **Adoption**: ≥ 50 wygenerowanych widoków/miesiąc.
- **Coverage**: ≥ 80% core komponentów użytych co najmniej 1× w wygenerowanych widokach.

Loguj (eventy): prompt → dsl → tsx → preview → a11y → accept/decline; błąd (kategoria, stack).

---

## 13. Prompty referencyjne (dla Copilota)

1. "Formularz rejestracji: email, password, checkbox 'Akceptuję regulamin'. Walidacja: email + min 8 znaków. Scaffold: form-auth. Tytuł: Create account."

2. "Ustawienia profilu w zakładkach: Profile / Security / Notifications. W Security formularz zmiany hasła (stare/nowe/powtórz) z walidacją i przyciskiem Update password."

3. "Tabela użytkowników: kolumny Name/Email/Role/CreatedAt, wyszukiwarka, filtr roli (Admin/Editor/Viewer), paginacja po 10."

4. "Dashboard: dwa kafle metryk (Users today, Revenue), wykres liniowy sprzedaży (placeholder), tabela ostatnich zamówień."

---

## 14. FAQ (najczęstsze problemy)

**Q: "TypeError: Failed to resolve module specifier '…/style.css'"**

A: Naruszenie polityki CSS — wytnij import ".css" z ESM, dołącz style linkiem w iframe.html lub /api/bundle-css.

**Q: "Brak stylów w podglądzie"**

A: Sprawdź `<link>` w iframe.html i nagłówki /api/bundle-css. Upewnij się, że DS nie importuje CSS z JS.

**Q: "AI używa surowego <input>"**

A: Włącz lint `no-raw-elements`. Copilot poprawi na FormField + Input.

**Q: "Niektóre propsy są źle dobrane"**

A: Dodaj/uzupełnij registry.json i (opcjonalnie) stories.json ze Storybooka (controls).

---

## 15. Roadmapa (po v1)

- Integracja z Figma (Code Connect/Org) — mapowanie warstw do komponentów DS (opcjonalnie).
- "Component indexing" z repo + analityka użycia.
- Asystent migracji (codemody) i PR-bot.
- i18n/RTL mode w UI-DSL + generator.
- Szersza biblioteka scaffoldów (dashboardy, listy, settings, auth flows).

---

## 16. Załączniki (przykładowe pliki)

### apps/demo/app/playground/runtime/iframe.html (skrót):

```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <link rel="stylesheet" href="/api/bundle-css?name=tokens" />
    <link rel="stylesheet" href="/api/bundle-css?name=ui" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/react-day-picker@9/dist/style.css" />
    <script type="importmap">
      {
        "imports": {
          "@fragment_ui/ui": "/api/bundle?pkg=@fragment_ui/ui"
        }
      }
    </script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module">
      // bridge listener - render snippet
      window.addEventListener("message", async (e) => {
        if (e.data?.type === "render") {
          // import('/snippet-entry.js') wygenerowany przez worker
        }
      });
    </script>
  </body>
</html>
```

### apps/demo/app/api/bundle/route.ts (esbuild SSR – idea):

```typescript
import { NextRequest } from "next/server"
import * as esbuild from "esbuild"

export async function GET(req: NextRequest) {
  const pkg = new URL(req.url).searchParams.get("pkg")!
  const result = await esbuild.build({
    entryPoints: [pkg],
    bundle: true,
    format: "esm",
    platform: "browser",
    plugins: [
      {
        name: "remove-css-imports",
        setup(build) {
          build.onResolve({ filter: /\.css$/ }, () => {
            return { path: "", namespace: "css-stub" };
          });
          build.onLoad({ filter: /.*/, namespace: "css-stub" }, () => ({
            contents: "",
            loader: "js"
          }));
        }
      }
    ],
    write: false,
    treeShaking: true,
    jsx: "automatic",
    minify: false
  })
  const code = result.outputFiles[0].text
  return new Response(code, { headers: { "content-type": "application/javascript" } })
}
```

### tooling/lint/eslint-no-raw-elements.js (idea):

```javascript
module.exports = {
  meta: { type: "problem", messages: { raw: "Use DS component instead of raw <{{name}}>." }},
  create(ctx) {
    return {
      JSXOpeningElement(node) {
        const name = node.name.name
        if (["input", "button", "select", "textarea"].includes(name)) {
          ctx.report({ node, messageId: "raw", data: { name } })
        }
      }
    }
  }
}
```

