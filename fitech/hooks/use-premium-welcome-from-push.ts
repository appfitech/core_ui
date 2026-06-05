import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

import { ROUTES } from '@/constants/routes';
import { refreshCurrentUserSession } from '@/lib/api/mutation-cache';

function parseFromParam(from: string | string[] | undefined): string | undefined {
  if (from == null) return undefined;
  return Array.isArray(from) ? from[0] : from;
}

/**
 * Shows the premium welcome banner when the user lands on home via
 * `/home?from=premium` (push notification or deep link).
 */
export function usePremiumWelcomeFromPush(isTrainer: boolean) {
  const router = useRouter();
  const { from } = useLocalSearchParams<{ from?: string | string[] }>();
  const fromParam = parseFromParam(from);

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (fromParam !== 'premium' || isTrainer) return;

    setVisible(true);
    void refreshCurrentUserSession();
    router.replace(ROUTES.home);
  }, [fromParam, isTrainer, router]);

  return {
    showPremiumWelcome: visible,
    dismissPremiumWelcome: () => setVisible(false),
  };
}
