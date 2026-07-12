import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';

import { AppText } from '@/components/AppText';
import { ListEmptyState } from '@/components/list/ListEmptyState';
import { ListFilterSection } from '@/components/list/ListFilterSection';
import PageContainer from '@/components/PageContainer';
import {
  ACTIVE_INACTIVE_CHIPS,
  LIST_SCREEN_FLATLIST,
} from '@/constants/list-screens';
import { TRANSLATIONS } from '@/constants/strings';
import { textStyles } from '@/constants/styles';
import { useTheme } from '@/contexts/ThemeContext';
import { useTrainerServiceActions } from '@/hooks/use-trainer-service-actions';
import { useTrainerGetServices } from '@/lib/api/queries/use-trainer-get-services';
import { AppTheme } from '@/types/theme';
import { TrainerService } from '@/types/trainer';
import { formatPEN } from '@/utils/currency';

type StatTone = 'success' | 'info' | 'warning';

function ServiceStatTile({
  icon,
  value,
  label,
  tone,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  tone: StatTone;
}) {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const palette =
    tone === 'success'
      ? theme.status.success
      : tone === 'info'
        ? theme.status.info
        : theme.status.warning;

  return (
    <View style={styles.statTile}>
      <View style={[styles.statIconWrap, { backgroundColor: palette.bg }]}>
        {icon}
      </View>
      <AppText style={styles.statValue} numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </AppText>
      <AppText style={styles.statLabel} numberOfLines={2}>
        {label}
      </AppText>
    </View>
  );
}

function ServiceStatusPill({ active }: { active: boolean }) {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
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
}

export default function TrainerServicesScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const styles = getStyles(theme);
  const { listFilters, common } = TRANSLATIONS;
  const { width } = useWindowDimensions();
  const { handleNewService } = useTrainerServiceActions();

  const { data: services } = useTrainerGetServices();

  const list = useMemo<TrainerService[]>(
    () => (services as TrainerService[]) ?? [],
    [services],
  );

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

  type FilterOpt = 'ACTIVE' | 'INACTIVE';
  const [statusFilter, setStatusFilter] = useState<FilterOpt>('ACTIVE');

  const filtered = useMemo(() => {
    if (statusFilter === 'ACTIVE') return list.filter((s) => s.isActive);
    return list.filter((s) => !s.isActive);
  }, [list, statusFilter]);

  const isTwoCol = width >= 700;
  const numColumns = isTwoCol ? 2 : 1;

  const handleOpenService = useCallback(
    (item: TrainerService) => {
      router.push({
        pathname: '/trainer-services/[id]',
        params: {
          id: String(item.id),
          service: JSON.stringify(item),
        },
      });
    },
    [router],
  );

  const renderCard = useCallback(
    ({ item }: { item: TrainerService }) => {
      const handlePress = () => {
        handleOpenService(item);
      };

      return (
        <Pressable
          onPress={handlePress}
          style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
        >
          <View style={styles.cardTopRow}>
            <ServiceStatusPill active={item.isActive} />
            <Ionicons
              name="chevron-forward"
              size={18}
              color={theme.text.tertiary}
            />
          </View>

          <View style={styles.titleRow}>
            <View style={styles.iconBadge}>
              <Ionicons
                name={item.isInPerson ? 'walk' : 'videocam'}
                size={16}
                color={theme.background.app}
              />
            </View>
            <AppText style={styles.cardTitle} numberOfLines={1}>
              {item.name}
            </AppText>
          </View>

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

          <View style={styles.priceRow}>
            <AppText style={styles.totalPrice}>
              {formatPEN(item.totalPrice)}
            </AppText>
            <AppText style={styles.earnings}>
              Ganas: {formatPEN(item.trainerEarnings)}
            </AppText>
          </View>
          <AppText style={styles.sessionPrice}>
            Por sesión: {formatPEN(item.pricePerSession)}
          </AppText>
        </Pressable>
      );
    },
    [handleOpenService, styles, theme],
  );

  const listHeader = useMemo(
    () => (
      <View style={styles.listHeader}>
        <View style={styles.summaryBlock}>
          <View style={styles.topRow}>
            <AppText style={styles.sectionTitle}>Resumen</AppText>
            <TouchableOpacity
              style={styles.createBtn}
              activeOpacity={0.8}
              onPress={handleNewService}
            >
              <Ionicons name="add" size={18} color={theme.background.app} />
              <AppText style={styles.createBtnText}>Nuevo Servicio</AppText>
            </TouchableOpacity>
          </View>

          <View style={styles.summaryRow}>
            <ServiceStatTile
              icon={
                <Ionicons
                  name="checkmark-circle"
                  size={18}
                  color={theme.status.success.icon}
                />
              }
              value={String(activeCount)}
              label="Servicios activos"
              tone="success"
            />
            <ServiceStatTile
              icon={
                <Ionicons
                  name="people"
                  size={18}
                  color={theme.status.info.icon}
                />
              }
              value={String(enrolledTotal)}
              label="Clientes inscritos"
              tone="info"
            />
            <ServiceStatTile
              icon={
                <MaterialCommunityIcons
                  name="trending-up"
                  size={18}
                  color={theme.status.warning.icon}
                />
              }
              value={formatPEN(avgPrice || 0)}
              label="Precio promedio"
              tone="warning"
            />
          </View>
        </View>

        <View style={styles.listSection}>
          <AppText style={styles.sectionTitle}>Mis servicios</AppText>

          <ListFilterSection
            hint={listFilters.trainerServicesHint}
            chips={ACTIVE_INACTIVE_CHIPS}
            selectedValue={statusFilter}
            onChipPress={(value) => setStatusFilter(value as FilterOpt)}
            style={styles.filters}
          />
        </View>
      </View>
    ),
    [
      activeCount,
      avgPrice,
      enrolledTotal,
      handleNewService,
      listFilters.trainerServicesHint,
      statusFilter,
      styles,
      theme,
    ],
  );

  return (
    <PageContainer
      hasBackButton
      title="Gestión de Servicios"
      subheader="Administra los servicios que ofreces a tus clientes"
      disableScroll
      style={styles.pageStyle}
    >
      <FlatList
        data={filtered}
        key={numColumns}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderCard}
        numColumns={numColumns}
        columnWrapperStyle={numColumns > 1 ? styles.columnWrapper : undefined}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={
          <ListEmptyState
            title="No hay servicios con el filtro aplicado"
            hint={common.tryOtherFilterHint}
          />
        }
        ItemSeparatorComponent={() => <View style={styles.listSeparator} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        initialNumToRender={LIST_SCREEN_FLATLIST.initialNumToRender}
        maxToRenderPerBatch={LIST_SCREEN_FLATLIST.maxToRenderPerBatch}
        windowSize={LIST_SCREEN_FLATLIST.windowSize}
        removeClippedSubviews={LIST_SCREEN_FLATLIST.removeClippedSubviews}
      />
    </PageContainer>
  );
}

const getStyles = (theme: AppTheme) => {
  const text = textStyles(theme);
  return StyleSheet.create({
    pageStyle: { paddingBottom: 0 },
    listHeader: {
      gap: 24,
      marginBottom: 4,
    },
    summaryBlock: {
      gap: 12,
    },
    topRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 12,
    },
    sectionTitle: {
      ...text.overline,
    },
    createBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      backgroundColor: theme.brand.primary,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 14,
    },
    createBtnText: {
      ...text.smallSemibold,
      color: theme.background.app,
    },
    summaryRow: {
      flexDirection: 'row',
      gap: 10,
    },
    statTile: {
      flex: 1,
      minWidth: 0,
      alignItems: 'center',
      backgroundColor: theme.background.card,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: theme.border.default,
      paddingVertical: 14,
      paddingHorizontal: 8,
      gap: 6,
    },
    statIconWrap: {
      width: 36,
      height: 36,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    statValue: {
      ...text.stat,
      textAlign: 'center',
    },
    statLabel: {
      ...text.caption,
      color: theme.text.secondary,
      textAlign: 'center',
      lineHeight: 16,
    },
    listSection: {
      gap: 10,
    },
    filters: {
      marginBottom: 16,
    },
    listContent: {
      flexGrow: 1,
      paddingTop: 4,
      paddingBottom: 24,
    },
    columnWrapper: { gap: 12 },
    listSeparator: { height: 12 },
    card: {
      flex: 1,
      backgroundColor: theme.background.card,
      borderRadius: 16,
      padding: 14,
      borderWidth: 1,
      borderColor: theme.border.default,
      gap: 8,
    },
    cardPressed: {
      backgroundColor: theme.background.input,
      borderColor: theme.border.strong,
    },
    cardTopRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
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
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: 16,
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
    priceRow: {
      flexDirection: 'row',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      gap: 8,
      borderTopWidth: 1,
      borderTopColor: theme.border.default,
      paddingTop: 10,
      marginTop: 2,
    },
    totalPrice: {
      ...text.bodySemibold,
      color: theme.status.info.text,
    },
    earnings: {
      ...text.captionSemibold,
      color: theme.status.success.text,
    },
    sessionPrice: {
      ...text.caption,
      color: theme.text.secondary,
    },
  });
};
