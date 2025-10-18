// hoc/withPushNotifications.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import React, { createElement, useEffect, useRef } from 'react';
import { AppState, AppStateStatus, Platform } from 'react-native';

import { useUserStore } from '@/stores/user';
import { getDeviceId } from '@/utils/device';
import { registerForPushNotificationsAsync } from '@/utils/register-for-push-notification';

import { useSavePushToken } from '../api/mutations/user/use-save-push-token';

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

    const ensureAndroidChannel = async () => {
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
        });
      }
    };

    const cacheExpoToken = async (pushToken: string) => {
      const prev = await AsyncStorage.getItem(PUSH_TOKEN_KEY);
      if (prev !== pushToken) {
        await AsyncStorage.setItem(PUSH_TOKEN_KEY, pushToken);
      }
      expoPushTokenRef.current = pushToken;
    };

    const fetchAndCacheExpoTokenIfAvailable = async () => {
      await ensureAndroidChannel();
      const pushToken = await registerForPushNotificationsAsync();

      if (pushToken) {
        await cacheExpoToken(pushToken);
      } else {
        expoPushTokenRef.current = null;

        await AsyncStorage.removeItem(PUSH_TOKEN_KEY).catch(() => {});
      }
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

    useEffect(() => {
      let cancelled = false;

      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
        }),
      });

      (async () => {
        await fetchAndCacheExpoTokenIfAvailable();

        if (!cancelled) {
          await syncNow();
        }
      })();

      const subReceived = Notifications.addNotificationReceivedListener(
        () => {},
      );
      const subResponse = Notifications.addNotificationResponseReceivedListener(
        () => {},
      );

      return () => {
        cancelled = true;
        subReceived.remove();
        subResponse.remove();
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
      const onAppStateChange = async (state: AppStateStatus) => {
        if (state !== 'active') {
          return;
        }

        await fetchAndCacheExpoTokenIfAvailable();
        await syncNow();
      };

      const sub = AppState.addEventListener('change', onAppStateChange);

      return () => sub.remove();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoggedIn, userId]);

    // Auth transitions (login / user switch): sync
    useEffect(() => {
      if (isLoggedIn) {
        void syncNow();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoggedIn, userId]);

    return createElement(Wrapped, props as P);
  };

  WithPush.displayName = `WithPushNotifications(${
    (Wrapped as any).displayName || Wrapped.name || 'Component'
  })`;

  return WithPush as React.ComponentType<P>;
}
