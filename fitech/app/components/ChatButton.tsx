import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { ROUTES } from '@/constants/routes';
import { useTheme } from '@/contexts/ThemeContext';
import { FullTheme } from '@/types/theme';
import { transparentize } from '@/utils/style';

export function ChatButton() {
  const router = useRouter();
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const handleClick = useCallback(() => router.push(ROUTES.chats), []);

  return (
    <TouchableOpacity onPress={handleClick} style={styles.button}>
      <Feather name="message-square" size={22} color={theme.dark100} />
    </TouchableOpacity>
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    button: {
      backgroundColor: transparentize(theme.dark100, 0.2),
      borderRadius: 999,
      padding: 4,
      width: 35,
      height: 35,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
