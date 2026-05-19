import { useMutation, useQueryClient } from '@tanstack/react-query';

import { invalidateClientResourceQueries } from '@/lib/api/mutation-cache';

import { api } from '../api';

export function useCreateClientResourceWithFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['create-client-resource-with-file'],
    mutationFn: async (formData: FormData) => {
      return api.post('/client-resources/with-file', formData, true);
    },
    onSuccess: async () => {
      await invalidateClientResourceQueries(queryClient);
    },
  });
}
