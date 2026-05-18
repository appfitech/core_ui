import { useQuery } from '@tanstack/react-query';

import { UserSubscriptionResponse } from '@/types/api/types.gen';

import { api } from '../api';

export const useGetUserSubscription = () => {
  return useQuery<any, Error, UserSubscriptionResponse>({
    queryKey: ['/memberships/user-subscription'],
    queryFn: async () => {
      return api.get(`/memberships/user-subscription`);
    },
  });
};
