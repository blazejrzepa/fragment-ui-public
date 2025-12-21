# Test C3: Patch Application + Regeneration

## Test przez przeglądarkę

1. Otwórz http://localhost:3002/studio/chat
2. Wpisz w chat: "Create a simple button with text 'Click me'"
3. Poczekaj na wygenerowanie komponentu
4. Wpisz w chat: "Change the button text to 'Updated Button'"
5. Sprawdź:
   - ✅ Czy pojawia się toast "Parsing patches from your message..."
   - ✅ Czy pojawia się loading indicator "Processing patches..."
   - ✅ Czy pojawia się toast "Patches applied! X changes made"
   - ✅ Czy pojawia się PatchesBadge z liczbą patches
   - ✅ Czy kod w preview się zaktualizował
   - ✅ Czy tekst przycisku zmienił się na "Updated Button"

## Test przez API (curl)

```bash
# 1. Wygeneruj komponent
curl -X POST http://localhost:3002/api/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Create a simple button with text \"Click me\""}'

# 2. Wyślij patch command (użyj code z kroku 1)
curl -X POST http://localhost:3002/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Change the button text to \"Updated Button\"",
    "context": {
      "code": "<CODE_Z_KROKU_1>"
    }
  }'
```

## Oczekiwane wyniki

- ✅ Patches są parsowane z natural language
- ✅ Patches są aplikowane do DSL
- ✅ Kod jest regenerowany
- ✅ Preview się aktualizuje
- ✅ Revision jest tworzony
- ✅ UI pokazuje status (badge, toasts, loading)

