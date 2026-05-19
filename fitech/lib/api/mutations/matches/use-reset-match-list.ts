import { useMutation, useQueryClient } from '@tanstack/react-query';

import { invalidateMatchQueries } from '@/lib/api/mutation-cache';

import { api } from '../../api';

export const useResetMatchList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return api.get(`/matches/clear-history`);
    },
    onSuccess: async () => {
      await invalidateMatchQueries(queryClient);
    },
  });
};
