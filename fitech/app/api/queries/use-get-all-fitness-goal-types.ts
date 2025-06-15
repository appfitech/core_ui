import { useQuery } from '@tanstack/react-query';

import { FitnessGoal } from '@/app/types/fitness-goals';

import { api } from '../api';

export const useGetAllFitnessGoalTypes = () => {
  return useQuery<FitnessGoal[]>({
    queryKey: ['get-all-fitness-goals'],
    queryFn: async () => {
      return api.get('/fitness-goal-type/all');
    },
  });
};
