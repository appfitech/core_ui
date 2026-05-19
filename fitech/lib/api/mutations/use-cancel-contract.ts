import { useMutation, useQueryClient } from '@tanstack/react-query';

import { invalidateContractQueries } from '@/lib/api/mutation-cache';

import { api } from '../api';

export const useCancelContract = () => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, number>({
    mutationFn: async (contractId) => {
      return api.put(`/contracts/${contractId}/cancel`);
    },
    onSuccess: async () => {
      await invalidateContractQueries(queryClient);
    },
  });
};
