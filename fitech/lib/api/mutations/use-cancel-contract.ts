import { useMutation, useQueryClient } from '@tanstack/react-query';

import { onContractMutationSuccess } from '@/lib/api/mutation-cache';
import { CancelContractRequestDto } from '@/types/api/types.gen';

import { api } from '../api';

export type CancelContractVariables = {
  contractId: number;
  reason: string;
  fileIds?: number[];
};

export const useCancelContract = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, CancelContractVariables>({
    mutationFn: async ({ contractId, reason, fileIds = [] }) => {
      const body: CancelContractRequestDto = {
        reason: reason.trim(),
        fileIds,
      };
      return api.put(`/contracts/${contractId}/cancel`, body);
    },
    onSuccess: async () => {
      await onContractMutationSuccess(queryClient);
    },
  });
};
