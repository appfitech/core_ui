import React from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { textStyles } from '@/constants/styles';
import { useTheme } from '@/contexts/ThemeContext';
import { AppTheme } from '@/types/theme';

type Props = {
  title: string;
  hint?: string;
};

export function ListEmptyState({ title, hint }: Props) {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={styles.wrap}>
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
