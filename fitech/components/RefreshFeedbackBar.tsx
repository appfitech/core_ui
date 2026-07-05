import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { TRANSLATIONS } from '@/constants/strings';
import { textStyles } from '@/constants/styles';
import { useTheme } from '@/contexts/ThemeContext';
import { AppTheme } from '@/types/theme';

type Props = {
  visible: boolean;
};

export function RefreshFeedbackBar({ visible }: Props) {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  if (!visible) return null;

  return (
    <View style={styles.bar}>
      <ActivityIndicator color={theme.brand.primary} size="small" />
      <AppText variant="caption" style={styles.label}>
        {TRANSLATIONS.common.updating}
      </AppText>
    </View>
  );
}

/** Prepends the refresh banner to an optional FlatList header. */
export function withRefreshFeedback(
  refreshing: boolean,
  header?: React.ReactNode,
) {
  return (
    <>
      <RefreshFeedbackBar visible={refreshing} />
      {header}
    </>
  );
}

const getStyles = (theme: AppTheme) => {
  const text = textStyles(theme);

  return StyleSheet.create({
    bar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      columnGap: 8,
      paddingVertical: 10,
      marginBottom: 8,
      borderRadius: 10,
      backgroundColor: theme.brand.primarySoft,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.brand.primary,
    },
    label: {
      ...text.captionSemibold,
      color: theme.brand.primaryLight,
    },
  });
};
