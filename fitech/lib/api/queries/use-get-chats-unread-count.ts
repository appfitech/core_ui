import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/lib/api/query-keys';

import { api } from '../api';
import { useSessionQueryEnabled } from './use-session-query-enabled';

type ChatsUnreadCountResponse = {
  data?: {
    unreadCount?: number;
  };
};

export function useGetChatsUnreadCount() {
  const enabled = useSessionQueryEnabled();

  return useQuery<number>({
    queryKey: queryKeys.chats.unreadCount,
    queryFn: async () => {
      const result = (await api.get(
        '/chats/unread-count',
      )) as ChatsUnreadCountResponse;

      return result?.data?.unreadCount ?? 0;
    },
    enabled,
    refetchInterval: 40_000,
  });
}
