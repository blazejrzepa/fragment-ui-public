# Troubleshooting: Test Process Hanging

## Problem

Testy przechodzą poprawnie, ale proces testowy nie kończy się w CI, powodując timeout po 5-10 minutach.

## Główne przyczyny

### 1. **Radix UI HoverCard - Timers (openDelay/closeDelay)**

**Problem:**
- `HoverCard` z Radix UI używa domyślnych opóźnień:
  - `openDelay: 700ms` - opóźnienie przed otwarciem
  - `closeDelay: 300ms` - opóźnienie przed zamknięciem
- Te timers (`setTimeout`) są tworzone wewnątrz Radix UI i mogą nie być poprawnie czyszczone po testach
- Node.js nie kończy procesu jeśli są aktywne timers

**Rozwiązanie:**
```tsx
// W testach ustaw delays na 0
<HoverCard openDelay={0} closeDelay={0}>
  ...
</HoverCard>
```

### 2. **Carousel - setInterval dla auto-play**

**Problem:**
- `Carousel` używa `setInterval` dla funkcji auto-play
- Jeśli test renderuje Carousel z `autoPlay={true}`, interval może pozostać aktywny
- Nawet jeśli cleanup jest w `useEffect`, może nie zadziałać w środowisku testowym

**Rozwiązanie:**
```tsx
// W testach wyłącz auto-play lub użyj fake timers
beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.clearAllTimers();
  vi.useRealTimers();
});
```

### 3. **Event Listeners - nie zawsze czyszczone**

**Problem:**
- Komponenty jak `CommandPalette` dodają globalne event listeners:
  ```tsx
  document.addEventListener("keydown", down);
  ```
- Jeśli cleanup w `useEffect` nie zadziała (np. przez błąd w teście), listener pozostaje aktywny
- Aktywne event listeners mogą utrzymywać proces przy życiu

**Rozwiązanie:**
- Używamy `vi.clearAllTimers()` i `vi.clearAllMocks()` w `afterEach`
- Global cleanup w `afterAll` dla CI

### 4. **Radix UI Portals i Focus Traps**

**Problem:**
- Radix UI komponenty (Dialog, Popover, etc.) używają:
  - **Portals** - renderują poza głównym drzewem DOM
  - **Focus traps** - zarządzają focusem dla accessibility
  - **Event listeners** - dla keyboard navigation, click outside, etc.
- Te mechanizmy mogą utrzymywać referencje do DOM i zapobiegać garbage collection
- W środowisku testowym mogą nie być poprawnie czyszczone

**Rozwiązanie:**
- Używamy `cleanup()` z `@testing-library/react` w `afterEach`
- To usuwa wszystkie portale i czyści DOM

### 5. **Vitest Threads/Forks Pool**

**Problem:**
- Vitest domyślnie używa `threads` pool dla równoległego uruchamiania testów
- W CI, threads mogą nie kończyć się poprawnie jeśli:
  - Są aktywne timers
  - Są otwarte połączenia (websockets, etc.)
  - Są aktywne event listeners
- Node.js czeka na zakończenie wszystkich aktywnych operacji przed exit

**Rozwiązanie:**
```ts
// W CI używamy forks zamiast threads
pool: process.env.CI ? "forks" : "threads",
poolOptions: {
  forks: {
    singleFork: true, // Jeden fork = łatwiejsze zarządzanie
    isolate: true,
  },
}
```

### 6. **localStorage i sessionStorage**

**Problem:**
- Komponenty jak `CommandPalette` używają `localStorage`:
  ```tsx
  localStorage.getItem(recentCommandsStorageKey);
  localStorage.setItem(recentCommandsStorageKey, JSON.stringify(updated));
  ```
- W środowisku testowym (jsdom) localStorage może utrzymywać referencje
- Nie zawsze jest czyszczone między testami

**Rozwiązanie:**
- `cleanup()` z testing-library powinien to obsłużyć
- W CI używamy `process.exit(0)` jako ostateczne rozwiązanie

## Dlaczego problem występuje głównie w CI?

1. **Brak interakcji użytkownika** - w CI nie ma rzeczywistego użytkownika, więc niektóre cleanup'y mogą nie być wywoływane
2. **Środowisko headless** - brak rzeczywistego przeglądarki może powodować różne zachowania
3. **Timeouty** - CI ma timeouty, więc problem jest bardziej widoczny
4. **Równoległe wykonanie** - wiele testów jednocześnie może powodować race conditions w cleanup

## Nasze rozwiązania

### 1. Global Cleanup w `vitest.setup.ts`

```ts
afterEach(() => {
  cleanup(); // Czyści DOM i portale
  vi.clearAllTimers(); // Czyści wszystkie timers
  vi.clearAllMocks(); // Czyści wszystkie mocks
});

afterAll(async () => {
  // W CI wymuszamy exit po cleanup
  if (process.env.CI) {
    vi.clearAllTimers();
    vi.clearAllMocks();
    cleanup();
    
    setImmediate(() => {
      process.exit(0); // Wymusza zakończenie procesu
    });
  }
});
```

### 2. Konfiguracja Vitest dla CI

```ts
// vitest.config.ts
pool: process.env.CI ? "forks" : "threads",
poolOptions: {
  forks: {
    singleFork: true, // Jeden fork = łatwiejsze zarządzanie
  },
}
```

### 3. Ustawienia delays na 0 w testach

```tsx
// Dla HoverCard
<HoverCard openDelay={0} closeDelay={0}>
  ...
</HoverCard>
```

### 4. Timeout w CI

```yaml
# .github/workflows/ci.yml
- name: Run tests
  run: pnpm --filter @fragment_ui/ui test
  timeout-minutes: 5
  env:
    CI: true
```

## Best Practices

1. **Zawsze używaj cleanup()** - po każdym teście
2. **Czyść timers** - `vi.clearAllTimers()` w afterEach
3. **Ustaw delays na 0** - dla komponentów z opóźnieniami w testach
4. **Używaj fake timers** - dla testów z setInterval/setTimeout
5. **Testuj w izolacji** - każdy test powinien być niezależny
6. **Monitoruj CI** - sprawdzaj czy testy kończą się poprawnie

## Podsumowanie

Problem z zawieszaniem się testów wynika z:
- **Aktywnych timers** (HoverCard, Carousel)
- **Event listeners** (CommandPalette, keyboard shortcuts)
- **Radix UI mechanizmów** (portals, focus traps)
- **Vitest threads/forks** nie kończących się poprawnie
- **Brak cleanup** między testami

Nasze rozwiązania:
- Global cleanup w `afterEach` i `afterAll`
- Użycie `forks` zamiast `threads` w CI
- `process.exit(0)` jako ostateczne rozwiązanie w CI
- Ustawienia delays na 0 w testach

