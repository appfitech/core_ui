# Android push notifications (Expo)

iOS can work with only APNs credentials in EAS. **Android also needs FCM (Firebase Cloud Messaging)** configured for the same Expo project, or pushes will not arrive even when `getExpoPushTokenAsync` returns a token.

## Checklist

1. **Physical device** — push does not work on emulators.
2. **Notification permission** — Android 13+ must grant notifications when prompted.
3. **`channelId: "default"`** — every push payload to Android must include the channel id that matches the app channel (`default`). The test mutation and server sends must set this.
4. **FCM in EAS** — configure credentials, then create a **new Android build** (OTA/JS reload is not enough).

## Configure FCM in EAS

1. In [Firebase Console](https://console.firebase.google.com/), create or open the project linked to `com.fitech`.
2. Add an Android app with package name `com.fitech`.
3. Download `google-services.json` (optional in repo if you use EAS credentials UI only).
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
