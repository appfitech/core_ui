import { Ionicons } from '@expo/vector-icons';
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
    <PageContainer
      title="Mis Calificaciones"
      subheader="Revisa las calificaciones y comentarios de tus clientes"
      style={styles.pageStyle}
    >
      <View style={styles.statsSection}>
        <View style={styles.statCardSuccess}>
          <AppText style={styles.statCardLabel}>{'Total reseñas'}</AppText>
          <AppText style={styles.statCardValueSuccess}>
            {stats?.totalReviews}
          </AppText>
        </View>
        <View style={styles.statCardInfo}>
          <AppText style={styles.statCardLabel}>
            {'Calificación promedio'}
          </AppText>
          <AppText style={styles.statCardValueInfo}>
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
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={theme.dark900}
                />
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
    pageStyle: { padding: 16 },
    statsSection: { rowGap: 10, marginBottom: 100, marginTop: 20 },
    statCardSuccess: {
      flex: 1,
      backgroundColor: theme.successBackground,
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      justifyContent: 'space-between',
      borderRadius: 20,
    },
    statCardInfo: {
      flex: 1,
      backgroundColor: theme.infoBackground,
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      justifyContent: 'space-between',
      borderRadius: 20,
    },
    statCardLabel: { fontWeight: '600', fontSize: 20 },
    statCardValueSuccess: {
      color: theme.successText,
      fontSize: 40,
      fontWeight: '900',
    },
    statCardValueInfo: {
      color: theme.infoText,
      fontSize: 40,
      fontWeight: '900',
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
    detailsButtonText: {
      color: theme.dark900,
      fontWeight: '500',
      fontSize: 15,
    },
    ...HEADING_STYLES(theme),
  });
