import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { textStyles } from '@/constants/styles';
import { useTheme } from '@/contexts/ThemeContext';
import { AppTheme } from '@/types/theme';

type Props = {
  title: string;
  hint?: string;
  icon?: keyof typeof Ionicons.glyphMap;
};

export function ListEmptyState({ title, hint, icon }: Props) {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={styles.wrap}>
      {icon ? (
        <View style={styles.iconWrap}>
          <Ionicons name={icon} size={28} color={theme.brand.primary} />
        </View>
      ) : null}
      <AppText style={styles.title}>{title}</AppText>
      {hint ? <AppText style={styles.hint}>{hint}</AppText> : null}
    </View>
  );
}

const getStyles = (theme: AppTheme) => {
  const text = textStyles(theme);
  return StyleSheet.create({
    wrap: {
      paddingVertical: 40,
      paddingHorizontal: 24,
      alignItems: 'center',
      rowGap: 12,
    },
    iconWrap: {
      width: 56,
      height: 56,
      borderRadius: 28,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.brand.primarySoft,
    },
    title: {
      ...text.bodySemibold,
      color: theme.text.primary,
      textAlign: 'center',
    },
    hint: {
      ...text.small,
      color: theme.text.secondary,
      marginTop: 8,
      textAlign: 'center',
    },
  });
};
