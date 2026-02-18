import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { ROUTES } from '@/constants/routes';
import { useTheme } from '@/contexts/ThemeContext';
import { FullTheme } from '@/types/theme';

export function SupportButton() {
  const router = useRouter();
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const handleSupportClick = useCallback(() => router.push(ROUTES.support), []);

  return (
    <TouchableOpacity
      onPress={handleSupportClick}
      style={styles.button}
      activeOpacity={0.7}
    >
      <Ionicons name="help-circle-outline" size={22} color={theme.dark100} />
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
      backgroundColor: 'rgba(255,255,255,0.12)',
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.2)',
    },
  });
