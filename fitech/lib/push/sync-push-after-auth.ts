import type { SavePushTokenFn } from '@/lib/push/register-and-sync-push-token';
import { registerAndSyncPushToken } from '@/lib/push/register-and-sync-push-token';

/** Run after login / session restore — does not throw; logs failures. */
export async function syncPushAfterAuth(
  savePushToken: SavePushTokenFn,
): Promise<void> {
  try {
    const result = await registerAndSyncPushToken({ savePushToken });

    if (result.error || !result.savedToServer) {
      console.warn('[Push] syncPushAfterAuth incomplete', result);
    }
  } catch (e) {
    console.warn('[Push] syncPushAfterAuth failed', e);
  }
}
