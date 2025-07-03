import { useQuery } from '@tanstack/react-query';

import { ClientResourceResponseDtoReadable } from '@/types/api/types.gen';

import { api } from '../api';

export const useGetDiets = () => {
  return useQuery<ClientResourceResponseDtoReadable[]>({
    queryKey: ['get-user-diets'],
    queryFn: async () => {
      return api.get(`/client-resources/client/diets`);
    },
  });
};
