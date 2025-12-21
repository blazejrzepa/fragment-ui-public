# Konkretne Propozycje Refaktoringu Playground

## 🔍 Zidentyfikowane Problemy

### 1. **Bardzo Duży Plik page.tsx (3245 linii)**
**Problem:**
- Monolityczny komponent z wszystkimi odpowiedzialnościami
- 109 wywołań setState
- 25 useEffect
- 29 handler functions
- Trudne w utrzymaniu i testowaniu

**Rozwiązanie:**
- Wyekstrahować logikę do custom hooks
- Podzielić na mniejsze komponenty
- Użyć Context API dla globalnego stanu

### 2. **Złożona Synchronizacja Stanu**
**Problem:**
- 25 useEffect synchronizujących stan
- Użycie useRef do śledzenia stanu (codeProjectIdRef, loadedProjectDataRef)
- Ryzyko nieskończonych pętli

**Rozwiązanie:**
- Utworzyć `useCodeSync` hook
- Konsolidować synchronizację do 2-3 useEffect
- Użyć useMemo i useCallback bardziej agresywnie

### 3. **Duplikacja Kodu**
**Problem:**
- Podobne wzorce w wielu miejscach
- Powtarzające się sprawdzania warunków
- Brak wyekstrahowanych utility functions

**Rozwiązanie:**
- Utworzyć `playground-utils.ts` z wspólnymi funkcjami
- Wyekstrahować powtarzające się wzorce

### 4. **Nieużywany Kod**
**Problem:**
- `validateAfterPatch` jest pusty
- `chat/page.tsx` może być nieużywany
- Komentarze "Legacy code removed"

**Rozwiązanie:**
- Usunąć nieużywany kod
- Wypełnić puste funkcje lub usunąć

### 5. **Zbyt Dużo Debug Logów**
**Problem:**
- 22 console.log w page.tsx
- Wiele logger.debug wywołań

**Rozwiązanie:**
- Użyć logger tylko w development
- Zmniejszyć liczbę logów

## 📋 Konkretne Propozycje

### Priorytet 1: Custom Hooks (Najważniejsze)

#### 1.1 `usePlaygroundState` Hook
```typescript
// src/hooks/use-playground-state.ts
export function usePlaygroundState() {
  // Łączy wszystkie stany UI
  const [uiState, setUIState] = useState({
    activeTab: "terminal",
    activeCopilotTab: "copilot",
    activePreviewTab: "new-component",
    activeSystemTabs: new Set(),
    activeSystemTab: null,
    previewZoom: 100,
    // ... inne stany UI
  });
  
  return { uiState, setUIState };
}
```

#### 1.2 `useCodeSync` Hook
```typescript
// src/hooks/use-code-sync.ts
export function useCodeSync(
  activeProjectId: string | null,
  activeProject: UIProject | null,
  code: string,
  setCode: (code: string) => void
) {
  // Jeden useEffect zamiast wielu
  // Synchronizuje kod między projektem a lokalnym stanem
  // Eliminuje potrzebę refs
}
```

#### 1.3 `usePlaygroundActions` Hook
```typescript
// src/hooks/use-playground-actions.ts
export function usePlaygroundActions() {
  return {
    handleSendMessage: useCallback(...),
    handleGenerate: useCallback(...),
    handlePatch: useCallback(...),
    handleExport: useCallback(...),
    handleDuplicate: useCallback(...),
    // ... wszystkie akcje
  };
}
```

### Priorytet 2: Podział Komponentu

#### 2.1 `PlaygroundContent` Component
```typescript
// src/components/playground/playground-content.tsx
// Obsługuje renderowanie głównej zawartości
// ~200 linii zamiast 3245
```

#### 2.2 `PlaygroundStateProvider` Context
```typescript
// src/components/playground/playground-state-provider.tsx
// Context API dla globalnego stanu
// Eliminuje prop drilling
```

### Priorytet 3: Utilities

#### 3.1 `playground-utils.ts`
```typescript
// src/lib/playground-utils.ts
export function getActiveProject(projects, activeId)
export function getActiveSession(sessions, activeId)
export function shouldLoadProjectData(...)
export function createProjectFromSession(...)
// ... inne utility functions
```

### Priorytet 4: Cleanup

#### 4.1 Usunąć Nieużywany Kod
- `validateAfterPatch` - wypełnić lub usunąć
- `chat/page.tsx` - sprawdzić czy używany
- Komentarze "Legacy code removed"

#### 4.2 Zoptymalizować Logi
- Zmniejszyć liczbę console.log
- Użyć logger tylko w development

## 🎯 Plan Działania

### Krok 1: Utworzyć Custom Hooks (2-3 dni)
1. `usePlaygroundState` - stany UI
2. `useCodeSync` - synchronizacja kodu
3. `usePlaygroundActions` - wszystkie akcje

### Krok 2: Refaktorować page.tsx (2-3 dni)
1. Użyć nowych hooks
2. Podzielić na mniejsze komponenty
3. Dodać Context Provider

### Krok 3: Cleanup (1 dzień)
1. Usunąć nieużywany kod
2. Zoptymalizować logi
3. Dodać komentarze

## 📊 Oczekiwane Rezultaty

- **page.tsx**: 3245 → ~500 linii (-85%)
- **useEffect**: 25 → <10 (-60%)
- **setState calls**: 109 → ~30 (-72%)
- **Czytelność**: Znacznie lepsza
- **Wydajność**: Mniej re-renderów
- **Testowalność**: Łatwiejsze testowanie

## ⚠️ Uwagi

- Refaktoring powinien być robiony stopniowo
- Każdy krok powinien być testowany
- Zachować backward compatibility

