import { Ionicons } from '@expo/vector-icons';
import React, { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { textStyles } from '@/constants/styles';
import { useTheme } from '@/contexts/ThemeContext';
import { NotificationDto } from '@/types/api/types.gen';
import { AppTheme } from '@/types/theme';

export function getNotificationIcon(
  type?: string,
): keyof typeof Ionicons.glyphMap {
  const t = (type ?? '').toUpperCase();
  if (t.includes('DIET') || t.includes('DIETA')) return 'nutrition-outline';
  if (t.includes('ROUTINE') || t.includes('RUTINA')) return 'barbell-outline';
  if (t.includes('CONTRACT') || t.includes('CONTRATO'))
    return 'document-text-outline';
  if (t.includes('CHAT')) return 'chatbubble-outline';
  if (t.includes('TRAINER') || t.includes('ENTRENADOR'))
    return 'person-outline';
  return 'notifications-outline';
}

type Props = {
  item: NotificationDto;
  onPress: () => void;
};

function NotificationListRowComponent({ item, onPress }: Props) {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const isUnread = !item.isRead;
  const iconName = getNotificationIcon(item.type);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        isUnread && styles.rowUnread,
        pressed && styles.rowPressed,
      ]}
    >
      <View style={styles.iconBox}>
        <Ionicons name={iconName} size={20} color={theme.brand.primary} />
      </View>

      <View style={styles.body}>
        <View style={styles.topLine}>
          <AppText
            style={[styles.title, isUnread && styles.titleUnread]}
            numberOfLines={1}
          >
            {item.title}
          </AppText>
          <View style={styles.meta}>
            {item.timeAgo ? (
              <AppText style={styles.time}>{item.timeAgo}</AppText>
            ) : null}
            {isUnread ? <View style={styles.unreadDot} /> : null}
          </View>
        </View>

        {item.message ? (
          <AppText
            style={[styles.message, isUnread && styles.messageUnread]}
            numberOfLines={2}
          >
            {item.message}
          </AppText>
        ) : null}
      </View>
    </Pressable>
  );
}

export const NotificationListRow = memo(NotificationListRowComponent);

const getStyles = (theme: AppTheme) => {
  const text = textStyles(theme);
  return StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      paddingVertical: 14,
      columnGap: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.border.default,
    },
    rowUnread: {
      backgroundColor: theme.brand.primaryMuted,
    },
    rowPressed: {
      backgroundColor: theme.background.cardHover,
    },
    iconBox: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: theme.brand.primarySoft,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 2,
    },
    body: {
      flex: 1,
      minWidth: 0,
      rowGap: 4,
      paddingTop: 2,
    },
    topLine: {
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: 10,
    },
    title: {
      ...text.bodyMedium,
      color: theme.text.primary,
      flex: 1,
      minWidth: 0,
    },
    titleUnread: {
      fontFamily: 'Inter_600SemiBold',
    },
    message: {
      ...text.nav,
      color: theme.text.secondary,
      lineHeight: 18,
    },
    messageUnread: {
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
