import { useMutation } from '@tanstack/react-query';

import { useUserStore } from '@/stores/user';
import { LoginResponse } from '@/types/user';

import { api } from '../api';

export const useUploadPhoto = () => {
  const userId = useUserStore((s) => s?.user?.user?.id);

  return useMutation<LoginResponse, Error, FormData>({
    mutationFn: async (formData): Promise<LoginResponse> =>
      api.post(`/profile/${userId}/photos`, formData, true),
  });
};
