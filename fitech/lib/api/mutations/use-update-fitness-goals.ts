import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  invalidateProfileQueries,
  syncUserFromMutation,
} from '@/lib/api/mutation-cache';
import { useUserStore } from '@/stores/user';
import { LoginResponse } from '@/types/user';

import { api } from '../api';

export const useUpdateFitnessGoals = () => {
  const queryClient = useQueryClient();
  const userId = useUserStore((s) => s?.user?.user?.id);

  return useMutation<LoginResponse, Error, any>({
    mutationFn: async (request): Promise<LoginResponse> =>
      api.put(`/profile/${userId}/fitness-goals`, request),
    onSuccess: async (data) => {
      await syncUserFromMutation(data);
      await invalidateProfileQueries(queryClient);
    },
  });
};
