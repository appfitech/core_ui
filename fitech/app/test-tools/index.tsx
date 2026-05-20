import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Linking, Platform, Text } from 'react-native';

import { Button } from '@/components/Button';
import PageContainer from '@/components/PageContainer';
import { useAlert } from '@/contexts/AlertContext';
import { useResetMatchList } from '@/lib/api/mutations/matches/use-reset-match-list';
import { useSendTestNotification } from '@/lib/api/mutations/test/use-send-test-notification';
import {
  getCachedExpoPushToken,
  getNotificationPermissionStatus,
} from '@/lib/push/register-and-sync-push-token';

export default function Register() {
  const { showAlert } = useAlert();
  const [pushTokenPreview, setPushTokenPreview] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<string>('—');
  const { mutate: sendTestNotification, isPending: isSendingTestPush } =
    useSendTestNotification();
  const { mutate: resetMatchList } = useResetMatchList();

  const refreshPushState = useCallback(async () => {
    const [token, status] = await Promise.all([
      getCachedExpoPushToken(),
      getNotificationPermissionStatus(),
    ]);
    setPushTokenPreview(token);
    setPermissionStatus(status);
  }, []);

  useFocusEffect(
    useCallback(() => {
      void refreshPushState();
    }, [refreshPushState]),
  );

  function sendTestPush() {
    void (async () => {
      const stored = await getCachedExpoPushToken();
      if (!stored?.startsWith('ExponentPushToken[')) {
        showAlert({
          title: 'Sin token de push',
          message:
            'El token se registra al iniciar sesión. Si no aparece aquí, concede notificaciones en Ajustes o instala un build Android nuevo con POST_NOTIFICATIONS.',
          buttons: [
            { text: 'Cerrar', style: 'cancel' },
            {
              text: 'Abrir ajustes',
              onPress: () => void Linking.openSettings(),
            },
          ],
        });
        return;
      }

      sendTestNotification(undefined, {
        onSuccess: async () => {
          await refreshPushState();
          showAlert({
            title: 'Push enviado',
            message:
              Platform.OS === 'android'
                ? 'Si no aparece, revisa permisos de notificaciones y FCM en EAS.'
                : 'Revisa el centro de notificaciones del dispositivo.',
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
        Permiso (solo lectura): {permissionStatus}
      </Text>
      <Text selectable style={{ fontSize: 12, opacity: 0.7 }}>
        Push token (registrado al login): {pushTokenPreview ?? '(ninguno)'}
      </Text>
      <Button
        label={isSendingTestPush ? 'Enviando…' : 'Test notification'}
        onPress={sendTestPush}
        disabled={isSendingTestPush}
      />
    </PageContainer>
  );
}
