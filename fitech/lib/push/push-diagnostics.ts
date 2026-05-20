// eslint-disable-next-line import/no-named-as-default -- expo-constants default export
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export type PushDiagnostics = {
  platform: string;
  isPhysicalDevice: boolean;
  permissionStatus: Notifications.PermissionStatus;
  canAskAgain: boolean;
  hasEasProjectId: boolean;
  manifestListsPostNotifications: boolean;
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

  const issues: string[] = [];

  if (!Device.isDevice) {
    issues.push('No es un dispositivo físico (emulador).');
  }

  if (!projectId) {
    issues.push('Falta extra.eas.projectId en la configuración de Expo.');
  }

  if (Platform.OS === 'android') {
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
        'Notificaciones denegadas. Actívalas en Ajustes → Apps → FITECH → Notificaciones.',
      );
    }
  }

  if (status === Notifications.PermissionStatus.GRANTED && !cachedToken) {
    issues.push(
      'Permiso concedido pero sin token local. Inicia sesión de nuevo o pulsa “Registrar notificaciones” abajo. Revisa FCM en EAS si el token no se obtiene.',
    );
  }

  return {
    platform: Platform.OS,
    isPhysicalDevice: Device.isDevice,
    permissionStatus: status,
    canAskAgain: canAskAgain ?? true,
    hasEasProjectId: Boolean(projectId),
    manifestListsPostNotifications,
    cachedToken,
    issues,
  };
}
