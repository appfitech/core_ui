import { useMutation } from '@tanstack/react-query';

import {
  LoginRequestDto,
  LoginResponseDtoReadable,
  VerifyEmailResponse,
} from '@/types/api/types.gen';

import { api } from '../api';

export const useLogin = () => {
  return useMutation<LoginResponseDtoReadable, Error, LoginRequestDto>({
    mutationFn: async (request): Promise<LoginResponseDtoReadable> =>
      api.post('/auth/login', request),
  });
};

export const useVerifyEmail = () => {
  return useMutation<VerifyEmailResponse, Error, string>({
    mutationFn: async (token): Promise<VerifyEmailResponse> =>
      api.get(`/user/verify-email?token=${encodeURIComponent(token)}`, {
        auth: false,
        retryOn401: false,
      }),
  });
};
