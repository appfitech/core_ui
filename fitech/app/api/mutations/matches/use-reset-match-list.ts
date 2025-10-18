import { useMutation } from '@tanstack/react-query';

import { api } from '../../api';

export const useResetMatchList = () => {
  return useMutation({
    mutationFn: async () => {
      return api.post(`/matches/clear-history`, {});
    },
  });
};
