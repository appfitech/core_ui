import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

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
    <View style={styles.wrapper}>
      <TouchableOpacity onPress={handleSupportClick}>
        <Feather
          name="help-circle"
          size={24}
          color={theme.backgroundInverted}
        />
      </TouchableOpacity>
    </View>
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    wrapper: {
      backgroundColor: transparentize(theme.green800, 0.3),
      borderRadius: '50%',
      padding: 4,
    },
  });
