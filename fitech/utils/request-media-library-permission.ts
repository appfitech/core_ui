import * as ImagePicker from 'expo-image-picker';

export type MediaLibraryPermissionResult =
  | { granted: true }
  | { granted: false; message: string };

/** Request read access to the photo library (required on Android 13+). */
export async function requestMediaLibraryPermission(): Promise<MediaLibraryPermissionResult> {
  const current = await ImagePicker.getMediaLibraryPermissionsAsync();

  if (current.granted) {
    return { granted: true };
  }

  const requested = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (requested.granted) {
    return { granted: true };
  }

  return {
    granted: false,
    message:
      'Necesitamos permiso para acceder a tus fotos. Actívalo en Ajustes del dispositivo.',
  };
}
