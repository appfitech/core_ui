import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/lib/api/query-keys';
import { useUserStore } from '@/stores/user';
import { MatchScreenType } from '@/types/forms';

import { api } from '../../api';
import { useSessionQueryEnabled } from '../use-session-query-enabled';

export type MatchRequestSystem = 'GYMBRO' | 'GYMCRUSH';

export type MatchRequestItem = {
  userId: number;
  name: string;
  email: string;
};

type MatchRequestsResponse = {
  matchSystem?: MatchRequestSystem;
  newUnseenCount?: number;
  pendingCount?: number;
  requests?: MatchRequestItem[];
  targetUserId?: number;
};

function getMatchRequestSystem(type: MatchScreenType): MatchRequestSystem {
  return type === 'gymbro' ? 'GYMBRO' : 'GYMCRUSH';
}

export function useGetMatchRequests(type: MatchScreenType) {
  const userId = useUserStore((s) => s?.user?.user?.id);
  const system = getMatchRequestSystem(type);
  const baseQueryKey =
    type === 'gymbro' ? queryKeys.gymbro.requests : queryKeys.gymcrush.requests;
  const enabled = useSessionQueryEnabled(!!userId);

  return useQuery<MatchRequestItem[]>({
    queryKey: [...baseQueryKey, userId],
    queryFn: async () => {
      const result = (await api.get(
        `/testing/match-requests?userId=${userId}&system=${system}`,
      )) as MatchRequestsResponse;

      return result.requests ?? [];
    },
    enabled,
    staleTime: 0,
  });
}
