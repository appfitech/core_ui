import { useMutation, useQueryClient } from '@tanstack/react-query';

import { onContractMutationSuccess } from '@/lib/api/mutation-cache';

import { api } from '../api';

export const useCompleteContract = () => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, number>({
    mutationFn: async (contractId) => {
      return api.put(`/contracts/${contractId}/complete`);
    },
    onSuccess: async () => {
      await onContractMutationSuccess(queryClient);
    },
  });
};
