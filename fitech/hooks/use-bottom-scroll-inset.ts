import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTabBarInset } from '@/contexts/TabBarInsetContext';
import { getScrollPaddingBottom } from '@/utils/layout';

/**
 * Bottom inset for FlatList / manual scroll views (tab screens with NavBar + FAB).
 */
export function useBottomScrollInset(options?: { includeFab?: boolean }) {
  const insets = useSafeAreaInsets();
  const tabBarInset = useTabBarInset();
  return Math.max(tabBarInset, getScrollPaddingBottom(insets, options));
}
