# Design-to-Code Workflow - Best Practices

## 🎯 Najlepszy Flow dla Przebudowy UI Design System Portal

### ⚠️ **NIE** zaczynaj od pełnego designu w Figmie

**Dlaczego?**
- Design System Portal używa **istniejących komponentów Fragment UI**
- Nie potrzebujesz projektować komponentów od zera
- Lepiej iterować małymi krokami niż robić duży redesign

---

## ✅ **Rekomendowany Flow (Bezpieczny i Efektywny)**

### **Faza 1: Audit i Planowanie (1-2 dni)**

1. **Audit obecnego UI**
   - Zidentyfikuj problemy UX/UI
   - Zmapuj obecne ekrany i komponenty
   - Zdefiniuj cele przebudowy

2. **Wybierz podejście**
   - **Mała iteracja** → Code-first (prototyp w kodzie)
   - **Średnia zmiana** → Design-first (Figma → Code)
   - **Duża przebudowa** → Design-first z review

### **Faza 2: Design (tylko jeśli potrzebny)**

**Kiedy projektować w Figmie:**
- ✅ Nowe ekrany/flows
- ✅ Zmiany layoutu/structure
- ✅ Nowe wzorce UX
- ✅ Kompleksowe zmiany wizualne

**Kiedy NIE projektować w Figmie:**
- ❌ Małe zmiany (spacing, colors, typography)
- ❌ Refaktoring istniejących komponentów
- ✅ Używasz tylko Fragment UI components

**Jak projektować (jeśli potrzebne):**
1. Użyj **Fragment UI components w Figmie** (jeśli masz library)
2. Projektuj z użyciem **design tokens** (colors, spacing, typography)
3. Użyj **Figma Code Connect** do linkowania z kodem
4. Zaznacz, które komponenty Fragment UI używasz

### **Faza 3: Implementacja**

**Bezpieczny proces:**

1. **Utwórz branch** dla każdej zmiany
   ```
   feature/redesign-navigation
   feature/redesign-dashboard
   ```

2. **Zacznij od małych zmian**
   - Najpierw jeden ekran/sekcja
   - Testuj w izolacji
   - Merge do main po review

3. **Używaj Fragment UI components**
   ```tsx
   // ✅ DOBRZE - użyj istniejących komponentów
   import { Button, Card, NavigationMenu } from "@fragment_ui/ui";
   
   // ❌ ŹLE - nie twórz nowych komponentów od zera
   // (chyba że to nowy komponent do Fragment UI)
   ```

4. **Iteruj szybko**
   - Prototyp w kodzie
   - Testuj w przeglądarce
   - Poprawiaj na podstawie feedbacku

### **Faza 4: Testy i Review**

1. **Visual regression tests** (Chromatic)
2. **A11y tests** (automated)
3. **Manual review** (designer + developer)
4. **User testing** (jeśli duża zmiana)

---

## 🎨 **Rekomendowany Flow dla Fragment UI Portal**

### **Opcja A: Mała/Średnia Przebudowa (Rekomendowane)**

```
1. Audit obecnego UI (1 dzień)
   ↓
2. Prototyp w kodzie (2-3 dni)
   - Użyj Fragment UI components
   - Iteruj szybko w przeglądarce
   - Testuj różne warianty
   ↓
3. Design review (jeśli potrzebny)
   - Screenshoty z prototypu
   - Feedback od designera
   - Poprawki w kodzie
   ↓
4. Finalizacja i testy (1-2 dni)
   ↓
5. Deploy i monitorowanie
```

**Zalety:**
- ✅ Szybkie iteracje
- ✅ Widać od razu jak działa
- ✅ Mniej czasu na design
- ✅ Łatwiejsze testy

### **Opcja B: Duża Przebudowa**

```
1. Audit i research (2-3 dni)
   ↓
2. Design w Figmie (3-5 dni)
   - Użyj Fragment UI components library
   - Zaznacz użyte komponenty
   - Design tokens
   ↓
3. Design review i approval (1-2 dni)
   ↓
4. Implementacja (5-10 dni)
   - Użyj Figma Code Connect
   - Implementuj ekran po ekranie
   - Testuj każdy ekran
   ↓
5. Testy i poprawki (2-3 dni)
   ↓
6. Deploy (fazowe)
```

**Zalety:**
- ✅ Wszystko zaplanowane przed kodowaniem
- ✅ Mniej zmian w trakcie implementacji
- ✅ Lepsze dla dużych zmian

---

## 🛠️ **Narzędzia i Procesy Fragment UI**

### **1. Figma Code Connect**
- Linkuj Figma designs z kodem
- Automatyczna synchronizacja
- AI tools (Cursor/Copilot) widzą związek

**Setup:**
```bash
# Zainstaluj Figma Code Connect CLI
npm install -g @figma/code-connect

# Zmapuj komponenty
figma-code-connect map
```

### **2. MCP Server**
- Enforce design system rules
- Autocomplete i validation
- Zapobiega użyciu raw values

**Użycie:**
- Cursor/Copilot automatycznie używa Fragment UI
- Validation podczas kodowania
- Szybkie scaffolding

### **3. Component Playground**
- Testuj komponenty przed użyciem
- Eksperymentuj z props
- Kopiuj kod do projektu

### **4. Component Comparison Tool**
- Porównuj komponenty
- Wybierz właściwy komponent
- Zobacz różnice

---

## 📋 **Checklist dla Przebudowy**

### **Przed rozpoczęciem:**
- [ ] Audit obecnego UI
- [ ] Zdefiniuj cele i scope
- [ ] Wybierz flow (A lub B)
- [ ] Przygotuj branch strategy

### **Podczas designu (jeśli potrzebny):**
- [ ] Użyj Fragment UI components library
- [ ] Zaznacz użyte komponenty
- [ ] Użyj design tokens
- [ ] Zmapuj z kodem (Figma Code Connect)

### **Podczas implementacji:**
- [ ] Użyj Fragment UI components
- [ ] Testuj w izolacji
- [ ] Visual regression tests
- [ ] A11y tests
- [ ] Code review

### **Przed deployem:**
- [ ] Wszystkie testy przechodzą
- [ ] Design review (jeśli duża zmiana)
- [ ] User testing (jeśli duża zmiana)
- [ ] Dokumentacja zaktualizowana

---

## 🎯 **Rekomendacja dla Twojego Przypadku**

### **Jeśli przebudowa jest:**
- **Mała** (zmiana kolorów, spacing, typography) → **Code-first**
- **Średnia** (nowy layout, reorganizacja) → **Code-first z design review**
- **Duża** (nowe ekrany, kompleksowa zmiana) → **Design-first**

### **Najbezpieczniejszy flow (ogólnie):**

```
1. Prototyp w kodzie (2-3 dni)
   ↓
2. Design review (screenshots z prototypu)
   ↓
3. Poprawki w kodzie
   ↓
4. Testy i deploy
```

**Dlaczego?**
- ✅ Szybkie iteracje
- ✅ Widać od razu jak działa
- ✅ Mniej czasu na design
- ✅ Łatwiejsze testy
- ✅ Fragment UI components już istnieją

---

## 💡 **Best Practices**

1. **Używaj istniejących komponentów**
   - Nie projektuj od zera
   - Fragment UI ma już wszystko

2. **Iteruj małymi krokami**
   - Jeden ekran/sekcja na raz
   - Testuj i merge

3. **Używaj narzędzi Fragment UI**
   - Component Playground
   - Component Comparison
   - VS Code Extension
   - MCP Server

4. **Testuj wcześnie i często**
   - Visual regression
   - A11y tests
   - Manual review

5. **Dokumentuj zmiany**
   - Changelog
   - Migration guide (jeśli breaking changes)

---

## 🚀 **Quick Start**

### **Dla małej przebudowy:**
```bash
# 1. Utwórz branch
git checkout -b feature/redesign-navigation

# 2. Prototyp w kodzie
# Użyj Fragment UI components
# Testuj w przeglądarce

# 3. Testy
pnpm test
pnpm test:a11y

# 4. Review i merge
```

### **Dla dużej przebudowy:**
```bash
# 1. Design w Figmie
# Użyj Fragment UI components library
# Zmapuj z kodem (Figma Code Connect)

# 2. Implementacja
git checkout -b feature/redesign-dashboard
# Implementuj ekran po ekranie

# 3. Testy i review
# Visual regression, A11y, Manual review

# 4. Deploy fazowe
```

---

*Ostatnia aktualizacja: 2025-01-05*

