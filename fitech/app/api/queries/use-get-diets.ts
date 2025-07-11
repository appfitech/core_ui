import { useQuery } from '@tanstack/react-query';

import { useUserStore } from '@/stores/user';
import { ClientResourceResponseDtoReadable } from '@/types/api/types.gen';

import { api } from '../api';

export const useGetDiets = () => {
  const token = useUserStore((s) => s.getToken());

  return useQuery<ClientResourceResponseDtoReadable[]>({
    queryKey: ['get-user-diets'],
    queryFn: async () => {
      return api.get(`/client-resources/client/diets`);
    },
    enabled: !!token,
  });
};
