// src/features/auth/useRefreshToken.ts
import { useMutation } from '@tanstack/react-query';

import { RefreshTokenRequestDto } from '@/types/api/types.gen';

import { api } from '../../api';

export const useRefreshToken = () => {
  return useMutation<{ token: string }, Error, RefreshTokenRequestDto>({
    mutationFn: async (request) => {
      const data = await api.post('/user/refresh-token', request, false, {
        auth: false, // do NOT send Bearer
        retryOn401: false, // do NOT try refreshing this call
      });
      const token: string | undefined =
        data?.token ?? data?.result?.token ?? data?.data?.token;
      if (!token) throw new Error('Unable to refresh token');
      return { token };
    },
  });
};
