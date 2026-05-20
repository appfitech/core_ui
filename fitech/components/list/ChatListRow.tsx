import React, { memo } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { AvatarPhoto } from '@/components/AvatarPhoto';
import { textStyles } from '@/constants/styles';
import { useTheme } from '@/contexts/ThemeContext';
import { FullTheme } from '@/types/theme';

const FITECH_LOGO = require('@/assets/images/logos/rounded_logo.webp');

export type ChatListRowItem = {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  matchType?: string;
  avatarUri?: string | null;
};

type Props = {
  chat: ChatListRowItem;
  isTrainer: boolean;
  onPress: () => void;
};

function ChatListRowComponent({ chat, isTrainer, onPress }: Props) {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const hasUnread = chat.unread > 0;
  const showTrainerLogo = chat.matchType === 'CONTRACT' && !isTrainer;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        hasUnread && styles.rowUnread,
        pressed && styles.rowPressed,
      ]}
    >
      <View style={styles.avatarWrap}>
        <AvatarPhoto
          url={chat.avatarUri}
          size={52}
          containerStyle={styles.avatar}
        />
        {showTrainerLogo ? (
          <View style={styles.trainerLogoBadge}>
            <Image
              source={FITECH_LOGO}
              style={styles.trainerLogo}
              resizeMode="contain"
            />
          </View>
        ) : null}
      </View>

      <View style={styles.body}>
        <View style={styles.topLine}>
          <AppText
            style={[styles.name, hasUnread && styles.nameUnread]}
            numberOfLines={1}
          >
            {chat.name}
          </AppText>
          <View style={styles.meta}>
            <AppText style={styles.time}>{chat.time}</AppText>
            {hasUnread ? <View style={styles.unreadDot} /> : null}
          </View>
        </View>

        <AppText
          style={[styles.preview, hasUnread && styles.previewUnread]}
          numberOfLines={2}
        >
          {chat.lastMessage}
        </AppText>
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
      alignItems: 'flex-start',
      paddingVertical: 14,
      paddingHorizontal: 0,
      columnGap: 14,
      borderBottomWidth: 1,
      borderBottomColor: theme.border.default,
    },
    rowUnread: {
      backgroundColor: theme.brand.primaryMuted,
    },
    rowPressed: {
      backgroundColor: theme.background.cardHover,
    },
    avatarWrap: {
      position: 'relative',
      marginTop: 2,
    },
    avatar: {},
    trainerLogoBadge: {
      position: 'absolute',
      right: -1,
      bottom: -1,
      width: 22,
      height: 22,
      borderRadius: 11,
      backgroundColor: theme.brand.primary,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: theme.background.app,
      overflow: 'hidden',
    },
    trainerLogo: {
      width: 14,
      height: 14,
    },
    body: {
      flex: 1,
      minWidth: 0,
      rowGap: 4,
      paddingTop: 4,
    },
    topLine: {
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: 10,
    },
    name: {
      ...text.bodyMedium,
      color: theme.text.primary,
      flex: 1,
      minWidth: 0,
    },
    nameUnread: {
      fontFamily: 'Inter_600SemiBold',
    },
    preview: {
      ...text.nav,
      color: theme.text.secondary,
      lineHeight: 18,
    },
    previewUnread: {
      color: theme.text.primary,
    },
    meta: {
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: 6,
      flexShrink: 0,
    },
    time: {
      ...text.caption,
      color: theme.text.tertiary,
    },
    unreadDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.brand.primary,
    },
  });
};
