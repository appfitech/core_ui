import { useMutation } from '@tanstack/react-query';

import { api } from '../../api';

export const useResetMatchList = () => {
  return useMutation<any, Error, number>({
    mutationFn: async () => {
      return api.delete(`/matches/clear-history`);
    },
  });
};
