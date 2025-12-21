# Analiza i Plan Refaktoringu Playground

## 📊 Obecny Stan

### Statystyki
- **page.tsx**: 3245 linii kodu
- **useEffect**: 25 hooków synchronizujących stan
- **setState calls**: 109 wywołań
- **Handler functions**: 29 funkcji obsługujących akcje
- **useState**: ~30 różnych stanów lokalnych

### Główne Problemy

#### 1. **Monolityczny Komponent (page.tsx)**
- 3245 linii w jednym pliku
- Mieszanie odpowiedzialności (UI, logika biznesowa, zarządzanie stanem)
- Trudne w utrzymaniu i testowaniu
- Wolne ładowanie (nawet z dynamic imports)

#### 2. **Złożona Synchronizacja Stanu**
- 25 useEffect synchronizujących stan między:
  - Lokalnym state (`code`, `messages`, `logs`)
  - ChatSession (localStorage)
  - UIProject (localStorage)
- Użycie `useRef` do śledzenia stanu wskazuje na problemy z architekturą
- Ryzyko nieskończonych pętli

#### 3. **Duplikacja Logiki**
- Podobne wzorce w wielu miejscach
- Brak wyekstrahowanych utility functions
- Powtarzające się sprawdzania warunków

#### 4. **Niejasna Relacja ChatSession ↔ UIProject**
- Kod jest w obu miejscach (duplikacja)
- `chatSessionId` w UIProject jest opcjonalne
- Trudno określić źródło prawdy

## 🎯 Proponowane Rozwiązania

### Priorytet 1: Wyekstrahowanie Custom Hooks

#### 1.1 `usePlaygroundState` - Centralne zarządzanie stanem
```typescript
// src/hooks/use-playground-state.ts
export function usePlaygroundState() {
  // Łączy wszystkie stany UI w jeden hook
  // Zwraca: { code, messages, logs, a11yResults, ... }
  // + setter functions
}
```

#### 1.2 `useCodeSync` - Synchronizacja kodu między projektem a lokalnym stanem
```typescript
// src/hooks/use-code-sync.ts
export function useCodeSync(activeProjectId, activeProject) {
  // Obsługuje synchronizację kodu
  // Eliminuje potrzebę wielu useEffect
}
```

#### 1.3 `usePlaygroundActions` - Wszystkie akcje w jednym miejscu
```typescript
// src/hooks/use-playground-actions.ts
export function usePlaygroundActions() {
  return {
    handleSendMessage,
    handleGenerate,
    handlePatch,
    handleExport,
    handleDuplicate,
    // ... wszystkie akcje
  };
}
```

### Priorytet 2: Podział Komponentu

#### 2.1 `PlaygroundContent` - Główna zawartość
```typescript
// src/components/playground/playground-content.tsx
// Obsługuje renderowanie głównej zawartości (preview, code, system tabs)
```

#### 2.2 `PlaygroundMainArea` - Główny obszar
```typescript
// src/components/playground/playground-main-area.tsx
// Łączy wszystkie panele (left sidebar, content, right sidebar)
```

#### 2.3 `PlaygroundStateProvider` - Context dla stanu
```typescript
// src/components/playground/playground-state-provider.tsx
// Context API dla globalnego stanu playground
```

### Priorytet 3: Optymalizacja useEffect

#### 3.1 Konsolidacja synchronizacji
- Zmniejszyć z 25 do <10 useEffect
- Użyć `useMemo` i `useCallback` bardziej agresywnie
- Wyeliminować niepotrzebne re-rendery

#### 3.2 Uproszczenie logiki ładowania
- Jeden useEffect dla ładowania projektu
- Jeden useEffect dla ładowania sesji
- Eliminacja refs używanych do śledzenia stanu

### Priorytet 4: Wyekstrahowanie Utilities

#### 4.1 `playground-utils.ts` - Wspólne funkcje
```typescript
// src/lib/playground-utils.ts
export function getActiveProject(projects, activeId)
export function getActiveSession(sessions, activeId)
export function shouldLoadProjectData(...)
// ... inne utility functions
```

#### 4.2 `playground-constants.ts` - Stałe
```typescript
// src/lib/playground-constants.ts
export const DEFAULT_PREVIEW_ZOOM = 100
export const CODE_HISTORY_MAX = 50
// ... inne stałe
```

## 📋 Plan Implementacji

### Faza 1: Custom Hooks (2-3 dni)
1. ✅ Utworzyć `usePlaygroundState`
2. ✅ Utworzyć `useCodeSync`
3. ✅ Utworzyć `usePlaygroundActions`
4. ✅ Migrować logikę z page.tsx do hooks

### Faza 2: Podział Komponentu (2-3 dni)
1. ✅ Utworzyć `PlaygroundContent`
2. ✅ Utworzyć `PlaygroundMainArea`
3. ✅ Utworzyć `PlaygroundStateProvider`
4. ✅ Refaktorować page.tsx używając nowych komponentów

### Faza 3: Optymalizacja (1-2 dni)
1. ✅ Konsolidować useEffect
2. ✅ Wyekstrahować utilities
3. ✅ Usunąć nieużywany kod
4. ✅ Dodać testy

### Faza 4: Cleanup (1 dzień)
1. ✅ Usunąć stare komentarze
2. ✅ Zaktualizować dokumentację
3. ✅ Code review

## 🎯 Oczekiwane Korzyści

1. **Czytelność**: page.tsx zmniejszy się z 3245 do ~500 linii
2. **Wydajność**: Mniej re-renderów, szybsze ładowanie
3. **Testowalność**: Hooks i komponenty łatwiejsze do testowania
4. **Utrzymanie**: Łatwiejsze dodawanie nowych funkcji
5. **Debugowanie**: Jasne źródło prawdy dla każdej danej

## ⚠️ Ryzyka

1. **Breaking changes**: Refaktoring może wprowadzić błędy
2. **Czas**: Pełny refaktoring zajmie ~1 tydzień
3. **Testowanie**: Wymaga dokładnego testowania wszystkich funkcji

## 🚀 Rekomendacja

**Zacząć od Fazy 1** - wyekstrahowanie custom hooks to najmniej ryzykowne i przyniesie największe korzyści.

