import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { useTheme } from '@/contexts/ThemeContext';
import { FullTheme } from '@/types/theme';

export function BackButton() {
  const { theme } = useTheme();
  const router = useRouter();
  const styles = getStyles(theme);

  return (
    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
      <Feather name="arrow-left" size={20} color={theme.background} />
    </TouchableOpacity>
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    backButton: {
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.dark900,
      padding: 10,
      borderRadius: 100,
      shadowColor: '#000',
      shadowOpacity: 0.05,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 6,
      elevation: 3,
    },
  });
