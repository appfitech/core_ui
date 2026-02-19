import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { ROUTES } from '@/constants/routes';
import { HEADING_STYLES } from '@/constants/shared_styles';
import { useTheme } from '@/contexts/ThemeContext';
import { FullTheme } from '@/types/theme';
import { truncateWords } from '@/utils/strings';

import { useTrainerGetPaymentsSummary } from '../api/queries/use-trainer-get-payments';
import { useTrainerGetReviews } from '../api/queries/use-trainer-get-reviews';
import { AppText } from '../components/AppText';
import { HomeSectionContainer } from '../components/HomeSectionContainer';
import { SummaryCard } from '../trainer-payments';

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
      <View style={styles.heroImageWrap}>
        <Image
          source={require('../../assets/images/trainer.png')}
          style={styles.heroImage}
          resizeMode="cover"
        />
      </View>

      <HomeSectionContainer
        title="Mis Pagos"
        onClick={() => router.push(ROUTES.trainerPayments)}
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
          <AppText style={styles.sectionTitle}>Últimas valoraciones</AppText>
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

const getStyles = (theme: FullTheme) => {
  const headings = HEADING_STYLES(theme);
  return StyleSheet.create({
    contentWrapper: {
      rowGap: 24,
    },
    heroImageWrap: {
      alignItems: 'center',
      marginBottom: 4,
    },
    heroImage: {
      width: '100%',
      maxWidth: 320,
      height: 180,
      borderRadius: 16,
      overflow: 'hidden',
      backgroundColor: theme.backgroundInput,
    },
    pagosCard: {
      backgroundColor: theme.card,
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: theme.border,
    },
    summaryCardsRow: {
      gap: 12,
    },
    sectionTitle: {
      ...headings.title,
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
};
