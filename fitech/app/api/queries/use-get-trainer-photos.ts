import { useQuery } from '@tanstack/react-query';

import { TrainerPhoto } from '@/types/trainer';

import { api } from '../api';

export const useGetTrainerPhotos = (trainerId: number) => {
  return useQuery<TrainerPhoto[]>({
    queryKey: ['get-trainer-photos', trainerId],
    queryFn: async () => {
      return api.get(`/profile/${trainerId}/photos`);
    },
  });
};
