import { useMutation } from '@tanstack/react-query';

import { useUserStore } from '@/stores/user';
import { LoginResponse } from '@/types/user';

import { api } from '../api';

export const useDeletePhoto = () => {
  const userId = useUserStore((s) => s?.user?.user?.id);

  return useMutation<LoginResponse, Error, number>({
    mutationFn: async (photoId: number): Promise<LoginResponse> =>
      api.delete(`/profile/${userId}/photos/${photoId}`),
  });
};
