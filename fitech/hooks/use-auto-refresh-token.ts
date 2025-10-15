// src/hooks/use-auto-refresh-token.ts
import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';

import { useUserStore } from '@/stores/user';

export function useAutoRefreshToken() {
  const refreshToken = useUserStore((s) => s.refreshToken);
  const loadSession = useUserStore((s) => s.loadSession);
  const appState = useRef<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    // On mount, be sure we have what's in SecureStore in memory
    loadSession().then(() => {
      // Try a refresh once at startup; harmless if still valid
      refreshToken().catch(() => {});
    });

    const sub = AppState.addEventListener('change', async (nextState) => {
      const prev = appState.current;
      appState.current = nextState;

      // When returning to the foreground
      if (prev.match(/inactive|background/) && nextState === 'active') {
        try {
          await refreshToken();
        } catch {}
      }
    });

    return () => sub.remove();
  }, [loadSession, refreshToken]);
}
