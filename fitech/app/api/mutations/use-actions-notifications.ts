import { useMutation } from '@tanstack/react-query';

import { api } from '../api';

export const useMarkAllNotificationsRead = () => {
  return useMutation<unknown, Error>({
    mutationFn: async () => {
      return api.put(`/notifications/read-all`);
    },
  });
};

export const useMarkNotificationRead = () => {
  return useMutation<unknown, Error, number>({
    mutationFn: async (notificationId: number) => {
      return api.put(`/notifications/${notificationId}/read`);
    },
  });
};
