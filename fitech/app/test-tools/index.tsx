import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useCallback, useEffect, useState } from 'react';
import { Text } from 'react-native';

import { Button } from '@/components/Button';
import PageContainer from '@/components/PageContainer';
import { useAlert } from '@/contexts/AlertContext';
import { PUSH_TOKEN_KEY } from '@/hoc/withPushNotifications';
import { useResetMatchList } from '@/lib/api/mutations/matches/use-reset-match-list';
import { useSendTestNotification } from '@/lib/api/mutations/test/use-send-test-notification';

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

  useEffect(() => {
    void refreshPushTokenPreview();
  }, [refreshPushTokenPreview]);

  function sendTestPush() {
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
