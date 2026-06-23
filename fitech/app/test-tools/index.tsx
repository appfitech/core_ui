import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Linking, Platform, ScrollView, Text } from 'react-native';

import { Button } from '@/components/Button';
import PageContainer from '@/components/PageContainer';
import { showInfoToast } from '@/components/Toast';
import {
  buildResetPasswordAppUrl,
  buildVerifyEmailAppUrl,
} from '@/constants/linking';
import { useAlert } from '@/contexts/AlertContext';
import { useResetMatchList } from '@/lib/api/mutations/matches/use-reset-match-list';
import {
  PREMIUM_TEST_NOTIFICATION,
  type TestNotificationOptions,
  useSendTestNotification,
} from '@/lib/api/mutations/test/use-send-test-notification';
import { useSavePushToken } from '@/lib/api/mutations/user/use-save-push-token';
import {
  collectPushDiagnostics,
  type PushDiagnostics,
} from '@/lib/push/push-diagnostics';
import {
  getCachedExpoPushToken,
  registerAndSyncPushToken,
} from '@/lib/push/register-and-sync-push-token';

export default function Register() {
  const { showAlert } = useAlert();
  const [pushTokenPreview, setPushTokenPreview] = useState<string | null>(null);
  const [diagnostics, setDiagnostics] = useState<PushDiagnostics | null>(null);
  const [isRegisteringPush, setIsRegisteringPush] = useState(false);
  const { mutateAsync: savePushToken } = useSavePushToken();
  const { mutate: sendTestNotification, isPending: isSendingTestPush } =
    useSendTestNotification();
  const { mutate: resetMatchList, isPending: isClearingMatches } =
    useResetMatchList();

  const handleClearMatches = useCallback(() => {
    resetMatchList(undefined, {
      onSuccess: () => {
        showInfoToast(
          'Matches borrados',
          'Tu historial de match se limpió correctamente.',
        );
      },
      onError: (error) => {
        showAlert({
          title: 'Error',
          message: error.message,
        });
      },
    });
  }, [resetMatchList, showAlert]);

  const refreshPushState = useCallback(async () => {
    const token = await getCachedExpoPushToken();
    setPushTokenPreview(token);
    setDiagnostics(await collectPushDiagnostics(token));
  }, []);

  useFocusEffect(
    useCallback(() => {
      void refreshPushState();
    }, [refreshPushState]),
  );

  const registerPush = useCallback(async () => {
    setIsRegisteringPush(true);
    try {
      const result = await registerAndSyncPushToken({ savePushToken });
      await refreshPushState();

      if (!result.permissionGranted) {
        showAlert({
          title: 'Permiso de notificaciones',
          message:
            result.error ??
            'No se concedió el permiso. En Android 13+ necesitas un APK con POST_NOTIFICATIONS (build EAS nuevo, no solo OTA).',
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

      if (!result.token) {
        showAlert({
          title: 'Sin token',
          message:
            result.error ??
            'Permiso OK pero no se obtuvo token. Configura FCM en EAS y genera un build Android nuevo.',
        });
        return;
      }

      if (!result.savedToServer) {
        showAlert({
          title: 'Token no guardado en servidor',
          message: result.error ?? '¿Sesión iniciada?',
        });
        return;
      }

      showAlert({
        title: 'Push registrado',
        message: `Token: ${result.token.slice(0, 28)}…`,
      });
    } finally {
      setIsRegisteringPush(false);
    }
  }, [refreshPushState, savePushToken, showAlert]);

  const sendTestPush = useCallback(
    (options?: TestNotificationOptions) => {
      void (async () => {
        const stored = await getCachedExpoPushToken();
        if (!stored?.startsWith('ExponentPushToken[')) {
          showAlert({
            title: 'Sin token de push',
            message:
              diagnostics?.issues.join('\n\n') ??
              'Pulsa “Registrar notificaciones” primero. Si en Ajustes no aparece “Notificaciones”, instala un build Android nuevo (EAS).',
            buttons: [
              { text: 'Cerrar', style: 'cancel' },
              {
                text: 'Registrar',
                onPress: () => void registerPush(),
              },
              {
                text: 'Abrir ajustes',
                onPress: () => void Linking.openSettings(),
              },
            ],
          });
          return;
        }

        sendTestNotification(options, {
          onSuccess: async () => {
            await refreshPushState();
            showAlert({
              title: 'Push enviado',
              message:
                Platform.OS === 'android'
                  ? 'Si no aparece, revisa permisos y FCM en EAS.'
                  : 'Revisa el centro de notificaciones.',
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
    },
    [
      diagnostics?.issues,
      refreshPushState,
      registerPush,
      sendTestNotification,
      showAlert,
    ],
  );

  const handleSendTestPush = useCallback(() => {
    sendTestPush();
  }, [sendTestPush]);

  const handleSendPremiumTestPush = useCallback(() => {
    sendTestPush(PREMIUM_TEST_NOTIFICATION);
  }, [sendTestPush]);

  return (
    <PageContainer title="Testing tools" style={{ padding: 16, rowGap: 16 }}>
      <Button
        label={isClearingMatches ? 'Borrando…' : 'Clear matches'}
        onPress={handleClearMatches}
        disabled={isClearingMatches}
      />

      <ScrollView style={{ maxHeight: 220 }} nestedScrollEnabled>
        <Text
          selectable
          style={{ fontSize: 12, opacity: 0.85, lineHeight: 18 }}
        >
          {diagnostics
            ? [
                `Plataforma: ${diagnostics.platform}`,
                diagnostics.androidApiLevel != null
                  ? `Android API: ${diagnostics.androidApiLevel}`
                  : null,
                diagnostics.nativeAppVersion
                  ? `App: ${diagnostics.nativeAppVersion} (${diagnostics.nativeBuildVersion ?? 'build ?'})`
                  : null,
                `Dispositivo físico: ${diagnostics.isPhysicalDevice ? 'sí' : 'no'}`,
                `Permiso: ${diagnostics.permissionStatus}`,
                `POST_NOTIFICATIONS en app.json: ${diagnostics.manifestListsPostNotifications ? 'sí' : 'no'}`,
                `EAS projectId: ${diagnostics.hasEasProjectId ? 'sí' : 'no'}`,
                diagnostics.issues.length
                  ? `\nProblemas:\n• ${diagnostics.issues.join('\n• ')}`
                  : '\nSin problemas detectados en diagnóstico.',
              ]
                .filter(Boolean)
                .join('\n')
            : 'Cargando diagnóstico…'}
        </Text>
      </ScrollView>

      <Text selectable style={{ fontSize: 12, opacity: 0.7 }}>
        Push token: {pushTokenPreview ?? '(ninguno)'}
      </Text>

      <Button
        label={isRegisteringPush ? 'Registrando…' : 'Registrar notificaciones'}
        onPress={() => void registerPush()}
        disabled={isRegisteringPush}
      />
      <Button
        label={isSendingTestPush ? 'Enviando…' : 'Test notification'}
        onPress={handleSendTestPush}
        disabled={isSendingTestPush || isRegisteringPush}
      />
      <Button
        label={isSendingTestPush ? 'Enviando…' : 'Test premium push'}
        onPress={handleSendPremiumTestPush}
        disabled={isSendingTestPush || isRegisteringPush}
      />
      <Button
        type="secondary"
        label="Deep link: verify-email"
        onPress={() => void Linking.openURL(buildVerifyEmailAppUrl('TEST'))}
      />
      <Button
        type="secondary"
        label="Deep link: reset-password"
        onPress={() => void Linking.openURL(buildResetPasswordAppUrl('TEST'))}
      />
    </PageContainer>
  );
}
