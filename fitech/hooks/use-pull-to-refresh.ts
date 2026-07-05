import { useCallback, useRef, useState } from 'react';

type RefetchFn = () => void | Promise<unknown>;

/** Keep the refresh indicator visible long enough to read. */
const MIN_REFRESH_VISIBLE_MS = 450;

async function runRefetch(onRefetch: RefetchFn) {
  const started = Date.now();
  await Promise.resolve(onRefetch());
  const elapsed = Date.now() - started;
  if (elapsed < MIN_REFRESH_VISIBLE_MS) {
    await new Promise((resolve) => {
      setTimeout(resolve, MIN_REFRESH_VISIBLE_MS - elapsed);
    });
  }
}

/**
 * Pull-to-refresh state for React Query `refetch` (or any async reload).
 * Shows the native spinner while data is reloading.
 */
export function usePullToRefresh(onRefetch: RefetchFn) {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await runRefetch(onRefetch);
    } finally {
      setRefreshing(false);
    }
  }, [onRefetch]);

  return { refreshing, onRefresh };
}

/** Runs several refetchers in parallel (e.g. active + inactive lists). */
export function usePullToRefreshMany(...refetchers: RefetchFn[]) {
  const refetchersRef = useRef(refetchers);
  refetchersRef.current = refetchers;

  const onRefetchAll = useCallback(async () => {
    await Promise.all(
      refetchersRef.current.map((refetch) => Promise.resolve(refetch())),
    );
  }, []);

  return usePullToRefresh(onRefetchAll);
}
