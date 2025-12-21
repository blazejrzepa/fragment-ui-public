# Fragment UI - Szczegółowy Plan Działań dla Co-Pilota

**Data utworzenia:** Styczeń 2025  
**Wersja:** 1.1  
**Status:** Zgodny z dokumentem użytkownika - wszystkie zadania M1-M3 i H1 uwzględnione

---

## ✅ Potwierdzenie Zgodności

Ten plan został zweryfikowany i **zawiera wszystkie informacje** z dokumentu użytkownika:

- ✅ **Ustalenia globalne** (repo/stack, DS reguły, branch/commit, guardrails)
- ✅ **Wszystkie zadania M1** (M1.1, M1.2, M1.3) - Composable DSL + Editing
- ✅ **Wszystkie zadania M2** (M2.1, M2.2, M2.3) - Warianty z dokumentów + Verify++
- ✅ **Wszystkie zadania M3** (M3.1, M3.2) - Governance + Telemetria
- ✅ **Zadanie H1** - Hardening (No CSS imports + jsx-runtime + Pins + Smoke)
- ✅ **Konwencje i niezmienniki** (komponenty tylko z @fragment_ui/ui, tokens-only, data-ui-id, recipes wersjonowane, Undo/Redo immutability)
- ✅ **"Gotowce"** - gotowe prompty do wklejenia dla każdego zadania
- ✅ **Szczegółowe AC** (kryteria akceptacji) dla każdego zadania
- ✅ **Operacje Patch** (setCopy, setProp, toggleVariant, addNode, moveNode, reorder, duplicateNode, swap, bindData, renameSection)

---

## 📋 Wprowadzenie

Ten dokument zawiera szczegółową propozycję konkretnych działań dla co-pilota (AI asystenta) pracującego nad projektem Fragment UI. Każde zadanie zawiera:
- **CO** ma być zrobione (konkretne wymagania)
- **DLACZEGO** to jest ważne (uzasadnienie biznesowe/techniczne)
- **JAK** to zaimplementować (kroki techniczne)
- **KLUCZOWE INFORMACJE** potrzebne do wykonania (kontekst, zależności, przykłady)

---

## 🎯 Priorytetyzacja

Zadania są podzielone na 4 kategorie priorytetów:
- **P0 (Krytyczne)** - Blokuje rozwój, wymaga natychmiastowej uwagi
- **P1 (Wysokie)** - Znacząco poprawia wartość produktu
- **P2 (Średnie)** - Ulepszenia i optymalizacje
- **P3 (Niskie)** - Nice-to-have, można odłożyć

---

## 📦 M1 — Composable DSL + Editing (Dashboard/Landing + Edycja Konwersacyjna)

### Task M1.1: Rozszerz UI-DSL o Układy i Datasources

**Priorytet:** P0  
**Estymacja:** 12-16h  
**Zależności:** Obecny system DSL w `apps/demo/app/playground/dsl/`

#### CO ma być zrobione:

1. **Typy (types.ts)** - Dodaj:
   ```typescript
   export type UiLayout =
     | { type: "dashboard"; areas: Array<"header"|"sidebar"|"content">; grid?: { cols:number; gap:number } }
     | { type: "marketing"; hero?: boolean; sections: Array<"features"|"proof"|"pricing"|"faq"|"cta"> }
     | { type: "two-column"; ratio?: "1:1"|"1:2"|"2:1" };
   
   export type UiDataSource =
     | { kind: "placeholder" }
     | { kind: "static"; data: any }
     | { kind: "http"; url: string; method?: "GET"|"POST"; params?: Record<string,any> };
   
   export type UiPage = UiCommon & {
     type: "page";
     layout?: UiLayout;
     sections: Array<{ id: string; kind: string; title?: string; content: UiDsl[]; data?: UiDataSource }>;
   };
   ```

2. **Schema (schema.ts)** - Zaktualizuj JSON Schema + walidację (zod), w tym restrykcje na layout.type

3. **Generator (generator.ts)**:
   - Obsłuż `layout.type === "dashboard"`: wyrenderuj Grid/CSS grid i sloty: header, sidebar, content
   - Obsłuż `layout.type === "marketing"`: mapowanie sekcji → gotowe bloki (Hero, Features, Testimonials, Pricing, FAQ, CTA) z `@fragment_ui/blocks`
   - Utrzymuj `data-ui-id` na wszystkich węzłach

#### DLACZEGO to jest ważne:
- **Funkcjonalność:** Pozwala budować złożone ekrany jak dashboardy i landingi
- **Skalowalność:** Układy są reużywalne i komponowalne
- **Produktywność:** Gotowe bloki przyspieszają development
- **Spójność:** Centralne zarządzanie layoutami zapewnia spójność

#### JAK to zaimplementować:

**Pliki:**
- `apps/demo/app/playground/dsl/types.ts` - rozszerz typy
- `apps/demo/app/playground/dsl/schema.ts` - zaktualizuj schema
- `apps/demo/app/playground/dsl/generator.ts` - dodaj generowanie layoutów

**Kroki:**

1. **Rozszerz types.ts:**
   ```typescript
   // apps/demo/app/playground/dsl/types.ts
   export type UiLayout =
     | { type: "dashboard"; areas: Array<"header"|"sidebar"|"content">; grid?: { cols:number; gap:number } }
     | { type: "marketing"; hero?: boolean; sections: Array<"features"|"proof"|"pricing"|"faq"|"cta"> }
     | { type: "two-column"; ratio?: "1:1"|"1:2"|"2:1" };
   
   export type UiDataSource =
     | { kind: "placeholder" }
     | { kind: "static"; data: any }
     | { kind: "http"; url: string; method?: "GET"|"POST"; params?: Record<string,any> };
   
   export type UiPage = UiCommon & {
     type: "page";
     layout?: UiLayout;
     sections: Array<{ id: string; kind: string; title?: string; content: UiDsl[]; data?: UiDataSource }>;
   };
   ```

2. **Zaktualizuj schema.ts:**
   ```typescript
   // apps/demo/app/playground/dsl/schema.ts
   const UiLayoutSchema = z.discriminatedUnion("type", [
     z.object({
       type: z.literal("dashboard"),
       areas: z.array(z.enum(["header", "sidebar", "content"])),
       grid: z.object({ cols: z.number(), gap: z.number() }).optional(),
     }),
     z.object({
       type: z.literal("marketing"),
       hero: z.boolean().optional(),
       sections: z.array(z.enum(["features", "proof", "pricing", "faq", "cta"])),
     }),
     z.object({
       type: z.literal("two-column"),
       ratio: z.enum(["1:1", "1:2", "2:1"]).optional(),
     }),
   ]);
   ```

3. **Dodaj generowanie layoutów w generator.ts:**
   ```typescript
   // apps/demo/app/playground/dsl/generator.ts
   function generateDashboardLayout(page: UiPage): string {
     const { areas, grid } = page.layout as Extract<UiLayout, { type: "dashboard" }>;
     const cols = grid?.cols || 12;
     const gap = grid?.gap || 4;
     
     return `
       <div 
         className="grid h-screen" 
         style={{ gridTemplateColumns: "repeat(${cols}, 1fr)", gap: "${gap}px" }}
         data-ui-id="${page.id}"
       >
         ${areas.includes("header") ? `<header data-ui-id="${page.id}-header">${generateSections(page.sections.filter(s => s.kind === "header"))}</header>` : ""}
         ${areas.includes("sidebar") ? `<aside data-ui-id="${page.id}-sidebar">${generateSections(page.sections.filter(s => s.kind === "sidebar"))}</aside>` : ""}
         ${areas.includes("content") ? `<main data-ui-id="${page.id}-content">${generateSections(page.sections.filter(s => s.kind === "content"))}</main>` : ""}
       </div>
     `;
   }
   
   function generateMarketingLayout(page: UiPage): string {
     const { hero, sections } = page.layout as Extract<UiLayout, { type: "marketing" }>;
     
     // Map sections to blocks from @fragment_ui/blocks
     const sectionMap: Record<string, string> = {
       features: "FeaturesBlock",
       proof: "TestimonialsBlock",
       pricing: "PricingTableBlock",
       faq: "FAQBlock",
       cta: "CTABlock",
     };
     
     return `
       <div data-ui-id="${page.id}">
         ${hero ? `<HeroBlock data-ui-id="${page.id}-hero" />` : ""}
         ${sections.map(section => {
           const BlockComponent = sectionMap[section];
           return BlockComponent ? `<${BlockComponent} data-ui-id="${page.id}-${section}" />` : "";
         }).join("\n")}
       </div>
     `;
   }
   ```

#### KRYTERIA AKCEPTACJI (AC):

✅ DSL z `layout: { type: "dashboard" }` generuje TSX z trzema obszarami i poprawnie rozmieszcza sloty  
✅ DSL z `layout: { type: "marketing", hero: true, sections: [...] }` generuje landing z sekcjami  
✅ Walidacja odrzuca niedozwolone layouty  
✅ Generator nie psuje `data-ui-id`  
✅ 6 testów generatora (dashboard/marketing, mobile/desktop) przechodzą

**Gotowiec dla Co-Pilota:**
```
Pracujesz w repo Fragment UI. Rozszerz UI-DSL o layouty (dashboard, marketing, two-column) i UiDataSource jak w specyfikacji. Zaktualizuj types.ts + schema.ts. W generator.ts zaimplementuj renderowanie slotów dla dashboard i mapowanie sekcji marketing na bloki z @fragment_ui/blocks. Zachowaj data-ui-id. Dodaj 6 testów generatora (dashboard/marketing, mobile/desktop). Kryteria: przypadki z przykładu przechodzą; walidacja odrzuca nieprawidłowe layouty.
```

**Kluczowe informacje:**
- Obecne typy DSL są w `apps/demo/app/playground/dsl/types.ts`
- Generator jest w `apps/demo/app/playground/dsl/generator.ts`
- Bloki są w `packages/blocks/src/` - użyj ich w marketing layout
- `data-ui-id` musi być na każdym węźle - użyj `generateId()` helper

---

### Task M1.2: "Recipes" (Makra Kompozycji) dla Promptów

**Priorytet:** P1  
**Estymacja:** 8-10h  
**Zależności:** Task M1.1 (layouty DSL)

#### CO ma być zrobione:

1. **Stwórz `packages/blocks-recipes/recipes.json`:**
   ```json
   {
     "dashboard.analytics.v1": {
       "layout": { "type": "dashboard", "areas": ["header","sidebar","content"] },
       "slots": {
         "header": ["Breadcrumbs","Search","UserMenu"],
         "sidebar": ["NavMenu{items=Analytics,Reports,Settings}"],
         "content": ["KpiRow{items=MRR,ARPU,Churn}","Chart{type=line}","DataTable{filters=DateRange,Segment}"]
       }
     },
     "marketing.saas.v1": {
       "layout": { "type": "marketing", "hero": true, "sections": ["features","proof","pricing","faq","cta"] }
     }
   }
   ```

2. **W `/api/generate-dsl` dodaj etap:**
   - Klasyfikacja intencji (dashboard vs marketing)
   - Wybór recepty
   - Uzupełnienie slotów
   - Generowanie DSL

#### DLACZEGO to jest ważne:
- **Szybkość:** Szybkie składanie często spotykanych układów
- **Spójność:** Recepty zapewniają spójne wzorce
- **Skalowalność:** Łatwe dodawanie nowych recept
- **UX:** Użytkownicy mogą szybko tworzyć złożone ekrany

#### JAK to zaimplementować:

**Pliki:**
- `packages/blocks-recipes/recipes.json` - nowy plik
- `apps/demo/app/api/generate-dsl/route.ts` - rozszerz logikę

**Kroki:**

1. **Utwórz strukturę recipes:**
   ```typescript
   // packages/blocks-recipes/recipes.json
   {
     "dashboard.analytics.v1": {
       "layout": { "type": "dashboard", "areas": ["header","sidebar","content"] },
       "slots": {
         "header": ["Breadcrumbs","Search","UserMenu"],
         "sidebar": ["NavMenu{items=Analytics,Reports,Settings}"],
         "content": ["KpiRow{items=MRR,ARPU,Churn}","Chart{type=line}","DataTable{filters=DateRange,Segment}"]
       },
       "description": "Analytics dashboard with KPIs, charts, and data table"
     },
     "marketing.saas.v1": {
       "layout": { "type": "marketing", "hero": true, "sections": ["features","proof","pricing","faq","cta"] },
       "description": "SaaS marketing landing page with hero, features, testimonials, pricing, FAQ, and CTA"
     }
   }
   ```

2. **Dodaj klasyfikację intencji:**
   ```typescript
   // apps/demo/app/api/generate-dsl/route.ts
   function classifyIntent(prompt: string): "dashboard" | "marketing" | "form" | "other" {
     const lower = prompt.toLowerCase();
     if (lower.includes("dashboard") || lower.includes("analytics") || lower.includes("kpi")) {
       return "dashboard";
     }
     if (lower.includes("landing") || lower.includes("marketing") || lower.includes("saas")) {
       return "marketing";
     }
     if (lower.includes("form") || lower.includes("formularz")) {
       return "form";
     }
     return "other";
   }
   ```

3. **Dodaj wybór recepty:**
   ```typescript
   function selectRecipe(intent: string, prompt: string): Recipe | null {
     const recipes = await loadRecipes();
     
     if (intent === "dashboard") {
       // Match keywords to select appropriate recipe
       if (prompt.includes("analytics") || prompt.includes("kpi")) {
         return recipes["dashboard.analytics.v1"];
       }
     }
     
     if (intent === "marketing") {
       return recipes["marketing.saas.v1"];
     }
     
     return null;
   }
   ```

4. **Dodaj wypełnienie slotów:**
   ```typescript
   function fillRecipeSlots(recipe: Recipe, prompt: string): UiDsl {
     // Parse prompt to extract specific requirements
     // Fill slots with appropriate components
     // Generate DSL structure
   }
   ```

#### KRYTERIA AKCEPTACJI (AC):

✅ Prompt "Dashboard sprzedażowy (MRR/ARPU/Churn + wykres + tabela z filtrem segmentu)" wybiera `dashboard.analytics.v1` i generuje poprawny DSL  
✅ Prompt "Landing page dla SaaS" wybiera `marketing.saas.v1` i generuje poprawny DSL  
✅ Recepty są wersjonowane (`.v1`, `.v2`) - nigdy nie nadpisuj istniejących  
✅ Sloty są poprawnie wypełniane na podstawie promptu

**Gotowiec dla Co-Pilota:**
```
Dodaj packages/blocks-recipes/recipes.json z receptami dashboard.analytics.v1 i marketing.saas.v1. W /api/generate-dsl dorób krok: klasyfikacja intencji z prompta → wybór recepty → wypełnienie slotów → DSL. Test: prompt o dashboardzie sprzedażowym wybiera dashboard.analytics.v1.
```

**Kluczowe informacje:**
- Recepty są wersjonowane - zawsze dodawaj nową wersję zamiast modyfikować istniejącą
- Sloty mogą zawierać parametry w formacie `Component{param=value}`
- Klasyfikacja intencji powinna być rozszerzalna

---

### Task M1.3: Edycja Konwersacyjna i Inspektor

**Priorytet:** P0  
**Estymacja:** 16-20h  
**Zależności:** Obecny system patchów w `apps/demo/app/playground/dsl/patch.ts`

#### CO ma być zrobione:

1. **Patch API – rozbudowa (patch.ts):**
   ```typescript
   export type Patch =
     | { op:"setCopy"; target:NodeRef; path:string; value:string }
     | { op:"setProp"; target:NodeRef; prop:string; value:any }
     | { op:"toggleVariant"; target:NodeRef; variant:string; value?:string }
     | { op:"addNode"; parent:NodeRef; index?:number; node:UiDsl }
     | { op:"moveNode"; target:NodeRef; toParent:NodeRef; index?:number }
     | { op:"reorder"; parent:NodeRef; from:number; to:number }
     | { op:"duplicateNode"; target:NodeRef }
     | { op:"swap"; a:NodeRef; b:NodeRef }
     | { op:"bindData"; target:NodeRef; data:UiDataSource }
     | { op:"renameSection"; target:NodeRef; value:string };
   ```

2. **applyPatch()** - niemutacyjnie; 10 testów jednostkowych (duplicate/swap/bindData/renameSection)

3. **Inspector:**
   - Odczyt props/variantów z `packages/registry/registry.json`
   - GUI pozwala tylko na dozwolone wartości
   - Zapis zmian → Patch

4. **Undo/Redo:**
   - Stos historii (min. 50 kroków)
   - Skróty klawiszowe (Ctrl/Cmd+Z/Shift+Z)

#### DLACZEGO to jest ważne:
- **UX:** Proste zmiany copy/wariantu/przesuwania bez grzebania w kodzie
- **Produktywność:** Szybsze iteracje i eksperymentowanie
- **Niezawodność:** Undo/Redo zapobiega utracie pracy
- **Jakość:** Inspector zapewnia poprawne wartości

#### JAK to zaimplementować:

**Pliki:**
- `apps/demo/app/playground/dsl/patch.ts` - rozszerz typy i implementacje
- `apps/demo/app/playground/dsl/patch-parser.ts` - rozszerz parser
- `apps/demo/src/components/playground/element-inspector.tsx` - ulepsz inspector
- `apps/demo/src/hooks/use-code-history.ts` - rozszerz historię

**Kroki:**

1. **Rozszerz patch.ts:**
   ```typescript
   // apps/demo/app/playground/dsl/patch.ts
   export type Patch =
     // Existing patches...
     | { op: "duplicateNode"; target: NodeRef }
     | { op: "swap"; a: NodeRef; b: NodeRef }
     | { op: "bindData"; target: NodeRef; data: UiDataSource }
     | { op: "renameSection"; target: NodeRef; value: string };
   
   function applyDuplicateNode(dsl: UiDsl, patch: Extract<Patch, { op: "duplicateNode" }>): UiDsl {
     const node = findNode(dsl, patch.target);
     if (!node) throw new Error(`Node not found: ${JSON.stringify(patch.target)}`);
     
     const parent = findParent(dsl, patch.target);
     if (!parent || !Array.isArray(parent.children)) {
       throw new Error(`Parent not found or not an array`);
     }
     
     const cloned = JSON.parse(JSON.stringify(node));
     cloned.id = generateId(); // New ID for duplicate
     
     const index = parent.children.findIndex((n: any) => n.id === node.id);
     parent.children.splice(index + 1, 0, cloned);
     
     return dsl;
   }
   
   function applySwap(dsl: UiDsl, patch: Extract<Patch, { op: "swap" }>): UiDsl {
     const nodeA = findNode(dsl, patch.a);
     const nodeB = findNode(dsl, patch.b);
     if (!nodeA || !nodeB) throw new Error("Nodes not found");
     
     // Swap positions
     const parentA = findParent(dsl, patch.a);
     const parentB = findParent(dsl, patch.b);
     
     if (parentA === parentB && Array.isArray(parentA.children)) {
       const indexA = parentA.children.findIndex((n: any) => n.id === nodeA.id);
       const indexB = parentA.children.findIndex((n: any) => n.id === nodeB.id);
       [parentA.children[indexA], parentA.children[indexB]] = [parentA.children[indexB], parentA.children[indexA]];
     }
     
     return dsl;
   }
   ```

2. **Dodaj testy:**
   ```typescript
   // apps/demo/app/playground/dsl/__tests__/patch.test.ts
   describe('Patch operations', () => {
     it('duplicates a node', () => {
       const dsl = createTestDSL();
       const patch: Patch = { op: "duplicateNode", target: { type: "byPath", path: "page.sections[0]" } };
       const result = applyPatch(dsl, patch);
       expect(result.sections).toHaveLength(2);
     });
     
     it('swaps two nodes', () => {
       // Test swap
     });
     
     // ... 8 more tests
   });
   ```

3. **Ulepsz Inspector:**
   ```typescript
   // apps/demo/src/components/playground/element-inspector.tsx
   const registry = await import('@/../../packages/registry/registry.json');
   
   function getComponentProps(componentName: string) {
     const component = registry.components[componentName];
     return component?.props || {};
   }
   
   function getComponentVariants(componentName: string) {
     const component = registry.components[componentName];
     return component?.variants || [];
   }
   ```

4. **Rozszerz historię:**
   ```typescript
   // apps/demo/src/hooks/use-code-history.ts
   const MAX_HISTORY_STEPS = 50;
   
   const addToHistory = useCallback((code: string, dsl: UiDsl, patches: Patch[]) => {
     setHistory(prev => {
       const newHistory = [...prev, { code, dsl, patches, timestamp: new Date() }];
       // Keep only last 50 steps
       return newHistory.slice(-MAX_HISTORY_STEPS);
     });
   }, []);
   ```

#### KRYTERIA AKCEPTACJI (AC):

✅ Klik → wybór elementu, zmiana variant/label/order bez prompta  
✅ Z czatu: "dodaj przycisk secondary obok submit" → działa (addNode + reorder)  
✅ Undo/Redo działa dla ≥ 5 operacji  
✅ Inspector pokazuje tylko dozwolone wartości z registry  
✅ 10 testów jednostkowych przechodzą (duplicate/swap/bindData/renameSection)

**Gotowiec dla Co-Pilota:**
```
Rozszerz patch.ts o operacje duplicateNode, swap, bindData, renameSection i zaimplementuj applyPatch (niemutacyjnie) z 10 testami. W Inspektorze odczytuj dozwolone props/varianty z packages/registry/registry.json; GUI ma blokować niedozwolone wartości. Dodaj Undo/Redo (stack 50). Test: zmiana wariantu i kopii przycisku bez prompta działa.
```

**Kluczowe informacje:**
- Obecny system patchów jest w `apps/demo/app/playground/dsl/patch.ts`
- Registry jest w `packages/registry/registry.json`
- Wszystkie operacje patch muszą być niemutacyjne (immutability)
- Historia powinna używać `localStorage` dla persystencji

---

## 📦 M2 — Warianty z Dokumentów + Verify++

### Task M2.1: Ingestor + Variants API (Landing Builder)

**Priorytet:** P1  
**Estymacja:** 12-16h  
**Zależności:** Task M1.1 (marketing layout)

#### CO ma być zrobione:

1. **`/api/ingest`** - przyjmij PDF/MD/TXT → ujednolić do markdown → pociąć na chunks z tytułami

2. **Prompt szablon (variants)** - wygeneruj 3–5 DSL typu marketing + krótkie rationale (mapowanie do chunków)

3. **`/variants` UI** - siatka wariantów z:
   - Podglądem
   - Rationale (źródła z chunków)
   - Przyciskiem "Promote to Submission"

#### DLACZEGO to jest ważne:
- **Automatyzacja:** Generujemy wiele wariantów landinga bazując na materiałach klienta
- **Jakość:** Różne warianty pozwalają wybrać najlepszy
- **Traceability:** Rationale pokazuje, skąd pochodzą elementy
- **Workflow:** Promocja do Submission integruje z istniejącym workflow

#### JAK to zaimplementować:

**Pliki:**
- `apps/demo/app/api/ingest/route.ts` - nowy endpoint
- `apps/demo/app/api/variants/route.ts` - nowy endpoint
- `apps/demo/app/variants/page.tsx` - nowa strona

**Kroki:**

1. **Utwórz ingest endpoint:**
   ```typescript
   // apps/demo/app/api/ingest/route.ts
   import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
   import { TextLoader } from 'langchain/document_loaders/fs/txt';
   
   export async function POST(request: Request) {
     const formData = await request.formData();
     const file = formData.get('file') as File;
     
     let text = '';
     if (file.type === 'application/pdf') {
       const loader = new PDFLoader(file);
       const docs = await loader.load();
       text = docs.map(d => d.pageContent).join('\n');
     } else if (file.type === 'text/markdown' || file.type === 'text/plain') {
       text = await file.text();
     }
     
     // Convert to markdown and chunk
     const chunks = chunkMarkdown(text);
     return Response.json({ chunks });
   }
   
   function chunkMarkdown(text: string): Array<{ title: string; content: string }> {
     // Split by headers (# ## ###)
     // Return chunks with titles
   }
   ```

2. **Utwórz variants endpoint:**
   ```typescript
   // apps/demo/app/api/variants/route.ts
   export async function POST(request: Request) {
     const { chunks, prompt } = await request.json();
     
     const systemPrompt = `Generate 3-5 different marketing landing page variants based on the provided content chunks.
     Each variant should:
     - Use different layouts and component arrangements
     - Reference specific chunks in rationale
     - Be visually distinct
     
     Content chunks: ${JSON.stringify(chunks)}
     Additional prompt: ${prompt}`;
     
     const variants = await generateVariantsWithAI(systemPrompt);
     return Response.json({ variants });
   }
   ```

3. **Utwórz variants UI:**
   ```typescript
   // apps/demo/app/variants/page.tsx
   export default function VariantsPage() {
     const [variants, setVariants] = useState<Variant[]>([]);
     
     return (
       <div className="grid grid-cols-3 gap-4">
         {variants.map(variant => (
           <VariantCard
             key={variant.id}
             variant={variant}
             onPromote={() => promoteToSubmission(variant)}
           />
         ))}
       </div>
     );
   }
   ```

#### KRYTERIA AKCEPTACJI (AC):

✅ Upload 1 pliku → 3 różne landingi, każdy renderowalny i z rationale (min. 3 referencje do chunków)  
✅ Rationale pokazuje mapowanie do konkretnych chunków  
✅ "Promote to Submission" tworzy submission z wygenerowanym kodem

**Gotowiec dla Co-Pilota:**
```
Zaimplementuj /api/ingest (PDF/MD/TXT → markdown chunks) i /api/variants (LLM prompt → 3–5 wariantów DSL marketing). Na /variants zrób galerię: podgląd, rationale (źródła z chunków), "Promote to Submission". Kryteria: upload jednego pliku → 3 wyróżniające się landingi.
```

**Kluczowe informacje:**
- Użyj `langchain` lub podobnej biblioteki do parsowania PDF
- Chunks powinny mieć tytuły z nagłówków markdown
- Rationale musi zawierać referencje do konkretnych chunków
- Variants powinny być wizualnie różne

---

### Task M2.2: Verify++ (Lint+A11y+Token Guard + Figma Parity)

**Priorytet:** P0  
**Estymacja:** 16-20h  
**Zależności:** Obecny system verify w `apps/demo/app/submissions/verify.ts`

#### CO ma być zrobione:

1. **Lint (Node ESLint API)** - z wpiętymi regułami DS

2. **A11y** - reuse axe z preview

3. **TokenGuard++** - zlicz niedozwolone kolory/klasy; blokuj `text-[#fff]` etc.

4. **Figma Parity** - plik `mapping.json` (Figmowe warianty/props → Code). Sprawdź pokrycie > 90%

5. **Score** - 40% lint + 40% a11y + 20% tokens/parity. Wypisz sugestie naprawcze

#### DLACZEGO to jest ważne:
- **Jakość:** Bramka jakości przed wejściem do DS
- **Compliance:** A11y i token compliance są wymagane
- **Spójność:** Figma parity zapewnia zgodność z designem
- **Actionable:** Sugestie naprawcze pomagają poprawić kod

#### JAK to zaimplementować:

**Pliki:**
- `apps/demo/app/submissions/verify.ts` - rozszerz verify
- `apps/demo/app/api/submissions/[id]/verify/route.ts` - endpoint
- `packages/registry/mapping.json` - nowy plik

**Kroki:**

1. **Rozszerz verify.ts:**
   ```typescript
   // apps/demo/app/submissions/verify.ts
   import { ESLint } from 'eslint';
   import { axe } from 'axe-core';
   
   export interface VerifyResult {
     lint: {
       errors: number;
       warnings: number;
       issues: Array<{ line: number; message: string; rule: string }>;
     };
     a11y: {
       violations: number;
       issues: Array<{ id: string; impact: string; description: string }>;
     };
     tokens: {
       violations: number;
       issues: Array<{ line: number; code: string; suggestion: string }>;
     };
     figma: {
       coverage: number;
       missing: Array<{ variant: string; prop: string }>;
     };
     score: number;
     suggestions: string[];
   }
   
   export async function verifyCode(code: string): Promise<VerifyResult> {
     // Lint
     const lintResult = await runESLint(code);
     
     // A11y
     const a11yResult = await runA11yCheck(code);
     
     // Token Guard
     const tokenResult = checkTokenCompliance(code);
     
     // Figma Parity
     const figmaResult = checkFigmaParity(code);
     
     // Calculate score
     const score = calculateScore(lintResult, a11yResult, tokenResult, figmaResult);
     
     // Generate suggestions
     const suggestions = generateSuggestions(lintResult, a11yResult, tokenResult, figmaResult);
     
     return {
       lint: lintResult,
       a11y: a11yResult,
       tokens: tokenResult,
       figma: figmaResult,
       score,
       suggestions,
     };
   }
   ```

2. **Dodaj Token Guard:**
   ```typescript
   function checkTokenCompliance(code: string): TokenResult {
     const violations: TokenIssue[] = [];
     
     // Check for hardcoded colors
     const colorRegex = /(?:color|background|border):\s*#[0-9a-fA-F]{3,6}/g;
     const matches = code.matchAll(colorRegex);
     for (const match of matches) {
       violations.push({
         line: getLineNumber(code, match.index!),
         code: match[0],
         suggestion: `Replace with design token: var(--color-...)`,
       });
     }
     
     // Check for hardcoded spacing
     const spacingRegex = /(?:padding|margin|gap):\s*\d+px/g;
     // ... similar checks
     
     return { violations: violations.length, issues: violations };
   }
   ```

3. **Dodaj Figma Parity:**
   ```typescript
   // packages/registry/mapping.json
   {
     "Button": {
       "variants": {
         "primary": { "figma": "Button/Primary", "code": "variant='solid'" },
         "secondary": { "figma": "Button/Secondary", "code": "variant='outline'" }
       },
       "props": {
         "size": { "figma": "Size", "code": "size" }
       }
     }
   }
   
   function checkFigmaParity(code: string): FigmaResult {
     const mapping = loadMapping();
     const componentVariants = extractVariants(code);
     
     const missing: Array<{ variant: string; prop: string }> = [];
     for (const [component, variants] of Object.entries(componentVariants)) {
       const expected = mapping[component]?.variants || {};
       for (const variant of variants) {
         if (!expected[variant]) {
           missing.push({ variant, prop: component });
         }
       }
     }
     
     const coverage = calculateCoverage(componentVariants, mapping);
     return { coverage, missing };
   }
   ```

#### KRYTERIA AKCEPTACJI (AC):

✅ Wynik w `submission.result` zawiera liczby i listę "co poprawić, aby przejść gate"  
✅ Score jest obliczany jako 40% lint + 40% a11y + 20% tokens/parity  
✅ Sugestie są konkretne i actionable  
✅ Figma parity sprawdza pokrycie > 90%

**Gotowiec dla Co-Pilota:**
```
W submissions/verify.ts dodaj Lint (DS rules), A11y (axe), TokenGuard++ (blokada kolorów/klas spoza whitelist) oraz Figma Parity (mapping.json). Zbuduj score i listę działań do poprawy. Endpoint /api/submissions/[id]/verify aktualizuje rekord. Kryteria: wynik zawiera liczby i konkretne "fixy".
```

**Kluczowe informacje:**
- Obecny verify jest w `apps/demo/app/submissions/verify.ts`
- ESLint API wymaga konfiguracji z DS rules
- A11y można użyć z preview (axe-core)
- Token Guard powinien sprawdzać wszystkie hardcoded wartości

---

### Task M2.3: Promote PR-bot

**Priorytet:** P1  
**Estymacja:** 10-12h  
**Zależności:** Task M2.2 (Verify++), GitHub integration

#### CO ma być zrobione:

1. **Octokit:**
   - Branch `feat/submission-<id>`
   - Pliki do `packages/ui/src/...` lub `packages/blocks/src/...`
   - Story
   - Update `registry.json`
   - Wpis w `CHANGELOG.md`

2. **PR template** - dołącz:
   - Wynik Verify++ (tabela)
   - Screenshot (Chromatic – jeśli skonfigurowany; w przeciwnym razie placeholder PNG z preview)

3. **Zwróć prUrl**

#### DLACZEGO to jest ważne:
- **Automatyzacja:** Półautomatyczny merge do DS
- **Workflow:** Integracja z istniejącym procesem PR
- **Jakość:** Verify++ zapewnia jakość przed PR
- **Traceability:** Screenshoty i wyniki są w PR

#### JAK to zaimplementować:

**Pliki:**
- `apps/demo/app/submissions/promote.ts` - główna logika
- `.env.local.example` - przykładowa konfiguracja
- `.github/PULL_REQUEST_TEMPLATE.md` - szablon PR

**Kroki:**

1. **Utwórz promote.ts:**
   ```typescript
   // apps/demo/app/submissions/promote.ts
   import { Octokit } from '@octokit/rest';
   
   export async function promoteSubmission(
     submissionId: string,
     submission: Submission
   ): Promise<{ prUrl: string }> {
     const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
     
     // Create branch
     const branchName = `feat/submission-${submissionId}`;
     await createBranch(octokit, branchName);
     
     // Determine target directory
     const targetDir = submission.type === 'component' 
       ? 'packages/ui/src'
       : 'packages/blocks/src';
     
     // Add component/block file
     await createOrUpdateFile(octokit, {
       path: `${targetDir}/${submission.name}.tsx`,
       content: submission.code,
       message: `feat: add ${submission.name} from submission ${submissionId}`,
     });
     
     // Add story file
     const storyContent = generateStoryFile(submission);
     await createOrUpdateFile(octokit, {
       path: `${targetDir}/${submission.name}.stories.tsx`,
       content: storyContent,
       message: `feat: add story for ${submission.name}`,
     });
     
     // Update registry
     await updateRegistry(octokit, submission);
     
     // Update CHANGELOG
     await updateChangelog(octokit, submission);
     
     // Create PR
     const pr = await createPullRequest(octokit, {
       title: `feat: Add ${submission.name} from submission ${submissionId}`,
       body: generatePRBody(submission),
       head: branchName,
       base: 'main',
     });
     
     return { prUrl: pr.html_url };
   }
   
   function generatePRBody(submission: Submission): string {
     const verifyTable = formatVerifyResults(submission.verifyResult);
     const screenshot = submission.screenshot || 'placeholder.png';
     
     return `
   ## Submission ${submission.id}
   
   ### Verify Results
   ${verifyTable}
   
   ### Screenshot
   ![Preview](${screenshot})
   
   ### Changes
   - Added component: \`${submission.name}\`
   - Added story: \`${submission.name}.stories.tsx\`
   - Updated registry
   - Updated CHANGELOG
     `;
   }
   ```

2. **Dodaj .env.local.example:**
   ```env
   GITHUB_TOKEN=your_github_token_here
   GITHUB_OWNER=fragment-ui
   GITHUB_REPO=fragment-ui
   ```

#### KRYTERIA AKCEPTACJI (AC):

✅ "Promote" tworzy PR z kompletem plików i wynikiem Verify  
✅ PR zawiera screenshot (Chromatic lub fallback PNG)  
✅ Wszystkie pliki są w odpowiednich lokalizacjach  
✅ Registry i CHANGELOG są zaktualizowane

**Gotowiec dla Co-Pilota:**
```
Napisz submissions/promote.ts (Octokit). Na podstawie Submission: stwórz branch, dodaj pliki TSX/Story, update registry, wpis do CHANGELOG, otwórz PR z szablonem, dołącz wynik Verify i zrzut ekranu (Chromatic lub fallback PNG z preview). Zwróć prUrl. Dodaj .env.local.example. Kryteria: PR kompletny i zielony na CI.
```

**Kluczowe informacje:**
- GitHub token musi mieć uprawnienia do tworzenia branchy i PR
- Użyj istniejących funkcji z `apps/demo/lib/github-utils.ts`
- Story powinien być generowany z `apps/demo/lib/storybook-utils.ts`
- Registry update wymaga merge z istniejącym plikiem

---

## 📦 M3 — Governance + Telemetria

### Task M3.1: Telemetria (TTFUI, Acceptance, A11y)

**Priorytet:** P1  
**Estymacja:** 8-10h  
**Zależności:** Obecna telemetria w `packages/telemetry/`

#### CO ma być zrobione:

1. **Zbieraj metryki:**
   - **TTFUI** (ms od prompta do pierwszego renderu)
   - **Acceptance Rate** (odsetek submissionów z score ≥ threshold)
   - **A11yViolations** (liczba naruszeń a11y)

2. **UI:** 3 wykresy (ostatnie 7/30 dni) + tabela ostatnich submissionów

3. **Endpoint:** `/api/metrics` zapisuje i zwraca JSON

#### DLACZEGO to jest ważne:
- **Mierzenie efektów:** Mierzymy efekty i stan jakości
- **ROI:** Pokazujemy wartość design systemu
- **Jakość:** Śledzenie a11y violations pomaga poprawić jakość
- **Optymalizacja:** TTFUI pomaga zidentyfikować problemy performance

#### JAK to zaimplementować:

**Pliki:**
- `apps/demo/app/api/metrics/route.ts` - endpoint
- `apps/demo/app/metrics/page.tsx` - strona UI
- `packages/telemetry/src/metrics.ts` - rozszerz telemetrię

**Kroki:**

1. **Rozszerz telemetrię:**
   ```typescript
   // packages/telemetry/src/metrics.ts
   export interface Metrics {
     ttfui: number; // Time to first UI (ms)
     acceptanceRate: number; // Percentage of submissions with score >= threshold
     a11yViolations: number; // Number of a11y violations
     timestamp: Date;
   }
   
   export function trackTTFUI(startTime: number, endTime: number) {
     const ttfui = endTime - startTime;
     sendMetric({ type: 'ttfui', value: ttfui, timestamp: new Date() });
   }
   
   export function trackAcceptanceRate(submissions: Submission[]) {
     const threshold = 80; // 80% score threshold
     const accepted = submissions.filter(s => s.verifyResult?.score >= threshold);
     const rate = (accepted.length / submissions.length) * 100;
     sendMetric({ type: 'acceptanceRate', value: rate, timestamp: new Date() });
   }
   ```

2. **Utwórz metrics endpoint:**
   ```typescript
   // apps/demo/app/api/metrics/route.ts
   export async function GET(request: Request) {
     const { searchParams } = new URL(request.url);
     const days = parseInt(searchParams.get('days') || '7');
     
     const metrics = await getMetrics(days);
     return Response.json(metrics);
   }
   
   export async function POST(request: Request) {
     const metric = await request.json();
     await saveMetric(metric);
     return Response.json({ success: true });
   }
   ```

3. **Utwórz metrics UI:**
   ```typescript
   // apps/demo/app/metrics/page.tsx
   import { LineChart, BarChart } from 'recharts';
   
   export default function MetricsPage() {
     const [metrics, setMetrics] = useState<Metrics[]>([]);
     
     useEffect(() => {
       fetch('/api/metrics?days=30').then(r => r.json()).then(setMetrics);
     }, []);
     
     return (
       <div className="space-y-6">
         <h1>Metrics Dashboard</h1>
         
         <div className="grid grid-cols-3 gap-4">
           <MetricCard title="TTFUI" data={metrics.map(m => ({ date: m.timestamp, value: m.ttfui }))} />
           <MetricCard title="Acceptance Rate" data={metrics.map(m => ({ date: m.timestamp, value: m.acceptanceRate }))} />
           <MetricCard title="A11y Violations" data={metrics.map(m => ({ date: m.timestamp, value: m.a11yViolations }))} />
         </div>
         
         <SubmissionsTable submissions={recentSubmissions} />
       </div>
     );
   }
   ```

#### KRYTERIA AKCEPTACJI (AC):

✅ `/metrics` pokazuje dane, endpoint zapisuje i zwraca JSON  
✅ 3 wykresy (ostatnie 7/30 dni) działają  
✅ Tabela ostatnich submissionów jest wyświetlana

**Gotowiec dla Co-Pilota:**
```
Stwórz /api/metrics i stronę /metrics (TTFUI, Acceptance Rate, A11y Violations). Integruj wywołania z preview i submissions. Kryteria: wykresy za 7/30 dni, JSON metryk dostępny.
```

**Kluczowe informacje:**
- Obecna telemetria jest w `packages/telemetry/`
- Użyj `recharts` lub podobnej biblioteki do wykresów
- Metryki powinny być zapisywane w bazie danych (SQLite lub podobna)
- TTFUI powinien być mierzony od momentu wysłania promptu do pierwszego renderu

---

### Task M3.2: Figma Contribution Stub

**Priorytet:** P2  
**Estymacja:** 6-8h  
**Zależności:** Task M2.2 (Figma Parity)

#### CO ma być zrobione:

1. **Zdefiniuj schemat metadanych z Figmy:**
   - Nazwa
   - Warianty
   - Constraints
   - Token names

2. **Endpoint waliduje zgodność metadanych z registry i tokenami**

3. **Zwraca listę braków**

4. **W Verify++ wykorzystaj mapping.json**

#### DLACZEGO to jest ważne:
- **Wspólna bramka:** Wspólna bramka dla komponentów z Figmy i Kopilota
- **Spójność:** Zapewnia spójność między designem a kodem
- **Traceability:** Mapowanie pozwala śledzić pochodzenie komponentów
- **Jakość:** Walidacja zapewnia zgodność z design systemem

#### JAK to zaimplementować:

**Pliki:**
- `packages/registry/mapping.json` - rozszerz mapping
- `apps/demo/app/api/figma/validate/route.ts` - endpoint (stub)

**Kroki:**

1. **Rozszerz mapping.json:**
   ```json
   {
     "Button": {
       "figmaComponentId": "123:456",
       "variants": {
         "primary": {
           "figma": "Button/Primary",
           "code": "variant='solid'",
           "tokens": {
             "backgroundColor": "var(--color-brand-primary)",
             "color": "var(--color-fg-on-brand)"
           }
         }
       },
       "props": {
         "size": {
           "figma": "Size",
           "code": "size",
           "values": ["sm", "md", "lg"]
         }
       },
       "constraints": {
         "minWidth": 80,
         "maxWidth": 300
       }
     }
   }
   ```

2. **Utwórz validate endpoint:**
   ```typescript
   // apps/demo/app/api/figma/validate/route.ts
   export async function POST(request: Request) {
     const figmaMetadata = await request.json();
     const mapping = await loadMapping();
     
     const validation = validateFigmaMetadata(figmaMetadata, mapping);
     
     return Response.json(validation);
   }
   
   function validateFigmaMetadata(
     figma: FigmaMetadata,
     mapping: Mapping
   ): ValidationResult {
     const issues: string[] = [];
     
     // Check component exists in mapping
     if (!mapping[figma.name]) {
       issues.push(`Component ${figma.name} not found in mapping`);
     }
     
     // Check variants coverage
     const expectedVariants = mapping[figma.name]?.variants || {};
     for (const variant of figma.variants) {
       if (!expectedVariants[variant.name]) {
         issues.push(`Variant ${variant.name} not mapped`);
       }
     }
     
     // Check token names
     const expectedTokens = mapping[figma.name]?.variants?.[variant.name]?.tokens || {};
     for (const [token, value] of Object.entries(figma.tokens)) {
       if (!expectedTokens[token]) {
         issues.push(`Token ${token} not in mapping`);
       }
     }
     
     const coverage = calculateCoverage(figma, mapping);
     
     return {
       valid: issues.length === 0 && coverage >= 0.9,
       coverage,
       issues,
     };
   }
   ```

#### KRYTERIA AKCEPTACJI (AC):

✅ JSON z Figmy przechodzi walidację przy pełnym pokryciu  
✅ Błędy są czytelnie raportowane  
✅ Coverage jest obliczane poprawnie (> 90% wymagane)

**Gotowiec dla Co-Pilota:**
```
Zdefiniuj packages/registry/mapping.json (Figmowe warianty/props → Code). Dodaj /api/figma/validate (stub) walidujący metadane komponentu z Figmy pod kątem pokrycia wariantów i tokenów. W Verify użyj parity check. Kryteria: walidacja zwraca jasne błędy/OK.
```

**Kluczowe informacje:**
- Mapping powinien być rozszerzalny
- Walidacja powinna sprawdzać wszystkie aspekty (variants, props, tokens, constraints)
- Coverage powinno być obliczane jako procent pokrycia

---

## 📦 H1 — Hardening (Przewijające się, ale Wykonaj Raz)

### Task H1: No CSS Imports + jsx-runtime + Pins + Smoke

**Priorytet:** P0  
**Estymacja:** 6-8h  
**Zależności:** Brak

#### CO ma być zrobione:

1. **CSS guard:**
   - Skrypt `scripts/check-no-css-imports.mjs` + CI job

2. **jsx-runtime regex:**
   - W `apps/demo/app/api/bundle/route.ts` jeden regex na jsx-runtime:
     ```typescript
     code = code.replace(/\breact\/jsx(?:-dev)?-runtime\b/g, "react");
     ```

3. **Piny w import map:**
   - W `apps/demo/app/playground/runtime/iframe.html` przypnij wersje

4. **Playwright smoke:**
   - `apps/demo/e2e/preview.spec.ts` - 3 scenariusze:
     - Form/tabs/table
     - Dashboard
     - Landing

#### DLACZEGO to jest ważne:
- **Stabilność:** Stabilność preview
- **Jakość:** Zapobiega regresjom
- **Compliance:** Egzekwuje reguły DS
- **Confidence:** Smoke tests dają pewność, że podstawowe funkcje działają

#### JAK to zaimplementować:

**Pliki:**
- `scripts/check-no-css-imports.mjs` - rozszerz skrypt
- `apps/demo/app/api/bundle/route.ts` - dodaj regex
- `apps/demo/app/playground/runtime/iframe.html` - przypnij wersje
- `apps/demo/e2e/preview.spec.ts` - dodaj testy

**Kroki:**

1. **Rozszerz check-no-css-imports:**
   ```javascript
   // scripts/check-no-css-imports.mjs
   import { glob } from 'glob';
   import { readFileSync } from 'fs';
   
   const files = await glob('apps/demo/**/*.{ts,tsx}');
   const violations = [];
   
   for (const file of files) {
     const content = readFileSync(file, 'utf-8');
     if (content.match(/import\s+.*\.css/)) {
       violations.push(file);
     }
   }
   
   if (violations.length > 0) {
     console.error('CSS imports found:', violations);
     process.exit(1);
   }
   ```

2. **Dodaj regex w bundle:**
   ```typescript
   // apps/demo/app/api/bundle/route.ts
   code = code.replace(/\breact\/jsx(?:-dev)?-runtime\b/g, "react");
   ```

3. **Przypnij wersje w iframe.html:**
   ```html
   <!-- apps/demo/app/playground/runtime/iframe.html -->
   <script type="importmap">
   {
     "imports": {
       "react": "https://esm.sh/react@18.2.0",
       "react-dom": "https://esm.sh/react-dom@18.2.0",
       "zod": "https://esm.sh/zod@3.22.4"
     }
   }
   </script>
   ```

4. **Dodaj smoke tests:**
   ```typescript
   // apps/demo/e2e/preview.spec.ts
   import { test, expect } from '@playwright/test';
   
   test('form/tabs/table preview', async ({ page }) => {
     await page.goto('/playground');
     // Generate form/tabs/table
     // Verify preview renders
   });
   
   test('dashboard preview', async ({ page }) => {
     // Generate dashboard
     // Verify preview renders
   });
   
   test('landing preview', async ({ page }) => {
     // Generate landing
     // Verify preview renders
   });
   ```

#### KRYTERIA AKCEPTACJI (AC):

✅ CI failuje na `.css` import  
✅ Smoke przechodzi lokalnie i w CI  
✅ jsx-runtime jest normalizowany  
✅ Wersje są przypięte w import map

**Gotowiec dla Co-Pilota:**
```
Dodaj skrypt CI "no CSS imports" i job w workflow. W bundlerze jeden regex na jsx-runtime. Przypnij wersje w import map. Napisz Playwright smoke preview.spec.ts (form/tabs/table, dashboard, landing). Kryteria: fail na .css import; smoke zielony.
```

**Kluczowe informacje:**
- Obecny skrypt jest w `scripts/check-no-css-imports.mjs`
- CI workflow jest w `.github/workflows/`
- Smoke tests powinny być szybkie (< 30s każdy)
- Import map powinien używać pinned versions

---

## 📋 Priorytetyzacja i Harmonogram (Zaktualizowane)

### Faza 1: M1 - Composable DSL + Editing (P0) - 3-4 tygodnie
1. Task M1.1: Rozszerz UI-DSL o Układy i Datasources
2. Task M1.2: "Recipes" (Makra Kompozycji)
3. Task M1.3: Edycja Konwersacyjna i Inspektor
4. Task H1: Hardening (No CSS + jsx-runtime + Pins + Smoke)

### Faza 2: M2 - Warianty + Verify++ (P0-P1) - 3-4 tygodnie
1. Task M2.1: Ingestor + Variants API
2. Task M2.2: Verify++ (Lint+A11y+Token Guard + Figma Parity)
3. Task M2.3: Promote PR-bot

### Faza 3: M3 - Governance + Telemetria (P1) - 2-3 tygodnie
1. Task M3.1: Telemetria (TTFUI, Acceptance, A11y)
2. Task M3.2: Figma Contribution Stub

### Faza 4: Ulepszenia (P1-P2) - 2-3 tygodnie
1. Task 1.1: Ulepszenie Systemu Rozpoznawania Mowy
2. Task 1.4: Integracja z Prawdziwym AI
3. Task 2.1: Dodanie Komponentu Data Grid
4. Task 2.2: Ulepszenie Systemu Formularzy
5. Task 3.1: Uzupełnienie Dokumentacji API
6. Task 4.1: Zwiększenie Coverage Testów
7. Task 4.2: Dodanie E2E Testów dla Playground
8. Task 5.1: Optymalizacja Bundle Size
9. Task 6.1: Rozszerzenie MCP Server

---

## 🔑 Kluczowe Informacje dla Co-Pilota (Zaktualizowane)

### Ustalenia Globalne

**Repo/Stack:**
- Monorepo: pnpm/turborepo
- TypeScript: 5.x
- Next.js: w `apps/*`

**DS Reguły:**
- Zakaz import `"...css"` w ESM, tylko `<link rel="stylesheet">` w runtime
- Komponenty wyłącznie z `@fragment_ui/ui`
- Atrybut śledzenia: `data-ui-id` na każdym węźle generowanym przez DSL
- Tokens-only: żadnych hardcoded kolorów

**Branch/Commit:**
- Branch per task: `feat/m1-<krótki-opis>`, `feat/m2-<krótki-opis>`, etc.
- Commity czyste: `feat:`, `fix:`, `chore:`
- PR zawiera: opis zmian, checklistę AC, linki do logów/testów

**Guardrails:**
- ESLint DS rules (no-raw-elements, DS-imports-only, no-hardcoded-colors)
- CI "no CSS imports" (skrypt + job)
- Piny wersji w import map (react, react-dom, zod, radix)
- Regex na react/jsx-runtime w bundlerze
- Playwright smoke: form/tabs/table + dashboard + landing

### Konwencje i Niezmienniki

- **Komponenty tylko z `@fragment_ui/ui`:** Zakaz surowego HTML dla form controls
- **Tokens-only:** Żadnych hardcoded kolorów
- **data-ui-id obowiązkowy:** Na każdym węźle z generatora; patch/inspektor operują tylko na tym ID
- **Recipes są wersjonowane:** `.v1`, `.v2` - nigdy nie nadpisuj istniejących w miejscu
- **Undo/Redo:** Wszystkie operacje patch muszą być czysto funkcjonalne (immutability)

---

## 📝 "Gotowce" - Prompty dla Co-Pilota

### Prompt M1.1 – DSL Layouts + Datasources

```
Pracujesz w repo Fragment UI. Rozszerz UI-DSL o layouty (dashboard, marketing, two-column) i UiDataSource jak w specyfikacji. Zaktualizuj types.ts + schema.ts. W generator.ts zaimplementuj renderowanie slotów dla dashboard i mapowanie sekcji marketing na bloki z @fragment_ui/blocks. Zachowaj data-ui-id. Dodaj 6 testów generatora (dashboard/marketing, mobile/desktop). Kryteria: przypadki z przykładu przechodzą; walidacja odrzuca nieprawidłowe layouty.
```

### Prompt M1.2 – Recipes

```
Dodaj packages/blocks-recipes/recipes.json z receptami dashboard.analytics.v1 i marketing.saas.v1. W /api/generate-dsl dorób krok: klasyfikacja intencji z prompta → wybór recepty → wypełnienie slotów → DSL. Test: prompt o dashboardzie sprzedażowym wybiera dashboard.analytics.v1.
```

### Prompt M1.3 – Editing + Inspector

```
Rozszerz patch.ts o operacje duplicateNode, swap, bindData, renameSection i zaimplementuj applyPatch (niemutacyjnie) z 10 testami. W Inspektorze odczytuj dozwolone props/varianty z packages/registry/registry.json; GUI ma blokować niedozwolone wartości. Dodaj Undo/Redo (stack 50). Test: zmiana wariantu i kopii przycisku bez prompta działa.
```

### Prompt M2.1 – Ingestor + Variants

```
Zaimplementuj /api/ingest (PDF/MD/TXT → markdown chunks) i /api/variants (LLM prompt → 3–5 wariantów DSL marketing). Na /variants zrób galerię: podgląd, rationale (źródła z chunków), "Promote to Submission". Kryteria: upload jednego pliku → 3 wyróżniające się landingi.
```

### Prompt M2.2 – Verify++

```
W submissions/verify.ts dodaj Lint (DS rules), A11y (axe), TokenGuard++ (blokada kolorów/klas spoza whitelist) oraz Figma Parity (mapping.json). Zbuduj score i listę działań do poprawy. Endpoint /api/submissions/[id]/verify aktualizuje rekord. Kryteria: wynik zawiera liczby i konkretne "fixy".
```

### Prompt M2.3 – Promote PR-bot

```
Napisz submissions/promote.ts (Octokit). Na podstawie Submission: stwórz branch, dodaj pliki TSX/Story, update registry, wpis do CHANGELOG, otwórz PR z szablonem, dołącz wynik Verify i zrzut ekranu (Chromatic lub fallback PNG z preview). Zwróć prUrl. Dodaj .env.local.example. Kryteria: PR kompletny i zielony na CI.
```

### Prompt M3.1 – Telemetry

```
Stwórz /api/metrics i stronę /metrics (TTFUI, Acceptance Rate, A11y Violations). Integruj wywołania z preview i submissions. Kryteria: wykresy za 7/30 dni, JSON metryk dostępny.
```

### Prompt M3.2 – Figma Contribution Stub

```
Zdefiniuj packages/registry/mapping.json (Figmowe warianty/props → Code). Dodaj /api/figma/validate (stub) walidujący metadane komponentu z Figmy pod kątem pokrycia wariantów i tokenów. W Verify użyj parity check. Kryteria: walidacja zwraca jasne błędy/OK.
```

### Prompt H1 – Hardening

```
Dodaj skrypt CI "no CSS imports" i job w workflow. W bundlerze jeden regex na jsx-runtime. Przypnij wersje w import map. Napisz Playwright smoke preview.spec.ts (form/tabs/table, dashboard, landing). Kryteria: fail na .css import; smoke zielony.
```

---

## 📋 Podsumowanie

Ten zaktualizowany plan zawiera **wszystkie informacje** z dokumentu użytkownika:

### ✅ Kompletność Zadań
- ✅ **Wszystkie zadania M1-M3 i H1** z dokumentu użytkownika
- ✅ **Wszystkie operacje Patch** (10 operacji: setCopy, setProp, toggleVariant, addNode, moveNode, reorder, duplicateNode, swap, bindData, renameSection)
- ✅ **Wszystkie typy DSL** (UiLayout: dashboard, marketing, two-column; UiDataSource: placeholder, static, http; UiPage)

### ✅ Ustalenia Globalne
- ✅ **Repo/stack** (Monorepo pnpm/turborepo; TypeScript 5.x; Next.js w apps/*)
- ✅ **DS reguły** (zakaz import "...css" w ESM, tylko <link rel="stylesheet"> w runtime; komponenty wyłącznie z @fragment_ui/ui)
- ✅ **Atrybut śledzenia** (data-ui-id na każdym węźle generowanym przez DSL)
- ✅ **Branch/commit** (Branch per task: feat/m1-<krótki-opis>; Commity czyste: feat:, fix:, chore:; PR zawiera: opis zmian, checklistę AC, linki do logów/testów)
- ✅ **Guardrails** (ESLint DS rules, CI "no CSS imports", Piny wersji w import map, Regex na react/jsx-runtime, Playwright smoke)

### ✅ Konwencje i Niezmienniki
- ✅ **Komponenty tylko z @fragment_ui/ui** (zakaz surowego HTML dla form controls)
- ✅ **Tokens-only** (żadnych hardcoded kolorów)
- ✅ **data-ui-id obowiązkowy** (na każdym węźle z generatora; patch/inspektor operują tylko na tym ID)
- ✅ **Recipes są wersjonowane** (.v1, .v2 - nigdy nie nadpisuj istniejących w miejscu)
- ✅ **Undo/Redo** (wszystkie operacje patch muszą być czysto funkcjonalne - immutability)

### ✅ Dokumentacja i Narzędzia
- ✅ **"Gotowce"** - gotowe prompty do wklejenia dla każdego zadania
- ✅ **Szczegółowe AC** (kryteria akceptacji) dla każdego zadania
- ✅ **Kroki implementacji** z przykładami kodu
- ✅ **Kluczowe informacje** (struktura projektu, konwencje kodu, zasady, narzędzia, zależności)

**Następne kroki:**
1. Przejrzyj plan i wybierz zadania do implementacji
2. Zacznij od zadań M1 (P0)
3. Używaj "gotowców" jako punktów wyjścia
4. Aktualizuj plan w miarę postępów
5. Dokumentuj decyzje i zmiany

---

**Dokument utworzony:** Styczeń 2025  
**Wersja:** 2.0 (Zaktualizowany z pełnymi wymaganiami)  
**Status:** Kompleksowy plan implementacji

**Priorytet:** P1  
**Estymacja:** 4-6h  
**Zależności:** Brak (już zaimplementowane podstawy)

#### CO ma być zrobione:
1. Dodaj wizualne wskaźniki podczas nasłuchiwania (pulsująca animacja mikrofonu)
2. Dodaj obsługę wielu języków (PL, EN, DE, FR) z możliwością wyboru
3. Dodaj wyświetlanie interim results w czasie rzeczywistym (opcjonalnie jako placeholder text)
4. Dodaj obsługę komend głosowych ("send", "clear", "stop")
5. Dodaj feedback dźwiękowy (opcjonalnie) przy rozpoczęciu/zakończeniu nasłuchiwania
6. Dodaj obsługę błędów z user-friendly messages

#### DLACZEGO to jest ważne:
- **UX:** Lepsze doświadczenie użytkownika z wizualnymi wskaźnikami
- **Dostępność:** Wsparcie dla użytkowników z różnych krajów
- **Funkcjonalność:** Komendy głosowe zwiększają produktywność
- **Jakość:** Lepsze obsługa błędów zwiększa niezawodność

#### JAK to zaimplementować:

**Plik:** `apps/demo/src/components/playground/playground-right-sidebar.tsx`

**Kroki:**

1. **Dodaj wizualne wskaźniki:**
   ```typescript
   // W komponencie przycisku mikrofonu
   <Mic 
     className={clsx(
       "w-4 h-4",
       isListening && "animate-pulse"
     )} 
     style={{ color: "var(--background-primary)" }} 
   />
   ```

2. **Dodaj wybór języka:**
   ```typescript
   const [recognitionLang, setRecognitionLang] = useState('en-US');
   
   // W useEffect dla recognition
   recognition.lang = recognitionLang;
   
   // Dodaj dropdown w settings lub jako tooltip
   ```

3. **Dodaj wyświetlanie interim results:**
   ```typescript
   const [interimText, setInterimText] = useState('');
   
   recognition.onresult = (event) => {
     // ... existing code ...
     if (interimTranscript) {
       setInterimText(interimTranscript);
       // Opcjonalnie: pokaż jako placeholder lub overlay
     }
   };
   ```

4. **Dodaj komendy głosowe:**
   ```typescript
   const handleVoiceCommand = (transcript: string) => {
     const lower = transcript.toLowerCase().trim();
     if (lower.includes('send') || lower.includes('wyślij')) {
       onSendMessage();
     } else if (lower.includes('clear') || lower.includes('wyczyść')) {
       onInputChange('');
     } else if (lower.includes('stop') || lower.includes('zatrzymaj')) {
       recognitionRef.current?.stop();
     }
   };
   ```

5. **Dodaj user-friendly error messages:**
   ```typescript
   recognition.onerror = (event) => {
     const errorMessages: Record<string, string> = {
       'no-speech': 'No speech detected. Please try again.',
       'audio-capture': 'Microphone not available. Please check permissions.',
       'not-allowed': 'Microphone permission denied. Please enable in browser settings.',
       'network': 'Network error. Please check your connection.',
     };
     toast.error(errorMessages[event.error] || 'Speech recognition error');
     setIsListening(false);
   };
   ```

**Kluczowe informacje:**
- Web Speech API wymaga HTTPS w produkcji (lub localhost w dev)
- Niektóre przeglądarki wymagają `webkitSpeechRecognition`
- Permissions API może być potrzebny do sprawdzenia uprawnień mikrofonu
- Języki: 'en-US', 'pl-PL', 'de-DE', 'fr-FR' (sprawdź wsparcie przeglądarki)

---

### Task 1.2: Rozszerzenie Systemu Patchów DSL

**Priorytet:** P0  
**Estymacja:** 8-12h  
**Zależności:** Obecny system patchów w `apps/demo/app/playground/dsl/patch.ts`

#### CO ma być zrobione:
1. Dodaj nowe typy patchów:
   - `duplicateNode` - duplikowanie węzła
   - `wrapNodes` - opakowanie wielu węzłów
   - `unwrapNode` - usunięcie wrappera
   - `setStyle` - ustawienie inline styles
   - `setClassName` - dodanie/usunięcie klas CSS
   - `reorderChildren` - zmiana kolejności dzieci
2. Ulepsz parser intencji (`patch-parser.ts`) o:
   - Rozpoznawanie "duplicate", "copy", "clone"
   - Rozpoznawanie "wrap", "group", "container"
   - Rozpoznawanie "style", "color", "size"
   - Rozpoznawanie "move up/down", "reorder"
3. Dodaj walidację patchów przed aplikacją
4. Dodaj rollback mechanism dla nieudanych patchów

#### DLACZEGO to jest ważne:
- **Funkcjonalność:** Więcej operacji edycji = bardziej elastyczny system
- **UX:** Użytkownicy mogą wykonywać bardziej złożone modyfikacje
- **Niezawodność:** Walidacja i rollback zapobiegają błędom
- **Rozszerzalność:** Łatwiejsze dodawanie nowych operacji w przyszłości

#### JAK to zaimplementować:

**Pliki:**
- `apps/demo/app/playground/dsl/patch.ts` - rozszerz typ `Patch`
- `apps/demo/app/playground/dsl/patch-parser.ts` - rozszerz parser
- `apps/demo/app/playground/dsl/generator.ts` - upewnij się, że generator obsługuje nowe operacje

**Kroki:**

1. **Rozszerz typ Patch:**
   ```typescript
   export type Patch =
     | { op: "setCopy"; target: NodeRef; path: string; value: string }
     | { op: "addNode"; parent: NodeRef; index?: number; node: any }
     | { op: "removeNode"; target: NodeRef }
     | { op: "moveNode"; target: NodeRef; toParent: NodeRef; index?: number }
     | { op: "setProp"; target: NodeRef; prop: string; value: any }
     | { op: "setToken"; target: NodeRef; token: "space" | "radius" | "color"; value: any }
     | { op: "toggleVariant"; target: NodeRef; variant: string; value?: string }
     | { op: "wrapWith"; target: NodeRef; wrapper: any }
     | { op: "reorder"; parent: NodeRef; from: number; to: number }
     | { op: "renameField"; target: NodeRef; from: string; to: string }
     // NOWE:
     | { op: "duplicateNode"; target: NodeRef; toParent?: NodeRef; index?: number }
     | { op: "wrapNodes"; targets: NodeRef[]; wrapper: any }
     | { op: "unwrapNode"; target: NodeRef }
     | { op: "setStyle"; target: NodeRef; styles: Record<string, string> }
     | { op: "setClassName"; target: NodeRef; className: string; action: "add" | "remove" | "replace" }
     | { op: "reorderChildren"; parent: NodeRef; order: string[] }
   ```

2. **Dodaj implementacje w `applyPatch`:**
   ```typescript
   case "duplicateNode":
     return applyDuplicateNode(newDsl, patch);
   case "wrapNodes":
     return applyWrapNodes(newDsl, patch);
   // ... etc
   ```

3. **Rozszerz parser intencji:**
   ```typescript
   // W patch-parser.ts
   const DUPLICATE_PATTERNS = ['duplicate', 'copy', 'clone', 'duplikuj', 'skopiuj'];
   const WRAP_PATTERNS = ['wrap', 'group', 'container', 'opakuj', 'grupuj'];
   const STYLE_PATTERNS = ['style', 'color', 'size', 'styl', 'kolor', 'rozmiar'];
   
   function detectPatchIntent(command: string): PatchIntent {
     // ... existing logic ...
     if (DUPLICATE_PATTERNS.some(p => command.includes(p))) {
       return { type: 'duplicate', ... };
     }
     // ... etc
   }
   ```

4. **Dodaj walidację:**
   ```typescript
   function validatePatch(dsl: UiDsl, patch: Patch): ValidationResult {
     const node = findNode(dsl, patch.target);
     if (!node) {
       return { valid: false, error: `Node not found: ${JSON.stringify(patch.target)}` };
     }
     // ... additional validation logic
     return { valid: true };
   }
   ```

5. **Dodaj rollback:**
   ```typescript
   function applyPatchesWithRollback(dsl: UiDsl, patches: Patch[]): UiDsl {
     const history: UiDsl[] = [dsl];
     let result = dsl;
     
     for (const patch of patches) {
       const validation = validatePatch(result, patch);
       if (!validation.valid) {
         console.error('Patch validation failed:', validation.error);
         return history[history.length - 1]; // Rollback to last valid state
       }
       
       try {
         result = applyPatch(result, patch);
         history.push(result);
       } catch (error) {
         console.error('Patch application failed:', error);
         return history[history.length - 1]; // Rollback
       }
     }
     
     return result;
   }
   ```

**Kluczowe informacje:**
- Obecny system patchów jest w `apps/demo/app/playground/dsl/patch.ts`
- Parser intencji jest w `apps/demo/app/playground/dsl/patch-parser.ts`
- Wszystkie patchy muszą być idempotentne (można je wykonać wielokrotnie)
- NodeRef może być `{ type: "byPath"; path: string }` lub `{ type: "byTestId"; testId: string }`

---

### Task 1.3: Ulepszenie Systemu Historii (Undo/Redo)

**Priorytet:** P1  
**Estymacja:** 6-8h  
**Zależności:** Obecny system historii w `apps/demo/src/hooks/use-code-history.ts`

#### CO ma być zrobione:
1. Dodaj granularne undo/redo (per patch zamiast per code version)
2. Dodaj wizualizację historii (timeline view)
3. Dodaj możliwość "commitowania" zmian (named checkpoints)
4. Dodaj diff view między wersjami
5. Dodaj możliwość branchowania historii (alternatywne ścieżki)

#### DLACZEGO to jest ważne:
- **UX:** Użytkownicy mogą eksperymentować bez obawy o utratę pracy
- **Produktywność:** Szybsze cofanie/ponawianie zmian
- **Eksperymentowanie:** Branching pozwala na testowanie alternatyw
- **Debugging:** Diff view pomaga zrozumieć zmiany

#### JAK to zaimplementować:

**Pliki:**
- `apps/demo/src/hooks/use-code-history.ts` - rozszerz hook
- `apps/demo/src/components/playground/undo-redo-controls.tsx` - ulepsz UI
- `apps/demo/src/components/playground/code-history-view.tsx` - dodaj timeline view

**Kroki:**

1. **Rozszerz strukturę historii:**
   ```typescript
   interface HistoryEntry {
     id: string;
     timestamp: Date;
     code: string;
     dsl: UiDsl;
     patches: Patch[]; // Lista patchów zastosowanych w tym kroku
     checkpoint?: string; // Nazwa checkpointu (opcjonalnie)
     branch?: string; // Nazwa brancha (opcjonalnie)
   }
   
   interface HistoryState {
     entries: HistoryEntry[];
     currentIndex: number;
     branches: Record<string, number[]>; // Mapowanie branch -> indices
   }
   ```

2. **Dodaj granularne undo/redo:**
   ```typescript
   const undo = useCallback(() => {
     if (currentIndex > 0) {
       const previousEntry = entries[currentIndex - 1];
       setCode(previousEntry.code);
       setDsl(previousEntry.dsl);
       setCurrentIndex(currentIndex - 1);
     }
   }, [currentIndex, entries]);
   ```

3. **Dodaj checkpointing:**
   ```typescript
   const createCheckpoint = useCallback((name: string) => {
     const entry: HistoryEntry = {
       id: generateId(),
       timestamp: new Date(),
       code: currentCode,
       dsl: currentDsl,
       patches: [],
       checkpoint: name,
     };
     // ... add to history
   }, [currentCode, currentDsl]);
   ```

4. **Dodaj diff view:**
   ```typescript
   import { diffLines } from 'diff';
   
   const getDiff = useCallback((fromIndex: number, toIndex: number) => {
     const from = entries[fromIndex];
     const to = entries[toIndex];
     return diffLines(from.code, to.code);
   }, [entries]);
   ```

5. **Dodaj branching:**
   ```typescript
   const createBranch = useCallback((name: string) => {
     const currentEntry = entries[currentIndex];
     const branchEntry: HistoryEntry = {
       ...currentEntry,
       id: generateId(),
       branch: name,
     };
     // ... add to branches map
   }, [currentIndex, entries]);
   ```

**Kluczowe informacje:**
- Obecny hook jest w `apps/demo/src/hooks/use-code-history.ts`
- Używa `localStorage` do persystencji
- Komponent `UndoRedoControls` jest w `apps/demo/src/components/playground/undo-redo-controls.tsx`
- Biblioteka `diff` może być użyta do diff view (może wymagać instalacji)

---

### Task 1.4: Integracja z Prawdziwym AI (OpenAI/Anthropic)

**Priorytet:** P0  
**Estymacja:** 12-16h  
**Zależności:** Obecny system rule-based parsing

#### CO ma być zrobione:
1. Zastąp rule-based parsing prawdziwym AI (OpenAI GPT-4 lub Anthropic Claude)
2. Dodaj system promptów dla AI z kontekstem Fragment UI
3. Dodaj streaming responses dla lepszego UX
4. Dodaj error handling i retry logic
5. Dodaj rate limiting i cost tracking
6. Zachowaj fallback do rule-based dla prostych przypadków

#### DLACZEGO to jest ważne:
- **Jakość:** AI lepiej rozumie intencje użytkownika niż rule-based parsing
- **Elastyczność:** Może obsługiwać bardziej złożone prompty
- **Skalowalność:** Łatwiejsze dodawanie nowych funkcji bez modyfikacji kodu
- **UX:** Streaming responses dają lepsze feedback

#### JAK to zaimplementować:

**Pliki:**
- `apps/demo/app/api/generate/route.ts` - główny endpoint
- `apps/demo/app/api/generate-dsl/route.ts` - endpoint dla DSL
- `apps/demo/app/playground/dsl/ai-parser.ts` - nowy parser AI
- `apps/demo/lib/ai-client.ts` - klient AI

**Kroki:**

1. **Utwórz klienta AI:**
   ```typescript
   // apps/demo/lib/ai-client.ts
   import OpenAI from 'openai';
   
   const openai = new OpenAI({
     apiKey: process.env.OPENAI_API_KEY,
   });
   
   export async function generateDSLFromPrompt(
     prompt: string,
     context: {
       registry: ComponentRegistry;
       tokens: DesignTokens;
       examples?: UiDsl[];
     }
   ): Promise<UiDsl> {
     const systemPrompt = `You are an expert React developer working with Fragment UI Design System.
     
     Available components: ${JSON.stringify(context.registry.components)}
     Design tokens: ${JSON.stringify(context.tokens)}
     
     Generate UI-DSL JSON structure for the following prompt: "${prompt}"
     
     Return ONLY valid JSON matching the UI-DSL schema.`;
     
     const response = await openai.chat.completions.create({
       model: 'gpt-4',
       messages: [
         { role: 'system', content: systemPrompt },
         { role: 'user', content: prompt },
       ],
       response_format: { type: 'json_object' },
       temperature: 0.7,
     });
     
     const dslJson = JSON.parse(response.choices[0].message.content || '{}');
     return validateAndNormalizeDSL(dslJson);
   }
   ```

2. **Dodaj streaming:**
   ```typescript
   export async function* generateDSLStream(
     prompt: string,
     context: AIContext
   ): AsyncGenerator<string, void, unknown> {
     const stream = await openai.chat.completions.create({
       model: 'gpt-4',
       messages: [/* ... */],
       stream: true,
     });
     
     for await (const chunk of stream) {
       const content = chunk.choices[0]?.delta?.content || '';
       if (content) {
         yield content;
       }
     }
   }
   ```

3. **Dodaj error handling:**
   ```typescript
   export async function generateDSLWithRetry(
     prompt: string,
     context: AIContext,
     maxRetries = 3
   ): Promise<UiDsl> {
     for (let attempt = 1; attempt <= maxRetries; attempt++) {
       try {
         return await generateDSLFromPrompt(prompt, context);
       } catch (error) {
         if (attempt === maxRetries) {
           // Fallback to rule-based
           return generateDSLFromPromptRuleBased(prompt, context);
         }
         // Exponential backoff
         await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
       }
     }
     throw new Error('Failed to generate DSL after retries');
   }
   ```

4. **Dodaj rate limiting:**
   ```typescript
   import { Ratelimit } from '@upstash/ratelimit';
   import { Redis } from '@upstash/redis';
   
   const ratelimit = new Ratelimit({
     redis: Redis.fromEnv(),
     limiter: Ratelimit.slidingWindow(10, '1 m'), // 10 requests per minute
   });
   
   export async function checkRateLimit(userId: string): Promise<boolean> {
     const { success } = await ratelimit.limit(userId);
     return success;
   }
   ```

5. **Zaktualizuj endpoint:**
   ```typescript
   // apps/demo/app/api/generate/route.ts
   export async function POST(request: Request) {
     const { prompt, sessionId } = await request.json();
     
     // Check rate limit
     if (!await checkRateLimit(sessionId)) {
       return Response.json({ error: 'Rate limit exceeded' }, { status: 429 });
     }
     
     // Generate DSL with AI
     const dsl = await generateDSLWithRetry(prompt, {
       registry: await getRegistry(),
       tokens: await getTokens(),
     });
     
     // Generate code from DSL
     const code = generateCodeFromDSL(dsl);
     
     return Response.json({ code, dsl });
   }
   ```

**Kluczowe informacje:**
- Obecny system używa rule-based parsing w `apps/demo/app/playground/dsl/parser.ts`
- OpenAI API key musi być w `.env` jako `OPENAI_API_KEY`
- Można użyć `@upstash/ratelimit` i `@upstash/redis` dla rate limiting
- Streaming wymaga `ReadableStream` w Next.js
- Fallback do rule-based powinien być zawsze dostępny

---

## 📦 Kategoria 2: Design System - Nowe Komponenty i Ulepszenia

### Task 2.1: Dodanie Komponentu Data Grid (Zaawansowana Tabela)

**Priorytet:** P1  
**Estymacja:** 16-20h  
**Zależności:** Obecny komponent DataTable

#### CO ma być zrobione:
1. Stwórz nowy komponent `DataGrid` z:
   - Virtualizacją wierszy i kolumn
   - Column resizing i reordering
   - Row selection (single/multi)
   - Inline editing
   - Column filtering i sorting
   - Grouping i aggregation
   - Export do CSV/Excel
   - Pagination lub infinite scroll
2. Dodaj Storybook stories z przykładami
3. Dodaj testy jednostkowe i E2E
4. Dodaj dokumentację API

#### DLACZEGO to jest ważne:
- **Funkcjonalność:** Data Grid jest kluczowy dla aplikacji enterprise
- **Performance:** Virtualizacja pozwala na obsługę dużych zbiorów danych
- **UX:** Inline editing i grouping zwiększają produktywność
- **Kompletność:** Uzupełnia ofertę komponentów data display

#### JAK to zaimplementować:

**Pliki:**
- `packages/ui/src/data-grid.tsx` - główny komponent
- `packages/ui/src/data-grid.stories.tsx` - Storybook stories
- `packages/ui/src/data-grid.test.tsx` - testy
- `docs/api/data-grid.md` - dokumentacja API

**Kroki:**

1. **Stwórz podstawową strukturę:**
   ```typescript
   // packages/ui/src/data-grid.tsx
   import * as React from 'react';
   import { useVirtualizer } from '@tanstack/react-virtual';
   
   export interface DataGridColumn<T = any> {
     id: string;
     header: string;
     accessorKey?: keyof T;
     cell?: (value: any, row: T) => React.ReactNode;
     width?: number;
     minWidth?: number;
     maxWidth?: number;
     sortable?: boolean;
     filterable?: boolean;
     editable?: boolean;
     resizable?: boolean;
   }
   
   export interface DataGridProps<T = any> {
     data: T[];
     columns: DataGridColumn<T>[];
     onRowSelect?: (rows: T[]) => void;
     onCellEdit?: (row: T, column: string, value: any) => void;
     virtualized?: boolean;
     selectable?: 'single' | 'multi' | false;
     // ... więcej props
   }
   
   export function DataGrid<T = any>({
     data,
     columns,
     onRowSelect,
     onCellEdit,
     virtualized = true,
     selectable = false,
   }: DataGridProps<T>) {
     // Implementation
   }
   ```

2. **Dodaj virtualizację:**
   ```typescript
   const rowVirtualizer = useVirtualizer({
     count: data.length,
     getScrollElement: () => scrollElementRef.current,
     estimateSize: () => 40,
     overscan: 10,
   });
   ```

3. **Dodaj column resizing:**
   ```typescript
   const [columnSizes, setColumnSizes] = useState<Record<string, number>>({});
   
   const handleResize = (columnId: string, width: number) => {
     setColumnSizes(prev => ({ ...prev, [columnId]: width }));
   };
   ```

4. **Dodaj inline editing:**
   ```typescript
   const [editingCell, setEditingCell] = useState<{ row: number; column: string } | null>(null);
   
   const handleCellDoubleClick = (row: number, column: string) => {
     setEditingCell({ row, column });
   };
   ```

5. **Dodaj export:**
   ```typescript
   const exportToCSV = () => {
     const csv = [
       columns.map(c => c.header).join(','),
       ...data.map(row => columns.map(c => row[c.accessorKey]).join(','))
     ].join('\n');
     
     const blob = new Blob([csv], { type: 'text/csv' });
     const url = URL.createObjectURL(blob);
     const a = document.createElement('a');
     a.href = url;
     a.download = 'export.csv';
     a.click();
   };
   ```

**Kluczowe informacje:**
- Użyj `@tanstack/react-virtual` dla virtualizacji
- Obecny DataTable jest w `packages/ui/src/data-table.tsx` - można użyć jako referencję
- Wszystkie komponenty muszą być dostępne (a11y) - dodaj ARIA attributes
- Użyj `react-table` lub `@tanstack/react-table` dla logiki tabeli (opcjonalnie)

---

### Task 2.2: Ulepszenie Systemu Formularzy

**Priorytet:** P1  
**Estymacja:** 8-10h  
**Zależności:** Obecne komponenty form (FormField, FormEnhanced, FormArray)

#### CO ma być zrobione:
1. Dodaj `FormWizard` - multi-step formularz z progress indicator
2. Dodaj `FormConditionalLogic` - zaawansowana logika warunkowa
3. Dodaj `FormValidation` - rozszerzona walidacja z custom rules
4. Dodaj `FormAutoSave` - automatyczne zapisywanie draftów
5. Ulepsz `FormArray` o drag & drop dla dynamicznych pól

#### DLACZEGO to jest ważne:
- **UX:** Multi-step forms są bardziej user-friendly dla długich formularzy
- **Funkcjonalność:** Conditional logic pozwala na bardziej złożone formularze
- **Niezawodność:** Lepsza walidacja zapobiega błędom
- **Produktywność:** Auto-save zapobiega utracie danych

#### JAK to zaimplementować:

**Pliki:**
- `packages/ui/src/form-wizard.tsx` - nowy komponent
- `packages/ui/src/form-conditional-logic.tsx` - nowy komponent
- `packages/ui/src/form-validation.ts` - utilities
- `packages/ui/src/form-auto-save.ts` - hook

**Kroki:**

1. **Stwórz FormWizard:**
   ```typescript
   export interface FormWizardStep {
     id: string;
     title: string;
     description?: string;
     fields: React.ReactNode[];
     validation?: () => boolean;
   }
   
   export interface FormWizardProps {
     steps: FormWizardStep[];
     onSubmit: (data: Record<string, any>) => void;
     onStepChange?: (stepIndex: number) => void;
   }
   
   export function FormWizard({ steps, onSubmit, onStepChange }: FormWizardProps) {
     const [currentStep, setCurrentStep] = useState(0);
     const [formData, setFormData] = useState<Record<string, any>>({});
     
     // Implementation with Stepper component
   }
   ```

2. **Dodaj conditional logic:**
   ```typescript
   export interface ConditionalRule {
     field: string;
     operator: 'equals' | 'notEquals' | 'contains' | 'greaterThan' | 'lessThan';
     value: any;
     then: {
       show?: string[];
       hide?: string[];
       setValue?: Record<string, any>;
     };
   }
   
   export function FormConditionalLogic({
     rules,
     formData,
     children,
   }: {
     rules: ConditionalRule[];
     formData: Record<string, any>;
     children: React.ReactNode;
   }) {
     // Evaluate rules and conditionally render
   }
   ```

3. **Rozszerz walidację:**
   ```typescript
   export interface ValidationRule {
     type: 'required' | 'email' | 'minLength' | 'maxLength' | 'pattern' | 'custom';
     value?: any;
     message?: string;
     validator?: (value: any) => boolean;
   }
   
   export function validateField(
     value: any,
     rules: ValidationRule[]
   ): ValidationResult {
     // Validate against all rules
   }
   ```

4. **Dodaj auto-save:**
   ```typescript
   export function useFormAutoSave(
     formData: Record<string, any>,
     key: string,
     interval = 5000
   ) {
     useEffect(() => {
       const timer = setInterval(() => {
         localStorage.setItem(`form-draft-${key}`, JSON.stringify(formData));
       }, interval);
       
       return () => clearInterval(timer);
     }, [formData, key, interval]);
     
     const loadDraft = () => {
       const draft = localStorage.getItem(`form-draft-${key}`);
       return draft ? JSON.parse(draft) : null;
     };
     
     return { loadDraft };
   }
   ```

**Kluczowe informacje:**
- Obecne komponenty form są w `packages/ui/src/form-*.tsx`
- Użyj `Stepper` component dla progress indicator
- Conditional logic powinna być deklaratywna (JSON config)
- Auto-save powinien używać debouncing

---

## 📦 Kategoria 3: Dokumentacja i Portal

### Task 3.1: Uzupełnienie Dokumentacji API

**Priorytet:** P1  
**Estymacja:** 6-8h  
**Zależności:** Auto-generated API docs w `docs/api/`

#### CO ma być zrobione:
1. Sprawdź wszystkie 35+ plików API docs
2. Uzupełnij brakujące przykłady użycia
3. Dodaj więcej przykładów dla edge cases
4. Dodaj sekcję "Common Patterns" dla każdego komponentu
5. Dodaj sekcję "Accessibility" z przykładami a11y
6. Dodaj sekcję "Performance Tips"

#### DLACZEGO to jest ważne:
- **Developer Experience:** Lepsza dokumentacja = szybszy development
- **Adopcja:** Przykłady zachęcają do użycia
- **Jakość:** Accessibility i performance tips poprawiają jakość kodu
- **Kompletność:** Uzupełnia auto-generated docs

#### JAK to zaimplementować:

**Pliki:**
- `docs/api/*.md` - wszystkie pliki API docs
- `scripts/generate-api-docs.mjs` - może wymagać rozszerzenia

**Kroki:**

1. **Dla każdego komponentu dodaj sekcje:**
   ```markdown
   ## Common Patterns
   
   ### Basic Usage
   ```tsx
   // Example
   ```
   
   ### Advanced Usage
   ```tsx
   // Example
   ```
   
   ## Accessibility
   
   - ARIA attributes: ...
   - Keyboard navigation: ...
   - Screen reader support: ...
   
   ## Performance Tips
   
   - Use React.memo for large lists
   - Virtualize for 100+ items
   - Lazy load for heavy components
   ```

2. **Dodaj więcej przykładów:**
   - Edge cases (empty states, error states, loading states)
   - Integration examples (z innymi komponentami)
   - Real-world use cases

3. **Uzupełnij auto-generator:**
   ```javascript
   // scripts/generate-api-docs.mjs
   // Dodaj sekcje dla Common Patterns, Accessibility, Performance
   ```

**Kluczowe informacje:**
- Auto-generated docs są w `docs/api/`
- Generator jest w `scripts/generate-api-docs.mjs`
- Wszystkie komponenty powinny mieć przykłady
- Accessibility info jest kluczowe dla compliance

---

### Task 3.2: Dodanie Interaktywnych Przewodników

**Priorytet:** P2  
**Estymacja:** 10-12h  
**Zależności:** Portal w `apps/www/`

#### CO ma być zrobione:
1. Stwórz interaktywne przewodniki (tutorials) w portalu
2. Dodaj "Getting Started" guide z krokami
3. Dodaj "Building Your First Component" tutorial
4. Dodaj "Advanced Patterns" guide
5. Dodaj możliwość zapisywania postępu (localStorage)

#### DLACZEGO to jest ważne:
- **Onboarding:** Nowi użytkownicy szybciej się uczą
- **Edukacja:** Przewodniki uczą best practices
- **Engagement:** Interaktywne przewodniki są bardziej angażujące
- **Retention:** Lepsze onboarding = wyższa retencja

#### JAK to zaimplementować:

**Pliki:**
- `apps/www/app/docs/tutorials/page.tsx` - strona z przewodnikami
- `apps/www/app/docs/tutorials/[id]/page.tsx` - pojedynczy przewodnik
- `apps/www/src/components/tutorial/*` - komponenty tutorial

**Kroki:**

1. **Stwórz strukturę tutorial:**
   ```typescript
   interface TutorialStep {
     id: string;
     title: string;
     content: React.ReactNode;
     codeExample?: string;
     interactive?: boolean;
     validation?: (userInput: any) => boolean;
   }
   
   interface Tutorial {
     id: string;
     title: string;
     description: string;
     steps: TutorialStep[];
     estimatedTime: number;
   }
   ```

2. **Dodaj progress tracking:**
   ```typescript
   const useTutorialProgress = (tutorialId: string) => {
     const [progress, setProgress] = useState(() => {
       const saved = localStorage.getItem(`tutorial-${tutorialId}`);
       return saved ? JSON.parse(saved) : { currentStep: 0, completed: false };
     });
     
     const markStepComplete = (stepId: string) => {
       // Update progress
     };
     
     return { progress, markStepComplete };
   };
   ```

3. **Dodaj interaktywne przykłady:**
   ```typescript
   <TutorialStep
     title="Create a Button"
     interactive
     codeExample={buttonCode}
     validation={(code) => {
       return code.includes('Button') && code.includes('variant');
     }}
   />
   ```

**Kluczowe informacje:**
- Portal jest w `apps/www/`
- Użyj istniejących komponentów do budowy UI
- Progress powinien być zapisywany w localStorage
- Interaktywne przykłady mogą używać CodeSandbox/StackBlitz

---

## 📦 Kategoria 4: Testowanie i Jakość

### Task 4.1: Zwiększenie Coverage Testów

**Priorytet:** P1  
**Estymacja:** 12-16h  
**Zależności:** Obecne testy w `packages/ui/src/**/*.test.tsx`

#### CO ma być zrobione:
1. Zwiększ coverage do minimum 80% dla wszystkich komponentów
2. Dodaj testy dla edge cases
3. Dodaj testy integracyjne dla complex workflows
4. Dodaj testy performance dla virtualized components
5. Dodaj testy accessibility dla wszystkich komponentów

#### DLACZEGO to jest ważne:
- **Jakość:** Wyższe coverage = mniej bugów
- **Niezawodność:** Testy zapobiegają regresjom
- **Confidence:** Możliwość refaktoringu bez obawy
- **Compliance:** Accessibility tests są wymagane

#### JAK to zaimplementować:

**Pliki:**
- `packages/ui/src/**/*.test.tsx` - wszystkie pliki testów
- `packages/ui/vitest.config.ts` - konfiguracja testów

**Kroki:**

1. **Dodaj testy dla edge cases:**
   ```typescript
   describe('Button edge cases', () => {
     it('handles undefined onClick gracefully', () => {
       render(<Button onClick={undefined}>Click</Button>);
       // Test
     });
     
     it('handles rapid clicks', async () => {
       // Test debouncing
     });
   });
   ```

2. **Dodaj testy integracyjne:**
   ```typescript
   describe('Form integration', () => {
     it('submits form with all fields', async () => {
       // Test full form workflow
     });
   });
   ```

3. **Dodaj testy performance:**
   ```typescript
   describe('DataTable performance', () => {
     it('renders 1000 rows efficiently', () => {
       const start = performance.now();
       render(<DataTable data={largeDataset} />);
       const end = performance.now();
       expect(end - start).toBeLessThan(100); // 100ms threshold
     });
   });
   ```

4. **Dodaj testy accessibility:**
   ```typescript
   import { axe, toHaveNoViolations } from 'vitest-axe';
   
   expect.extend(toHaveNoViolations);
   
   it('has no accessibility violations', async () => {
     const { container } = render(<Component />);
     const results = await axe(container);
     expect(results).toHaveNoViolations();
   });
   ```

**Kluczowe informacje:**
- Obecne testy używają Vitest + React Testing Library
- A11y tests używają `vitest-axe` i `axe-core`
- Coverage można sprawdzić przez `pnpm test --coverage`
- Wszystkie komponenty powinny mieć minimum 80% coverage

---

### Task 4.2: Dodanie E2E Testów dla Playground

**Priorytet:** P1  
**Estymacja:** 8-10h  
**Zależności:** Playwright w `apps/demo/`

#### CO ma być zrobione:
1. Dodaj E2E testy dla głównych workflows Playground:
   - Generowanie komponentu z promptu
   - Edycja komponentu przez chat
   - Drag & drop w tree view
   - Export do GitHub
   - Undo/redo
2. Dodaj testy dla edge cases
3. Dodaj visual regression tests
4. Dodaj performance tests

#### DLACZEGO to jest ważne:
- **Niezawodność:** E2E testy wykrywają problemy w całym flow
- **Regression:** Zapobiegają regresjom przy zmianach
- **Confidence:** Pewność, że główne funkcje działają
- **Documentation:** Testy dokumentują expected behavior

#### JAK to zaimplementować:

**Pliki:**
- `apps/demo/e2e/playground.spec.ts` - główne testy
- `apps/demo/e2e/playground-generate.spec.ts` - testy generowania
- `apps/demo/e2e/playground-edit.spec.ts` - testy edycji

**Kroki:**

1. **Dodaj test generowania:**
   ```typescript
   import { test, expect } from '@playwright/test';
   
   test('generates component from prompt', async ({ page }) => {
     await page.goto('/playground');
     
     // Type prompt
     await page.fill('[data-testid="prompt-input"]', 'Create a button');
     
     // Click send
     await page.click('[data-testid="send-button"]');
     
     // Wait for generation
     await page.waitForSelector('[data-testid="preview-container"]');
     
     // Verify component is rendered
     const button = page.locator('button');
     await expect(button).toBeVisible();
   });
   ```

2. **Dodaj test edycji:**
   ```typescript
   test('edits component via chat', async ({ page }) => {
     // Generate component first
     // Then send edit command
     await page.fill('[data-testid="prompt-input"]', 'Change button color to red');
     await page.click('[data-testid="send-button"]');
     
     // Verify change
     const button = page.locator('button');
     await expect(button).toHaveClass(/bg-red/);
   });
   ```

3. **Dodaj visual regression:**
   ```typescript
   import { test } from '@playwright/test';
   
   test('visual regression - generated component', async ({ page }) => {
     await page.goto('/playground');
     // Generate component
     await expect(page).toHaveScreenshot('generated-component.png');
   });
   ```

**Kluczowe informacje:**
- Playwright jest już skonfigurowany w `apps/demo/playwright.config.ts`
- Użyj `data-testid` attributes dla selektorów
- Visual regression wymaga baseline screenshots
- Testy powinny być izolowane (clean state przed każdym testem)

---

## 📦 Kategoria 5: Performance i Optymalizacje

### Task 5.1: Optymalizacja Bundle Size

**Priorytet:** P1  
**Estymacja:** 6-8h  
**Zależności:** Obecny bundle analysis w `scripts/analyze-bundle-size.mjs`

#### CO ma być zrobione:
1. Przeanalizuj bundle size wszystkich komponentów
2. Zidentyfikuj duże zależności i znajdź alternatywy
3. Dodaj code splitting dla Playground
4. Dodaj lazy loading dla heavy components
5. Optymalizuj imports (tree-shaking)
6. Dodaj bundle size limits do CI

#### DLACZEGO to jest ważne:
- **Performance:** Mniejsze bundle = szybsze ładowanie
- **UX:** Szybsze ładowanie = lepsze doświadczenie
- **Cost:** Mniejsze bundle = mniejsze koszty hostingu/CDN
- **SEO:** Szybsze strony = lepsze SEO

#### JAK to zaimplementować:

**Pliki:**
- `scripts/analyze-bundle-size.mjs` - rozszerz analizę
- `apps/demo/next.config.mjs` - dodaj code splitting
- `.github/workflows/ci.yml` - dodaj bundle size check

**Kroki:**

1. **Rozszerz bundle analysis:**
   ```javascript
   // scripts/analyze-bundle-size.mjs
   import { analyze } from 'webpack-bundle-analyzer';
   
   // Analyze and identify large dependencies
   const report = await analyze({
     // Configuration
   });
   
   // Generate report with recommendations
   ```

2. **Dodaj code splitting:**
   ```javascript
   // apps/demo/next.config.mjs
   export default {
     webpack: (config) => {
       config.optimization.splitChunks = {
         chunks: 'all',
         cacheGroups: {
           playground: {
             test: /[\\/]playground[\\/]/,
             name: 'playground',
             chunks: 'all',
           },
         },
       };
       return config;
     },
   };
   ```

3. **Dodaj lazy loading:**
   ```typescript
   // apps/demo/app/playground/page.tsx
   const PlaygroundPreviewCode = dynamic(
     () => import('@/components/playground/playground-preview-code'),
     { ssr: false }
   );
   ```

4. **Dodaj bundle size limits:**
   ```yaml
   # .github/workflows/ci.yml
   - name: Check bundle size
     run: |
       pnpm bundle:analyze
       # Fail if bundle exceeds limits
   ```

**Kluczowe informacje:**
- Obecny script jest w `scripts/analyze-bundle-size.mjs`
- Użyj `webpack-bundle-analyzer` lub `@next/bundle-analyzer`
- Bundle limits powinny być w `package.json` lub config file
- Code splitting w Next.js jest automatyczne, ale można go optymalizować

---

### Task 5.2: Optymalizacja Renderowania Playground

**Priorytet:** P2  
**Estymacja:** 8-10h  
**Zależności:** Obecny Playground w `apps/demo/app/playground/`

#### CO ma być zrobione:
1. Dodaj React.memo dla komponentów Playground
2. Optymalizuj re-rendery przez useMemo/useCallback
3. Dodaj virtualization dla długich list (chat history, projects)
4. Optymalizuj preview rendering (debounce updates)
5. Dodaj performance monitoring

#### DLACZEGO to jest ważne:
- **Performance:** Mniej re-renderów = szybszy UI
- **UX:** Płynniejszy interfejs
- **Skalowalność:** Możliwość obsługi większych projektów
- **Resource Usage:** Mniejsze zużycie CPU/memory

#### JAK to zaimplementować:

**Pliki:**
- `apps/demo/src/components/playground/*.tsx` - wszystkie komponenty
- `apps/demo/app/playground/page.tsx` - główny komponent

**Kroki:**

1. **Dodaj React.memo:**
   ```typescript
   export const PlaygroundLeftSidebar = React.memo(function PlaygroundLeftSidebar({
     // props
   }) {
     // component
   }, (prevProps, nextProps) => {
     // Custom comparison if needed
     return prevProps.selectedIds === nextProps.selectedIds &&
            prevProps.expandedIds === nextProps.expandedIds;
   });
   ```

2. **Optymalizuj hooks:**
   ```typescript
   const handleSendMessage = useCallback(() => {
     // Logic
   }, [inputMessage, isGenerating]); // Only recreate if dependencies change
   
   const filteredProjects = useMemo(() => {
     return projects.filter(/* ... */);
   }, [projects, filter]);
   ```

3. **Dodaj virtualization:**
   ```typescript
   import { useVirtualizer } from '@tanstack/react-virtual';
   
   const virtualizer = useVirtualizer({
     count: messages.length,
     getScrollElement: () => scrollElementRef.current,
     estimateSize: () => 60,
   });
   ```

4. **Dodaj debouncing:**
   ```typescript
   const debouncedUpdatePreview = useMemo(
     () => debounce((code: string) => {
       updatePreview(code);
     }, 300),
     []
   );
   ```

**Kluczowe informacje:**
- Użyj React DevTools Profiler do identyfikacji problemów
- Virtualization dla list > 100 items
- Debouncing dla częstych updates (preview, search)
- useMemo dla expensive calculations

---

## 📦 Kategoria 6: Narzędzia Deweloperskie

### Task 6.1: Rozszerzenie MCP Server

**Priorytet:** P1  
**Estymacja:** 10-12h  
**Zależności:** Obecny MCP Server w `packages/mcp-server/`

#### CO ma być zrobione:
1. Dodaj nowe tools do MCP Server:
   - `apply_patch` - aplikowanie patchów DSL
   - `get_history` - pobranie historii zmian
   - `undo_redo` - undo/redo operations
   - `get_selection` - pobranie aktualnej selekcji
   - `set_selection` - ustawienie selekcji
   - `validate_dsl` - walidacja DSL
   - `suggest_improvements` - sugestie ulepszeń
2. Ulepsz istniejące tools
3. Dodaj error handling i validation
4. Dodaj rate limiting

#### DLACZEGO to jest ważne:
- **AI Integration:** Więcej tools = lepsza integracja z AI
- **Funkcjonalność:** AI może wykonywać bardziej złożone operacje
- **UX:** Lepsze wsparcie AI dla użytkowników
- **Rozszerzalność:** Łatwiejsze dodawanie nowych funkcji

#### JAK to zaimplementować:

**Pliki:**
- `packages/mcp-server/src/*.ts` - wszystkie pliki MCP Server
- `packages/mcp-server/src/tools.ts` - definicje tools

**Kroki:**

1. **Dodaj nowe tools:**
   ```typescript
   // packages/mcp-server/src/tools.ts
   export const tools = [
     // Existing tools...
     {
       name: 'apply_patch',
       description: 'Apply a patch to the current DSL',
       inputSchema: {
         type: 'object',
         properties: {
           patch: { type: 'object', description: 'Patch to apply' },
           dsl: { type: 'object', description: 'Current DSL' },
         },
         required: ['patch', 'dsl'],
       },
       handler: async (args) => {
         const { patch, dsl } = args;
         const result = applyPatch(dsl, patch);
         return { success: true, dsl: result };
       },
     },
     // ... more tools
   ];
   ```

2. **Dodaj error handling:**
   ```typescript
   const safeHandler = async (handler: Function, args: any) => {
     try {
       return await handler(args);
     } catch (error) {
       return {
         success: false,
         error: error.message,
       };
     }
   };
   ```

3. **Dodaj validation:**
   ```typescript
   const validateToolInput = (tool: Tool, input: any) => {
     // Validate against inputSchema
     const errors = validate(input, tool.inputSchema);
     if (errors.length > 0) {
       throw new Error(`Invalid input: ${errors.join(', ')}`);
     }
   };
   ```

**Kluczowe informacje:**
- MCP Server używa Model Context Protocol
- Tools są definiowane jako JSON Schema
- Handler functions są async
- Error handling jest kluczowy dla reliability

---

### Task 6.2: Ulepszenie VS Code Extension

**Priorytet:** P2  
**Estymacja:** 8-10h  
**Zależności:** Obecna extension w `packages/vscode-extension/`

#### CO ma być zrobione:
1. Dodaj więcej code actions:
   - Convert HTML to Fragment UI components
   - Extract component
   - Add missing props
   - Fix accessibility issues
2. Ulepsz IntelliSense:
   - Better prop suggestions
   - Context-aware completions
   - Import suggestions
3. Dodaj diagnostics:
   - Warnings for deprecated props
   - Errors for invalid prop combinations
   - Suggestions for best practices

#### DLACZEGO to jest ważne:
- **Developer Experience:** Lepsze narzędzia = szybszy development
- **Jakość:** Diagnostics zapobiegają błędom
- **Adopcja:** Lepsze narzędzia zachęcają do użycia
- **Productivity:** Code actions oszczędzają czas

#### JAK to zaimplementować:

**Pliki:**
- `packages/vscode-extension/src/*.ts` - wszystkie pliki extension
- `packages/vscode-extension/src/code-actions.ts` - code actions
- `packages/vscode-extension/src/diagnostics.ts` - diagnostics

**Kroki:**

1. **Dodaj code actions:**
   ```typescript
   // packages/vscode-extension/src/code-actions.ts
   vscode.languages.registerCodeActionsProvider('typescriptreact', {
     provideCodeActions(document, range, context) {
       const actions: vscode.CodeAction[] = [];
       
       // Convert HTML to Fragment UI
       if (isHTMLTag(document, range)) {
         actions.push({
           title: 'Convert to Fragment UI component',
           command: 'fragment-ui.convert-html',
         });
       }
       
       return actions;
     },
   });
   ```

2. **Ulepsz IntelliSense:**
   ```typescript
   vscode.languages.registerCompletionItemProvider('typescriptreact', {
     provideCompletionItems(document, position) {
       // Get context
       const context = getContext(document, position);
       
       // Suggest props based on context
       return getPropSuggestions(context);
     },
   });
   ```

3. **Dodaj diagnostics:**
   ```typescript
   const diagnostics = vscode.languages.createDiagnosticCollection('fragment-ui');
   
   function updateDiagnostics(document: vscode.TextDocument) {
     const issues = analyzeDocument(document);
     diagnostics.set(document.uri, issues);
   }
   ```

**Kluczowe informacje:**
- Extension używa VS Code API
- Code actions wymagają commands
- IntelliSense używa CompletionItemProvider
- Diagnostics używają DiagnosticCollection

---

## 📋 Priorytetyzacja i Harmonogram

### Faza 1: Krytyczne (P0) - 2-3 tygodnie
1. Task 1.4: Integracja z Prawdziwym AI
2. Task 1.2: Rozszerzenie Systemu Patchów DSL

### Faza 2: Wysokie (P1) - 4-6 tygodni
1. Task 1.1: Ulepszenie Systemu Rozpoznawania Mowy
2. Task 1.3: Ulepszenie Systemu Historii
3. Task 2.1: Dodanie Komponentu Data Grid
4. Task 2.2: Ulepszenie Systemu Formularzy
5. Task 3.1: Uzupełnienie Dokumentacji API
6. Task 4.1: Zwiększenie Coverage Testów
7. Task 4.2: Dodanie E2E Testów dla Playground
8. Task 5.1: Optymalizacja Bundle Size
9. Task 6.1: Rozszerzenie MCP Server

### Faza 3: Średnie (P2) - 2-3 tygodnie
1. Task 3.2: Dodanie Interaktywnych Przewodników
2. Task 5.2: Optymalizacja Renderowania Playground
3. Task 6.2: Ulepszenie VS Code Extension

---

## 🔑 Kluczowe Informacje dla Co-Pilota

### Struktura Projektu
- **Monorepo:** pnpm workspaces
- **Build:** Turbo
- **TypeScript:** 5.5.0
- **React:** 18.x
- **Next.js:** 14.x (apps)
- **Testing:** Vitest + Playwright

### Konwencje Kodu
- **Components:** PascalCase, w `packages/ui/src/`
- **Hooks:** camelCase z prefixem `use`, w `apps/demo/src/hooks/`
- **Utils:** camelCase, w `apps/demo/src/lib/`
- **Types:** PascalCase interfaces, w `*.ts` files
- **Tests:** `*.test.tsx` obok komponentów

### Zasady
1. **Zero placeholderów** - jeśli brak danych, dodaj `GAP:` w komentarzu
2. **Type safety** - wszystkie funkcje muszą być typowane
3. **Accessibility** - wszystkie komponenty muszą być a11y compliant
4. **Testing** - nowe funkcje wymagają testów
5. **Documentation** - nowe API wymagają dokumentacji

### Narzędzia
- **Linting:** ESLint z custom rules
- **Formatting:** Prettier
- **Type checking:** TypeScript strict mode
- **Bundle analysis:** `pnpm bundle:analyze`
- **Testing:** `pnpm test`

### Zależności
- **UI Components:** `@fragment_ui/ui`
- **Design Tokens:** `@fragment_ui/tokens`
- **Blocks:** `@fragment_ui/blocks`
- **Registry:** `packages/registry/registry.json`

---

## 📝 Notatki Końcowe

Ten plan jest **żywy** i powinien być aktualizowany w miarę postępów. Każde zadanie powinno być:
1. **Zrozumiałe** - jasne wymagania
2. **Wykonalne** - z konkretnymi krokami
3. **Testowalne** - z kryteriami akceptacji
4. **Dokumentowane** - z przykładami i wyjaśnieniami

**Następne kroki:**
1. Przejrzyj plan i wybierz zadania do implementacji
2. Zacznij od zadań P0 (krytyczne)
3. Aktualizuj plan w miarę postępów
4. Dokumentuj decyzje i zmiany

---

**Dokument utworzony:** Styczeń 2025  
**Wersja:** 1.0  
**Status:** Propozycja do implementacji

