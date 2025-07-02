import { useMutation } from '@tanstack/react-query';

import { LoginResponse, User } from '@/types/user';

import { api } from '../api';

export const useUpdateUser = () => {
  return useMutation<LoginResponse, Error, User>({
    mutationFn: async (request): Promise<LoginResponse> =>
      api.put(`/profile/${request?.id}`, request?.person),
  });
};
