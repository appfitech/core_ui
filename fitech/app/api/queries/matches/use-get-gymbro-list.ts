import { useQuery } from '@tanstack/react-query';

import { useUserStore } from '@/stores/user';

import { api } from '../../api';

export const useGetGymBroList = () => {
  const token = useUserStore((s) => s.getToken());

  return useQuery<any[]>({
    queryKey: ['get-gymbro-candidates'],
    queryFn: async () => {
      return api.get(`/matches/gymbro/candidates`);
    },
    enabled: !!token,
  });
};
