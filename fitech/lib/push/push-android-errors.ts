/** User-facing hints for common Android push / FCM failures. */
export function explainAndroidPushError(raw: string): string {
  const message = raw.trim();

  if (message.includes('SERVICE_NOT_AVAILABLE')) {
    return [
      'Google Play Services no pudo obtener el token FCM (SERVICE_NOT_AVAILABLE).',
      '',
      'Causas habituales:',
      '• APK compilado sin google-services.json (necesitas un EAS build nuevo después de añadirlo al repo).',
      '• FCM V1 no subido en `eas credentials` para este proyecto.',
      '• Google Play Services desactualizado o sin conexión a servidores de Google.',
      '• En Xiaomi: Ajustes → Apps → FITECH → Notificaciones (no está en “Permisos de la app”).',
      '',
      'En Firebase Console, activa “Cloud Messaging API” para el proyecto.',
    ].join('\n');
  }

  if (
    message.includes('Default FirebaseApp is not initialized') ||
    message.includes('FirebaseApp')
  ) {
    return [
      'Firebase no está inicializado en el APK.',
      'Genera un build Android nuevo con google-services.json en app.json y reinstala.',
    ].join('\n');
  }

  if (
    message.includes('InvalidCredentials') ||
    message.includes('Unable to retrieve the FCM server key')
  ) {
    return 'Credenciales FCM inválidas en EAS. Sube la clave FCM V1 en `eas credentials` y vuelve a compilar.';
  }

  return message;
}
