import { clearAppQueryCache } from '@/lib/api/mutation-cache';
import { queryClient } from '@/lib/query-client';
import { useUserStore } from '@/stores/user';
import { extractAccessToken, isJwtExpired } from '@/utils/auth-token';

const API_BASE_URL = 'https://appfitech.com/v1/app';

export type RefreshSessionResult = 'refreshed' | 'unchanged' | 'logged_out';

let refreshInFlight: Promise<RefreshSessionResult> | null = null;
let bootstrapInFlight: Promise<void> | null = null;

async function clearSession(): Promise<void> {
  await useUserStore.getState().logout();
  clearAppQueryCache(queryClient);
}

/**
 * Exchange the current JWT for a new one.
 * - 400/401/403 from refresh: session cannot be renewed → logout
 * - Network / 5xx: keep existing token unless it is already expired
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

      const raw = await res.text();
      let parsed: Record<string, unknown> = {};
      try {
        parsed = raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
      } catch {
        parsed = { message: raw };
      }

      if (res.status === 400 || res.status === 401 || res.status === 403) {
        if (__DEV__) {
          console.warn('[Auth] refresh-token rejected', res.status, parsed);
        }
        await clearSession();
        return 'logged_out';
      }

      if (!res.ok) {
        if (__DEV__) {
          console.warn('[Auth] refresh-token failed', res.status, parsed);
        }
        if (isJwtExpired(currentToken)) {
          await clearSession();
          return 'logged_out';
        }
        return 'unchanged';
      }

      const newToken = extractAccessToken(parsed);

      if (!newToken) {
        if (__DEV__) {
          console.warn('[Auth] refresh-token OK but no token in body', parsed);
        }
        if (isJwtExpired(currentToken)) {
          await clearSession();
          return 'logged_out';
        }
        return 'unchanged';
      }

      await store.setToken(newToken);

      if (newToken === currentToken && isJwtExpired(newToken)) {
        await clearSession();
        return 'logged_out';
      }

      if (__DEV__) {
        console.log('[Auth] access token refreshed');
      }
      return 'refreshed';
    } catch (error) {
      if (__DEV__) {
        console.warn('[Auth] refresh-token network error', error);
      }
      if (isJwtExpired(currentToken)) {
        await clearSession();
        return 'logged_out';
      }
      return 'unchanged';
    }
  })().finally(() => {
    refreshInFlight = null;
  });

  return refreshInFlight;
}

/**
 * Run when the app returns to the foreground (or after cold-start bootstrap).
 * Refreshes JWT first, then invalidates React Query so refetches use the new token.
 */
let foregroundInFlight: Promise<RefreshSessionResult> | null = null;

export async function handleAppForeground(): Promise<RefreshSessionResult> {
  if (foregroundInFlight) {
    return foregroundInFlight;
  }

  foregroundInFlight = (async () => {
    const token = useUserStore.getState().getToken();
    if (!token) {
      return 'unchanged';
    }

    const result = await refreshAccessToken();

    if (__DEV__) {
      console.log('[Auth] handleAppForeground:', result);
    }

    if (result === 'logged_out') {
      return result;
    }

    await queryClient.invalidateQueries();
    return result;
  })().finally(() => {
    foregroundInFlight = null;
  });

  return foregroundInFlight;
}

/** Restore SecureStore session, optionally refresh JWT, then mark hydration complete. */
export async function bootstrapAuthSession(): Promise<void> {
  const store = useUserStore.getState();

  if (store.isSessionHydrated && !store.isSessionHydrating) {
    if (store.getToken()) {
      await handleAppForeground();
    }
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
        await handleAppForeground();
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
