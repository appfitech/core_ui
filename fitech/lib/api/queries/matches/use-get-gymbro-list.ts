import { useQuery } from '@tanstack/react-query';

import { GymBroCandidateResponseDto } from '@/types/api/types.gen';

import { api } from '../../api';
import { useSessionQueryEnabled } from '../use-session-query-enabled';

export const useGetGymBroCandidates = () => {
  const enabled = useSessionQueryEnabled();

  return useQuery<GymBroCandidateResponseDto[]>({
    queryKey: ['get-gymbro-candidates'],
    queryFn: async () => {
      const result = await api.get(`/matches/gymbro/candidates`);

      return result?.data ?? [];
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

      return result?.data ?? [];
    },
    enabled,
  });
};
