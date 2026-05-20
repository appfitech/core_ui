// hoc/withPushNotifications.tsx
import * as Notifications from 'expo-notifications';
import React, { createElement, useEffect, useRef } from 'react';
import {
  AppState,
  AppStateStatus,
  InteractionManager,
  Platform,
} from 'react-native';

import { PUSH_TOKEN_KEY } from '@/constants/push';
import { useSavePushToken } from '@/lib/api/mutations/user/use-save-push-token';
import { registerAndSyncPushToken } from '@/lib/push/register-and-sync-push-token';
import { useUserStore } from '@/stores/user';

export { PUSH_TOKEN_KEY };

function runAfterAppIsReady(): Promise<void> {
  return new Promise((resolve) => {
    InteractionManager.runAfterInteractions(() => {
      // After login navigation, a short delay improves the Android permission dialog.
      if (Platform.OS === 'android') {
        setTimeout(resolve, 800);
        return;
      }
      resolve();
    });
  });
}

export function withPushNotifications<P extends Record<string, unknown>>(
  Wrapped: React.ComponentType<P>,
) {
  const WithPush: React.FC<P> = (props) => {
    const authToken = useUserStore((s) => s.token);
    const userId = useUserStore((s) => (s.user as any)?.user?.id ?? null);
    const isSessionHydrated = useUserStore((s) => s.isSessionHydrated);

    const isLoggedIn = !!authToken;

    const { mutateAsync: savePushToken } = useSavePushToken();

    const syncInFlightRef = useRef(false);

    const registerPushForLoggedInUser = async () => {
      if (!isLoggedIn || syncInFlightRef.current) {
        return;
      }

      syncInFlightRef.current = true;

      try {
        const result = await registerAndSyncPushToken({
          savePushToken,
        });

        if (result.error || !result.savedToServer) {
          console.warn('[Push] register/sync', {
            permissionGranted: result.permissionGranted,
            permissionStatus: result.permissionStatus,
            hasToken: !!result.token,
            savedToServer: result.savedToServer,
            error: result.error,
          });
        }
      } catch (e) {
        console.warn('[Push] registerAndSyncPushToken failed', e);
      } finally {
        syncInFlightRef.current = false;
      }
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
      if (!isLoggedIn || !isSessionHydrated) {
        return;
      }

      let cancelled = false;

      void (async () => {
        await runAfterAppIsReady();
        if (cancelled) {
          return;
        }
        await registerPushForLoggedInUser();
      })();

      return () => {
        cancelled = true;
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoggedIn, isSessionHydrated, userId]);

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
    }, [isLoggedIn, isSessionHydrated, userId]);

    return createElement(Wrapped, props as P);
  };

  WithPush.displayName = `WithPushNotifications(${
    (Wrapped as any).displayName || Wrapped.name || 'Component'
  })`;

  return WithPush as React.ComponentType<P>;
}
