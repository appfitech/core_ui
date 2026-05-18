import { useMutation } from '@tanstack/react-query';

import { api } from '../api';

export const useCompleteContract = () => {
  return useMutation<any, Error, number>({
    mutationFn: async (contractId) => {
      return api.put(`/contracts/${contractId}/complete`);
    },
  });
};
