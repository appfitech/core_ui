// TrainerPaymentsScreen.tsx
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';

import { AppText } from '@/components/AppText';
import PageContainer from '@/components/PageContainer';
import { textStyles } from '@/constants/styles';
import { useTheme } from '@/contexts/ThemeContext';
import {
  useTrainerGetPayments,
  useTrainerGetPaymentsSummary,
} from '@/lib/api/queries/use-trainer-get-payments';
import { AppTheme } from '@/types/theme';

type Payment = {
  id: number;
  userId: number;
  clientName: string;
  serviceName: string;
  totalAmount: number;
  platformCommission: number;
  trainerEarnings: number;
  paymentDate: string | null;
  paymentStatus:
    | 'PENDING_CLIENT_APPROVAL'
    | 'AVAILABLE_FOR_COLLECTION'
    | 'COLLECTED';
  paymentMethod: 'CONTRACT_PAYMENT' | string;
  transactionId: string;
  collectionRequestedAt: string | null;
};

const PEN = new Intl.NumberFormat('es-PE', {
  style: 'currency',
  currency: 'PEN',
  minimumFractionDigits: 2,
});
const formatPEN = (n: number | undefined) => PEN.format(n ?? 0);

const formatDate = (iso: string | null) =>
  iso
    ? new Intl.DateTimeFormat('es-PE', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
        .format(new Date(iso))
        .replace('.', '')
    : '—';

/* -------------------------- Summary Card -------------------------- */
export const SummaryCard = ({
  icon,
  label,
  amount,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  amount?: number;
  tone: 'green' | 'blue' | 'orange';
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const palette =
    tone === 'green'
      ? {
          bg: theme.status.success.bg,
          border: theme.status.success.border,
          text: theme.status.success.text,
          iconBg: theme.status.success.icon,
        }
      : tone === 'blue'
        ? {
            bg: theme.status.info.bg,
            border: theme.status.info.border,
            text: theme.status.info.text,
            iconBg: theme.status.info.icon,
          }
        : {
            bg: theme.status.warning.bgStrong,
            border: theme.status.warning.border,
            text: theme.status.warning.text,
            iconBg: theme.status.warning.icon,
          };

  return (
    <View style={styles.summaryCard}>
      <View
        style={[styles.summaryIconWrap, { backgroundColor: palette.iconBg }]}
      >
        {icon}
      </View>
      <View style={{ flex: 1 }}>
        <AppText
          style={[styles.summaryLabel, { color: theme.text.secondary }]}
          numberOfLines={1}
        >
          {label}
        </AppText>
        <AppText
          style={[styles.summaryAmount, { color: palette.text }]}
          numberOfLines={1}
        >
          {formatPEN(amount)}
        </AppText>
      </View>
    </View>
  );
};

/* --------------------------- Status Pill -------------------------- */
const StatusPill = ({ status }: { status: Payment['paymentStatus'] }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  // Shorter text so it doesn't wrap vertically
  const map: Record<
    Payment['paymentStatus'],
    {
      label: string;
      bg: string;
      text: string;
      icon: keyof typeof Ionicons.glyphMap;
    }
  > = {
    PENDING_CLIENT_APPROVAL: {
      label: 'Pendiente aprobación',
      bg: theme.background.input,
      text: theme.text.primary,
      icon: 'time-outline',
    },
    AVAILABLE_FOR_COLLECTION: {
      label: 'Disponible para cobrar',
      bg: theme.status.info.bg,
      text: theme.status.info.text,
      icon: 'time-outline',
    },
    COLLECTED: {
      label: 'Cobrado',
      bg: theme.status.success.bg,
      text: theme.status.success.text,
      icon: 'checkmark-circle-outline',
    },
  };

  const s = map[status];
  return (
    <View style={[styles.statusPill, { backgroundColor: s.bg }]}>
      <Ionicons
        name={s.icon}
        size={14}
        color={s.text}
        style={{ marginRight: 6 }}
      />
      <AppText style={[styles.statusText, { color: s.text }]} numberOfLines={1}>
        {s.label}
      </AppText>
    </View>
  );
};

/* --------------------------- Table Header ------------------------- */
const TableHeader = () => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={[styles.row, styles.headerRow]}>
      <AppText style={[styles.th, { flex: 1.0 }]}>Fecha</AppText>
      <AppText style={[styles.th, { flex: 1.2 }]}>Cliente</AppText>
      <AppText style={[styles.th, { flex: 1.8 }]}>Servicio</AppText>
      <AppText style={[styles.th, styles.numCol]}>Monto Total</AppText>
      <AppText style={[styles.th, styles.numCol]}>Comisión (5%)</AppText>
      <AppText style={[styles.th, styles.numCol]}>Tus Ganancias</AppText>
      <AppText style={[styles.th, { flex: 1.8 }]}>Estado</AppText>
      <AppText style={[styles.th, { width: 92, textAlign: 'center' }]}>
        Acciones
      </AppText>
    </View>
  );
};

/* ---------------------------- Table Row --------------------------- */
const PaymentRow = ({
  item,
  onCollect,
}: {
  item: Payment;
  onCollect: (p: Payment) => void;
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const isCollectable = item.paymentStatus === 'AVAILABLE_FOR_COLLECTION';

  return (
    <View style={[styles.row, styles.bodyRow]}>
      <AppText style={[styles.td, { flex: 1.0 }]}>
        {formatDate(item.paymentDate)}
      </AppText>
      <AppText style={[styles.td, { flex: 1.2 }]} numberOfLines={1}>
        {item.clientName}
      </AppText>
      <AppText style={[styles.td, { flex: 1.8 }]} numberOfLines={1}>
        {item.serviceName}
      </AppText>

      <AppText style={[styles.td, styles.numCol]}>
        {formatPEN(item.totalAmount)}
      </AppText>
      <AppText style={[styles.td, styles.numCol]}>
        {formatPEN(item.platformCommission)}
      </AppText>
      <AppText
        style={[styles.td, styles.numCol, { color: theme.brand.primary }]}
      >
        {formatPEN(item.trainerEarnings)}
      </AppText>

      <View style={[styles.tdCell, { flex: 1.8, justifyContent: 'center' }]}>
        <StatusPill status={item.paymentStatus} />
      </View>

      <View style={[styles.tdCell, { width: 92, alignItems: 'center' }]}>
        {isCollectable ? (
          <TouchableOpacity
            style={styles.collectBtn}
            onPress={() => onCollect(item)}
          >
            <AppText style={styles.collectBtnText}>Cobrar</AppText>
          </TouchableOpacity>
        ) : (
          <AppText variant="caption" style={styles.muted}>
            —
          </AppText>
        )}
      </View>
    </View>
  );
};

/* --------------------------- Main Screen -------------------------- */
export default function TrainerPaymentsScreen() {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const { width } = useWindowDimensions();

  const { data: payments } = useTrainerGetPayments();
  const { data: paymentsSummary } = useTrainerGetPaymentsSummary();

  // ----- Filters (client-side demo; wire to BE as needed) -----
  type StatusOpt = 'ALL' | Payment['paymentStatus'];
  const [status, setStatus] = useState<StatusOpt>('ALL');
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return payments?.payments?.filter((p: Payment) => {
      const statusOk = status === 'ALL' || p.paymentStatus === status;
      const d = p.paymentDate ? new Date(p.paymentDate).getTime() : null;

      const startOk =
        !startDate || (d !== null && d >= new Date(startDate).getTime());
      const endOk =
        !endDate || (d !== null && d <= new Date(endDate).getTime());

      const dateOk = !startDate && !endDate ? true : startOk && endOk;
      return statusOk && dateOk;
    });
  }, [payments, status, startDate, endDate]);

  const onClearFilters = () => {
    setStatus('ALL');
    setStartDate(null);
    setEndDate(null);
  };
  const onCollect = (_p: Payment) => {
    // TODO: wire collect flow when backend is ready
  };

  const TABLE_MIN_WIDTH = 920; // give columns breathing room

  return (
    <PageContainer
      title="Mis Pagos"
      subheader="Gestiona y revisa todos tus ingresos por servicios de entrenamiento"
    >
      <View style={styles.contentWrap}>
        <AppText style={styles.sectionTitle}>RESUMEN</AppText>
        <View style={styles.summaryColumn}>
          <SummaryCard
            icon={
              <Ionicons
                name="checkmark-done"
                size={18}
                color={theme.background.app}
              />
            }
            label="COBRADO HASTA LA FECHA"
            amount={paymentsSummary?.collectedToDate}
            tone="green"
          />
          <SummaryCard
            icon={
              <Ionicons
                name="time-outline"
                size={18}
                color={theme.background.app}
              />
            }
            label="PENDIENTE DE COBRO"
            amount={paymentsSummary?.pendingCollection}
            tone="blue"
          />
          <SummaryCard
            icon={
              <MaterialCommunityIcons
                name="wallet-outline"
                size={18}
                color={theme.background.app}
              />
            }
            label="DISPONIBLE PARA COBRAR"
            amount={paymentsSummary?.availableForCollection}
            tone="orange"
          />
        </View>

        <View style={styles.filterCard}>
          <AppText style={styles.filterHint}>
            Filtrar por estado de cobro y rango de fechas
          </AppText>

          <View style={styles.tabRow}>
            {(
              [
                ['ALL', 'Todos'],
                ['PENDING_CLIENT_APPROVAL', 'Pendiente'],
                ['AVAILABLE_FOR_COLLECTION', 'Disponible'],
                ['COLLECTED', 'Cobrado'],
              ] as const
            ).map(([value, label]) => {
              const isActive = status === value;
              return (
                <TouchableOpacity
                  key={value}
                  style={[styles.tabButton, isActive && styles.tabButtonActive]}
                  onPress={() => setStatus(value)}
                  activeOpacity={0.8}
                >
                  <AppText
                    style={[styles.tabText, isActive && styles.tabTextActive]}
                    numberOfLines={1}
                  >
                    {label}
                  </AppText>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.dateRow}>
            <TouchableOpacity
              style={styles.dateChip}
              onPress={() =>
                setStartDate((d) => (d ? null : new Date().toISOString()))
              }
            >
              <Ionicons
                name="calendar-outline"
                size={14}
                color={theme.text.secondary}
                style={styles.dateChipIcon}
              />
              <AppText style={styles.dateChipLabel}>Desde</AppText>
              <AppText style={styles.dateChipValue} numberOfLines={1}>
                {startDate ? formatDate(startDate) : '—'}
              </AppText>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.dateChip}
              onPress={() =>
                setEndDate((d) => (d ? null : new Date().toISOString()))
              }
            >
              <Ionicons
                name="calendar-outline"
                size={14}
                color={theme.text.secondary}
                style={styles.dateChipIcon}
              />
              <AppText style={styles.dateChipLabel}>Hasta</AppText>
              <AppText style={styles.dateChipValue} numberOfLines={1}>
                {endDate ? formatDate(endDate) : '—'}
              </AppText>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.clearFiltersBtn}
              onPress={onClearFilters}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons
                name="close-circle-outline"
                size={16}
                color={theme.text.secondary}
                style={styles.clearFiltersIcon}
              />
              <AppText style={styles.clearFiltersText}>Limpiar</AppText>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.tableCard}>
          <AppText style={styles.sectionTitle}>HISTORIAL DE PAGOS</AppText>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 4 }}
          >
            <View style={{ width: Math.max(TABLE_MIN_WIDTH, width - 32) }}>
              <TableHeader />

              <FlatList
                data={filtered}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => (
                  <PaymentRow item={item} onCollect={onCollect} />
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                ListEmptyComponent={
                  <View style={{ paddingVertical: 18 }}>
                    <AppText style={styles.muted}>
                      No hay pagos que coincidan con los filtros.
                    </AppText>
                  </View>
                }
              />
            </View>
          </ScrollView>
        </View>
      </View>
    </PageContainer>
  );
}

/* ------------------------------ Styles ---------------------------- */
const getStyles = (theme: AppTheme) => {
  const text = textStyles(theme);
  return StyleSheet.create({
    contentWrap: {
      gap: 16,
      paddingVertical: 8,
    },
    sectionTitle: {
      ...text.captionSemibold,
      color: theme.text.secondary,
      letterSpacing: 0.6,
      textTransform: 'uppercase',
      marginBottom: 4,
    },
    summaryColumn: {
      flexDirection: 'column',
      gap: 10,
      marginBottom: 4,
    },
    summaryCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      borderRadius: 14,
      padding: 14,
      borderWidth: 1,
      borderColor: theme.border.default,
      backgroundColor: theme.background.card,
    },
    summaryIconWrap: {
      width: 40,
      height: 40,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    summaryLabel: {
      ...text.captionSemibold,
      letterSpacing: 0.2,
      textTransform: 'uppercase',
    },
    summaryAmount: { ...text.sectionTitle, marginTop: 2 },

    filterCard: {
      backgroundColor: theme.background.input,
      borderRadius: 14,
      borderLeftWidth: 4,
      borderLeftColor: theme.brand.primary,
      paddingVertical: 14,
      paddingHorizontal: 16,
      marginBottom: 4,
    },
    filterHint: {
      ...text.caption,
      color: theme.text.secondary,
      marginBottom: 12,
    },
    tabRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    tabButton: {
      paddingVertical: 10,
      paddingHorizontal: 14,
      borderRadius: 10,
      backgroundColor: theme.background.card,
      borderWidth: 1,
      borderColor: theme.border.default,
    },
    tabButtonActive: {
      backgroundColor: theme.brand.primary,
      borderColor: theme.brand.primary,
    },
    tabText: {
      ...text.captionSemibold,
      color: theme.text.secondary,
    },
    tabTextActive: {
      color: theme.background.app,
    },
    dateRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: 10,
      marginTop: 12,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: theme.border.default,
    },
    dateChip: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.background.card,
      borderRadius: 10,
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderWidth: 1,
      borderColor: theme.border.default,
      minWidth: 100,
    },
    dateChipIcon: { marginRight: 6 },
    dateChipLabel: {
      ...text.label,
      color: theme.text.secondary,
      marginRight: 6,
      textTransform: 'uppercase',
    },
    dateChipValue: {
      flex: 1,
      ...text.captionSemibold,
      color: theme.text.primary,
    },
    clearFiltersBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 8,
      paddingHorizontal: 4,
    },
    clearFiltersIcon: { marginRight: 4 },
    clearFiltersText: {
      ...text.captionSemibold,
      color: theme.text.secondary,
    },

    tableCard: {
      backgroundColor: theme.background.card,
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: theme.border.default,
    },
    headerRow: {
      backgroundColor: theme.background.input,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 8,
    },
    th: {
      ...text.captionSemibold,
      color: theme.text.secondary,
      paddingHorizontal: 6,
    },
    td: {
      ...text.nav,
      color: theme.text.primary,
    },
    tdCell: {
      paddingHorizontal: 6,
    },
    numCol: { flex: 1.2, textAlign: 'right' as const },
    bodyRow: { backgroundColor: theme.background.card },
    separator: { height: 1, backgroundColor: theme.border.default },

    statusPill: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 999,
      paddingHorizontal: 10,
      paddingVertical: 6,
      alignSelf: 'flex-start',
    },
    statusText: { ...text.captionSemibold },

    collectBtn: {
      backgroundColor: theme.brand.primary,
      paddingVertical: 10,
      paddingHorizontal: 14,
      borderRadius: 10,
    },
    collectBtnText: {
      ...text.captionSemibold,
      color: theme.background.app,
    },

    muted: { color: theme.text.secondary },
  });
};
