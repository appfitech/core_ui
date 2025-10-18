// utils/clear-secure-on-fresh-install.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

const INSTALL_MARKER = '@install_marker_v1';
const SECURE_USER_KEY = 'user';
const SECURE_TOKEN_KEY = 'auth_token';

let hasChecked = false;

export async function clearSecureOnFreshInstall() {
  if (hasChecked) return;
  hasChecked = true;

  const seen = await AsyncStorage.getItem(INSTALL_MARKER);
  if (seen) return; // not a fresh install

  try {
    await SecureStore.deleteItemAsync(SECURE_USER_KEY);
    await SecureStore.deleteItemAsync(SECURE_TOKEN_KEY);
  } catch {}
  await AsyncStorage.setItem(INSTALL_MARKER, '1');
}
