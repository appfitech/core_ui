import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import moment from 'moment';
import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/contexts/ThemeContext';
import { FullTheme } from '@/types/theme';

import { useGetRoutineById } from '../../api/queries/use-get-routine-by-id';
import { AppText } from '../../components/AppText';
import { Button } from '../../components/Button';
import PageContainer from '../../components/PageContainer';
import { Tag } from '../../components/Tag';

moment.locale('es');

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
            backgroundColor={theme.successBackground}
            textColor={theme.successText}
            label={routine?.isActive ? 'Activa' : 'Inactiva'}
          />
          <Tag
            backgroundColor={theme.infoBackground}
            textColor={theme.infoText}
            label="Contrato"
          />
        </View>

        {routine?.trainerName ? (
          <View style={styles.row}>
            <Ionicons
              name="person-outline"
              size={18}
              color={theme.textSecondary}
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
              color={theme.textSecondary}
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
            color={theme.textSecondary}
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
    buttonWrap: {
      marginTop: 24,
    },
  });
