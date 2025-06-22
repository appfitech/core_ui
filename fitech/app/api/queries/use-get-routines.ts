import { useQuery } from '@tanstack/react-query';

import { RoutineResource } from '@/app/types/resources';

import { api } from '../api';

export const useGetRoutines = () => {
  return useQuery<RoutineResource[]>({
    queryKey: ['get-user-diets'],
    queryFn: async () => {
      return api.get(`/client-resources/client/routines`);
    },
  });
};
