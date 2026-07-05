# Deep links (verify-email & reset-password)

## Email URLs (send to backend)

Use **one HTTPS link** per flow. Same pattern for both:

| Flow           | URL                                                  |
| -------------- | ---------------------------------------------------- |
| Verify email   | `https://appfitech.com/verify-email?token={token}`   |
| Reset password | `https://appfitech.com/reset-password?token={token}` |

Query param must be **`token`** (URL-encoded if needed). Do not use `resetToken` in emails — the app normalizes it if present, but BE should standardize on `token`.

Dev / fallback (opens app without Universal Links):

- `fitech://verify-email?token={token}`
- `fitech://reset-password?token={token}`

## Why reset-password failed on iOS but verify-email worked

The live file at `https://appfitech.com/.well-known/apple-app-site-association` only listed **`/verify-email`**. iOS will not open the app for `/reset-password` until that path is added.

**Fix:** Deploy `docs/well-known/apple-app-site-association` from this repo to:

- `https://appfitech.com/.well-known/apple-app-site-association`
- (optional) `https://appfitech.com/apple-app-site-association`

After deploy, reinstall the app or wait for iOS to refresh AASA (can take hours; delete and reinstall is fastest for testing).

## Android

Deploy `docs/well-known/assetlinks.json` to `https://appfitech.com/.well-known/assetlinks.json` with **colon-separated** SHA-256 fingerprints for **every** APK signing key you ship (EAS production, internal preview, Play App Signing if different).

`app.json` declares App Links; `plugins/with-android-verified-app-links.js` fixes dev-client breaking `autoVerify`. You need a **new EAS Android build** after any native config change.

If HTTPS links still open Chrome, test `fitech://reset-password?token=TEST` — that confirms routing works and the issue is App Link verification only.

Full troubleshooting: **`docs/ANDROID_APP_LINKS.md`**.

Verify on device:

```bash
adb shell pm verify-app-links --re-verify com.appfitech
adb shell pm get-app-links com.appfitech
```

## Test on device

```bash
# Custom scheme (no server files required)
npx uri-scheme open "fitech://verify-email?token=TEST" --ios
npx uri-scheme open "fitech://reset-password?token=TEST" --ios
npx uri-scheme open "fitech://reset-password?token=TEST" --android

# Universal / App Links (requires AASA + assetlinks + installed build)
npx uri-scheme open "https://appfitech.com/verify-email?token=TEST" --ios
npx uri-scheme open "https://appfitech.com/reset-password?token=TEST" --ios
```

## App routes

| URL path          | Screen                         |
| ----------------- | ------------------------------ |
| `/verify-email`   | `app/verify-email/index.tsx`   |
| `/reset-password` | `app/reset-password/index.tsx` |

Both are public routes in `app/_layout.tsx` (no login required).
