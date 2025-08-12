import { Entypo, Feather, Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

import { HEADING_STYLES } from '@/constants/shared_styles';
import { useTheme } from '@/contexts/ThemeContext';
import { useDebounce } from '@/hooks/use-debounce';
import { FullTheme } from '@/types/theme';

import { useTrainerGetClients } from '../api/queries/use-trainer-get-clients';
import { AppText } from '../components/AppText';
import PageContainer from '../components/PageContainer';
import { SearchBar } from '../components/SearchBar';

type ServiceItem = {
  serviceId: number;
  contractId: number;
  serviceName: string;
  serviceDescription: string;
  servicePricePerSession: number; // PEN
  serviceType: string;
  modality: 'remoto' | 'presencial' | string;
  transportIncluded: boolean;
  transportCost: number;
  status: 'active' | 'paused' | 'finished' | string;
  startDate: string; // ISO
  endDate: string | null;
  totalPaid: number; // PEN
};

type ClientItem = {
  clientId: number;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  profilePhotoId?: number | null;
  fitnessGoals: string[];
  services: ServiceItem[];
  totalServicesCount: number;
  activeServicesCount: number;
  totalAmountPaid: number;
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

const Chip = ({
  text,
  tone = 'neutral',
}: {
  text: string;
  tone?: 'neutral' | 'success';
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <View
      style={[
        styles.chip,
        tone === 'success' ? styles.chipSuccess : styles.chipNeutral,
      ]}
    >
      <AppText
        style={[
          styles.chipText,
          tone === 'success' ? styles.chipTextSuccess : styles.chipTextNeutral,
        ]}
      >
        {text}
      </AppText>
    </View>
  );
};

const StatusPill = ({ status }: { status: ServiceItem['status'] }) => {
  const map: Record<string, { bg: string; text: string; label: string }> = {
    active: { bg: '#E6F4EA', text: '#1E7B4D', label: 'Activo' },
    paused: { bg: '#FFF4E5', text: '#B76E00', label: 'Pausado' },
    finished: { bg: '#ECEFF1', text: '#455A64', label: 'Finalizado' },
  };
  const style = map[status] ?? map.active;

  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={[styles.statusPill, { backgroundColor: style.bg }]}>
      <AppText style={[styles.statusPillText, { color: style.text }]}>
        {style.label}
      </AppText>
    </View>
  );
};

const MetaRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={styles.metaRow}>
      <View style={styles.metaLeft}>
        {icon}
        <AppText style={styles.metaLabel}>{label}</AppText>
      </View>
      <AppText style={styles.metaValue}>{value}</AppText>
    </View>
  );
};

const ServiceCard = ({ s }: { s: ServiceItem }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={styles.serviceCardWrap}>
      <View style={styles.cardAccent} />
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <AppText style={styles.cardTitle}>{s.serviceName}</AppText>
          <TouchableOpacity hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Entypo name="dots-three-vertical" size={16} color="#555" />
          </TouchableOpacity>
        </View>

        {!!s.serviceDescription && (
          <AppText style={styles.cardDesc} numberOfLines={6}>
            {s.serviceDescription.trim()}
          </AppText>
        )}

        <View style={styles.priceBox}>
          <View style={styles.priceIcon}>
            <Ionicons name="cash-outline" size={16} color="#1E7B4D" />
          </View>
          <AppText style={styles.priceText}>
            {formatPEN(s.servicePricePerSession)}{' '}
            <AppText style={styles.priceSuffix}>por sesión</AppText>
          </AppText>
        </View>

        <View style={styles.rowChips}>
          <View style={styles.modalityPill}>
            <Ionicons
              name={s.modality === 'remoto' ? 'videocam' : 'walk'}
              size={14}
              color="#111"
              style={{ marginRight: 6 }}
            />
            <AppText style={styles.modalityText}>
              {s.modality === 'remoto' ? 'Remoto' : 'Presencial'}
            </AppText>
          </View>

          <StatusPill status={s.status} />
        </View>

        <MetaRow
          icon={
            <Ionicons
              name="play"
              size={14}
              color="#111"
              style={{ marginRight: 8 }}
            />
          }
          label="Inicio:"
          value={formatDate(s.startDate)}
        />
        <MetaRow
          icon={
            <Ionicons
              name="card"
              size={14}
              color="#111"
              style={{ marginRight: 8 }}
            />
          }
          label="Pagado:"
          value={formatPEN(s.totalPaid)}
        />
      </View>
    </View>
  );
};

export default function TrainerClientsScreen() {
  const [query, setQuery] = useState('');
  const { theme } = useTheme();
  const debouncedQuery = useDebounce(query, 500);

  const { data: clients } = useTrainerGetClients({
    search: debouncedQuery ?? '',
  });

  const results: ClientItem[] = (clients?.content as ClientItem[]) ?? [];
  const styles = getStyles(theme);

  return (
    <PageContainer hasBackButton={false} style={{ padding: 16 }}>
      <View style={{ rowGap: 10, paddingVertical: 10 }}>
        <AppText style={styles.title}>{'Mis Clientes'}</AppText>
        <AppText style={styles.subtitle}>
          {'Gestiona tus clientes y el progreso de sus entrenamientos'}
        </AppText>
      </View>

      <View style={styles.searchRow}>
        <SearchBar
          placeholder="Buscar por nombre"
          value={query}
          onChangeText={setQuery}
          shouldHideEndIcon={true}
        />
        <TouchableOpacity style={styles.searchButton}>
          <Feather name="chevrons-right" size={22} color={theme.dark100} />
        </TouchableOpacity>
      </View>

      <AppText style={styles.resultCount}>
        {results.length} clientes encontrados
      </AppText>

      {results.map((client) => (
        <View key={client.clientId} style={styles.clientCard}>
          {/* Header: Avatar + Name + Goals */}
          {!!client.profilePhotoId && (
            <Image
              source={{
                uri: `https://appfitech.com/v1/app/file-upload/view/${client.profilePhotoId}`,
              }}
              style={styles.avatar}
            />
          )}
          <AppText style={styles.clientName}>{client.clientName}</AppText>
          {!!client.fitnessGoals?.length && (
            <AppText style={styles.bio} numberOfLines={2}>
              {client.fitnessGoals.join(', ')}
            </AppText>
          )}

          {/* Client summary chips */}
          <View style={styles.rowChips}>
            <Chip
              text={`${client.activeServicesCount} activos`}
              tone="success"
            />
            <Chip text={`Total: ${formatPEN(client.totalAmountPaid)}`} />
          </View>

          {/* Services section header */}
          <View style={styles.servicesHeaderRow}>
            <AppText style={styles.servicesHeaderText}>
              {`Servicios Contratados (${client.totalServicesCount})`}
            </AppText>
          </View>

          {/* Service cards */}
          <View style={{ gap: 16 }}>
            {client.services.map((s) => (
              <ServiceCard key={s.contractId} s={s} />
            ))}
          </View>
        </View>
      ))}
    </PageContainer>
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    container: {
      padding: 16,
      backgroundColor: theme.background,
    },

    searchRow: {
      flexDirection: 'row',
      marginBottom: 20,
      columnGap: 4,
      alignItems: 'center',
    },
    searchButton: {
      backgroundColor: theme.primary,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 10,
      height: 43,
      width: 43,
    },
    resultCount: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.dark800,
      marginBottom: 12,
      alignSelf: 'flex-end',
    },

    // Client card wrapper
    clientCard: {
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: 14,
      marginBottom: 20,
      shadowColor: '#000',
      shadowOpacity: 0.05,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
      elevation: 2,
    },
    avatar: {
      width: '100%',
      height: 160,
      borderRadius: 8,
      marginBottom: 8,
    },
    clientName: {
      fontSize: 16,
      fontWeight: '700',
      color: '#111',
    },
    bio: {
      fontSize: 13,
      color: '#444',
      marginTop: 4,
      marginBottom: 10,
    },

    // Service section header inside client card
    servicesHeaderRow: {
      marginTop: 4,
      marginBottom: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    servicesHeaderText: {
      fontSize: 14,
      fontWeight: '700',
      color: '#111',
    },

    // Shared chips
    rowChips: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 6,
      flexWrap: 'wrap',
    },
    chip: {
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 999,
    },
    chipNeutral: { backgroundColor: '#E6F0FA' },
    chipSuccess: { backgroundColor: '#E6F4EA' },
    chipText: { fontSize: 12, fontWeight: '600' },
    chipTextNeutral: { color: '#1A73E8' },
    chipTextSuccess: { color: '#1E7B4D' },

    // Service card styles
    serviceCardWrap: {
      position: 'relative',
    },
    cardAccent: {
      position: 'absolute',
      left: 0,
      top: 8,
      bottom: 8,
      width: 4,
      borderTopLeftRadius: 10,
      borderBottomLeftRadius: 10,
      backgroundColor: '#20C27A',
    },
    card: {
      backgroundColor: '#FFF',
      borderRadius: 12,
      padding: 14,
      paddingLeft: 18,
      shadowColor: '#000',
      shadowOpacity: 0.05,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
      elevation: 1,
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 6,
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: '#111',
      flex: 1,
      marginRight: 8,
    },
    cardDesc: {
      fontSize: 13,
      lineHeight: 18,
      color: '#444',
      marginBottom: 12,
    },
    priceBox: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#E6F4EA',
      borderRadius: 8,
      paddingVertical: 10,
      paddingHorizontal: 12,
      marginBottom: 10,
    },
    priceIcon: {
      width: 24,
      height: 24,
      borderRadius: 6,
      backgroundColor: '#D7F1E1',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 8,
    },
    priceText: {
      fontSize: 15,
      fontWeight: '700',
      color: '#1E7B4D',
    },
    priceSuffix: { fontWeight: '500', color: '#2E7D32' },

    modalityPill: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FFEBD6',
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 999,
    },
    modalityText: { fontSize: 12, fontWeight: '600', color: '#4E342E' },
    statusPill: {
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 999,
    },
    statusPillText: { fontSize: 12, fontWeight: '700' },

    metaRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: 8,
    },
    metaLeft: { flexDirection: 'row', alignItems: 'center' },
    metaLabel: { fontSize: 12, color: '#444' },
    metaValue: { fontSize: 13, fontWeight: '700', color: '#1E7B4D' },

    ...HEADING_STYLES(theme),
    title: {
      ...HEADING_STYLES(theme).title,
    },
    subtitle: {
      ...HEADING_STYLES(theme).subtitle,
    },
  });
