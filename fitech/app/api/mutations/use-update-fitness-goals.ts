import { useMutation } from '@tanstack/react-query';

import { useUserStore } from '@/app/stores/user';
import { LoginResponse } from '@/app/types/user';

import { api } from '../api';

export const useUpdateFitnessGoals = () => {
  const userId = useUserStore((s) => s?.user?.user?.id);

  return useMutation<LoginResponse, Error, any>({
    mutationFn: async (request): Promise<LoginResponse> =>
      api.put(`/profile/${userId}/fitness-goals`, request),
  });
};
