import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import moment from 'moment';
import { useCallback, useMemo, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { ROUTES } from '@/constants/routes';
import { useTheme } from '@/contexts/ThemeContext';
import { FullTheme } from '@/types/theme';

import { useCancelContract } from '@/lib/api/mutations/use-cancel-contract';
import { useCompleteContract } from '@/lib/api/mutations/use-complete-contract';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import PageContainer from '@/components/PageContainer';
import { Tag } from '@/components/Tag';

import CancelModal from '@/components/contracts/CancelModal';
import CompleteModal from '@/components/contracts/CompleteModal';

moment.locale('es');

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

  const handleComplete = useCallback(() => {
    completeContract(parsedContract?.id ?? parsedContract?.contractId, {
      onSuccess: () => {
        router.push(ROUTES.contracts);
      },
    });
  }, [parsedContract?.id, parsedContract?.contractId, completeContract, router]);

  const handleCancel = useCallback(() => {
    cancelContract(parsedContract?.id ?? parsedContract?.contractId, {
      onSuccess: () => {
        router.push(ROUTES.contracts);
      },
    });
  }, [parsedContract?.id, parsedContract?.contractId, cancelContract, router]);

  const hasDates =
    parsedContract?.startDate || parsedContract?.endDate;
  const createdAtFormatted = parsedContract?.createdAt
    ? moment(parsedContract.createdAt).format('D MMM YYYY')
    : '—';

  const statusTag = (() => {
    const status = parsedContract?.contractStatus;
    if (status === 'ACTIVE') return null;
    if (status === 'CANCELLED')
      return (
        <Tag
          backgroundColor={theme.errorBackground}
          textColor={theme.errorText}
          label="Cancelado"
        />
      );
    return (
      <Tag
        backgroundColor={theme.backgroundInput}
        textColor={theme.textSecondary}
        label="Completado"
      />
    );
  })();

  return (
    <PageContainer
      title={parsedContract?.serviceName ?? 'Detalles del Contrato'}
      style={styles.pageStyle}
    >
      <View style={styles.card}>
        {statusTag ? (
          <View style={styles.chipsRow}>{statusTag}</View>
        ) : null}

        {parsedContract?.trainerName ? (
          <View style={styles.row}>
            {parsedContract?.trainerProfilePhotoId ? (
              <Image
                source={{
                  uri: `https://appfitech.com/v1/app/file-upload/view/${parsedContract.trainerProfilePhotoId}`,
                }}
                style={styles.avatar}
              />
            ) : (
              <Ionicons
                name="person-outline"
                size={18}
                color={theme.textSecondary}
                style={styles.rowIcon}
              />
            )}
            <View style={styles.rowContent}>
              <AppText style={styles.rowLabel}>Entrenador</AppText>
              <AppText style={styles.rowValue}>
                {parsedContract.trainerName}
              </AppText>
            </View>
          </View>
        ) : null}

        {hasDates && (
          <View style={styles.row}>
            <Ionicons
              name="calendar-outline"
              size={18}
              color={theme.textSecondary}
              style={styles.rowIcon}
            />
            <View style={styles.rowContent}>
              <AppText style={styles.rowLabel}>Vigencia del plan</AppText>
              <AppText style={styles.rowValue}>
                {parsedContract?.startDate && parsedContract?.endDate
                  ? `${formatDate(parsedContract.startDate)} – ${formatDate(parsedContract.endDate)}`
                  : parsedContract?.startDate
                    ? `Desde ${formatDate(parsedContract.startDate)}`
                    : `Hasta ${formatDate(parsedContract.endDate)}`}
              </AppText>
            </View>
          </View>
        )}

        <View style={styles.row}>
          <Ionicons
            name="create-outline"
            size={18}
            color={theme.textSecondary}
            style={styles.rowIcon}
          />
          <View style={styles.rowContent}>
            <AppText style={styles.rowLabel}>Fecha de creación</AppText>
            <AppText style={styles.rowValue}>{createdAtFormatted}</AppText>
          </View>
        </View>

        {parsedContract?.totalAmount != null && (
          <View style={styles.row}>
            <Ionicons
              name="cash-outline"
              size={18}
              color={theme.textSecondary}
              style={styles.rowIcon}
            />
            <View style={styles.rowContent}>
              <AppText style={styles.rowLabel}>Monto total</AppText>
              <AppText style={styles.rowValue}>
                S/ {parsedContract.totalAmount.toFixed(2)}
              </AppText>
            </View>
          </View>
        )}

        <View style={styles.row}>
          <Ionicons
            name="card-outline"
            size={18}
            color={theme.textSecondary}
            style={styles.rowIcon}
          />
          <View style={styles.rowContent}>
            <AppText style={styles.rowLabel}>Estado de pago</AppText>
            <AppText style={styles.rowValue}>
              {parsedContract?.paymentStatus ?? '—'}
            </AppText>
          </View>
        </View>

        {parsedContract?.serviceDescription ? (
          <View style={styles.descriptionBlock}>
            <AppText style={styles.rowLabel}>Descripción</AppText>
            <AppText style={styles.descriptionText}>
              {parsedContract.serviceDescription}
            </AppText>
          </View>
        ) : null}
      </View>

      {parsedContract?.contractStatus === 'ACTIVE' && (
        <View style={styles.actions}>
          <Button
            label="Completar"
            onPress={() => setDisplayComplete(true)}
            type="primary"
            style={styles.actionButton}
          />
          <Button
            label="Cancelar contrato"
            onPress={() => setDisplayCancel(true)}
            type="destructive"
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

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    pageStyle: { paddingBottom: 180 },
    card: {
      backgroundColor: theme.card,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.border,
      padding: 20,
      marginTop: 16,
      rowGap: 20,
    },
    chipsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    rowIcon: {
      marginRight: 12,
      marginTop: 2,
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 12,
    },
    rowContent: {
      flex: 1,
      minWidth: 0,
    },
    rowLabel: {
      fontSize: 11,
      fontWeight: '600',
      color: theme.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: 4,
    },
    rowValue: {
      fontSize: 15,
      fontWeight: '600',
      color: theme.textPrimary,
    },
    descriptionBlock: {
      marginTop: 4,
    },
    descriptionText: {
      fontSize: 15,
      fontWeight: '500',
      color: theme.textSecondary,
      lineHeight: 22,
    },
    actions: {
      marginTop: 24,
      rowGap: 12,
    },
    actionButton: {
      width: '100%',
    },
  });
