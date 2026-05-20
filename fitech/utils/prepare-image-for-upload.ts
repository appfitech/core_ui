import * as ImageManipulator from 'expo-image-manipulator';
import type { ImagePickerAsset } from 'expo-image-picker';
import { Platform } from 'react-native';

export type PreparedUploadImage = {
  uri: string;
  name: string;
  type: 'image/jpeg';
};

const MAX_UPLOAD_WIDTH = 1920;
const JPEG_QUALITY = 0.82;

function normalizeFileUri(uri: string): string {
  if (Platform.OS !== 'android') {
    return uri;
  }

  if (uri.startsWith('file://') || uri.startsWith('content://')) {
    return uri;
  }

  return uri.startsWith('/') ? `file://${uri}` : uri;
}

/** Resize, compress, and convert gallery picks to JPEG for multipart upload. */
export async function prepareImageForUpload(
  asset: ImagePickerAsset,
): Promise<PreparedUploadImage> {
  const actions: ImageManipulator.Action[] = [];

  if (asset.width && asset.width > MAX_UPLOAD_WIDTH) {
    actions.push({ resize: { width: MAX_UPLOAD_WIDTH } });
  }

  const result = await ImageManipulator.manipulateAsync(asset.uri, actions, {
    compress: JPEG_QUALITY,
    format: ImageManipulator.SaveFormat.JPEG,
  });

  return {
    uri: normalizeFileUri(result.uri),
    name: `photo-${Date.now()}.jpg`,
    type: 'image/jpeg',
  };
}

export function createImageUploadFormData(
  image: PreparedUploadImage,
): FormData {
  const formData = new FormData();
  formData.append('file', {
    uri: image.uri,
    name: image.name,
    type: image.type,
  } as unknown as Blob);

  return formData;
}
