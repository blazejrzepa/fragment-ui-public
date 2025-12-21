# Plan Uporządkowania Dokumentacji i Refaktoringu

**Data:** 2025-01-XX  
**Status:** Propozycja  
**Priorytet:** Średni (można zrobić teraz przed Phase 1.2)

---

## 🎯 Cel

Uporządkować dokumentację i kod przed rozpoczęciem Phase 1.2-1.8 Copilota, które dodadzą dużo nowego kodu.

---

## 📋 Zadania

### 1. Aktualizacja Dokumentacji Copilota (1-2h)

#### 1.1 Zaktualizować Implementation Plan
- [ ] Oznaczyć Phase 1.1 jako ✅ Completed
- [ ] Zaktualizować status w `docs/copilot/README.md`
- [ ] Dodać notatki o tym co zostało zrobione

**Pliki:**
- `docs/copilot/implementation-plan.md`
- `docs/copilot/README.md`

---

### 2. Uporządkowanie Dokumentacji Roadmap (1h)

#### 2.1 Zarchiwizować stare plany wersji
- [ ] Przenieść stare pliki `v*.md` z `docs/roadmap/` do `docs/archive/roadmap/`
- [ ] Zostawić tylko aktualne: `NEXT_STEPS.md`, `project-status.md`, `README.md`
- [ ] Zaktualizować `docs/roadmap/README.md` z aktualną strukturą

**Pliki do archiwizacji:**
- `docs/roadmap/v0-complete.md`
- `docs/roadmap/v1.1.0-complete.md`
- `docs/roadmap/v1.2.0-complete.md`
- `docs/roadmap/v1.6.0-next-steps.md`
- `docs/roadmap/v1.7.0-next-steps.md`
- `docs/roadmap/v1.8.0-*.md` (wszystkie)

---

### 3. Dokumentacja UI-DSL v1 vs v2 (1-2h)

#### 3.1 Stworzyć dokument wyjaśniający różnice
- [ ] Utworzyć `docs/technical/ui-dsl-migration.md`
- [ ] Opisać różnice między v1 i v2
- [ ] Wyjaśnić kiedy używać którego
- [ ] Dodać plan migracji (jeśli potrzebny)

**Pytania do odpowiedzi:**
- Czy v1 jest deprecated?
- Czy v1 i v2 współistnieją?
- Kiedy migrować z v1 do v2?

---

### 4. Aktualizacja Status Dokumentów (30min)

#### 4.1 Zaktualizować główne dokumenty statusu
- [ ] `STATUS_AND_NEXT_STEPS.md` - dodać Phase 1.1 completed
- [ ] `NEXT_ACTION_PLAN.md` - zaktualizować status
- [ ] `REMAINING_TASKS_SUMMARY.md` - oznaczyć Phase 1.1 jako done

---

### 5. Refaktoring Kodu (Opcjonalnie, 2-4h)

#### 5.1 Sprawdzić duplikacje między v1 i v2
- [ ] Przeanalizować czy są duplikacje logiki
- [ ] Zidentyfikować możliwości refaktoringu
- [ ] Zdecydować czy warto refaktorować teraz czy później

**Uwaga:** To może być większe zadanie - lepiej zrobić po Phase 1, gdy będziemy wiedzieć jak v2 będzie używane.

---

## 📊 Estymacja

| Zadanie | Czas | Priorytet |
|---------|------|-----------|
| 1. Aktualizacja Copilot docs | 1-2h | Wysoki |
| 2. Uporządkowanie roadmap | 1h | Średni |
| 3. Dokumentacja v1 vs v2 | 1-2h | Wysoki |
| 4. Aktualizacja status | 30min | Wysoki |
| 5. Refaktoring (opcjonalnie) | 2-4h | Niski |

**Total:** 3.5-5.5h (bez refaktoringu) lub 5.5-9.5h (z refaktoringiem)

---

## 🎯 Rekomendacja

### Opcja A: Minimum (3.5h)
Zrobić zadania 1, 3, 4 - najważniejsze aktualizacje dokumentacji.

### Opcja B: Pełne (5.5h)
Zrobić zadania 1-4 - kompletne uporządkowanie dokumentacji.

### Opcja C: Z refaktoringiem (9.5h)
Zrobić wszystko + refaktoring - tylko jeśli jest czas i potrzeba.

---

## ✅ Decyzja

**Rekomendacja:** Opcja B (5.5h)
- Warto uporządkować dokumentację przed Phase 1.2
- Refaktoring lepiej zrobić po Phase 1, gdy będziemy wiedzieć jak v2 będzie używane
- To da nam czysty start do dalszej pracy

---

## 📝 Notatki

- Dokumentacja v1 vs v2 jest ważna - pomoże zrozumieć architekturę
- Aktualizacja status w Copilot docs jest kluczowa - pokazuje postęp
- Uporządkowanie roadmap zmniejszy chaos w dokumentacji

