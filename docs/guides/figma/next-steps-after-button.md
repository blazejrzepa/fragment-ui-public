# 🎯 Co dalej po naprawie Button w Figma

## ✅ Co właśnie ukończyliśmy

- Button w Figma zsynchronizowany z kodem
- Wszystkie 27 wariantów utworzone (Variant × Size × State)
- Ikony jako Instance Properties (nie Variant Properties)
- Błąd konfliktu naprawiony
- Dev Resources dodane dla Button

---

## 🚀 Następne kroki (zgodnie z roadmapą)

### Priorytet A — Figma Code Connect & Parity (TOP) ⭐

**Cel:** Dodać Dev Resources dla pozostałych komponentów i zautomatyzować synchronizację

#### Krok 1: Dodaj Dev Resources dla Card, Dialog, Select

**Czas:** 2-3 godziny

1. **Zbierz Figma Node IDs:**
   - Otwórz komponenty Card, Dialog, Select w Figma
   - Skopiuj Node IDs (z URL lub Dev Mode)

2. **Zaktualizuj skrypt:**
   ```bash
   # Edytuj scripts/generate-figma-dev-resources.ts
   # Dodaj mappings dla Card, Dialog, Select
   ```

3. **Wygeneruj Dev Resources:**
   ```bash
   pnpm figma:dev-resources
   ```

4. **Dodaj linki w Figma:**
   - Otwórz każdy komponent w Figma Dev Mode
   - Dodaj Dev Resources (kod, docs, Storybook) zgodnie z wygenerowanym przewodnikiem

#### Krok 2: Utwórz skrypt parity check

**Czas:** 3-4 godziny

1. **Utwórz skrypt:**
   ```bash
   # scripts/check-figma-parity.ts
   # Porównuje props/varianty z packages/ui z danymi z Figma API
   ```

2. **Dodaj do CI:**
   ```yaml
   # .github/workflows/ci.yml
   - name: Check Figma Parity
     run: pnpm check:figma-parity
   ```

3. **Dodaj do release checklist:**
   - Przed release sprawdź, czy Figma i kod są zsynchronizowane

#### Krok 3: Zaktualizuj dokumentację

**Czas:** 1-2 godziny

1. Zaktualizuj `docs/guides/figma-code-connect-alternatives.md`
2. Dodaj Card/Dialog/Select do DS Portal
3. Zaktualizuj README z informacją o Dev Resources

---

### Priorytet B — Telemetry & GitHub Alignment

**Cel:** Połączyć dane z GitHub PR z telemetry dashboard

**Czas:** 3-5 dni

1. Dokończ webhook GitHub → `apps/www/app/api/github/webhook`
2. Dodaj metryki PR do ROI dashboard (lead time, reuse rate)
3. Dodaj alerty (niski reuse, brak DS w PR)

---

### Priorytet C — Proposal Governance Automation

**Cel:** Zautomatyzować proces zatwierdzania nowych wariantów

**Czas:** 2-3 dni

1. DS Portal sekcja "Proposals" (lista Figma frames z tagiem `Proposal`)
2. MCP komunikaty w PR (np. "variant wymaga akceptacji DS")
3. Dokumentacja workflow + checklisty

---

## 📋 Rekomendowany plan na najbliższe dni

### Dziś/Teraz:
1. ✅ **Zweryfikuj Button w Figma** - upewnij się, że wszystko działa
2. ✅ **Zapisz zmiany** - commit i push do repo
3. ✅ **Zaktualizuj dokumentację** - dodaj notatkę o naprawie Button

### Tydzień 1 (najbliższe dni):
1. **Dodaj Dev Resources dla Card, Dialog, Select**
   - Zbierz Node IDs
   - Zaktualizuj skrypt
   - Wygeneruj i dodaj linki w Figma

2. **Utwórz skrypt parity check**
   - Napisz `scripts/check-figma-parity.ts`
   - Dodaj do CI

### Tydzień 2:
1. **Telemetry ↔ GitHub integracja**
2. **Zaktualizuj dokumentację**

---

## 🎯 Szybki start - co zrobić teraz

### Opcja 1: Kontynuuj z Figma (rekomendowane)

Jeśli masz dostęp do Figma i chcesz kontynuować:

1. **Zbierz Node IDs dla Card, Dialog, Select:**
   - Otwórz komponenty w Figma
   - Skopiuj Node IDs
   - Daj mi znać, a zaktualizuję skrypt

2. **Lub zacznij od parity check:**
   - Mogę pomóc utworzyć `scripts/check-figma-parity.ts`
   - To automatycznie sprawdzi, czy Figma i kod są zsynchronizowane

### Opcja 2: Przejdź do innych priorytetów

Jeśli chcesz zrobić przerwę od Figma:

1. **Telemetry ↔ GitHub** - dokończ integrację webhooków
2. **Proposal Governance** - zautomatyzuj proces zatwierdzania
3. **Inne zadania** z roadmapy

---

## ✅ Checklist - co mamy vs co brakuje

### Figma Integration:
- ✅ Button - gotowy (27 wariantów, Dev Resources)
- ⏳ Card - brak Dev Resources
- ⏳ Dialog - brak Dev Resources
- ⏳ Select - brak Dev Resources
- ⏳ Parity check CI - brak automatyzacji

### Telemetry:
- ✅ ROI Dashboard - działa
- ⏳ GitHub webhook - częściowo
- ⏳ PR lead time - brak
- ⏳ Reuse rate per PR - brak

### Governance:
- ✅ Governance Dashboard - działa
- ⏳ Proposal workflow - manualny
- ⏳ MCP reminders - brak

---

## 💡 Moja rekomendacja

**Zacznij od:**
1. **Zweryfikuj Button** - upewnij się, że wszystko działa w Figma
2. **Dodaj Dev Resources dla Card/Dialog/Select** - to szybkie (2-3h) i daje natychmiastową wartość
3. **Utwórz parity check** - to zapobiegnie przyszłym problemom z synchronizacją

**Potem:**
- Telemetry ↔ GitHub
- Proposal Governance
- AI Enrichment

---

## 📚 Powiązane dokumenty

- [NEXT_STEPS.md](../../roadmap/NEXT_STEPS.md) - pełny plan Q4 2025
- [CRITICAL_GAPS_ANALYSIS.md](../../roadmap/CRITICAL_GAPS_ANALYSIS.md) - analiza luk
- [Figma Code Connect Alternatives](./figma-code-connect-alternatives.md) - przewodnik Dev Resources

---

*Ostatnia aktualizacja: 2025-11-07*

