# 📊 Analiza Wszystkich Projektów Fragment UI

**Data:** 2025-01-XX  
**Projekty:** `fragment-ui`, `fragment-ui-public`, `fragment-ui-generative-copilot`

---

## 🎯 Przegląd Projektów

### 1. **fragment-ui** (Główny / Private)
**Lokalizacja:** `/Users/blazejrzepa/Dev/fragment-ui/`  
**Status:** Private monorepo z pełnym stackiem  
**Cel:** Kompletny projekt z Studio, Playground, Copilot, Governance

**Zawiera:**
- ✅ **Public Design System:** `@fragment_ui/ui`, `@fragment_ui/tokens`, `@fragment_ui/blocks`
- ✅ **Studio/Playground:** `apps/demo` - AI UI builder, submissions workflow
- ✅ **MCP Server:** `packages/mcp-server` (private: true)
- ✅ **Internal Tooling:** telemetry, studio-core, ui-dsl, patches, plugin-system, scaffolds
- ✅ **Documentation:** `apps/www` (z telemetry dependencies - wymaga cleanup)
- ✅ **Examples:** `examples/documentation-site`

**Pakiety:**
- **Public:** `ui`, `tokens`, `blocks` (publishConfig: public)
- **Private:** `mcp-server`, `cli`, `registry`, `utils`, `plugin-system`, `patches`, `studio-core`, `ui-dsl`, `telemetry`, `scaffolds`, `blocks-recipes`, `ui-native`, `vscode-extension`

**Problemy:**
- ⚠️ `apps/www` używa `@fragment_ui/telemetry` (private package)
- ⚠️ `mcp-server` ma `private: true` (powinien być public)

---

### 2. **fragment-ui-public** (Public Repository)
**Lokalizacja:** `/Users/blazejrzepa/Dev/fragment-ui-public/`  
**Status:** Public repository na GitHub  
**Cel:** Czysty publiczny design system bez Studio/Copilot

**Zawiera:**
- ✅ **Public Design System:** `@fragment_ui/ui` (v1.0.1), `@fragment_ui/tokens` (v1.0.1), `@fragment_ui/blocks` (v1.0.1)
- ✅ **MCP Server:** `@fragment_ui/mcp-server` (v0.1.0, **public** - `private: false`, `publishConfig: public`)
- ✅ **Documentation:** `apps/www` (**bez telemetry** - cleanup wykonany ✅)
- ✅ **Supporting Packages:** `cli`, `registry`, `utils`, `plugin-system`, `patches` (wszystkie `private: true`)
- ✅ **Examples:** `examples/` directory
- ✅ **Figma Integration:** `figma-code-connect/`

**Pakiety:**
- **Public:** `ui`, `tokens`, `blocks`, `mcp-server` (wszystkie z `publishConfig: public`)
- **Private:** `cli`, `registry`, `utils`, `plugin-system`, `patches`

**Status:**
- ✅ Telemetry cleanup wykonany (brak zależności w `apps/www`)
- ✅ MCP Server jest publiczny
- ✅ Wszystkie public packages mają proper config
- ✅ README jasno określa co jest public vs private

**Repository Info:**
- GitHub: `github.com/blazejrzepa/fragment-ui-public`
- Website: `fragmentui.com`
- Packages published to npm

---

### 3. **fragment-ui-generative-copilot** (Experimental)
**Lokalizacja:** `/Users/blazejrzepa/Dev/fragment-ui-generative-copilot/`  
**Status:** Private experimental project  
**Cel:** Alternatywne podejście do UI generation używając Vercel AI SDK `streamUI`

**Zawiera:**
- ✅ **Next.js App:** AI-powered UI generation tool
- ✅ **AI SDK Integration:** Vercel AI SDK z `streamUI` feature
- ✅ **Fragment UI Dependencies:** `@fragment_ui/ui`, `@fragment_ui/tokens`, `@fragment_ui/blocks` (v1.0.1 z npm)
- ✅ **Streaming UI Generation:** Real-time component generation
- ✅ **Fragment Registry:** Component registry dla AI prompts

**Architektura:**
```
Prompt → streamUI → React Components (streaming) → Live Preview
```

**vs Current Copilot:**
```
Prompt → UI-DSL → TSX Code → React Live Renderer → Preview (batch)
```

**Features:**
- Streaming UI generation (incremental)
- Real-time preview
- Conversational editing
- Code export
- Multiple AI providers (OpenAI, Anthropic)

**Dependencies:**
- `@ai-sdk/anthropic`, `@ai-sdk/openai`, `@ai-sdk/react`, `@ai-sdk/rsc`
- `ai` (Vercel AI SDK)
- `@fragment_ui/ui`, `@fragment_ui/tokens`, `@fragment_ui/blocks` (z npm)

**Status:**
- ✅ Działa jako standalone project
- ✅ Używa public packages z npm
- ✅ Nie wymaga fragment-ui monorepo
- 📋 Experimental - nie jest częścią głównego projektu

---

## 📊 Porównanie Projektów

### Pakiety Public vs Private

| Pakiet | fragment-ui | fragment-ui-public | Status |
|--------|-------------|-------------------|--------|
| `@fragment_ui/ui` | ✅ Public (v1.0.0) | ✅ Public (v1.0.1) | ✅ Published |
| `@fragment_ui/tokens` | ✅ Public (v1.0.0) | ✅ Public (v1.0.1) | ✅ Published |
| `@fragment_ui/blocks` | ✅ Public (v1.0.0) | ✅ Public (v1.0.1) | ✅ Published |
| `@fragment_ui/mcp-server` | ❌ Private | ✅ **Public** (v0.1.0) | ✅ Published |
| `@fragment_ui/cli` | ❌ Private | ❌ Private | Internal tool |
| `@fragment_ui/registry` | ❌ Private | ❌ Private | Internal |
| `@fragment_ui/utils` | ❌ Private | ❌ Private | Internal |
| `@fragment_ui/plugin-system` | ❌ Private | ❌ Private | Internal |
| `@fragment_ui/patches` | ❌ Private | ❌ Private | Internal |
| `@fragment_ui/studio-core` | ❌ Private | ❌ Brak | Studio only |
| `@fragment_ui/ui-dsl` | ❌ Private | ❌ Brak | Studio only |
| `@fragment_ui/telemetry` | ❌ Private | ❌ Brak | Internal only |

### Apps

| App | fragment-ui | fragment-ui-public | fragment-ui-generative-copilot |
|-----|-------------|-------------------|-------------------------------|
| `apps/www` | ✅ (z telemetry) | ✅ (bez telemetry) | ❌ |
| `apps/demo` | ✅ Studio/Playground | ❌ | ❌ |
| Main App | ❌ | ❌ | ✅ Copilot UI |

### Cleanup Status

| Item | fragment-ui | fragment-ui-public |
|------|-------------|-------------------|
| Telemetry w `apps/www` | ❌ **Wymaga cleanup** | ✅ **Cleanup wykonany** |
| MCP Server public | ❌ Private | ✅ Public |
| Studio dependencies | ✅ Present | ❌ Removed |
| Public packages config | ✅ OK | ✅ OK |

---

## 🔍 Szczegółowa Analiza

### fragment-ui (Main/Private)

**Struktura:**
```
fragment-ui/
├── packages/
│   ├── ui/              ✅ Public
│   ├── tokens/          ✅ Public
│   ├── blocks/          ✅ Public
│   ├── mcp-server/      ❌ Private (powinien być public)
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
│   ├── www/             ⚠️ Z telemetry dependencies
│   └── demo/            ✅ Studio/Playground
└── examples/
```

**Problemy:**
1. ⚠️ `apps/www` używa `@fragment_ui/telemetry`:
   - `package.json`: dependency
   - `next.config.mjs`: aliases
   - `src/lib/telemetry.ts`: imports
   - API routes: `/api/roi/*`, `/api/github/webhook`

2. ⚠️ `mcp-server` ma `private: true` (powinien być public jak w fragment-ui-public)

**Co działa:**
- ✅ Public packages mają proper config
- ✅ Studio/Playground działa
- ✅ Copilot workflow działa
- ✅ Governance system działa

---

### fragment-ui-public (Public Repo)

**Struktura:**
```
fragment-ui-public/
├── packages/
│   ├── ui/              ✅ Public (v1.0.1)
│   ├── tokens/          ✅ Public (v1.0.1)
│   ├── blocks/          ✅ Public (v1.0.1)
│   ├── mcp-server/      ✅ **Public** (v0.1.0) ⭐
│   ├── cli/             ❌ Private
│   ├── registry/        ❌ Private
│   ├── utils/           ❌ Private
│   ├── plugin-system/   ❌ Private
│   └── patches/         ❌ Private
├── apps/
│   └── www/             ✅ Bez telemetry ✅
└── examples/
```

**Co zostało zrobione:**
- ✅ Telemetry cleanup wykonany (brak zależności)
- ✅ MCP Server jest publiczny
- ✅ Wszystkie public packages mają proper config
- ✅ README jasno określa scope
- ✅ Packages published to npm

**Różnice vs fragment-ui:**
- ❌ Brak `apps/demo` (Studio/Playground)
- ❌ Brak `studio-core`, `ui-dsl`, `telemetry`
- ✅ `mcp-server` jest publiczny
- ✅ `apps/www` bez telemetry

---

### fragment-ui-generative-copilot (Experimental)

**Struktura:**
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

**Architektura:**
- Używa **Vercel AI SDK** `streamUI` zamiast UI-DSL
- Streaming generation (incremental UI)
- Real-time preview
- Conversational editing

**Dependencies:**
- Fragment UI packages z **npm** (nie workspace)
- AI SDK packages
- Next.js 16

**Status:**
- ✅ Standalone project
- ✅ Nie wymaga fragment-ui monorepo
- 📋 Experimental approach
- 📋 Nie jest częścią głównego projektu

---

## 🎯 Rekomendacje

### 1. Synchronizacja fragment-ui → fragment-ui-public

**Co zsynchronizować:**
- ✅ Public packages (`ui`, `tokens`, `blocks`) - wersje
- ✅ `mcp-server` - zmienić na public w fragment-ui
- ✅ `apps/www` - cleanup telemetry w fragment-ui
- ✅ Documentation updates

**Jak synchronizować:**
- Używać changesets dla versioning
- Automatyczny sync workflow (GitHub Actions)
- Manual sync dla większych zmian

### 2. fragment-ui (Main) - Cleanup Required

**Priorytet 1: Telemetry Cleanup w `apps/www`**
```bash
# Usunąć z package.json
"@fragment_ui/telemetry": "workspace:*"

# Usunąć z next.config.mjs
- Aliases dla telemetry
- Webpack config dla telemetry

# Usunąć pliki:
- src/lib/telemetry.ts
- app/api/roi/* (3 pliki)
- app/api/github/webhook/route.ts
```

**Priorytet 2: MCP Server - Make Public**
```json
// packages/mcp-server/package.json
{
  "private": false,  // zmienić z true
  "publishConfig": {
    "access": "public"
  }
}
```

### 3. fragment-ui-public - Maintenance

**Regularne aktualizacje:**
- Sync public packages z fragment-ui
- Update documentation
- Publish new versions via changesets
- Monitor npm downloads/usage

### 4. fragment-ui-generative-copilot - Integration Decision

**Opcje:**
1. **Keep Separate** - Experimental project, nie integrować
2. **Integrate to fragment-ui** - Dodać jako alternatywny Copilot approach
3. **Document as Alternative** - Dodać do dokumentacji jako comparison

**Rekomendacja:** Keep separate jako experimental, ale dodać dokumentację porównującą oba podejścia.

---

## 📋 Checklist Synchronizacji

### fragment-ui → fragment-ui-public

- [ ] Sync `packages/ui` (version, code)
- [ ] Sync `packages/tokens` (version, code)
- [ ] Sync `packages/blocks` (version, code)
- [ ] Sync `packages/mcp-server` (version, code)
- [ ] Sync `apps/www` (bez telemetry)
- [ ] Sync `examples/`
- [ ] Sync `docs/` (public docs only)
- [ ] Sync `figma-code-connect/`
- [ ] Update root `README.md`
- [ ] Update `CHANGELOG.md`
- [ ] Run tests
- [ ] Build all packages
- [ ] Publish to npm (jeśli nowe wersje)

### fragment-ui (Cleanup)

- [ ] Remove telemetry z `apps/www/package.json`
- [ ] Remove telemetry aliases z `apps/www/next.config.mjs`
- [ ] Remove `apps/www/src/lib/telemetry.ts`
- [ ] Remove `apps/www/app/api/roi/*`
- [ ] Remove `apps/www/app/api/github/webhook/route.ts`
- [ ] Make `mcp-server` public
- [ ] Update `PUBLIC_SCOPE.md` status

---

## 🔗 Relacje Między Projektami

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

**Dependency Flow:**
1. `fragment-ui` → development, testing, Studio
2. `fragment-ui-public` → public release, npm packages
3. `fragment-ui-generative-copilot` → używa packages z npm (lub workspace)

---

## 📈 Status Summary

### fragment-ui
- ✅ Core functionality działa
- ⚠️ Wymaga cleanup (telemetry, mcp-server)
- ✅ Studio/Playground działa
- ✅ Copilot działa

### fragment-ui-public
- ✅ Clean public repo
- ✅ Telemetry cleanup wykonany
- ✅ MCP Server public
- ✅ Packages published
- ✅ Ready for public use

### fragment-ui-generative-copilot
- ✅ Standalone project
- ✅ Uses public packages
- ✅ Experimental approach
- 📋 Not integrated with main project

---

## 🎯 Następne Kroki

1. **fragment-ui cleanup:**
   - Remove telemetry z `apps/www`
   - Make `mcp-server` public
   - Update `PUBLIC_SCOPE.md`

2. **Synchronizacja:**
   - Sync public packages do fragment-ui-public
   - Update versions
   - Publish if needed

3. **Dokumentacja:**
   - Update README w fragment-ui-public
   - Document relationship between projects
   - Add comparison guide (UI-DSL vs streamUI)

4. **fragment-ui-generative-copilot:**
   - Decide on integration approach
   - Document as alternative or integrate

---

**Ostatnia aktualizacja:** 2025-01-XX

