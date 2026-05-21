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
    <Pressable
      onPress={onViewDetail}
      accessibilityRole="button"
      accessibilityLabel={`${contract.serviceName ?? 'Contrato'}, ${copy.viewDetail}`}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <View style={styles.headerRow}>
        <View style={styles.titleBlock}>
          <AppText style={styles.title} numberOfLines={2}>
            {contract.serviceName}
          </AppText>
          {statusTag ? (
            <View style={styles.statusWrap}>{statusTag}</View>
          ) : null}
        </View>
        <View style={styles.chevronWrap}>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={theme.text.tertiary}
          />
        </View>
      </View>

      <View style={styles.metaBlock}>
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
            emphasize
          />
        ) : null}
      </View>

      <View style={styles.footer}>
        <View style={styles.detailHint}>
          <AppText style={styles.detailText}>{copy.viewDetail}</AppText>
          <Ionicons
            name="chevron-forward"
            size={16}
            color={theme.brand.primary}
          />
        </View>

        {showReview ? (
          <Pressable
            style={({ pressed }) => [
              styles.reviewButton,
              pressed && styles.reviewButtonPressed,
            ]}
            onPress={() => onReview?.()}
            accessibilityRole="button"
            accessibilityLabel={
              contract.existingReviewId ? copy.editReview : copy.leaveReview
            }
          >
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
    </Pressable>
  );
}

function InfoRow({
  icon,
  text,
  styles,
  theme,
  emphasize = false,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  text: string;
  styles: ReturnType<typeof getStyles>;
  theme: AppTheme;
  emphasize?: boolean;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.rowIconWrap}>
        <Ionicons name={icon} size={14} color={theme.text.tertiary} />
      </View>
      <AppText
        style={[styles.rowText, emphasize && styles.rowTextEmphasize]}
        numberOfLines={1}
      >
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
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.border.default,
      padding: 16,
      rowGap: 12,
    },
    cardPressed: {
      backgroundColor: theme.background.input,
      borderColor: theme.border.strong,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      columnGap: 10,
    },
    titleBlock: {
      flex: 1,
      minWidth: 0,
      rowGap: 8,
    },
    title: {
      ...text.leadSemibold,
      color: theme.text.primary,
    },
    statusWrap: {
      alignSelf: 'flex-start',
    },
    chevronWrap: {
      paddingTop: 2,
    },
    metaBlock: {
      rowGap: 8,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: 10,
    },
    rowIconWrap: {
      width: 28,
      height: 28,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.background.input,
    },
    rowText: {
      ...text.small,
      flex: 1,
      color: theme.text.secondary,
    },
    rowTextEmphasize: {
      ...text.smallSemibold,
      color: theme.text.primary,
    },
    footer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      columnGap: 10,
      marginTop: 2,
      paddingTop: 12,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: theme.border.default,
    },
    detailHint: {
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: 2,
      flex: 1,
    },
    detailText: {
      ...text.smallSemibold,
      color: theme.brand.primary,
    },
    reviewButton: {
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: 4,
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: theme.brand.primary,
      backgroundColor: theme.brand.primarySoft,
    },
    reviewButtonPressed: {
      opacity: 0.85,
    },
    reviewText: {
      ...text.captionSemibold,
      color: theme.brand.primary,
    },
  });
};
