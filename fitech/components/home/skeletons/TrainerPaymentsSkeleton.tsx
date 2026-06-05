import React from 'react';
import { StyleSheet, View } from 'react-native';

import { SkeletonBox } from '@/components/Skeleton';
import { useTheme } from '@/contexts/ThemeContext';
import { AppTheme } from '@/types/theme';

export function TrainerPaymentsSkeleton() {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={styles.pagosCard}>
      <View style={styles.summaryCardsRow}>
        {[0, 1, 2].map((index) => (
          <View key={`payment-skeleton-${index}`} style={styles.summaryRow}>
            <SkeletonBox width={40} height={40} borderRadius={10} />
            <View style={styles.summaryTextCol}>
              <SkeletonBox width="72%" height={12} borderRadius={4} />
              <SkeletonBox width="48%" height={18} borderRadius={4} />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const getStyles = (theme: AppTheme) =>
  StyleSheet.create({
    pagosCard: {
      backgroundColor: theme.background.card,
      borderRadius: 16,
      padding: 14,
      borderWidth: 1,
      borderColor: theme.border.default,
      borderLeftWidth: 4,
      borderLeftColor: theme.border.default,
    },
    summaryCardsRow: {
      gap: 10,
    },
    summaryRow: {
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: 12,
    },
    summaryTextCol: {
      flex: 1,
      rowGap: 8,
    },
  });
