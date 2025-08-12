import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { ROUTES } from '@/constants/routes';
import { HEADING_STYLES } from '@/constants/shared_styles';
import { useTheme } from '@/contexts/ThemeContext';
import { ReviewableContractDto } from '@/types/api/types.gen';
import { FullTheme } from '@/types/theme';

import {
  useTrainerGetReviews,
  useTrainerGetReviewsBreakdown,
  useTrainerGetReviewsStats,
} from '../api/queries/use-trainer-get-reviews';
import { AppText } from '../components/AppText';
import PageContainer from '../components/PageContainer';
import { Tag } from '../components/Tag';
import { RatingDistribution } from './RatingBreakdown';

export default function ContractsScreen() {
  const { theme } = useTheme();
  const router = useRouter();

  const { data: stats, refetch: refetchActiveContracts } =
    useTrainerGetReviewsStats();
  const { data: breakdown, refetch: refetchInactiveContracts } =
    useTrainerGetReviewsBreakdown();
  const { data: reviews, refetch: refetchReviews } = useTrainerGetReviews();

  const styles = getStyles(theme);

  const handleDetails = (contract: ReviewableContractDto) => {
    if (!contract?.serviceId) {
      return;
    }

    router.push({
      pathname: `${ROUTES.contracts}/${contract?.serviceId}`,
      params: { contract: JSON.stringify(contract) },
    });
  };

  return (
    <PageContainer style={{ padding: 16 }}>
      <AppText style={styles.title}>Mis Calificaciones</AppText>
      <AppText style={styles.subtitle}>
        Revisa las calificaciones y comentarios de tus clientes
      </AppText>

      <View style={{ rowGap: 10, marginBottom: 100, marginTop: 20 }}>
        <View
          style={{
            flex: 1,
            backgroundColor: theme.successBackground,
            flexDirection: 'row',
            alignItems: 'center',
            padding: 16,
            justifyContent: 'space-between',
            borderRadius: 20,
          }}
        >
          <AppText style={{ fontWeight: 600, fontSize: 20 }}>
            {'Total reseñas'}
          </AppText>
          <AppText
            style={{ color: theme.successText, fontSize: 40, fontWeight: 900 }}
          >
            {stats?.totalReviews}
          </AppText>
        </View>
        <View
          style={{
            flex: 1,
            backgroundColor: theme.infoBackground,
            flexDirection: 'row',
            alignItems: 'center',
            padding: 16,
            justifyContent: 'space-between',
            borderRadius: 20,
          }}
        >
          <AppText style={{ fontWeight: 600, fontSize: 20 }}>
            {'Calificación promedio'}
          </AppText>
          <AppText
            style={{ color: theme.infoText, fontSize: 40, fontWeight: 900 }}
          >
            {stats?.averageRating}
          </AppText>
        </View>
        {breakdown && <RatingDistribution data={breakdown} />}
        {reviews?.content?.map((review) => (
          <View key={review.id ?? review?.contractId} style={styles.card}>
            <AppText style={styles.cardTitle}>{review.clientName}</AppText>
            <View style={styles.cardRow}>
              <AppText style={styles.cardInfo}>{review.comment}</AppText>
            </View>
            <Tag
              backgroundColor={theme.infoBackground}
              textColor={theme.infoText}
              label={review?.serviceName}
            />
            <View>
              <TouchableOpacity
                style={styles.detailsButton}
                onPress={() => handleDetails(review)}
              >
                <AppText style={styles.detailsButtonText}>Responder</AppText>
                <Feather name="chevron-right" size={16} color={theme.dark900} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </PageContainer>
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    tabRow: {
      flexDirection: 'row',
      marginVertical: 20,
      overflow: 'hidden',
      columnGap: 16,
    },
    tabButton: {
      paddingVertical: 12,
      paddingHorizontal: 20,
      alignItems: 'center',
      borderRadius: 20,
    },
    tabButtonActive: {
      backgroundColor: theme.backgroundInverted,
    },
    tabText: {
      fontSize: 16,
      color: theme.textPrimary,
      fontWeight: '600',
    },
    tabTextActive: {
      color: theme.dark100,
    },
    card: {
      backgroundColor: theme.dark100,
      borderRadius: 16,
      borderColor: theme.green400,
      borderWidth: 1,
      padding: 16,
      rowGap: 6,
    },
    cardTitle: {
      fontSize: 17.5,
      fontWeight: '600',
      color: theme.dark700,
      marginBottom: 8,
    },
    cardRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 6,
    },
    cardInfo: {
      fontSize: 15,
      color: theme.dark800,
    },
    detailsButton: {
      marginTop: 12,
      backgroundColor: theme.green400,
      padding: 12,
      borderRadius: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    reviewButton: {
      marginTop: 10,
      backgroundColor: theme.infoText,
      padding: 12,
      borderRadius: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    detailsButtonText: {
      color: theme.dark900,
      fontWeight: '500',
      fontSize: 15,
    },
    reviewButtonText: {
      color: theme.infoBackground,
      fontWeight: '500',
      fontSize: 15,
    },
    ...HEADING_STYLES(theme),
  });
