# Analiza Playground - Problemy i Propozycje Usprawnień

## 🔍 Główne Problemy

### 1. **Duplikacja Danych i Niespójność**

**Problem:**
- `code`, `logs`, `a11yResults` są przechowywane zarówno w `ChatSession` jak i `UIProject`
- To prowadzi do:
  - Niespójności danych (kod może być różny w sesji i projekcie)
  - Złożonej synchronizacji między wieloma źródłami prawdy
  - Problemów z "Maximum update depth exceeded"

**Przykład:**
```typescript
// Kod jest zapisywany w 3 miejscach:
updateActiveSession({ code: generatedCode });  // 1. Sesja
setCode(generatedCode);                        // 2. Lokalny state
updateActiveProject({ code: generatedCode });  // 3. Projekt
```

### 2. **Niejasny Model Danych**

**Problem:**
- Relacja między `ChatSession` a `UIProject` jest niejasna
- `chatSessionId` w `UIProject` jest opcjonalne
- Nie jest jasne, czy:
  - Sesja może mieć wiele projektów?
  - Projekt może należeć do wielu sesji?
  - Co się dzieje, gdy użytkownik przełącza się między sesjami/projektami?

**Aktualny przepływ:**
1. Użytkownik wysyła prompt → tworzy się `ChatSession`
2. Generuje się kod → tworzy się `UIProject`
3. Ale nie ma wyraźnego powiązania między nimi

### 3. **Złożona Synchronizacja Stanu**

**Problem:**
- 73 miejsca w kodzie, gdzie `setCode`, `setMessages`, `updateActiveSession`, `updateActiveProject` są wywoływane
- Wiele `useEffect` synchronizuje stan między:
  - Lokalnym state (`code`, `messages`, `logs`)
  - `ChatSession` (w localStorage)
  - `UIProject` (w localStorage)
- Użycie `useRef` (`codeProjectIdRef`, `loadedMessagesRef`) do śledzenia stanu wskazuje na problemy z architekturą

**Przykład problematycznego kodu:**
```typescript
// useEffect 1: Ładuje dane z sesji
useEffect(() => {
  if (session.messages) {
    setMessages(session.messages); // Aktualizuje lokalny state
  }
}, [activeSessionId, chatSessions]);

// useEffect 2: Zapisuje lokalny state do sesji
useEffect(() => {
  if (messages.length > 0) {
    updateActiveSession({ messages }); // Aktualizuje sesję
  }
}, [messages, activeSessionId]);

// To może prowadzić do nieskończonej pętli!
```

### 4. **Problem z "Maximum Update Depth Exceeded"**

**Przyczyna:**
- `useEffect` używa wartości z lokalnego state w warunkach
- Te wartości są aktualizowane przez inne `useEffect`
- To powoduje ciągłe re-rendery i aktualizacje

**Przykład:**
```typescript
useEffect(() => {
  if (messages.length === 0 || session.messages.length >= messages.length) {
    setMessages(session.messages); // Aktualizuje messages
  }
}, [activeSessionId, chatSessions]); // Ale nie ma messages w zależnościach!

// Inny useEffect:
useEffect(() => {
  updateActiveSession({ messages }); // Aktualizuje sesję, co może zmienić chatSessions
}, [messages, activeSessionId]);
```

### 5. **Niejasny Przepływ Użytkownika**

**Problem:**
- Nie jest jasne, co się dzieje, gdy:
  - Użytkownik przełącza się między sesjami
  - Użytkownik przełącza się między projektami
  - Użytkownik odświeża stronę
  - Użytkownik generuje nowy komponent w istniejącej sesji

## 💡 Propozycje Usprawnień

### 1. **Uproszczenie Modelu Danych**

**Propozycja:**
- `ChatSession` powinien zawierać tylko: `id`, `title`, `messages`, `createdAt`
- `UIProject` powinien zawierać: `id`, `title`, `code`, `generationMetadata`, `logs`, `a11yResults`, `chatSessionId` (wymagane), `createdAt`
- Usunąć duplikację: `code`, `logs`, `a11yResults` tylko w `UIProject`

**Korzyści:**
- Jedno źródło prawdy dla każdego typu danych
- Prostsza synchronizacja
- Mniej problemów z niespójnością

### 2. **Centralizacja Zarządzania Stanem**

**Propozycja:**
- Utworzyć custom hook `usePlaygroundState`, który zarządza:
  - Aktywną sesją
  - Aktywnym projektem
  - Synchronizacją między localStorage a lokalnym state
- Użyć `useReducer` zamiast wielu `useState` dla lepszej kontroli

**Przykład:**
```typescript
const [state, dispatch] = useReducer(playgroundReducer, initialState);

// Zamiast wielu setState:
dispatch({ type: 'SET_ACTIVE_SESSION', sessionId });
dispatch({ type: 'UPDATE_CODE', code, projectId });
dispatch({ type: 'ADD_MESSAGE', message });
```

### 3. **Uproszczenie Synchronizacji**

**Propozycja:**
- Usunąć lokalny state dla danych, które są w localStorage
- Używać bezpośrednio danych z `chatSessions` i `uiProjects`
- Synchronizować tylko przy:
  - Ładowaniu z localStorage (mount)
  - Zapisie do localStorage (debounced)
  - Akcjach użytkownika (send message, generate code)

**Przykład:**
```typescript
// Zamiast:
const [code, setCode] = useState("");
useEffect(() => {
  if (activeProject) {
    setCode(activeProject.code);
  }
}, [activeProject]);

// Użyj:
const activeProject = uiProjects.find(p => p.id === activeProjectId);
const code = activeProject?.code || "";
```

### 4. **Jasny Przepływ Danych**

**Propozycja:**
- Zdefiniować jasne reguły:
  1. **Sesja** = konwersacja z AI (wiadomości)
  2. **Projekt** = wygenerowany komponent (kod, logs, a11y)
  3. **Relacja**: Projekt zawsze należy do sesji (`chatSessionId` wymagane)
  4. **Przełączanie**: Gdy użytkownik przełącza sesję, pokazuj projekty z tej sesji

**Przepływ:**
```
User sends prompt
  ↓
Create/Update ChatSession (add message)
  ↓
If generation request:
  ↓
  Generate code
  ↓
  Create/Update UIProject (with chatSessionId)
  ↓
  Update ChatSession (link to project)
```

### 5. **Optymalizacja useEffect**

**Propozycja:**
- Użyć `useMemo` i `useCallback` bardziej agresywnie
- Ograniczyć `useEffect` tylko do:
  - Ładowania z localStorage (mount)
  - Zapisów do localStorage (debounced)
  - Side effects (scroll, focus)
- Usunąć `useEffect`, które synchronizują lokalny state z localStorage

### 6. **Lepsze Obsługiwanie Błędów**

**Propozycja:**
- Dodać Error Boundary dla każdej sekcji (chat, preview, terminal)
- Dodać retry logic dla API calls
- Dodać loading states dla każdej operacji
- Dodać walidację danych przed zapisem do localStorage

## 🎯 Konkretne Zmiany do Wdrożenia

### Priorytet 1: Naprawa "Maximum Update Depth Exceeded"

1. **Usunąć lokalny state dla `messages`**
   - Używać bezpośrednio `activeSession?.messages || []`
   - Aktualizować tylko przez `updateActiveSession`

2. **Uprościć `useEffect` dla ładowania sesji**
   - Użyć `useRef` do śledzenia, czy dane zostały już załadowane
   - Ładować tylko raz przy zmianie `activeSessionId`

3. **Usunąć synchronizację w obie strony**
   - Zamiast: localStorage → state → localStorage
   - Użyj: localStorage → state (tylko przy mount)
   - Zapisuj: state → localStorage (tylko przy akcjach użytkownika)

### Priorytet 2: Uproszczenie Modelu Danych

1. **Usunąć `code` z `ChatSession`**
2. **Dodać wymagane `chatSessionId` do `UIProject`**
3. **Przenieść `logs` i `a11yResults` tylko do `UIProject`**

### Priorytet 3: Refaktoryzacja Komponentu

1. **Utworzyć `usePlaygroundState` hook**
2. **Podzielić komponent na mniejsze komponenty:**
   - `ChatPanel`
   - `PreviewPanel`
   - `TerminalPanel`
   - `ProjectTabs`
3. **Użyć Context API dla stanu globalnego**

## 📊 Metryki Sukcesu

Po wdrożeniu usprawnień:
- ✅ Brak błędów "Maximum update depth exceeded"
- ✅ Mniej niż 10 `useEffect` w głównym komponencie
- ✅ Czas ładowania strony < 1s
- ✅ Płynne przełączanie między sesjami/projektami
- ✅ Dane są spójne po odświeżeniu strony

## 🔄 Plan Migracji

1. **Faza 1**: Naprawa błędów (1-2 dni)
   - Naprawa "Maximum update depth exceeded"
   - Uproszczenie synchronizacji

2. **Faza 2**: Refaktoryzacja modelu danych (2-3 dni)
   - Usunięcie duplikacji
   - Migracja istniejących danych

3. **Faza 3**: Refaktoryzacja komponentu (3-4 dni)
   - Podział na mniejsze komponenty
   - Utworzenie custom hooks

4. **Faza 4**: Testy i optymalizacja (1-2 dni)
   - Testy funkcjonalne
   - Testy wydajnościowe
   - Optymalizacja

