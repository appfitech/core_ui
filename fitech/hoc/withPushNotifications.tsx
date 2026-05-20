// hoc/withPushNotifications.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import React, { createElement, useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';

import { useSavePushToken } from '@/lib/api/mutations/user/use-save-push-token';
import { useUserStore } from '@/stores/user';
import { getDeviceId } from '@/utils/device';
import { ensureDefaultAndroidNotificationChannel } from '@/utils/ensure-android-notification-channel';
import { registerForPushNotificationsAsync } from '@/utils/register-for-push-notification';

export const PUSH_TOKEN_KEY = '@push_token_v1';

export function withPushNotifications<P extends Record<string, unknown>>(
  Wrapped: React.ComponentType<P>,
) {
  const WithPush: React.FC<P> = (props) => {
    const authToken = useUserStore((s) => s.token);
    const userId = useUserStore((s) => (s.user as any)?.user?.id ?? null);

    const isLoggedIn = !!authToken;

    const { mutateAsync: savePushToken } = useSavePushToken();

    const expoPushTokenRef = useRef<string | null>(null);
    const syncInFlightRef = useRef(false);

    const cacheExpoToken = async (pushToken: string) => {
      const prev = await AsyncStorage.getItem(PUSH_TOKEN_KEY);
      if (prev !== pushToken) {
        await AsyncStorage.setItem(PUSH_TOKEN_KEY, pushToken);
      }
      expoPushTokenRef.current = pushToken;
    };

    const clearCachedExpoToken = async () => {
      expoPushTokenRef.current = null;
      await AsyncStorage.removeItem(PUSH_TOKEN_KEY).catch(() => {});
    };

    const fetchAndCacheExpoTokenIfAvailable = async () => {
      await ensureDefaultAndroidNotificationChannel();
      const pushToken = await registerForPushNotificationsAsync();

      if (pushToken) {
        await cacheExpoToken(pushToken);
      } else {
        await clearCachedExpoToken();
      }

      return pushToken ?? null;
    };

    const syncNow = async () => {
      if (!isLoggedIn) {
        return;
      }

      if (syncInFlightRef.current) {
        return;
      }

      syncInFlightRef.current = true;

      try {
        const stored = await AsyncStorage.getItem(PUSH_TOKEN_KEY);
        const expoToken = expoPushTokenRef.current ?? stored ?? null;
        const deviceId = await getDeviceId();

        if (!expoToken) {
          return;
        }

        await savePushToken({ expoToken, deviceId });
      } catch (e) {
        console.warn('[Push] savePushToken failed', e);
      } finally {
        syncInFlightRef.current = false;
      }
    };

    /** Request OS permission, obtain Expo token, cache locally, register with API. */
    const registerPushForLoggedInUser = async () => {
      await fetchAndCacheExpoTokenIfAvailable();
      await syncNow();
    };

    useEffect(() => {
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldShowBanner: true,
          shouldShowList: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
        }),
      });

      const subReceived = Notifications.addNotificationReceivedListener(
        () => {},
      );

      return () => subReceived.remove();
    }, []);

    // Login, session restore, or account switch: prompt for notifications and sync token.
    useEffect(() => {
      if (!isLoggedIn) {
        void clearCachedExpoToken();
        return;
      }

      let cancelled = false;

      void (async () => {
        await registerPushForLoggedInUser();
        if (cancelled) {
          return;
        }
      })();

      return () => {
        cancelled = true;
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoggedIn, userId]);

    useEffect(() => {
      const onAppStateChange = async (state: AppStateStatus) => {
        if (state !== 'active' || !isLoggedIn) {
          return;
        }

        await registerPushForLoggedInUser();
      };

      const sub = AppState.addEventListener('change', onAppStateChange);

      return () => sub.remove();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoggedIn, userId]);

    return createElement(Wrapped, props as P);
  };

  WithPush.displayName = `WithPushNotifications(${
    (Wrapped as any).displayName || Wrapped.name || 'Component'
  })`;

  return WithPush as React.ComponentType<P>;
}
