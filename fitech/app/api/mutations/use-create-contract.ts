import { useMutation } from '@tanstack/react-query';

import {
  CreateContractRequest,
  CreateContractResponse,
} from '@/types/contracts';

import { api } from '../api';

export const useCreateContract = () => {
  return useMutation<CreateContractResponse, Error, CreateContractRequest>({
    mutationFn: async (request) => {
      return api.post('/contracts', request);
    },
  });
};
