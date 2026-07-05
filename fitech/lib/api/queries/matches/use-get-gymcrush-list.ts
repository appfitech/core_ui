import { useQuery } from '@tanstack/react-query';

import { GymCrushCandidateResponseDto } from '@/types/api/types.gen';

import { api } from '../../api';
import { useSessionQueryEnabled } from '../use-session-query-enabled';
import { parseMatchCandidateList } from './parse-match-candidates';

export const useGetGymCrushCandidates = () => {
  const enabled = useSessionQueryEnabled();

  return useQuery<GymCrushCandidateResponseDto[]>({
    queryKey: ['get-gymcrush-candidates'],
    queryFn: async () => {
      const result = await api.get(`/matches/gymcrush/candidates`);
      return parseMatchCandidateList(result) as GymCrushCandidateResponseDto[];
    },
    enabled,
  });
};

export const useGetGymCrushMutuals = () => {
  const enabled = useSessionQueryEnabled();

  return useQuery<GymCrushCandidateResponseDto[]>({
    queryKey: ['get-gymcrush-mutuals'],
    queryFn: async () => {
      const result = await api.get(`/matches/mutual/GYMCRUSH`);
      return parseMatchCandidateList(result) as GymCrushCandidateResponseDto[];
    },
    enabled,
  });
};
