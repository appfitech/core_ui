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
import { ListFilterSection } from '@/components/list/ListFilterSection';
import PageContainer from '@/components/PageContainer';
import { ACTIVE_INACTIVE_CHIPS } from '@/constants/list-screens';
import { TRANSLATIONS } from '@/constants/strings';
import { textStyles } from '@/constants/styles';
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
  const { listFilters, common } = TRANSLATIONS;
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
            ? theme.status.success.bg
            : theme.background.input,
        },
      ]}
    >
      <Ionicons
        name={active ? 'checkmark-circle' : 'close-circle'}
        size={14}
        color={active ? theme.status.success.icon : theme.text.secondary}
        style={styles.statusPillIcon}
      />
      <AppText
        style={[
          styles.statusText,
          { color: active ? theme.status.success.text : theme.text.secondary },
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
            <Ionicons name="pencil" size={16} color={theme.text.secondary} />
          </TouchableOpacity>
          <TouchableOpacity hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
            <Entypo
              name="dots-three-vertical"
              size={14}
              color={theme.text.secondary}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.titleRow}>
        <View style={styles.iconBadge}>
          <Ionicons
            name={item.isInPerson ? 'walk' : 'videocam'}
            size={16}
            color={theme.background.app}
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
            color={theme.text.secondary}
          />
          <AppText style={styles.metaText}>
            {item.isInPerson ? 'Presencial' : 'Virtual'}
          </AppText>
        </View>
        <View style={styles.metaCell}>
          <Ionicons
            name="people-outline"
            size={14}
            color={theme.text.secondary}
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
    >
      <View style={styles.topSection}>
        <View style={styles.summaryColumn}>
          <SummaryCard
            icon={
              <Ionicons
                name="checkmark-circle"
                size={18}
                color={theme.status.success.icon}
              />
            }
            value={String(activeCount)}
            label="Servicios Activos"
          />
          <SummaryCard
            icon={
              <Ionicons
                name="people"
                size={18}
                color={theme.status.info.icon}
              />
            }
            value={String(enrolledTotal)}
            label="Clientes Inscritos"
          />
          <SummaryCard
            icon={
              <MaterialCommunityIcons
                name="trending-up"
                size={18}
                color={theme.status.warning.icon}
              />
            }
            value={formatPEN(avgPrice || 0)}
            label="Precio Promedio"
          />
        </View>
        <TouchableOpacity style={styles.newBtn} activeOpacity={0.8}>
          <Ionicons name="add" size={18} color={theme.background.app} />
          <AppText style={styles.newBtnText}>Nuevo Servicio</AppText>
        </TouchableOpacity>
      </View>

      <View style={styles.sectionHeader}>
        <AppText style={styles.sectionTitle}>MIS SERVICIOS</AppText>
      </View>

      <ListFilterSection
        hint={listFilters.trainerServicesHint}
        chips={ACTIVE_INACTIVE_CHIPS}
        selectedValue={statusFilter}
        onChipPress={(value) => setStatusFilter(value as FilterOpt)}
      />

      {filtered.length === 0 ? (
        <View style={styles.emptyWrap}>
          <AppText style={styles.emptyText}>
            No hay servicios con el filtro aplicado
          </AppText>
          <AppText style={styles.emptyHint}>{common.tryOtherFilterHint}</AppText>
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

const getStyles = (theme: FullTheme) => {
  const text = textStyles(theme);
  return StyleSheet.create({
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
      backgroundColor: theme.background.card,
      borderRadius: 14,
      padding: 14,
      gap: 12,
      borderWidth: 1,
      borderColor: theme.border.default,
      borderLeftWidth: 4,
      borderLeftColor: theme.brand.primary,
    },
    summaryIcon: {
      width: 36,
      height: 36,
      borderRadius: 10,
      backgroundColor: theme.background.input,
      alignItems: 'center',
      justifyContent: 'center',
    },
    summaryContent: { flex: 1 },
    summaryValue: {
      ...text.sectionTitle,
      color: theme.text.primary,
    },
    summaryLabel: {
      ...text.caption,
      color: theme.text.secondary,
      marginTop: 2,
    },
    newBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      backgroundColor: theme.brand.primary,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 14,
      alignSelf: 'flex-start',
    },
    newBtnText: {
      color: theme.background.app,
      ...text.smallSemibold,
    },
    sectionHeader: {
      marginBottom: 12,
    },
    sectionTitle: {
      ...text.captionSemibold,
      color: theme.text.secondary,
      letterSpacing: 0.6,
      textTransform: 'uppercase',
    },
    emptyWrap: {
      paddingVertical: 32,
      paddingHorizontal: 24,
      alignItems: 'center',
    },
    emptyText: {
      ...text.bodySemibold,
      color: theme.text.primary,
      textAlign: 'center',
    },
    emptyHint: {
      ...text.small,
      color: theme.text.secondary,
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
      backgroundColor: theme.background.card,
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: theme.border.default,
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
    statusText: { ...text.captionSemibold },
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
      backgroundColor: theme.brand.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cardTitle: {
      ...text.bodySemibold,
      color: theme.text.primary,
      flex: 1,
    },
    cardDesc: {
      ...text.small,
      color: theme.text.secondary,
      lineHeight: 20,
      marginBottom: 10,
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: 20,
      borderTopWidth: 1,
      borderTopColor: theme.border.default,
      paddingTop: 12,
      marginTop: 6,
    },
    metaCell: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    metaText: {
      ...text.caption,
      color: theme.text.secondary,
    },
  });
};
