import { Ionicons } from '@expo/vector-icons';
import React, { useCallback } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { useTheme } from '@/contexts/ThemeContext';
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
              color={theme.textSecondary}
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
              color={theme.textSecondary}
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
            color={theme.primaryText}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    touchable: {
      marginBottom: 4,
    },
    card: {
      backgroundColor: theme.card,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: theme.border,
      padding: 18,
      paddingBottom: 14,
    },
    title: {
      fontSize: 17,
      fontWeight: '700',
      color: theme.textPrimary,
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
      fontSize: 11,
      fontWeight: '600',
      color: theme.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: 1,
    },
    trainerName: {
      fontSize: 15,
      fontWeight: '600',
      color: theme.textPrimary,
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
      fontSize: 13,
      fontWeight: '500',
      color: theme.textSecondary,
      minWidth: 0,
    },
    ctaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: 4,
    },
    ctaText: {
      fontSize: 14,
      fontWeight: '700',
      color: theme.primaryText,
    },
  });
