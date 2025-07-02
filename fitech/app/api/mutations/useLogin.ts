import { useMutation } from '@tanstack/react-query';

import {
  LoginRequestDto,
  LoginResponseDtoReadable,
} from '@/types/api/types.gen';

import { api } from '../api';

export const useLogin = () => {
  return useMutation<LoginResponseDtoReadable, Error, LoginRequestDto>({
    mutationFn: async (request): Promise<LoginResponseDtoReadable> =>
      api.post('/auth/login', request),
  });
};
