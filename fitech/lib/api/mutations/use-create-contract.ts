import { useMutation, useQueryClient } from '@tanstack/react-query';

import { invalidateContractQueries } from '@/lib/api/mutation-cache';
import {
  CreateContractRequest,
  CreateContractResponse,
} from '@/types/contracts';

import { api } from '../api';

export const useCreateContract = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateContractResponse, Error, CreateContractRequest>({
    mutationFn: async (request) => {
      return api.post('/contracts', request);
    },
    onSuccess: async () => {
      await invalidateContractQueries(queryClient);
    },
  });
};
