import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/lib/api/query-keys';
import { useUserStore } from '@/stores/user';
import { MatchScreenType } from '@/types/forms';

import { api } from '../../api';
import { useSessionQueryEnabled } from '../use-session-query-enabled';

type MatchRequestSystem = 'GYMBRO' | 'GYMCRUSH';

function getMatchRequestSystem(type: MatchScreenType): MatchRequestSystem {
  return type === 'gymbro' ? 'GYMBRO' : 'GYMCRUSH';
}

function parseMatchRequestsCount(result: unknown): number {
  if (!result || typeof result !== 'object') return 0;

  const record = result as Record<string, unknown>;
  const data =
    record.data && typeof record.data === 'object'
      ? (record.data as Record<string, unknown>)
      : null;

  for (const value of [
    record.count,
    record.newCount,
    record.pendingCount,
    data?.count,
    data?.newCount,
    data?.pendingCount,
  ]) {
    if (typeof value === 'number' && Number.isFinite(value) && value > 0) {
      return Math.floor(value);
    }
  }

  return 0;
}

export function useGetMatchRequestsCount(type: MatchScreenType) {
  const userId = useUserStore((s) => s?.user?.user?.id);
  const token = useUserStore((s) => s.getToken());
  const system = getMatchRequestSystem(type);
  const baseQueryKey =
    type === 'gymbro'
      ? queryKeys.gymbro.requestsCount
      : queryKeys.gymcrush.requestsCount;
  const enabled = useSessionQueryEnabled(!!userId && !!token);

  return useQuery<number>({
    queryKey: [...baseQueryKey, userId, token],
    queryFn: async () => {
      if (!token) return 0;

      const result = await api.get(`/matches/requests/${system}/count`);

      return parseMatchRequestsCount(result);
    },
    enabled,
    refetchInterval: 40_000,
  });
}
