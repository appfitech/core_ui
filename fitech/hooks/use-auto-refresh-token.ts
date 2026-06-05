import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';

import { api } from '@/lib/api/api';
import {
  bootstrapAuthSession,
  handleAppForeground,
  refreshAccessToken,
} from '@/services/auth-session';
import { useUserStore } from '@/stores/user';

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
    // Non-fatal: profile can be refetched later
  }
}

const REFRESH_INTERVAL_MS = 12 * 60 * 1000;

export function useAutoRefreshToken() {
  const appState = useRef<AppStateStatus>(AppState.currentState);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    void bootstrapAuthSession().then(() => hydrateUserIfNeeded());

    const clearRefreshInterval = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    const startRefreshInterval = () => {
      clearRefreshInterval();
      intervalRef.current = setInterval(() => {
        if (useUserStore.getState().getToken()) {
          void refreshAccessToken();
        }
      }, REFRESH_INTERVAL_MS);
    };

    const sub = AppState.addEventListener('change', (nextState) => {
      const prev = appState.current;
      appState.current = nextState;

      if (prev.match(/inactive|background/) && nextState === 'active') {
        void handleAppForeground().then(() => hydrateUserIfNeeded());
        startRefreshInterval();
        return;
      }

      if (nextState.match(/inactive|background/)) {
        clearRefreshInterval();
      }
    });

    if (AppState.currentState === 'active') {
      startRefreshInterval();
    }

    return () => {
      sub.remove();
      clearRefreshInterval();
    };
  }, []);
}
