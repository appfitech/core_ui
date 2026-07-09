import { FontAwesome, Ionicons } from '@expo/vector-icons';
import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { RatingDistribution } from '@/components/trainer-reviews/RatingBreakdown';
import { TRANSLATIONS } from '@/constants/strings';
import { textStyles } from '@/constants/styles';
import { useTheme } from '@/contexts/ThemeContext';
import {
  useGetTrainerProfileReviews,
  useGetTrainerProfileReviewsBreakdown,
  useGetTrainerProfileReviewsStats,
} from '@/lib/api/queries/use-get-trainer-profile-reviews';
import { ReviewResponseDtoReadable } from '@/types/api/types.gen';
import { AppTheme } from '@/types/theme';
import { moment } from '@/utils/dates';

const MAX_VISIBLE_REVIEWS = 5;
const RATING_LABELS = ['Muy malo', 'Malo', 'Regular', 'Bueno', 'Muy bueno'];

type Props = {
  trainerId: number;
};

function formatReviewDate(iso?: string): string | null {
  if (!iso) return null;
  return moment(iso).format('D MMM YYYY');
}

function StarRating({ rating }: { rating: number }) {
  const { theme } = useTheme();

  return (
    <View style={{ flexDirection: 'row', gap: 2 }}>
      {Array.from({ length: 5 }).map((_, index) => (
        <FontAwesome
          key={index}
          name={index < rating ? 'star' : 'star-o'}
          size={14}
          color={theme.status.warning.icon}
        />
      ))}
    </View>
  );
}

function TrainerReviewCard({
  review,
  copy,
}: {
  review: ReviewResponseDtoReadable;
  copy: (typeof TRANSLATIONS)['trainerProfileScreen'];
}) {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const rating = Math.min(5, Math.max(1, review.rating ?? 3));
  const reviewerName = review.isAnonymous
    ? copy.anonymousClient
    : (review.clientName?.trim() || copy.anonymousClient);
  const reviewDate = formatReviewDate(review.createdAt);

  return (
    <View style={styles.reviewCard}>
      <View style={styles.reviewCardHeader}>
        <AppText style={styles.reviewCardName} numberOfLines={1}>
          {reviewerName}
        </AppText>
        {reviewDate ? (
          <AppText style={styles.reviewCardDate}>{reviewDate}</AppText>
        ) : null}
      </View>

      <View style={styles.reviewCardRatingRow}>
        <StarRating rating={rating} />
        <AppText style={styles.reviewCardRatingLabel}>
          {RATING_LABELS[rating - 1]}
        </AppText>
      </View>

      {review.comment?.trim() ? (
        <View style={styles.reviewCommentBlock}>
          <AppText style={styles.reviewCommentLabel}>
            {copy.reviewCommentLabel}
          </AppText>
          <AppText style={styles.reviewComment}>{review.comment}</AppText>
        </View>
      ) : null}
    </View>
  );
}

export function TrainerReviewsSection({ trainerId }: Props) {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const { trainerProfileScreen: copy } = TRANSLATIONS;
  const [expanded, setExpanded] = useState(false);

  const { data: stats, isLoading: statsLoading } =
    useGetTrainerProfileReviewsStats(trainerId);
  const { data: breakdown, isLoading: breakdownLoading } =
    useGetTrainerProfileReviewsBreakdown(trainerId);
  const { data: reviews, isLoading: reviewsLoading } =
    useGetTrainerProfileReviews(trainerId);

  const isLoading = statsLoading || breakdownLoading || reviewsLoading;

  const visibleReviews = useMemo(
    () => (reviews ?? []).slice(0, MAX_VISIBLE_REVIEWS),
    [reviews],
  );

  const totalReviews = stats?.totalReviews ?? breakdown?.totalReviews ?? 0;
  const averageRating = stats?.averageRating ?? breakdown?.averageRating;
  const hasReviews = totalReviews > 0 || visibleReviews.length > 0;

  const summaryText = useMemo(() => {
    if (averageRating == null) return null;

    const rating = averageRating.toFixed(1);
    if (totalReviews === 1) {
      return copy.reviewsSummaryOne.replace('{rating}', rating);
    }

    return copy.reviewsSummaryMany
      .replace('{rating}', rating)
      .replace('{count}', String(totalReviews));
  }, [averageRating, copy, totalReviews]);

  const breakdownData = useMemo(() => {
    if (!breakdown?.breakdown?.length) return null;

    return {
      averageRating: breakdown.averageRating ?? 0,
      totalReviews: breakdown.totalReviews ?? 0,
      breakdown: breakdown.breakdown.map((item) => ({
        stars: item.stars ?? 0,
        count: item.count ?? 0,
        percentage: item.percentage ?? 0,
      })),
    };
  }, [breakdown]);

  const headerHint = useMemo(() => {
    if (isLoading) return null;
    if (summaryText) return summaryText;
    if (!hasReviews) return copy.reviewsEmpty;
    return null;
  }, [copy.reviewsEmpty, hasReviews, isLoading, summaryText]);

  const handleToggleExpanded = useCallback(() => {
    setExpanded((prev) => !prev);
  }, []);

  return (
    <View style={styles.section}>
      <Pressable
        onPress={handleToggleExpanded}
        style={({ pressed }) => [
          styles.sectionHeader,
          pressed && styles.sectionHeaderPressed,
        ]}
        accessibilityRole="button"
        accessibilityLabel={expanded ? copy.reviewsCollapse : copy.reviewsExpand}
      >
        <AppText style={styles.sectionLabel}>{copy.reviewsTitle}</AppText>
        <View style={styles.sectionHeaderRight}>
          {headerHint ? (
            <AppText style={styles.sectionHeaderHint} numberOfLines={1}>
              {headerHint}
            </AppText>
          ) : null}
          <Ionicons
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={18}
            color={theme.text.tertiary}
          />
        </View>
      </Pressable>

      {expanded ? (
        isLoading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator color={theme.text.primary} />
          </View>
        ) : !hasReviews ? (
          <View style={styles.emptyCard}>
            <AppText style={styles.emptyText}>{copy.reviewsEmpty}</AppText>
          </View>
        ) : (
          <View style={styles.content}>
            {summaryText ? (
              <View style={styles.summaryCard}>
                <StarRating rating={Math.round(averageRating ?? 0)} />
                <AppText style={styles.summaryText}>{summaryText}</AppText>
              </View>
            ) : null}

            {breakdownData ? <RatingDistribution data={breakdownData} /> : null}

            <View style={styles.reviewsList}>
              {visibleReviews.map((review) => (
                <TrainerReviewCard
                  key={review.id ?? `${review.clientId}-${review.createdAt}`}
                  review={review}
                  copy={copy}
                />
              ))}
            </View>
          </View>
        )
      ) : null}
    </View>
  );
}

const getStyles = (theme: AppTheme) => {
  const text = textStyles(theme);

  return StyleSheet.create({
    section: {
      marginTop: 20,
      rowGap: 10,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      columnGap: 12,
      paddingVertical: 4,
    },
    sectionHeaderPressed: {
      opacity: 0.7,
    },
    sectionHeaderRight: {
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: 6,
      flexShrink: 1,
      maxWidth: '62%',
    },
    sectionHeaderHint: {
      ...text.caption,
      color: theme.text.secondary,
      flexShrink: 1,
      textAlign: 'right',
    },
    sectionLabel: {
      ...text.caption,
      color: theme.text.tertiary,
    },
    loadingWrap: {
      paddingVertical: 24,
      alignItems: 'center',
    },
    emptyCard: {
      backgroundColor: theme.background.card,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border.default,
      padding: 16,
    },
    emptyText: {
      ...text.small,
      color: theme.text.secondary,
      textAlign: 'center',
    },
    content: {
      rowGap: 12,
    },
    summaryCard: {
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: 10,
      backgroundColor: theme.background.card,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border.default,
      padding: 14,
    },
    summaryText: {
      ...text.smallSemibold,
      color: theme.text.primary,
    },
    reviewsList: {
      rowGap: 10,
    },
    reviewCard: {
      backgroundColor: theme.background.card,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border.default,
      padding: 14,
      rowGap: 10,
    },
    reviewCardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      columnGap: 8,
    },
    reviewCardName: {
      ...text.smallSemibold,
      color: theme.text.primary,
      flex: 1,
    },
    reviewCardDate: {
      ...text.caption,
      color: theme.text.tertiary,
    },
    reviewCardRatingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: 8,
    },
    reviewCardRatingLabel: {
      ...text.caption,
      color: theme.text.secondary,
    },
    reviewCommentBlock: {
      rowGap: 4,
    },
    reviewCommentLabel: {
      ...text.captionSemibold,
      color: theme.text.tertiary,
    },
    reviewComment: {
      ...text.small,
      color: theme.text.secondary,
      lineHeight: 20,
    },
  });
};
