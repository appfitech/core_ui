import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Text } from 'react-native';

import { Button } from '@/components/Button';
import PageContainer from '@/components/PageContainer';
import { useAlert } from '@/contexts/AlertContext';
import { PUSH_TOKEN_KEY } from '@/hoc/withPushNotifications';
import { useResetMatchList } from '@/lib/api/mutations/matches/use-reset-match-list';
import { useSendTestNotification } from '@/lib/api/mutations/test/use-send-test-notification';
import { registerForPushNotificationsAsync } from '@/utils/register-for-push-notification';

export default function Register() {
  const { showAlert } = useAlert();
  const [pushTokenPreview, setPushTokenPreview] = useState<string | null>(null);
  const { mutate: sendTestNotification, isPending: isSendingTestPush } =
    useSendTestNotification();
  const { mutate: resetMatchList } = useResetMatchList();

  const refreshPushTokenPreview = useCallback(async () => {
    const token = await AsyncStorage.getItem(PUSH_TOKEN_KEY);
    setPushTokenPreview(token);
  }, []);

  useFocusEffect(
    useCallback(() => {
      void refreshPushTokenPreview();
    }, [refreshPushTokenPreview]),
  );

  const registerPushToken = useCallback(async () => {
    const token = await registerForPushNotificationsAsync();
    if (token) {
      await AsyncStorage.setItem(PUSH_TOKEN_KEY, token);
    }
    await refreshPushTokenPreview();
    return token;
  }, [refreshPushTokenPreview]);

  function sendTestPush() {
    void (async () => {
      const stored = await AsyncStorage.getItem(PUSH_TOKEN_KEY);
      if (!stored?.startsWith('ExponentPushToken[')) {
        const token = await registerPushToken();
        if (!token) {
          showAlert({
            title: 'Permisos de notificaciones',
            message:
              'Activa las notificaciones para FITECH en Ajustes del teléfono y vuelve a intentar.',
          });
          return;
        }
      }
      sendTestNotification(undefined, {
        onSuccess: async () => {
          await refreshPushTokenPreview();
          showAlert({
            title: 'Push enviado',
            message:
              'Si no aparece en Android, revisa permisos de notificaciones y que el build tenga FCM configurado en EAS.',
          });
        },
        onError: (error) => {
          showAlert({
            title: 'Error al enviar push',
            message: error.message,
          });
        },
      });
    })();
  }

  return (
    <PageContainer title="Testing tools" style={{ padding: 16, rowGap: 16 }}>
      <Button label={'Clear matches'} onPress={resetMatchList} />
      <Text selectable style={{ fontSize: 12, opacity: 0.7 }}>
        Push token: {pushTokenPreview ?? '(ninguno)'}
      </Text>
      <Button
        label={isSendingTestPush ? 'Enviando…' : 'Test notification'}
        onPress={sendTestPush}
        disabled={isSendingTestPush}
      />
    </PageContainer>
  );
}
