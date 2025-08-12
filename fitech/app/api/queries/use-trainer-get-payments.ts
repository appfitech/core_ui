import { useQuery } from '@tanstack/react-query';

import { useUserStore } from '@/stores/user';

import { api } from '../api';

export const useTrainerGetPayments = () => {
  const userId = useUserStore((s) => s?.user?.user?.id);

  return useQuery({
    queryKey: ['get-trainer-payments'],
    queryFn: async () => {
      return api.get(`/trainers/${userId}/payments`);
    },
  });
};

export const useTrainerGetPaymentsSummary = () => {
  const userId = useUserStore((s) => s?.user?.user?.id);

  return useQuery({
    queryKey: ['get-trainer-payments-summary'],
    queryFn: async () => {
      return api.get(`/trainers/${userId}/payments/summary`);
    },
  });
};
