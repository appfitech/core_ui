// eslint-disable-next-line import/no-named-as-default -- expo-constants default export is the app manifest
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { ensureDefaultAndroidNotificationChannel } from '@/utils/ensure-android-notification-channel';

let warnedSimulatorPush = false;

export type PushRegistrationOutcome = {
  token?: string;
  permissionStatus: Notifications.PermissionStatus;
  permissionGranted: boolean;
  error?: string;
};

export async function registerForPushNotificationsAsync(): Promise<PushRegistrationOutcome> {
  await ensureDefaultAndroidNotificationChannel();

  if (!Device.isDevice) {
    if (__DEV__ && !warnedSimulatorPush) {
      warnedSimulatorPush = true;
      console.warn('Push notifications require a physical device.');
    }
    return {
      permissionStatus: Notifications.PermissionStatus.UNDETERMINED,
      permissionGranted: false,
      error: 'Push notifications require a physical device.',
    };
  }

  const { status: existingStatus, canAskAgain } =
    await Notifications.getPermissionsAsync();

  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync({
      ios: {
        allowAlert: true,
        allowBadge: true,
        allowSound: true,
      },
      android: {},
    });
    finalStatus = status;
  }

  const permissionGranted = finalStatus === 'granted';

  if (!permissionGranted) {
    const needsRebuildHint =
      Platform.OS === 'android' &&
      existingStatus === 'undetermined' &&
      finalStatus === 'undetermined';

    const error = needsRebuildHint
      ? 'Notifications permission was not requested. Install a new Android build that includes POST_NOTIFICATIONS (expo-notifications native module).'
      : canAskAgain === false
        ? 'Notification permission denied. Enable notifications for FITECH in system Settings.'
        : 'Notification permission not granted.';

    if (__DEV__) {
      console.warn('[Push]', error, { existingStatus, finalStatus, canAskAgain });
    }

    return {
      permissionStatus: finalStatus,
      permissionGranted: false,
      error,
    };
  }

  const projectId =
    Constants?.expoConfig?.extra?.eas?.projectId ??
    Constants?.easConfig?.projectId;

  if (!projectId) {
    return {
      permissionStatus: finalStatus,
      permissionGranted: true,
      error: 'Missing EAS projectId in app config.',
    };
  }

  try {
    const token = (
      await Notifications.getExpoPushTokenAsync({ projectId })
    ).data;

    return {
      token,
      permissionStatus: finalStatus,
      permissionGranted: true,
    };
  } catch (e) {
    const message =
      e instanceof Error
        ? e.message
        : 'Failed to obtain Expo push token (check FCM credentials in EAS for Android).';

    console.warn('[Push] getExpoPushTokenAsync failed', e);

    return {
      permissionStatus: finalStatus,
      permissionGranted: true,
      error: message,
    };
  }
}
