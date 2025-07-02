import { useMutation } from '@tanstack/react-query';

import { useUserStore } from '@/stores/user';
import { SetProfilePhotoRequest } from '@/types/photos';
import { LoginResponse } from '@/types/user';

import { api } from '../api';

export const useSetProfilePhoto = () => {
  const userId = useUserStore((s) => s?.user?.user?.id);

  return useMutation<LoginResponse, Error, SetProfilePhotoRequest>({
    mutationFn: async (request): Promise<LoginResponse> =>
      api.put(`/profile/${userId}/profile-photo`, request),
  });
};
