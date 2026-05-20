// eslint-disable-next-line import/no-named-as-default -- expo-constants default export
import Constants from 'expo-constants';
import * as Application from 'expo-application';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { explainAndroidPushError } from '@/lib/push/push-android-errors';

export type PushDiagnostics = {
  platform: string;
  androidApiLevel: number | null;
  isPhysicalDevice: boolean;
  permissionStatus: Notifications.PermissionStatus;
  canAskAgain: boolean;
  hasEasProjectId: boolean;
  manifestListsPostNotifications: boolean;
  nativeAppVersion: string | null;
  nativeBuildVersion: string | null;
  nativeFcmError: string | null;
  cachedToken: string | null;
  issues: string[];
};

export async function collectPushDiagnostics(
  cachedToken: string | null,
): Promise<PushDiagnostics> {
  const { status, canAskAgain } = await Notifications.getPermissionsAsync();

  const permissions = Constants.expoConfig?.android?.permissions ?? [];

  const manifestListsPostNotifications = permissions.some((p) =>
    String(p).includes('POST_NOTIFICATIONS'),
  );

  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ??
    Constants?.easConfig?.projectId;

  const androidApiLevel =
    Platform.OS === 'android' && typeof Platform.Version === 'number'
      ? Platform.Version
      : null;

  const nativeAppVersion = Application.nativeApplicationVersion ?? null;
  const nativeBuildVersion = Application.nativeBuildVersion ?? null;

  let nativeFcmError: string | null = null;

  if (
    Platform.OS === 'android' &&
    Device.isDevice &&
    status === Notifications.PermissionStatus.GRANTED &&
    !cachedToken
  ) {
    try {
      await Notifications.getDevicePushTokenAsync();
    } catch (e) {
      const raw = e instanceof Error ? e.message : String(e);
      nativeFcmError = explainAndroidPushError(raw);
    }
  }

  const issues: string[] = [];

  if (!Device.isDevice) {
    issues.push('No es un dispositivo físico (emulador).');
  }

  if (!projectId) {
    issues.push('Falta extra.eas.projectId en la configuración de Expo.');
  }

  if (Platform.OS === 'android') {
    if (androidApiLevel != null && androidApiLevel < 33) {
      issues.push(
        `Android ${androidApiLevel}: no verás “Notificaciones” en Permisos de la app (normal en Android 12 o anterior). El permiso puede aparecer como concedido sin mostrar diálogo.`,
      );
    }

    if (!manifestListsPostNotifications) {
      issues.push(
        'app.json no declara POST_NOTIFICATIONS. Genera un build nativo nuevo.',
      );
    }

    if (
      status === Notifications.PermissionStatus.UNDETERMINED &&
      manifestListsPostNotifications
    ) {
      issues.push(
        'El permiso sigue sin definirse: el APK instalado probablemente no incluye POST_NOTIFICATIONS. Reinstala con un EAS build reciente (no solo OTA).',
      );
    }

    if (status === Notifications.PermissionStatus.DENIED && canAskAgain === false) {
      issues.push(
        'Notificaciones denegadas. En Android 13+: Ajustes → Apps → FITECH → Notificaciones. En Xiaomi/MIUI puede estar fuera de “Permisos de la app”.',
      );
    }

    if (nativeFcmError) {
      issues.push(nativeFcmError);
    } else if (
      status === Notifications.PermissionStatus.GRANTED &&
      !cachedToken
    ) {
      issues.push(
        'Permiso concedido pero sin token. Pulsa “Registrar notificaciones”. Si falla, necesitas un EAS build con google-services.json + FCM V1 en EAS.',
      );
    }
  }

  if (
    Platform.OS === 'ios' &&
    status === Notifications.PermissionStatus.GRANTED &&
    !cachedToken
  ) {
    issues.push(
      'Permiso concedido pero sin token local. Revisa credenciales APNs en EAS.',
    );
  }

  return {
    platform: Platform.OS,
    androidApiLevel,
    isPhysicalDevice: Device.isDevice,
    permissionStatus: status,
    canAskAgain: canAskAgain ?? true,
    hasEasProjectId: Boolean(projectId),
    manifestListsPostNotifications,
    nativeAppVersion,
    nativeBuildVersion,
    nativeFcmError,
    cachedToken,
    issues,
  };
}
