import { useQuery } from '@tanstack/react-query';

import { MembershipPayment } from '@/types/api/types.gen';

import { api } from '../api';

export const useGetUserPayments = () => {
  return useQuery<any, Error, MembershipPayment[]>({
    queryKey: ['/memberships/payment-history'],
    queryFn: async () => {
      return api.get(`/memberships/payment-history`);
    },
  });
};
