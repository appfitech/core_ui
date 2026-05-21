import { Platform } from 'react-native';

const CHAT_WS_HOST = 'appfitech.com';

/**
 * Android blocks cleartext `ws://` (API 28+). iOS currently connects with `ws://`
 * against this backend. Use platform-appropriate scheme until the server exposes
 * a single WSS endpoint for both.
 */
function getChatWsScheme(): 'ws' | 'wss' {
  if (Platform.OS === 'android') return 'wss';
  if (Platform.OS === 'ios') return 'ws';
  return 'wss';
}

export function getChatWsBaseUrl(): string {
  return `${getChatWsScheme()}://${CHAT_WS_HOST}/api`;
}

export function buildChatWsUrl(token: string): string {
  const baseUrl = getChatWsBaseUrl();
  const base = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;

  return `${base}/ws-native?token=${encodeURIComponent(token)}`;
}
