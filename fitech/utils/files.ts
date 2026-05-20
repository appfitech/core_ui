export function getFileUploadViewUrl(fileId?: number | string | null): string {
  if (fileId == null || fileId === '') return '';
  return `https://appfitech.com/v1/app/file-upload/view/${fileId}`;
}
