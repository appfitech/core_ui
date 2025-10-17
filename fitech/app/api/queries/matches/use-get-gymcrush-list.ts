import { useQuery } from '@tanstack/react-query';

import { useUserStore } from '@/stores/user';

import { api } from '../../api';

export const useGetGymCrushList = () => {
  const token = useUserStore((s) => s.getToken());

  return useQuery<any[]>({
    queryKey: ['get-gymcrush-candidates'],
    queryFn: async () => {
      return api.get(`/matches/gymcrush/candidates`);
    },
    enabled: !!token,
  });
};
