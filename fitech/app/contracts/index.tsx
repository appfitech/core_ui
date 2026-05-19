import { Ionicons } from '@expo/vector-icons';
import { type Href, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { ReviewModal } from '@/components/contracts/ReviewModal';
import PageContainer from '@/components/PageContainer';
import { Tag } from '@/components/Tag';
import { ROUTES } from '@/constants/routes';
import { useTheme } from '@/contexts/ThemeContext';
import {
  useSubmitReview,
  useUpdateReview,
} from '@/lib/api/mutations/use-submit-review';
import { useGetActiveContracts } from '@/lib/api/queries/use-get-active-contracts';
import { useGetInactiveContracts } from '@/lib/api/queries/use-get-inactive-contracts';
import { useGetReviews } from '@/lib/api/queries/use-get-reviews';
import { ReviewableContractDto } from '@/types/api/types.gen';
import { FullTheme } from '@/types/theme';
import { moment } from '@/utils/dates';

const formatDate = (iso?: string) =>
  iso ? moment(iso).format('D MMM YYYY') : '—';

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
    if (!contract?.serviceId) return;
    router.push({
      pathname: '/contracts/[id]',
      params: {
        id: String(contract.serviceId),
        contract: JSON.stringify(contract),
      },
    });
  };

  const handleSubmitReview = (
    rating: number,
    comment: string,
    anonymous: boolean,
    contractId: number,
    existingReviewId: number | null = null,
  ) => {
    const onSuccess = () => {
      refetchActiveContracts();
      refetchInactiveContracts();
      refetchReviews();
    };

    if (existingReviewId) {
      updateReview(
        {
          serviceContractId: contractId,
          rating,
          comment,
          isAnonymous: anonymous,
          reviewId: existingReviewId,
        },
        { onSuccess },
      );
      return;
    }

    submitReview(
      {
        serviceContractId: contractId,
        rating,
        comment,
        isAnonymous: anonymous,
      },
      { onSuccess },
    );
  };

  const getStatusTag = (contract: ReviewableContractDto) => {
    if (contract.contractStatus === 'ACTIVE') return null;
    if (contract.contractStatus === 'COMPLETED')
      return (
        <Tag
          backgroundColor={theme.backgroundInput}
          textColor={theme.textSecondary}
          label="Completado"
        />
      );
    if (contract.contractStatus === 'CANCELLED')
      return (
        <Tag
          backgroundColor={theme.errorBackground}
          textColor={theme.errorText}
          label="Cancelado"
        />
      );
    return null;
  };

  return (
    <PageContainer
      title="Mis Contratos"
      subheader="Gestiona tus contratos de servicios de entrenamiento"
      style={styles.pageStyle}
    >
      <View style={styles.filterCard}>
        <AppText style={styles.filterHint}>
          Mostrar solo contratos activos o completados
        </AppText>
        <View style={styles.tabRow}>
          {(['ACTIVE', 'INACTIVE'] as const).map((status) => {
            const isActive = filter === status;
            return (
              <TouchableOpacity
                key={status}
                style={[styles.tabButton, isActive && styles.tabButtonActive]}
                onPress={() => setFilter(status)}
              >
                <AppText
                  style={[styles.tabText, isActive && styles.tabTextActive]}
                >
                  {status === 'ACTIVE' ? 'Activos' : 'Completados'}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.list}>
        {filteredContracts?.length === 0 ? (
          <View style={styles.emptyWrap}>
            <AppText style={styles.emptyText}>
              No hay contratos con el filtro aplicado
            </AppText>
            <AppText style={styles.emptyHint}>
              Prueba otro filtro o vuelve más tarde
            </AppText>
          </View>
        ) : (
          filteredContracts?.map((contract, index) => {
            const statusTag = getStatusTag(contract);
            return (
              <View
                key={contract.contractId ?? contract.serviceId ?? index}
                style={styles.card}
              >
                <AppText style={styles.cardTitle}>
                  {contract.serviceName}
                </AppText>

                {contract.trainerName ? (
                  <View style={styles.cardRow}>
                    <Ionicons
                      name="person-outline"
                      size={18}
                      color={theme.textSecondary}
                      style={styles.cardRowIcon}
                    />
                    <AppText style={styles.cardInfo}>
                      {contract.trainerName}
                    </AppText>
                  </View>
                ) : null}

                {(contract as any)?.startDate || contract?.endDate ? (
                  <View style={styles.cardRow}>
                    <Ionicons
                      name="calendar-outline"
                      size={18}
                      color={theme.textSecondary}
                      style={styles.cardRowIcon}
                    />
                    <AppText style={styles.cardInfo} numberOfLines={1}>
                      {(contract as any)?.startDate && contract?.endDate
                        ? `${formatDate((contract as any).startDate)} – ${formatDate(contract.endDate)}`
                        : (contract as any)?.startDate
                          ? `Desde ${formatDate((contract as any).startDate)}`
                          : `Hasta ${formatDate(contract.endDate)}`}
                    </AppText>
                  </View>
                ) : null}

                {(contract as any)?.totalAmount != null ? (
                  <View style={styles.cardRow}>
                    <Ionicons
                      name="cash-outline"
                      size={18}
                      color={theme.textSecondary}
                      style={styles.cardRowIcon}
                    />
                    <AppText style={styles.cardInfo}>
                      S/ {(contract as any).totalAmount.toFixed(2)}
                    </AppText>
                  </View>
                ) : null}

                {statusTag ? (
                  <View style={styles.tagsRow}>{statusTag}</View>
                ) : null}

                <View style={styles.ctaRow}>
                  <TouchableOpacity
                    style={styles.ctaButton}
                    onPress={() => handleDetails(contract)}
                  >
                    <AppText style={styles.ctaText}>Ver detalle</AppText>
                    <Ionicons
                      name="chevron-forward"
                      size={18}
                      color={theme.primaryText}
                    />
                  </TouchableOpacity>
                </View>

                {['CANCELLED', 'COMPLETED'].includes(
                  contract.contractStatus ?? '',
                ) && (
                  <TouchableOpacity
                    style={styles.reviewButton}
                    onPress={() => {
                      setDisplayReview(true);
                      contract?.contractId &&
                        setSelectedContractId(contract.contractId);
                      contract?.existingReviewId &&
                        setSelectedReviewId(contract.existingReviewId);
                    }}
                  >
                    <AppText style={styles.reviewButtonText}>
                      {contract?.existingReviewId
                        ? 'Editar Reseña'
                        : 'Dejar Reseña'}
                    </AppText>
                    <Ionicons
                      name="chevron-forward"
                      size={16}
                      color={theme.infoText}
                    />
                  </TouchableOpacity>
                )}
              </View>
            );
          })
        )}
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
    pageStyle: { paddingBottom: 180 },
    filterCard: {
      backgroundColor: theme.backgroundInput,
      borderRadius: 12,
      borderLeftWidth: 4,
      borderLeftColor: theme.primary,
      paddingVertical: 14,
      paddingHorizontal: 16,
      marginTop: 16,
    },
    filterHint: {
      fontSize: 12,
      color: theme.textSecondary,
      marginBottom: 10,
    },
    tabRow: {
      flexDirection: 'row',
      columnGap: 10,
      flexWrap: 'wrap',
    },
    tabButton: {
      paddingVertical: 10,
      paddingHorizontal: 18,
      alignItems: 'center',
      borderRadius: 999,
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
    },
    tabButtonActive: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    tabText: {
      fontSize: 15,
      color: theme.textPrimary,
      fontWeight: '600',
    },
    tabTextActive: {
      color: theme.background,
      fontWeight: '700',
    },
    list: {
      marginTop: 20,
      rowGap: 16,
    },
    emptyWrap: {
      marginTop: 24,
      paddingVertical: 32,
      paddingHorizontal: 24,
      alignItems: 'center',
    },
    emptyText: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.textPrimary,
      textAlign: 'center',
    },
    emptyHint: {
      fontSize: 14,
      color: theme.textSecondary,
      marginTop: 8,
      textAlign: 'center',
    },
    card: {
      backgroundColor: theme.card,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: theme.border,
      padding: 18,
      paddingBottom: 14,
    },
    cardTitle: {
      fontSize: 17,
      fontWeight: '700',
      color: theme.textPrimary,
      marginBottom: 10,
    },
    cardRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    cardRowIcon: {
      marginRight: 10,
    },
    cardInfo: {
      flex: 1,
      fontSize: 14,
      fontWeight: '500',
      color: theme.textSecondary,
      minWidth: 0,
    },
    tagsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginBottom: 12,
    },
    ctaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
    ctaButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    ctaText: {
      fontSize: 14,
      fontWeight: '700',
      color: theme.primaryText,
    },
    reviewButton: {
      marginTop: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 4,
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 10,
      backgroundColor: theme.infoBackground,
    },
    reviewButtonText: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.infoText,
    },
  });
