import { useMutation } from '@tanstack/react-query';

import { UserDtoReadable, UserDtoWritable } from '@/src/types/api/types.gen';

import { api } from '../api';

export const useCreateUser = () => {
  return useMutation<UserDtoReadable, Error, UserDtoWritable>({
    mutationFn: async (request): Promise<UserDtoReadable> =>
      api.post('/user', request),
  });
};
