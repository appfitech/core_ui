import * as Application from 'expo-application';
import * as Random from 'expo-random';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const KEY = '@installation_id_v1';

function toHex(bytes: Uint8Array) {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function getDeviceId(): Promise<string> {
  const cached = await SecureStore.getItemAsync(KEY);
  if (cached) return cached;

  let id: string | null = null;

  try {
    if (Platform.OS === 'ios') {
      id = await Application.getIosIdForVendorAsync();
    } else if (Platform.OS === 'android') {
      const maybeGetter = (Application as any).getAndroidIdAsync;
      id =
        typeof maybeGetter === 'function'
          ? await maybeGetter()
          : ((Application as any).androidId ?? null);
    }
  } catch {}

  if (!id) {
    const bytes = await Random.getRandomBytesAsync(16);
    id = toHex(bytes);
  }

  await SecureStore.setItemAsync(KEY, id);

  return id;
}
