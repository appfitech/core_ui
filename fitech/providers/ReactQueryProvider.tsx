import { focusManager, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useEffect } from 'react';
import { AppState, type AppStateStatus } from 'react-native';

import { queryClient } from '@/lib/query-client';
import { handleAppForeground } from '@/services/auth-session';

export function ReactQueryProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const onChange = async (status: AppStateStatus) => {
      if (status === 'active') {
        await handleAppForeground();
        focusManager.setFocused(true);
        return;
      }

      focusManager.setFocused(false);
    };

    const subscription = AppState.addEventListener('change', (status) => {
      void onChange(status);
    });

    focusManager.setFocused(AppState.currentState === 'active');

    return () => subscription.remove();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
