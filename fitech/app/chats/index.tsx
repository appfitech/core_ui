import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import { AppText } from '@/app/components/AppText';
import PageContainer from '@/app/components/PageContainer';
import { useTheme } from '@/contexts/ThemeContext';
import { ConversationDto } from '@/types/api/types.gen';
import { FullTheme } from '@/types/theme';

import { useGetChats } from '../api/queries/use-chat-queries';

type ChatListItem = {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
};

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

  if (isSameDay) return `Hoy · ${time}`;
  if (isYesterday) return `Ayer · ${time}`;

  const weekday = date.toLocaleDateString('es-PE', { weekday: 'short' }); // lun, mar, etc.
  const capitalized =
    weekday.length > 0
      ? weekday.charAt(0).toUpperCase() + weekday.slice(1)
      : weekday;

  return `${capitalized} · ${time}`;
}

function mapConversationToChatItem(c: ConversationDto): ChatListItem {
  const nameFromApi =
    c.otherUserName || c.otherUserUsername || 'Usuario Fitech';

  return {
    id: String(c.id ?? ''),
    name: nameFromApi,
    lastMessage: c.lastMessageContent ?? 'Aún no hay mensajes.',
    time: formatConversationTime(c.lastMessageAt ?? c.createdAt),
    unread: c.unreadCount ?? 0,
  };
}

export default function ChatsScreen() {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const router = useRouter();

  const { data, isLoading } = useGetChats();

  const chats: ChatListItem[] = useMemo(() => {
    const conversations = data?.data ?? [];
    return conversations.map(mapConversationToChatItem);
  }, [data]);

  return (
    <PageContainer
      header="Chats"
      subheader="Mantén el contacto con tus gymcrush y gymbros cuando lo necesites."
      style={{ flex: 1, paddingBottom: 0 }}
    >
      {isLoading ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ActivityIndicator color={theme.backgroundInverted} />
          <AppText style={{ marginTop: 8, fontSize: 13, color: theme.dark400 }}>
            Cargando chats...
          </AppText>
        </View>
      ) : !isLoading && !chats.length ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <AppText
            style={{ fontSize: 13, color: theme.dark400, textAlign: 'center' }}
          >
            Aún no tienes conversaciones activas.
          </AppText>
        </View>
      ) : (
        <View style={styles.list}>
          {chats.map((chat) => (
            <TouchableOpacity
              key={chat.id}
              style={styles.chatRow}
              onPress={() =>
                router.push({
                  pathname: '/chats/[id]',
                  params: {
                    id: chat.id,
                    title: chat.name, // lo usamos en el header del detalle
                  },
                })
              }
            >
              <View style={styles.avatar}>
                <AppText style={styles.avatarInitials}>{chat.name[0]}</AppText>
              </View>

              <View style={styles.chatMain}>
                <AppText style={styles.chatName} numberOfLines={1}>
                  {chat.name}
                </AppText>
                <AppText style={styles.chatPreview} numberOfLines={1}>
                  {chat.lastMessage}
                </AppText>
              </View>

              <View style={styles.meta}>
                <AppText style={styles.chatTime}>{chat.time}</AppText>
                {chat.unread > 0 && (
                  <View style={styles.unreadBadge}>
                    <AppText style={styles.unreadText}>{chat.unread}</AppText>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </PageContainer>
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    list: {
      width: '100%',
      marginTop: 8,
      rowGap: 8,
    },
    chatRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 10,
      borderRadius: 14,
      backgroundColor: theme.background,
      shadowColor: theme.backgroundInverted,
      shadowOpacity: 0.04,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 6,
      elevation: 2,
      columnGap: 10,
    },
    avatar: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarInitials: {
      color: theme.dark100,
      fontWeight: '700',
      fontSize: 18,
    },
    chatMain: {
      flex: 1,
      rowGap: 2,
    },
    chatName: {
      fontSize: 15,
      fontWeight: '700',
      color: theme.textPrimary,
    },
    chatPreview: {
      fontSize: 13,
      color: theme.dark400,
    },
    meta: {
      alignItems: 'flex-end',
      rowGap: 6,
      marginLeft: 8,
    },
    chatTime: {
      fontSize: 11,
      color: theme.dark400,
    },
    unreadBadge: {
      minWidth: 20,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 999,
      backgroundColor: theme.backgroundInverted,
      alignItems: 'center',
    },
    unreadText: {
      fontSize: 11,
      fontWeight: '700',
      color: theme.dark100,
    },
  });
