import { useQuery } from '@tanstack/react-query';

import { DietResource } from '@/app/types/resources';

import { api } from '../api';

export const useGetDiets = () => {
  return useQuery<DietResource[]>({
    queryKey: ['get-user-diets'],
    queryFn: async () => {
      return api.get(`/client-resources/client/diets`);
    },
  });
};
