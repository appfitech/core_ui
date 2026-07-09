import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';

import { ROUTES } from '@/constants/routes';
import { refreshCurrentUserSession } from '@/lib/api/mutation-cache';
import { useUserStore } from '@/stores/user';

function parseQueryParam(
  value: string | string[] | undefined,
): string | undefined {
  if (value == null) return undefined;
  return Array.isArray(value) ? value[0] : value;
}

function isPremiumWelcomeParam(
  from: string | string[] | undefined,
  type: string | string[] | undefined,
): boolean {
  const fromParam = parseQueryParam(from);
  const typeParam = parseQueryParam(type);
  return fromParam === 'premium' || typeParam === 'premium';
}

/**
 * Shows the premium welcome banner when the user lands on home via
 * `/home?type=premium` or `/home?from=premium` (push notification or deep link).
 */
export function usePremiumWelcomeFromPush(isTrainer: boolean) {
  const router = useRouter();
  const { from, type } = useLocalSearchParams<{
    from?: string | string[];
    type?: string | string[];
  }>();

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!isPremiumWelcomeParam(from, type) || isTrainer) return;

    let cancelled = false;

    const run = async () => {
      const wasAlreadyPremium = Boolean(
        useUserStore.getState().user?.user?.premium,
      );

      await refreshCurrentUserSession();
      if (cancelled) return;

      const isPremiumNow = Boolean(
        useUserStore.getState().user?.user?.premium,
      );

      if (!wasAlreadyPremium && isPremiumNow) {
        setVisible(true);
        return;
      }

      router.replace(ROUTES.home);
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [from, isTrainer, router, type]);

  const dismissPremiumWelcome = useCallback(() => {
    setVisible(false);
    if (isPremiumWelcomeParam(from, type)) {
      router.replace(ROUTES.home);
    }
  }, [from, router, type]);

  return {
    showPremiumWelcome: visible,
    dismissPremiumWelcome,
  };
}
