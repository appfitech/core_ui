// eslint-disable-next-line import/no-named-as-default -- expo-constants default export is the app manifest
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

import { ensureDefaultAndroidNotificationChannel } from '@/utils/ensure-android-notification-channel';

let warnedSimulatorPush = false;

export async function registerForPushNotificationsAsync(): Promise<
  string | undefined
> {
  await ensureDefaultAndroidNotificationChannel();

  if (!Device.isDevice) {
    if (__DEV__ && !warnedSimulatorPush) {
      warnedSimulatorPush = true;
      console.warn('Push notifications require a physical device.');
    }
    return;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();

  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync({
      ios: {
        allowAlert: true,
        allowBadge: true,
        allowSound: true,
      },
    });
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    if (__DEV__) {
      console.warn('[Push] Notification permission not granted:', finalStatus);
    }
    return;
  }

  const projectId =
    Constants?.expoConfig?.extra?.eas?.projectId ??
    Constants?.easConfig?.projectId;

  if (!projectId) {
    throw new Error('Missing projectId');
  }

  const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;

  return token;
}
