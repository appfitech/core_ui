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

export type MatchRequestCandidate =
  | GymBroCandidateResponseDto
  | GymCrushCandidateResponseDto;

function parseMatchRequestsPayload(raw: unknown): MatchRequestCandidate[] {
  if (Array.isArray(raw)) {
    return raw as MatchRequestCandidate[];
  }

  if (raw && typeof raw === 'object') {
    const obj = raw as Record<string, unknown>;
    for (const key of ['data', 'requests', 'content', 'items'] as const) {
      const value = obj[key];
      if (Array.isArray(value)) {
        return value as MatchRequestCandidate[];
      }
    }
  }

  return [];
}

function getMatchRequestSystem(type: MatchScreenType): MatchRequestSystem {
  return type === 'gymbro' ? 'GYMBRO' : 'GYMCRUSH';
}

export function useGetMatchRequests(type: MatchScreenType) {
  const userId = useUserStore((s) => s.getUserId());
  const system = getMatchRequestSystem(type);
  const queryKey =
    type === 'gymbro'
      ? queryKeys.gymbro.requests
      : queryKeys.gymcrush.requests;
  const enabled = useSessionQueryEnabled(userId != null);

  return useQuery<MatchRequestCandidate[]>({
    queryKey,
    queryFn: async () => {
      const result = await api.get(
        `/testing/match-requests?userId=${userId}&system=${system}`,
      );
      return parseMatchRequestsPayload(result);
    },
    enabled,
    staleTime: 0,
  });
}
