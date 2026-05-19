import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { textStyles } from '@/constants/styles';
import { useTheme } from '@/contexts/ThemeContext';
import { FullTheme } from '@/types/theme';

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
                color={theme.status.warning.icon}
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

const getStyles = (theme: FullTheme) => {
  const text = textStyles(theme);
  return StyleSheet.create({
    container: {
      backgroundColor: theme.background.card,
      borderRadius: 14,
      padding: 16,
      borderWidth: 1,
      borderColor: theme.border.default,
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
      backgroundColor: theme.background.input,
      borderRadius: 6,
      marginHorizontal: 10,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      backgroundColor: theme.status.warning.icon,
      borderRadius: 6,
    },
    count: {
      width: 24,
      textAlign: 'right',
      ...text.captionSemibold,
      color: theme.text.primary,
    },
  });
};
