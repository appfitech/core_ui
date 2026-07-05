import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';

import { MatchScreenTab } from '@/types/forms';

function parseTabParam(
  tab: string | string[] | undefined,
): MatchScreenTab | undefined {
  const value = tab == null ? undefined : Array.isArray(tab) ? tab[0] : tab;
  if (value === 'matches' || value === 'discover' || value === 'requests') {
    return value;
  }
  return undefined;
}

export function useMatchScreenTab() {
  const { tab } = useLocalSearchParams<{ tab?: string | string[] }>();
  const tabFromParams = parseTabParam(tab);

  const [selectedTab, setSelectedTab] = useState<MatchScreenTab>(
    tabFromParams ?? 'discover',
  );

  useEffect(() => {
    if (tabFromParams != null) {
      setSelectedTab(tabFromParams);
    }
  }, [tabFromParams]);

  return [selectedTab, setSelectedTab] as const;
}
