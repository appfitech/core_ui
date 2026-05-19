import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { DEFAULT_ANDROID_NOTIFICATION_CHANNEL_ID } from '@/lib/push/send-expo-push-message';

export async function ensureDefaultAndroidNotificationChannel(): Promise<void> {
  if (Platform.OS !== 'android') {
    return;
  }

  await Notifications.setNotificationChannelAsync(
    DEFAULT_ANDROID_NOTIFICATION_CHANNEL_ID,
    {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#39CC39',
      sound: 'default',
      enableVibrate: true,
      showBadge: true,
    },
  );
}
