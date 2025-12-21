# ⚡ Quick Test - Dashboard Generation

**Cel:** Szybkie przetestowanie dashboard generation na poziomie shadcn/ui

---

## 🚀 Krok 1: Uruchom Serwery

```bash
cd /Users/blazejrzepa/Dev/fragment-ui
pnpm dev
```

Czekaj aż serwery się uruchomią (demo app na http://localhost:3002)

---

## 🧪 Krok 2: Test Generacji Dashboardu

1. **Otwórz Studio:**
   - Przejdź do: `http://localhost:3002/studio`

2. **Wygeneruj Dashboard:**
   - W Copilot wpisz: `Stwórz profesjonalny dashboard dla SaaS CRM z metrykami, tabelą klientów i wykresami`
   - Kliknij "Generate" lub Enter

3. **Sprawdź Wynik:**
   - ✅ Dashboard został wygenerowany
   - ✅ Sidebar navigation po lewej
   - ✅ Top header z logo i search bar
   - ✅ 4 KPI cards z trend indicators
   - ✅ Chart section z date range selector
   - ✅ Data table z sorting/filtering

---

## ✅ Checklist Szybki

- [ ] Dashboard renderuje się bez błędów
- [ ] Grid layout jest poprawny (bez rozjeżdżania)
- [ ] Sidebar navigation widoczna
- [ ] Top header widoczny
- [ ] KPI cards mają trend indicators (↑/↓)
- [ ] Charts mają date range selector
- [ ] Data table ma sorting (kliknięcie na header)

---

## 🐛 Jeśli są Problemy

**Problem: Grid się rozjeżdża**
- Sprawdź console w DevTools
- Sprawdź czy col-span classes są poprawne

**Problem: Charts nie renderują się**
- Sprawdź czy react-chartjs-2 jest zainstalowany
- Sprawdź console errors

**Problem: DataTable nie działa**
- Sprawdź czy DataTable component jest dostępny
- Sprawdź console errors

---

**Gotowe do testowania!** 🎉

