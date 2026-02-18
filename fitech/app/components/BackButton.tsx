import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { useTheme } from '@/contexts/ThemeContext';
import { FullTheme } from '@/types/theme';

type Props = {
  /** Use "light" when the button sits on a dark background (e.g. PageContainer fixed header) */
  variant?: 'default' | 'light';
};

export function BackButton({ variant = 'default' }: Props) {
  const { theme } = useTheme();
  const router = useRouter();
  const styles = getStyles(theme, variant);

  return (
    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
      <Ionicons
        name="arrow-back"
        size={22}
        color={variant === 'light' ? theme.textPrimary : theme.background}
      />
    </TouchableOpacity>
  );
}

const getStyles = (theme: FullTheme, variant: 'default' | 'light') =>
  StyleSheet.create({
    backButton: {
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:
        variant === 'light'
          ? 'rgba(255, 255, 255, 0.2)'
          : theme.dark900,
      padding: 10,
      borderRadius: 100,
      shadowColor: '#000',
      shadowOpacity: variant === 'light' ? 0.15 : 0.05,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 6,
      elevation: 3,
    },
  });
