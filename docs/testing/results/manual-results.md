# Wyniki Testów Ręcznych Decision Patterns

## Test 1: Compare-3 Pattern

**Prompt:**
```
Create a pricing page with 3 plans: Starter ($9/month), Pro ($29/month), Enterprise ($99/month). Include comparison matrix.
```

**Oczekiwane rezultaty:**
- [ ] Kod zawiera `import { Compare3 } from "@fragment_ui/blocks/decision"`
- [ ] Preview renderuje komponent z `data-section-role="decision-compare-3"`
- [ ] Są 3 opcje z `data-option-id`
- [ ] Jest tabela porównawcza z `data-compare-key`
- [ ] Każda opcja ma przycisk CTA z `data-action-id`

**Wyniki:**
- Data: ___________
- Status: ⏳ Oczekuje na test

---

## Test 2: Recommendation Pattern

**Prompt:**
```
Create a recommendation page with 3 ranked options: Pro Plan (rank 1, 95% match), Enterprise (rank 2, 85% match), Starter (rank 3, 70% match). Include reasoning for each.
```

**Oczekiwane rezultaty:**
- [ ] Kod zawiera `import { Recommendation } from "@fragment_ui/blocks/decision"`
- [ ] Preview renderuje komponent z `data-section-role="decision-recommendation"`
- [ ] Opcje są posortowane według rankingu
- [ ] Każda opcja ma `data-rank` attribute
- [ ] Opcja z rankiem 1 ma badge "Recommended"

**Wyniki:**
- Data: ___________
- Status: ⏳ Oczekuje na test

---

## Test 3: Tradeoffs Pattern

**Prompt:**
```
Create a tradeoffs comparison page with 3 options showing cost, risk, and time dimensions.
```

**Oczekiwane rezultaty:**
- [ ] Kod zawiera `import { Tradeoffs } from "@fragment_ui/blocks/decision"`
- [ ] Preview renderuje komponent z `data-section-role="decision-tradeoffs"`
- [ ] Każda opcja ma wymiary z `data-dimension` attribute
- [ ] Wymiary są wyświetlane jako progress bars

**Wyniki:**
- Data: ___________
- Status: ⏳ Oczekuje na test

---

## Test 4: Review-Confirm Pattern

**Prompt:**
```
Create a review and confirm page for order checkout. Show plan: Pro Plan, price: $29/month, billing: Monthly, payment method: Credit Card ending in 1234. Include confirm and cancel buttons.
```

**Oczekiwane rezultaty:**
- [ ] Kod zawiera `import { ReviewConfirm } from "@fragment_ui/blocks/decision"`
- [ ] Preview renderuje komponent z `data-section-role="decision-review-confirm"`
- [ ] Przycisk potwierdzenia ma `data-action-kind="hard"`
- [ ] Przycisk potwierdzenia ma `data-action-requires-confirmation="true"`
- [ ] Są wyświetlone wszystkie itemy do przeglądu

**Wyniki:**
- Data: ___________
- Status: ⏳ Oczekuje na test

---

## Notatki

- Użyj DevTools do sprawdzenia ACL atrybutów
- Sprawdź konsolę przeglądarki pod kątem błędów
- Sprawdź Network tab, aby zobaczyć odpowiedzi API

