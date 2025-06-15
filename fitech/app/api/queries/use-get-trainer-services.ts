import { useQuery } from '@tanstack/react-query';

import { TrainerService } from '@/app/types/trainer';

import { api } from '../api';

export const useGetTrainerServices = (trainerId: number) => {
  return useQuery<TrainerService[]>({
    queryKey: ['get-trainer-services', trainerId],
    queryFn: async () => {
      return api.get(`/trainer-services/trainer/${trainerId}/active`);
    },
  });
};
