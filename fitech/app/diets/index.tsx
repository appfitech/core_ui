import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { HEADING_STYLES } from '@/constants/shared_styles';
import { useTheme } from '@/contexts/ThemeContext';
import { FullTheme } from '@/types/theme';

import { useGetDiets } from '../api/queries/use-get-diets';
import { AppText } from '../components/AppText';
import PageContainer from '../components/PageContainer';

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

  const handleOpenDetail = (dietId: number) => () =>
    router.push(`/diets/${dietId}`);

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
            <Text
              style={[
                styles.tabText,
                filter === status && styles.tabTextActive,
              ]}
            >
              {status === 'ACTIVE' ? 'Activos' : 'Inactivos'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {filteredDiets?.map((diet) => (
        <TouchableOpacity key={diet.id} onPress={handleOpenDetail(diet?.id)}>
          <View style={styles.card}>
            <Text style={styles.title}>{diet.resourceName}</Text>
            <Text style={styles.sub}>👤 {diet.trainerName}</Text>
            <Text style={styles.sub}>📄 {diet.serviceName}</Text>

            <View style={styles.badgeContainer}>
              <Text
                style={[
                  styles.badge,
                  diet.isActive ? styles.active : styles.inactive,
                ]}
              >
                {diet.isActive ? 'Activa' : 'Inactiva'}
              </Text>
              <Text style={styles.contract}>Contrato</Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </PageContainer>
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    container: {
      padding: 16,
      backgroundColor: '#F5F7FA',
    },
    tabRow: {
      flexDirection: 'row',
      marginVertical: 20,
      backgroundColor: '#E3F2FD',
      borderRadius: 12,
      overflow: 'hidden',
    },
    tabButton: {
      flex: 1,
      paddingVertical: 12,
      alignItems: 'center',
    },
    tabButtonActive: {
      backgroundColor: '#0F4C81',
    },
    tabText: {
      fontSize: 14,
      color: '#0F4C81',
      fontWeight: '600',
    },
    tabTextActive: {
      color: '#fff',
    },
    card: {
      backgroundColor: '#fff',
      padding: 16,
      borderRadius: 12,
      marginBottom: 12,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 3,
    },
    sub: { color: '#666', marginBottom: 2 },
    badgeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 8,
    },
    badge: {
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 8,
      fontSize: 12,
      color: '#fff',
    },
    active: { backgroundColor: 'green' },
    inactive: { backgroundColor: 'gray' },
    contract: {
      backgroundColor: '#9b59b6',
      color: '#fff',
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 8,
      fontSize: 12,
      marginLeft: 6,
    },
    label: { fontWeight: 'bold', marginTop: 8 },
    content: { fontStyle: 'italic' },
    box: {
      backgroundColor: '#f5f5f5',
      padding: 8,
      borderRadius: 8,
      marginTop: 2,
    },
    pdfButton: {
      backgroundColor: '#f39c12',
      padding: 10,
      borderRadius: 8,
      marginTop: 12,
      alignItems: 'center',
    },
    pdfButtonText: { color: '#fff', fontWeight: 'bold' },
    ...HEADING_STYLES(theme),
  });
