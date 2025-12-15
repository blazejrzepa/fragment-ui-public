# npm 2FA Setup - Wymagane do publikacji

## ⚠️ Problem

npm wymaga **Two-Factor Authentication (2FA)** do publikacji pakietów publicznych.

Błąd:
```
403 Forbidden - Two-factor authentication or granular access token 
with bypass 2fa enabled is required to publish packages.
```

## 🔐 Rozwiązanie: Włącz 2FA na npm

### Krok 1: Włącz 2FA na npmjs.com

1. Przejdź do: https://www.npmjs.com/settings/blakerzepa/two-factor-auth
2. Kliknij **"Enable 2FA"**
3. Wybierz metodę:
   - **Authenticator app** (zalecane) - użyj Google Authenticator, Authy, etc.
   - **SMS** (mniej bezpieczne)
4. Zeskanuj kod QR lub wprowadź kod
5. Zapisz backup codes (ważne!)

### Krok 2: Zaloguj się ponownie

Po włączeniu 2FA, musisz się ponownie zalogować:

```bash
npm logout
npm login
```

Teraz będziesz musiał wprowadzić OTP (one-time password) z aplikacji autentykacyjnej.

### Krok 3: Publikuj ponownie

```bash
cd /Users/blazejrzepa/Dev/fragment-ui-public
./publish.sh
```

## 🔑 Alternatywa: Granular Access Token

Jeśli nie chcesz używać 2FA, możesz utworzyć **granular access token** z uprawnieniami do publikacji:

1. Przejdź do: https://www.npmjs.com/settings/blakerzepa/tokens
2. Kliknij **"Generate New Token"**
3. Wybierz **"Granular Access Token"**
4. Ustaw:
   - **Type**: Automation
   - **Expiration**: 90 days (max)
   - **Packages**: Select `@fragment_ui/*` packages
   - **Permissions**: Read and Publish
   - **Bypass 2FA**: ✅ (jeśli dostępne)
5. Skopiuj token
6. Użyj tokenu:

```bash
npm config set //registry.npmjs.org/:_authToken YOUR_TOKEN_HERE
```

LUB w `.npmrc`:
```
//registry.npmjs.org/:_authToken=YOUR_TOKEN_HERE
```

## 📝 Szybkie kroki

**Opcja A: 2FA (zalecane)**
1. Włącz 2FA na npmjs.com
2. `npm logout && npm login`
3. `./publish.sh`

**Opcja B: Token**
1. Utwórz granular access token
2. `npm config set //registry.npmjs.org/:_authToken TOKEN`
3. `./publish.sh`

## ⚠️ Ważne

- 2FA jest **wymagane** dla publikacji publicznych pakietów
- Backup codes są ważne - zapisz je bezpiecznie
- Tokeny granular mają limit 90 dni

