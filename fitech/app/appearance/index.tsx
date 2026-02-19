import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import {
  THEME_PREFERENCE_LABELS,
  ThemePreference,
} from '@/constants/theme-storage';
import { useTheme } from '@/contexts/ThemeContext';
import { FullTheme } from '@/types/theme';

import { AppText } from '../components/AppText';
import PageContainer from '../components/PageContainer';

const PREFERENCES: ThemePreference[] = ['system', 'light', 'dark'];

const PREFERENCE_ICONS: Record<ThemePreference, string> = {
  system: 'phone-portrait-outline',
  light: 'sunny-outline',
  dark: 'moon-outline',
};

export default function AppearanceScreen() {
  const router = useRouter();
  const { theme, themePreference, setThemePreference } = useTheme();
  const styles = getStyles(theme);

  const handleSelect = useCallback(
    async (preference: ThemePreference) => {
      await setThemePreference(preference);
      router.back();
    },
    [setThemePreference, router],
  );

  return (
    <PageContainer
      title="Apariencia"
      subheader="Elige el tema de la app. Sistema sigue la configuración de tu dispositivo."
      style={styles.container}
    >
      <View style={styles.list}>
        {PREFERENCES.map((preference, index) => {
          const isSelected = themePreference === preference;
          const isLast = index === PREFERENCES.length - 1;
          const iconName = PREFERENCE_ICONS[preference];
          const iconColor = isSelected ? theme.primary : theme.textSecondary;
          return (
            <TouchableOpacity
              key={preference}
              style={[
                styles.row,
                isSelected && styles.rowSelected,
                isLast && styles.rowLast,
              ]}
              onPress={() => handleSelect(preference)}
              activeOpacity={0.7}
            >
              <View style={styles.labelRow}>
                <Ionicons name={iconName as any} size={22} color={iconColor} />
                <AppText
                  style={[styles.label, isSelected && styles.labelSelected]}
                >
                  {THEME_PREFERENCE_LABELS[preference]}
                </AppText>
              </View>
              {isSelected && (
                <Ionicons
                  name="checkmark-circle"
                  size={24}
                  color={theme.primary}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </PageContainer>
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    container: {
      paddingBottom: 180,
    },
    list: {
      marginTop: 16,
      borderRadius: 14,
      overflow: 'hidden',
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 18,
      paddingHorizontal: 20,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    rowSelected: {
      backgroundColor: theme.primaryBg,
    },
    rowLast: {
      borderBottomWidth: 0,
    },
    labelRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    label: {
      fontSize: 16,
      fontWeight: '500',
      color: theme.textPrimary,
    },
    labelSelected: {
      fontWeight: '600',
      color: theme.primaryText,
    },
  });
