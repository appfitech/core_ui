import { useQuery } from '@tanstack/react-query';

import { NotificationSummaryDto } from '@/types/api/types.gen';

import { api } from '../api';
import { useSessionQueryEnabled } from './use-session-query-enabled';

export const useGetUserNotifications = () => {
  const enabled = useSessionQueryEnabled();

  return useQuery<NotificationSummaryDto>({
    queryKey: ['get-user-notifications'],
    queryFn: async () => {
      const result = await api.get(`/notifications/summary`);
      return result?.data;
    },
    enabled,
    refetchInterval: 60_000,
  });
};
