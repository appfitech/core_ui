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

import { useTheme } from '@/contexts/ThemeContext';
import { FullTheme } from '@/types/theme';

import {
  useTrainerGetPayments,
  useTrainerGetPaymentsSummary,
} from '../api/queries/use-trainer-get-payments';
import { AppText } from '../components/AppText';
import PageContainer from '../components/PageContainer';

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
          bg: theme.successBackground,
          border: theme.successBorder,
          text: theme.successText,
          iconBg: theme.success,
        }
      : tone === 'blue'
        ? {
            bg: theme.infoBackground,
            border: theme.infoBorder,
            text: theme.infoText,
            iconBg: theme.info,
          }
        : {
            bg: theme.orangeBackground,
            border: theme.orangeBorder,
            text: theme.orangeText,
            iconBg: theme.orange,
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
          style={[styles.summaryLabel, { color: theme.textSecondary }]}
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
      bg: theme.backgroundInput,
      text: theme.textPrimary,
      icon: 'time-outline',
    },
    AVAILABLE_FOR_COLLECTION: {
      label: 'Disponible para cobrar',
      bg: theme.infoBackground,
      text: theme.infoText,
      icon: 'time-outline',
    },
    COLLECTED: {
      label: 'Cobrado',
      bg: theme.successBackground,
      text: theme.successText,
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
        style={[
          styles.td,
          styles.numCol,
          { color: theme.primary, fontWeight: '800' },
        ]}
      >
        {formatPEN(item.trainerEarnings)}
      </AppText>

      <View style={[styles.td, { flex: 1.8, justifyContent: 'center' }]}>
        <StatusPill status={item.paymentStatus} />
      </View>

      <View style={[styles.td, { width: 92, alignItems: 'center' }]}>
        {isCollectable ? (
          <TouchableOpacity
            style={styles.collectBtn}
            onPress={() => onCollect(item)}
          >
            <AppText style={styles.collectBtnText}>Cobrar</AppText>
          </TouchableOpacity>
        ) : (
          <AppText style={[styles.muted, { fontSize: 12 }]}>—</AppText>
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
      style={styles.pageStyle}
      contentPaddingBottom={120}
    >
      <View style={styles.contentWrap}>
        <AppText style={styles.sectionTitle}>RESUMEN</AppText>
        <View style={styles.summaryColumn}>
          <SummaryCard
            icon={
              <Ionicons
                name="checkmark-done"
                size={18}
                color={theme.background}
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
                color={theme.background}
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
                color={theme.background}
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
                color={theme.textSecondary}
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
                color={theme.textSecondary}
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
                color={theme.textSecondary}
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
const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    pageStyle: {},
    contentWrap: {
      gap: 16,
      paddingVertical: 8,
    },
    sectionTitle: {
      fontSize: 12,
      fontWeight: '700',
      color: theme.textSecondary,
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
      borderColor: theme.border,
      backgroundColor: theme.card,
    },
    summaryIconWrap: {
      width: 40,
      height: 40,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    summaryLabel: {
      fontSize: 12,
      fontWeight: '700',
      letterSpacing: 0.2,
      textTransform: 'uppercase',
    },
    summaryAmount: { fontSize: 20, fontWeight: '900', marginTop: 2 },

    filterCard: {
      backgroundColor: theme.backgroundInput,
      borderRadius: 14,
      borderLeftWidth: 4,
      borderLeftColor: theme.primary,
      paddingVertical: 14,
      paddingHorizontal: 16,
      marginBottom: 4,
    },
    filterHint: {
      fontSize: 12,
      color: theme.textSecondary,
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
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
    },
    tabButtonActive: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    tabText: {
      fontSize: 13,
      fontWeight: '700',
      color: theme.textSecondary,
    },
    tabTextActive: {
      color: theme.background,
    },
    dateRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: 10,
      marginTop: 12,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: theme.border,
    },
    dateChip: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.card,
      borderRadius: 10,
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderWidth: 1,
      borderColor: theme.border,
      minWidth: 100,
    },
    dateChipIcon: { marginRight: 6 },
    dateChipLabel: {
      fontSize: 11,
      fontWeight: '600',
      color: theme.textSecondary,
      marginRight: 6,
      textTransform: 'uppercase',
    },
    dateChipValue: {
      flex: 1,
      fontSize: 13,
      fontWeight: '700',
      color: theme.textPrimary,
    },
    clearFiltersBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 8,
      paddingHorizontal: 4,
    },
    clearFiltersIcon: { marginRight: 4 },
    clearFiltersText: {
      fontSize: 13,
      fontWeight: '700',
      color: theme.textSecondary,
    },

    tableCard: {
      backgroundColor: theme.card,
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: theme.border,
    },
    headerRow: {
      backgroundColor: theme.backgroundInput,
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
      fontSize: 12,
      fontWeight: '900',
      color: theme.textSecondary,
      paddingHorizontal: 6,
    },
    td: {
      paddingHorizontal: 6,
      fontSize: 13,
      color: theme.textPrimary,
    },
    numCol: { flex: 1.2, textAlign: 'right' as const },
    bodyRow: { backgroundColor: theme.card },
    separator: { height: 1, backgroundColor: theme.border },

    statusPill: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 999,
      paddingHorizontal: 10,
      paddingVertical: 6,
      alignSelf: 'flex-start',
    },
    statusText: { fontSize: 12, fontWeight: '800' },

    collectBtn: {
      backgroundColor: theme.primary,
      paddingVertical: 10,
      paddingHorizontal: 14,
      borderRadius: 10,
    },
    collectBtnText: {
      color: theme.background,
      fontWeight: '900',
      fontSize: 12,
    },

    muted: { color: theme.textSecondary },
  });
