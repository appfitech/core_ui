import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/lib/api/query-keys';
import { useUserStore } from '@/stores/user';
import {
  GymBroCandidateResponseDto,
  GymCrushCandidateResponseDto,
} from '@/types/api/types.gen';
import { MatchScreenType } from '@/types/forms';

import { api } from '../../api';
import { useSessionQueryEnabled } from '../use-session-query-enabled';

export type MatchRequestSystem = 'GYMBRO' | 'GYMCRUSH';

export type MatchRequestItem =
  | GymBroCandidateResponseDto
  | GymCrushCandidateResponseDto;

type MatchRequestsResponse = {
  count?: number;
  success?: boolean;
  requests?: MatchRequestItem[];
};

function getMatchRequestSystem(type: MatchScreenType): MatchRequestSystem {
  return type === 'gymbro' ? 'GYMBRO' : 'GYMCRUSH';
}

export function useGetMatchRequests(type: MatchScreenType) {
  const userId = useUserStore((s) => s?.user?.user?.id);
  const token = useUserStore((s) => s.getToken());
  const system = getMatchRequestSystem(type);
  const baseQueryKey =
    type === 'gymbro' ? queryKeys.gymbro.requests : queryKeys.gymcrush.requests;
  const enabled = useSessionQueryEnabled(!!userId && !!token);

  return useQuery<MatchRequestItem[]>({
    queryKey: [...baseQueryKey, userId, token],
    queryFn: async () => {
      if (!token) return [];

      const result = (await api.get(`/matches/requests/${system}`, {
        headers: { Authorization: `Bearer ${token}` },
      })) as MatchRequestsResponse;

      return result.requests ?? [];
    },
    enabled,
    staleTime: 0,
  });
}
