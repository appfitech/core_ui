import { useQuery } from '@tanstack/react-query';

import { Trainer } from '@/types/trainer';

import { api } from '../api';

export const useGetTrainer = (id: number) => {
  return useQuery<Trainer>({
    queryKey: ['get-trainer', id],
    queryFn: async () => {
      return api.get(`/trainers/${id}`);
    },
  });
};
