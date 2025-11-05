import { useQuery } from '@tanstack/react-query';

import { useUserStore } from '@/stores/user';
import { NotificationSummaryDto } from '@/types/api/types.gen';

import { api } from '../api';

export const useGetUserNotifications = () => {
  const token = useUserStore((s) => s.getToken());

  return useQuery<NotificationSummaryDto>({
    queryKey: ['get-user-notifications'],
    queryFn: async () => {
      const result = await api.get(`/notifications/summary`);
      return result?.data;
    },
    enabled: !!token,
    refetchInterval: 60_000,
  });
};
