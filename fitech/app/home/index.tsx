import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ROUTES } from '@/constants/routes';
import { HEADING_STYLES, SHARED_STYLES } from '@/constants/shared_styles';
import { useTheme } from '@/contexts/ThemeContext';
import { useUserStore } from '@/stores/user';
import { PublicTrainerDtoReadable } from '@/types/api/types.gen';
import { FullTheme } from '@/types/theme';
import { truncateWords } from '@/utils/strings';

import { useSearchTrainers } from '../api/mutations/use-search-trainers';
import { useGetDiets } from '../api/queries/use-get-diets';
import { useGetRoutines } from '../api/queries/use-get-routines';
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
  const token = useUserStore((s) => s.getToken());

  const router = useRouter();
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [trainers, setTrainers] = useState<PublicTrainerDtoReadable[]>([]);
  const insets = useSafeAreaInsets();

  const isTrainer = useUserStore((s) => s.getIsTrainer());

  const { data: reviews } = useTrainerGetReviews(isTrainer);
  const { data: paymentsSummary } = useTrainerGetPaymentsSummary(isTrainer);

  const { data: routines } = useGetRoutines();
  const { data: diets } = useGetDiets();
  const { mutate: searchTrainers } = useSearchTrainers();

  useEffect(() => {
    if (!token) return;

    searchTrainers(
      { query: '' },
      {
        onSuccess: (data) => setTrainers(data),
      },
    );
  }, [token]);

  const handleTrainersClick = useCallback(() => {
    router.push(isTrainer ? ROUTES.trainerClients : ROUTES.trainers);
  }, [isTrainer]);

  const handleActivityViewAll = useCallback(() => {
    router.push(isTrainer ? ROUTES.trainerReviews : ROUTES.workouts);
  }, [isTrainer]);

  const handleMacrosNav = useCallback(() => {
    router.push(ROUTES.macrosCalculator);
  }, []);

  return (
    <View style={[styles.wrapper, { paddingTop: insets.top }]}>
      <GreetingHeader />

      <PageContainer
        hasBackButton={false}
        hasNoTopPadding
        style={{ padding: 0, paddingBottom: 0 }}
      >
        <View style={styles.contentWrapper}>
          {!isTrainer && <MacrosCard />}

          {isTrainer && (
            <>
              <Image
                source={require('../../assets/images/trainer.png')}
                style={styles.image}
                resizeMode={'cover'}
              />
              <AppText style={styles.sectionTitle}>Mis Pagos</AppText>
              <View style={{ gap: 12, marginVertical: 6 }}>
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
              contentContainerStyle={{ columnGap: 8 }}
            >
              {reviews?.content?.slice(0, 4)?.map((review) => {
                const emojiIndex = (review?.rating ?? 3) - 1;

                return (
                  <Animated.View
                    key={review?.id}
                    entering={FadeInUp.delay(100).duration(500)}
                    style={[
                      styles.card,
                      {
                        backgroundColor: theme.dark200,
                        maxWidth: 200,
                        alignSelf: 'flex-start',
                        padding: 10,
                      },
                    ]}
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
      backgroundColor: theme.backgroundInverted,
    },
    headerWrapper: {
      paddingVertical: 16,
      rowGap: 16,
      backgroundColor: theme.backgroundInverted,
    },
    headerRow: {
      paddingHorizontal: 16,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    avatarRow: {
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: 12,
    },
    contentWrapper: {
      backgroundColor: theme.dark100,
      padding: 16,
      rowGap: 20,
      paddingBottom: 300,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    sectionTitle: {
      color: theme.textPrimary,
      fontWeight: '700',
      fontSize: 16,
    },
    sectionAction: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    sectionActionText: {
      color: theme.successText,
      fontSize: 14,
      fontWeight: '700',
    },
    cardTitle: {
      fontWeight: '600',
      fontSize: 17,
      color: theme.textPrimary,
    },
    cardSub: {
      fontSize: 16,
      color: theme.textSecondary,
    },
    cardSubBold: {
      color: theme.textSecondary,
      fontWeight: '700',
    },
    greeting: {
      ...HEADING_STYLES(theme).title,
      fontWeight: '700',
      color: theme.dark100,
    },
    subtext: {
      ...HEADING_STYLES(theme).subtitle,
      textAlign: 'left',
    },
    avatar: {
      width: 50,
      height: 50,
      borderRadius: 50,
    },
    iconWrapper: {
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 10,
    },
    ...SHARED_STYLES(theme),
    card: {
      backgroundColor: theme.primaryBg,
      borderRadius: 16,
      padding: 20,
      shadowColor: theme.backgroundInverted,
      shadowOpacity: 0.05,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 8,
      elevation: 4,
      rowGap: 8,
    },
  });
