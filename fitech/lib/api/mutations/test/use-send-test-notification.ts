import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation } from '@tanstack/react-query';
import { Platform } from 'react-native';

import { PUSH_TOKEN_KEY } from '@/constants/push';
import { ROUTES } from '@/constants/routes';
import {
  DEFAULT_ANDROID_NOTIFICATION_CHANNEL_ID,
  sendExpoPushMessage,
} from '@/lib/push/send-expo-push-message';

export type TestNotificationOptions = {
  title?: string;
  body?: string;
  navigateTo?: string;
};

const DEFAULT_TEST_NOTIFICATION: Required<TestNotificationOptions> = {
  title: 'Testing',
  body: 'Esta es una notificacion de prueba',
  navigateTo: ROUTES.gymbro,
};

export const PREMIUM_TEST_NOTIFICATION: Required<TestNotificationOptions> = {
  title: '¡Ya eres Premium!',
  body: 'Tu membresía está activa. Abre la app para ver GymBro y GymCrush.',
  navigateTo: ROUTES.homePremiumWelcome,
};

export const useSendTestNotification = () => {
  return useMutation({
    mutationFn: async (options?: TestNotificationOptions) => {
      const expoPushToken = await AsyncStorage.getItem(PUSH_TOKEN_KEY);

      if (!expoPushToken?.startsWith('ExponentPushToken[')) {
        throw new Error(
          'No hay token de push guardado. Cierra y abre la app, acepta notificaciones y vuelve a intentar.',
        );
      }

      const { title, body, navigateTo } = {
        ...DEFAULT_TEST_NOTIFICATION,
        ...options,
      };

      await sendExpoPushMessage({
        to: expoPushToken,
        sound: 'default',
        priority: 'high',
        title,
        body,
        data: { navigateTo },
        ...(Platform.OS === 'android' && {
          channelId: DEFAULT_ANDROID_NOTIFICATION_CHANNEL_ID,
        }),
      });
    },
  });
};
