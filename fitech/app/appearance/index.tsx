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
              <AppText
                style={[styles.label, isSelected && styles.labelSelected]}
              >
                {THEME_PREFERENCE_LABELS[preference]}
              </AppText>
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
      paddingBottom: 120,
    },
    list: {
      marginTop: 8,
      borderRadius: 12,
      overflow: 'hidden',
      backgroundColor: theme.dark100,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.border,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 16,
      paddingHorizontal: 20,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.border,
    },
    rowSelected: {
      backgroundColor: theme.primaryBg,
    },
    rowLast: {
      borderBottomWidth: 0,
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
