import { useQuery } from '@tanstack/react-query';

import { ClientResourceResponseDtoReadable } from '@/types/api/types.gen';

import { api } from '../api';

export const useGetRoutines = () => {
  return useQuery<ClientResourceResponseDtoReadable[]>({
    queryKey: ['get-user-routines'],
    queryFn: async () => {
      return api.get(`/client-resources/client/routines`);
    },
  });
};
