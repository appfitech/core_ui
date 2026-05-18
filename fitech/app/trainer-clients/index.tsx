import { Entypo, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

import { AppText } from '@/components/AppText';
import PageContainer from '@/components/PageContainer';
import { SearchBar } from '@/components/SearchBar';
import { ROUTES } from '@/constants/routes';
import { useTheme } from '@/contexts/ThemeContext';
import { useDebounce } from '@/hooks/use-debounce';
import { useTrainerGetClients } from '@/lib/api/queries/use-trainer-get-clients';
import { FullTheme } from '@/types/theme';

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
  chatId?: number | null;
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
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const map: Record<string, { bg: string; text: string; label: string }> = {
    active: {
      bg: theme.successBackground,
      text: theme.successText,
      label: 'Activo',
    },
    paused: {
      bg: theme.warningBackground,
      text: theme.warningText,
      label: 'Pausado',
    },
    finished: {
      bg: theme.backgroundInput,
      text: theme.textSecondary,
      label: 'Finalizado',
    },
  };
  const style = map[status] ?? map.active;

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
            <Entypo
              name="dots-three-vertical"
              size={16}
              color={theme.textSecondary}
            />
          </TouchableOpacity>
        </View>

        {!!s.serviceDescription && (
          <AppText style={styles.cardDesc} numberOfLines={6}>
            {s.serviceDescription.trim()}
          </AppText>
        )}

        <View style={styles.priceBox}>
          <Ionicons
            name="cash-outline"
            size={20}
            color={theme.success}
            style={styles.priceIconLeft}
          />
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
              color={theme.textPrimary}
              style={styles.modalityIcon}
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
              color={theme.textSecondary}
              style={styles.metaIcon}
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
              color={theme.textSecondary}
              style={styles.metaIcon}
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

  const results: ClientItem[] =
    (clients as { content?: ClientItem[] } | undefined)?.content ?? [];
  const styles = getStyles(theme);
  const router = useRouter();

  return (
    <PageContainer
      hasBackButton={false}
      title="Mis Clientes"
      subheader="Gestiona tus clientes y el progreso de sus entrenamientos"
      style={styles.pageStyle}
      contentPaddingBottom={120}
    >
      <View style={styles.contentWrap}>
        <View style={styles.searchRow}>
          <SearchBar
            placeholder="Buscar por nombre"
            value={query}
            onChangeText={setQuery}
            shouldHideEndIcon={true}
            containerStyle={styles.searchBarContainer}
          />
          <TouchableOpacity style={styles.searchButton} activeOpacity={0.8}>
            <Ionicons
              name="chevron-forward"
              size={22}
              color={theme.background}
            />
          </TouchableOpacity>
        </View>

        <AppText style={styles.resultCount}>
          {results.length} clientes encontrados
        </AppText>

        {results.map((client) => (
          <View key={client.clientId} style={styles.clientCard}>
            {/* Header: round avatar left, name + chips right */}
            <View style={styles.clientHeaderRow}>
              <View style={styles.avatarWrap}>
                {client.profilePhotoId ? (
                  <Image
                    source={{
                      uri: `https://appfitech.com/v1/app/file-upload/view/${client.profilePhotoId}`,
                    }}
                    style={styles.avatar}
                  />
                ) : (
                  <View style={styles.avatarPlaceholder} />
                )}
              </View>
              <View style={styles.clientInfo}>
                <AppText style={styles.clientName}>{client.clientName}</AppText>
                <View style={styles.rowChips}>
                  <Chip
                    text={`${client.activeServicesCount} activos`}
                    tone="success"
                  />
                  <Chip text={`Total: ${formatPEN(client.totalAmountPaid)}`} />
                </View>
              </View>
            </View>
            {!!client.fitnessGoals?.length && (
              <AppText style={styles.bio} numberOfLines={2}>
                {client.fitnessGoals.join(', ')}
              </AppText>
            )}

            <TouchableOpacity
              style={styles.contactarButton}
              onPress={() => {
                if (client.chatId != null) {
                  router.push({
                    pathname: '/chats/[id]',
                    params: {
                      id: String(client.chatId),
                      title: client.clientName,
                    },
                  });
                } else {
                  router.push(ROUTES.chats);
                }
              }}
              activeOpacity={0.8}
            >
              <Ionicons
                name="chatbubble-outline"
                size={18}
                color={theme.background}
              />
              <AppText style={styles.contactarButtonText}>Contactar</AppText>
            </TouchableOpacity>

            <View style={styles.servicesHeaderRow}>
              <AppText style={styles.sectionTitle}>
                {`SERVICIOS CONTRATADOS (${client.totalServicesCount})`}
              </AppText>
            </View>

            <View style={styles.servicesList}>
              {client.services.map((s) => (
                <ServiceCard key={s.contractId} s={s} />
              ))}
            </View>
          </View>
        ))}
      </View>
    </PageContainer>
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    pageStyle: {},
    contentWrap: {
      rowGap: 12,
      paddingVertical: 8,
    },
    searchRow: {
      flexDirection: 'row',
      columnGap: 10,
      alignItems: 'center',
    },
    searchBarContainer: { flex: 1 },
    searchButton: {
      backgroundColor: theme.primary,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 12,
      height: 48,
      width: 48,
    },
    resultCount: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.textSecondary,
      marginBottom: 4,
    },
    clientCard: {
      backgroundColor: theme.card,
      borderRadius: 16,
      padding: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: theme.border,
    },
    clientHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
      marginBottom: 10,
    },
    avatarWrap: {
      width: 56,
      height: 56,
      borderRadius: 28,
      overflow: 'hidden',
    },
    avatar: {
      width: 56,
      height: 56,
      backgroundColor: theme.backgroundInput,
    },
    avatarPlaceholder: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: theme.backgroundInput,
    },
    clientInfo: {
      flex: 1,
      gap: 6,
    },
    clientName: {
      fontSize: 17,
      fontWeight: '700',
      color: theme.textPrimary,
    },
    bio: {
      fontSize: 14,
      color: theme.textSecondary,
      marginTop: 0,
      marginBottom: 10,
      lineHeight: 20,
    },
    servicesHeaderRow: {
      marginTop: 8,
      marginBottom: 10,
    },
    sectionTitle: {
      fontSize: 12,
      fontWeight: '700',
      color: theme.textSecondary,
      letterSpacing: 0.6,
      textTransform: 'uppercase',
    },
    rowChips: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      flexWrap: 'wrap',
    },
    contactarButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.primary,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 12,
      marginTop: 4,
      marginBottom: 12,
      gap: 8,
    },
    contactarButtonText: {
      fontSize: 15,
      fontWeight: '600',
      color: theme.background,
    },
    chip: {
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 999,
    },
    chipNeutral: { backgroundColor: theme.backgroundInput },
    chipSuccess: { backgroundColor: theme.successBackground },
    chipText: { fontSize: 12, fontWeight: '600' },
    chipTextNeutral: { color: theme.textSecondary },
    chipTextSuccess: { color: theme.successText },
    servicesList: { gap: 12 },
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
      backgroundColor: theme.primary,
    },
    card: {
      backgroundColor: theme.card,
      borderRadius: 12,
      padding: 14,
      paddingLeft: 18,
      borderWidth: 1,
      borderColor: theme.border,
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
      color: theme.textPrimary,
      flex: 1,
      marginRight: 8,
    },
    cardDesc: {
      fontSize: 14,
      lineHeight: 20,
      color: theme.textSecondary,
      marginBottom: 12,
    },
    priceBox: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.successBackground,
      borderRadius: 10,
      paddingVertical: 10,
      paddingHorizontal: 12,
      marginBottom: 10,
      gap: 10,
    },
    priceIconLeft: {
      marginRight: 2,
    },
    priceText: {
      fontSize: 15,
      fontWeight: '700',
      color: theme.successText,
    },
    priceSuffix: {
      fontWeight: '500',
      color: theme.successText,
      opacity: 0.9,
    },
    modalityPill: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.backgroundInput,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 999,
      gap: 6,
    },
    modalityIcon: { marginRight: 0 },
    modalityText: {
      fontSize: 12,
      fontWeight: '600',
      color: theme.textPrimary,
    },
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
    metaIcon: { marginRight: 8 },
    metaLabel: { fontSize: 12, color: theme.textSecondary },
    metaValue: { fontSize: 13, fontWeight: '700', color: theme.primary },
  });
