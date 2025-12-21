# 📊 Czysty Markdown vs MDX - Analiza

**Data:** 2025-01-05  
**Pytanie:** Czy nie byłoby prościej używać czystego Markdown zamiast MDX?

---

## 🤔 Obecna Sytuacja (MDX)

**Plik:** `page.mdx`
```mdx
import { DocLayout, StyledIntro, StyledText } from "...";

export default function Page() {
  return (
    <DocLayout>
      <h1>Title</h1>
      <StyledIntro>Text</StyledIntro>
      ## Section
      Content...
    </DocLayout>
  );
}
```

**Problemy:**
- ❌ Wymaga importów i wrappera React
- ❌ Mieszanka JSX i Markdown
- ❌ Trzeba znać React składnię
- ❌ Nie jest "czysty" Markdown

---

## ✅ Opcja: Czysty Markdown

### Jak to mogłoby wyglądać:

**Plik:** `content.md` (czysty markdown)
```markdown
# Introduction

Welcome to Fragment UI...

## What is Fragment UI?

Fragment UI is a design system...

## Key Features

- Feature 1
- Feature 2
```

**Wrapper:** `page.tsx` (automatyczny)
```tsx
import { readFileSync } from 'fs';
import { remark } from 'remark';
import remarkHtml from 'remark-html';
import { DocLayout } from '@/components/doc-layout';

export default async function Page() {
  const content = readFileSync('./content.md', 'utf-8');
  const html = await remark().use(remarkHtml).process(content);
  
  return (
    <DocLayout>
      <div dangerouslySetInnerHTML={{ __html: html.toString() }} />
    </DocLayout>
  );
}
```

---

## 📊 Porównanie

| Aspekt | MDX (obecnie) | Czysty Markdown |
|--------|---------------|-----------------|
| **Edycja w GitHub** | ⚠️ Wymaga znajomości React | ✅ 100% Markdown |
| **Składnia** | Mieszanka JSX + MD | ✅ Tylko Markdown |
| **Komponenty React** | ✅ Bezpośrednio w pliku | ❌ Tylko w wrapperze |
| **Stylowanie** | ✅ Inline styles, komponenty | ⚠️ Tylko CSS/classes |
| **Prostota** | ⚠️ Średnia | ✅ Wysoka |
| **Funkcjonalność** | ✅ Pełna | ⚠️ Ograniczona |

---

## 🎯 Rekomendacja: **Hybrid Approach**

### Najlepsze rozwiązanie: **Czysty Markdown + Frontmatter**

**Struktura:**
```
apps/www/app/docs/get-started/introduction/
  ├── page.tsx          # Wrapper (automatyczny, nie edytowany)
  └── content.md        # Czysty Markdown (edytowany w GitHub)
```

**content.md:**
```markdown
---
title: Introduction
---

# Introduction

Welcome to Fragment UI...

## What is Fragment UI?

Fragment UI is a design system...
```

**page.tsx (generowany automatycznie):**
```tsx
import { readMarkdown } from '@/lib/markdown';
import { DocLayout } from '@/components/doc-layout';

export default async function Page() {
  const { content, frontmatter } = await readMarkdown(
    './content.md'
  );
  
  return (
    <DocLayout>
      <h1>{frontmatter.title}</h1>
      <div className="prose prose-invert">
        {content}
      </div>
    </DocLayout>
  );
}
```

---

## ✅ Zalety Czystego Markdown

1. **100% Markdown** - zero JSX/React w pliku
2. **Łatwiejsza edycja** - każdy może edytować
3. **GitHub-native** - pełne wsparcie preview
4. **Prostsze** - mniej składni do nauki
5. **Spójność** - wszystkie pliki .md w jednym formacie

---

## ⚠️ Wyzwania

1. **Stylowanie** - trzeba używać CSS classes zamiast inline styles
2. **Komponenty** - nie można używać React komponentów w treści
3. **Interaktywność** - brak możliwości dodania interaktywnych elementów
4. **Wrapper** - trzeba utrzymać page.tsx dla każdej strony

---

## 🚀 Implementacja: Czysty Markdown

### Krok 1: Instalacja bibliotek

```bash
pnpm add remark remark-html remark-frontmatter gray-matter
```

### Krok 2: Utworzenie helpera

```ts
// apps/www/src/lib/markdown.ts
import fs from 'fs';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkHtml from 'remark-html';

export async function readMarkdown(filePath: string) {
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);
  
  const processedContent = await remark()
    .use(remarkHtml)
    .process(content);
  
  return {
    frontmatter: data,
    content: processedContent.toString(),
  };
}
```

### Krok 3: Konwersja strony

**content.md:**
```markdown
---
title: Introduction
introStyle: zinc-300
---

# Introduction

Welcome to Fragment UI, a modern, accessible, and highly customizable component library built for React applications.
Fragment UI provides a comprehensive set of components, design tokens, and tools to help you build beautiful user interfaces quickly.

## What is Fragment UI?

Fragment UI is a design system and component library that combines the best practices of modern web development
with a focus on accessibility, performance, and developer experience. It's built on top of Radix UI primitives
and styled with Tailwind CSS, giving you the flexibility to customize every aspect of your components.

## Key Features

- **Accessible by Default** - All components follow WAI-ARIA guidelines and are keyboard navigable
- **Fully Customizable** - Built with Tailwind CSS and CSS variables for easy theming
- **Type-Safe** - Full TypeScript support with comprehensive type definitions
- **Dark Mode** - Built-in dark mode support with automatic theme switching
- **Design Tokens** - Comprehensive token system for colors, spacing, typography, and more
- **Component Registry** - Easy installation via CLI or manual copy-paste
- **MCP Server** - AI-native workflow integration with Cursor and GitHub Copilot

## Getting Started

To get started with Fragment UI, you'll need to:

1. Set up your project with React and Tailwind CSS
2. Install components using the CLI or manually
3. Configure your theme and design tokens
4. Start building your application

Check out the [Setup Guide](/docs/get-started/setup) for detailed instructions.

## Next Steps

- [Setup Guide](/docs/get-started/setup) - Learn how to install and configure Fragment UI
- [Examples](/docs/examples) - Browse example implementations
- [Design Tokens](/docs/foundations/tokens) - Explore the design token system
- [MCP Server](/docs/get-started/mcp-server) - Set up AI-native workflow integration
```

**page.tsx:**
```tsx
import { readMarkdown } from '@/lib/markdown';
import { DocLayout } from '@/components/doc-layout';
import { EditOnGitHub } from '@/components/edit-on-github';

export default async function Page() {
  const { content, frontmatter } = await readMarkdown(
    './content.md'
  );
  
  return (
    <DocLayout>
      <h1 className="scroll-m-20 text-4xl font-medium tracking-tight sm:text-3xl xl:text-4xl mb-4">
        {frontmatter.title}
      </h1>
      
      <div 
        className="prose prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: content }}
      />
      
      <EditOnGitHub filePath="apps/www/app/docs/get-started/introduction/content.md" />
    </DocLayout>
  );
}
```

---

## 🎯 Finalna Rekomendacja

### **TAK - Czysty Markdown jest prostszy!**

**Dla prostych stron dokumentacji:**
- ✅ Użyj czystego Markdown (`content.md`)
- ✅ Automatyczny wrapper (`page.tsx`)
- ✅ Frontmatter dla metadanych
- ✅ CSS classes dla stylowania

**Dla interaktywnych stron:**
- ⚠️ Zostań przy MDX (komponenty z przykładami)

---

## 📋 Plan Migracji

1. **Utwórz helper do czytania Markdown**
2. **Skonwertuj introduction na content.md + page.tsx**
3. **Dodaj CSS classes dla stylowanych elementów**
4. **Przetestuj i porównaj z MDX**
5. **Zdecyduj czy migrować pozostałe strony**

---

**Odpowiedź:** Tak, czysty Markdown byłby prostszy do edycji! 🎯

