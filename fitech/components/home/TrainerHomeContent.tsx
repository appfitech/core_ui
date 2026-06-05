import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { SummaryCard } from '@/app/trainer-payments';
import { AppText } from '@/components/AppText';
import { HomeSectionContainer } from '@/components/HomeSectionContainer';
import { ReviewsCarouselSkeleton } from '@/components/home/skeletons/ReviewsCarouselSkeleton';
import { TrainerPaymentsSkeleton } from '@/components/home/skeletons/TrainerPaymentsSkeleton';
import { ROUTES } from '@/constants/routes';
import { textStyles } from '@/constants/styles';
import { useTheme } from '@/contexts/ThemeContext';
import { useTrainerGetPaymentsSummary } from '@/lib/api/queries/use-trainer-get-payments';
import { useTrainerGetReviews } from '@/lib/api/queries/use-trainer-get-reviews';
import { AppTheme } from '@/types/theme';
import { truncateWords } from '@/utils/strings';

const EMOJIS = ['😠', '😕', '😐', '🙂', '😄'];
const EMOJIS_LABEL = ['Muy malo', 'Malo', 'Regular', 'Bueno', 'Muy bueno'];

export function TrainerHomeContent() {
  const router = useRouter();
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const { data: reviews, isLoading: reviewsLoading } = useTrainerGetReviews(true);
  const { data: paymentsSummary, isLoading: paymentsLoading } =
    useTrainerGetPaymentsSummary(true);

  return (
    <View style={styles.contentWrapper}>
      <View style={styles.trainerBadgeRow}>
        <View style={styles.trainerBadge}>
          <Image
            source={require('@/assets/images/logos/rounded_logo.webp')}
            style={styles.trainerBadgeLogo}
            resizeMode="contain"
          />
          <AppText style={styles.trainerBadgeText}>Entrenador Fitech</AppText>
        </View>
      </View>

      <HomeSectionContainer
        title="MIS PAGOS"
        onClick={() => router.push(ROUTES.trainerPayments)}
        titleStyle={styles.sectionTitle}
      >
        {paymentsLoading ? (
          <TrainerPaymentsSkeleton />
        ) : (
          <View style={styles.pagosCard}>
            <View style={styles.summaryCardsRow}>
              <SummaryCard
                icon={
                  <Ionicons name="checkmark-done" size={18} color="#FFF" />
                }
                label="COBRADO HASTA LA FECHA"
                amount={paymentsSummary?.collectedToDate}
                tone="green"
              />
              <SummaryCard
                icon={<Ionicons name="time-outline" size={18} color="#FFF" />}
                label="PENDIENTE DE COBRO"
                amount={paymentsSummary?.pendingCollection}
                tone="blue"
              />
              <SummaryCard
                icon={
                  <MaterialCommunityIcons
                    name="wallet-outline"
                    size={18}
                    color="#FFF"
                  />
                }
                label="DISPONIBLE PARA COBRAR"
                amount={paymentsSummary?.availableForCollection}
                tone="orange"
              />
            </View>
          </View>
        )}
      </HomeSectionContainer>

      {reviewsLoading ? (
        <ReviewsCarouselSkeleton />
      ) : reviews?.content && reviews.content.length > 0 ? (
        <View style={styles.reviewsSection}>
          <AppText style={styles.sectionTitle}>ÚLTIMAS VALORACIONES</AppText>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.reviewsScrollContent}
          >
            {reviews.content.slice(0, 4).map((review) => {
              const emojiIndex = (review?.rating ?? 3) - 1;
              return (
                <Animated.View
                  key={review?.id}
                  entering={FadeInUp.delay(100).duration(500)}
                  style={styles.reviewCard}
                >
                  <AppText style={styles.reviewCardName}>
                    {review?.clientName}
                  </AppText>
                  <View style={styles.reviewCardRatingRow}>
                    <AppText style={styles.reviewEmoji}>
                      {EMOJIS[emojiIndex]}
                    </AppText>
                    <AppText style={styles.reviewCardLabel}>
                      {EMOJIS_LABEL[emojiIndex]}
                    </AppText>
                  </View>
                  <AppText style={styles.reviewCardCommentTitle}>
                    Comentario:
                  </AppText>
                  <AppText style={styles.reviewCardComment} numberOfLines={3}>
                    {truncateWords(review?.comment ?? '', 20)}
                  </AppText>
                </Animated.View>
              );
            })}
          </ScrollView>
        </View>
      ) : null}
    </View>
  );
}

const getStyles = (theme: AppTheme) => {
  const text = textStyles(theme);
  return StyleSheet.create({
    contentWrapper: {
      rowGap: 24,
    },
    trainerBadgeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
    trainerBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      backgroundColor: theme.background.input,
      paddingVertical: 6,
      paddingHorizontal: 10,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: theme.border.default,
    },
    trainerBadgeLogo: {
      width: 20,
      height: 20,
    },
    trainerBadgeText: {
      ...text.captionSemibold,
      letterSpacing: 0.3,
    },
    pagosCard: {
      backgroundColor: theme.background.card,
      borderRadius: 16,
      padding: 14,
      borderWidth: 1,
      borderColor: theme.border.default,
      borderLeftWidth: 4,
      borderLeftColor: theme.brand.primary,
    },
    summaryCardsRow: {
      gap: 10,
    },
    sectionTitle: {
      ...text.overline,
      marginBottom: 8,
    },
    reviewsSection: {
      rowGap: 8,
    },
    reviewsScrollContent: {
      columnGap: 12,
    },
    reviewCard: {
      backgroundColor: theme.background.card,
      borderRadius: 16,
      padding: 14,
      borderWidth: 1,
      borderColor: theme.border.default,
      maxWidth: 200,
      alignSelf: 'flex-start',
      rowGap: 6,
    },
    reviewCardName: {
      ...text.leadSemibold,
    },
    reviewCardRatingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    reviewEmoji: {
      ...text.sectionTitle,
    },
    reviewCardLabel: {
      ...text.small,
      color: theme.text.secondary,
    },
    reviewCardCommentTitle: {
      ...text.smallSemibold,
      color: theme.text.secondary,
    },
    reviewCardComment: {
      ...text.subheader,
    },
  });
};
