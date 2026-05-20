import { useMutation, useQueryClient } from '@tanstack/react-query';

import { clearAppQueryCache } from '@/lib/api/mutation-cache';
import {
  DeleteAccountResponse,
  LoginRequestDto,
  LoginResponseDtoReadable,
  VerifyEmailResponse,
} from '@/types/api/types.gen';
import {
  ChangePasswordRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from '@/types/auth-api';

import { api } from '../api';

type MessageResponse = Record<string, unknown>;

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

export const useForgotPassword = () => {
  return useMutation<MessageResponse, Error, string>({
    mutationFn: async (email): Promise<MessageResponse> =>
      api.post(
        '/user/forgot-password',
        { email } satisfies ForgotPasswordRequest,
        false,
        { auth: false, retryOn401: false },
      ),
  });
};

export const useResetPassword = () => {
  return useMutation<MessageResponse, Error, ResetPasswordRequest>({
    mutationFn: async (request): Promise<MessageResponse> =>
      api.post('/user/reset-password', request, false, {
        auth: false,
        retryOn401: false,
      }),
  });
};

export const useChangePassword = () => {
  return useMutation<MessageResponse, Error, ChangePasswordRequest>({
    mutationFn: async (request): Promise<MessageResponse> =>
      api.post('/user/change-password', request),
  });
};

export const useDeleteAccount = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteAccountResponse, Error, void>({
    mutationFn: async (): Promise<DeleteAccountResponse> =>
      api.delete('/user/delete-account'),
    onSuccess: () => {
      clearAppQueryCache(queryClient);
    },
  });
};
