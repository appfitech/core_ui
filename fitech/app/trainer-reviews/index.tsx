import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { AppText } from '@/components/AppText';
import PageContainer from '@/components/PageContainer';
import { Tag } from '@/components/Tag';
import { RatingDistribution } from '@/components/trainer-reviews/RatingBreakdown';
import { useTheme } from '@/contexts/ThemeContext';
import {
  useTrainerGetReviews,
  useTrainerGetReviewsBreakdown,
  useTrainerGetReviewsStats,
} from '@/lib/api/queries/use-trainer-get-reviews';
import { FullTheme } from '@/types/theme';

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

  const { data: stats } = useTrainerGetReviewsStats();
  const { data: breakdown } = useTrainerGetReviewsBreakdown();
  const { data: reviews } = useTrainerGetReviews();

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
      style={styles.pageStyle}
      contentPaddingBottom={120}
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
            <View key={review.id ?? review?.contractId} style={styles.card}>
              <AppText style={styles.cardTitle}>{review.clientName}</AppText>
              {review.comment ? (
                <AppText style={styles.cardComment} numberOfLines={4}>
                  {review.comment}
                </AppText>
              ) : null}
              <Tag
                backgroundColor={theme.infoBackground}
                textColor={theme.infoText}
                label={review?.serviceName ?? 'Servicio'}
              />
              <TouchableOpacity
                style={styles.respondButton}
                onPress={() => handleDetails(review)}
                activeOpacity={0.8}
              >
                <AppText style={styles.respondButtonText}>Responder</AppText>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={theme.background}
                />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    </PageContainer>
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    pageStyle: {},
    contentWrap: {
      gap: 16,
      paddingVertical: 8,
    },
    sectionTitle: {
      fontSize: 12,
      fontWeight: '700',
      color: theme.textSecondary,
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
      borderColor: theme.border,
      backgroundColor: theme.card,
      borderLeftWidth: 4,
      borderLeftColor: theme.success,
    },
    statCardInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.card,
      borderLeftWidth: 4,
      borderLeftColor: theme.info,
    },
    statCardLabel: {
      fontWeight: '600',
      fontSize: 14,
      color: theme.textSecondary,
    },
    statCardValueSuccess: {
      color: theme.successText,
      fontSize: 28,
      fontWeight: '900',
    },
    statCardValueInfo: {
      color: theme.infoText,
      fontSize: 28,
      fontWeight: '900',
    },
    reviewsList: { gap: 12 },
    card: {
      backgroundColor: theme.card,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.border,
      padding: 16,
      gap: 10,
    },
    cardTitle: {
      fontSize: 17,
      fontWeight: '700',
      color: theme.textPrimary,
    },
    cardComment: {
      fontSize: 14,
      color: theme.textSecondary,
      lineHeight: 20,
    },
    respondButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      marginTop: 4,
      backgroundColor: theme.primary,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 12,
    },
    respondButtonText: {
      color: theme.background,
      fontWeight: '700',
      fontSize: 15,
    },
  });
