# Plan Refaktoringu page.tsx

**Plik:** `apps/demo/app/studio/page.tsx`  
**Obecny rozmiar:** 4989 linii  
**Cel:** Zredukować do ~300-500 linii (-90-94%)

---

## 📊 Analiza Struktury

### Główne sekcje w page.tsx:
1. **Imports** (~130 linii)
2. **State declarations** (~400 linii) - używa hooków, ale dużo lokalnego stanu
3. **useEffect hooks** (~800 linii) - wiele efektów synchronizujących stan
4. **Handler functions** (~1500 linii) - wszystkie akcje i logika biznesowa
5. **JSX return** (~2000 linii) - główny layout z wszystkimi komponentami
6. **Dialogi** (~220 linii) - wszystkie dialogi na końcu

---

## 🎯 Plan Refaktoringu (Krok po Kroku)

### Faza 1: Wyekstrahowanie Dialogów ✅ (Rozpoczęte)
**Czas:** ~2h  
**Cel:** Wyekstrahować wszystkie dialogi do `PlaygroundDialogs.tsx`

**Dialogi do wyekstrahowania:**
- File Path Dialog (showFileDialog)
- New Folder Dialog (uiState.showNewFolderDialog)
- New Component Confirmation Dialog (showNewComponentDialog)
- Variants Selection Dialog (showVariantsDialog)

**Utworzyć:**
- `apps/demo/src/components/playground/playground-dialogs.tsx`

**Pliki do zmodyfikowania:**
- `apps/demo/app/studio/page.tsx` - usunąć dialogi, dodać import PlaygroundDialogs

---

### Faza 2: Wyekstrahowanie Layoutu
**Czas:** ~4h  
**Cel:** Wyekstrahować główny layout z Resizable panels do `PlaygroundLayout.tsx`

**Utworzyć:**
- `apps/demo/src/components/playground/playground-layout.tsx`

**Co wyekstrahować:**
- Resizable panels structure
- Left sidebar rendering
- Right sidebar rendering
- Main content area structure

---

### Faza 3: Wyekstrahowanie Content Area
**Czas:** ~3h  
**Cel:** Wyekstrahować główną zawartość (preview, code, system tabs) do `PlaygroundContent.tsx`

**Utworzyć:**
- `apps/demo/src/components/playground/playground-content.tsx`

---

### Faza 4: Uproszczenie page.tsx
**Czas:** ~3h  
**Cel:** Zostać tylko orchestrator łączący hooki i komponenty

**Ostateczna struktura page.tsx:**
- Imports
- Hook declarations (usePlaygroundState, useCodeSync, etc.)
- Handler functions (używa hooków z usePlaygroundActions)
- JSX: ErrorBoundary → PlaygroundLayout z dialogami

**Oczekiwany rozmiar:** ~300-500 linii

---

## 📋 Checklist Fazy 1 (Dialogi)

- [ ] Stworzyć `PlaygroundDialogs.tsx` z interfejsem props
- [ ] Wyekstrahować File Path Dialog
- [ ] Wyekstrahować New Folder Dialog
- [ ] Wyekstrahować New Component Confirmation Dialog
- [ ] Wyekstrahować Variants Selection Dialog
- [ ] Zaktualizować `page.tsx` - usunąć dialogi, dodać `<PlaygroundDialogs />`
- [ ] Przetestować działanie
- [ ] Sprawdzić, czy nie ma błędów TypeScript
- [ ] Sprawdzić, czy nie ma błędów runtime

---

## 🎯 Metryki Sukcesu

**Przed refaktoringiem:**
- `page.tsx`: 4989 linii

**Po refaktoringu (cel):**
- `page.tsx`: ~300-500 linii (-90-94%)
- `PlaygroundDialogs.tsx`: ~220 linii
- `PlaygroundLayout.tsx`: ~500 linii
- `PlaygroundContent.tsx`: ~300 linii

**Łącznie:** ~1000-1500 linii w mniejszych, lepiej zorganizowanych plikach

---

## ⚠️ Uwagi

1. **Stopniowy refaktoring** - każdą fazę osobno, testować po każdej
2. **Zachować funkcjonalność** - nie zmieniać API/powierzchni publicznej
3. **TypeScript safety** - wszystkie typy muszą być poprawne
4. **Testowanie** - sprawdzić, czy wszystko działa po każdej fazie

---

**Ostatnia aktualizacja:** 2025-01-XX  
**Status:** Faza 1 - W trakcie

