import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  invalidateProfileQueries,
  refreshCurrentUserSession,
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
    onSuccess: async (data, deletedPhotoId) => {
      const profilePhotoId =
        useUserStore.getState().user?.user?.person?.profilePhotoId;

      if (profilePhotoId != null && profilePhotoId === deletedPhotoId) {
        await useUserStore.getState().clearProfilePhotoId();
      }

      await syncUserFromMutation(data);
      await invalidateProfileQueries(queryClient);
      await refreshCurrentUserSession();
    },
  });
};
