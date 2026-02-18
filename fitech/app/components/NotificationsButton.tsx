import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { ROUTES } from '@/constants/routes';
import { useTheme } from '@/contexts/ThemeContext';
import { FullTheme } from '@/types/theme';

import { useGetUserNotifications } from '../api/queries/use-get-notifications';
import { AppText } from './AppText';

export function NotificationsButton() {
  const router = useRouter();
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const { data } = useGetUserNotifications();

  const handleButtonClick = useCallback(
    () => router.push(ROUTES.notifications),
    [],
  );

  return (
    <TouchableOpacity
      onPress={handleButtonClick}
      style={styles.button}
      activeOpacity={0.7}
    >
      <Ionicons name="notifications-outline" size={22} color={theme.dark100} />
      {!!data?.unreadCount && (
        <View style={styles.badge}>
          <AppText style={styles.badgeText}>{data?.unreadCount}</AppText>
        </View>
      )}
    </TouchableOpacity>
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
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
      backgroundColor: theme.primary,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 10,
      minWidth: 18,
      height: 18,
      paddingHorizontal: 5,
    },
    badgeText: {
      fontWeight: '700',
      fontSize: 11,
      color: theme.backgroundInverted,
    },
  });
