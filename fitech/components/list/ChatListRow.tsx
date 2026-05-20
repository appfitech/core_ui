import React, { memo, useState } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { textStyles } from '@/constants/styles';
import { useTheme } from '@/contexts/ThemeContext';
import { FullTheme } from '@/types/theme';

const CONTRACT_LOGO = require('@/assets/images/logos/rounded_logo.webp');

export type ChatListRowItem = {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  matchType?: string;
  avatarUri: string | null;
};

type Props = {
  chat: ChatListRowItem;
  isTrainer: boolean;
  onPress: () => void;
};

function ChatAvatar({
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

function ChatListRowComponent({ chat, isTrainer, onPress }: Props) {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
    >
      <ChatAvatar
        matchType={chat.matchType}
        avatarUri={chat.avatarUri}
        name={chat.name}
        isTrainer={isTrainer}
        styles={styles}
      />
      <View style={styles.main}>
        <AppText style={styles.name} numberOfLines={1}>
          {chat.name}
        </AppText>
        <AppText style={styles.preview} numberOfLines={1}>
          {chat.lastMessage}
        </AppText>
      </View>
      <View style={styles.meta}>
        <AppText style={styles.time}>{chat.time}</AppText>
        {chat.unread > 0 ? (
          <View style={styles.unreadBadge}>
            <AppText style={styles.unreadText}>
              {chat.unread > 99 ? '99+' : chat.unread}
            </AppText>
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}

export const ChatListRow = memo(ChatListRowComponent);

const getStyles = (theme: FullTheme) => {
  const text = textStyles(theme);
  return StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 14,
      paddingHorizontal: 14,
      borderRadius: 14,
      backgroundColor: theme.background.card,
      borderWidth: 1,
      borderColor: theme.border.default,
      columnGap: 12,
    },
    rowPressed: { opacity: 0.88 },
    avatar: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.background.input,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: theme.border.default,
    },
    avatarImage: { width: 44, height: 44 },
    avatarInitialsWrap: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.brand.primarySoft,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: theme.brand.primary,
    },
    avatarInitials: {
      color: theme.brand.primary,
      ...text.lead,
    },
    main: { flex: 1, rowGap: 2, minWidth: 0 },
    name: { ...text.bodySemibold, color: theme.text.primary },
    preview: { ...text.nav, color: theme.text.secondary },
    meta: { alignItems: 'flex-end', rowGap: 6, marginLeft: 8 },
    time: { ...text.caption, color: theme.text.secondary },
    unreadBadge: {
      minWidth: 20,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 999,
      backgroundColor: theme.brand.primary,
      alignItems: 'center',
    },
    unreadText: {
      ...text.label,
      color: theme.background.app,
    },
  });
};
