import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import { AppText } from '@/components/AppText';
import { textStyles } from '@/constants/styles';
import PageContainer from '@/components/PageContainer';
import { useTheme } from '@/contexts/ThemeContext';
import { useGetChats } from '@/lib/api/queries/use-chat-queries';
import { useUserStore } from '@/stores/user';
import { ConversationDto } from '@/types/api/types.gen';
import { FullTheme } from '@/types/theme';

const CONTRACT_LOGO = require('../../assets/images/logos/rounded_logo.webp');

/** Avatar: CONTRACT logo (only for non-trainer), or profile image with fallback to first letter. Trainers see initial instead of logo. */
function ChatListAvatar({
  matchType,
  avatarUri,
  name,
  isTrainer,
  styles,
}: {
  matchType?: string;
  avatarUri: string | null;
  name: string;
  isTrainer: boolean;
  theme: FullTheme;
  styles: ReturnType<typeof getStyles>;
}) {
  const [imageError, setImageError] = useState(false);

  if (matchType === 'CONTRACT' && !isTrainer) {
    return (
      <View style={styles.avatar}>
        <Image
          source={CONTRACT_LOGO}
          style={styles.avatarImage}
          resizeMode="cover"
        />
      </View>
    );
  }
  if (avatarUri && !imageError) {
    return (
      <View style={styles.avatar}>
        <Image
          source={{ uri: avatarUri }}
          style={styles.avatarImage}
          resizeMode="cover"
          onError={() => setImageError(true)}
        />
      </View>
    );
  }
  return (
    <View style={styles.avatarInitialsWrap}>
      <AppText style={styles.avatarInitials}>
        {name[0]?.toUpperCase() ?? '?'}
      </AppText>
    </View>
  );
}

/** Returns avatar image URL when available; otherwise UI shows first letter of name. */
function getAvatarUri(c: ConversationDto): string | null {
  const urlOrId = c.otherUserProfileImageUrl ?? c.otherUserId;
  if (urlOrId == null) return null;
  if (typeof urlOrId === 'string') {
    const s = urlOrId.trim();
    if (s === '') return null;
    if (s.startsWith('http')) return s;
  }
  return `https://appfitech.com/v1/app/file-upload/view/${urlOrId}`;
}

type ChatListItem = {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  matchType?: string;
  avatarUri: string | null;
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
    matchType: c.matchType,
    avatarUri: getAvatarUri(c),
  };
}

export default function ChatsScreen() {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const router = useRouter();
  const isTrainer = useUserStore((s) => s.getIsTrainer());

  const { data, isLoading } = useGetChats();

  const chats: ChatListItem[] = useMemo(() => {
    const conversations = data?.data ?? [];
    return conversations.map(mapConversationToChatItem);
  }, [data]);

  return (
    <PageContainer
      title="Chats"
      subheader="Mantén el contacto con tus gymcrush y gymbros cuando lo necesites."
      style={styles.pageStyle}
    >
      {isLoading ? (
        <View style={styles.loadingCenter}>
          <ActivityIndicator color={theme.backgroundInverted} />
          <AppText style={styles.loadingText}>Cargando chats...</AppText>
        </View>
      ) : !isLoading && !chats.length ? (
        <View style={styles.emptyCenter}>
          <AppText style={styles.emptyText}>
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
              <ChatListAvatar
                matchType={chat.matchType}
                avatarUri={chat.avatarUri}
                name={chat.name}
                isTrainer={isTrainer}
                theme={theme}
                styles={styles}
              />

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
                {chat.unread > 0 ? (
                  <View style={styles.unreadBadge}>
                    <AppText style={styles.unreadText}>
                      {chat.unread > 99 ? '99+' : chat.unread}
                    </AppText>
                  </View>
                ) : null}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </PageContainer>
  );
}

const getStyles = (theme: FullTheme) => {
  const text = textStyles(theme);
  return StyleSheet.create({
    pageStyle: {
      paddingBottom: 0,
    },
    loadingCenter: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      marginTop: 8,
      ...text.nav,
      color: theme.textSecondary,
    },
    emptyCenter: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emptyText: {
      ...text.small,
      color: theme.textSecondary,
      textAlign: 'center',
    },
    list: {
      width: '100%',
      marginTop: 8,
      rowGap: 8,
    },
    chatRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 14,
      paddingHorizontal: 14,
      borderRadius: 14,
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      columnGap: 12,
    },
    avatar: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.backgroundInput,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: theme.border,
    },
    avatarImage: {
      width: 44,
      height: 44,
    },
    avatarInitialsWrap: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.primaryBg,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: theme.primary,
    },
    avatarInitials: {
      color: theme.primary,
      ...text.lead,
    },
    chatMain: {
      flex: 1,
      rowGap: 2,
    },
    chatName: {
      ...text.bodySemibold,
      color: theme.textPrimary,
    },
    chatPreview: {
      ...text.nav,
      color: theme.textSecondary,
    },
    meta: {
      alignItems: 'flex-end',
      rowGap: 6,
      marginLeft: 8,
    },
    chatTime: {
      ...text.caption,
      color: theme.textSecondary,
    },
    unreadBadge: {
      minWidth: 20,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 999,
      backgroundColor: theme.primary,
      alignItems: 'center',
    },
    unreadText: {
      ...text.label,
      color: theme.background,
    },
  });
};
