import { useQuery } from '@tanstack/react-query';

import { useUserStore } from '@/stores/user';
import {
  ChatResponseDtoConversationDto,
  ChatResponseDtoListConversationDto,
  ChatResponseDtoListMessageDto,
} from '@/types/api/types.gen';

import { api } from '../api';

export const useGetChats = () => {
  const token = useUserStore((s) => s.getToken());

  return useQuery<ChatResponseDtoListConversationDto>({
    queryKey: ['/chats'],
    queryFn: async () => {
      return api.get(`/chats`);
    },
    enabled: !!token,
  });
};

export const useGetChat = (conversationId: string) => {
  const token = useUserStore((s) => s.getToken());

  return useQuery<ChatResponseDtoConversationDto>({
    queryKey: [`/chats/${conversationId}`],
    queryFn: async () => {
      return api.get(`/chats/${conversationId}`);
    },
    enabled: !!token,
  });
};

export const useGetChatMessages = (conversationId: string) => {
  const token = useUserStore((s) => s.getToken());

  return useQuery<ChatResponseDtoListMessageDto>({
    queryKey: [`/chats/${conversationId}/messages`],
    queryFn: async () => {
      return api.get(`/chats/${conversationId}/messages`);
    },
    enabled: !!token,
  });
};
