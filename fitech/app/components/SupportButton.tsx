import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { ROUTES } from '@/constants/routes';
import { useTheme } from '@/contexts/ThemeContext';
import { FullTheme } from '@/types/theme';
import { transparentize } from '@/utils/style';

export function SupportButton() {
  const router = useRouter();
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const handleSupportClick = useCallback(() => router.push(ROUTES.support), []);

  return (
    <TouchableOpacity onPress={handleSupportClick} style={styles.button}>
      <Feather name="help-circle" size={26} color={theme.dark100} />
    </TouchableOpacity>
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    button: {
      backgroundColor: transparentize(theme.dark100, 0.2),
      borderRadius: 999,
      padding: 4,
    },
  });
