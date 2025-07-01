import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/contexts/ThemeContext';

import { FullTheme } from '../types/theme';

export function PremiumTag() {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={styles.premiumTag}>
      <Feather name="dollar-sign" size={16} color={theme.warningText} />

      <Text style={styles.premiumText}>Premium</Text>
    </View>
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    premiumTag: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.warningBackground,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
    },
    premiumText: {
      marginLeft: 4,
      color: theme.warningText,
      fontWeight: '600',
      fontSize: 14,
    },
  });
