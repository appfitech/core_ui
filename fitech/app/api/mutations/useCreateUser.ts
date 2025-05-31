import { useMutation } from '@tanstack/react-query';

import { CreateUserRequest, LoginResponse } from '@/app/types/user';

import { api } from '../api';

export const useCreateUser = () => {
  return useMutation<LoginResponse, Error, CreateUserRequest>({
    mutationFn: async (request): Promise<LoginResponse> =>
      api.post('/user', request),
  });
};
