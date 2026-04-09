import type { Href } from 'expo-router';

/**
 * Reads a deep-link path from Expo push `data` (exp.host API or local notification).
 */
export function getHrefFromPushData(data: unknown): Href | null {
  if (!data || typeof data !== 'object') {
    return null;
  }

  const payload = data as Record<string, unknown>;
  const path = payload.navigateTo ?? payload.navigate_to;

  if (typeof path !== 'string' || path.length === 0) {
    return null;
  }

  if (!path.startsWith('/')) {
    return null;
  }

  return path as Href;
}
