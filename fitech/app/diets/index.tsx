import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { HEADING_STYLES } from '@/constants/shared_styles';
import { useTheme } from '@/contexts/ThemeContext';
import { FullTheme } from '@/types/theme';

import { useGetDiets } from '../api/queries/use-get-diets';
import { AppText } from '../components/AppText';
import PageContainer from '../components/PageContainer';
import { ResourceCard } from '../components/ResourceCard';

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
    <PageContainer style={{ padding: 16 }}>
      <AppText style={styles.title}>{'Mis Planes Nutricionales'}</AppText>
      <AppText style={styles.subtitle}>
        {'Dietas personalizadas para alcanzar tus objetivos de salud'}
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

      {filteredDiets?.map((diet) => (
        <ResourceCard
          key={diet?.id}
          resource={diet}
          onClick={handleOpenDetail}
        />
      ))}
    </PageContainer>
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
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
    ...HEADING_STYLES(theme),
  });
