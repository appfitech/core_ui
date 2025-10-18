import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation } from '@tanstack/react-query';

import { PUSH_TOKEN_KEY } from '@/app/hoc/withPushNotifications';

export const useSendTestNotification = () => {
  return useMutation({
    mutationFn: async () => {
      const expoPushToken = await AsyncStorage.getItem(PUSH_TOKEN_KEY);

      await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
        },
        body: JSON.stringify({
          to: expoPushToken,
          sound: 'default',
          title: 'Testing',
          body: 'Esta es una notificacion de prueba',
          data: { navigateTo: '/gymbro' },
        }),
      });
    },
  });
};
