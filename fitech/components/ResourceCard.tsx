import { Ionicons } from '@expo/vector-icons';
import React, { useCallback } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { useTheme } from '@/contexts/ThemeContext';
import { textStyles } from '@/constants/styles';
import { ClientResourceResponseDtoReadable } from '@/types/api/types.gen';
import { FullTheme } from '@/types/theme';
import { moment } from '@/utils/dates';

import { AppText } from './AppText';

const formatDate = (iso?: string) =>
  iso ? moment(iso).format('D MMM YYYY') : '—';

type Props = {
  resource: ClientResourceResponseDtoReadable;
  onClick: (resourceId: number) => void;
};

export function ResourceCard({ onClick, resource }: Props) {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const handleClick = useCallback(() => {
    if (!resource?.id) return;
    onClick(resource.id);
  }, [resource, onClick]);

  const hasDates = !!(resource?.startDate || resource?.endDate);

  return (
    <TouchableOpacity
      activeOpacity={0.72}
      onPress={handleClick}
      style={styles.touchable}
    >
      <View style={styles.card}>
        <AppText style={styles.title} numberOfLines={2}>
          {resource.resourceName}
        </AppText>

        {resource?.trainerName ? (
          <View style={styles.trainerRow}>
            <Ionicons
              name="person-outline"
              size={16}
              color={theme.text.secondary}
              style={styles.trainerIcon}
            />
            <View style={styles.trainerTextWrap}>
              <AppText style={styles.trainerLabel}>Entrenador</AppText>
              <AppText style={styles.trainerName} numberOfLines={1}>
                {resource.trainerName}
              </AppText>
            </View>
          </View>
        ) : null}

        {hasDates ? (
          <View style={styles.datesRow}>
            <Ionicons
              name="calendar-outline"
              size={16}
              color={theme.text.secondary}
              style={styles.dateIcon}
            />
            <AppText style={styles.datesText} numberOfLines={1}>
              {resource.startDate && resource.endDate
                ? `${formatDate(resource.startDate)} – ${formatDate(resource.endDate)}`
                : resource.startDate
                  ? `Desde ${formatDate(resource.startDate)}`
                  : `Hasta ${formatDate(resource.endDate)}`}
            </AppText>
          </View>
        ) : null}

        <View style={styles.ctaRow}>
          <AppText style={styles.ctaText}>Ver detalle</AppText>
          <Ionicons
            name="chevron-forward"
            size={18}
            color={theme.brand.primaryLight}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const getStyles = (theme: FullTheme) => {
  const text = textStyles(theme);
  return StyleSheet.create({
    touchable: {
      marginBottom: 4,
    },
    card: {
      backgroundColor: theme.background.card,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: theme.border.default,
      padding: 18,
      paddingBottom: 14,
    },
    title: {
      ...text.leadSemibold,
      color: theme.text.primary,
      lineHeight: 22,
      marginBottom: 12,
    },
    trainerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    trainerIcon: {
      marginRight: 8,
    },
    trainerTextWrap: {
      flex: 1,
      minWidth: 0,
    },
    trainerLabel: {
      ...text.label,
      color: theme.text.secondary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: 1,
    },
    trainerName: {
      ...text.linkSemibold,
      color: theme.text.primary,
    },
    datesRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 14,
    },
    dateIcon: {
      marginRight: 8,
    },
    datesText: {
      flex: 1,
      ...text.nav,
      color: theme.text.secondary,
      minWidth: 0,
    },
    ctaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: 4,
    },
    ctaText: {
      ...text.smallSemibold,
      color: theme.brand.primaryLight,
    },
  });
};
