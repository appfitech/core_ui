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

import { HEADING_STYLES } from '@/constants/shared_styles';
import { useTheme } from '@/contexts/ThemeContext';
import { FullTheme } from '@/types/theme';

import {
  useTrainerGetPayments,
  useTrainerGetPaymentsSummary,
} from '../api/queries/use-trainer-get-payments';
import { AppText } from '../components/AppText';
import PageContainer from '../components/PageContainer';

type PaymentsSummary = {
  collectedToDate: number;
  pendingCollection: number;
  availableForCollection: number;
};

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
    <View
      style={[
        styles.summaryCard,
        {
          backgroundColor: theme.background,
          borderColor: theme.border,
        },
      ]}
    >
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
          { color: theme.primaryText, fontWeight: '800' },
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
    return payments?.payments?.filter((p) => {
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

  const onApplyFilters = () => {};
  const onClearFilters = () => {
    setStatus('ALL');
    setStartDate(null);
    setEndDate(null);
  };
  const onCollect = (p: Payment) => {
    console.log('Collect pressed for payment:', p.id);
  };

  const TABLE_MIN_WIDTH = 920; // give columns breathing room

  return (
    <PageContainer hasBackButton={true} style={{ padding: 16 }}>
      <View style={{ rowGap: 6, paddingVertical: 8 }}>
        <AppText style={styles.title}>Mis Pagos</AppText>
        <AppText style={styles.subtitle}>
          Gestiona y revisa todos tus ingresos por servicios de entrenamiento
        </AppText>
      </View>

      {/* Summary cards */}
      <View style={styles.summaryRow}>
        <SummaryCard
          icon={<Ionicons name="checkmark-done" size={18} color="#FFF" />}
          label="COBRADO HASTA LA FECHA"
          amount={paymentsSummary?.collectedToDate}
          tone="green"
        />
        <SummaryCard
          icon={<Ionicons name="time-outline" size={18} color="#FFF" />}
          label="PENDIENTE DE COBRO"
          amount={paymentsSummary?.pendingCollection}
          tone="blue"
        />
        <SummaryCard
          icon={
            <MaterialCommunityIcons
              name="wallet-outline"
              size={18}
              color="#FFF"
            />
          }
          label="DISPONIBLE PARA COBRAR"
          amount={paymentsSummary?.availableForCollection}
          tone="orange"
        />
      </View>

      {/* Filters */}
      <View style={styles.filtersCard}>
        <AppText style={styles.filtersTitle}>Filtros</AppText>

        <View style={styles.filtersRow}>
          {/* Status dropdown placeholder */}
          <TouchableOpacity
            style={styles.inputLike}
            onPress={() => {
              // demo cycle
              setStatus((prev) =>
                prev === 'ALL'
                  ? 'PENDING_CLIENT_APPROVAL'
                  : prev === 'PENDING_CLIENT_APPROVAL'
                    ? 'AVAILABLE_FOR_COLLECTION'
                    : prev === 'AVAILABLE_FOR_COLLECTION'
                      ? 'COLLECTED'
                      : 'ALL',
              );
            }}
          >
            <AppText style={styles.inputLabel}>Estado de Cobro</AppText>
            <View style={styles.inputValueRow}>
              <AppText style={styles.inputValue} numberOfLines={1}>
                {status === 'ALL'
                  ? 'Todos los estados'
                  : status === 'PENDING_CLIENT_APPROVAL'
                    ? 'Pendiente aprobación'
                    : status === 'AVAILABLE_FOR_COLLECTION'
                      ? 'Disponible para cobrar'
                      : 'Cobrado'}
              </AppText>
              <Ionicons name="chevron-down" size={16} color={theme.dark400} />
            </View>
          </TouchableOpacity>

          {/* Start date placeholder */}
          <TouchableOpacity
            style={styles.inputLike}
            onPress={() => {
              setStartDate((d) => (d ? null : new Date().toISOString()));
            }}
          >
            <AppText style={styles.inputLabel}>Fecha Inicio</AppText>
            <View style={styles.inputValueRow}>
              <AppText style={styles.inputValue}>
                {formatDate(startDate)}
              </AppText>
              <Ionicons
                name="calendar-outline"
                size={16}
                color={theme.dark400}
              />
            </View>
          </TouchableOpacity>

          {/* End date placeholder */}
          <TouchableOpacity
            style={styles.inputLike}
            onPress={() => {
              setEndDate((d) => (d ? null : new Date().toISOString()));
            }}
          >
            <AppText style={styles.inputLabel}>Fecha Fin</AppText>
            <View style={styles.inputValueRow}>
              <AppText style={styles.inputValue}>{formatDate(endDate)}</AppText>
              <Ionicons
                name="calendar-outline"
                size={16}
                color={theme.dark400}
              />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.filtersActions}>
          <TouchableOpacity style={styles.applyBtn} onPress={onApplyFilters}>
            <Ionicons
              name="funnel-outline"
              size={16}
              color="#FFF"
              style={{ marginRight: 6 }}
            />
            <AppText style={styles.applyBtnText}>Aplicar Filtros</AppText>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClearFilters}>
            <AppText style={styles.clearText}>Limpiar</AppText>
          </TouchableOpacity>
        </View>
      </View>

      {/* Payment history (horizontal-scroll table) */}
      <View style={styles.tableCard}>
        <AppText style={styles.tableTitle}>Historial de Pagos</AppText>

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
    </PageContainer>
  );
}

/* ------------------------------ Styles ---------------------------- */
const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    summaryRow: {
      gap: 12,
      marginVertical: 10,
    },
    summaryCard: {
      flex: 1,
      borderRadius: 12,
      padding: 14,
      borderWidth: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    summaryIconWrap: {
      width: 36,
      height: 36,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    summaryLabel: { fontSize: 12, fontWeight: '700', letterSpacing: 0.2 },
    summaryAmount: { fontSize: 20, fontWeight: '900', marginTop: 2 },

    filtersCard: {
      backgroundColor: theme.background,
      borderRadius: 12,
      padding: 14,
      marginTop: 8,
      marginBottom: 14,
      borderWidth: 1,
      borderColor: theme.border,
    },
    filtersTitle: {
      fontSize: 16,
      fontWeight: '800',
      color: theme.textPrimary,
      marginBottom: 10,
    },
    filtersRow: {
      flexDirection: 'row',
      gap: 10,
    },
    inputLike: {
      flex: 1,
      backgroundColor: theme.backgroundInput,
      borderRadius: 10,
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderWidth: 1,
      borderColor: theme.border,
    },
    inputLabel: {
      fontSize: 12,
      color: theme.dark500,
      marginBottom: 4,
      fontWeight: '700',
    },
    inputValueRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    inputValue: { fontSize: 14, color: theme.textPrimary, fontWeight: '700' },

    filtersActions: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 12,
    },
    applyBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.primary,
      borderRadius: 12,
      paddingHorizontal: 14,
      paddingVertical: 12,
      shadowColor: theme.primary,
      shadowOpacity: 0.25,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
    },
    applyBtnText: { color: theme.background, fontWeight: '900', fontSize: 13 },
    clearText: { color: theme.dark500, fontWeight: '800' },

    tableCard: {
      backgroundColor: theme.background,
      borderRadius: 12,
      padding: 12,
      borderWidth: 1,
      borderColor: theme.border,
    },
    tableTitle: {
      fontSize: 16,
      fontWeight: '900',
      color: theme.textPrimary,
      marginBottom: 8,
    },
    headerRow: {
      backgroundColor: theme.backgroundInput,
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8,
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
    bodyRow: { backgroundColor: theme.background },
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

    muted: { color: theme.dark500 },

    ...HEADING_STYLES(theme),
    title: {
      ...HEADING_STYLES(theme).title,
      color: theme.textPrimary,
    },
    subtitle: {
      ...HEADING_STYLES(theme).subtitle,
      color: theme.dark600,
    },
  });
