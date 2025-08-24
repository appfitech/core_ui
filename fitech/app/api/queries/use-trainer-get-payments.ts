import { useQuery } from '@tanstack/react-query';

import { useUserStore } from '@/stores/user';

import { api } from '../api';

export const useTrainerGetPayments = (enabled = true) => {
  const userId = useUserStore((s) => s?.user?.user?.id);

  return useQuery({
    queryKey: ['get-trainer-payments'],
    queryFn: async () => {
      return api.get(`/trainers/${userId}/payments`);
    },
    enabled,
  });
};

export const useTrainerGetPaymentsSummary = (enabled = true) => {
  const userId = useUserStore((s) => s?.user?.user?.id);

  return useQuery({
    queryKey: ['get-trainer-payments-summary'],
    queryFn: async () => {
      return api.get(`/trainers/${userId}/payments/summary`);
    },
    enabled,
  });
};
