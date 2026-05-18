import { useMutation } from '@tanstack/react-query';

import { refreshAccessToken } from '@/services/auth-session';
import { useUserStore } from '@/stores/user';
import { RefreshTokenRequestDto } from '@/types/api/types.gen';

export const useRefreshToken = () => {
  return useMutation<{ token: string }, Error, RefreshTokenRequestDto>({
    mutationFn: async () => {
      const result = await refreshAccessToken();
      const token = useUserStore.getState().getToken();

      if (result === 'logged_out' || !token) {
        throw new Error('Unable to refresh token');
      }

      return { token };
    },
  });
};
