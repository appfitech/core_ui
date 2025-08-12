// TrainerPaymentsScreen.tsx
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';

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

type PaymentsResponse = {
  payments: Payment[];
  summary: PaymentsSummary;
  totalPages: number;
  currentPage: number;
  totalElements: number;
};

const PEN = new Intl.NumberFormat('es-PE', {
  style: 'currency',
  currency: 'PEN',
  minimumFractionDigits: 2,
});
const formatPEN = (n: number) => PEN.format(n);

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

const SummaryCard = ({
  icon,
  label,
  amount,
  tone = 'purple',
}: {
  icon: React.ReactNode;
  label: string;
  amount: number;
  tone?: 'purple' | 'orange' | 'green';
}) => {
  const colorMap: Record<string, { bg: string; iconBg: string; text: string }> =
    {
      purple: { bg: '#F3E8FF', iconBg: '#7E57C2', text: '#4A148C' },
      orange: { bg: '#FFF3E0', iconBg: '#FB8C00', text: '#E65100' },
      green: { bg: '#E8F5E9', iconBg: '#2E7D32', text: '#1B5E20' },
    };

  const c = colorMap[tone];
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={[styles.summaryCard, { backgroundColor: '#FFF' }]}>
      <View style={[styles.summaryIconWrap, { backgroundColor: c.iconBg }]}>
        {icon}
      </View>
      <View style={{ flex: 1 }}>
        <AppText style={[styles.summaryLabel, { color: '#5C5F62' }]}>
          {label}
        </AppText>
        <AppText style={[styles.summaryAmount, { color: c.text }]}>
          {formatPEN(amount)}
        </AppText>
      </View>
    </View>
  );
};

const StatusPill = ({ status }: { status: Payment['paymentStatus'] }) => {
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
      label: 'Pendiente de aprobación del cliente',
      bg: '#F3F4F6',
      text: '#374151',
      icon: 'time-outline',
    },
    AVAILABLE_FOR_COLLECTION: {
      label: 'Disponible para cobrar',
      bg: '#EFE9FF',
      text: '#5E35B1',
      icon: 'time-outline',
    },
    COLLECTED: {
      label: 'Cobrado',
      bg: '#E6F4EA',
      text: '#1E7B4D',
      icon: 'checkmark-circle-outline',
    },
  };

  const { theme } = useTheme();
  const styles = getStyles(theme);

  const s = map[status] ?? {};
  return (
    <View style={[styles.statusPill, { backgroundColor: s?.bg }]}>
      <Ionicons
        name={s.icon}
        size={14}
        color={s.text}
        style={{ marginRight: 6 }}
      />
      <AppText style={[styles.statusText, { color: s.text }]}>
        {s.label}
      </AppText>
    </View>
  );
};

const TableHeader = () => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={[styles.row, styles.headerRow]}>
      <AppText style={[styles.th, { flex: 1.1 }]}>Fecha</AppText>
      <AppText style={[styles.th, { flex: 1.1 }]}>Cliente</AppText>
      <AppText style={[styles.th, { flex: 1.6 }]}>Servicio</AppText>
      <AppText style={[styles.th, styles.numCol]}>Monto Total</AppText>
      <AppText style={[styles.th, styles.numCol]}>Comisión (5%)</AppText>
      <AppText style={[styles.th, styles.numCol]}>Tus Ganancias</AppText>
      <AppText style={[styles.th, { flex: 1.4 }]}>Estado</AppText>
      <AppText style={[styles.th, { width: 82, textAlign: 'center' }]}>
        Acciones
      </AppText>
    </View>
  );
};

const PaymentRow = ({
  item,
  onCollect,
}: {
  item: Payment;
  onCollect: (p: Payment) => void;
}) => {
  const isCollectable = item.paymentStatus === 'AVAILABLE_FOR_COLLECTION';
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={[styles.row, styles.bodyRow]}>
      <AppText style={[styles.td, { flex: 1.1 }]}>
        {formatDate(item.paymentDate)}
      </AppText>
      <AppText style={[styles.td, { flex: 1.1 }]}>{item.clientName}</AppText>
      <AppText style={[styles.td, { flex: 1.6 }]} numberOfLines={2}>
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
          [styles.numCol, { color: '#1E7B4D', fontWeight: '700' }],
        ]}
      >
        {formatPEN(item.trainerEarnings)}
      </AppText>
      <View style={[styles.td, { flex: 1.4 }]}>
        <StatusPill status={item.paymentStatus} />
      </View>

      <View style={[styles.td, { width: 82, alignItems: 'center' }]}>
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

export default function TrainerPaymentsScreen() {
  const { theme } = useTheme();
  const styles = getStyles(theme);

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

      // If there is no paymentDate, we only include it when there is no date filter
      const dateOk = !startDate && !endDate ? true : startOk && endOk;

      return statusOk && dateOk;
    });
  }, [payments, status, startDate, endDate]);

  const onApplyFilters = () => {
    // In a real app, call your query with params:
    // refetch({ status, startDate, endDate })
  };
  const onClearFilters = () => {
    setStatus('ALL');
    setStartDate(null);
    setEndDate(null);
  };

  const onCollect = (p: Payment) => {
    // Wire your "request collection" or "withdraw" action here.
    console.log('Collect pressed for payment:', p.id);
  };

  return (
    <PageContainer hasBackButton={false} style={{ padding: 16 }}>
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
          tone="purple"
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
              // Replace with ActionSheet or your dropdown.
              // Quick cycle for demo:
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
              <AppText style={styles.inputValue}>
                {status === 'ALL'
                  ? 'Todos los estados'
                  : status === 'PENDING_CLIENT_APPROVAL'
                    ? 'Pendiente de aprobación'
                    : status === 'AVAILABLE_FOR_COLLECTION'
                      ? 'Disponible para cobrar'
                      : 'Cobrado'}
              </AppText>
              <Ionicons name="chevron-down" size={16} color="#6B7280" />
            </View>
          </TouchableOpacity>

          {/* Start date placeholder */}
          <TouchableOpacity
            style={styles.inputLike}
            onPress={() => {
              // Hook up a DateTimePicker
              // For now, toggle a sample date:
              setStartDate((d) => (d ? null : new Date().toISOString()));
            }}
          >
            <AppText style={styles.inputLabel}>Fecha Inicio</AppText>
            <View style={styles.inputValueRow}>
              <AppText style={styles.inputValue}>
                {formatDate(startDate)}
              </AppText>
              <Ionicons name="calendar-outline" size={16} color="#6B7280" />
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
              <Ionicons name="calendar-outline" size={16} color="#6B7280" />
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

      {/* Payment history (table-like) */}
      <View style={styles.tableCard}>
        <AppText style={styles.tableTitle}>Historial de Pagos</AppText>
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
    </PageContainer>
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    summaryRow: {
      gap: 12,
      marginVertical: 10,
    },
    summaryCard: {
      flex: 1,
      borderRadius: 10,
      padding: 12,
      shadowColor: '#000',
      shadowOpacity: 0.06,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
      elevation: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    summaryIconWrap: {
      width: 34,
      height: 34,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    summaryLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 0.2 },
    summaryAmount: { fontSize: 18, fontWeight: '800', marginTop: 2 },

    filtersCard: {
      backgroundColor: '#FFF',
      borderRadius: 12,
      padding: 12,
      marginTop: 8,
      marginBottom: 14,
      shadowColor: '#000',
      shadowOpacity: 0.05,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
      elevation: 1,
    },
    filtersTitle: {
      fontSize: 15,
      fontWeight: '700',
      color: '#111',
      marginBottom: 8,
    },
    filtersRow: {
      flexDirection: 'row',
      gap: 10,
    },
    inputLike: {
      flex: 1,
      backgroundColor: '#F3F4F6',
      borderRadius: 10,
      paddingHorizontal: 10,
      paddingVertical: 8,
    },
    inputLabel: {
      fontSize: 11,
      color: '#6B7280',
      marginBottom: 2,
      fontWeight: '600',
    },
    inputValueRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    inputValue: { fontSize: 13, color: '#111', fontWeight: '600' },

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
      borderRadius: 10,
      paddingHorizontal: 12,
      paddingVertical: 10,
    },
    applyBtnText: { color: '#FFF', fontWeight: '800', fontSize: 13 },
    clearText: { color: '#6B7280', fontWeight: '700' },

    tableCard: {
      backgroundColor: '#FFF',
      borderRadius: 12,
      padding: 12,
      shadowColor: '#000',
      shadowOpacity: 0.05,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
      elevation: 1,
    },
    tableTitle: {
      fontSize: 15,
      fontWeight: '700',
      color: '#111',
      marginBottom: 6,
    },
    headerRow: {
      backgroundColor: '#F9FAFB',
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'stretch',
      paddingVertical: 10,
      paddingHorizontal: 6,
    },
    th: {
      fontSize: 11,
      fontWeight: '800',
      color: '#4B5563',
      paddingHorizontal: 4,
    },
    td: {
      paddingHorizontal: 4,
      fontSize: 12,
      color: '#111',
    },
    numCol: { flex: 1.1, textAlign: 'right' as const },
    bodyRow: { backgroundColor: '#FFF' },
    separator: {
      height: 1,
      backgroundColor: '#E5E7EB',
    },

    statusPill: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 999,
      paddingHorizontal: 8,
      paddingVertical: 4,
      alignSelf: 'flex-start',
    },
    statusText: { fontSize: 11, fontWeight: '700' },

    collectBtn: {
      backgroundColor: '#3F51B5',
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 8,
    },
    collectBtnText: { color: '#FFF', fontWeight: '800', fontSize: 12 },

    muted: { color: '#6B7280' },

    ...HEADING_STYLES(theme),
    title: {
      ...HEADING_STYLES(theme).title,
    },
    subtitle: {
      ...HEADING_STYLES(theme).subtitle,
    },
  });
