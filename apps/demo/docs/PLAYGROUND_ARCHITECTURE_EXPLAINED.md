# Playground - Architektura i Model Działania

## 🎯 Cel Aplikacji

Playground to interaktywne narzędzie do generowania komponentów React przy użyciu języka naturalnego. Użytkownik rozmawia z AI, które generuje kod komponentów używając Fragment UI design system.

## 📊 Model Danych

### ChatSession (Sesja Konwersacji)
**Cel**: Reprezentuje jedną konwersację z AI

**Zawiera:**
- `id` - unikalny identyfikator
- `title` - tytuł sesji (pierwszy prompt użytkownika)
- `messages` - tablica wiadomości (user/assistant)
- `createdAt` - data utworzenia
- `isGenerating` - czy sesja jest w trakcie generowania
- `logs` - logi z terminala (opcjonalne, związane z sesją)
- `a11yResults` - wyniki testów dostępności (opcjonalne, związane z sesją)

**Relacja**: Jeden użytkownik może mieć wiele sesji. Sesje są grupowane według daty w drzewie nawigacji.

### UIProject (Projekt Komponentu)
**Cel**: Reprezentuje wygenerowany komponent React

**Zawiera:**
- `id` - unikalny identyfikator
- `title` - nazwa komponentu (wyciągnięta z kodu lub prompt)
- `code` - wygenerowany kod TypeScript/React
- `generationMetadata` - metadane generowania (metoda, model AI)
- `logs` - logi z procesu generowania (opcjonalne)
- `a11yResults` - wyniki testów dostępności (opcjonalne)
- `chatSessionId` - ID sesji, która wygenerowała ten projekt (opcjonalne)
- `createdAt` - data utworzenia

**Relacja**: 
- Projekt może należeć do sesji (przez `chatSessionId`)
- Jedna sesja może mieć wiele projektów (użytkownik może generować wiele komponentów w jednej konwersacji)
- Projekt może istnieć bez sesji (jeśli został utworzony ręcznie)

## 🔄 Przepływ Działania

### 1. Inicjalizacja
```
Użytkownik otwiera playground
  ↓
Ładowanie z localStorage:
  - chatSessions[]
  - uiProjects[]
  - activeSessionId
  - activeProjectId
  ↓
Wyświetlenie:
  - Jeśli są sesje → pokaż drzewo sesji
  - Jeśli jest activeSessionId → załaduj wiadomości z sesji
  - Jeśli jest activeProjectId → załaduj kod z projektu
```

### 2. Nowa Konwersacja (Przykładowy Prompt)
```
Użytkownik klika "Create a registration form..."
  ↓
handleSendMessage(prompt, createNewSession=true)
  ↓
1. Tworzenie nowej sesji:
   - newSession = {
       id: "session-123",
       title: "Create a registration form...",
       messages: [],
       isGenerating: true
     }
   - setChatSessions([...prev, newSession])
   - setActiveSessionId("session-123")
  ↓
2. Dodanie wiadomości użytkownika:
   - userMessage = { role: "user", content: prompt }
   - setMessages([userMessage])
   - updateActiveSession({ messages: [userMessage] })
  ↓
3. Generowanie kodu:
   - POST /api/generate
   - Otrzymanie: { code, metadata }
  ↓
4. Tworzenie projektu:
   - Jeśli nie ma activeProject → createNewProject(componentName)
   - updateActiveProject({ code, generationMetadata })
   - setCode(generatedCode)
   - setActivePreviewTab("preview")
  ↓
5. Aktualizacja sesji:
   - assistantMessage = { role: "assistant", content: "I've generated..." }
   - setMessages([...prev, assistantMessage])
   - updateActiveSession({ 
       messages: [...],
       isGenerating: false 
     })
```

### 3. Przełączanie Między Sesjami
```
Użytkownik klika na sesję w drzewie
  ↓
setActiveSessionId(sessionId)
  ↓
useEffect (linia 498):
  - Znajdź sesję w chatSessions
  - Załaduj messages z sesji → setMessages(session.messages)
  - Załaduj logs z sesji → setLogs(session.logs)
  - Załaduj a11yResults z sesji → setA11yResults(session.a11yResults)
  ↓
Wyświetlenie:
  - Prawy panel: wiadomości z sesji
  - Terminal: logi z sesji
  - Preview: kod z projektu (jeśli jest activeProjectId)
```

### 4. Przełączanie Między Projektami
```
Użytkownik klika na zakładkę projektu
  ↓
handleSwitchProject(projectId)
  ↓
1. Zapisanie aktualnego projektu (jeśli kod należy do niego):
   - updateActiveProject({ code, generationMetadata, logs, a11yResults })
  ↓
2. Przełączenie na nowy projekt:
   - setActiveProjectId(projectId)
   - setCode(project.code)
   - setGenerationMetadata(project.generationMetadata)
   - setA11yResults(project.a11yResults)
   - setActivePreviewTab(project.code ? "preview" : "new-component")
  ↓
useEffect (linia 285):
  - Sprawdź, czy projekt się zmienił (loadedProjectDataRef)
  - Jeśli tak → załaduj dane z projektu
  ↓
Wyświetlenie:
  - Preview: kod z projektu (jeśli jest)
  - Code: kod do edycji
  - Terminal: logi z sesji (nie z projektu!)
```

### 5. Modyfikacja Komponentu
```
Użytkownik pisze: "Add a submit button"
  ↓
handleSendMessage("Add a submit button")
  ↓
1. Dodanie wiadomości użytkownika:
   - setMessages([...prev, userMessage])
  ↓
2. Generowanie z kontekstem:
   - prompt = `Modify: Add a submit button\n\nCurrent code:\n\`\`\`\n${code}\n\`\`\``
   - POST /api/generate
  ↓
3. Aktualizacja kodu:
   - setCode(newGeneratedCode)
   - updateActiveProject({ code: newGeneratedCode })
   - Preview automatycznie się odświeża (SameOriginPreview)
```

## 🗂️ Struktura UI

### Lewy Panel (Chat History)
- **Drzewo sesji** pogrupowane według daty
- Kliknięcie na sesję → przełącza aktywną sesję
- Wyświetla tytuł sesji (pierwszy prompt)

### Górny Panel (Zakładki Projektów)
- **Home** - ekran startowy (zawsze widoczny, bez przycisku X)
- **Projekty** - każdy wygenerowany komponent ma swoją zakładkę
  - Kliknięcie → przełącza aktywny projekt
  - X → zamyka projekt

### Główny Panel (Preview/Code)
- **Zakładki**: Preview | Code
- **Preview**: Renderuje komponent w iframe
- **Code**: Wyświetla kod do edycji

### Prawy Panel (Chat)
- **Historia konwersacji** z aktywną sesją
- **Input** do wysyłania wiadomości
- **Zakładki**: Terminal | Accessibility
  - Terminal: logi z procesu generowania
  - Accessibility: wyniki testów dostępności

## 🔗 Relacje i Zależności

### Sesja ↔ Projekt
- **Relacja**: Jeden-do-wielu (jedna sesja może mieć wiele projektów)
- **Powiązanie**: `UIProject.chatSessionId` → `ChatSession.id`
- **Zachowanie**:
  - Gdy generujesz komponent w sesji → projekt jest powiązany z sesją
  - Projekty mogą istnieć bez sesji (utworzone ręcznie)
  - Logi i a11yResults są w sesji, nie w projekcie

### Dane w Sesji vs Projekcie
**Sesja zawiera:**
- `messages` - konwersacja z AI
- `logs` - logi z terminala (związane z sesją)
- `a11yResults` - wyniki dostępności (związane z sesją)

**Projekt zawiera:**
- `code` - kod komponentu
- `generationMetadata` - metadane generowania
- `logs` - duplikacja (problem!)
- `a11yResults` - duplikacja (problem!)

## ⚠️ Zidentyfikowane Problemy

### 1. Duplikacja Danych
**Problem**: `logs` i `a11yResults` są w obu miejscach (sesja i projekt)

**Skutek**: 
- Niespójność danych
- Złożona synchronizacja
- Niejasne, które dane są "prawdziwe"

**Rozwiązanie**: 
- Przenieść `logs` i `a11yResults` tylko do sesji
- Projekt powinien mieć tylko `code` i `generationMetadata`

### 2. Niejasna Relacja
**Problem**: `chatSessionId` w projekcie jest opcjonalne

**Skutek**: 
- Nie wiadomo, do której sesji należy projekt
- Trudno filtrować projekty według sesji

**Rozwiązanie**: 
- `chatSessionId` powinno być wymagane
- Projekt zawsze należy do sesji (lub mieć specjalną wartość "standalone")

### 3. Złożona Synchronizacja
**Problem**: Dane są synchronizowane w 3 miejscach:
- Lokalny state (`code`, `messages`, `logs`)
- ChatSession (w localStorage)
- UIProject (w localStorage)

**Skutek**: 
- Nieskończone pętle w `useEffect`
- Błędy "Maximum update depth exceeded"
- Trudność w debugowaniu

**Rozwiązanie**: 
- Używać bezpośrednio danych z `chatSessions` i `uiProjects`
- Lokalny state tylko dla UI (input, activeTab, etc.)
- Synchronizować tylko przy akcjach użytkownika

### 4. Problem z Wyświetlaniem Preview
**Problem**: Gdy przełączasz się na projekt z kodem, czasami pokazuje się ekran startowy

**Przyczyna**: 
- Warunek `{code && activePreviewTab !== "new-component"}` może być false
- `code` może być puste, jeśli `useEffect` nie załadował jeszcze danych
- `activePreviewTab` może być "new-component" zamiast "preview"

**Rozwiązanie**: 
- Upewnić się, że `handleSwitchProject` ustawia `activePreviewTab` na "preview" jeśli projekt ma kod
- Upewnić się, że `useEffect` ładujący projekt ustawia `activePreviewTab` na "preview"

## ✅ Proponowany Model Działania

### Zasada 1: Jedno Źródło Prawdy
- **Sesja** = źródło prawdy dla `messages`, `logs`, `a11yResults`
- **Projekt** = źródło prawdy dla `code`, `generationMetadata`
- **Lokalny state** = tylko dla UI (input, activeTab, etc.)

### Zasada 2: Synchronizacja Tylko Przy Akcjach
- Ładowanie: localStorage → state (tylko przy mount)
- Zapis: state → localStorage (tylko przy akcjach użytkownika)
- Brak synchronizacji w obie strony w `useEffect`

### Zasada 3: Jasne Relacje
- Projekt zawsze należy do sesji (`chatSessionId` wymagane)
- Gdy przełączasz sesję → pokaż projekty z tej sesji
- Gdy generujesz komponent → utwórz projekt z `chatSessionId`

### Zasada 4: Przejrzysty Przepływ
```
User Action → Update State → Save to localStorage → Re-render
```

Zamiast:
```
State Change → useEffect → Update State → useEffect → Update State → ...
```

## 🎨 Wizualizacja Przepływu

```
┌─────────────────────────────────────────────────────────┐
│                    PLAYGROUND UI                         │
├──────────────┬──────────────────────┬───────────────────┤
│ Chat History │   Preview/Code       │   Chat Panel      │
│              │                      │                   │
│ [Sessions]   │  [Project Tabs]      │  [Messages]       │
│  - Session 1 │   - Home             │  - User: "..."    │
│    - Project │   - Project A        │  - AI: "..."      │
│  - Session 2 │   - Project B        │                   │
│              │                      │  [Terminal]       │
│              │  [Preview/Code]      │  - Logs           │
│              │   - Preview          │  - A11y Results   │
│              │   - Code             │                   │
└──────────────┴──────────────────────┴───────────────────┘
                      ↓                    ↓
              ┌──────────────┐    ┌──────────────┐
              │  UIProject   │    │ ChatSession  │
              │  - code      │    │  - messages  │
              │  - metadata  │    │  - logs      │
              └──────────────┘    │  - a11y      │
                      ↓           └──────────────┘
              ┌──────────────┐            ↓
              │ localStorage │    ┌──────────────┐
              │  (projects)  │    │ localStorage │
              └──────────────┘    │  (sessions)  │
                                  └──────────────┘
```

## 🔍 Szczegóły Implementacji

### Warunki Wyświetlania

**Ekran Startowy (Welcome):**
```typescript
activePreviewTab === "new-component" && (!activeProjectId || !code)
```

**Preview/Code:**
```typescript
code && activePreviewTab !== "new-component"
```

**Chat Panel:**
```typescript
Zawsze widoczny, pokazuje messages z activeSession
```

**Terminal:**
```typescript
Pokazuje logs z activeSession (nie z projektu!)
```

### Automatyczne Przełączanie

**Po wygenerowaniu kodu:**
```typescript
setActivePreviewTab("preview") // Automatycznie przełącz na preview
```

**Po przełączeniu projektu:**
```typescript
if (project.code) {
  setActivePreviewTab("preview")
} else {
  setActivePreviewTab("new-component")
}
```

**Po przełączeniu sesji:**
```typescript
// Nie zmieniaj activePreviewTab
// Tylko załaduj messages, logs, a11yResults z sesji
```

## 🚀 Rekomendacje

1. **Uprościć model danych** - usunąć duplikację
2. **Uprościć synchronizację** - jeden kierunek przepływu danych
3. **Jasne relacje** - projekt zawsze należy do sesji
4. **Lepsze zarządzanie stanem** - użyć `useReducer` zamiast wielu `useState`
5. **Podział na komponenty** - wydzielić ChatPanel, PreviewPanel, TerminalPanel

