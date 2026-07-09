export function getFileUploadViewUrl(fileId?: number | string | null): string {
  if (fileId == null || fileId === '') return '';
  return `https://appfitech.com/v1/app/file-upload/view/${fileId}`;
}

const IMAGE_EXTENSIONS = new Set([
  'jpg',
  'jpeg',
  'png',
  'gif',
  'webp',
  'heic',
  'heif',
  'bmp',
]);

export function isImageUploadFile(file: {
  fileType?: string | null;
  fileName?: string | null;
}): boolean {
  const fileType = file.fileType?.trim().toLowerCase();
  if (fileType) {
    if (fileType.startsWith('image/')) return true;
    if (IMAGE_EXTENSIONS.has(fileType)) return true;
  }

  const fileName = file.fileName?.trim().toLowerCase();
  if (fileName) {
    const extension = fileName.split('.').pop();
    if (extension && IMAGE_EXTENSIONS.has(extension)) return true;
  }

  return false;
}
