import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { useTheme } from '@/contexts/ThemeContext';
import { FullTheme } from '@/types/theme';

import { useGetDiets } from '@/lib/api/queries/use-get-diets';
import { AppText } from '@/components/AppText';
import PageContainer from '@/components/PageContainer';
import { ResourceCard } from '@/components/ResourceCard';

export default function DietsScreen() {
  const [filter, setFilter] = useState<'ACTIVE' | 'INACTIVE'>('ACTIVE');

  const { theme } = useTheme();
  const router = useRouter();

  const styles = getStyles(theme);

  const { data: diets } = useGetDiets();

  const filteredDiets = useMemo(
    () => (filter === 'ACTIVE' ? diets : []),
    [diets, filter],
  );

  const handleOpenDetail = (dietId: number) => router.push(`/diets/${dietId}`);

  return (
    <PageContainer
      title="Mis Planes Nutricionales"
      subheader="Dietas personalizadas para alcanzar tus objetivos de salud"
      style={styles.pageStyle}
    >
      <View style={styles.filterCard}>
        <AppText style={styles.filterHint}>
          Mostrar solo planes activos o inactivos
        </AppText>
        <View style={styles.tabRow}>
          {(['ACTIVE', 'INACTIVE'] as const).map((status) => {
            const isActive = filter === status;
            return (
              <TouchableOpacity
                key={status}
                style={[styles.tabButton, isActive && styles.tabButtonActive]}
                onPress={() => setFilter(status)}
              >
                <AppText
                  style={[styles.tabText, isActive && styles.tabTextActive]}
                >
                  {status === 'ACTIVE' ? 'Activos' : 'Inactivos'}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.list}>
        {filteredDiets?.length === 0 ? (
          <View style={styles.emptyWrap}>
            <AppText style={styles.emptyText}>
              No hay planes con el filtro aplicado
            </AppText>
            <AppText style={styles.emptyHint}>
              Prueba otro filtro o vuelve más tarde
            </AppText>
          </View>
        ) : (
          filteredDiets?.map((diet) => (
            <ResourceCard
              key={diet?.id}
              resource={diet}
              onClick={handleOpenDetail}
            />
          ))
        )}
      </View>
    </PageContainer>
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    pageStyle: { paddingBottom: 180 },
    filterCard: {
      backgroundColor: theme.backgroundInput,
      borderRadius: 12,
      borderLeftWidth: 4,
      borderLeftColor: theme.primary,
      paddingVertical: 14,
      paddingHorizontal: 16,
      marginTop: 24,
    },
    filterHint: {
      fontSize: 12,
      color: theme.textSecondary,
      marginBottom: 10,
    },
    tabRow: {
      flexDirection: 'row',
      columnGap: 10,
      flexWrap: 'wrap',
    },
    tabButton: {
      paddingVertical: 10,
      paddingHorizontal: 18,
      alignItems: 'center',
      borderRadius: 999,
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
    },
    tabButtonActive: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    tabText: {
      fontSize: 15,
      color: theme.textPrimary,
      fontWeight: '600',
    },
    tabTextActive: {
      color: theme.background,
      fontWeight: '700',
    },
    list: {
      marginTop: 20,
      rowGap: 12,
    },
    emptyWrap: {
      marginTop: 24,
      paddingVertical: 32,
      paddingHorizontal: 24,
      alignItems: 'center',
    },
    emptyText: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.textPrimary,
      textAlign: 'center',
    },
    emptyHint: {
      fontSize: 14,
      color: theme.textSecondary,
      marginTop: 8,
      textAlign: 'center',
    },
  });
