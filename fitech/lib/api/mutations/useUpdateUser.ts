import { useMutation } from '@tanstack/react-query';

import { UserResponseDtoReadable } from '@/types/api/types.gen';
import { LoginResponse } from '@/types/user';

import { api } from '../api';

export const useUpdateUser = () => {
  return useMutation<LoginResponse, Error, UserResponseDtoReadable>({
    mutationFn: async (request): Promise<LoginResponse> =>
      api.put(`/profile/${request?.id}`, request?.person),
  });
};
