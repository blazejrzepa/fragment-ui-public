# Copilot Spec — Playground AI × Fragment UI

## 1) Cel i zakres

**Cel:** Użytkownik wpisuje naturalny prompt (np. „zrób formularz rejestracji z e-mailem i hasłem”), a Copilot:

- tworzy UI-DSL (kontrakt pośredni),
- kompiluje UI-DSL → kod z komponentów Fragment UI,
- renderuje live preview (same-origin iframe),
- uruchamia bramki jakości (a11y/visual),
- proponuje diff i commit PR.

**Zakres MVP:** Formularze, layouty (auth, settings, 2-column), tabele list, dashboard (karty + wykres placeholder).

**Poza MVP:** złożone grafy, canvas, drag&drop, data viz spoza DS.

---

## 2) Architektura (high level)

```
Client (Next.js App)
 ├─ Prompt UI (TextArea / @agent-comments)
 ├─ Generator (UI-DSL → JSX/TSX)
 ├─ Preview Runtime (iframe same-origin + esbuild-wasm worker)
 ├─ A11y Quick Check (axe-core in preview)
 └─ MCP Client (narzędzia: registry/tokens/scaffolds/storybook)

Server (Next.js API)
 ├─ /api/bundle        → bundluje @fragment_ui/ui (ESM)
 ├─ /api/bundle-css    → zwraca tokens.css / ui.css (prebuilt)
 ├─ /api/generate      → opcjonalny LLM assist do UI-DSL
 └─ Storybook JSON     → export stories props/variants (opcjonalnie)

Design System (repo/pakiet)
 ├─ @fragment_ui/ui       → komponenty (React)
 ├─ @fragment_ui/tokens   → DTCG + build (CSS vars, Tailwind, TS)
 └─ Storybook          → stories + controls (źródło prawdy props)
```

---

## 3) Kontrakty „źródeł prawdy”

### 3.1 design-system/registry.json

Minimalny, maszynowo-czytelny spis komponentów i ich API:

```json
{
  "$schema": "https://acme.dev/schemas/registry.schema.json",
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
    "Select": {
      "import": "@fragment_ui/ui/select",
      "props": { "options": "string[]", "placeholder?":"string" }
    },
    "Button": {
      "import": "@fragment_ui/ui/button",
      "props": { "variant": ["primary","secondary","ghost"], "type?": ["button","submit"] }
    },
    "Card": { "import": "@fragment_ui/ui/card" },
    "Tabs": { "import": "@fragment_ui/ui/tabs" },
    "TabsList": { "import": "@fragment_ui/ui/tabs" },
    "TabTrigger": { "import": "@fragment_ui/ui/tabs" },
    "TabContent": { "import": "@fragment_ui/ui/tabs" }
  },
  "aliases": {
    "Tab": "TabTrigger",
    "TabsHeader": "TabsList"
  },
  "rules": {
    "forbiddenHtml": ["input", "button", "select", "textarea"],
    "prefer": { "input": "Input", "button": "Button" }
  }
}
```

### 3.2 tokens/tokens.json (DTCG)

Zawiera base (color, space, radius, motion, z-index) i semantic (text/primary, btn/bg/default).

Build do:
- `apps/web/styles/tokens.css` (CSS vars),
- `packages/ui/tailwind.config.ts` (theme),
- `packages/ui/src/tokens.ts` (typy + wartości).

### 3.3 UI-DSL (kontrakt pośredni)

Stabilny JSON, który Copilot generuje z promptu:

```json
{
  "$schema": "https://acme.dev/schemas/ui-dsl.schema.json",
  "type": "form | page | table | dashboard",
  "title": "string",
  "layout": { "maxWidth": "sm|md|lg|xl", "gap": "0..8" },
  "a11y?": { "ariaDescribedBy?": "string" },

  "fields?": [
    { "name": "string", "label": "string", "component": "Input|PasswordInput|Checkbox|Select|Switch|Textarea",
      "options?": ["string"], "validation?": "string", "placeholder?": "string" }
  ],

  "actions?": [
    { "type": "submit|reset|button", "label": "string", "variant": "primary|secondary|ghost" }
  ],

  "tabs?": [
    { "id": "string", "label": "string", "content": "ui-dsl subtree" }
  ],

  "table?": {
    "columns": [{ "key":"string", "label":"string", "type":"text|badge|date|actions" }],
    "dataSource": "placeholder|url|static",
    "filters?": [{ "type":"search|select|dateRange", "key":"string", "options?":["string"] }],
    "pagination?": { "pageSize": 10 }
  }
}
```

---

## 4) MCP – narzędzia dla Copilota

### 4.1 mcp-registry
- `registry.list()` → zwraca registry.json.
- `registry.get(name)` → definicja pojedynczego komponentu + props.

### 4.2 mcp-tokens
- `tokens.semantic()` → lista semantycznych tokenów oraz aliasów.
- `tokens.css()` → zwraca prebuilt tokens.css.

### 4.3 mcp-scaffolds
- `scaffolds.list()` → ["form-auth","two-column","settings-page"].
- `scaffolds.create(name, ui_dsl)` → generuje TSX z odpowiednim layoutem.

### 4.4 (Opcjonalnie) mcp-storybook
- `storybook.stories()` → JSON props/controls/storyIds (lepsze podpowiedzi wariantów).
- `storybook.open(id)` → link do story (debug ręczny).

Każde narzędzie wymaga auth (token) i throttlingu (np. 10 req/min).

---

## 5) Generator (UI-DSL → TSX)

**Wejście:** UI-DSL.

**Wyjście:** plik `page.tsx`/`Component.tsx` + ewentualne `schema.ts`.

**Zasady:**
- Formy zawsze budowane przez `Form + FormField + kontrolki DS`.
- Walidacja: `zod + react-hook-form` (resolver).
- Tokeny: tylko klasy oparte o CSS vars/Tailwind (zero hard-code kolorów).
- Brak surowych HTML elementów, jeśli istnieje odpowiednik DS (lint).
- A11y: `label/aria-*` w oparciu o DSL, focus states default z DS.

**Przykład (form-auth, skrót):**

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

## 6) Runtime podglądu (same-origin)

Iframe same-origin w `/playground/preview`.

W iframie worker z esbuild-wasm bundluje fragmenty + import map:

```html
<script type="importmap">
{ "imports": {
    "@fragment_ui/ui": "/api/bundle?pkg=@fragment_ui/ui",
    "@fragment_ui/tokens.css": "/api/bundle-css"
} }
</script>
```

CSS: na starcie wstrzyknij `tokens.css` i `ui.css` (jeśli istnieje).

Atrybut sandbox: `allow-scripts allow-same-origin`.

Komunikacja: `postMessage({ type: "render", files })` → render/ błędy.

---

## 7) Jakość i bezpieczeństwo

### 7.1 Linty (ESLint)
- Rule: ban raw elements – blokuje `<input>`, `<button>`, `<select>`, `<textarea>`.
- Import guard: tylko z przestrzeni `@fragment_ui/ui/*`.
- No style leakage: zakaz inline style z kolorami; dozwolone klasy DS/Tailwind.

### 7.2 A11y gate
- `axe-core` w iframie po renderze → raport ostrzeżeń/błędów.
- Fail „build preview”, jeśli zidentyfikowane błędy krytyczne (role/labels/contrast).

### 7.3 Visual tests (CI)
- Każdy wygenerowany widok rejestrowany jako Story (auto-story).
- Playwright + percy/chromatic do porównania z baseline (migruje się razem z DS).

### 7.4 Security
- Sandbox iframe (bez top-navigation).
- Whitelist importów (import map).
- Odcinanie fetch do niezaufanych originów.

---

## 8) Proces (agent flow)

1. Parse prompt → UI-DSL (LLM lub reguły + LLM w złożonych przypadkach).
2. Validate UI-DSL (schema JSON, reguły biznesowe).
3. Generate TSX (scaffold + komponenty + walidacja).
4. Preview (iframe render + axe quick check).
5. Autofix pass (linter zasugeruje zamianę/kontrast/focus).
6. Propozycja diff (git), opis zmian, changelog.
7. (Opcjonalnie) PR do repo + link do Storybook/preview.

---

## 9) Interfejs użytkownika (vibe coding)

- Prompt Box nad edytorem (pl->en/parafrazy bez zmiany sensu).
- Komentarze sterujące w kodzie:

```tsx
{/* @agent
   Zbuduj formularz rejestracji: email, password, checkbox „Accept Terms”.
   Walidacja: email, min 8 znaków, checkbox required.
   Użyj scaffoldu form-auth; tytuł „Create account”.
*/}
```

- Pane po prawej: Logi: parse → validate → generate → preview → a11y.
- Przyciski: „Zastosuj diff”, „Utwórz Story”, „Otwórz PR”.

---

## 10) API (serwer)

### 10.1 /api/bundle
- GET: `?pkg=@fragment_ui/ui@^1`
- Zwraca: paczkę ESM (pre-bundle) pod import map.

### 10.2 /api/bundle-css
- GET: `?name=tokens | ui`
- Zwraca: sklejony CSS (tokens.css/ui.css) z nagłówkami cache.

### 10.3 /api/generate (opcjonalnie)
- POST: `{ prompt, context }`
- Zwraca: `uiDsl + rationale`.

---

## 11) Struktura repo

```
apps/
  web/
    pages/
    app/
    playground/
      index.tsx          # UI
      runtime/iframe.html
      runtime/worker.ts  # esbuild-wasm, import map, bridge
    styles/
      tokens.css
      ui.css
    docs/COPILOT_SPEC.md

packages/
  ui/                    # @fragment_ui/ui
    src/...
    tailwind.config.ts
    tokens.ts
  tokens/                # DTCG + build scripts
    tokens.json
    build.css.js
    build.tailwind.ts

tooling/
  mcp/
    registry.server.ts
    tokens.server.ts
    scaffolds.server.ts
    storybook.server.ts
  generator/
    from-dsl.ts
    rules.ts

.storybook/
  main.ts
  preview.ts
```

---

## 12) Metryki sukcesu

- **Time-to-first-UI:** < 5 s od promptu do podglądu.
- **First pass acceptance:** > 60% wygenerowanych widoków przyjmowanych bez edycji ręcznej.
- **A11y violations:** 0 błędów krytycznych (axe) w preview.
- **Adoption:** ≥ 50 wygenerowanych widoków / miesiąc w zespole.
- **Coverage:** ≥ 80% core komponentów DS użytych przynajmniej raz w wygenerowanych widokach.

---

## 13) Roadmapa wdrożenia

### Sprint 1 (Tydz. 1)
- registry.json, tokens.json (DTCG), 3 scaffolds: form-auth, two-column, settings.
- Iframe preview + esbuild-wasm + import map.
- /api/bundle, /api/bundle-css.

### Sprint 2 (Tydz. 2)
- UI-DSL schema + walidator.
- Generator (form, tabs, table basic).
- A11y quick check w preview + ESLint rules (ban raw elements).

### Sprint 3 (Tydz. 3)
- Integracja MCP tools.
- Auto-Story export + snapshoty (Playwright + percy/chromatic).
- Pane logów, diff, „Create PR”.

### Sprint 4 (Tydz. 4)
- Usprawnienia: async walidacje (np. username), dynamiczne pola, i18n/RTL mode.
- Telemetria użycia (co generujemy, błędy, TTFUI).

---

## 14) Wytyczne dla modelu (system prompt Copilota – skrót)

- „Zanim wygenerujesz kod, zawsze wygeneruj i pokaż UI-DSL i zweryfikuj go mcp-registry/mcp-tokens.”
- „Nie używaj surowych elementów HTML, jeśli istnieje odpowiednik DS.”
- „Formy buduj z Form + FormField. Walidacja: zod.”
- „Tokeny tylko przez klasy/zmienne DS (Tailwind/CSS vars).”
- „Po wygenerowaniu: uruchom a11y check. Jeśli krytyczne błędy – popraw i wygeneruj ponownie.”
- „Zawsze proponuj minimalny, spójny diff (bez nieużywanych importów).”
- „Dodaj auto-story dla wygenerowanego widoku, jeśli to komponent/strona.”

---

## 15) Przykładowe prompty użytkownika (gotowe)

- „Zrób formularz rejestracji: email, password, checkbox 'Akceptuję regulamin', przycisk 'Utwórz konto'. Walidacja: email + min 8 znaków.”
- „Ustawienia profilu w zakładkach: Profile / Security / Notifications. W Security – zmiana hasła (stare/nowe/powtórz) z walidacją.”
- „Tabela użytkowników: kolumny (Name, Email, Role, CreatedAt), wyszukiwarka, filtr roli (Admin/Editor/Viewer), paginacja 10 na stronę.”

---

## 16) Ryzyka i obejścia

- **Brak stylów** – same-origin iframe + /api/bundle-css (nie Sandpack/cross-origin).
- **Niedokładny prompt** – Copilot dopytuje o brakujące pola (mini Q&A) lub stosuje rozsądne defaulty w UI-DSL.
- **Rozjazd DS** – lint importów i ban surowych elementów.
- **Złożone widoki** – rozbij na sekcje: Copilot generuje tabs/sekcje niezależnie i scala scaffoldem.
