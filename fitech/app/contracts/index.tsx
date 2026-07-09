import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import { ContractCard } from '@/components/contracts/ContractCard';
import { ReviewModal } from '@/components/contracts/ReviewModal';
import { ListEmptyState } from '@/components/list/ListEmptyState';
import { ListFilterSection } from '@/components/list/ListFilterSection';
import PageContainer from '@/components/PageContainer';
import { showInfoToast } from '@/components/Toast';
import {
  CONTRACT_STATUS_CHIPS,
  LIST_SCREEN_FLATLIST,
} from '@/constants/list-screens';
import { TRANSLATIONS } from '@/constants/strings';
import { useAlert } from '@/contexts/AlertContext';
import {
  useSubmitReview,
  useUpdateReview,
} from '@/lib/api/mutations/use-submit-review';
import { useGetActiveContracts } from '@/lib/api/queries/use-get-active-contracts';
import { useGetInactiveContracts } from '@/lib/api/queries/use-get-inactive-contracts';
import { useGetReviews } from '@/lib/api/queries/use-get-reviews';
import { ReviewableContractDto } from '@/types/api/types.gen';
import { extractErrorMessage } from '@/utils/errors';

export default function ContractsScreen() {
  const [filter, setFilter] = useState<'ACTIVE' | 'INACTIVE'>('ACTIVE');
  const router = useRouter();
  const { showAlert } = useAlert();
  const { contractsScreen: copy, common, listFilters } = TRANSLATIONS;

  const { data: activeContracts, refetch: refetchActiveContracts } =
    useGetActiveContracts();
  const { data: inactiveContracts, refetch: refetchInactiveContracts } =
    useGetInactiveContracts();
  const { mutate: submitReview, isPending: isSubmittingReview } =
    useSubmitReview();
  const { mutate: updateReview, isPending: isUpdatingReview } =
    useUpdateReview();
  const isReviewSubmitting = isSubmittingReview || isUpdatingReview;
  const { refetch: refetchReviews } = useGetReviews();

  const [displayReview, setDisplayReview] = useState(false);
  const [selectedContractId, setSelectedContractId] = useState<number | null>(
    null,
  );
  const [selectedReviewId, setSelectedReviewId] = useState<number | null>(null);

  const closeReviewModal = () => {
    setDisplayReview(false);
    setSelectedContractId(null);
    setSelectedReviewId(null);
  };

  const filteredContracts = useMemo(
    () => (filter === 'ACTIVE' ? activeContracts : inactiveContracts) ?? [],
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
      closeReviewModal();
      void refetchActiveContracts();
      void refetchInactiveContracts();
      void refetchReviews();
      showInfoToast(
        existingReviewId ? copy.reviewUpdateSuccess : copy.reviewSubmitSuccess,
      );
    };

    const onError = (error: Error) => {
      showAlert({
        title: common.errorTitle,
        message: extractErrorMessage(error, copy.reviewSubmitError),
        buttons: [{ text: common.understood }],
      });
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
        { onSuccess, onError },
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
      { onSuccess, onError },
    );
  };

  const openReview = (contract: ReviewableContractDto) => {
    setDisplayReview(true);
    setSelectedContractId(contract.contractId ?? null);
    setSelectedReviewId(contract.existingReviewId ?? null);
  };

  const listHeader = (
    <ListFilterSection
      hint={listFilters.contractsStatusHint}
      chips={CONTRACT_STATUS_CHIPS}
      selectedValue={filter}
      onChipPress={(value) => setFilter(value as 'ACTIVE' | 'INACTIVE')}
      style={styles.listHeader}
    />
  );

  return (
    <PageContainer
      title={copy.title}
      subheader={copy.subheader}
      disableScroll
      style={styles.page}
    >
      <FlatList
        data={filteredContracts}
        keyExtractor={(item, index) =>
          String(item.contractId ?? item.serviceId ?? index)
        }
        renderItem={({ item }) => (
          <ContractCard
            contract={item}
            onViewDetail={() => handleDetails(item)}
            onReview={() => openReview(item)}
          />
        )}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={
          <ListEmptyState
            title={copy.emptyTitle}
            hint={common.tryOtherFilterHint}
          />
        }
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        showsVerticalScrollIndicator={false}
        initialNumToRender={LIST_SCREEN_FLATLIST.initialNumToRender}
        maxToRenderPerBatch={LIST_SCREEN_FLATLIST.maxToRenderPerBatch}
        windowSize={LIST_SCREEN_FLATLIST.windowSize}
        removeClippedSubviews={LIST_SCREEN_FLATLIST.removeClippedSubviews}
      />

      <ReviewModal
        isOpen={displayReview}
        contractId={selectedContractId}
        onCloseModal={closeReviewModal}
        existingReviewId={selectedReviewId}
        onSubmit={handleSubmitReview}
        isSubmitting={isReviewSubmitting}
      />
    </PageContainer>
  );
}

const CONTRACT_LIST_GAP = 8;

const styles = StyleSheet.create({
  page: { paddingBottom: 0 },
  listHeader: {
    marginBottom: 16,
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 180,
  },
  separator: { height: CONTRACT_LIST_GAP },
});
