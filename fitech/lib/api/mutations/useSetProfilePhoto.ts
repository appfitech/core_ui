import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  invalidateProfileQueries,
  syncUserFromMutation,
} from '@/lib/api/mutation-cache';
import { useUserStore } from '@/stores/user';
import { SetProfilePhotoRequest } from '@/types/photos';
import { LoginResponse } from '@/types/user';

import { api } from '../api';

export const useSetProfilePhoto = () => {
  const queryClient = useQueryClient();
  const userId = useUserStore((s) => s?.user?.user?.id);

  return useMutation<LoginResponse, Error, SetProfilePhotoRequest>({
    mutationFn: async (request): Promise<LoginResponse> =>
      api.put(`/profile/${userId}/profile-photo`, request),
    onSuccess: async (data, variables) => {
      await syncUserFromMutation(data);
      if (variables.photoId != null) {
        await useUserStore.getState().updateProfilePhotoId(variables.photoId);
      }
      await invalidateProfileQueries(queryClient);
    },
  });
};
