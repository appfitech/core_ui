import { useMutation } from '@tanstack/react-query';

import { ContractAvailabilityResponse } from '@/types/trainer';

import { api } from '../api';

export const useCheckContractAvailability = () => {
  return useMutation<
    ContractAvailabilityResponse,
    Error,
    { clientId: number; serviceId: number }
  >({
    mutationFn: async ({ clientId, serviceId }) => {
      return api.get(
        `/contracts/check-availability?clientId=${clientId}&serviceId=${serviceId}`,
      );
    },
  });
};
