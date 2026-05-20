import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import CancelModal from '@/components/contracts/CancelModal';
import CompleteModal from '@/components/contracts/CompleteModal';
import { ContractDetailRow } from '@/components/contracts/ContractDetailRow';
import PageContainer from '@/components/PageContainer';
import { Tag } from '@/components/Tag';
import { ROUTES } from '@/constants/routes';
import { TRANSLATIONS } from '@/constants/strings';
import { textStyles } from '@/constants/styles';
import { useTheme } from '@/contexts/ThemeContext';
import { useCancelContract } from '@/lib/api/mutations/use-cancel-contract';
import { useCompleteContract } from '@/lib/api/mutations/use-complete-contract';
import { AppTheme } from '@/types/theme';
import { moment } from '@/utils/dates';
import { getFileUploadViewUrl } from '@/utils/files';

const formatDate = (iso?: string) =>
  iso ? moment(iso).format('D MMM YYYY') : '—';

export default function ContractDetailScreen() {
  const { theme } = useTheme();
  const { contract } = useLocalSearchParams();
  const { mutate: completeContract } = useCompleteContract();
  const { mutate: cancelContract } = useCancelContract();
  const router = useRouter();

  const [displayComplete, setDisplayComplete] = useState(false);
  const [displayCancel, setDisplayCancel] = useState(false);

  const parsedContract = useMemo(
    () => (contract ? JSON.parse(contract as string) : null),
    [contract],
  );

  const styles = getStyles(theme);
  const { contractDetailScreen: copy, common } = TRANSLATIONS;

  const handleComplete = useCallback(() => {
    completeContract(parsedContract?.id ?? parsedContract?.contractId, {
      onSuccess: () => {
        router.push(ROUTES.contracts);
      },
    });
  }, [
    parsedContract?.id,
    parsedContract?.contractId,
    completeContract,
    router,
  ]);

  const handleCancel = useCallback(() => {
    cancelContract(parsedContract?.id ?? parsedContract?.contractId, {
      onSuccess: () => {
        router.push(ROUTES.contracts);
      },
    });
  }, [parsedContract?.id, parsedContract?.contractId, cancelContract, router]);

  const createdAtFormatted = parsedContract?.createdAt
    ? moment(parsedContract.createdAt).format('D MMM YYYY')
    : common.dash;

  const validityValue =
    parsedContract?.startDate && parsedContract?.endDate
      ? copy.dateRange
          .replace('{start}', formatDate(parsedContract.startDate))
          .replace('{end}', formatDate(parsedContract.endDate))
      : parsedContract?.startDate
        ? copy.dateFrom.replace('{date}', formatDate(parsedContract.startDate))
        : parsedContract?.endDate
          ? copy.dateUntil.replace('{date}', formatDate(parsedContract.endDate))
          : common.dash;

  const trainerAvatarUri = parsedContract?.trainerProfilePhotoId
    ? getFileUploadViewUrl(parsedContract.trainerProfilePhotoId)
    : null;

  const statusTag = (() => {
    const status = parsedContract?.contractStatus;
    if (status === 'ACTIVE') return null;
    if (status === 'CANCELLED')
      return (
        <Tag
          backgroundColor={theme.status.error.bg}
          textColor={theme.status.error.text}
          label={copy.statusCancelled}
        />
      );
    return (
      <Tag
        backgroundColor={theme.background.input}
        textColor={theme.text.secondary}
        label={copy.statusCompleted}
      />
    );
  })();

  return (
    <PageContainer
      title={parsedContract?.serviceName ?? copy.defaultTitle}
      style={styles.pageStyle}
    >
      <View style={styles.card}>
        {statusTag ? <View style={styles.statusRow}>{statusTag}</View> : null}

        {parsedContract?.trainerName ? (
          <ContractDetailRow
            avatarUri={trainerAvatarUri}
            icon="person-outline"
            label={copy.trainerLabel}
            value={parsedContract.trainerName}
          />
        ) : null}

        {(parsedContract?.startDate || parsedContract?.endDate) && (
          <ContractDetailRow
            icon="calendar-outline"
            label={copy.validityLabel}
            value={validityValue}
          />
        )}

        <ContractDetailRow
          icon="document-text-outline"
          label={copy.createdAtLabel}
          value={createdAtFormatted}
        />

        {parsedContract?.totalAmount != null && (
          <ContractDetailRow
            icon="cash-outline"
            label={copy.amountLabel}
            value={copy.amountValue.replace(
              '{amount}',
              parsedContract.totalAmount.toFixed(2),
            )}
          />
        )}

        <ContractDetailRow
          icon="card-outline"
          label={copy.paymentStatusLabel}
          value={parsedContract?.paymentStatus ?? common.dash}
        />

        {parsedContract?.serviceDescription ? (
          <View style={styles.descriptionBlock}>
            <View style={styles.divider} />
            <AppText style={styles.descriptionLabel}>
              {copy.descriptionLabel}
            </AppText>
            <AppText style={styles.descriptionText}>
              {parsedContract.serviceDescription}
            </AppText>
          </View>
        ) : null}
      </View>

      {parsedContract?.contractStatus === 'ACTIVE' && (
        <View style={styles.actions}>
          <Button
            label={copy.completeButton}
            onPress={() => setDisplayComplete(true)}
            type="primary"
            style={styles.actionButton}
          />
          <Button
            label={copy.cancelButton}
            onPress={() => setDisplayCancel(true)}
            type="secondary"
            style={styles.actionButton}
          />
        </View>
      )}

      <CompleteModal
        isOpen={displayComplete}
        onCloseModal={() => setDisplayComplete(false)}
        onComplete={handleComplete}
      />
      <CancelModal
        isOpen={displayCancel}
        onCloseModal={() => setDisplayCancel(false)}
        onCancel={handleCancel}
      />
    </PageContainer>
  );
}

const getStyles = (theme: AppTheme) => {
  const text = textStyles(theme);
  return StyleSheet.create({
    pageStyle: { paddingBottom: 180 },
    card: {
      backgroundColor: theme.background.card,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border.default,
      padding: 16,
      marginTop: 12,
      rowGap: 12,
    },
    statusRow: {
      alignSelf: 'flex-start',
      marginBottom: 2,
    },
    descriptionBlock: {
      rowGap: 8,
      paddingTop: 4,
    },
    divider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: theme.border.default,
      marginBottom: 4,
    },
    descriptionLabel: {
      ...text.caption,
      color: theme.text.tertiary,
    },
    descriptionText: {
      ...text.small,
      color: theme.text.secondary,
      lineHeight: 20,
    },
    actions: {
      marginTop: 20,
      rowGap: 10,
    },
    actionButton: {
      width: '100%',
    },
  });
};
