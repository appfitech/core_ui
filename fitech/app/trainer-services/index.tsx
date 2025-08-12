import { Entypo, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';

import { HEADING_STYLES } from '@/constants/shared_styles';
import { useTheme } from '@/contexts/ThemeContext';
import { FullTheme } from '@/types/theme';

import { useTrainerGetServices } from '../api/queries/use-trainer-get-services';
import { AppText } from '../components/AppText';
import PageContainer from '../components/PageContainer';

type Service = {
  id: number;
  trainerId: number;
  name: string;
  description: string;
  totalPrice: number;
  pricePerSession: number;
  platformCommissionRate: number;
  platformCommissionAmount: number;
  trainerEarnings: number;
  isInPerson: boolean;
  transportIncluded: boolean;
  transportCostPerSession: number;
  enrolledUsersCount: number;
  country: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  districts: any[];
};

const PEN = new Intl.NumberFormat('es-PE', {
  style: 'currency',
  currency: 'PEN',
  minimumFractionDigits: 2,
});
const formatPEN = (n: number) => PEN.format(n);

export default function TrainerServicesScreen() {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const { width } = useWindowDimensions();

  const { data: services } = useTrainerGetServices();
  console.log('[K] services', services);
  const list: Service[] = (services as Service[]) ?? [];

  // ------- Summary metrics -------
  const activeCount = useMemo(
    () => list.filter((s) => s.isActive).length,
    [list],
  );
  const enrolledTotal = useMemo(
    () => list.reduce((sum, s) => sum + (s.enrolledUsersCount || 0), 0),
    [list],
  );
  const avgPrice = useMemo(() => {
    if (!list.length) return 0;
    const sum = list.reduce((acc, s) => acc + (s.pricePerSession || 0), 0);
    return sum / list.length;
  }, [list]);

  // ------- Filters -------
  type FilterOpt = 'ALL' | 'ACTIVE' | 'INACTIVE';
  const [statusFilter, setStatusFilter] = useState<FilterOpt>('ALL');

  const filtered = useMemo(() => {
    if (statusFilter === 'ACTIVE') return list.filter((s) => s.isActive);
    if (statusFilter === 'INACTIVE') return list.filter((s) => !s.isActive);
    return list;
  }, [list, statusFilter]);

  const isTwoCol = width >= 700; // simple heuristic for tablets
  const numColumns = isTwoCol ? 2 : 1;

  // ------- UI helpers -------
  const StatusPill = ({ active }: { active: boolean }) => (
    <View
      style={[
        styles.statusPill,
        { backgroundColor: active ? '#E6F4EA' : '#F3F4F6' },
      ]}
    >
      <Ionicons
        name={active ? 'checkmark-circle' : 'close-circle'}
        size={14}
        color={active ? '#1E7B4D' : '#6B7280'}
        style={{ marginRight: 6 }}
      />
      <AppText
        style={[styles.statusText, { color: active ? '#1E7B4D' : '#6B7280' }]}
      >
        {active ? 'Activo' : 'Inactivo'}
      </AppText>
    </View>
  );

  const Card = ({ item }: { item: Service }) => (
    <View style={styles.card}>
      {/* Top row: status + actions */}
      <View style={styles.cardTopRow}>
        <StatusPill active={item.isActive} />
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <TouchableOpacity hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
            <Ionicons name="pencil" size={16} color="#374151" />
          </TouchableOpacity>
          <TouchableOpacity hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
            <Entypo name="dots-three-vertical" size={14} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Title row with modality icon */}
      <View style={styles.titleRow}>
        <View style={styles.iconBadge}>
          <Ionicons
            name={item.isInPerson ? 'walk' : 'videocam'}
            size={16}
            color="#FFF"
          />
        </View>
        <AppText style={styles.cardTitle}>{item.name}</AppText>
      </View>

      {/* Description */}
      {!!item.description && (
        <AppText style={styles.cardDesc} numberOfLines={6}>
          {item.description.trim()}
        </AppText>
      )}

      {/* Footer meta */}
      <View style={styles.metaRow}>
        <View style={styles.metaCell}>
          <Ionicons
            name={item.isInPerson ? 'location' : 'laptop-outline'}
            size={14}
            color="#4B5563"
            style={{ marginRight: 6 }}
          />
          <AppText style={styles.metaText}>
            {item.isInPerson ? 'Presencial' : 'Virtual'}
          </AppText>
        </View>

        <View style={styles.metaCell}>
          <Ionicons
            name="people-outline"
            size={14}
            color="#4B5563"
            style={{ marginRight: 6 }}
          />
          <AppText style={styles.metaText}>
            {item.enrolledUsersCount}{' '}
            {item.enrolledUsersCount === 1 ? 'cliente' : 'clientes'}
          </AppText>
        </View>
      </View>
    </View>
  );

  const SummaryCard = ({
    icon,
    value,
    label,
  }: {
    icon: React.ReactNode;
    value: string;
    label: string;
  }) => (
    <View style={styles.summaryCard}>
      <View style={styles.summaryIcon}>{icon}</View>
      <View style={{ flex: 1 }}>
        <AppText style={styles.summaryValue}>{value}</AppText>
        <AppText style={styles.summaryLabel}>{label}</AppText>
      </View>
    </View>
  );

  return (
    <PageContainer hasBackButton={false} style={{ padding: 16 }}>
      {/* Header */}
      <View style={{ paddingVertical: 8, marginBottom: 8 }}>
        <AppText style={styles.title}>Gestión de Servicios</AppText>
        <AppText style={styles.subtitle}>
          Administra los servicios que ofreces a tus clientes
        </AppText>
      </View>

      {/* Top actions row */}
      <View style={styles.topRow}>
        <View style={styles.summaryRow}>
          <SummaryCard
            icon={
              <Ionicons name="checkmark-circle" size={18} color="#1E7B4D" />
            }
            value={String(activeCount)}
            label="Servicios Activos"
          />
          <SummaryCard
            icon={<Ionicons name="people" size={18} color="#1A73E8" />}
            value={String(enrolledTotal)}
            label="Clientes Inscritos"
          />
          <SummaryCard
            icon={
              <MaterialCommunityIcons
                name="trending-up"
                size={18}
                color="#FB8C00"
              />
            }
            value={formatPEN(avgPrice || 0)}
            label="Precio Promedio"
          />
        </View>

        <TouchableOpacity style={styles.newBtn}>
          <Ionicons name="add" size={16} color="#FFF" />
          <AppText style={styles.newBtnText}>Nuevo Servicio</AppText>
        </TouchableOpacity>
      </View>

      {/* Section title + simple filter */}
      <View style={styles.sectionHeader}>
        <AppText style={styles.sectionTitle}>Mis Servicios</AppText>

        <TouchableOpacity
          style={styles.filterInput}
          onPress={() => {
            // Simple toggle cycle; replace with your ActionSheet/Dropdown
            setStatusFilter((prev) =>
              prev === 'ALL'
                ? 'ACTIVE'
                : prev === 'ACTIVE'
                  ? 'INACTIVE'
                  : 'ALL',
            );
          }}
        >
          <AppText style={styles.filterLabel}>Filtrar</AppText>
          <View style={styles.filterValueRow}>
            <AppText style={styles.filterValue}>
              {statusFilter === 'ALL'
                ? 'Todos'
                : statusFilter === 'ACTIVE'
                  ? 'Activos'
                  : 'Inactivos'}
            </AppText>
            <Ionicons name="chevron-down" size={16} color="#6B7280" />
          </View>
        </TouchableOpacity>
      </View>

      {/* Cards grid */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <Card item={item} />}
        numColumns={numColumns}
        columnWrapperStyle={numColumns > 1 ? { gap: 12 } : undefined}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        contentContainerStyle={{ paddingTop: 8, paddingBottom: 24, gap: 12 }}
      />
    </PageContainer>
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    // Header
    ...HEADING_STYLES(theme),
    title: {
      ...HEADING_STYLES(theme).title,
    },
    subtitle: {
      ...HEADING_STYLES(theme).subtitle,
    },

    // Top row
    topRow: {
      alignItems: 'center',
      gap: 10,
      marginBottom: 12,
    },
    newBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#3F51B5',
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderRadius: 10,
      alignSelf: 'flex-start',
    },
    newBtnText: {
      color: '#FFF',
      fontWeight: '800',
      marginLeft: 6,
      fontSize: 13,
    },

    // Summary cards
    summaryRow: {
      flex: 1,
      flexDirection: 'row',
      gap: 10,
    },
    summaryCard: {
      flex: 1,
      backgroundColor: '#FFF',
      borderRadius: 12,
      padding: 12,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      shadowColor: '#000',
      shadowOpacity: 0.05,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
      elevation: 1,
    },
    summaryIcon: {
      width: 34,
      height: 34,
      borderRadius: 8,
      backgroundColor: '#F5F5F5',
      alignItems: 'center',
      justifyContent: 'center',
    },
    summaryValue: { fontSize: 20, fontWeight: '800', color: '#111' },
    summaryLabel: { fontSize: 12, color: '#6B7280', fontWeight: '600' },

    // Section header + filter
    sectionHeader: {
      backgroundColor: '#FFF',
      borderRadius: 12,
      padding: 12,
      marginTop: 4,
      marginBottom: 12,
      shadowColor: '#000',
      shadowOpacity: 0.05,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
      elevation: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    sectionTitle: {
      fontSize: 15,
      fontWeight: '700',
      color: '#111',
    },
    filterInput: {
      width: 140,
      backgroundColor: '#F3F4F6',
      borderRadius: 10,
      paddingHorizontal: 10,
      paddingVertical: 8,
    },
    filterLabel: { fontSize: 10, color: '#6B7280', fontWeight: '700' },
    filterValueRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    filterValue: { fontSize: 13, color: '#111', fontWeight: '600' },

    // Service card
    card: {
      flex: 1,
      backgroundColor: '#FFF',
      borderRadius: 12,
      padding: 12,
      shadowColor: '#000',
      shadowOpacity: 0.05,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
      elevation: 1,
    },
    cardTopRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    statusPill: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 999,
      alignSelf: 'flex-start',
    },
    statusText: { fontSize: 12, fontWeight: '700' },

    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 6,
      gap: 10,
    },
    iconBadge: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: '#6F57E8',
      alignItems: 'center',
      justifyContent: 'center',
    },
    cardTitle: { fontSize: 15, fontWeight: '800', color: '#111', flex: 1 },

    cardDesc: { fontSize: 13, color: '#444', lineHeight: 18, marginBottom: 8 },

    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: '#E5E7EB',
      paddingTop: 8,
      marginTop: 4,
    },
    metaCell: { flexDirection: 'row', alignItems: 'center' },
    metaText: { fontSize: 12, color: '#4B5563', fontWeight: '600' },
  });
