import { useQuery } from '@tanstack/react-query';

import { GymBroCandidateResponseDto } from '@/types/api/types.gen';

import { api } from '../../api';
import { useSessionQueryEnabled } from '../use-session-query-enabled';
import { parseMatchCandidateList } from './parse-match-candidates';

export const useGetGymBroCandidates = () => {
  const enabled = useSessionQueryEnabled();

  return useQuery<GymBroCandidateResponseDto[]>({
    queryKey: ['get-gymbro-candidates'],
    queryFn: async () => {
      const result = await api.get(`/matches/gymbro/candidates`);
      return parseMatchCandidateList(result) as GymBroCandidateResponseDto[];
    },
    enabled,
  });
};

export const useGetGymBroMutuals = () => {
  const enabled = useSessionQueryEnabled();

  return useQuery<GymBroCandidateResponseDto[]>({
    queryKey: ['get-gymbro-mutuals'],
    queryFn: async () => {
      const result = await api.get(`/matches/mutual/GYMBRO`);
      return parseMatchCandidateList(result) as GymBroCandidateResponseDto[];
    },
    enabled,
  });
};
