# 📝 Markdown Editing for Documentation Pages - Analysis & Proposal

**Date:** 2025-01-05  
**Status:** 🎯 Proposal  
**Related:** Documentation architecture, Developer experience

---

## 🤔 Question

Czy strony takie jak `/docs/get-started/introduction` mogą być edytowane z poziomu GitHub jako markdown? Czy to ma sens w tym projekcie?

---

## 📊 Current State

### Obecna Struktura

**Strony dokumentacji w Next.js:**
- Lokalizacja: `apps/www/app/docs/**/page.tsx`
- Format: React/TypeScript komponenty (TSX)
- Przykład: `apps/www/app/docs/get-started/introduction/page.tsx`

**Dokumentacja markdown:**
- Lokalizacja: `docs/**/*.md`
- Format: Markdown files
- Przykłady: `docs/api/button.md`, `docs/guides/cli-usage.md`

**Problem:**
- Dwie oddzielne lokalizacje dokumentacji
- Markdown w `docs/` nie jest automatycznie renderowany w portalu
- Edycja wymaga znajomości React/TSX
- Brak synchronizacji między `docs/` a `apps/www/app/docs/`

---

## ✅ Zalety Edycji Markdown

### 1. **Łatwiejsza Edycja**
- ✅ Nie wymaga znajomości React/TypeScript
- ✅ Edycja bezpośrednio w GitHub (web editor)
- ✅ Łatwiejsze dla non-technical contributors
- ✅ Szybsze wprowadzanie zmian

### 2. **Spójność z Resztą Dokumentacji**
- ✅ Wszystkie pliki `.md` w jednym miejscu (`docs/`)
- ✅ Jednolity format dla całej dokumentacji
- ✅ Łatwiejsze zarządzanie

### 3. **GitHub Workflow**
- ✅ Edycja przez GitHub web interface
- ✅ Pull requests z preview
- ✅ Review process bez lokalnego setupu
- ✅ History tracking w Git

### 4. **Content-First Approach**
- ✅ Separacja treści od kodu
- ✅ Łatwiejsze tłumaczenia (i18n)
- ✅ Możliwość generowania z innych źródeł

---

## ⚠️ Wyzwania

### 1. **Next.js App Router**
- Next.js 15 App Router używa `page.tsx` jako route handlers
- MDX wymaga dodatkowej konfiguracji
- Trzeba dodać `@next/mdx` lub podobne rozwiązanie

### 2. **Stylowanie i Komponenty**
- Obecne strony używają custom styling (inline styles)
- Komponenty React w treści (np. `<DocLayout>`, `<StorybookLink>`)
- Markdown nie obsługuje React komponentów bezpośrednio (potrzebny MDX)

### 3. **Type Safety**
- TSX zapewnia type checking
- Markdown/MDX traci tę zaletę
- Błędy wykrywane dopiero w runtime

### 4. **Performance**
- Dynamiczne ładowanie markdown może wpłynąć na performance
- Potrzebne cache'owanie i optymalizacja

---

## 🎯 Rekomendacja

### **TAK - Czysty Markdown (zaimplementowane ✅)**

**Dlaczego czysty Markdown:**
1. ✅ **100% Markdown** - zero JSX/React w pliku treści
2. ✅ **Najprostsza edycja** - każdy może edytować w GitHub
3. ✅ **Intuicyjne** - standardowy format markdown
4. ✅ **Spójność** - wszystkie pliki `.md` w jednym formacie

**Struktura:**
```
apps/www/app/docs/get-started/introduction/
  ├── content.md        # Treść w czystym Markdown (edytowalna w GitHub)
  └── page.tsx          # Wrapper React (automatyczny, nie wymaga edycji)
```

---

## 🚀 Implementation Plan (Zaimplementowane ✅)

### Phase 1: Setup Markdown Support

1. **Zainstaluj zależności:**
   ```bash
   pnpm add remark remark-html remark-frontmatter remark-gfm gray-matter
   ```

2. **Utwórz helper do czytania Markdown:**
   ```tsx
   // apps/www/src/lib/markdown.ts
   import fs from "fs";
   import path from "path";
   import matter from "gray-matter";
   import { remark } from "remark";
   import remarkHtml from "remark-html";
   import remarkGfm from "remark-gfm";
   
   export async function readMarkdown(filePath: string) {
     const fullPath = path.join(process.cwd(), filePath);
     const fileContents = fs.readFileSync(fullPath, "utf8");
     const { data, content } = matter(fileContents);
     const processedContent = await remark()
       .use(remarkGfm)
       .use(remarkHtml, { sanitize: false })
       .process(content);
     return {
       frontmatter: data,
       content: processedContent.toString(),
     };
   }
   ```

3. **Dodaj style CSS dla Markdown:**
   ```css
   /* apps/www/src/styles/globals.css */
   .prose h1 + p {
     color: var(--foreground-secondary);
     font-family: Geist, sans-serif;
     font-size: 16px;
     line-height: 160%;
   }
   
   .prose h2 + p {
     color: var(--Zinc-300, #D4D4D8);
     font-family: Geist, sans-serif;
     font-size: 16px;
     line-height: 160%;
   }
   ```

### Phase 2: Migracja Stron (Zakończona ✅)

1. **Konwertuj `introduction/page.mdx` → `introduction/content.md` + `page.tsx`:**
   ```markdown
   ---
   title: Introduction
   ---
   
   # Introduction
   
   Welcome to Fragment UI...
   
   ## What is Fragment UI?
   
   Fragment UI is a design system...
   ```
   
   ```tsx
   // page.tsx
   import { readMarkdown } from "../../../../src/lib/markdown";
   import { DocLayout } from "../../../../src/components/doc-layout";
   import { EditOnGitHub } from "../../../../src/components/edit-on-github";
   
   export default async function IntroductionPage() {
     const { content, frontmatter } = await readMarkdown(
       "apps/www/app/docs/get-started/introduction/content.md"
     );
     return (
       <DocLayout>
         <h1>{frontmatter.title}</h1>
         <div className="prose prose-invert" dangerouslySetInnerHTML={{ __html: content }} />
         <EditOnGitHub filePath="apps/www/app/docs/get-started/introduction/content.md" />
       </DocLayout>
     );
   }
   ```

2. **Status:** ✅ `introduction` - zakończone

### Phase 3: GitHub Integration

1. **Dodaj `.github/workflows/docs-sync.yml`** (opcjonalnie)
   - Automatyczna synchronizacja z `docs/` folder
   - Validation przed merge

2. **Dokumentacja dla contributors:**
   - Jak edytować strony w GitHub
   - Format MDX
   - Używane komponenty

---

## 📋 Alternatywne Rozwiązania

### Option A: Content Management System (CMS)
- **Pros:** Pełna kontrola, UI dla non-technical users
- **Cons:** Dodatkowa infrastruktura, koszty, complexity

### Option B: Hybrid Approach
- **Pros:** Markdown dla treści, TSX dla interaktywnych sekcji
- **Cons:** Dwa formaty do zarządzania

### Option C: Keep TSX, Improve DX
- **Pros:** Type safety, pełna kontrola
- **Cons:** Wymaga znajomości React/TSX

---

## 🎯 Rekomendacja Finalna

### **✅ Zaimplementowano: Czysty Markdown dla prostych stron dokumentacji**

**Które strony migrować:**
- ✅ `/docs/get-started/introduction` - **ZAKOŃCZONE**
- ⏳ `/docs/get-started/*` - pozostałe strony tekstowe
- ⏳ `/docs/guides/*` - przewodniki
- ⏳ `/docs/foundations/*` - podstawy
- ⚠️ `/docs/components/*` - zostawić TSX (interaktywne przykłady)

**Korzyści:**
1. ✅ **100% Markdown** - najprostsza edycja w GitHub
2. ✅ **GitHub-native workflow** - bezpośrednia edycja przez web interface
3. ✅ **Intuicyjne** - standardowy format markdown
4. ✅ **Stopniowa migracja** - można migrować pojedynczo

**Zaimplementowane:**
1. ✅ Setup Markdown support (~1h)
2. ✅ Migracja `introduction` (~30min)
3. ✅ Dokumentacja procesu (ten plik)

---

## 📝 Next Steps

1. ✅ **Decyzja:** Wdrożono czysty Markdown
2. ✅ **Proof of Concept:** `introduction` - zakończone
3. ⏳ **Evaluation:** Sprawdź czy workflow działa dobrze w praktyce
4. ⏳ **Full Migration:** Jeśli OK, migruj pozostałe strony z `/docs/get-started/*`

---

## 🔗 Resources

- [Next.js MDX Documentation](https://nextjs.org/docs/app/building-your-application/configuring/mdx)
- [MDX Documentation](https://mdxjs.com/)
- [Next.js + MDX Example](https://github.com/vercel/next.js/tree/canary/examples/with-mdx)

---

**Status:** ✅ **Zaimplementowano - Czysty Markdown**  
**Completed:** 2025-01-05  
**Next:** Migracja pozostałych stron z `/docs/get-started/*`

