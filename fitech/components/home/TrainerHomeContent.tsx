import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { SummaryCard } from '@/app/trainer-payments';
import { AppText } from '@/components/AppText';
import { HomeSectionContainer } from '@/components/HomeSectionContainer';
import { ROUTES } from '@/constants/routes';
import { useTheme } from '@/contexts/ThemeContext';
import { useTrainerGetPaymentsSummary } from '@/lib/api/queries/use-trainer-get-payments';
import { useTrainerGetReviews } from '@/lib/api/queries/use-trainer-get-reviews';
import { FullTheme } from '@/types/theme';
import { truncateWords } from '@/utils/strings';

const EMOJIS = ['😠', '😕', '😐', '🙂', '😄'];
const EMOJIS_LABEL = ['Muy malo', 'Malo', 'Regular', 'Bueno', 'Muy bueno'];

export function TrainerHomeContent() {
  const router = useRouter();
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const { data: reviews } = useTrainerGetReviews(true);
  const { data: paymentsSummary } = useTrainerGetPaymentsSummary(true);

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
        <View style={styles.pagosCard}>
          <View style={styles.summaryCardsRow}>
            <SummaryCard
              icon={<Ionicons name="checkmark-done" size={18} color="#FFF" />}
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
      </HomeSectionContainer>

      {reviews?.content && reviews.content.length > 0 && (
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
                    {truncateWords(review?.comment, 20)}
                  </AppText>
                </Animated.View>
              );
            })}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
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
      backgroundColor: theme.backgroundInput,
      paddingVertical: 6,
      paddingHorizontal: 10,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: theme.border,
    },
    trainerBadgeLogo: {
      width: 20,
      height: 20,
    },
    trainerBadgeText: {
      fontSize: 12,
      fontWeight: '700',
      color: theme.textSecondary,
      letterSpacing: 0.3,
    },
    pagosCard: {
      backgroundColor: theme.card,
      borderRadius: 16,
      padding: 14,
      borderWidth: 1,
      borderColor: theme.border,
      borderLeftWidth: 4,
      borderLeftColor: theme.primary,
    },
    summaryCardsRow: {
      gap: 10,
    },
    sectionTitle: {
      fontSize: 12,
      fontWeight: '700',
      color: theme.textSecondary,
      letterSpacing: 0.6,
      textTransform: 'uppercase',
      marginBottom: 8,
    },
    reviewsSection: {
      rowGap: 8,
    },
    reviewsScrollContent: {
      columnGap: 12,
    },
    reviewCard: {
      backgroundColor: theme.card,
      borderRadius: 16,
      padding: 14,
      borderWidth: 1,
      borderColor: theme.border,
      maxWidth: 200,
      alignSelf: 'flex-start',
      rowGap: 6,
    },
    reviewCardName: {
      fontSize: 17,
      fontWeight: '600',
      color: theme.textPrimary,
    },
    reviewCardRatingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    reviewEmoji: {
      fontSize: 18,
    },
    reviewCardLabel: {
      fontSize: 14,
      color: theme.textSecondary,
    },
    reviewCardCommentTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.textSecondary,
    },
    reviewCardComment: {
      fontSize: 15,
      color: theme.textSecondary,
      lineHeight: 20,
    },
  });
