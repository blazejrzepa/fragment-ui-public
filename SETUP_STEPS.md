# 🚀 Krok po kroku: Setup fragmentui.com

## 📋 Przegląd kroków

1. ✅ Zmień `fragment-ui` na PRIVATE
2. ✅ Połącz `fragment-ui-public` z Vercel
3. ✅ Skonfiguruj domenę fragmentui.com
4. ✅ Przetestuj deployment
5. ✅ Zweryfikuj wszystko działa

---

## KROK 1: Zmień `fragment-ui` na PRIVATE

### 1.1 Otwórz repozytorium na GitHub

1. Przejdź do: https://github.com/blazejrzepa/fragment-ui
2. Kliknij **Settings** (w górnym menu repozytorium)

### 1.2 Zmień widoczność na PRIVATE

1. W Settings, przewiń na dół do sekcji **"Danger Zone"**
2. Kliknij **"Change visibility"**
3. Wybierz **"Change to private"**
4. Wpisz nazwę repozytorium: `blazejrzepa/fragment-ui`
5. Kliknij **"I understand, change repository visibility"**
6. Potwierdź zmianę

### 1.3 Zweryfikuj

- Sprawdź czy repo jest teraz PRIVATE (ikona kłódki obok nazwy)

**✅ KROK 1 ZAKOŃCZONY**

---

## KROK 2: Połącz `fragment-ui-public` z Vercel

### 2.1 Zaloguj się do Vercel

1. Przejdź do: https://vercel.com
2. Zaloguj się (użyj GitHub account - zalecane)
3. Jeśli nie masz konta, utwórz je (darmowe)

### 2.2 Importuj repozytorium

1. W Vercel Dashboard, kliknij **"Add New..."** → **"Project"**
2. Kliknij **"Import Git Repository"**
3. Znajdź i wybierz: **`blazejrzepa/fragment-ui-public`**
4. Jeśli nie widzisz repo, kliknij **"Adjust GitHub App Permissions"** i zezwól na dostęp

### 2.3 Skonfiguruj projekt

Po wybraniu repozytorium, Vercel pokaże konfigurację:

**Framework Preset:**
- Wybierz: **Next.js** (powinno być automatycznie wykryte)

**Root Directory:**
- Kliknij **"Edit"** obok "Root Directory"
- Zmień na: `apps/www`
- Kliknij **"Continue"**

**Build and Output Settings:**
- **Build Command:** (zostaw puste - użyjemy z vercel.json)
- **Output Directory:** `.next` (powinno być automatycznie)
- **Install Command:** `pnpm install` (lub zostaw puste)

**Environment Variables:**
- Na razie zostaw puste (dodamy później jeśli potrzeba)

### 2.4 Deploy

1. Kliknij **"Deploy"**
2. Poczekaj na zakończenie builda (2-5 minut)
3. Po zakończeniu, zobaczysz link: `https://fragment-ui-public-xxx.vercel.app`

**✅ KROK 2 ZAKOŃCZONY**

---

## KROK 3: Skonfiguruj domenę fragmentui.com

### 3.1 Dodaj domenę w Vercel

1. W Vercel Dashboard, otwórz projekt `fragment-ui-public`
2. Przejdź do zakładki **"Settings"**
3. Kliknij **"Domains"** w lewym menu
4. W polu "Add Domain", wpisz: `fragmentui.com`
5. Kliknij **"Add"**

### 3.2 Skonfiguruj DNS

Vercel pokaże instrukcje konfiguracji DNS. Masz dwie opcje:

#### Opcja A: Root Domain (fragmentui.com)

**Jeśli Twój provider DNS wspiera ANAME/ALIAS:**
- Dodaj rekord: `ANAME` lub `ALIAS`
- Name: `@` (lub puste)
- Value: `cname.vercel-dns.com`

**Jeśli NIE wspiera ANAME/ALIAS:**
- Dodaj rekord: `A`
- Name: `@` (lub puste)
- Value: IP z Vercel (Vercel pokaże IP do użycia)

#### Opcja B: CNAME dla www (www.fragmentui.com)

- Dodaj rekord: `CNAME`
- Name: `www`
- Value: `cname.vercel-dns.com`

### 3.3 Gdzie skonfigurować DNS?

**Jeśli masz domenę na:**
- **Cloudflare**: Dashboard → DNS → Records
- **Namecheap**: Domain List → Manage → Advanced DNS
- **GoDaddy**: My Products → DNS → Records
- **Google Domains**: DNS → Custom records

### 3.4 Dodaj rekordy DNS

1. Zaloguj się do panelu swojego providera DNS
2. Znajdź sekcję "DNS Records" lub "DNS Management"
3. Dodaj rekordy zgodnie z instrukcjami Vercel:
   - Dla root domain: A record lub ANAME
   - Dla www: CNAME record
4. Zapisz zmiany

### 3.5 Zweryfikuj w Vercel

1. Wróć do Vercel → Settings → Domains
2. Kliknij **"Refresh"** obok domeny
3. Vercel sprawdzi konfigurację DNS
4. Status zmieni się na **"Valid Configuration"** (może zająć kilka minut)

**⚠️ UWAGA:** Propagacja DNS może zająć 24-48 godzin, ale zwykle działa w ciągu kilku minut do godziny.

**✅ KROK 3 ZAKOŃCZONY**

---

## KROK 4: Przetestuj deployment

### 4.1 Sprawdź czy build się powiódł

1. W Vercel Dashboard → Project → **"Deployments"**
2. Sprawdź czy ostatni deployment ma status **"Ready"** (zielony)
3. Jeśli jest błąd, kliknij na deployment i sprawdź logi

### 4.2 Sprawdź preview URL

1. Kliknij na deployment
2. Kliknij **"Visit"** (lub użyj linku `https://fragment-ui-public-xxx.vercel.app`)
3. Sprawdź czy strona się ładuje

### 4.3 Sprawdź domenę (jeśli DNS jest gotowe)

1. Otwórz: https://fragmentui.com
2. Sprawdź czy strona się ładuje
3. Sprawdź czy wszystkie linki działają

### 4.4 Sprawdź registry

1. Otwórz: https://fragmentui.com/r/button.json
2. Sprawdź czy zwraca JSON z komponentem

**✅ KROK 4 ZAKOŃCZONY**

---

## KROK 5: Zweryfikuj wszystko działa

### 5.1 Sprawdź główne strony

- [ ] https://fragmentui.com - strona główna
- [ ] https://fragmentui.com/docs - dokumentacja
- [ ] https://fragmentui.com/components - lista komponentów
- [ ] https://fragmentui.com/r/button.json - registry

### 5.2 Sprawdź komponenty

- [ ] Komponenty się wyświetlają
- [ ] Przykłady kodu działają
- [ ] Dark mode działa
- [ ] Nawigacja działa

### 5.3 Sprawdź npm packages

- [ ] https://www.npmjs.com/package/@fragment_ui/ui
- [ ] https://www.npmjs.com/package/@fragment_ui/tokens
- [ ] https://www.npmjs.com/package/@fragment_ui/blocks
- [ ] https://www.npmjs.com/package/@fragment_ui/mcp-server

### 5.4 Sprawdź GitHub

- [ ] https://github.com/blazejrzepa/fragment-ui-public - PUBLIC ✅
- [ ] https://github.com/blazejrzepa/fragment-ui - PRIVATE ✅

**✅ KROK 5 ZAKOŃCZONY**

---

## 🎉 Gotowe!

Teraz masz:
- ✅ `fragment-ui` jako PRIVATE (gdzie pracujesz)
- ✅ `fragment-ui-public` jako PUBLIC (oficjalne repo)
- ✅ fragmentui.com działa i jest podpięte
- ✅ Automatyczny deployment przy każdym push

---

## 🔄 Co dalej?

### Automatyczny deployment

Od teraz, każdy push do `main` w `fragment-ui-public` automatycznie:
1. Triggeruje build w Vercel
2. Deployuje nową wersję
3. Aktualizuje fragmentui.com

### Workflow pracy

1. **Pracujesz w `fragment-ui`** (private)
2. **Synchronizujesz do `fragment-ui-public`** (public)
3. **Push do GitHub** → automatyczny deploy
4. **Strona aktualizuje się automatycznie**

---

## 🐛 Troubleshooting

### Build fails w Vercel

**Problem:** Build się nie powiódł

**Rozwiązanie:**
1. Sprawdź logi w Vercel Dashboard → Deployments → kliknij na failed deployment
2. Sprawdź czy wszystkie zależności są dostępne
3. Sprawdź czy `vercel.json` ma poprawny build command
4. Sprawdź czy root directory jest ustawione na `apps/www`

### DNS nie działa

**Problem:** fragmentui.com nie ładuje się

**Rozwiązanie:**
1. Sprawdź konfigurację DNS w panelu providera
2. Sprawdź propagację DNS: https://dnschecker.org
3. Sprawdź czy domena jest zweryfikowana w Vercel
4. Poczekaj na propagację DNS (może zająć do 48h)

### Strona się nie ładuje

**Problem:** Strona zwraca błąd

**Rozwiązanie:**
1. Sprawdź logi w Vercel Dashboard
2. Sprawdź czy build się powiódł
3. Sprawdź czy wszystkie assets są dostępne
4. Sprawdź czy nie ma błędów w konsoli przeglądarki

---

## 📞 Potrzebujesz pomocy?

Jeśli napotkasz problemy:
1. Sprawdź logi w Vercel Dashboard
2. Sprawdź dokumentację Vercel: https://vercel.com/docs
3. Sprawdź dokumentację Next.js: https://nextjs.org/docs

---

**Powodzenia! 🚀**

