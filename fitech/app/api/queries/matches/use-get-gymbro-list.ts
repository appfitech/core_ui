import { useQuery } from '@tanstack/react-query';

import { useUserStore } from '@/stores/user';
import { GymBroCandidateResponseDto } from '@/types/api/types.gen';

import { api } from '../../api';

export const useGetGymBroCandidates = () => {
  const token = useUserStore((s) => s.getToken());

  return useQuery<GymBroCandidateResponseDto[]>({
    queryKey: ['get-gymbro-candidates'],
    queryFn: async () => {
      const result = await api.get(`/matches/gymbro/candidates`);

      return result?.data ?? [];
    },
    enabled: !!token,
  });
};

export const useGetGymBroMutuals = () => {
  const token = useUserStore((s) => s.getToken());

  return useQuery<GymBroCandidateResponseDto[]>({
    queryKey: ['get-gymbro-mutuals'],
    queryFn: async () => {
      const result = await api.get(`/matches/mutual/GYMBRO`);

      return result?.data ?? [];
    },
    enabled: !!token,
  });
};
