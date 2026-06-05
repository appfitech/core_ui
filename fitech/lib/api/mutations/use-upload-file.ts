import { useMutation } from '@tanstack/react-query';

import { UserFilesDtoReadable } from '@/types/api/types.gen';

import { api } from '../api';

export type PickedUploadFile = {
  uri: string;
  name: string;
  mimeType?: string | null;
};

/** BE may return `{ id }` or `{ data: { id } }` depending on endpoint wrapper. */
export function extractUploadedFileId(payload: unknown): number | undefined {
  if (!payload || typeof payload !== 'object') return undefined;

  const root = payload as Record<string, unknown>;
  if (typeof root.id === 'number') return root.id;

  const data = root.data;
  if (data && typeof data === 'object' && typeof (data as { id?: number }).id === 'number') {
    return (data as { id: number }).id;
  }

  return undefined;
}

export async function uploadFileAsset(
  file: PickedUploadFile,
): Promise<UserFilesDtoReadable> {
  const formData = new FormData();
  formData.append('file', {
    uri: file.uri,
    name: file.name,
    type: file.mimeType ?? 'application/octet-stream',
  } as unknown as Blob);

  const result = await api.post('/file-upload', formData, true);
  const id = extractUploadedFileId(result);

  return {
    ...(typeof result === 'object' && result != null ? result : {}),
    id: id ?? (result as UserFilesDtoReadable)?.id,
  } as UserFilesDtoReadable;
}

export const useUploadFile = () =>
  useMutation<UserFilesDtoReadable, Error, PickedUploadFile>({
    mutationFn: uploadFileAsset,
  });
