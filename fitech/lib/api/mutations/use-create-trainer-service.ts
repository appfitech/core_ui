import { useMutation, useQueryClient } from '@tanstack/react-query';

import { invalidateTrainerServiceQueries } from '@/lib/api/mutation-cache';
import {
  CreateTrainerServiceDto,
  TrainerServiceDtoReadable,
} from '@/types/api/types.gen';

import { api } from '../api';

type CreateTrainerServiceRequest = CreateTrainerServiceDto & {
  trainerId: number;
};

export const useCreateTrainerService = () => {
  const queryClient = useQueryClient();

  return useMutation<
    TrainerServiceDtoReadable,
    Error,
    CreateTrainerServiceRequest
  >({
    mutationFn: async ({ trainerId, ...body }) => {
      return api.post(`/trainer-services/${trainerId}`, body);
    },
    onSuccess: async () => {
      await invalidateTrainerServiceQueries(queryClient);
    },
  });
};
