import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/lib/api/query-keys';
import {
  ChatResponseDtoConversationDto,
  ChatResponseDtoListConversationDto,
  ChatResponseDtoListMessageDto,
} from '@/types/api/types.gen';

import { api } from '../api';
import { useSessionQueryEnabled } from './use-session-query-enabled';

export const useGetChats = () => {
  const enabled = useSessionQueryEnabled();

  return useQuery<ChatResponseDtoListConversationDto>({
    queryKey: queryKeys.chats.all,
    queryFn: async () => {
      return api.get(`/chats`);
    },
    enabled,
    staleTime: 0,
  });
};

export const useGetChat = (conversationId: string) => {
  const enabled = useSessionQueryEnabled(!!conversationId);

  return useQuery<ChatResponseDtoConversationDto>({
    queryKey: queryKeys.chats.detail(conversationId),
    queryFn: async () => {
      return api.get(`/chats/${conversationId}`);
    },
    enabled,
  });
};

export const useGetChatMessages = (conversationId: string) => {
  const enabled = useSessionQueryEnabled(!!conversationId);

  return useQuery<ChatResponseDtoListMessageDto>({
    queryKey: queryKeys.chats.messages(conversationId),
    queryFn: async () => {
      return api.get(`/chats/${conversationId}/messages`);
    },
    enabled,
  });
};
