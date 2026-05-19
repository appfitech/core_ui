import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  invalidateProfileQueries,
  syncUserFromMutation,
} from '@/lib/api/mutation-cache';
import { useUserStore } from '@/stores/user';
import { LoginResponse } from '@/types/user';

import { api } from '../api';

export const useDeletePhoto = () => {
  const queryClient = useQueryClient();
  const userId = useUserStore((s) => s?.user?.user?.id);

  return useMutation<LoginResponse, Error, number>({
    mutationFn: async (photoId: number): Promise<LoginResponse> =>
      api.delete(`/profile/${userId}/photos/${photoId}`),
    onSuccess: async (data) => {
      await syncUserFromMutation(data);
      await invalidateProfileQueries(queryClient);
    },
  });
};
