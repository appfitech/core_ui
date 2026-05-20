import { type Href, useRouter } from 'expo-router';
import { useCallback } from 'react';

import { ROUTES } from '@/constants/routes';
import { useUserStore } from '@/stores/user';

type Options = {
  /** Where to go when there is no stack and the user is not logged in. @default '/' */
  guestFallback?: Href;
  /** Where to go when there is no stack and the user is logged in. @default ROUTES.home */
  authenticatedFallback?: Href;
};

/**
 * Back navigation for screens opened via deep link (no history).
 * Uses `router.back()` when possible; otherwise replaces to home or welcome.
 */
export function useSmartBack(options: Options = {}) {
  const router = useRouter();
  const token = useUserStore((s) => s.token);
  const user = useUserStore((s) => s.user);

  const guestFallback = options.guestFallback ?? '/';
  const authenticatedFallback = options.authenticatedFallback ?? ROUTES.home;

  return useCallback(() => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    const isAuthenticated = Boolean(token ?? user);
    router.replace(isAuthenticated ? authenticatedFallback : guestFallback);
  }, [authenticatedFallback, guestFallback, router, token, user]);
}
