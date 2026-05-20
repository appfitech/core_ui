import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Tag } from '@/components/Tag';
import { TRANSLATIONS } from '@/constants/strings';
import { textStyles } from '@/constants/styles';
import { useTheme } from '@/contexts/ThemeContext';
import { ReviewableContractDto } from '@/types/api/types.gen';
import { AppTheme } from '@/types/theme';

type Props = {
  contract: ReviewableContractDto;
  onViewDetail: () => void;
  onReview?: () => void;
};

const { contractsScreen: copy } = TRANSLATIONS;

export function ContractCard({ contract, onViewDetail, onReview }: Props) {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const statusTag =
    contract.contractStatus === 'COMPLETED' ? (
      <Tag
        backgroundColor={theme.background.input}
        textColor={theme.text.secondary}
        label={copy.statusCompleted}
      />
    ) : contract.contractStatus === 'CANCELLED' ? (
      <Tag
        backgroundColor={theme.status.error.bg}
        textColor={theme.status.error.text}
        label={copy.statusCancelled}
      />
    ) : null;

  const startDate = (contract as { startDate?: string }).startDate;
  const dateLine =
    startDate && contract.endDate
      ? copy.dateRange
          .replace('{start}', formatDate(startDate))
          .replace('{end}', formatDate(contract.endDate))
      : startDate
        ? copy.dateFrom.replace('{date}', formatDate(startDate))
        : contract.endDate
          ? copy.dateUntil.replace('{date}', formatDate(contract.endDate))
          : null;

  const amount = (contract as { totalAmount?: number }).totalAmount;
  const showReview =
    onReview &&
    ['CANCELLED', 'COMPLETED'].includes(contract.contractStatus ?? '');

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <AppText style={styles.title} numberOfLines={2}>
          {contract.serviceName}
        </AppText>
        {statusTag}
      </View>

      {contract.trainerName ? (
        <InfoRow
          icon="person-outline"
          text={contract.trainerName}
          styles={styles}
          theme={theme}
        />
      ) : null}

      {dateLine ? (
        <InfoRow
          icon="calendar-outline"
          text={dateLine}
          styles={styles}
          theme={theme}
        />
      ) : null}

      {amount != null ? (
        <InfoRow
          icon="cash-outline"
          text={copy.amount.replace('{amount}', amount.toFixed(2))}
          styles={styles}
          theme={theme}
        />
      ) : null}

      <View style={styles.footer}>
        <Pressable style={styles.detailLink} onPress={onViewDetail}>
          <AppText style={styles.detailText}>{copy.viewDetail}</AppText>
          <Ionicons
            name="chevron-forward"
            size={16}
            color={theme.brand.primary}
          />
        </Pressable>

        {showReview ? (
          <Pressable style={styles.reviewButton} onPress={onReview}>
            <Ionicons
              name="star-outline"
              size={14}
              color={theme.brand.primary}
            />
            <AppText style={styles.reviewText}>
              {contract.existingReviewId ? copy.editReview : copy.leaveReview}
            </AppText>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

function InfoRow({
  icon,
  text,
  styles,
  theme,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  text: string;
  styles: ReturnType<typeof getStyles>;
  theme: AppTheme;
}) {
  return (
    <View style={styles.row}>
      <Ionicons name={icon} size={15} color={theme.text.tertiary} />
      <AppText style={styles.rowText} numberOfLines={1}>
        {text}
      </AppText>
    </View>
  );
}

function formatDate(iso: string) {
  const date = new Date(iso);
  return date.toLocaleDateString('es-PE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

const getStyles = (theme: AppTheme) => {
  const text = textStyles(theme);

  return StyleSheet.create({
    card: {
      backgroundColor: theme.background.card,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border.default,
      padding: 14,
      rowGap: 8,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      columnGap: 8,
    },
    title: {
      ...text.linkSemibold,
      flex: 1,
      color: theme.text.primary,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: 8,
    },
    rowText: {
      ...text.small,
      flex: 1,
      color: theme.text.secondary,
    },
    footer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 4,
      paddingTop: 10,
      paddingBottom: 4,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: theme.border.default,
    },
    detailLink: {
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: 2,
    },
    detailText: {
      ...text.smallSemibold,
      color: theme.brand.primary,
    },
    reviewButton: {
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: 4,
      paddingVertical: 6,
      paddingHorizontal: 10,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: theme.brand.primary,
      backgroundColor: theme.brand.primarySoft,
    },
    reviewText: {
      ...text.captionSemibold,
      color: theme.brand.primary,
    },
  });
};
