# Quick Start - Push do Private Repo

## ✅ Status

- [x] Obecne `fragment-ui` jest już PUBLIC na GitHub
- [x] Nowe repo `fragment-ui-public` gotowe lokalnie
- [ ] Trzeba utworzyć PRIVATE repo na GitHub i push

## 🚀 Szybkie kroki

### 1. Utwórz PRIVATE repo na GitHub

1. Przejdź do: https://github.com/new
2. **Repository name**: `fragment-ui-ds` (lub wybierz inną nazwę)
3. **Description**: "Clean Fragment UI Design System"
4. **Visibility**: ✅ **Private** (ważne!)
5. **NIE zaznaczaj**: README, .gitignore, LICENSE
6. Kliknij **"Create repository"**

### 2. Push lokalnego repo

Po utworzeniu repo, GitHub pokaże instrukcje. Użyj tych komend:

```bash
cd /Users/blazejrzepa/Dev/fragment-ui-public

# Zastąp YOUR_USERNAME i fragment-ui-ds
git remote add origin https://github.com/YOUR_USERNAME/fragment-ui-ds.git
git branch -M main
git push -u origin main
```

### 3. Sprawdź

```bash
git remote -v
# Powinno pokazać URL do Twojego private repo
```

## 📝 Notatki

- To repo jest **private** - możesz spokojnie testować
- Możesz później zmienić na public, gdy będzie gotowe
- Wszystkie pakiety się budują ✅
- Brak zależności od Studio/telemetry ✅

## 🎯 Co dalej?

Po pushu możesz:
- Testować lokalnie
- Dodać CI/CD (GitHub Actions)
- Rozważyć publikację pakietów na npm
- Zmienić na public, gdy będzie gotowe

