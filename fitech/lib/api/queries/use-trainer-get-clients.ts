import { useQuery } from '@tanstack/react-query';

import { useUserStore } from '@/stores/user';
import { Trainer } from '@/types/trainer';

import { api } from '../api';

type Params = { search?: string };

export const useTrainerGetClients = ({ search }: Params) => {
  const userId = useUserStore((s) => s?.user?.user?.id);

  return useQuery<Trainer>({
    queryKey: ['get-trainer-reviews-stats'],
    queryFn: async () => {
      return api.get(`/trainers/${userId}/clients?search=${search}`);
    },
  });
};
