# GitHub Setup - Instrukcja

## ✅ Git zainicjalizowany!

Repozytorium zostało utworzone lokalnie z pierwszym commitem.

## 🚀 Następne kroki

### 1. Utwórz repozytorium na GitHub

**⚠️ WAŻNE:** Obecny projekt `fragment-ui` na GitHub zostaje jako publiczny (zawiera Studio/Playground).  
Nowe publiczne repo powinno mieć **inną nazwę**.

**Proponowane nazwy:**
- `fragment-ui-ds` (Design System)
- `fragment-design-system`
- `fragment-ui-components`
- `fragment-ui-public`

1. Przejdź do: https://github.com/new
2. **Repository name**: `fragment-ui-ds` (lub wybierz inną z powyższych)
3. **Description**: "AI-native design system components based on shadcn/ui"
4. **Visibility**: 
   - ✅ **Public** (jeśli chcesz open source)
   - ⚠️ **Private** (jeśli chcesz najpierw przetestować)
5. **NIE zaznaczaj**:
   - ❌ Add a README file (już mamy)
   - ❌ Add .gitignore (już mamy)
   - ❌ Choose a license (już mamy MIT)
6. Kliknij **"Create repository"**

### 2. Połącz lokalne repo z GitHub

Po utworzeniu repozytorium, GitHub pokaże instrukcje. Użyj tej komendy:

```bash
cd /Users/blazejrzepa/Dev/fragment-ui-public

# Jeśli repo jest puste (bez README)
git remote add origin https://github.com/YOUR_USERNAME/fragment-ui-ds.git
git branch -M main
git push -u origin main

# Jeśli GitHub utworzył README (choć nie powinien)
git remote add origin https://github.com/YOUR_USERNAME/fragment-ui-ds.git
git branch -M main
git pull origin main --allow-unrelated-histories
git push -u origin main

# ⚠️ Zastąp fragment-ui-ds wybraną nazwą repozytorium!
```

**Zastąp `YOUR_USERNAME` swoją nazwą użytkownika GitHub!**

### 3. Sprawdź czy działa

```bash
git remote -v
# Powinno pokazać:
# origin  https://github.com/YOUR_USERNAME/fragment-ui-ds.git (fetch)
# origin  https://github.com/YOUR_USERNAME/fragment-ui-ds.git (push)
```

### 4. Ustawienia repozytorium (opcjonalnie)

Na GitHub, w ustawieniach repozytorium:

- **General** → **Features**:
  - ✅ Issues
  - ✅ Discussions (opcjonalnie)
  - ✅ Projects (opcjonalnie)
  - ✅ Wiki (opcjonalnie)

- **General** → **Topics**:
  Dodaj: `react`, `design-system`, `typescript`, `tailwind`, `shadcn`, `mcp`, `ai`, `components`

- **Pages** (jeśli chcesz hostować docs):
  - Source: `gh-pages` branch lub `main` branch `/apps/www`

### 5. Utwórz pierwszy Release (opcjonalnie)

```bash
git tag -a v0.1.0 -m "First public release"
git push origin v0.1.0
```

Potem na GitHub:
- Przejdź do **Releases** → **Draft a new release**
- Tag: `v0.1.0`
- Title: "Fragment UI v0.1.0 - First Public Release"
- Description: Zobacz `PUBLIC_REPO_SUMMARY.md`

## 📝 Szybkie komendy

```bash
# Sprawdź status
git status

# Zobacz historię
git log --oneline

# Dodaj zmiany
git add .
git commit -m "Your message"

# Push do GitHub
git push

# Zobacz remote
git remote -v
```

## 🎉 Gotowe!

Po wykonaniu tych kroków, Twoje repozytorium będzie dostępne publicznie na GitHub!

