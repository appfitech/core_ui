import { useMutation } from '@tanstack/react-query';

import { RegisterPushTokenRequest } from '@/types/api/types.gen';

import { api } from '../../api';

export const useSavePushToken = () => {
  return useMutation<boolean, Error, RegisterPushTokenRequest>({
    mutationFn: async (request) => {
      const data = await api.post('/user/register-push-token', request);

      return true;
    },
  });
};
