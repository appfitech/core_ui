import React, { useMemo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PullToRefreshControl } from '@/components/PullToRefreshControl';
import { getFixedHeaderScrollOffset } from '@/utils/layout';

import { usePullToRefresh } from './use-pull-to-refresh';

type Options = {
  /** Most tab screens use a title + subheader fixed header. */
  hasSubheader?: boolean;
};

/**
 * Pull-to-refresh wired for FlatList screens inside PageContainer (fixed header).
 */
export function useListScreenRefresh(
  onRefetch: () => void | Promise<unknown>,
  options: Options = {},
) {
  const insets = useSafeAreaInsets();
  const { hasSubheader = true } = options;
  const progressViewOffset = getFixedHeaderScrollOffset(insets, { hasSubheader });
  const { refreshing, onRefresh } = usePullToRefresh(onRefetch);

  const refreshControl = useMemo(
    () => (
      <PullToRefreshControl
        refreshing={refreshing}
        onRefresh={onRefresh}
        progressViewOffset={progressViewOffset}
      />
    ),
    [onRefresh, progressViewOffset, refreshing],
  );

  return { refreshing, onRefresh, refreshControl };
}
