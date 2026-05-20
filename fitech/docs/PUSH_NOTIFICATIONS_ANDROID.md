# Android push notifications (Expo)

iOS can work with only APNs credentials in EAS. **Android also needs FCM (Firebase Cloud Messaging)** configured for the same Expo project, or pushes will not arrive even when `getExpoPushTokenAsync` returns a token.

## Checklist

1. **Physical device** — push does not work on emulators.
2. **Notification permission** — Android 13+ must grant notifications when prompted. On **Android 12 and below**, you will **not** see “Notifications” under App permissions (that is normal); permission is granted by default without a dialog.
3. **Xiaomi / MIUI** — open **Settings → Apps → FITECH → Notifications** (not only “App permissions”). MIUI often hides notification toggles there.
4. **Native build includes `POST_NOTIFICATIONS`** — On **Android 13+**, **Settings → Apps → FITECH → Permissions** should list **Notifications**. If you only see Camera / Files / Microphone, reinstall an APK from a **new EAS build** after `POST_NOTIFICATIONS` was added.
5. **`google-services.json` committed** — `fitech/google-services.json` + `android.googleServicesFile` in `app.json`. **OTA cannot add this**; you need a new EAS build after committing the file.
6. **FCM V1 in EAS** — `eas credentials` → Android → FCM V1 assigned (not “None”).
7. **Firebase** — In [Google Cloud Console](https://console.cloud.google.com/), enable **Firebase Cloud Messaging API** for project `fitech-344b4`.
8. **Notification icon** — Android uses `assets/images/android-notification-icon.png` (white F on transparent). Do **not** use the full-color app icon (`icon_2.png`); Android will show a green/white blob. Regenerate with `npm run generate:android-notification-icon` after logo changes, then a new EAS build.
9. **`channelId: "default"`** — every push payload to Android must include the channel id that matches the app channel (`default`). The test mutation and server sends must set this.
10. **Token on server** — After login, `withPushNotifications` calls `POST /user/register-push-token` automatically. Confirm your user appears at `GET /user/push-tokens`. Test tools only shows the cached token and sends a test push.

## Configure FCM in EAS

1. In [Firebase Console](https://console.firebase.google.com/), create or open the project linked to `com.fitech`.
2. Add an Android app with package name `com.fitech`.
3. Download `google-services.json` and commit it at `fitech/google-services.json` (referenced via `android.googleServicesFile` in `app.json`).
4. Run:

   ```bash
   eas credentials
   ```

   Select **Android** → **production** (or your profile) → set up **Google Service Account Key** for FCM V1 (recommended) or upload the legacy FCM server key if your Expo docs still mention it.

5. Rebuild:

   ```bash
   eas build --platform android --profile <your-profile>
   ```

6. Install the new build on the device and open the app once while logged in so the token registers.

## Verify from test tools

Use **Testing tools → Test notification**. On failure, the alert shows the Expo API error (e.g. `InvalidCredentials` → FCM not set up in EAS).

## Server-side sends

When your backend calls `https://exp.host/--/api/v2/push/send`, include for Android recipients:

```json
{
  "to": "ExponentPushToken[...]",
  "title": "...",
  "body": "...",
  "priority": "high",
  "channelId": "default"
}
```
