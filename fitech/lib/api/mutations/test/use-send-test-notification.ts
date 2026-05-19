import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation } from '@tanstack/react-query';
import { Platform } from 'react-native';

import { PUSH_TOKEN_KEY } from '@/hoc/withPushNotifications';
import {
  DEFAULT_ANDROID_NOTIFICATION_CHANNEL_ID,
  sendExpoPushMessage,
} from '@/lib/push/send-expo-push-message';

export const useSendTestNotification = () => {
  return useMutation({
    mutationFn: async () => {
      const expoPushToken = await AsyncStorage.getItem(PUSH_TOKEN_KEY);

      if (!expoPushToken?.startsWith('ExponentPushToken[')) {
        throw new Error(
          'No hay token de push guardado. Cierra y abre la app, acepta notificaciones y vuelve a intentar.',
        );
      }

      await sendExpoPushMessage({
        to: expoPushToken,
        sound: 'default',
        priority: 'high',
        title: 'Testing',
        body: 'Esta es una notificacion de prueba',
        data: { navigateTo: '/gymbro' },
        ...(Platform.OS === 'android' && {
          channelId: DEFAULT_ANDROID_NOTIFICATION_CHANNEL_ID,
        }),
      });
    },
  });
};
