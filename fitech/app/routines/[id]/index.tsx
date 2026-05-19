import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { textStyles } from '@/constants/styles';
import { Button } from '@/components/Button';
import PageContainer from '@/components/PageContainer';
import { Tag } from '@/components/Tag';
import { useTheme } from '@/contexts/ThemeContext';
import { useGetRoutineById } from '@/lib/api/queries/use-get-routine-by-id';
import { FullTheme } from '@/types/theme';
import { moment } from '@/utils/dates';

const ROUTINE_TEMPLATE_URL =
  'https://appfitech.com/v1/app/templates/plantilla_rutinas.xlsx';

const formatDate = (iso?: string) =>
  iso ? moment(iso).format('D MMM YYYY') : '—';

export default function RoutineDetailScreen() {
  const { theme } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();

  const styles = getStyles(theme);
  const routine = useGetRoutineById(Number(id));

  const handleDownload = async () => {
    try {
      await WebBrowser.openBrowserAsync(ROUTINE_TEMPLATE_URL);
    } catch (e) {
      console.error('[FITECH] error opening routine template', e);
    }
  };

  const hasDates = !!(routine?.startDate || routine?.endDate);
  const createdAtFormatted = routine?.createdAt
    ? moment(routine.createdAt).format('D MMM YYYY')
    : '—';

  return (
    <PageContainer
      title={routine?.resourceName ?? 'Rutina'}
      style={styles.pageStyle}
    >
      <View style={styles.card}>
        <View style={styles.chipsRow}>
          <Tag
            backgroundColor={theme.status.success.bg}
            textColor={theme.status.success.text}
            label={routine?.isActive ? 'Activa' : 'Inactiva'}
          />
          <Tag
            backgroundColor={theme.status.info.bg}
            textColor={theme.status.info.text}
            label="Contrato"
          />
        </View>

        {routine?.trainerName ? (
          <View style={styles.row}>
            <Ionicons
              name="person-outline"
              size={18}
              color={theme.text.secondary}
              style={styles.rowIcon}
            />
            <View style={styles.rowContent}>
              <AppText style={styles.rowLabel}>Entrenador</AppText>
              <AppText style={styles.rowValue}>{routine.trainerName}</AppText>
            </View>
          </View>
        ) : null}

        {hasDates && (
          <View style={styles.row}>
            <Ionicons
              name="calendar-outline"
              size={18}
              color={theme.text.secondary}
              style={styles.rowIcon}
            />
            <View style={styles.rowContent}>
              <AppText style={styles.rowLabel}>Vigencia del plan</AppText>
              <AppText style={styles.rowValue}>
                {routine?.startDate && routine?.endDate
                  ? `${formatDate(routine.startDate)} – ${formatDate(routine.endDate)}`
                  : routine?.startDate
                    ? `Desde ${formatDate(routine.startDate)}`
                    : `Hasta ${formatDate(routine.endDate)}`}
              </AppText>
            </View>
          </View>
        )}

        <View style={styles.row}>
          <Ionicons
            name="create-outline"
            size={18}
            color={theme.text.secondary}
            style={styles.rowIcon}
          />
          <View style={styles.rowContent}>
            <AppText style={styles.rowLabel}>Fecha de creación</AppText>
            <AppText style={styles.rowValue}>{createdAtFormatted}</AppText>
          </View>
        </View>
      </View>

      <View style={styles.buttonWrap}>
        <Button label="Descargar Excel" onPress={handleDownload} />
      </View>
    </PageContainer>
  );
}

const getStyles = (theme: FullTheme) => {
  const text = textStyles(theme);
  return StyleSheet.create({
    pageStyle: { paddingBottom: 180 },
    card: {
      backgroundColor: theme.background.card,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.border.default,
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
    rowContent: {
      flex: 1,
      minWidth: 0,
    },
    rowLabel: {
      ...text.label,
      color: theme.text.secondary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: 4,
    },
    rowValue: {
      ...text.linkSemibold,
      color: theme.text.primary,
    },
    buttonWrap: {
      marginTop: 24,
    },
  });
};
