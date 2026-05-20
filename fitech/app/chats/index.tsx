import { useRouter } from 'expo-router';
import React, { useCallback, useMemo } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import {
  ChatListRow,
  type ChatListRowItem,
} from '@/components/list/ChatListRow';
import { ListEmptyState } from '@/components/list/ListEmptyState';
import PageContainer from '@/components/PageContainer';
import { LIST_SCREEN_FLATLIST } from '@/constants/list-screens';
import { textStyles } from '@/constants/styles';
import { useTheme } from '@/contexts/ThemeContext';
import { useGetChats } from '@/lib/api/queries/use-chat-queries';
import { useUserStore } from '@/stores/user';
import { ConversationDto } from '@/types/api/types.gen';
import { FullTheme } from '@/types/theme';
import { getFileUploadViewUrl } from '@/utils/files';

function formatConversationTime(iso: string | undefined) {
  if (!iso) return '';
  const date = new Date(iso);
  const now = new Date();

  const isSameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  const isYesterday =
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate();

  const time = date.toLocaleTimeString('es-PE', {
    hour: 'numeric',
    minute: '2-digit',
  });

  if (isSameDay) return time;
  if (isYesterday) return 'Ayer';

  const weekday = date.toLocaleDateString('es-PE', { weekday: 'short' });
  return weekday.length > 0
    ? weekday.charAt(0).toUpperCase() + weekday.slice(1)
    : weekday;
}

function getChatAvatarUri(c: ConversationDto): string | undefined {
  const raw = c.otherUserProfileImageUrl?.trim();
  if (!raw) return undefined;
  if (raw.startsWith('http')) return raw;
  if (raw.startsWith('/')) return `https://appfitech.com${raw}`;
  return getFileUploadViewUrl(raw);
}

function mapConversationToChatItem(c: ConversationDto): ChatListRowItem {
  return {
    id: String(c.id ?? ''),
    name: c.otherUserName || c.otherUserUsername || 'Usuario Fitech',
    lastMessage: c.lastMessageContent ?? 'Aún no hay mensajes.',
    time: formatConversationTime(c.lastMessageAt ?? c.createdAt),
    unread: c.unreadCount ?? 0,
    matchType: c.matchType,
    avatarUri: getChatAvatarUri(c),
  };
}

export default function ChatsScreen() {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const router = useRouter();
  const isTrainer = useUserStore((s) => s.getIsTrainer());

  const { data, isLoading } = useGetChats();

  const chats = useMemo(
    () => (data?.data ?? []).map(mapConversationToChatItem),
    [data],
  );

  const renderItem = useCallback(
    ({ item }: { item: ChatListRowItem }) => (
      <ChatListRow
        chat={item}
        isTrainer={isTrainer}
        onPress={() =>
          router.push({
            pathname: '/chats/[id]',
            params: { id: item.id, title: item.name },
          })
        }
      />
    ),
    [isTrainer, router],
  );

  return (
    <PageContainer
      title="Chats"
      subheader="Mantén el contacto con tus gymcrush y gymbros cuando lo necesites"
      disableScroll
      style={styles.pageStyle}
    >
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          isLoading ? (
            <View style={styles.loadingWrap}>
              <ActivityIndicator color={theme.brand.primary} />
              <AppText style={styles.loadingText}>Cargando chats…</AppText>
            </View>
          ) : (
            <ListEmptyState title="Aún no tienes conversaciones activas" />
          )
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        initialNumToRender={LIST_SCREEN_FLATLIST.initialNumToRender}
        maxToRenderPerBatch={LIST_SCREEN_FLATLIST.maxToRenderPerBatch}
        windowSize={LIST_SCREEN_FLATLIST.windowSize}
        removeClippedSubviews={LIST_SCREEN_FLATLIST.removeClippedSubviews}
      />
    </PageContainer>
  );
}

const getStyles = (theme: FullTheme) => {
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
