import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useMemo } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { type ChatListRowItem } from '@/components/list/ChatListRow';
import { ListEmptyState } from '@/components/list/ListEmptyState';
import { SwipeableChatListRow } from '@/components/list/SwipeableChatListRow';
import PageContainer from '@/components/PageContainer';
import { PullToRefreshControl } from '@/components/PullToRefreshControl';
import { withRefreshFeedback } from '@/components/RefreshFeedbackBar';
import { LIST_SCREEN_FLATLIST } from '@/constants/list-screens';
import { TRANSLATIONS } from '@/constants/strings';
import { textStyles } from '@/constants/styles';
import { useAlert } from '@/contexts/AlertContext';
import { useTheme } from '@/contexts/ThemeContext';
import { usePullToRefresh } from '@/hooks/use-pull-to-refresh';
import { useDeleteChat } from '@/lib/api/mutations/use-delete-chat';
import { useGetChats } from '@/lib/api/queries/use-chat-queries';
import { useUserStore } from '@/stores/user';
import { ConversationDto } from '@/types/api/types.gen';
import { AppTheme } from '@/types/theme';
import { formatConversationTimeLocal } from '@/utils/dates';
import { getFileUploadViewUrl } from '@/utils/files';

function getChatAvatarUri(c: ConversationDto): string | undefined {
  const raw = c.otherUserProfileImageUrl?.trim();
  if (!raw) return undefined;
  if (raw.startsWith('http')) return raw;
  if (raw.startsWith('/')) return `https://appfitech.com${raw}`;
  return getFileUploadViewUrl(raw);
}

function mapConversationToChatItem(c: ConversationDto): ChatListRowItem {
  const preview = c.lastMessageContent?.trim();

  return {
    id: String(c.id ?? ''),
    name:
      c.otherUserName ||
      c.otherUserUsername ||
      TRANSLATIONS.common.defaultUserName,
    lastMessage: preview || TRANSLATIONS.common.noMessagesYet,
    time: formatConversationTimeLocal(
      c.lastMessageAt ?? c.createdAt,
      TRANSLATIONS.common.yesterday,
    ),
    unread: Math.max(0, c.unreadCount ?? 0),
    matchType: c.matchType,
    avatarUri: getChatAvatarUri(c),
  };
}

function getDeleteChatAlertMessage(name: string): string {
  const template = TRANSLATIONS.chatsScreen.deleteMessage;
  if (!template) {
    return `Se eliminará el chat con ${name}. Esta acción no se puede deshacer.`;
  }
  return template.replace('{name}', name);
}

export default function ChatsScreen() {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const router = useRouter();
  const { showAlert } = useAlert();
  const isTrainer = useUserStore((s) => s.getIsTrainer());
  const { chatsScreen: copy, common } = TRANSLATIONS;

  const { data, isLoading, refetch } = useGetChats();
  const { refreshing, onRefresh } = usePullToRefresh(refetch);
  const { mutate: deleteChat } = useDeleteChat();

  useFocusEffect(
    useCallback(() => {
      void refetch();
    }, [refetch]),
  );

  const chats = useMemo(
    () => (data?.data ?? []).map(mapConversationToChatItem),
    [data],
  );

  const handleDeleteChat = useCallback(
    (item: ChatListRowItem) => {
      const conversationId = Number(item.id);
      if (!conversationId) return;

      showAlert({
        title: copy.deleteTitle ?? '¿Eliminar conversación?',
        message: getDeleteChatAlertMessage(item.name),
        buttons: [
          { text: common.cancel, style: 'cancel' },
          {
            text: common.delete,
            style: 'destructive',
            onPress: () => {
              deleteChat(conversationId, {
                onError: () => {
                  showAlert({
                    title: common.errorTitle,
                    message:
                      copy.deleteError ??
                      'No se pudo eliminar la conversación.',
                  });
                },
              });
            },
          },
        ],
      });
    },
    [common, copy, deleteChat, showAlert],
  );

  const renderItem = useCallback(
    ({ item }: { item: ChatListRowItem }) => (
      <SwipeableChatListRow
        chat={item}
        isTrainer={isTrainer}
        onPress={() =>
          router.push({
            pathname: '/chats/[id]',
            params: { id: item.id, title: item.name },
          })
        }
        onDelete={() => handleDeleteChat(item)}
      />
    ),
    [handleDeleteChat, isTrainer, router],
  );

  return (
    <PageContainer
      title={copy.title}
      subheader={copy.subheader}
      disableScroll
      style={styles.pageStyle}
    >
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={withRefreshFeedback(refreshing)}
        ListEmptyComponent={
          isLoading ? (
            <View style={styles.loadingWrap}>
              <ActivityIndicator color={theme.brand.primary} />
              <AppText style={styles.loadingText}>{copy.loading}</AppText>
            </View>
          ) : (
            <ListEmptyState title={copy.emptyTitle} />
          )
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        initialNumToRender={LIST_SCREEN_FLATLIST.initialNumToRender}
        maxToRenderPerBatch={LIST_SCREEN_FLATLIST.maxToRenderPerBatch}
        windowSize={LIST_SCREEN_FLATLIST.windowSize}
        removeClippedSubviews={LIST_SCREEN_FLATLIST.removeClippedSubviews}
        refreshControl={
          <PullToRefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </PageContainer>
  );
}

const getStyles = (theme: AppTheme) => {
  const text = textStyles(theme);
  return StyleSheet.create({
    pageStyle: { paddingBottom: 0 },
    listContent: {
      paddingBottom: 180,
      flexGrow: 1,
    },
    loadingWrap: {
      paddingVertical: 48,
      alignItems: 'center',
      rowGap: 8,
    },
    loadingText: {
      ...text.nav,
      color: theme.text.secondary,
    },
  });
};
