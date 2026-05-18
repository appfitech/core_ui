import { useQuery } from '@tanstack/react-query';

import { useUserStore } from '@/stores/user';
import { GymCrushCandidateResponseDto } from '@/types/api/types.gen';

import { api } from '../../api';

export const useGetGymCrushCandidates = () => {
  const token = useUserStore((s) => s.getToken());

  return useQuery<GymCrushCandidateResponseDto[]>({
    queryKey: ['get-gymcrush-candidates'],
    queryFn: async () => {
      const result = await api.get(`/matches/gymcrush/candidates`);

      return result?.data ?? [];
    },
    enabled: !!token,
  });
};

export const useGetGymCrushMutuals = () => {
  const token = useUserStore((s) => s.getToken());

  return useQuery<GymCrushCandidateResponseDto[]>({
    queryKey: ['get-gymcrush-mutuals'],
    queryFn: async () => {
      const result = await api.get(`/matches/mutual/GYMCRUSH`);

      return result?.data ?? [];
    },
    enabled: !!token,
  });
};
