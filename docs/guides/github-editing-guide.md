# 📝 Jak Edytować Pliki w GitHub - Przewodnik Krok po Kroku

Ten przewodnik pokazuje dokładnie gdzie znaleźć przycisk edycji w GitHub i jak edytować pliki MDX.

---

## 🎯 Gdzie Znaleźć Przycisk Edycji

### Krok 1: Otwórz Plik w GitHub

1. **Przejdź do repozytorium:**
   ```
   https://github.com/blazejrzepa/fragment-ui
   ```

2. **Znajdź plik MDX:**
   - Kliknij na folder `apps`
   - Kliknij na folder `www`
   - Kliknij na folder `app`
   - Kliknij na folder `docs`
   - Kliknij na folder `get-started`
   - Kliknij na folder `introduction`
   - Kliknij na plik `page.mdx`

   **Lub użyj wyszukiwarki GitHub:**
   - Naciśnij `t` (quick file finder)
   - Wpisz: `introduction/page.mdx`
   - Wybierz plik z listy

### Krok 2: Znajdź Przycisk Edycji

Po otwarciu pliku, w prawym górnym rogu zobaczysz:

```
┌─────────────────────────────────────────┐
│  [Raw] [Blame] [✏️ Edit] [🗑️ Delete]    │  ← Tu jest przycisk!
└─────────────────────────────────────────┘
```

**Przycisk "Edit" (✏️) znajduje się:**
- W prawym górnym rogu strony pliku
- Obok przycisków "Raw" i "Blame"
- Ma ikonę ołówka (✏️) i tekst "Edit"

---

## 📸 Wizualizacja

```
GitHub File View:
┌─────────────────────────────────────────────────────┐
│  fragment-ui / apps / www / app / docs / ...        │
├─────────────────────────────────────────────────────┤
│                                                     │
│  [Raw] [Blame] [✏️ Edit] [🗑️ Delete]  ← TU!        │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │  import { DocLayout } from ...             │   │
│  │                                             │   │
│  │  export default function ...               │   │
│  │    ...                                     │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 🔄 Alternatywne Sposoby

### Metoda 1: Bezpośredni Link do Edycji

Możesz użyć bezpośredniego linku do edycji:

```
https://github.com/blazejrzepa/fragment-ui/edit/main/apps/www/app/docs/get-started/introduction/page.mdx
```

**Struktura URL:**
```
https://github.com/[USERNAME]/[REPO]/edit/[BRANCH]/[PATH]
```

### Metoda 2: Skrót Klawiszowy

1. Otwórz plik w GitHub
2. Naciśnij `.` (kropka) - otworzy GitHub Codespaces
3. Edytuj plik w przeglądarce

### Metoda 3: GitHub Web Editor

1. Otwórz plik w GitHub
2. Naciśnij `e` (skrót klawiszowy do edycji)
3. Zostaniesz przekierowany do edytora

---

## ✏️ Proces Edycji Krok po Kroku

### 1. Kliknij "Edit"

```
Kliknij tutaj → [✏️ Edit]
```

### 2. GitHub Otworzy Edytor

Zobaczysz:
- Edytor tekstu z zawartością pliku
- Przycisk "Preview" do podglądu
- Pole "Commit changes" na dole

### 3. Wprowadź Zmiany

Edytuj zawartość w edytorze:
```mdx
<h2 id="new-section">New Section</h2>
<p>Your new content here...</p>
```

### 4. Podgląd (Opcjonalnie)

Kliknij "Preview" aby zobaczyć jak będzie wyglądać:
```
[Edit] [Preview]  ← Kliknij Preview
```

### 5. Zapisz Zmiany

Na dole strony znajdziesz:

```
┌─────────────────────────────────────────┐
│  Commit changes                         │
│  ┌───────────────────────────────────┐ │
│  │  Update page.mdx                  │ │ ← Tytuł commita
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │  Add new section to introduction  │ │ ← Opis (opcjonalnie)
│  └───────────────────────────────────┘ │
│                                         │
│  ☐ Commit directly to the main branch  │
│  ☑ Create a new branch for this commit │ ← Zaznacz to!
│    and start a pull request            │
│                                         │
│  [Commit changes]  ← Kliknij tutaj     │
└─────────────────────────────────────────┘
```

**Ważne:**
- ✅ Zaznacz "Create a new branch for this commit"
- ✅ Wpisz tytuł commita (np. "docs: Update introduction page")
- ✅ Kliknij "Commit changes"

### 6. Utwórz Pull Request

Po zapisaniu, GitHub automatycznie:
1. Utworzy nowy branch
2. Zaproponuje utworzenie Pull Request
3. Pokaże przycisk "Create pull request"

Kliknij "Create pull request" i wypełnij formularz.

---

## 🎨 Przykład Edycji

### Przed:
```mdx
<h2 id="key-features">Key Features</h2>
<ul>
  <li>Feature 1</li>
  <li>Feature 2</li>
</ul>
```

### Po Edycji:
```mdx
<h2 id="key-features">Key Features</h2>
<ul>
  <li>Feature 1</li>
  <li>Feature 2</li>
  <li>Feature 3 - NEW!</li>  ← Dodane
</ul>
```

---

## ⚠️ Ważne Uwagi

### 1. Zawsze Twórz Branch

**NIE rób tego:**
```
☐ Commit directly to the main branch  ← NIE zaznaczaj!
```

**Zrób to:**
```
☑ Create a new branch for this commit  ← Zaznacz to!
```

### 2. Sprawdź Formatowanie

- Upewnij się, że składnia MDX jest poprawna
- Sprawdź czy wszystkie tagi są zamknięte
- Użyj "Preview" przed zapisaniem

### 3. Testuj Lokalnie (Opcjonalnie)

Jeśli chcesz przetestować przed commitem:

```bash
# Sklonuj repo
git clone https://github.com/blazejrzepa/fragment-ui.git
cd fragment-ui

# Przełącz się na nowy branch (po utworzeniu w GitHub)
git fetch origin
git checkout nazwa-brancha

# Testuj lokalnie
cd apps/www
pnpm dev
# Otwórz http://localhost:3000/docs/get-started/introduction
```

---

## 🔍 Gdzie Jest Przycisk - Szybkie Odniesienie

| Lokalizacja | Jak Znaleźć |
|-------------|-------------|
| **Prawy górny róg** | Po otwarciu pliku, w pasku z przyciskami |
| **Obok "Raw" i "Blame"** | W tym samym rzędzie co inne przyciski |
| **Ikona ołówka** | ✏️ symbol obok tekstu "Edit" |
| **Skrót klawiszowy** | Naciśnij `e` gdy plik jest otwarty |

---

## 📱 Na Mobile

Na urządzeniach mobilnych:
1. Otwórz plik w GitHub mobile app
2. Przycisk "Edit" znajduje się w menu (trzy kropki ⋮)
3. Lub użyj wersji desktopowej w przeglądarce

---

## 🆘 Problem: Nie Widzę Przycisku "Edit"

**Możliwe przyczyny:**

1. **Brak uprawnień:**
   - Musisz mieć write access do repozytorium
   - Skontaktuj się z właścicielem repo

2. **Jesteś na branchu, który nie istnieje:**
   - Przełącz się na branch `main`

3. **Plik jest w fork:**
   - Edytuj w swoim forku, potem stwórz PR do głównego repo

4. **Użyj bezpośredniego linku:**
   ```
   https://github.com/blazejrzepa/fragment-ui/edit/main/apps/www/app/docs/get-started/introduction/page.mdx
   ```

---

## ✅ Checklist Przed Edycją

- [ ] Mam dostęp do repozytorium (write permissions)
- [ ] Wiem gdzie jest plik (`apps/www/app/docs/get-started/introduction/page.mdx`)
- [ ] Znam składnię MDX
- [ ] Wiem jak utworzyć Pull Request
- [ ] Rozumiem proces review

---

## 🔗 Przydatne Linki

- **Bezpośredni link do edycji introduction:**
  ```
  https://github.com/blazejrzepa/fragment-ui/edit/main/apps/www/app/docs/get-started/introduction/page.mdx
  ```

- **GitHub Docs - Editing Files:**
  https://docs.github.com/en/repositories/working-with-files/managing-files/editing-files

- **MDX Editing Guide:**
  [mdx-editing.md](./mdx-editing.md)

---

**Ostatnia aktualizacja:** 2025-01-05

