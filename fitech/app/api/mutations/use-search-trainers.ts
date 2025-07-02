import { useMutation } from '@tanstack/react-query';

import { Trainer } from '@/types/trainer';

import { api } from '../api';

type SearchRequest = {
  query: string;
};

export const useSearchTrainers = () => {
  return useMutation<Trainer[], Error, SearchRequest>({
    mutationFn: async (request): Promise<Trainer[]> => {
      return await api.post('/trainers/search', request);
    },
  });
};
