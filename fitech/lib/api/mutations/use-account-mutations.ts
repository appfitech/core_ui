import { useMutation, useQueryClient } from '@tanstack/react-query';

import { clearAppQueryCache } from '@/lib/api/mutation-cache';
import {
  LoginRequestDto,
  LoginResponseDtoReadable,
  VerifyEmailResponse,
} from '@/types/api/types.gen';

import { api } from '../api';

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation<LoginResponseDtoReadable, Error, LoginRequestDto>({
    mutationFn: async (request): Promise<LoginResponseDtoReadable> =>
      api.post('/auth/login', request),
    onSuccess: () => {
      clearAppQueryCache(queryClient);
    },
  });
};

export const useVerifyEmail = () => {
  const queryClient = useQueryClient();

  return useMutation<VerifyEmailResponse, Error, string>({
    mutationFn: async (token): Promise<VerifyEmailResponse> =>
      api.get(`/user/verify-email?token=${encodeURIComponent(token)}`, {
        auth: false,
        retryOn401: false,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries();
    },
  });
};
