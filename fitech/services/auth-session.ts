import { useUserStore } from '@/stores/user';
import { extractAccessToken } from '@/utils/auth-token';

const API_BASE_URL = 'https://appfitech.com/v1/app';

export type RefreshSessionResult = 'refreshed' | 'unchanged' | 'logged_out';

let refreshInFlight: Promise<RefreshSessionResult> | null = null;
let bootstrapInFlight: Promise<void> | null = null;

/**
 * Exchange the current JWT for a new one.
 * - 401/403: session is invalid → logout
 * - Network / 5xx: keep existing token (do not log the user out)
 */
export async function refreshAccessToken(): Promise<RefreshSessionResult> {
  if (refreshInFlight) {
    return refreshInFlight;
  }

  refreshInFlight = (async () => {
    const store = useUserStore.getState();
    const currentToken = store.getToken();

    if (!currentToken) {
      return 'logged_out';
    }

    try {
      const res = await fetch(`${API_BASE_URL}/user/refresh-token`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: currentToken }),
      });

      if (res.status === 401 || res.status === 403) {
        await store.logout();
        return 'logged_out';
      }

      if (!res.ok) {
        return 'unchanged';
      }

      const data = await res.json();
      const newToken = extractAccessToken(data);

      if (!newToken) {
        return 'unchanged';
      }

      await store.setToken(newToken);
      return 'refreshed';
    } catch {
      return 'unchanged';
    }
  })().finally(() => {
    refreshInFlight = null;
  });

  return refreshInFlight;
}

/** Restore SecureStore session, optionally refresh JWT, then mark hydration complete. */
export async function bootstrapAuthSession(): Promise<void> {
  const store = useUserStore.getState();

  if (store.isSessionHydrated && !store.isSessionHydrating) {
    return;
  }

  if (bootstrapInFlight) {
    return bootstrapInFlight;
  }

  bootstrapInFlight = (async () => {
    useUserStore.getState().setSessionHydrating(true);

    try {
      await useUserStore.getState().loadSession();

      if (useUserStore.getState().getToken()) {
        await refreshAccessToken();
      }
    } finally {
      useUserStore.getState().setSessionHydrated(true);
      useUserStore.getState().setSessionHydrating(false);
    }
  })().finally(() => {
    bootstrapInFlight = null;
  });

  return bootstrapInFlight;
}
