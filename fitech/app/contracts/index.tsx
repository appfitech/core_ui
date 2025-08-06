import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { ROUTES } from '@/constants/routes';
import { HEADING_STYLES } from '@/constants/shared_styles';
import { useTheme } from '@/contexts/ThemeContext';
import { ReviewableContractDto } from '@/types/api/types.gen';
import { FullTheme } from '@/types/theme';

import {
  useSubmitReview,
  useUpdateReview,
} from '../api/mutations/use-submit-review';
import { useGetActiveContracts } from '../api/queries/use-get-active-contracts';
import { useGetInactiveContracts } from '../api/queries/use-get-inactive-contracts';
import { useGetReviews } from '../api/queries/use-get-reviews';
import { AppText } from '../components/AppText';
import PageContainer from '../components/PageContainer';
import { Tag } from '../components/Tag';
import { ReviewModal } from './ReviewModal';

export default function ContractsScreen() {
  const [filter, setFilter] = useState<'ACTIVE' | 'INACTIVE'>('ACTIVE');
  const { theme } = useTheme();
  const router = useRouter();

  const { data: activeContracts, refetch: refetchActiveContracts } =
    useGetActiveContracts();
  const { data: inactiveContracts, refetch: refetchInactiveContracts } =
    useGetInactiveContracts();
  const { mutate: submitReview } = useSubmitReview();
  const { mutate: updateReview } = useUpdateReview();
  const { refetch: refetchReviews } = useGetReviews();

  const [displayReview, setDisplayReview] = useState(false);
  const [selectedContractId, setSelectedContractId] = useState<number | null>(
    null,
  );
  const [selectedReviewId, setSelectedReviewId] = useState<number | null>(null);

  const styles = getStyles(theme);

  const filteredContracts = useMemo(
    () => (filter === 'ACTIVE' ? activeContracts : inactiveContracts),
    [activeContracts, inactiveContracts, filter],
  );

  const handleDetails = (contract: ReviewableContractDto) => {
    if (!contract?.serviceId) {
      return;
    }

    router.push({
      pathname: `${ROUTES.contracts}/${contract?.serviceId}`,
      params: { contract: JSON.stringify(contract) },
    });
  };

  const handleSubmitReview = (
    rating: number,
    comment: string,
    anonymous: boolean,
    contractId: number,
    existingReviewId: number | null = null,
  ) => {
    const mutateAction = existingReviewId ? updateReview : submitReview;

    mutateAction(
      {
        serviceContractId: contractId,
        rating,
        comment,
        isAnonymous: anonymous,
        ...(!!existingReviewId ? { reviewId: existingReviewId } : {}),
      },
      {
        onSuccess: () => {
          refetchActiveContracts();
          refetchInactiveContracts();
          refetchReviews();
        },
      },
    );
  };

  return (
    <PageContainer style={{ padding: 16 }}>
      <AppText style={styles.title}>Mis Contratos</AppText>
      <AppText style={styles.subtitle}>
        Gestiona tus contratos de servicios de entrenamiento
      </AppText>

      <View style={styles.tabRow}>
        {['ACTIVE', 'INACTIVE'].map((status) => (
          <TouchableOpacity
            key={status}
            style={[
              styles.tabButton,
              filter === status && styles.tabButtonActive,
            ]}
            onPress={() => setFilter(status as 'ACTIVE' | 'INACTIVE')}
          >
            <AppText
              style={[
                styles.tabText,
                filter === status && styles.tabTextActive,
              ]}
            >
              {status === 'ACTIVE' ? 'Activos' : 'Completados'}
            </AppText>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ rowGap: 20, marginBottom: 100 }}>
        {filteredContracts?.map((contract) => (
          <View key={contract.id ?? contract?.contractId} style={styles.card}>
            <AppText style={styles.cardTitle}>{contract.serviceName}</AppText>
            <View style={styles.cardRow}>
              <Feather name="user" size={18} color={theme.dark700} />
              <AppText style={styles.cardInfo}>
                Trainer: {contract.trainerName}
              </AppText>
            </View>
            {contract?.completionDate && (
              <View style={styles.cardRow}>
                <Feather name="calendar" size={18} color={theme.dark700} />
                <AppText style={styles.cardInfo}>
                  Fecha de fin: {contract.startDate ?? contract?.completionDate}
                </AppText>
              </View>
            )}
            {contract?.totalAmount && (
              <View style={styles.cardRow}>
                <Feather name="dollar-sign" size={18} color={theme.dark700} />
                <AppText style={styles.cardInfo}>
                  Monto: S/ {contract.totalAmount.toFixed(2)}
                </AppText>
              </View>
            )}
            {contract.contractStatus === 'ACTIVE' && (
              <Tag
                backgroundColor={theme.successBackground}
                textColor={theme.successText}
                label={'Activo'}
              />
            )}
            {contract.contractStatus === 'COMPLETED' && (
              <Tag
                backgroundColor={theme.dark500}
                textColor={theme.dark100}
                label={'Completado'}
              />
            )}
            {contract.contractStatus === 'CANCELLED' && (
              <Tag
                backgroundColor={theme.errorText}
                textColor={theme.errorBorder}
                label={'Cancelado'}
              />
            )}
            <View>
              {
                <TouchableOpacity
                  style={styles.detailsButton}
                  onPress={() => handleDetails(contract)}
                >
                  <AppText style={styles.detailsButtonText}>
                    Ver Detalles&nbsp;
                  </AppText>
                  <Feather
                    name="chevron-right"
                    size={16}
                    color={theme.dark900}
                  />
                </TouchableOpacity>
              }
              {['CANCELLED', 'COMPLETED'].includes(contract.contractStatus) && (
                <TouchableOpacity
                  style={styles.reviewButton}
                  onPress={() => {
                    setDisplayReview(true);
                    contract?.contractId &&
                      setSelectedContractId(contract?.contractId);
                    contract?.existingReviewId &&
                      setSelectedReviewId(contract?.existingReviewId);
                  }}
                >
                  <AppText style={styles.reviewButtonText}>
                    {contract?.existingReviewId
                      ? 'Editar Reseña'
                      : 'Dejar Reseña'}
                  </AppText>
                  <Feather
                    name="chevron-right"
                    size={16}
                    color={theme.infoBackground}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
      </View>
      <ReviewModal
        isOpen={displayReview}
        contractId={selectedContractId}
        onCloseModal={() => {
          setDisplayReview(false);
          setSelectedContractId(null);
          setSelectedReviewId(null);
        }}
        existingReviewId={selectedReviewId}
        onSubmit={handleSubmitReview}
      />
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
      paddingLeft: 10,
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
