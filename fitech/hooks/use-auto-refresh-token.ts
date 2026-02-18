// src/hooks/use-auto-refresh-token.ts
import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';

import { useUserStore } from '@/stores/user';

import { api } from '../app/api/api';

async function hydrateUserIfNeeded() {
  const store = useUserStore.getState();
  const token = store.getToken();
  const user = store.user;

  if (!token) return;

  const needsHydration =
    !user ||
    !user.user ||
    !(user.user as { person?: { firstName?: string } }).person?.firstName;

  if (!needsHydration) return;

  const userId = store.getUserId() ?? (await store.getStoredUserId()) ?? null;
  if (userId == null) return;

  try {
    const userData = await api.get(`/user/${userId}`);
    if (userData && typeof userData === 'object') {
      await store.setUser({ token, user: userData as any });
    }
  } catch {
    // Non-fatal: user stays null/incomplete; next login will fix
  }
}

export function useAutoRefreshToken() {
  const refreshToken = useUserStore((s) => s.refreshToken);
  const loadSession = useUserStore((s) => s.loadSession);
  const appState = useRef<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    (async () => {
      // On mount: restore session from SecureStore, then refresh token
      await loadSession();
      try {
        await refreshToken();
      } catch {}

      // If we have a token but user is missing/incomplete (e.g. SecureStore evicted user blob),
      // refetch current user so "Hola" and profile work without re-login
      await hydrateUserIfNeeded();
    })();

    const sub = AppState.addEventListener('change', async (nextState) => {
      const prev = appState.current;
      appState.current = nextState;

      if (prev.match(/inactive|background/) && nextState === 'active') {
        try {
          await refreshToken();
          await hydrateUserIfNeeded();
        } catch {}
      }
    });

    return () => sub.remove();
  }, [loadSession, refreshToken]);
}
