import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { ROUTES } from '@/constants/routes';
import { textStyles } from '@/constants/styles';
import { useTheme } from '@/contexts/ThemeContext';
import { useGetChatsUnreadCount } from '@/lib/api/queries/use-get-chats-unread-count';
import { AppTheme } from '@/types/theme';

import { AppText } from './AppText';

export function ChatButton() {
  const router = useRouter();
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const { data: unreadCount = 0, refetch } = useGetChatsUnreadCount();

  useFocusEffect(
    useCallback(() => {
      void refetch();
    }, [refetch]),
  );

  const handleClick = useCallback(() => router.push(ROUTES.chats), [router]);

  return (
    <TouchableOpacity
      onPress={handleClick}
      style={styles.button}
      activeOpacity={0.7}
    >
      <Ionicons
        name="chatbubble-outline"
        size={22}
        color={theme.text.primary}
      />
      {unreadCount > 0 ? (
        <View style={styles.badge}>
          <AppText style={styles.badgeText}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </AppText>
        </View>
      ) : null}
    </TouchableOpacity>
  );
}

const getStyles = (theme: AppTheme) => {
  const text = textStyles(theme);
  return StyleSheet.create({
    button: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      backgroundColor: 'rgba(255,255,255,0.12)',
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.2)',
    },
    badge: {
      position: 'absolute',
      right: -2,
      top: -2,
      backgroundColor: theme.brand.primary,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 10,
      minWidth: 18,
      height: 18,
      paddingHorizontal: 5,
    },
    badgeText: {
      ...text.caption,
      color: theme.background.app,
    },
  });
};
