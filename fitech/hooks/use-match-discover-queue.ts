import { useCallback, useMemo, useState } from 'react';

type WithUserId = { userId?: number };

/**
 * Local discover queue: always shows `available[0]` after a swipe (no index bump).
 * Prevents skipping the next profile when the list shrinks after pass/like.
 */
export function useMatchDiscoverQueue<T extends WithUserId>(
  candidates: T[] | undefined,
) {
  const [discardedIds, setDiscardedIds] = useState<Set<string>>(
    () => new Set(),
  );
  const [savedIds, setSavedIds] = useState<Set<string>>(() => new Set());

  const available = useMemo(() => {
    return (
      candidates?.filter((candidate) => {
        const id = candidate?.userId;
        if (id == null) return false;
        const key = String(id);
        return !savedIds.has(key) && !discardedIds.has(key);
      }) ?? []
    );
  }, [candidates, discardedIds, savedIds]);

  const current = available[0];
  const next = available[1];

  const removeCurrent = useCallback(
    (direction: 'left' | 'right') => {
      const id = current?.userId;
      if (id == null) return;

      const key = String(id);
      if (direction === 'right') {
        setSavedIds((prev) => new Set(prev).add(key));
      } else {
        setDiscardedIds((prev) => new Set(prev).add(key));
      }
    },
    [current?.userId],
  );

  const resetQueue = useCallback(() => {
    setDiscardedIds(new Set());
    setSavedIds(new Set());
  }, []);

  return {
    available,
    current,
    next,
    removeCurrent,
    resetQueue,
  };
}
