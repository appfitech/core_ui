# Android App Links (verify-email & reset-password)

## Why links open in Chrome instead of the app

Android only opens `https://appfitech.com/verify-email?...` or `https://appfitech.com/reset-password?...` in the app when **Digital Asset Links** verification succeeds. If verification fails, the OS keeps the link in the browser (Chrome Custom Tab).

iOS uses Universal Links (`apple-app-site-association`) and can work even when Android setup is broken.

## Current server issue (confirmed)

Google’s verifier reports the live file is **invalid**:

```text
malformed cert fingerprint: 1f9252a8a2967e257b9fbfe7d63358c57acd43bef8187fc3fd48d5b02a973126
```

SHA-256 fingerprints in `assetlinks.json` **must use colon-separated hex pairs**, for example:

`1F:92:52:A8:A2:96:7E:25:7B:9F:BF:E7:D6:33:58:C5:7A:CD:43:BE:F8:18:7E:C3:FD:48:D5:B0:2A:97:31:26`

—not a continuous 64-character string without colons.

## Fix on the server

1. Deploy `docs/well-known/assetlinks.json` from this repo to:

   `https://appfitech.com/.well-known/assetlinks.json`

   (Content-Type: `application/json`, no redirects.)

2. Add **every** signing certificate you ship with (EAS production, internal APK, Play App Signing if different):

   ```bash
   eas credentials -p android
   ```

   Or from your keystore:

   ```bash
   keytool -list -v -keystore your.keystore -alias your-alias | grep SHA256
   ```

3. Re-verify:

   https://digitalassetlinks.googleapis.com/v1/statements:list?source.web.site=https://appfitech.com&relation=delegate_permission/common.handle_all_urls

   Should return statements with no `ERROR_CODE_MALFORMED_CONTENT`.

4. On a device with the app installed:

   ```bash
   adb shell pm verify-app-links --re-verify com.fitech
   adb shell pm get-app-links com.fitech
   ```

   `appfitech.com` should show `verified`.

## App-side config (this repo)

- `app.json` → `android.intentFilters` with `autoVerify: true` for `https://appfitech.com/verify-email`
- Custom scheme fallback: `fitech://verify-email?token=...` (works without server verification; email/backend must use it if needed)

After changing `app.json`, create a **new native build** (EAS); hot reload is not enough.

## Email links

Preferred (after server fix):

`https://appfitech.com/verify-email?token=...`

Fallback (always opens app if installed):

`fitech://verify-email?token=...`

See `buildVerifyEmailAppUrl()` in `constants/linking.ts`.
