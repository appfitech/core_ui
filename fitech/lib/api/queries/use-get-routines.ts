import { useQuery } from '@tanstack/react-query';

import { useUserStore } from '@/stores/user';
import { ClientResourceResponseDtoReadable } from '@/types/api/types.gen';

import { api } from '../api';

export const useGetRoutines = () => {
  const token = useUserStore((s) => s.getToken());

  return useQuery<ClientResourceResponseDtoReadable[]>({
    queryKey: ['get-user-routines'],
    queryFn: async () => {
      return api.get(`/client-resources/client/routines`);
    },
    enabled: !!token,
  });
};
