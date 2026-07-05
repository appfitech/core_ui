# Android App Links (verify-email & reset-password)

See also **`docs/DEEPLINKS.md`** for backend URL contracts and iOS Universal Links.

## Why links open in Chrome instead of the app

Android only opens `https://appfitech.com/verify-email?...` or `https://appfitech.com/reset-password?...` in the app when **Digital Asset Links** verification succeeds. If verification fails, the OS keeps the link in the browser (Chrome).

iOS uses Universal Links (`apple-app-site-association`). **Each path must be listed in AASA** — if only `/verify-email` is present, reset-password links will open in Safari, not the app.

### Common causes (check in this order)

1. **Stale or wrong Android build** — App Links are baked into the native APK. OTA / JS-only updates are not enough after changing `app.json` or `plugins/`.
2. **Wrong signing certificate** — `assetlinks.json` must list the SHA-256 of the **same keystore** used to sign the APK you installed (EAS `apk` profile: fingerprint with `…18:7F:C3…`, not `…18:7E:C3…`). Compare with `adb shell pm get-app-links com.appfitech` → `Signatures:`.
3. **`www` host redirects** — `https://www.appfitech.com/.well-known/assetlinks.json` must return **200** JSON on `www`, not **301** to apex. A redirect fails verification for `www.appfitech.com` and often leaves `get-app-links` at **`1024`** for all hosts until fixed. Use apex links in emails: `https://appfitech.com/...` (no `www`).
4. **Broken `autoVerify` manifest** — `expo-dev-client` can inject `exp+fitech` into verified intent filters and break verification. This repo includes `plugins/with-android-verified-app-links.js` to strip those schemes (must be first in `app.json` → `plugins`).
5. **Re-verify is not enough on some devices (MIUI)** — After fixing `assetlinks.json`, **uninstall FITECH**, redeploy server files, reinstall the APK, then run `pm verify-app-links --re-verify`.
6. **User chose “Always open in browser”** for `appfitech.com` — reset in system Settings → Apps → FITECH → Open by default.

### `get-app-links` shows `1024`

`1024` means domain verification did not succeed (no verified state). The cert on the phone already matches live `assetlinks.json` if you fixed `7F` — then check **www redirect**, **full reinstall**, and intent filters on the installed APK.

### Server: `assetlinks.json` format

SHA-256 fingerprints **must use colon-separated hex pairs**, for example:

`1F:92:52:A8:A2:96:7E:25:7B:9F:BF:E7:D6:33:58:C5:7A:CD:43:BE:F8:18:7E:C3:FD:48:D5:B0:2A:97:31:26`

—not a continuous 64-character string without colons.

Verify live JSON:

https://digitalassetlinks.googleapis.com/v1/statements:list?source.web.site=https://appfitech.com&relation=delegate_permission/common.handle_all_urls

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
   adb shell pm verify-app-links --re-verify com.appfitech
   adb shell pm get-app-links com.appfitech
   ```

   `appfitech.com` should show `verified`.

## Server files to deploy

| Platform | File in repo                                 | Live URL                                                       |
| -------- | -------------------------------------------- | -------------------------------------------------------------- |
| iOS      | `docs/well-known/apple-app-site-association` | `https://appfitech.com/.well-known/apple-app-site-association` |
| Android  | `docs/well-known/assetlinks.json`            | `https://appfitech.com/.well-known/assetlinks.json`            |

AASA must include **`/reset-password`** and **`/reset-password/*`** (not only verify-email).

## App-side config (this repo)

- `app.json` → separate `android.intentFilters` with `autoVerify: true` per host + path
- `plugins/with-android-verified-app-links.js` → keeps only `https` in verified filters (fixes dev-client / Expo Go scheme pollution)
- `app/+native-intent.tsx` → normalizes `fitech://reset-password` and alternate query param names
- Custom scheme fallback: `fitech://verify-email?token=...` / `fitech://reset-password?token=...` (works without App Links)

After changing `app.json` or plugins, create a **new EAS Android build** and reinstall; hot reload is not enough.

### Test on a physical device (after new build)

```bash
# Custom scheme — should open the app even if App Links fail
adb shell am start -a android.intent.action.VIEW -d "fitech://reset-password?token=TEST"

# HTTPS — only works when App Links are verified
adb shell am start -a android.intent.action.VIEW -d "https://appfitech.com/verify-email?token=TEST"

adb shell pm verify-app-links --re-verify com.appfitech
adb shell pm get-app-links com.appfitech
```

`appfitech.com` should show **verified** for the build you installed. If status is `none` or `legacy_failure`, add that APK’s SHA-256 to `assetlinks.json` (see `eas credentials -p android`).

## Email links

```
https://appfitech.com/verify-email?token=...
https://appfitech.com/reset-password?token=...
```

See `constants/linking.ts` (`buildVerifyEmailUrl`, `buildResetPasswordUrl`).
