# ⚡ Szybki Przewodnik Testowania - Phase 3

**Najprostszy sposób na przetestowanie Phase 3**

---

## 🚀 3 Kroki do Testowania

### Krok 1: Uruchom Serwery

```bash
cd /Users/blazejrzepa/Dev/fragment-ui
pnpm dev
```

**Czekaj aż zobaczysz:**
```
✓ Ready on http://localhost:3002
```

---

### Krok 2: Uruchom Testy API (Automatyczne)

W **nowym terminalu**:

```bash
cd /Users/blazejrzepa/Dev/fragment-ui/apps/demo
./test-phase3.sh
```

**Oczekiwany wynik:**
```
🧪 Testing Phase 3: Submissions + Governance

📝 Test 1: Create Submission
✅ Submission created: uuid-here

🔍 Test 2: Run Quality Checks
✅ Checks completed
"status":"rejected"

📋 Test 3: Get Submission
✅ Submission retrieved
   Status: rejected

📋 Test 5: List Submissions
   Found X submission(s)

✅ Phase 3 API Tests Complete
```

---

### Krok 3: Testy w Przeglądarce

#### Test A: Studio + Governance

1. **Otwórz:** http://localhost:3002/studio

2. **Wygeneruj komponent:**
   - W polu Copilot wpisz: `"create a button with red background"`
   - Naciśnij Enter
   - Poczekaj na wygenerowanie

3. **Sprawdź Governance:**
   - Kliknij zakładkę **"Governance"** w prawym panelu
   - Powinny pojawić się warnings:
     - ⚠️ Hardcoded colors
     - ⚠️ Token violations

4. **Sprawdź, że działa:**
   - ✅ Komponent się wyrenderował (mimo warnings)
   - ✅ Warnings są widoczne w Governance tab
   - ✅ Warnings nie blokują generowania

#### Test B: Submissions Page

1. **Otwórz:** http://localhost:3002/submissions

2. **Sprawdź listę:**
   - ✅ Powinna pokazać wszystkie submissions
   - ✅ Możesz filtrować (status, type)
   - ✅ Możesz sortować

3. **Otwórz szczegóły:**
   - Kliknij na dowolne submission
   - Powinien otworzyć się detail page

#### Test C: Review Interface

1. **Otwórz submission detail:**
   ```
   http://localhost:3002/submissions/{id}
   ```
   (Zastąp `{id}` ID z listy submissions)

2. **Testuj funkcje:**
   - ✅ Zakładki "TSX Code" i "UI-DSL" działają
   - ✅ Możesz zaznaczyć tekst i dodać komentarz
   - ✅ Przycisk "Approve" działa
   - ✅ Przycisk "Request Changes" działa

---

## 🎯 Checklist - Co Sprawdzić

### ✅ API Endpoints

- [ ] `POST /api/submissions` - tworzy submission
- [ ] `POST /api/submissions/{id}/run-checks` - uruchamia checks
- [ ] `GET /api/submissions/{id}` - pobiera submission
- [ ] `GET /api/submissions` - lista submissions
- [ ] `POST /api/submissions/{id}/approve` - approve
- [ ] `POST /api/submissions/{id}/request-changes` - request changes

### ✅ UI Features

- [ ] Studio - Governance tab pokazuje warnings
- [ ] Studio - Warnings nie blokują generowania
- [ ] Submissions page - lista działa
- [ ] Submissions page - filtry działają
- [ ] Submission detail - review interface działa
- [ ] Submission detail - można dodać komentarz
- [ ] Submission detail - approve/request changes działa

### ✅ Quality Checks

- [ ] A11y checks działają
- [ ] Lint checks działają
- [ ] Bundle checks działają
- [ ] Test presence checks działają
- [ ] Token checks (hardcoded colors) działają

---

## 🐛 Jeśli Coś Nie Działa

### Problem: Serwery nie startują

```bash
# Sprawdź czy porty są wolne
lsof -ti:3002
lsof -ti:3000

# Jeśli zajęte, zabij procesy:
kill -9 $(lsof -ti:3002)
kill -9 $(lsof -ti:3000)

# Uruchom ponownie
pnpm dev
```

### Problem: API nie odpowiada

```bash
# Sprawdź czy serwer działa
curl http://localhost:3002/api/submissions

# Jeśli błąd, sprawdź logi w terminalu gdzie działa `pnpm dev`
```

### Problem: Błędy w przeglądarce

1. Otwórz DevTools (F12)
2. Tab "Console" - sprawdź błędy
3. Tab "Network" - sprawdź requesty API
4. Sprawdź czy wszystkie requesty mają status 200

### Problem: Testy nie przechodzą

```bash
# Sprawdź szczegóły błędów
pnpm test --reporter=verbose

# Sprawdź czy wszystkie zależności są zainstalowane
pnpm install
```

---

## 📞 Szybka Pomoc

**Najczęstsze komendy:**

```bash
# Uruchom serwery
pnpm dev

# Testy API (gotowy skrypt)
cd apps/demo && ./test-phase3.sh

# Testy unit
pnpm test

# Testy E2E (z UI)
pnpm test:e2e:ui

# Lint
pnpm lint
```

**Przydatne URL-e:**

- Studio: http://localhost:3002/studio
- Submissions: http://localhost:3002/submissions
- API Docs: http://localhost:3002/api/submissions

---

## ✅ Gotowe!

Jeśli wszystkie testy przeszły, Phase 3 działa poprawnie! 🎉

**Następny krok:** Phase 4 (Releases + Experiments)

