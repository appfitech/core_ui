import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { HEADING_STYLES, SHARED_STYLES } from '@/constants/shared_styles';
import { useTheme } from '@/contexts/ThemeContext';
import { FullTheme } from '@/types/theme';

import { useGetRoutines } from '../api/queries/use-get-routines';
import { AppText } from '../components/AppText';
import PageContainer from '../components/PageContainer';
import { ResourceCard } from '../components/ResourceCard';

export default function RoutinesScreen() {
  const [filter, setFilter] = useState<'ACTIVE' | 'INACTIVE'>('ACTIVE');

  const { theme } = useTheme();
  const styles = getStyles(theme);
  const router = useRouter();

  const { data: routines } = useGetRoutines();

  const filteredRoutines = useMemo(
    () => (filter === 'ACTIVE' ? routines : []),
    [routines, filter],
  );

  const handleOpenDetail = (routineId: number) =>
    router.push(`/routines/${routineId}`);

  return (
    <PageContainer style={{ padding: 16 }}>
      <AppText style={styles.title}>{'Mis Rutinas de Entrenamiento'}</AppText>
      <AppText style={styles.subtitle}>
        {'Organiza, sigue y mejora tus sesiones de entrenamiento.'}
      </AppText>

      <View style={styles.tabRow}>
        {['ACTIVE', 'INACTIVE'].map((status) => (
          <TouchableOpacity
            key={status}
            style={[
              styles.tabButton,
              filter === status && styles.tabButtonActive,
            ]}
            onPress={() => setFilter(status as 'ACTIVE' | 'INACTIVE')}
          >
            <AppText
              style={[
                styles.tabText,
                filter === status && styles.tabTextActive,
              ]}
            >
              {status === 'ACTIVE' ? 'Activos' : 'Inactivos'}
            </AppText>
          </TouchableOpacity>
        ))}
      </View>
      {filteredRoutines?.map((routine) => (
        <ResourceCard
          key={routine?.id}
          resource={routine}
          onClick={handleOpenDetail}
        />
      ))}
    </PageContainer>
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    ...HEADING_STYLES(theme),
    ...SHARED_STYLES(theme),
    tabRow: {
      flexDirection: 'row',
      marginVertical: 20,
      overflow: 'hidden',
      columnGap: 16,
    },
    tabButton: {
      paddingVertical: 12,
      paddingHorizontal: 20,
      alignItems: 'center',
      borderRadius: 20,
    },
    tabButtonActive: {
      backgroundColor: theme.backgroundInverted,
    },
    tabText: {
      fontSize: 16,
      color: theme.textPrimary,
      fontWeight: '600',
    },
    tabTextActive: {
      color: theme.dark100,
    },
  });
