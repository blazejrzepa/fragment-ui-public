# fragment-ui-generative-copilot Documentation

**Status:** 🧪 Experimental  
**Location:** Private experimental repository  
**Purpose:** Alternative approach to UI generation using Vercel AI SDK

---

## Overview

`fragment-ui-generative-copilot` is an experimental project testing an alternative approach to UI generation:
- Uses **Vercel AI SDK** `streamUI` instead of UI-DSL
- Streaming generation (incremental UI)
- Real-time preview
- Conversational editing

**Key Difference:** Does not use UI-DSL, instead directly generates React components via streamUI.

---

## Architecture

```
Prompt → streamUI → React Components (streaming) → Live Preview
```

**vs Current Copilot (fragment-ui):**
```
Prompt → UI-DSL → TSX Code → React Live Renderer → Preview (batch)
```

---

## Structure

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

---

## Features

- ✅ **Streaming UI Generation** - Incremental component generation
- ✅ **Real-time Preview** - Live preview during generation
- ✅ **Conversational Editing** - Edit through conversation
- ✅ **Code Export** - Export generated code
- ✅ **Multiple AI Providers** - OpenAI, Anthropic support

---

## Dependencies

- `@fragment_ui/ui` (v1.0.1) - from npm
- `@fragment_ui/tokens` (v1.0.1) - from npm
- `@fragment_ui/blocks` (v1.0.1) - from npm
- `@ai-sdk/anthropic`, `@ai-sdk/openai`, `@ai-sdk/react`
- `ai` (Vercel AI SDK)

---

## Status

- ✅ Standalone project
- ✅ Uses public packages from npm
- 🧪 Experimental approach
- 📋 Not integrated with main project
- 📋 May be integrated in future or kept as alternative

---

## Comparison: streamUI vs UI-DSL

### streamUI Approach (fragment-ui-generative-copilot)

**Pros:**
- Direct React component generation
- Streaming (incremental updates)
- Simpler architecture
- Uses Vercel AI SDK (well-maintained)

**Cons:**
- Less control over generation
- Harder to validate/transform
- No intermediate representation

### UI-DSL Approach (fragment-ui)

**Pros:**
- Structured intermediate representation
- Easy to validate and transform
- Better control over generation
- Can apply patches/edits

**Cons:**
- More complex architecture
- Batch generation (not streaming)
- Custom DSL maintenance

---

## Future

**Options:**
1. **Keep Separate** - Experimental project, don't integrate
2. **Integrate to fragment-ui** - Add as alternative Copilot approach
3. **Document as Alternative** - Add to documentation as comparison

**Recommendation:** Keep separate as experimental, but add documentation comparing both approaches.

---

## Related Documentation

- **[Projects Overview](../../PROJECTS_OVERVIEW.md)** - Complete ecosystem overview
- **[Studio Copilot Documentation](../studio/copilot/README.md)** - Main Copilot (UI-DSL based)
- **[Roadmap](../../ROADMAP.md)** - Development roadmap

---

**Last Updated:** 2025-01-XX

