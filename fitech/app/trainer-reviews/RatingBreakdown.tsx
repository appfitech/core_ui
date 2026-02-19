import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/contexts/ThemeContext';
import { FullTheme } from '@/types/theme';

import { AppText } from '../components/AppText';

type RatingBreakdown = {
  averageRating: number;
  totalReviews: number;
  breakdown: {
    stars: number;
    count: number;
    percentage: number;
  }[];
};

export const RatingDistribution = ({ data }: { data: RatingBreakdown }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={styles.container}>
      {data?.breakdown?.map((item) => (
        <View key={item.stars} style={styles.row}>
          <View style={styles.stars}>
            {Array.from({ length: item.stars }).map((_, i) => (
              <FontAwesome
                key={i}
                name="star"
                size={14}
                color={theme.orange}
              />
            ))}
          </View>
          <View style={styles.progressContainer}>
            <View
              style={[styles.progressFill, { width: `${item.percentage}%` }]}
            />
          </View>
          <AppText style={styles.count}>{item.count}</AppText>
        </View>
      ))}
    </View>
  );
};

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.card,
      borderRadius: 14,
      padding: 16,
      borderWidth: 1,
      borderColor: theme.border,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 6,
    },
    stars: {
      flexDirection: 'row',
      width: 56,
      gap: 2,
    },
    progressContainer: {
      flex: 1,
      height: 10,
      backgroundColor: theme.backgroundInput,
      borderRadius: 6,
      marginHorizontal: 10,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      backgroundColor: theme.orange,
      borderRadius: 6,
    },
    count: {
      width: 24,
      textAlign: 'right',
      fontSize: 13,
      fontWeight: '700',
      color: theme.textPrimary,
    },
  });
