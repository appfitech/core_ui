import React from 'react';
import { StyleSheet, View } from 'react-native';

import { ContractDetailRow } from '@/components/contracts/ContractDetailRow';
import { Tag } from '@/components/Tag';
import { getClientResourceValidityValue } from '@/components/list/client-resource-dates';
import { TRANSLATIONS } from '@/constants/strings';
import { useTheme } from '@/contexts/ThemeContext';
import { FullTheme } from '@/types/theme';
import { moment } from '@/utils/dates';

type ResourceInfo = {
  isActive?: boolean;
  trainerName?: string;
  startDate?: string;
  endDate?: string;
  createdAt?: string;
};

type Props = {
  resource: ResourceInfo;
};

const { clientResourceScreen: copy, common } = TRANSLATIONS;

export function ClientResourceDetailCard({ resource }: Props) {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const createdAtFormatted = resource.createdAt
    ? moment(resource.createdAt).format('D MMM YYYY')
    : common.dash;

  const hasDates = !!(resource.startDate || resource.endDate);

  return (
    <View style={styles.card}>
      <View style={styles.statusRow}>
        <Tag
          backgroundColor={theme.status.success.bg}
          textColor={theme.status.success.text}
          label={resource.isActive ? copy.statusActive : copy.statusInactive}
        />
        <Tag
          backgroundColor={theme.status.info.bg}
          textColor={theme.status.info.text}
          label={copy.contractTag}
        />
      </View>

      {resource.trainerName ? (
        <ContractDetailRow
          icon="person-outline"
          label={copy.trainerLabel}
          value={resource.trainerName}
        />
      ) : null}

      {hasDates ? (
        <ContractDetailRow
          icon="calendar-outline"
          label={copy.validityLabel}
          value={getClientResourceValidityValue(resource)}
        />
      ) : null}

      <ContractDetailRow
        icon="document-text-outline"
        label={copy.createdAtLabel}
        value={createdAtFormatted}
      />
    </View>
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
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
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginBottom: 2,
    },
  });
