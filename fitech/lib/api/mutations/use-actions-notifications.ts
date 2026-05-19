import { useMutation, useQueryClient } from '@tanstack/react-query';

import { invalidateNotificationQueries } from '@/lib/api/mutation-cache';

import { api } from '../api';

export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error>({
    mutationFn: async () => {
      return api.put(`/notifications/read-all`);
    },
    onSuccess: async () => {
      await invalidateNotificationQueries(queryClient);
    },
  });
};

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, number>({
    mutationFn: async (notificationId: number) => {
      return api.put(`/notifications/${notificationId}/read`);
    },
    onSuccess: async () => {
      await invalidateNotificationQueries(queryClient);
    },
  });
};
