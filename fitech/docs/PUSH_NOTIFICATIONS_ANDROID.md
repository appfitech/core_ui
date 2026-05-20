# Android push notifications (Expo)

iOS can work with only APNs credentials in EAS. **Android also needs FCM (Firebase Cloud Messaging)** configured for the same Expo project, or pushes will not arrive even when `getExpoPushTokenAsync` returns a token.

## Checklist

1. **Physical device** — push does not work on emulators.
2. **Notification permission** — Android 13+ must grant notifications when prompted.
3. **Native build includes `POST_NOTIFICATIONS`** — In **Settings → Apps → FITECH → Permissions**, you should see **Notifications**. If you only see Camera / Files / Microphone and no Notifications entry, the installed APK was built without the `expo-notifications` manifest merge. **Create a new EAS Android build** and reinstall; JS-only updates cannot add this permission.
4. **`channelId: "default"`** — every push payload to Android must include the channel id that matches the app channel (`default`). The test mutation and server sends must set this.
5. **FCM in EAS** — configure credentials, then create a **new Android build** (OTA/JS reload is not enough).
6. **Token on server** — After login, `withPushNotifications` calls `POST /user/register-push-token` automatically. Confirm your user appears at `GET /user/push-tokens`. Test tools only shows the cached token and sends a test push.

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
