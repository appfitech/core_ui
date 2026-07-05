import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import PageContainer from '@/components/PageContainer';
import { Tag } from '@/components/Tag';
import { RatingDistribution } from '@/components/trainer-reviews/RatingBreakdown';
import { textStyles } from '@/constants/styles';
import { useTheme } from '@/contexts/ThemeContext';
import {
  useTrainerGetReviews,
  useTrainerGetReviewsBreakdown,
  useTrainerGetReviewsStats,
} from '@/lib/api/queries/use-trainer-get-reviews';
import { usePullToRefreshMany } from '@/hooks/use-pull-to-refresh';
import { AppTheme } from '@/types/theme';

/** Review item as returned by trainer my-reviews API (content array). */
type TrainerReviewItem = {
  id?: number;
  contractId?: number;
  serviceId?: number;
  serviceName?: string;
  clientName?: string;
  comment?: string;
  [key: string]: unknown;
};

export default function TrainerReviewsScreen() {
  const { theme } = useTheme();
  const router = useRouter();

  const { data: stats, refetch: refetchStats } = useTrainerGetReviewsStats();
  const { data: breakdown, refetch: refetchBreakdown } =
    useTrainerGetReviewsBreakdown();
  const { data: reviews, refetch: refetchReviews } = useTrainerGetReviews();
  const { refreshing, onRefresh } = usePullToRefreshMany(
    refetchStats,
    refetchBreakdown,
    refetchReviews,
  );

  const styles = getStyles(theme);

  const handleDetails = (review: TrainerReviewItem) => {
    if (!review?.serviceId) {
      return;
    }

    router.push({
      pathname: '/contracts/[id]',
      params: {
        id: String(review.serviceId),
        contract: JSON.stringify(review),
      },
    });
  };

  return (
    <PageContainer
      title="Mis Calificaciones"
      subheader="Revisa las calificaciones y comentarios de tus clientes"
      onRefresh={onRefresh}
      refreshing={refreshing}
    >
      <View style={styles.contentWrap}>
        <AppText style={styles.sectionTitle}>RESUMEN</AppText>
        <View style={styles.summaryColumn}>
          <View style={styles.statCardSuccess}>
            <AppText style={styles.statCardLabel}>Total reseñas</AppText>
            <AppText style={styles.statCardValueSuccess}>
              {(stats as { totalReviews?: number } | undefined)?.totalReviews ??
                0}
            </AppText>
          </View>
          <View style={styles.statCardInfo}>
            <AppText style={styles.statCardLabel}>
              Calificación promedio
            </AppText>
            <AppText style={styles.statCardValueInfo}>
              {(stats as { averageRating?: number } | undefined)
                ?.averageRating ?? '—'}
            </AppText>
          </View>
        </View>

        {breakdown && (
          <>
            <AppText style={styles.sectionTitle}>
              DISTRIBUCIÓN DE CALIFICACIONES
            </AppText>
            <RatingDistribution
              data={
                breakdown as unknown as {
                  averageRating: number;
                  totalReviews: number;
                  breakdown: {
                    stars: number;
                    count: number;
                    percentage: number;
                  }[];
                }
              }
            />
          </>
        )}

        <AppText style={styles.sectionTitle}>RESEÑAS</AppText>
        <View style={styles.reviewsList}>
          {(
            (reviews as { content?: TrainerReviewItem[] } | undefined)
              ?.content ?? []
          ).map((review: TrainerReviewItem) => (
            <Pressable
              key={review.id ?? review?.contractId}
              onPress={() => handleDetails(review)}
              accessibilityRole="button"
              style={({ pressed }) => [
                styles.card,
                pressed && styles.cardPressed,
              ]}
            >
              <View style={styles.cardHeader}>
                <AppText style={styles.cardTitle} numberOfLines={1}>
                  {review.clientName}
                </AppText>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={theme.text.tertiary}
                />
              </View>
              {review.comment ? (
                <AppText style={styles.cardComment} numberOfLines={4}>
                  {review.comment}
                </AppText>
              ) : null}
              <Tag
                backgroundColor={theme.status.info.bg}
                textColor={theme.status.info.text}
                label={review?.serviceName ?? 'Servicio'}
              />
              <View style={styles.respondHint}>
                <AppText style={styles.respondHintText}>Responder</AppText>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={theme.brand.primary}
                />
              </View>
            </Pressable>
          ))}
        </View>
      </View>
    </PageContainer>
  );
}

const getStyles = (theme: AppTheme) => {
  const text = textStyles(theme);
  return StyleSheet.create({
    contentWrap: {
      gap: 16,
      paddingVertical: 8,
    },
    sectionTitle: {
      ...text.captionSemibold,
      color: theme.text.secondary,
      letterSpacing: 0.6,
      textTransform: 'uppercase',
      marginBottom: 4,
    },
    summaryColumn: {
      flexDirection: 'column',
      gap: 10,
      marginBottom: 4,
    },
    statCardSuccess: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: theme.border.default,
      backgroundColor: theme.background.card,
      borderLeftWidth: 4,
      borderLeftColor: theme.status.success.icon,
    },
    statCardInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: theme.border.default,
      backgroundColor: theme.background.card,
      borderLeftWidth: 4,
      borderLeftColor: theme.status.info.icon,
    },
    statCardLabel: {
      ...text.smallSemibold,
      color: theme.text.secondary,
    },
    statCardValueSuccess: {
      color: theme.status.success.text,
      ...text.statLarge,
    },
    statCardValueInfo: {
      color: theme.status.info.text,
      ...text.statLarge,
    },
    reviewsList: { gap: 12 },
    card: {
      backgroundColor: theme.background.card,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.border.default,
      padding: 16,
      gap: 10,
    },
    cardPressed: {
      backgroundColor: theme.background.input,
      borderColor: theme.border.strong,
    },
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      columnGap: 8,
    },
    cardTitle: {
      ...text.leadSemibold,
      flex: 1,
      color: theme.text.primary,
    },
    cardComment: {
      ...text.small,
      color: theme.text.secondary,
      lineHeight: 20,
    },
    respondHint: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      columnGap: 2,
      marginTop: 4,
      paddingTop: 10,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: theme.border.default,
    },
    respondHintText: {
      ...text.smallSemibold,
      color: theme.brand.primary,
    },
  });
};
