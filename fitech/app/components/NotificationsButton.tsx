import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { ROUTES } from '@/constants/routes';
import { useTheme } from '@/contexts/ThemeContext';
import { FullTheme } from '@/types/theme';
import { transparentize } from '@/utils/style';

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
    <TouchableOpacity onPress={handleButtonClick} style={styles.button}>
      <Feather name="bell" size={26} color={theme.dark100} />
      {!!data?.unreadCount && (
        <View
          style={{
            position: 'absolute',
            right: -5,
            top: -5,
            backgroundColor: theme.primary,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 10,
            width: 20,
            height: 20,
          }}
        >
          <AppText style={{ fontWeight: 500 }}>{data?.unreadCount}</AppText>
        </View>
      )}
    </TouchableOpacity>
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    button: {
      backgroundColor: transparentize(theme.dark100, 0.2),
      borderRadius: 999,
      padding: 4,
      position: 'relative',
    },
  });
