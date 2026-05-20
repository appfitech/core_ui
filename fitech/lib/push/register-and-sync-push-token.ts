import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

import { PUSH_TOKEN_KEY } from '@/constants/push';
import type { RegisterPushTokenRequest } from '@/types/api/types.gen';
import { getDeviceId } from '@/utils/device';
import {
  registerForPushNotificationsAsync,
  type PushRegistrationOutcome,
} from '@/utils/register-for-push-notification';

export type RegisterAndSyncPushTokenResult = PushRegistrationOutcome & {
  savedToServer: boolean;
  deviceId?: string;
};

export type SavePushTokenFn = (
  request: RegisterPushTokenRequest,
) => Promise<unknown>;

/**
 * Requests notification permission, obtains an Expo push token, caches it locally,
 * and registers it with the API when `savePushToken` is provided and the user is logged in.
 */
export async function registerAndSyncPushToken(options?: {
  savePushToken?: SavePushTokenFn;
}): Promise<RegisterAndSyncPushTokenResult> {
  const outcome = await registerForPushNotificationsAsync();

  if (outcome.token) {
    await AsyncStorage.setItem(PUSH_TOKEN_KEY, outcome.token);
  } else {
    await AsyncStorage.removeItem(PUSH_TOKEN_KEY).catch(() => {});
  }

  let savedToServer = false;
  let deviceId: string | undefined;

  if (outcome.token && options?.savePushToken) {
    try {
      deviceId = await getDeviceId();
      await options.savePushToken({
        expoToken: outcome.token,
        deviceId,
      });
      savedToServer = true;
    } catch (e) {
      const message =
        e instanceof Error ? e.message : 'Failed to register push token on server';
      console.warn('[Push] savePushToken failed', e);
      return {
        ...outcome,
        savedToServer: false,
        deviceId,
        error: outcome.error ?? message,
      };
    }
  }

  return {
    ...outcome,
    savedToServer,
    deviceId,
  };
}

/** Returns the cached Expo token without requesting permission again. */
export async function getCachedExpoPushToken(): Promise<string | null> {
  return AsyncStorage.getItem(PUSH_TOKEN_KEY);
}

export async function getNotificationPermissionStatus(): Promise<Notifications.PermissionStatus> {
  const { status } = await Notifications.getPermissionsAsync();
  return status;
}
