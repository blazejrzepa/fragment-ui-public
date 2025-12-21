# A/B Testing z PostHog - Strategiczny Plan Implementacji

**Data:** 2025-01-XX  
**Status:** 📋 Strategiczne wymaganie - do implementacji  
**Priorytet:** ⭐⭐⭐ (P0 - Strategic)

---

## 🎯 Cel Strategiczny

Umożliwić prawdziwe testy A/B dla wygenerowanych ekranów (Submissions), gdzie:

- Studio tworzy warianty UI (Submissions)
- Experiment mapuje warianty (control/test/...) → submissionId
- Strona publiczna (runtime) wybiera wariant przez PostHog feature flag
- Metryki konwersji są mierzone jako eventy w PostHog
- Da się wybrać zwycięzcę i "promote" go do DS (block)

**Done =** da się uruchomić URL eksperymentu, realni użytkownicy widzą różne warianty, a w PostHog widać wyniki eksperymentu (exposure + conversion).

---

## 📊 Wpływ na Roadmap

### Nowa Faza: Phase 3.2 - A/B Testing Infrastructure

**Czas:** 3-4 tygodnie (50-70h)  
**Priorytet:** P0 - Strategic (po Phase 1)

**Zależności:**
- Phase 1.1 ✅ (UI-DSL v2 Types) - Completed
- Phase 1.2 ✅ (DSL Generation API) - Completed
- Phase 3.1 (Submissions API) - Partially done, needs enhancement

**Zintegrowane z:**
- Phase 3: Submissions & Promotion
- Phase 2: Variants Creation (warianty mogą być generowane przez Copilot)

---

## 🗺️ Zaktualizowany Roadmap

### Faza 1: Fundament (2-3 tyg.) - ✅ 25% Complete
- ✅ 1.1 UI-DSL v2 Types & Validation
- ✅ 1.2 DSL Generation API
- [ ] 1.3 DSL Patch Operations
- [ ] 1.4 Code Generation
- [ ] 1.5 Quality Run API
- [ ] 1.6 Registry Enhancement
- [ ] 1.7 Inspector → Patch Integration
- [ ] 1.8 Lint DS in CI

### Faza 2: Złożone ekrany & Variants (2-4 tyg.)
- [ ] 2.1 Variants Creation API
- [ ] 2.2 Variants Comparison
- [ ] 2.3 Blocks v1 (dashboard, data table, pricing)
- [ ] 2.4 Datasources & Binding

### Faza 3: Submissions & Promotion + A/B Testing (3-4 tyg.) 🆕
- [ ] 3.1 Submissions API Enhancement (experimentId, variantKey)
- [ ] 3.2 A/B Testing Infrastructure (NEW)
- [ ] 3.3 Experiment Wizard UI (NEW)
- [ ] 3.4 CTA Instrumentation in Generator (NEW)
- [ ] 3.5 Promotion Flow Enhancement

### Faza 4: Landing Generator (opcjonalnie, 2-3 tyg.)
- [ ] 4.1 Research Summarize
- [ ] 4.2 Landing Templates

### Faza 5: Figma Import (2-4 tyg.)
- [ ] 5.1 Figma Import → DSL Mapping

---

## 🎯 Rekomendowany Plan Działania

### Opcja A: Kontynuować Phase 1, potem A/B Testing (Rekomendowane)
1. Dokończyć Phase 1 (1.3-1.8) - 2-3 tyg.
2. Rozpocząć Phase 3.2 (A/B Testing) - 3-4 tyg.
3. Równolegle: Phase 2 (Variants) może wspierać generowanie wariantów dla eksperymentów

**Total:** 5-7 tygodni do pełnej funkcjonalności A/B Testing

### Opcja B: Priorytet A/B Testing (Jeśli pilne)
1. Minimum Phase 1 (1.1-1.2) ✅ Done
2. Rozpocząć Phase 3.2 (A/B Testing) - 3-4 tyg.
3. Wrócić do Phase 1.3-1.8 później

**Total:** 3-4 tygodnie do podstawowej funkcjonalności A/B Testing

---

## 📋 Szczegółowy Plan Implementacji

Zobacz: `docs/copilot/ab-testing-spec.md` - pełna specyfikacja techniczna

### Checklist Wdrożeniowy (10 kroków)

1. [ ] PostHog init (client) + env vars + sanity check (2-3h)
2. [ ] Typ/model Experiment + storage + CRUD minimalny (4-6h)
3. [ ] Route `/exp/[slug]` (loader danych + delegacja do runnera) (4-6h)
4. [ ] Hook `useExperimentVariant` (bez flicker; exposure 1x) (4-6h)
5. [ ] `ExperimentRunner` (render + eventy) (6-8h)
6. [ ] Analytics context + `captureWithContext` (2-4h)
7. [ ] Generator: CTA instrumentation (minimum: CTA click) (4-6h)
8. [ ] Wizard w Studio (create experiment + public URL) (8-12h)
9. [ ] Debug overlay + forceVariant (2-4h)
10. [ ] Testy unit + E2E (4-6h)

**Total:** 40-60h (5-8 dni roboczych)

---

## 🔗 Integracja z Istniejącymi Systemami

### Submissions
- ✅ Submissions już istnieją
- Rozszerzenie: dodaj `experimentId`, `variantKey`, `artifactHash`
- Submissions stają się "currency" przepływu A/B Testing

### Copilot
- Generowanie wariantów → Submissions
- Experiment wybiera Submissions jako warianty
- Runtime renderuje Submission na podstawie PostHog flag

### Quality Dashboard
- Może być używany do monitorowania jakości wariantów przed eksperymentem
- Wyniki eksperymentu mogą być wyświetlane w dashboardzie

---

## ⚠️ Ryzyka i Mitigacje

### Ryzyko 1: Flicker (użytkownik widzi A, potem B)
**Mitigacja:** Bootstrap flags wcześnie + skeleton loader

### Ryzyko 2: Events bez exposure
**Mitigacja:** Upewnij się, że `getFeatureFlag()` wywołujesz w exposure point

### Ryzyko 3: Test accounts psują wyniki
**Mitigacja:** Test account filtering w PostHog

### Ryzyko 4: Multi-exposure (user widzi 2 warianty)
**Mitigacja:** PostHog strategia "Exclude from analysis" lub "Use first seen variant"

---

## 📈 Metryki Sukcesu

- [ ] Możliwość utworzenia eksperymentu z 2-5 wariantami
- [ ] Publiczny URL eksperymentu działa
- [ ] PostHog pokazuje exposure i conversion events
- [ ] Brak flicker w renderowaniu
- [ ] Możliwość promote zwycięzcy do Block

---

## 📚 Dokumentacja

- **Specyfikacja techniczna:** `docs/copilot/ab-testing-spec.md`
- **Implementation plan:** `docs/copilot/implementation-plan.md` - Phase 3.2
- **PostHog docs:** https://posthog.com/docs/experiments

---

**Last Updated:** 2025-01-XX

