# Playground AI v1.1 — Plan Implementacji
## Conversational UI Editing

**Data utworzenia:** 2025-01-XX  
**Status:** Planowanie  
**Wersja specyfikacji:** v1.1

---

## 📋 Analiza Obecnego Stanu

### ✅ Co już mamy:
1. **UI-DSL** — podstawowa struktura (form, page, table, dashboard)
2. **Parser** — rule-based parsing promptów → UI-DSL
3. **Generator** — UI-DSL → TSX (Fragment UI)
4. **Preview** — same-origin iframe z esbuild-wasm
5. **A11y check** — axe-core w worker.ts
6. **MCP Server** — podstawowe narzędzia (get_component_info, suggest_component, validate_code, generate_component, get_tokens)
7. **Chat UI** — interfejs rozmowy z AI Assistant

### ❌ Czego brakuje:
1. **ID w węzłach DSL** — brak stabilnych identyfikatorów
2. **Patch API** — brak operacji edycji (setCopy, addNode, moveNode, etc.)
3. **Historia** — brak undo/redo i commitów
4. **Selekcja** — brak możliwości zaznaczania elementów w preview
5. **Dwukierunkowość** — brak synchronizacji TSX → DSL
6. **NLU → Patch** — brak interpretacji języka naturalnego na operacje patch
7. **Layout operations** — brak operacji na layoutach (stack, grid, two-column)
8. **i18n copy store** — brak zarządzania kopią i tłumaczeniami
9. **AST Parser** — brak parsowania TSX → DSL
10. **MCP Edit Tools** — brak narzędzi edit/selection/history w MCP

---

## 🎯 Cel Implementacji

Przekształcenie Playground AI z jednorazowego generatora w **konwersacyjny edytor UI**, gdzie:
- Użytkownik może modyfikować wygenerowany UI przez rozmowę
- Wszystkie zmiany są śledzone w historii
- DSL jest źródłem prawdy, TSX jest pochodną
- Możliwa jest dwukierunkowa synchronizacja

---

## 📐 Architektura v1.1

```
apps/demo/app/playground/
├── page.tsx                    # UI z chat + preview + selection
├── dsl/
│   ├── types.ts                # ✨ Rozszerzone o id, layout, data-test-id
│   ├── parser.ts               # ✨ Rozszerzone o NLU → Patch
│   ├── generator.ts            # ✨ Rozszerzone o data-ui-id, minimal diff
│   ├── patch.ts                # 🆕 Patch API (operacje edycji)
│   ├── history.ts              # 🆕 Historia commitów, undo/redo
│   └── ast-sync.ts             # 🆕 AST parser TSX → DSL
├── runtime/
│   ├── iframe.html             # ✨ Obsługa selection (klik → postMessage)
│   ├── worker.ts               # ✨ Highlight selection, minimal re-render
│   └── bridge.ts               # ✨ Selection API
└── mcp/
    ├── edit.ts                 # 🆕 MCP edit tools
    ├── selection.ts            # 🆕 MCP selection tools
    └── history.ts              # 🆕 MCP history tools
```

---

## 🚀 Plan Implementacji (3 Kroki)

### **KROK 1: Fundamenty (1-2 dni)**

#### 1.1 Rozszerzenie DSL o ID i metadata
**Plik:** `apps/demo/app/playground/dsl/types.ts`

```typescript
// Dodaj do UiCommon:
export type UiCommon = {
  id: string;                    // UUID v4 - stabilny identyfikator
  key?: string;                  // React key
  name?: string;                 // Opcjonalna nazwa (dla refactoring)
  "data-test-id"?: string;       // Dla testów Playwright
  title?: string;
  layout?: { 
    maxWidth?: "sm" | "md" | "lg" | "xl"; 
    gap?: number;
    type?: "stack" | "grid" | "two-column";  // 🆕 Typ layoutu
    columns?: number;            // 🆕 Dla grid
    colSpan?: number;            // 🆕 Dla grid items
  };
  // ... reszta
};
```

**Zadania:**
- [ ] Dodać `id: string` do wszystkich typów DSL
- [ ] Dodać `key?`, `name?`, `data-test-id?` do UiCommon
- [ ] Rozszerzyć `layout` o `type`, `columns`, `colSpan`
- [ ] Zaktualizować schema validation
- [ ] Zaktualizować parser, aby generował UUID dla każdego węzła
- [ ] Zaktualizować generator, aby dodawał `data-ui-id` do wygenerowanego TSX

#### 1.2 Implementacja Patch API
**Plik:** `apps/demo/app/playground/dsl/patch.ts` (nowy)

```typescript
export type NodeRef = 
  | { type: "byId"; id: string }
  | { type: "byPath"; path: string }
  | { type: "byTestId"; testId: string };

export type Patch =
  | { op: "setCopy"; target: NodeRef; path: string; value: string }
  | { op: "addNode"; parent: NodeRef; index?: number; node: UiNode }
  | { op: "removeNode"; target: NodeRef }
  | { op: "moveNode"; target: NodeRef; toParent: NodeRef; index?: number }
  | { op: "setProp"; target: NodeRef; prop: string; value: any }
  | { op: "setToken"; target: NodeRef; token: "space" | "radius" | "color"; value: any }
  | { op: "toggleVariant"; target: NodeRef; variant: string; value?: string }
  | { op: "wrapWith"; target: NodeRef; wrapper: UiNode }
  | { op: "reorder"; parent: NodeRef; from: number; to: number }
  | { op: "renameField"; target: NodeRef; from: string; to: string };

export function applyPatch(dsl: UiDsl, patch: Patch): UiDsl;
export function applyPatches(dsl: UiDsl, patches: Patch[]): UiDsl;
```

**Zadania:**
- [ ] Stworzyć typy `NodeRef` i `Patch`
- [ ] Zaimplementować `findNode(dsl, ref: NodeRef)` — znajdowanie węzła po ref
- [ ] Zaimplementować `applyPatch(dsl, patch)` — aplikowanie pojedynczego patcha
- [ ] Zaimplementować `applyPatches(dsl, patches)` — transakcyjne aplikowanie wielu patchy
- [ ] Dodać walidację po każdej operacji
- [ ] Dodać testy jednostkowe dla każdej operacji patch

#### 1.3 Podstawowa selekcja w Preview
**Pliki:** 
- `apps/demo/src/components/same-origin-preview.tsx`
- `apps/demo/app/playground/runtime/worker.ts`

**Zadania:**
- [ ] Dodać `data-ui-id` do każdego wygenerowanego elementu w generator.ts
- [ ] W worker.ts: dodać event listener na kliknięcia w preview
- [ ] Wysyłać `postMessage` z `type: "select", id: string` do parent
- [ ] W same-origin-preview.tsx: obsłużyć wiadomość i ustawić selection state
- [ ] Dodać CSS highlight dla zaznaczonego elementu (outline/border)
- [ ] Dodać przycisk "Clear selection" w UI

#### 1.4 MCP Edit Tools (podstawowe)
**Plik:** `packages/mcp-server/src/edit.ts` (nowy)

```typescript
// MCP Tool: edit.apply
{
  name: "edit_apply",
  description: "Apply patches to UI-DSL",
  inputSchema: {
    type: "object",
    properties: {
      patches: { type: "array", items: { type: "object" } },
      dsl: { type: "object" }
    }
  }
}

// MCP Tool: edit.find
{
  name: "edit_find",
  description: "Find nodes by query",
  inputSchema: {
    type: "object",
    properties: {
      query: {
        type: "object",
        properties: {
          byText: { type: "string" },
          byRole: { type: "string" },
          byProp: { type: "array" }
        }
      }
    }
  }
}
```

**Zadania:**
- [ ] Stworzyć `packages/mcp-server/src/edit.ts`
- [ ] Zaimplementować `edit_apply` tool
- [ ] Zaimplementować `edit_find` tool
- [ ] Zarejestrować narzędzia w `packages/mcp-server/src/index.ts`
- [ ] Dodać testy

---

### **KROK 2: Historia i Walidacja (1-2 dni)**

#### 2.1 System Historii (Undo/Redo)
**Plik:** `apps/demo/app/playground/dsl/history.ts` (nowy)

```typescript
export type Commit = {
  id: string;                    // UUID v4
  summary: string;                // Krótki opis zmian
  patches: Patch[];
  dsl: UiDsl;                     // Snapshot DSL po commit
  at: Date;
  author: "user" | "copilot";
};

export class History {
  private commits: Commit[] = [];
  private currentIndex: number = -1;

  commit(patches: Patch[], dsl: UiDsl, summary: string, author: "user" | "copilot"): Commit;
  undo(): UiDsl | null;
  redo(): UiDsl | null;
  list(): Commit[];
  checkout(id: string): UiDsl | null;
}
```

**Zadania:**
- [ ] Stworzyć typ `Commit` i klasę `History`
- [ ] Zaimplementować `commit()` — zapisanie zmian
- [ ] Zaimplementować `undo()` — cofnięcie do poprzedniego commit
- [ ] Zaimplementować `redo()` — przywrócenie cofniętego commit
- [ ] Zaimplementować `list()` — lista wszystkich commitów
- [ ] Zaimplementować `checkout()` — przełączenie na konkretny commit
- [ ] Dodać UI dla Undo/Redo w `page.tsx`
- [ ] Dodać UI dla listy historii (sidebar)

#### 2.2 Walidacja po edycji
**Pliki:**
- `apps/demo/app/playground/dsl/patch.ts`
- `apps/demo/app/playground/page.tsx`

**Zadania:**
- [ ] Po `applyPatches()` uruchomić walidację DSL (schema validation)
- [ ] Po regeneracji TSX uruchomić ESLint (DS rules)
- [ ] Po renderze uruchomić axe-core (a11y check)
- [ ] Wyświetlić wyniki walidacji w UI (Terminal/Accessibility tabs)
- [ ] Zablokować commit, jeśli są krytyczne błędy (opcjonalnie)

#### 2.3 MCP History Tools
**Plik:** `packages/mcp-server/src/history.ts` (nowy)

**Zadania:**
- [ ] Stworzyć `packages/mcp-server/src/history.ts`
- [ ] Zaimplementować `history_list` tool
- [ ] Zaimplementować `history_checkout` tool
- [ ] Zarejestrować w MCP server

#### 2.4 Rozszerzenie operacji Patch
**Plik:** `apps/demo/app/playground/dsl/patch.ts`

**Zadania:**
- [ ] Zaimplementować `reorder` — zmiana kolejności dzieci
- [ ] Zaimplementować `wrapWith` — owijanie w Card/two-column
- [ ] Zaimplementować `setToken` — zmiana tokenów layoutowych
- [ ] Dodać testy dla nowych operacji

---

### **KROK 3: NLU i Zaawansowane Funkcje (1-2 dni)**

#### 3.1 NLU → Patch (Interpretacja języka naturalnego)
**Plik:** `apps/demo/app/playground/dsl/nlu.ts` (nowy)

```typescript
export type Intent = 
  | { type: "setCopy"; target: NodeRef; value: string }
  | { type: "addNode"; parent: NodeRef; node: Partial<UiNode> }
  | { type: "moveNode"; target: NodeRef; toParent: NodeRef }
  | { type: "setVariant"; target: NodeRef; variant: string; value: string }
  | { type: "setToken"; target: NodeRef; token: string; value: any }
  | { type: "reorder"; parent: NodeRef; from: number; to: number };

export function interpretPrompt(
  prompt: string, 
  dsl: UiDsl, 
  selection: NodeRef | null
): { intent: Intent; patches: Patch[]; ambiguity?: Ambiguity };
```

**Zadania:**
- [ ] Stworzyć typy `Intent` i `Ambiguity`
- [ ] Zaimplementować `interpretPrompt()` — mapowanie NL → Intent
- [ ] Obsłużyć niejednoznaczność (np. dwa "Zapisz") — zwrócić kandydatów
- [ ] Zintegrować z `handleSendMessage()` w `page.tsx`
- [ ] Dodać UI dla doprecyzowania (gdy jest niejednoznaczność)

#### 3.2 Layout Operations
**Plik:** `apps/demo/app/playground/dsl/patch.ts`

**Zadania:**
- [ ] Rozszerzyć `moveNode` o obsługę layoutów (stack, grid, two-column)
- [ ] Zaimplementować `setToken` dla space, radius, color
- [ ] Zaimplementować `wrapWith` dla Card, two-column wrapper
- [ ] Dodać walidację layoutów (np. grid wymaga columns)

#### 3.3 i18n Copy Store (opcjonalne)
**Plik:** `apps/demo/app/playground/dsl/i18n.ts` (nowy)

```typescript
export type CopyStore = {
  [key: string]: {
    [locale: string]: string;
  };
};

export function setCopyI18n(
  dsl: UiDsl, 
  target: NodeRef, 
  key: string, 
  locale: string, 
  value: string
): UiDsl;
```

**Zadania:**
- [ ] Stworzyć typ `CopyStore`
- [ ] Rozszerzyć DSL o opcjonalne `copyKey` w węzłach
- [ ] Zaimplementować `setCopyI18n()` — aktualizacja mapy copy
- [ ] Zaktualizować generator, aby używał `t(copyKey)` zamiast hardcoded tekstu
- [ ] Dodać UI dla zarządzania tłumaczeniami

#### 3.4 AST Sync (TSX → DSL) — podstawowe
**Plik:** `apps/demo/app/playground/dsl/ast-sync.ts` (nowy)

**Zadania:**
- [ ] Zainstalować `@babel/parser`, `@babel/traverse`
- [ ] Zaimplementować parser TSX → AST
- [ ] Zaimplementować ekstrakcję `data-ui-id` z elementów
- [ ] Zaimplementować `syncFromTSX()` — wykrywanie zmian w TSX i generowanie patchy
- [ ] Obsłużyć konflikty (last-writer-wins)
- [ ] Dodać przycisk "Sync from code" w UI

#### 3.5 MCP Selection Tools
**Plik:** `packages/mcp-server/src/selection.ts` (nowy)

**Zadania:**
- [ ] Stworzyć `packages/mcp-server/src/selection.ts`
- [ ] Zaimplementować `selection_get` tool
- [ ] Zaimplementować `selection_set` tool
- [ ] Zaimplementować `selection_clear` tool
- [ ] Zarejestrować w MCP server

---

## 📊 Szczegółowy Plan Zadań

### **Faza 1: Fundamenty (Dzień 1-2)**

#### Dzień 1:
- [ ] **1.1.1** Rozszerzyć `types.ts` o `id`, `key`, `name`, `data-test-id`
- [ ] **1.1.2** Rozszerzyć `layout` o `type`, `columns`, `colSpan`
- [ ] **1.1.3** Zaktualizować parser, aby generował UUID
- [ ] **1.1.4** Zaktualizować generator, aby dodawał `data-ui-id`
- [ ] **1.2.1** Stworzyć `patch.ts` z typami `NodeRef` i `Patch`
- [ ] **1.2.2** Zaimplementować `findNode()`
- [ ] **1.2.3** Zaimplementować `applyPatch()` dla `setCopy`
- [ ] **1.2.4** Zaimplementować `applyPatch()` dla `addNode`
- [ ] **1.2.5** Zaimplementować `applyPatch()` dla `removeNode`
- [ ] **1.2.6** Zaimplementować `applyPatch()` dla `moveNode`
- [ ] **1.2.7** Zaimplementować `applyPatch()` dla `setProp`

#### Dzień 2:
- [ ] **1.3.1** Dodać `data-ui-id` do generatora
- [ ] **1.3.2** Dodać event listener na kliknięcia w worker.ts
- [ ] **1.3.3** Dodać postMessage dla selection
- [ ] **1.3.4** Dodać obsługę selection w same-origin-preview.tsx
- [ ] **1.3.5** Dodać CSS highlight dla selection
- [ ] **1.4.1** Stworzyć `packages/mcp-server/src/edit.ts`
- [ ] **1.4.2** Zaimplementować `edit_apply` tool
- [ ] **1.4.3** Zaimplementować `edit_find` tool
- [ ] **1.4.4** Zarejestrować w MCP server

### **Faza 2: Historia i Walidacja (Dzień 3-4)**

#### Dzień 3:
- [ ] **2.1.1** Stworzyć `history.ts` z typem `Commit` i klasą `History`
- [ ] **2.1.2** Zaimplementować `commit()`
- [ ] **2.1.3** Zaimplementować `undo()`
- [ ] **2.1.4** Zaimplementować `redo()`
- [ ] **2.1.5** Zaimplementować `list()` i `checkout()`
- [ ] **2.1.6** Dodać UI dla Undo/Redo
- [ ] **2.1.7** Dodać UI dla listy historii

#### Dzień 4:
- [ ] **2.2.1** Dodać walidację DSL po `applyPatches()`
- [ ] **2.2.2** Dodać ESLint check po regeneracji TSX
- [ ] **2.2.3** Dodać axe-core check po renderze
- [ ] **2.2.4** Wyświetlić wyniki walidacji w UI
- [ ] **2.3.1** Stworzyć `packages/mcp-server/src/history.ts`
- [ ] **2.3.2** Zaimplementować `history_list` i `history_checkout`
- [ ] **2.4.1** Zaimplementować `reorder`
- [ ] **2.4.2** Zaimplementować `wrapWith`
- [ ] **2.4.3** Zaimplementować `setToken`

### **Faza 3: NLU i Zaawansowane (Dzień 5-6)**

#### Dzień 5:
- [ ] **3.1.1** Stworzyć `nlu.ts` z typami `Intent` i `Ambiguity`
- [ ] **3.1.2** Zaimplementować `interpretPrompt()` — podstawowe intenty
- [ ] **3.1.3** Obsłużyć niejednoznaczność (kandydaci)
- [ ] **3.1.4** Zintegrować z `handleSendMessage()`
- [ ] **3.1.5** Dodać UI dla doprecyzowania
- [ ] **3.2.1** Rozszerzyć `moveNode` o layouty
- [ ] **3.2.2** Zaimplementować `setToken` dla layoutów

#### Dzień 6:
- [ ] **3.3.1** Stworzyć `i18n.ts` z `CopyStore` (opcjonalne)
- [ ] **3.3.2** Rozszerzyć DSL o `copyKey`
- [ ] **3.3.3** Zaktualizować generator dla i18n
- [ ] **3.4.1** Zainstalować Babel parser
- [ ] **3.4.2** Zaimplementować parser TSX → AST
- [ ] **3.4.3** Zaimplementować `syncFromTSX()`
- [ ] **3.5.1** Stworzyć `packages/mcp-server/src/selection.ts`
- [ ] **3.5.2** Zaimplementować selection tools
- [ ] **3.5.3** Zarejestrować w MCP server

---

## 🔧 Zmiany w Istniejących Plikach

### `apps/demo/app/playground/page.tsx`
- [ ] Dodać state dla `selection: NodeRef | null`
- [ ] Dodać state dla `history: History`
- [ ] Zmienić `handleSendMessage()` — używać NLU → Patch zamiast bezpośredniego parse
- [ ] Dodać UI dla Undo/Redo
- [ ] Dodać UI dla listy zmian (patches)
- [ ] Dodać UI dla historii commitów

### `apps/demo/app/playground/dsl/generator.ts`
- [ ] Dodać `data-ui-id={node.id}` do każdego wygenerowanego elementu
- [ ] Dodać `key={node.id}` do list elementów
- [ ] Dodać `data-test-id={node["data-test-id"]}` jeśli istnieje
- [ ] Generować minimalny diff (tylko zmienione węzły)

### `apps/demo/app/playground/dsl/parser.ts`
- [ ] Generować UUID dla każdego węzła podczas parsowania
- [ ] Zachować istniejące ID jeśli są w prompt (dla modyfikacji)

### `apps/demo/src/components/same-origin-preview.tsx`
- [ ] Dodać state dla `selection: string | null`
- [ ] Obsłużyć `postMessage` z `type: "select"`
- [ ] Wysyłać `postMessage` z `type: "highlight"` do iframe

### `apps/demo/app/playground/runtime/worker.ts`
- [ ] Dodać event listener na kliknięcia w preview
- [ ] Wysyłać `postMessage` z `type: "select", id: string` do parent
- [ ] Obsłużyć `postMessage` z `type: "highlight"` — dodać CSS highlight

---

## 📝 Przykłady Implementacji

### Przykład 1: setCopy Patch

```typescript
// apps/demo/app/playground/dsl/patch.ts
export function applyPatch(dsl: UiDsl, patch: Patch): UiDsl {
  if (patch.op === "setCopy") {
    const node = findNode(dsl, patch.target);
    if (!node) throw new Error(`Node not found: ${JSON.stringify(patch.target)}`);
    
    // Aktualizuj pole w ścieżce (np. "label", "title", "placeholder")
    const pathParts = patch.path.split(".");
    let current: any = node;
    for (let i = 0; i < pathParts.length - 1; i++) {
      current = current[pathParts[i]];
    }
    current[pathParts[pathParts.length - 1]] = patch.value;
    
    return dsl;
  }
  // ... inne operacje
}
```

### Przykład 2: NLU → Patch

```typescript
// apps/demo/app/playground/dsl/nlu.ts
export function interpretPrompt(
  prompt: string,
  dsl: UiDsl,
  selection: NodeRef | null
): { intent: Intent; patches: Patch[]; ambiguity?: Ambiguity } {
  const lower = prompt.toLowerCase();
  
  // "zmień nagłówek na 'Create account'"
  if (lower.match(/zmień|change|update/) && lower.match(/nagłówek|title|header/)) {
    const match = prompt.match(/(?:na|to|on)\s+["']?([^"']+)["']?/i);
    if (match) {
      const target = selection || findNodeByRole(dsl, "heading");
      return {
        intent: { type: "setCopy", target, value: match[1] },
        patches: [{ op: "setCopy", target, path: "title", value: match[1] }]
      };
    }
  }
  
  // ... więcej wzorców
}
```

### Przykład 3: Selection w Preview

```typescript
// apps/demo/app/playground/runtime/worker.ts
document.addEventListener("click", (e) => {
  const element = e.target as HTMLElement;
  const uiId = element.getAttribute("data-ui-id");
  if (uiId && window.parent) {
    window.parent.postMessage(
      { type: "select", id: uiId },
      window.location.origin
    );
  }
});

// Obsługa highlight
window.addEventListener("message", (e) => {
  if (e.data.type === "highlight" && e.data.id) {
    // Usuń poprzedni highlight
    document.querySelectorAll("[data-ui-highlight]").forEach(el => {
      el.removeAttribute("data-ui-highlight");
      el.style.outline = "";
    });
    
    // Dodaj nowy highlight
    const target = document.querySelector(`[data-ui-id="${e.data.id}"]`);
    if (target) {
      target.setAttribute("data-ui-highlight", "true");
      target.style.outline = "2px solid var(--color-brand-primary)";
    }
  }
});
```

---

## 🧪 Testy

### Testy jednostkowe:
- [ ] `patch.test.ts` — testy dla każdej operacji patch
- [ ] `history.test.ts` — testy undo/redo/checkout
- [ ] `nlu.test.ts` — testy interpretacji promptów
- [ ] `ast-sync.test.ts` — testy synchronizacji TSX → DSL

### Testy integracyjne:
- [ ] Test pełnego cyklu: prompt → DSL → patch → TSX → preview
- [ ] Test undo/redo z wieloma commitami
- [ ] Test selection i highlight
- [ ] Test niejednoznaczności i doprecyzowania

---

## 📈 Metryki i KPI

Zgodnie z specyfikacją:
- **80% edycji bez dopytywania** — mierzyć % promptów wymagających doprecyzowania
- **<2s od patcha do odświeżenia preview** — mierzyć czas renderowania
- **0 krytycznych axe w 95% iteracji** — mierzyć % commitów bez krytycznych błędów a11y

**Implementacja telemetrii:**
- [ ] Logować intent + parametry
- [ ] Logować długość transakcji
- [ ] Logować wynik walidacji
- [ ] Logować undo/redo
- [ ] Logować konflikty AST
- [ ] Logować TTFU (time-to-fresh-UI)

---

## 🚨 Edge Cases i Polityki

### Niejednoznaczność selekcji:
- [ ] Zwrócić listę kandydatów z kontekstem
- [ ] UI: wyświetlić dialog z wyborem
- [ ] Minimalne doprecyzowanie (np. "Który 'Zapisz'? (1: w profilu, 2: w bezpieczeństwie)")

### Kolizje nazw pól (renameField):
- [ ] Migracja schema + aktualizacja `name` w całym DSL
- [ ] Walidacja unikalności nazw

### Złożone layouty:
- [ ] Wprowadzać stopniowo (grid → responsive grid)
- [ ] Walidacja: grid wymaga `columns`

### A/B snapshot:
- [ ] `history.branch()` pozwala pójść dwiema ścieżkami
- [ ] Porównanie snapshotów

---

## 📚 Dokumentacja

- [ ] Zaktualizować `COPILOT_PLAYGROUND_SPEC.md` o v1.1
- [ ] Dodać przykłady użycia Patch API
- [ ] Dodać przykłady NLU → Patch
- [ ] Dodać dokumentację MCP tools (edit, selection, history)
- [ ] Dodać guide dla użytkowników (jak używać konwersacyjnego edytora)

---

## ✅ Checklist Gotowości

Przed rozpoczęciem implementacji:
- [ ] Przejrzeć obecny kod i zrozumieć architekturę
- [ ] Zainstalować zależności (Babel parser, UUID generator)
- [ ] Przygotować środowisko testowe
- [ ] Ustalić priorytety (co jest must-have, co nice-to-have)

Po zakończeniu każdego kroku:
- [ ] Wszystkie testy przechodzą
- [ ] Kod jest zreviewowany
- [ ] Dokumentacja zaktualizowana
- [ ] Demo działa end-to-end

---

## 🎯 Priorytety

### Must-have (MVP):
1. ID w DSL + data-ui-id w TSX
2. Podstawowe operacje Patch (setCopy, addNode, removeNode, moveNode, setProp)
3. Selekcja w preview
4. Historia z undo/redo
5. NLU → Patch (podstawowe intenty)

### Nice-to-have:
1. i18n copy store
2. AST sync (TSX → DSL)
3. Zaawansowane layouty (grid, two-column)
4. A/B snapshot
5. Telemetria i metryki

---

**Koniec planu implementacji**

