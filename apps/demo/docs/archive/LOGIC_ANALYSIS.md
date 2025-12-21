# Analiza Logiki Projektu Playground

## ❌ Główne Problemy Logiczne

### 1. **Duplikacja Danych - Największy Problem**

**Obecna sytuacja:**
```typescript
ChatSession {
  code: string;              // ❌ Kod jest tutaj
  generationMetadata: ...;   // ❌ Metadane są tutaj
  logs: LogEntry[];          // ✅ Logi powinny być tutaj
  a11yResults: ...;          // ✅ A11y powinny być tutaj
  messages: Message[];        // ✅ Wiadomości są tutaj
}

UIProject {
  code: string;              // ❌ Kod jest też tutaj (DUPLIKACJA!)
  generationMetadata: ...;   // ❌ Metadane są też tutaj (DUPLIKACJA!)
  logs: LogEntry[];          // ❌ Logi są też tutaj (DUPLIKACJA!)
  a11yResults: ...;         // ❌ A11y są też tutaj (DUPLIKACJA!)
  chatSessionId?: string;    // ✅ Relacja do sesji
}
```

**Problem:**
- Kod jest w **dwóch miejscach** (sesja i projekt)
- Nie wiadomo, które jest "prawdziwe"
- Synchronizacja między nimi jest skomplikowana i podatna na błędy

**Skutek:**
- Kod może być różny w sesji i projekcie
- Trudno określić, które dane są aktualne
- Pętle w `useEffect` próbujące synchronizować oba źródła

### 2. **Niejasna Relacja Sesja ↔ Projekt**

**Obecna sytuacja:**
- `UIProject.chatSessionId` jest **opcjonalne** (`chatSessionId?: string`)
- Projekt może istnieć bez sesji
- Sesja może mieć kod bez projektu

**Problem:**
- Nie wiadomo, czy projekt należy do sesji
- Można mieć projekt bez sesji i sesję bez projektu
- Trudno filtrować projekty według sesji

**Pytania bez odpowiedzi:**
- Co się dzieje, gdy usuniesz sesję? Czy projekt też powinien zniknąć?
- Co się dzieje, gdy usuniesz projekt? Czy kod w sesji też powinien zniknąć?
- Jeśli kod jest w sesji i projekcie, który jest "prawdziwy"?

### 3. **Mieszanie Odpowiedzialności**

**Obecna sytuacja:**
- `ChatSession` zawiera:
  - ✅ Konwersację (messages) - OK
  - ✅ Logi (logs) - OK
  - ✅ A11y (a11yResults) - OK
  - ❌ Kod (code) - **NIE POWINNO BYĆ TUTAJ**
  - ❌ Metadane (generationMetadata) - **NIE POWINNO BYĆ TUTAJ**

- `UIProject` zawiera:
  - ✅ Kod (code) - OK
  - ✅ Metadane (generationMetadata) - OK
  - ❌ Logi (logs) - **NIE POWINNO BYĆ TUTAJ**
  - ❌ A11y (a11yResults) - **NIE POWINNO BYĆ TUTAJ**

**Problem:**
- `ChatSession` powinien reprezentować **konwersację**, nie kod
- `UIProject` powinien reprezentować **komponent**, nie logi
- Obecnie oba mają wszystko, co powoduje zamieszanie

### 4. **Złożona Synchronizacja (3 Miejsca)**

**Obecna sytuacja:**
Dane są synchronizowane w **3 miejscach**:
1. Lokalny state (`code`, `messages`, `logs`, `a11yResults`)
2. `ChatSession` (w localStorage)
3. `UIProject` (w localStorage)

**Problem:**
```
User Action
  ↓
Update State (1)
  ↓
useEffect → Update ChatSession (2)
  ↓
useEffect → Update UIProject (3)
  ↓
useEffect → Update State (1) ← PĘTLA!
```

**Skutek:**
- Nieskończone pętle w `useEffect`
- Błędy "Maximum update depth exceeded"
- Trudność w debugowaniu
- Nieprzewidywalne zachowanie

### 5. **Niejasne Źródło Prawdy**

**Obecna sytuacja:**
W kodzie widzę, że:
- Kod jest ładowany z projektu (linia 304 w page.tsx)
- Ale też jest ładowany z sesji (linia 555 w page.tsx)
- I jest zapisywany do obu (sesji i projektu)

**Problem:**
- Nie wiadomo, które jest "prawdziwe"
- Kod może być różny w sesji i projekcie
- Trudno określić, które dane są aktualne

**Przykład problemu:**
```typescript
// W handleSendMessage:
updateActiveSession({ code: generatedCode });  // Zapis do sesji
updateActiveProject({ code: generatedCode });  // Zapis do projektu

// W useEffect:
if (session.code) { setCode(session.code); }   // Ładowanie z sesji
if (project.code) { setCode(project.code); }   // Ładowanie z projektu

// Które jest prawdziwe? Oba? A co jeśli są różne?
```

## ✅ Jak Powinno Być (Logiczny Model)

### Zasada 1: Jedno Źródło Prawdy

**ChatSession** = źródło prawdy dla:
- `messages` - konwersacja z AI
- `logs` - logi z terminala (związane z sesją)
- `a11yResults` - wyniki dostępności (związane z sesją)

**UIProject** = źródło prawdy dla:
- `code` - kod komponentu
- `generationMetadata` - metadane generowania
- `chatSessionId` - **wymagane**, nie opcjonalne

### Zasada 2: Jasne Relacje

```
ChatSession (1) ──< (wiele) UIProject
```

- Jeden `ChatSession` może mieć wiele `UIProject`
- Każdy `UIProject` **musi** należeć do `ChatSession`
- `chatSessionId` jest **wymagane**, nie opcjonalne

### Zasada 3: Brak Duplikacji

**ChatSession:**
```typescript
{
  id: string;
  title: string;
  messages: Message[];        // ✅ Tylko konwersacja
  logs: LogEntry[];           // ✅ Tylko logi
  a11yResults: A11yResults;   // ✅ Tylko a11y
  createdAt: Date;
  // ❌ NIE MA: code, generationMetadata
}
```

**UIProject:**
```typescript
{
  id: string;
  title: string;
  code: string;               // ✅ Tylko kod
  generationMetadata: ...;    // ✅ Tylko metadane
  chatSessionId: string;     // ✅ WYMAGANE (nie opcjonalne)
  createdAt: Date;
  // ❌ NIE MA: logs, a11yResults
}
```

### Zasada 4: Prosta Synchronizacja

**Tylko jeden kierunek:**
```
User Action → Update State → Save to localStorage → Re-render
```

**Zamiast:**
```
State Change → useEffect → Update State → useEffect → Update State → ...
```

## 🔧 Proponowane Zmiany

### 1. Usunąć z ChatSession:
- ❌ `code`
- ❌ `generationMetadata`

### 2. Usunąć z UIProject:
- ❌ `logs`
- ❌ `a11yResults`

### 3. Wymusić relację:
- `chatSessionId` w `UIProject` powinno być **wymagane** (nie opcjonalne)
- Projekt zawsze należy do sesji

### 4. Uprościć synchronizację:
- Lokalny state tylko dla UI (input, activeTab, etc.)
- Dane z `chatSessions` i `uiProjects` są źródłem prawdy
- Synchronizować tylko przy akcjach użytkownika

## 📊 Porównanie: Obecny vs Proponowany

### Obecny Model (Nielogiczny):
```
ChatSession {
  messages, logs, a11yResults, code, generationMetadata
}
UIProject {
  code, generationMetadata, logs, a11yResults, chatSessionId?
}
```
**Problem:** Duplikacja, niejasne relacje, złożona synchronizacja

### Proponowany Model (Logiczny):
```
ChatSession {
  messages, logs, a11yResults
}
UIProject {
  code, generationMetadata, chatSessionId (wymagane)
}
```
**Korzyści:** Brak duplikacji, jasne relacje, prosta synchronizacja

## 🎯 Wnioski

**Czy projekt jest logiczny?** 

**NIE** - obecny model ma poważne problemy logiczne:
1. ❌ Duplikacja danych (kod w sesji i projekcie)
2. ❌ Niejasne relacje (opcjonalne chatSessionId)
3. ❌ Mieszanie odpowiedzialności (sesja ma kod, projekt ma logi)
4. ❌ Złożona synchronizacja (3 miejsca, pętle)
5. ❌ Niejasne źródło prawdy (nie wiadomo, które dane są aktualne)

**Czy można to naprawić?**

**TAK** - proponowane zmiany:
1. ✅ Usunąć duplikację (kod tylko w projekcie, logi tylko w sesji)
2. ✅ Wymusić relację (chatSessionId wymagane)
3. ✅ Rozdzielić odpowiedzialności (sesja = konwersacja, projekt = kod)
4. ✅ Uprościć synchronizację (jeden kierunek)
5. ✅ Jasne źródło prawdy (sesja dla konwersacji, projekt dla kodu)

## 🚀 Następne Kroki

1. **Refaktoryzacja typów:**
   - Usunąć `code` i `generationMetadata` z `ChatSession`
   - Usunąć `logs` i `a11yResults` z `UIProject`
   - Wymusić `chatSessionId` w `UIProject`

2. **Refaktoryzacja logiki:**
   - Usunąć synchronizację kodu z sesji
   - Usunąć synchronizację logów z projektu
   - Uprościć `useEffect` hooks

3. **Migracja danych:**
   - Przenieść kod z sesji do projektów
   - Przenieść logi z projektów do sesji
   - Upewnić się, że wszystkie projekty mają `chatSessionId`

4. **Testy:**
   - Sprawdzić, czy wszystko działa po refaktoryzacji
   - Upewnić się, że dane są spójne
   - Sprawdzić, czy nie ma pętli w `useEffect`

