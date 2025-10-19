// utils/device.ts (safe version)
import * as Application from 'expo-application';
import * as Random from 'expo-random';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const KEY = '@installation_id_v1';

const toHex = (bytes: Uint8Array) =>
  Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

export async function getDeviceId(): Promise<string> {
  try {
    const cached = await SecureStore.getItemAsync(KEY);
    if (cached) return cached;
  } catch {
    // ignore read error; we'll compute an id below
  }

  let id: string | null = null;

  // Try platform IDs (never require tracking permission)
  try {
    if (Platform.OS === 'ios') {
      id = await Application.getIosIdForVendorAsync(); // can be null
    } else if (Platform.OS === 'android') {
      const getAndroidIdAsync = (Application as any).getAndroidIdAsync;
      id =
        typeof getAndroidIdAsync === 'function'
          ? await getAndroidIdAsync()
          : ((Application as any).androidId ?? null);
    }
  } catch {
    // swallow; we'll fall back
  }

  // Fallback: random install ID
  if (!id) {
    try {
      const bytes = await Random.getRandomBytesAsync(16);
      id = toHex(bytes);
    } catch {
      // absolute worst case: time-based pseudo-id
      id = `install-${Date.now()}`;
    }
  }

  // Try to persist, but don't fail if Keychain write throws
  try {
    await SecureStore.setItemAsync(KEY, id);
  } catch {
    // ignore; we'll recompute next launch but still return id now
  }

  return id;
}
