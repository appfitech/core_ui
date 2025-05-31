import { useMutation } from '@tanstack/react-query';

import { LoginRequest, LoginResponse } from '@/app/types/user';

import { api } from '../api';

export const useLogin = () => {
  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: async (request): Promise<LoginResponse> =>
      api.post('/auth/login', request),
  });
};
