# Setup: Private Repository dla fragment-ui-public

## 🎯 Cel

Utworzyć **private** repozytorium na GitHub dla czystego design systemu.

## 📋 Strategia

- **`fragment-ui`** (obecne) → **PUBLIC** (zawiera Studio/Playground)
- **`fragment-ui-public`** (nowe) → **PRIVATE** (czysty design system)

## 🚀 Kroki

### 1. Utwórz nowe PRIVATE repo na GitHub

1. Przejdź do: https://github.com/new
2. **Repository name**: `fragment-ui-ds` (lub inna nazwa)
3. **Description**: "Clean Fragment UI Design System - UI components, tokens, blocks, and MCP server"
4. **Visibility**: ✅ **Private** (ważne!)
5. **NIE zaznaczaj**:
   - ❌ Add a README file (już mamy)
   - ❌ Add .gitignore (już mamy)
   - ❌ Choose a license (już mamy MIT)
6. Kliknij **"Create repository"**

### 2. Połącz lokalne repo z GitHub

```bash
cd /Users/blazejrzepa/Dev/fragment-ui-public

# Zastąp YOUR_USERNAME i fragment-ui-ds odpowiednimi wartościami
git remote add origin https://github.com/YOUR_USERNAME/fragment-ui-ds.git
git branch -M main
git push -u origin main
```

### 3. Sprawdź

```bash
git remote -v
# Powinno pokazać:
# origin  https://github.com/YOUR_USERNAME/fragment-ui-ds.git (fetch)
# origin  https://github.com/YOUR_USERNAME/fragment-ui-ds.git (push)
```

## 🔄 Późniejsza zmiana na Public (opcjonalnie)

Jeśli w przyszłości zechcesz zmienić to repo na publiczne:

1. Na GitHub: Settings → Danger Zone → Change visibility → Make public
2. Zaktualizuj README (jeśli potrzebne)
3. Rozważ publikację pakietów na npm

## 📝 Uwagi

- To repo jest **czystsze** niż obecne `fragment-ui`
- Nie zawiera Studio/Playground/telemetry
- Możesz spokojnie testować przed publikacją
- Możesz później zdecydować czy publikować

## ✅ Status

- [x] Git zainicjalizowany lokalnie
- [x] Pierwszy commit utworzony
- [ ] Repo utworzone na GitHub (PRIVATE)
- [ ] Połączone z GitHub
- [ ] Kod wypushowany

