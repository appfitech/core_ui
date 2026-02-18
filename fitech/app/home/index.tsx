import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SHARED_STYLES } from '@/constants/shared_styles';
import { useTheme } from '@/contexts/ThemeContext';
import { useUserStore } from '@/stores/user';
import { FullTheme } from '@/types/theme';
import { truncateWords } from '@/utils/strings';

import { useTrainerGetPaymentsSummary } from '../api/queries/use-trainer-get-payments';
import { useTrainerGetReviews } from '../api/queries/use-trainer-get-reviews';
import { AppText } from '../components/AppText';
import { GreetingHeader } from '../components/modules/GreetingHeader';
import { MacrosCard } from '../components/modules/MacrosCard';
import { UserActivitiesSection } from '../components/modules/UserActivitiesSection';
import { UserFavoriteTrainersSection } from '../components/modules/UserFavoriteTrainersSection';
import PageContainer from '../components/PageContainer';
import { SummaryCard } from '../trainer-payments';

const EMOJIS = ['😠', '😕', '😐', '🙂', '😄'];
const EMOJIS_LABEL = ['Muy malo', 'Malo', 'Regular', 'Bueno', 'Muy bueno'];

export default function HomeScreen() {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const insets = useSafeAreaInsets();

  const isTrainer = useUserStore((s) => s.getIsTrainer());

  const { data: reviews } = useTrainerGetReviews(isTrainer);
  const { data: paymentsSummary } = useTrainerGetPaymentsSummary(isTrainer);

  return (
    <View style={[styles.wrapper, { paddingTop: insets.top }]}>
      <GreetingHeader />

      <PageContainer
        hasBackButton={false}
        hasNoTopPadding
        style={{ padding: 0, paddingBottom: 0 }}
      >
        <View style={styles.contentWrapper}>
          {!isTrainer && (
            <View style={styles.macrosCardWrap}>
              <MacrosCard />
            </View>
          )}

          {isTrainer && (
            <>
              <Image
                source={require('../../assets/images/trainer.png')}
                style={styles.image}
                resizeMode="cover"
              />
              <AppText style={styles.sectionTitle}>Mis Pagos</AppText>
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
            </>
          )}

          <UserActivitiesSection />

          {!isTrainer ? null : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.reviewsScrollContent}
            >
              {reviews?.content?.slice(0, 4)?.map((review) => {
                const emojiIndex = (review?.rating ?? 3) - 1;

                return (
                  <Animated.View
                    key={review?.id}
                    entering={FadeInUp.delay(100).duration(500)}
                    style={[styles.card, styles.reviewCard]}
                  >
                    <View style={{ rowGap: 6 }}>
                      {/* Name */}
                      <AppText
                        style={{
                          fontWeight: '600',
                          fontSize: 17,
                          color: theme.dark900,
                        }}
                      >
                        {review?.clientName}
                      </AppText>

                      {/* Emoji + Label */}
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 6,
                        }}
                      >
                        <AppText style={{ fontSize: 18 }}>
                          {EMOJIS[emojiIndex]}
                        </AppText>
                        <AppText
                          style={{ color: theme.textSecondary, fontSize: 14 }}
                        >
                          {EMOJIS_LABEL[emojiIndex]}
                        </AppText>
                      </View>

                      {/* Comment */}
                      <AppText
                        style={{
                          fontWeight: '600',
                          color: theme.textSecondary,
                          fontSize: 14,
                        }}
                        numberOfLines={3}
                      >
                        {'Comentario:'}
                      </AppText>
                      <AppText
                        style={{ color: theme.textSecondary, fontSize: 16 }}
                        numberOfLines={3}
                      >
                        {truncateWords(review?.comment, 20)}
                      </AppText>
                    </View>
                  </Animated.View>
                );
              })}
            </ScrollView>
          )}

          {!isTrainer && <UserFavoriteTrainersSection />}
        </View>
      </PageContainer>
    </View>
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    wrapper: {
      flex: 1,
      position: 'relative',
      backgroundColor: theme.backgroundHeader,
    },
    contentWrapper: {
      backgroundColor: theme.background,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      paddingTop: 24,
      rowGap: 24,
      paddingBottom: 180,
    },
    macrosCardWrap: {
      marginTop: -8,
    },
    sectionTitle: {
      color: theme.textPrimary,
      fontWeight: '700',
      fontSize: 16,
    },
    summaryCardsRow: {
      gap: 12,
      marginVertical: 6,
    },
    ...SHARED_STYLES(theme),
    card: {
      backgroundColor: theme.background,
      borderRadius: 16,
      padding: 20,
      borderWidth: 1,
      borderColor: theme.border,
      rowGap: 8,
    },
    reviewCard: {
      maxWidth: 200,
      alignSelf: 'flex-start',
      padding: 12,
    },
    reviewsScrollContent: {
      columnGap: 12,
    },
  });
