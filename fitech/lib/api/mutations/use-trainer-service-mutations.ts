import {
  type QueryClient,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { invalidateTrainerServiceQueries } from '@/lib/api/mutation-cache';
import {
  CreateTrainerServiceDto,
  TrainerServiceDtoReadable,
} from '@/types/api/types.gen';

import { api } from '../api';

type TrainerServiceActionParams = {
  serviceId: number;
  trainerId: number;
};

type UpdateTrainerServiceRequest = CreateTrainerServiceDto &
  TrainerServiceActionParams;

async function onTrainerServiceMutationSuccess(queryClient: QueryClient) {
  await invalidateTrainerServiceQueries(queryClient);
}

export const useUpdateTrainerService = () => {
  const queryClient = useQueryClient();

  return useMutation<
    TrainerServiceDtoReadable,
    Error,
    UpdateTrainerServiceRequest
  >({
    mutationFn: async ({ serviceId, trainerId, ...body }) => {
      return api.put(
        `/trainer-services/${serviceId}/trainer/${trainerId}`,
        body,
      );
    },
    onSuccess: async () => {
      await onTrainerServiceMutationSuccess(queryClient);
    },
  });
};

export const useDeactivateTrainerService = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, TrainerServiceActionParams>({
    mutationFn: async ({ serviceId, trainerId }) => {
      return api.patch(
        `/trainer-services/${serviceId}/trainer/${trainerId}/deactivate`,
      );
    },
    onSuccess: async () => {
      await onTrainerServiceMutationSuccess(queryClient);
    },
  });
};

export const useActivateTrainerService = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, TrainerServiceActionParams>({
    mutationFn: async ({ serviceId, trainerId }) => {
      return api.patch(
        `/trainer-services/${serviceId}/trainer/${trainerId}/activate`,
      );
    },
    onSuccess: async () => {
      await onTrainerServiceMutationSuccess(queryClient);
    },
  });
};

export const useDeleteTrainerService = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, TrainerServiceActionParams>({
    mutationFn: async ({ serviceId, trainerId }) => {
      return api.delete(`/trainer-services/${serviceId}/trainer/${trainerId}`);
    },
    onSuccess: async () => {
      await onTrainerServiceMutationSuccess(queryClient);
    },
  });
};
