import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';

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
  const dismissedRef = useRef(false);

  const clearPremiumWelcomeParams = useCallback(() => {
    if (!isPremiumWelcomeParam(from, type)) return;
    router.setParams({ type: undefined, from: undefined });
  }, [from, router, type]);

  useEffect(() => {
    if (!isPremiumWelcomeParam(from, type) || isTrainer || dismissedRef.current) {
      return;
    }

    let cancelled = false;

    const run = async () => {
      await refreshCurrentUserSession();
      if (cancelled) return;

      const isPremiumNow = Boolean(
        useUserStore.getState().user?.user?.premium,
      );

      if (isPremiumNow) {
        setVisible(true);
        return;
      }

      clearPremiumWelcomeParams();
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [clearPremiumWelcomeParams, from, isTrainer, type]);

  const dismissPremiumWelcome = useCallback(() => {
    dismissedRef.current = true;
    setVisible(false);
    clearPremiumWelcomeParams();
  }, [clearPremiumWelcomeParams]);

  return {
    showPremiumWelcome: visible,
    dismissPremiumWelcome,
  };
}
