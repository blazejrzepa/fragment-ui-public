# 📚 Fragment UI - Przegląd Projektów

**Ostatnia aktualizacja:** 2025-01-XX  
**Wersja dokumentacji:** 1.0.0

---

## 🎯 Wprowadzenie

Fragment UI to ekosystem projektów związanych z AI-native design systemem. Składa się z trzech głównych projektów, które współpracują ze sobą, ale mają różne cele i zakresy.

### Projekty w Ekosystemie

1. **`fragment-ui`** - Główny monorepo (private) z pełnym stackiem
2. **`fragment-ui-public`** - Publiczny design system (public repository)
3. **`fragment-ui-generative-copilot`** - Eksperymentalne narzędzie AI (experimental)

---

## 📦 1. fragment-ui (Główny Monorepo)

**Status:** 🔒 Private  
**Lokalizacja:** `/Users/blazejrzepa/Dev/fragment-ui/`  
**GitHub:** Private repository  
**Cel:** Kompletny projekt z Studio, Playground, Copilot, Governance

### Opis

`fragment-ui` to główny monorepo zawierający pełny stack Fragment UI, w tym:
- Publiczny design system (komponenty, tokeny, bloki)
- Studio/Playground - AI-powered UI builder
- Copilot - AI assistant dla generowania UI
- Governance system - zarządzanie komponentami
- Telemetry - analityka i metryki
- Wszystkie narzędzia wspierające

### Struktura

```
fragment-ui/
├── packages/
│   ├── ui/              ✅ Public (v1.0.0)
│   ├── tokens/          ✅ Public (v1.0.0)
│   ├── blocks/          ✅ Public (v1.0.0)
│   ├── mcp-server/      ⚠️ Private (powinien być public)
│   ├── cli/             ❌ Private
│   ├── registry/        ❌ Private
│   ├── utils/           ❌ Private
│   ├── plugin-system/   ❌ Private
│   ├── patches/          ❌ Private
│   ├── studio-core/     ❌ Private (Studio only)
│   ├── ui-dsl/          ❌ Private (Studio only)
│   ├── telemetry/       ❌ Private (Internal only)
│   └── ...
├── apps/
│   ├── www/             📄 Documentation site
│   └── demo/            🎨 Studio/Playground
└── examples/
```

### Kluczowe Funkcje

- ✅ **Design System** - Komponenty, tokeny, bloki
- ✅ **Studio** - Wizualny edytor UI z AI
- ✅ **Playground** - Testowanie komponentów
- ✅ **Copilot** - AI assistant (UI-DSL based)
- ✅ **Governance** - Workflow zarządzania komponentami
- ✅ **Telemetry** - Analityka i ROI metrics
- ✅ **MCP Server** - Integracja z LLM agents

### Publiczne Pakiety

| Pakiet | Wersja | Status |
|--------|--------|--------|
| `@fragment_ui/ui` | 1.0.0 | ✅ Public |
| `@fragment_ui/tokens` | 1.0.0 | ✅ Public |
| `@fragment_ui/blocks` | 1.0.0 | ✅ Public |
| `@fragment_ui/mcp-server` | 0.1.0 | ⚠️ Private (powinien być public) |

### Relacje

- **Źródło** dla `fragment-ui-public` (synchronizacja public packages)
- **Development environment** dla wszystkich funkcji
- **Testing ground** dla nowych feature'ów

---

## 🌐 2. fragment-ui-public (Public Repository)

**Status:** 🌍 Public  
**Lokalizacja:** `/Users/blazejrzepa/Dev/fragment-ui-public/`  
**GitHub:** `github.com/blazejrzepa/fragment-ui-public`  
**Website:** `fragmentui.com`  
**Cel:** Czysty publiczny design system bez Studio/Copilot

### Opis

`fragment-ui-public` to publiczny repository zawierający tylko publiczne części Fragment UI:
- Design system packages (ui, tokens, blocks)
- MCP Server dla integracji AI
- Documentation website
- Przykłady użycia
- Figma integration

**Kluczowa różnica:** Brak Studio, Playground, telemetry, i innych private/experimental features.

### Struktura

```
fragment-ui-public/
├── packages/
│   ├── ui/              ✅ Public (v1.0.1) - Published to npm
│   ├── tokens/          ✅ Public (v1.0.1) - Published to npm
│   ├── blocks/          ✅ Public (v1.0.1) - Published to npm
│   ├── mcp-server/      ✅ Public (v0.1.0) - Published to npm ⭐
│   ├── cli/             ❌ Private (internal tool)
│   ├── registry/        ❌ Private (internal)
│   ├── utils/           ❌ Private (internal)
│   ├── plugin-system/   ❌ Private (internal)
│   └── patches/          ❌ Private (internal)
├── apps/
│   └── www/             📄 Documentation (bez telemetry)
└── examples/
```

### Kluczowe Funkcje

- ✅ **Design System** - Komponenty, tokeny, bloki (published to npm)
- ✅ **MCP Server** - AI integration via Model Context Protocol
- ✅ **Documentation** - Kompletna dokumentacja publiczna
- ✅ **Examples** - Przykłady użycia
- ✅ **Figma Integration** - Code Connect configs
- ❌ **Studio** - Nie zawiera (private)
- ❌ **Telemetry** - Nie zawiera (private)

### Publiczne Pakiety (Published)

| Pakiet | Wersja | npm | Status |
|--------|--------|-----|--------|
| `@fragment_ui/ui` | 1.0.1 | ✅ | Published |
| `@fragment_ui/tokens` | 1.0.1 | ✅ | Published |
| `@fragment_ui/blocks` | 1.0.1 | ✅ | Published |
| `@fragment_ui/mcp-server` | 0.1.0 | ✅ | Published |

### Relacje

- **Synchronizowany z** `fragment-ui` (public packages)
- **Używany przez** `fragment-ui-generative-copilot` (via npm)
- **Źródło** dla publicznych użytkowników

### Synchronizacja

Zmiany z `fragment-ui` są synchronizowane do `fragment-ui-public`:
- Public packages (ui, tokens, blocks, mcp-server)
- Documentation updates
- Examples
- Font rendering optimizations
- Bug fixes

Zobacz: [`SYNC_PLAN.md`](./SYNC_PLAN.md) dla szczegółów synchronizacji.

---

## 🤖 3. fragment-ui-generative-copilot (Experimental)

**Status:** 🧪 Experimental  
**Lokalizacja:** `/Users/blazejrzepa/Dev/fragment-ui-generative-copilot/`  
**GitHub:** Private repository  
**Cel:** Alternatywne podejście do UI generation używając Vercel AI SDK

### Opis

`fragment-ui-generative-copilot` to eksperymentalny projekt testujący alternatywne podejście do generowania UI:
- Używa **Vercel AI SDK** `streamUI` zamiast UI-DSL
- Streaming generation (incremental UI)
- Real-time preview
- Conversational editing

**Kluczowa różnica:** Nie używa UI-DSL, zamiast tego bezpośrednio generuje React components przez streamUI.

### Architektura

```
Prompt → streamUI → React Components (streaming) → Live Preview
```

**vs Current Copilot (fragment-ui):**
```
Prompt → UI-DSL → TSX Code → React Live Renderer → Preview (batch)
```

### Struktura

```
fragment-ui-generative-copilot/
├── app/
│   ├── api/generate/    # AI SDK streamUI endpoint
│   ├── layout.tsx
│   └── page.tsx
├── src/
│   ├── components/
│   │   ├── copilot-chat.tsx
│   │   └── streaming-preview.tsx
│   ├── lib/
│   │   ├── ai-config.ts
│   │   └── fragment-registry.ts
│   └── types/
└── package.json
```

### Kluczowe Funkcje

- ✅ **Streaming UI Generation** - Incremental component generation
- ✅ **Real-time Preview** - Live preview podczas generowania
- ✅ **Conversational Editing** - Edycja przez rozmowę
- ✅ **Code Export** - Eksport wygenerowanego kodu
- ✅ **Multiple AI Providers** - OpenAI, Anthropic support

### Dependencies

- `@fragment_ui/ui` (v1.0.1) - z npm
- `@fragment_ui/tokens` (v1.0.1) - z npm
- `@fragment_ui/blocks` (v1.0.1) - z npm
- `@ai-sdk/anthropic`, `@ai-sdk/openai`, `@ai-sdk/react`
- `ai` (Vercel AI SDK)

### Relacje

- **Używa** `fragment-ui-public` packages (via npm)
- **Niezależny** od `fragment-ui` monorepo
- **Eksperymentalny** - nie jest częścią głównego projektu

### Status

- ✅ Standalone project
- ✅ Uses public packages from npm
- 🧪 Experimental approach
- 📋 Not integrated with main project
- 📋 May be integrated in future or kept as alternative

---

## 🔗 Relacje Między Projektami

### Dependency Flow

```
fragment-ui (Private/Full)
    │
    ├──→ fragment-ui-public (Public/Design System Only)
    │       │
    │       └──→ Published to npm
    │               │
    │               └──→ fragment-ui-generative-copilot (Używa z npm)
    │
    └──→ fragment-ui-generative-copilot (Może używać z workspace lub npm)
```

### Synchronizacja

1. **fragment-ui → fragment-ui-public**
   - Public packages (ui, tokens, blocks, mcp-server)
   - Documentation updates
   - Examples
   - Bug fixes

2. **fragment-ui-public → npm**
   - Published packages dostępne dla wszystkich
   - Version management przez changesets

3. **npm → fragment-ui-generative-copilot**
   - Używa public packages z npm
   - Nie wymaga workspace dependencies

### Workflow Development

```
1. Development w fragment-ui
   ↓
2. Testing i refinement
   ↓
3. Sync do fragment-ui-public
   ↓
4. Publish to npm (jeśli nowe wersje)
   ↓
5. fragment-ui-generative-copilot używa z npm
```

---

## 📊 Porównanie Projektów

### Pakiety Public vs Private

| Pakiet | fragment-ui | fragment-ui-public | fragment-ui-generative-copilot |
|--------|-------------|-------------------|-------------------------------|
| `@fragment_ui/ui` | ✅ Public (v1.0.0) | ✅ Public (v1.0.1) | ✅ Używa z npm (v1.0.1) |
| `@fragment_ui/tokens` | ✅ Public (v1.0.0) | ✅ Public (v1.0.1) | ✅ Używa z npm (v1.0.1) |
| `@fragment_ui/blocks` | ✅ Public (v1.0.0) | ✅ Public (v1.0.1) | ✅ Używa z npm (v1.0.1) |
| `@fragment_ui/mcp-server` | ⚠️ Private | ✅ Public (v0.1.0) | ❌ Nie używa |
| `@fragment_ui/studio-core` | ❌ Private | ❌ Brak | ❌ Nie używa |
| `@fragment_ui/ui-dsl` | ❌ Private | ❌ Brak | ❌ Nie używa |
| `@fragment_ui/telemetry` | ❌ Private | ❌ Brak | ❌ Nie używa |

### Apps

| App | fragment-ui | fragment-ui-public | fragment-ui-generative-copilot |
|-----|-------------|-------------------|-------------------------------|
| `apps/www` | ✅ (z telemetry) | ✅ (bez telemetry) | ❌ |
| `apps/demo` | ✅ Studio/Playground | ❌ | ❌ |
| Main App | ❌ | ❌ | ✅ Copilot UI |

### Features

| Feature | fragment-ui | fragment-ui-public | fragment-ui-generative-copilot |
|---------|-------------|-------------------|-------------------------------|
| Design System | ✅ | ✅ | ✅ (via npm) |
| Studio | ✅ | ❌ | ❌ |
| Playground | ✅ | ❌ | ❌ |
| Copilot (UI-DSL) | ✅ | ❌ | ❌ |
| Copilot (streamUI) | ❌ | ❌ | ✅ |
| MCP Server | ⚠️ Private | ✅ Public | ❌ |
| Telemetry | ✅ | ❌ | ❌ |
| Governance | ✅ | ❌ | ❌ |
| Documentation | ✅ | ✅ | ❌ |

---

## 🎯 Kiedy Używać Którego Projektu?

### Użyj `fragment-ui` gdy:

- ✅ Rozwijasz nowe funkcje Fragment UI
- ✅ Pracujesz nad Studio/Playground
- ✅ Potrzebujesz pełnego stacku z telemetry
- ✅ Testujesz nowe podejścia (Copilot, Governance)
- ✅ Jesteś członkiem core team

### Użyj `fragment-ui-public` gdy:

- ✅ Chcesz używać Fragment UI w swoim projekcie
- ✅ Potrzebujesz tylko design system (komponenty, tokeny, bloki)
- ✅ Chcesz integrować MCP Server z LLM agents
- ✅ Szukasz publicznej dokumentacji
- ✅ Chcesz contribute do publicznego design system

### Użyj `fragment-ui-generative-copilot` gdy:

- ✅ Eksperymentujesz z alternatywnym podejściem do UI generation
- ✅ Chcesz przetestować streamUI vs UI-DSL
- ✅ Potrzebujesz standalone copilot solution
- ✅ Chcesz zobaczyć jak używać Fragment UI z Vercel AI SDK

---

## 📚 Dokumentacja

### Główne Dokumenty

- **Ten dokument** - Przegląd wszystkich projektów
- [`SYNC_PLAN.md`](./SYNC_PLAN.md) - Plan synchronizacji fragment-ui → fragment-ui-public
- [`PUBLIC_SCOPE.md`](./PUBLIC_SCOPE.md) - Co jest public vs private
- [`PROJECTS_ANALYSIS.md`](./PROJECTS_ANALYSIS.md) - Szczegółowa analiza projektów
- [`CHANGELOG.md`](./CHANGELOG.md) - Historia zmian
- [`ROADMAP.md`](./ROADMAP.md) - Plan rozwoju

### Dokumentacja Projektów

- **fragment-ui**: Zobacz `docs/` w głównym repo
- **fragment-ui-public**: Zobacz `apps/www` (documentation site)
- **fragment-ui-generative-copilot**: Zobacz README w projekcie

---

## 🔄 Synchronizacja i Maintenance

### Regularne Zadania

1. **Synchronizacja fragment-ui → fragment-ui-public**
   - Public packages updates
   - Documentation updates
   - Bug fixes
   - Font rendering optimizations

2. **Version Management**
   - Użyj changesets dla versioning
   - Publish new versions to npm
   - Update changelog

3. **Testing**
   - Test build w fragment-ui-public
   - Verify npm packages
   - Test fragment-ui-generative-copilot z nowymi wersjami

### Automatyzacja

- GitHub Actions dla synchronizacji (future)
- Automated testing
- Automated publishing (via changesets)

---

## 🚀 Quick Start

### fragment-ui (Development)

```bash
cd fragment-ui
pnpm install
pnpm dev:www      # Documentation
pnpm dev:demo     # Studio/Playground
```

### fragment-ui-public (Public Use)

```bash
# Install packages
npm install @fragment_ui/ui @fragment_ui/tokens @fragment_ui/blocks

# Or use in your project
pnpm add @fragment_ui/ui @fragment_ui/tokens @fragment_ui/blocks
```

### fragment-ui-generative-copilot (Experimental)

```bash
cd fragment-ui-generative-copilot
pnpm install
pnpm dev
```

---

## 📞 Kontakt i Support

- **Website:** https://fragmentui.com
- **GitHub:** https://github.com/blazejrzepa/fragment-ui-public
- **Issues:** GitHub Issues w odpowiednim repo
- **Documentation:** https://fragmentui.com/docs

---

## 📝 Licencja

Wszystkie projekty używają **MIT License**.

---

**Ostatnia aktualizacja:** 2025-01-XX  
**Wersja dokumentacji:** 1.0.0

