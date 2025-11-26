import { useQuery } from '@tanstack/react-query';

import { api } from '../api';

export const useGetMuscleGroups = () => {
  return useQuery<string[]>({
    queryKey: ['get-muscle-groups'],
    queryFn: async () => {
      return api.get(`/workouts/muscle-groups`);
    },
  });
};
