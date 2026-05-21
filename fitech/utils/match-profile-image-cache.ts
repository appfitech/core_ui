import { Image } from 'expo-image';

const loadedUris = new Set<string>();

export function isMatchProfileImageReady(
  uri: string | undefined | null,
): boolean {
  return !!uri && loadedUris.has(uri);
}

export function markMatchProfileImageReady(uri: string): void {
  loadedUris.add(uri);
}

/** Prefetch once; mark ready so promoted cards skip reload flicker. */
export async function prefetchMatchProfileImage(
  uri: string | undefined | null,
): Promise<void> {
  if (!uri || loadedUris.has(uri)) return;

  try {
    await Image.prefetch(uri);
    loadedUris.add(uri);
  } catch {
    // onLoad on the card will mark ready
  }
}
