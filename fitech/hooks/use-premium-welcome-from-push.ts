import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';

import { ROUTES } from '@/constants/routes';
import { refreshCurrentUserSession } from '@/lib/api/mutation-cache';

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

    setVisible(true);
    void refreshCurrentUserSession();
  }, [from, isTrainer, type]);

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
