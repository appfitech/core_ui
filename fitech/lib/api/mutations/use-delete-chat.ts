import { useMutation, useQueryClient } from '@tanstack/react-query';

import { invalidateChatQueries } from '@/lib/api/mutation-cache';
import { queryKeys } from '@/lib/api/query-keys';
import { ChatResponseDtoListConversationDto } from '@/types/api/types.gen';

import { api } from '../api';

type DeleteChatContext = {
  previousChats?: ChatResponseDtoListConversationDto;
};

export const useDeleteChat = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, number, DeleteChatContext>({
    mutationFn: async (conversationId: number) => {
      return api.delete(`/chats/${conversationId}`);
    },
    onMutate: async (conversationId) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.chats.all });

      const previousChats =
        queryClient.getQueryData<ChatResponseDtoListConversationDto>(
          queryKeys.chats.all,
        );

      queryClient.setQueryData<ChatResponseDtoListConversationDto>(
        queryKeys.chats.all,
        (current) => {
          if (!current?.data) return current;

          return {
            ...current,
            data: current.data.filter((conversation) => {
              return conversation.id !== conversationId;
            }),
          };
        },
      );

      return { previousChats };
    },
    onError: (_error, _conversationId, context) => {
      if (context?.previousChats) {
        queryClient.setQueryData(queryKeys.chats.all, context.previousChats);
      }
    },
    onSuccess: async (_, conversationId) => {
      await invalidateChatQueries(queryClient, conversationId);
    },
    onSettled: async () => {
      await queryClient.refetchQueries({ queryKey: queryKeys.chats.all });
    },
  });
};
