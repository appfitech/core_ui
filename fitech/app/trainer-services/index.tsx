import { Entypo, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';

import { AppText } from '@/components/AppText';
import PageContainer from '@/components/PageContainer';
import { useTheme } from '@/contexts/ThemeContext';
import { useTrainerGetServices } from '@/lib/api/queries/use-trainer-get-services';
import { FullTheme } from '@/types/theme';

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

  const list = useMemo<Service[]>(
    () => (services as Service[]) ?? [],
    [services],
  );

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
  type FilterOpt = 'ACTIVE' | 'INACTIVE';
  const [statusFilter, setStatusFilter] = useState<FilterOpt>('ACTIVE');

  const filtered = useMemo(() => {
    if (statusFilter === 'ACTIVE') return list.filter((s) => s.isActive);
    return list.filter((s) => !s.isActive);
  }, [list, statusFilter]);

  const isTwoCol = width >= 700; // simple heuristic for tablets
  const numColumns = isTwoCol ? 2 : 1;

  // ------- UI helpers -------
  const StatusPill = ({ active }: { active: boolean }) => (
    <View
      style={[
        styles.statusPill,
        {
          backgroundColor: active
            ? theme.successBackground
            : theme.backgroundInput,
        },
      ]}
    >
      <Ionicons
        name={active ? 'checkmark-circle' : 'close-circle'}
        size={14}
        color={active ? theme.success : theme.textSecondary}
        style={styles.statusPillIcon}
      />
      <AppText
        style={[
          styles.statusText,
          { color: active ? theme.successText : theme.textSecondary },
        ]}
      >
        {active ? 'Activo' : 'Inactivo'}
      </AppText>
    </View>
  );

  const Card = ({ item }: { item: Service }) => (
    <View style={styles.card}>
      <View style={styles.cardTopRow}>
        <StatusPill active={item.isActive} />
        <View style={styles.cardActions}>
          <TouchableOpacity hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
            <Ionicons name="pencil" size={16} color={theme.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
            <Entypo
              name="dots-three-vertical"
              size={14}
              color={theme.textSecondary}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.titleRow}>
        <View style={styles.iconBadge}>
          <Ionicons
            name={item.isInPerson ? 'walk' : 'videocam'}
            size={16}
            color={theme.background}
          />
        </View>
        <AppText style={styles.cardTitle}>{item.name}</AppText>
      </View>

      {!!item.description && (
        <AppText style={styles.cardDesc} numberOfLines={6}>
          {item.description.trim()}
        </AppText>
      )}

      <View style={styles.metaRow}>
        <View style={styles.metaCell}>
          <Ionicons
            name={item.isInPerson ? 'location' : 'laptop-outline'}
            size={14}
            color={theme.textSecondary}
            style={styles.metaIcon}
          />
          <AppText style={styles.metaText}>
            {item.isInPerson ? 'Presencial' : 'Virtual'}
          </AppText>
        </View>
        <View style={styles.metaCell}>
          <Ionicons
            name="people-outline"
            size={14}
            color={theme.textSecondary}
            style={styles.metaIcon}
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
      <View style={styles.summaryContent}>
        <AppText style={styles.summaryValue}>{value}</AppText>
        <AppText style={styles.summaryLabel}>{label}</AppText>
      </View>
    </View>
  );

  return (
    <PageContainer
      hasBackButton
      title="Gestión de Servicios"
      subheader="Administra los servicios que ofreces a tus clientes"
      style={styles.pageStyle}
      contentPaddingBottom={120}
    >
      <View style={styles.topSection}>
        <View style={styles.summaryColumn}>
          <SummaryCard
            icon={
              <Ionicons
                name="checkmark-circle"
                size={18}
                color={theme.success}
              />
            }
            value={String(activeCount)}
            label="Servicios Activos"
          />
          <SummaryCard
            icon={<Ionicons name="people" size={18} color={theme.info} />}
            value={String(enrolledTotal)}
            label="Clientes Inscritos"
          />
          <SummaryCard
            icon={
              <MaterialCommunityIcons
                name="trending-up"
                size={18}
                color={theme.orange}
              />
            }
            value={formatPEN(avgPrice || 0)}
            label="Precio Promedio"
          />
        </View>
        <TouchableOpacity style={styles.newBtn} activeOpacity={0.8}>
          <Ionicons name="add" size={18} color={theme.background} />
          <AppText style={styles.newBtnText}>Nuevo Servicio</AppText>
        </TouchableOpacity>
      </View>

      <View style={styles.sectionHeader}>
        <AppText style={styles.sectionTitle}>MIS SERVICIOS</AppText>
      </View>

      <View style={styles.filterCard}>
        <AppText style={styles.filterHint}>
          Mostrar solo servicios activos o inactivos
        </AppText>
        <View style={styles.tabRow}>
          {(['ACTIVE', 'INACTIVE'] as const).map((status) => {
            const isActive = statusFilter === status;
            return (
              <TouchableOpacity
                key={status}
                style={[styles.tabButton, isActive && styles.tabButtonActive]}
                onPress={() => setStatusFilter(status)}
                activeOpacity={0.8}
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

      {filtered.length === 0 ? (
        <View style={styles.emptyWrap}>
          <AppText style={styles.emptyText}>
            No hay servicios con el filtro aplicado
          </AppText>
          <AppText style={styles.emptyHint}>
            Prueba otro filtro o crea un nuevo servicio
          </AppText>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <Card item={item} />}
          numColumns={numColumns}
          columnWrapperStyle={numColumns > 1 ? styles.columnWrapper : undefined}
          ItemSeparatorComponent={() => <View style={styles.listSeparator} />}
          contentContainerStyle={styles.listContent}
        />
      )}
    </PageContainer>
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    pageStyle: {},
    topSection: {
      marginBottom: 16,
      gap: 16,
    },
    summaryColumn: {
      flexDirection: 'column',
      gap: 10,
    },
    summaryCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.card,
      borderRadius: 14,
      padding: 14,
      gap: 12,
      borderWidth: 1,
      borderColor: theme.border,
      borderLeftWidth: 4,
      borderLeftColor: theme.primary,
    },
    summaryIcon: {
      width: 36,
      height: 36,
      borderRadius: 10,
      backgroundColor: theme.backgroundInput,
      alignItems: 'center',
      justifyContent: 'center',
    },
    summaryContent: { flex: 1 },
    summaryValue: {
      fontSize: 18,
      fontWeight: '800',
      color: theme.textPrimary,
    },
    summaryLabel: {
      fontSize: 12,
      color: theme.textSecondary,
      fontWeight: '600',
      marginTop: 2,
    },
    newBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      backgroundColor: theme.primary,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 14,
      alignSelf: 'flex-start',
    },
    newBtnText: {
      color: theme.background,
      fontWeight: '700',
      fontSize: 14,
    },
    sectionHeader: {
      marginBottom: 12,
    },
    sectionTitle: {
      fontSize: 12,
      fontWeight: '700',
      color: theme.textSecondary,
      letterSpacing: 0.6,
      textTransform: 'uppercase',
    },
    filterCard: {
      backgroundColor: theme.backgroundInput,
      borderRadius: 12,
      borderLeftWidth: 4,
      borderLeftColor: theme.primary,
      paddingVertical: 14,
      paddingHorizontal: 16,
      marginBottom: 16,
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
    emptyWrap: {
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
    listContent: {
      paddingTop: 4,
      paddingBottom: 24,
      gap: 12,
    },
    columnWrapper: { gap: 12 },
    listSeparator: { height: 12 },
    card: {
      flex: 1,
      backgroundColor: theme.card,
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: theme.border,
    },
    cardTopRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    cardActions: { flexDirection: 'row', gap: 12 },
    statusPill: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 999,
      alignSelf: 'flex-start',
    },
    statusPillIcon: { marginRight: 6 },
    statusText: { fontSize: 12, fontWeight: '700' },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
      gap: 10,
    },
    iconBadge: {
      width: 32,
      height: 32,
      borderRadius: 10,
      backgroundColor: theme.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.textPrimary,
      flex: 1,
    },
    cardDesc: {
      fontSize: 14,
      color: theme.textSecondary,
      lineHeight: 20,
      marginBottom: 10,
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: 20,
      borderTopWidth: 1,
      borderTopColor: theme.border,
      paddingTop: 12,
      marginTop: 6,
    },
    metaCell: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    metaIcon: {},
    metaText: {
      fontSize: 12,
      color: theme.textSecondary,
      fontWeight: '600',
    },
  });
