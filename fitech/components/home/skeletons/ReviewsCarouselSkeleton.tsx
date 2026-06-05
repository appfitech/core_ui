import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { SkeletonBox } from '@/components/Skeleton';
import { useTheme } from '@/contexts/ThemeContext';
import { AppTheme } from '@/types/theme';

const REVIEW_CARD_WIDTH = 200;

export function ReviewsCarouselSkeleton() {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={styles.section}>
      <SkeletonBox width={180} height={14} borderRadius={4} />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {[0, 1].map((index) => (
          <View key={`review-skeleton-${index}`} style={styles.reviewCard}>
            <SkeletonBox width="70%" height={16} borderRadius={4} />
            <SkeletonBox width="55%" height={14} borderRadius={4} />
            <SkeletonBox width="40%" height={12} borderRadius={4} />
            <SkeletonBox width="100%" height={48} borderRadius={6} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const getStyles = (theme: AppTheme) =>
  StyleSheet.create({
    section: {
      rowGap: 8,
    },
    scrollContent: {
      columnGap: 12,
    },
    reviewCard: {
      width: REVIEW_CARD_WIDTH,
      backgroundColor: theme.background.card,
      borderRadius: 16,
      padding: 14,
      borderWidth: 1,
      borderColor: theme.border.default,
      rowGap: 8,
    },
  });
