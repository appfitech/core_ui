import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/lib/api/query-keys';
import { useUserStore } from '@/stores/user';
import { MatchScreenType } from '@/types/forms';

import { api } from '../../api';

type MatchRequestSystem = 'GYMBRO' | 'GYMCRUSH';

function getMatchRequestSystem(type: MatchScreenType): MatchRequestSystem {
  return type === 'gymbro' ? 'GYMBRO' : 'GYMCRUSH';
}

export function useMarkMatchRequestsSeen(type: MatchScreenType) {
  const queryClient = useQueryClient();
  const token = useUserStore((s) => s.getToken());
  const countKey =
    type === 'gymbro'
      ? queryKeys.gymbro.requestsCount
      : queryKeys.gymcrush.requestsCount;

  return useMutation({
    mutationFn: async () => {
      if (!token) return;

      const system = getMatchRequestSystem(type);
      await api.post(`/matches/requests/${system}/mark-seen`, undefined);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: countKey });
    },
  });
}
