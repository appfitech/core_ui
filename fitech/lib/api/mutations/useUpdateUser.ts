import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  invalidateProfileQueries,
  syncUserFromMutation,
} from '@/lib/api/mutation-cache';
import { UserResponseDtoReadable } from '@/types/api/types.gen';
import { LoginResponse } from '@/types/user';

import { api } from '../api';

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation<LoginResponse, Error, UserResponseDtoReadable>({
    mutationFn: async (request): Promise<LoginResponse> =>
      api.put(`/profile/${request?.id}`, request?.person),
    onSuccess: async (data) => {
      await syncUserFromMutation(data);
      await invalidateProfileQueries(queryClient);
    },
  });
};
