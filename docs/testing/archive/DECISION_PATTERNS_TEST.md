# Testy Decision Patterns

## 📋 E2E Testy

E2E testy znajdują się w `apps/demo/e2e/decision-patterns.spec.ts` i sprawdzają:

1. **compare-3 pattern** - generowanie strony z porównaniem 3 opcji
2. **recommendation pattern** - generowanie strony z rankingiem opcji
3. **tradeoffs pattern** - generowanie strony z porównaniem wymiarów
4. **review-confirm pattern** - generowanie strony z podsumowaniem i potwierdzeniem
5. **ACL attributes** - sprawdzanie obecności atrybutów ACL

## 🧪 Testy Ręczne

### 1. Compare-3 Pattern

**Prompt:**
```
Create a pricing page with 3 plans: Starter ($9/month), Pro ($29/month), and Enterprise ($99/month). Include comparison matrix.
```

**Oczekiwane rezultaty:**
- ✅ Kod zawiera `import { Compare3 } from "@fragment_ui/blocks/decision"`
- ✅ Preview renderuje komponent z `data-section-role="decision-compare-3"`
- ✅ Są 3 opcje z `data-option-id`
- ✅ Jest tabela porównawcza z `data-compare-key`
- ✅ Każda opcja ma przycisk CTA z `data-action-id`

### 2. Recommendation Pattern

**Prompt:**
```
Create a recommendation page with 3 ranked options: Pro Plan (rank 1, 95% match), Enterprise (rank 2, 85% match), Starter (rank 3, 70% match). Include reasoning for each.
```

**Oczekiwane rezultaty:**
- ✅ Kod zawiera `import { Recommendation } from "@fragment_ui/blocks/decision"`
- ✅ Preview renderuje komponent z `data-section-role="decision-recommendation"`
- ✅ Opcje są posortowane według rankingu
- ✅ Każda opcja ma `data-rank` attribute
- ✅ Opcja z rankiem 1 ma badge "Recommended"

### 3. Tradeoffs Pattern

**Prompt:**
```
Create a tradeoffs comparison page with 3 options showing cost, risk, and time dimensions. Option 1: High cost (80%), Low risk (30%), Fast (20%). Option 2: Medium cost (50%), Medium risk (50%), Medium time (50%). Option 3: Low cost (20%), High risk (60%), Slow (80%).
```

**Oczekiwane rezultaty:**
- ✅ Kod zawiera `import { Tradeoffs } from "@fragment_ui/blocks/decision"`
- ✅ Preview renderuje komponent z `data-section-role="decision-tradeoffs"`
- ✅ Każda opcja ma wymiary z `data-dimension` attribute
- ✅ Wymiary są wyświetlane jako progress bars

### 4. Review-Confirm Pattern

**Prompt:**
```
Create a review and confirm page for order checkout. Show plan: Pro Plan, price: $29/month, billing: Monthly, payment method: Credit Card ending in 1234. Include confirm and cancel buttons.
```

**Oczekiwane rezultaty:**
- ✅ Kod zawiera `import { ReviewConfirm } from "@fragment_ui/blocks/decision"`
- ✅ Preview renderuje komponent z `data-section-role="decision-review-confirm"`
- ✅ Przycisk potwierdzenia ma `data-action-kind="hard"`
- ✅ Przycisk potwierdzenia ma `data-action-requires-confirmation="true"`
- ✅ Są wyświetlone wszystkie itemy do przeglądu

## 🔍 Sprawdzanie ACL Atrybutów

Wszystkie decision patterns powinny mieć:

- ✅ `data-section-role="decision-{pattern}"` na głównym kontenerze
- ✅ `data-option-id` na każdej opcji (dla compare-3, recommendation, tradeoffs)
- ✅ `data-compare-key` na elementach porównawczych (dla compare-3)
- ✅ `data-rank` na opcjach (dla recommendation)
- ✅ `data-dimension` na wymiarach (dla tradeoffs)
- ✅ `data-action-id` na przyciskach CTA
- ✅ `data-action-kind` na przyciskach (soft/hard)
- ✅ `data-action-requires-confirmation="true"` dla hard actions (review-confirm)

## 🚀 Uruchamianie Testów

### E2E Testy

```bash
cd apps/demo
pnpm test:e2e decision-patterns.spec.ts
```

### Testy Ręczne

1. Uruchom serwer deweloperski:
   ```bash
   cd apps/demo
   pnpm dev
   ```

2. Otwórz http://localhost:3002/playground

3. Wpisz jeden z promptów powyżej

4. Sprawdź:
   - Czy kod został wygenerowany poprawnie
   - Czy preview renderuje komponent
   - Czy ACL atrybuty są obecne (użyj DevTools)

## 📝 Notatki

- Parser rozpoznaje decision patterns na podstawie słów kluczowych w prompcie
- Jeśli parser nie rozpozna pattern, używa domyślnych wartości
- Generator używa bloków z `@fragment_ui/blocks/decision`
- Wszystkie decision patterns mają ACL atrybuty dla agentów

