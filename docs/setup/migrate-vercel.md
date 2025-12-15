# 🔄 Migracja domeny z fragment-ui na fragment-ui-public w Vercel

## 📋 Sytuacja

Masz już:
- ✅ Domena `fragmentui.com` skonfigurowana w Vercel
- ✅ Podpięta do projektu `fragment-ui` (stary)
- ❌ Chcesz przenieść na projekt `fragment-ui-public` (nowy)

## 🚀 Rozwiązanie: Przenieś domenę do nowego projektu

### KROK 1: Dodaj nowy projekt `fragment-ui-public` do Vercel

1. **Otwórz Vercel Dashboard**: https://vercel.com/dashboard
2. Kliknij **"Add New..."** → **"Project"**
3. Kliknij **"Import Git Repository"**
4. Znajdź i wybierz: **`blazejrzepa/fragment-ui-public`**
5. **Skonfiguruj projekt:**
   - **Framework Preset**: Next.js (automatycznie)
   - **Root Directory**: `apps/www` (WAŻNE! Kliknij "Edit" i zmień)
   - **Build Command**: (zostaw puste - użyjemy z vercel.json)
   - **Output Directory**: `.next` (automatycznie)
   - **Install Command**: `pnpm install` (lub zostaw puste)
6. Kliknij **"Deploy"**
7. Poczekaj na zakończenie builda (2-5 minut)

**✅ Teraz masz dwa projekty w Vercel:**
- `fragment-ui` (stary)
- `fragment-ui-public` (nowy)

---

### KROK 2: Przenieś domenę do nowego projektu

#### Opcja A: Przenieś domenę (zalecane)

1. **Otwórz projekt `fragment-ui-public`** w Vercel Dashboard
2. Przejdź do **Settings** → **Domains**
3. W polu "Add Domain", wpisz: `fragmentui.com`
4. Kliknij **"Add"**
5. Vercel wykryje, że domena jest już używana w innym projekcie
6. Pojawi się opcja: **"Transfer from another project"** lub **"Move domain"**
7. Wybierz projekt `fragment-ui` z listy
8. Kliknij **"Transfer"** lub **"Move"**
9. Potwierdź przeniesienie

**✅ Domena jest teraz przypisana do `fragment-ui-public`**

#### Opcja B: Usuń ze starego, dodaj do nowego (alternatywa)

Jeśli Opcja A nie działa:

1. **Otwórz projekt `fragment-ui`** (stary)
2. Przejdź do **Settings** → **Domains**
3. Znajdź `fragmentui.com` na liście
4. Kliknij **"Remove"** obok domeny
5. Potwierdź usunięcie
6. **Otwórz projekt `fragment-ui-public`** (nowy)
7. Przejdź do **Settings** → **Domains**
8. W polu "Add Domain", wpisz: `fragmentui.com`
9. Kliknij **"Add"**
10. Vercel pokaże instrukcje DNS (ale powinny być już skonfigurowane)
11. Kliknij **"Refresh"** - domena powinna się zweryfikować automatycznie

**✅ Domena jest teraz przypisana do `fragment-ui-public`**

---

### KROK 3: Zweryfikuj

1. **Sprawdź w nowym projekcie:**
   - Otwórz `fragment-ui-public` → Settings → Domains
   - Sprawdź czy `fragmentui.com` jest na liście
   - Status powinien być: **"Valid Configuration"** ✅

2. **Sprawdź czy strona działa:**
   - Otwórz: https://fragmentui.com
   - Sprawdź czy ładuje się nowa wersja (z `fragment-ui-public`)
   - Sprawdź czy wszystkie linki działają

3. **Sprawdź deployment:**
   - W projekcie `fragment-ui-public` → Deployments
   - Sprawdź czy ostatni deployment jest aktywny
   - Sprawdź czy domena wskazuje na ten deployment

---

### KROK 4: (Opcjonalnie) Usuń stary projekt

Jeśli nie potrzebujesz już projektu `fragment-ui` w Vercel:

1. **Otwórz projekt `fragment-ui`** w Vercel Dashboard
2. Przejdź do **Settings** → **General**
3. Przewiń na dół do sekcji **"Danger Zone"**
4. Kliknij **"Delete Project"**
5. Wpisz nazwę projektu: `fragment-ui`
6. Kliknij **"Delete"**
7. Potwierdź usunięcie

**⚠️ UWAGA:** To usunie tylko projekt z Vercel, nie usunie repozytorium z GitHub!

---

## 🔍 Troubleshooting

### Problem: Vercel nie pozwala przenieść domeny

**Rozwiązanie:**
- Użyj Opcji B (usuń ze starego, dodaj do nowego)
- DNS jest już skonfigurowany, więc domena powinna się zweryfikować automatycznie

### Problem: Domena nie działa po przeniesieniu

**Rozwiązanie:**
1. Sprawdź czy domena jest przypisana do właściwego projektu
2. Sprawdź czy deployment się powiódł
3. Sprawdź czy DNS jest poprawnie skonfigurowany
4. Poczekaj kilka minut na propagację

### Problem: Strona pokazuje starą wersję

**Rozwiązanie:**
1. Sprawdź cache przeglądarki (Ctrl+Shift+R lub Cmd+Shift+R)
2. Sprawdź czy deployment w nowym projekcie się powiódł
3. Sprawdź czy domena wskazuje na właściwy deployment

---

## ✅ Checklist

Po przeniesieniu domeny:

- [ ] Projekt `fragment-ui-public` jest dodany do Vercel
- [ ] Domena `fragmentui.com` jest przypisana do `fragment-ui-public`
- [ ] Status domeny: "Valid Configuration"
- [ ] https://fragmentui.com ładuje się poprawnie
- [ ] Wszystkie linki działają
- [ ] Registry działa: https://fragmentui.com/r/button.json
- [ ] (Opcjonalnie) Stary projekt `fragment-ui` usunięty z Vercel

---

## 🎉 Gotowe!

Teraz:
- ✅ `fragmentui.com` wskazuje na projekt `fragment-ui-public`
- ✅ Każdy push do `fragment-ui-public` automatycznie deployuje się na fragmentui.com
- ✅ Stary projekt `fragment-ui` może zostać usunięty (opcjonalnie)

---

**Powodzenia! 🚀**

