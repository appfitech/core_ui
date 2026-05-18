import { useMutation } from '@tanstack/react-query';

import { api } from '../api';

export const useCancelContract = () => {
  return useMutation<any, Error, number>({
    mutationFn: async (contractId) => {
      return api.put(`/contracts/${contractId}/cancel`);
    },
  });
};
