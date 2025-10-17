import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import React, { useEffect, useRef } from 'react';
import { AppState, AppStateStatus, Platform } from 'react-native';

import { useUserStore } from '@/stores/user';
import { registerForPushNotificationsAsync } from '@/utils/register-for-push-notification';

import { useSavePushToken } from '../api/mutations/user/use-save-push-token';

const PUSH_TOKEN_KEY = '@push_token_v1'; // Expo push token (device)
const SENT_KEY = (id: string) => `@push_token_sent_v1:${id}`; // per-user/session marker

export function withPushNotifications<P>(Wrapped: React.ComponentType<P>) {
  const WithPush: React.FC<P> = (props) => {
    const authToken = useUserStore((s) => s.getToken());
    const userId = useUserStore((s) => s.getUserId());
    const isLoggedIn = !!authToken;

    const markerId = (userId ?? authToken ?? 'unknown') as string;

    const { mutateAsync: savePushToken } = useSavePushToken();

    const prevLoggedInRef = useRef<boolean | null>(null);
    const prevMarkerIdRef = useRef<string | null>(null);
    const expoPushTokenRef = useRef<string | null>(null);

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
      }
    };

    const syncExpoTokenToApiIfNeeded = async () => {
      if (!isLoggedIn || !markerId) {
        return;
      }

      let expoToken = expoPushTokenRef.current;

      if (!expoToken) {
        expoToken = await AsyncStorage.getItem(PUSH_TOKEN_KEY);
      }

      if (!expoToken) {
        return;
      }

      const sentKey = SENT_KEY(markerId);
      const lastSent = await AsyncStorage.getItem(sentKey);

      if (lastSent === expoToken) {
        return;
      }

      try {
        await savePushToken({ expoToken });
        await AsyncStorage.setItem(sentKey, expoToken);
      } catch (e) {
        console.warn('[Push] failed to sync token', e);
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
        if (!cancelled) await syncExpoTokenToApiIfNeeded();
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

    // ---- Foreground/background: re-check on app becoming active ----
    useEffect(() => {
      const onAppStateChange = async (state: AppStateStatus) => {
        if (state !== 'active') {
          return;
        }

        await fetchAndCacheExpoTokenIfAvailable();
        await syncExpoTokenToApiIfNeeded();
      };

      const sub = AppState.addEventListener('change', onAppStateChange);

      return () => sub.remove();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoggedIn, markerId]);

    useEffect(() => {
      const prevLoggedIn = prevLoggedInRef.current;
      const prevMarkerId = prevMarkerIdRef.current;

      // Logout detection: was logged in, now not
      if (prevLoggedIn === true && !isLoggedIn && prevMarkerId) {
        AsyncStorage.removeItem(SENT_KEY(prevMarkerId)).catch(() => {});
        if (__DEV__)
          console.log('[Push] cleared sent marker for', prevMarkerId);
      }

      if (isLoggedIn && markerId) {
        syncExpoTokenToApiIfNeeded();
      }

      prevLoggedInRef.current = isLoggedIn;
      prevMarkerIdRef.current = markerId ?? null;
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoggedIn, markerId]);

    return <Wrapped {...(props as P)} />;
  };

  WithPush.displayName = `WithPushNotifications(${Wrapped.displayName || Wrapped.name || 'Component'})`;

  return WithPush;
}
