import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import CancelModal from '@/components/contracts/CancelModal';
import CompleteModal from '@/components/contracts/CompleteModal';
import { ContractDetailRow } from '@/components/contracts/ContractDetailRow';
import { FooterActions } from '@/components/FooterActions';
import PageContainer from '@/components/PageContainer';
import { Tag } from '@/components/Tag';
import { ROUTES } from '@/constants/routes';
import { TRANSLATIONS } from '@/constants/strings';
import { textStyles } from '@/constants/styles';
import { useAlert } from '@/contexts/AlertContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useCancelContract } from '@/lib/api/mutations/use-cancel-contract';
import { useCompleteContract } from '@/lib/api/mutations/use-complete-contract';
import { AppTheme } from '@/types/theme';
import { moment } from '@/utils/dates';
import { extractErrorMessage } from '@/utils/errors';
import { getFileUploadViewUrl } from '@/utils/files';

const formatDate = (iso?: string) =>
  iso ? moment(iso).format('D MMM YYYY') : '—';

export default function ContractDetailScreen() {
  const { theme } = useTheme();
  const { contract } = useLocalSearchParams();
  const { mutate: completeContract, isPending: isCompleting } =
    useCompleteContract();
  const { mutate: cancelContract, isPending: isCancelling } =
    useCancelContract();
  const router = useRouter();
  const { showAlert } = useAlert();

  const [displayComplete, setDisplayComplete] = useState(false);
  const [displayCancel, setDisplayCancel] = useState(false);

  const parsedContract = useMemo(
    () => (contract ? JSON.parse(contract as string) : null),
    [contract],
  );

  const styles = getStyles(theme);
  const {
    contractDetailScreen: copy,
    common,
    cancelContractModal,
  } = TRANSLATIONS;

  const handleComplete = useCallback(() => {
    completeContract(parsedContract?.id ?? parsedContract?.contractId, {
      onSuccess: () => {
        setDisplayComplete(false);
        router.push(ROUTES.contracts);
      },
    });
  }, [
    parsedContract?.id,
    parsedContract?.contractId,
    completeContract,
    router,
  ]);

  const handleCancel = useCallback(
    (payload: { reason: string; fileIds: number[] }) => {
      const contractId = parsedContract?.id ?? parsedContract?.contractId;
      if (contractId == null) return;

      cancelContract(
        {
          contractId,
          reason: payload.reason,
          fileIds: payload.fileIds,
        },
        {
          onSuccess: () => {
            setDisplayCancel(false);
            router.push(ROUTES.contracts);
          },
          onError: (error) => {
            showAlert({
              title: common.errorTitle,
              message: extractErrorMessage(
                error,
                cancelContractModal.cancelServerError,
              ),
            });
          },
        },
      );
    },
    [
      parsedContract?.id,
      parsedContract?.contractId,
      cancelContract,
      router,
      showAlert,
      common.errorTitle,
      cancelContractModal.cancelServerError,
    ],
  );

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

  const paymentStatusValue = useMemo(() => {
    const status = parsedContract?.paymentStatus as
      | keyof typeof copy.paymentStatus
      | undefined;
    if (!status) return common.dash;
    return copy.paymentStatus[status] ?? common.dash;
  }, [common.dash, copy.paymentStatus, parsedContract?.paymentStatus]);

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

  const isActive = parsedContract?.contractStatus === 'ACTIVE';
  const actionsBusy = isCompleting || isCancelling;
  const chatId = parsedContract?.chatId;

  const handleOpenChat = useCallback(() => {
    if (chatId == null) return;

    router.push({
      pathname: '/chats/[id]',
      params: {
        id: String(chatId),
        title: parsedContract?.trainerName ?? '',
      },
    });
  }, [chatId, parsedContract?.trainerName, router]);

  const footer = isActive ? (
    <FooterActions
      layout="column"
      primaryLabel={copy.completeButton}
      onPrimary={() => setDisplayComplete(true)}
      cancelLabel={copy.cancelButton}
      onCancel={() => setDisplayCancel(true)}
      primaryDisabled={actionsBusy}
      cancelDisabled={actionsBusy}
    />
  ) : undefined;

  return (
    <PageContainer
      title={parsedContract?.serviceName ?? copy.defaultTitle}
      includeTabBarPadding={false}
      hasBottomPadding={false}
      footer={footer}
    >
      <View style={styles.card}>
        {statusTag ? <View style={styles.statusRow}>{statusTag}</View> : null}

        {parsedContract?.trainerName ? (
          chatId != null && isActive ? (
            <View style={styles.trainerRow}>
              <View style={styles.trainerRowContent}>
                <ContractDetailRow
                  avatarUri={trainerAvatarUri}
                  icon="person-outline"
                  label={copy.trainerLabel}
                  value={parsedContract.trainerName}
                />
              </View>
              <Pressable
                onPress={handleOpenChat}
                accessibilityRole="button"
                accessibilityLabel={copy.openChatButton}
                style={({ pressed }) => [
                  styles.chatButton,
                  pressed && styles.chatButtonPressed,
                ]}
              >
                <Ionicons
                  name="chatbubble-outline"
                  size={20}
                  color={theme.brand.primary}
                />
              </Pressable>
            </View>
          ) : (
            <ContractDetailRow
              avatarUri={trainerAvatarUri}
              icon="person-outline"
              label={copy.trainerLabel}
              value={parsedContract.trainerName}
            />
          )
        ) : null}

        {(parsedContract?.startDate || parsedContract?.endDate) && (
          <ContractDetailRow
            icon="calendar-outline"
            label={copy.validityLabel}
            value={validityValue}
          />
        )}

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
          value={paymentStatusValue}
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

      <CompleteModal
        isOpen={displayComplete}
        onCloseModal={() => setDisplayComplete(false)}
        onComplete={handleComplete}
        confirmLoading={isCompleting}
        confirmLoadingLabel={TRANSLATIONS.common.updating}
      />
      <CancelModal
        isOpen={displayCancel}
        onCloseModal={() => setDisplayCancel(false)}
        onCancel={handleCancel}
        confirmLoading={isCancelling}
        confirmLoadingLabel={TRANSLATIONS.common.updating}
      />
    </PageContainer>
  );
}

const getStyles = (theme: AppTheme) => {
  const text = textStyles(theme);
  return StyleSheet.create({
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
    },
    trainerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: 12,
    },
    trainerRowContent: {
      flex: 1,
      minWidth: 0,
    },
    chatButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.brand.primarySoft,
      borderWidth: 1,
      borderColor: theme.border.default,
      flexShrink: 0,
    },
    chatButtonPressed: {
      opacity: 0.85,
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
  });
};
