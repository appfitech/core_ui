import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import { ROUTES } from '@/constants/routes';
import { useTheme } from '@/contexts/ThemeContext';
import type {
  ClientResourceGroupDtoReadable,
  ClientResourceResponseDtoReadable,
} from '@/types/api/types.gen';
import { FullTheme } from '@/types/theme';

import {
  useClientResourcesGrouped,
} from '@/lib/api/queries/use-client-resources-grouped';
import { AppText } from '@/components/AppText';
import PageContainer from '@/components/PageContainer';

const RESOURCE_TYPE = 'DIETA' as const;
const FILE_DOWNLOAD_BASE = 'https://appfitech.com/v1/app/file-upload/download';

function formatDate(iso: string | null | undefined) {
  if (!iso) return '—';
  return new Intl.DateTimeFormat('es-PE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
    .format(new Date(iso))
    .replace('.', '');
}

export default function TrainerDietsScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const styles = getStyles(theme);

  const { data: groupedData } = useClientResourcesGrouped({
    resourceType: RESOURCE_TYPE,
    page: 0,
    size: 50,
  });

  const groups: ClientResourceGroupDtoReadable[] =
    groupedData?.content ?? [];

  const summary = useMemo(() => {
    let active = 0;
    let inactive = 0;
    for (const g of groups) {
      for (const r of g.resources ?? []) {
        if (r.isActive) active++;
        else inactive++;
      }
    }
    return {
      activeDiets: active,
      inactiveDiets: inactive,
      clientsWithDiets: groups.length,
    };
  }, [groups]);

  const [activeTabByClient, setActiveTabByClient] = useState<
    Record<number, 'ACTIVE' | 'INACTIVE'>
  >({});
  const [collapsedByClient, setCollapsedByClient] = useState<
    Record<number, boolean>
  >({});

  return (
    <PageContainer
      title="Dietas de Clientes"
      subheader="Gestiona las dietas asignadas a tus clientes"
      style={styles.pageStyle}
      contentPaddingBottom={120}
    >
      <View style={styles.contentWrap}>
        <View style={styles.topRow}>
          <AppText style={styles.sectionTitle}>RESUMEN</AppText>
          <TouchableOpacity
            style={styles.createBtn}
            onPress={() => router.push(ROUTES.trainerDiets + '/new')}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={18} color={theme.background} />
            <AppText style={styles.createBtnText}>Crear Dieta</AppText>
          </TouchableOpacity>
        </View>

        <View style={styles.summaryColumn}>
          <View style={[styles.summaryCard, styles.summaryCardSuccess]}>
            <View style={[styles.summaryIconWrap, { backgroundColor: theme.success }]}>
              <Ionicons name="checkmark-circle" size={20} color={theme.background} />
            </View>
            <View style={styles.summaryContent}>
              <AppText style={styles.summaryValue}>
                {summary.activeDiets}
              </AppText>
              <AppText style={styles.summaryLabel}>Dietas Activas</AppText>
            </View>
          </View>
          <View style={[styles.summaryCard, styles.summaryCardOrange]}>
            <View style={[styles.summaryIconWrap, { backgroundColor: theme.orange }]}>
              <Ionicons name="pause-circle" size={20} color={theme.background} />
            </View>
            <View style={styles.summaryContent}>
              <AppText style={styles.summaryValue}>
                {summary.inactiveDiets}
              </AppText>
              <AppText style={styles.summaryLabel}>Dietas Inactivas</AppText>
            </View>
          </View>
          <View style={[styles.summaryCard, styles.summaryCardInfo]}>
            <View style={[styles.summaryIconWrap, { backgroundColor: theme.info }]}>
              <MaterialCommunityIcons
                name="account-group"
                size={20}
                color={theme.background}
              />
            </View>
            <View style={styles.summaryContent}>
              <AppText style={styles.summaryValue}>
                {summary.clientsWithDiets}
              </AppText>
              <AppText style={styles.summaryLabel}>Clientes con Dietas</AppText>
            </View>
          </View>
        </View>

        {groups.length === 0 ? (
          <View style={styles.emptyWrap}>
            <AppText style={styles.emptyText}>
              No hay dietas de clientes aún
            </AppText>
            <AppText style={styles.emptyHint}>
              Crea una dieta desde el botón «Crear Dieta»
            </AppText>
          </View>
        ) : (
          <ScrollView
            style={styles.listScroll}
            contentContainerStyle={styles.listScrollContent}
            showsVerticalScrollIndicator={false}
          >
          {groups.map((group) => {
            const cid = group.clientId ?? 0;
            const isCollapsed = collapsedByClient[cid] ?? false;
            return (
            <View
              key={cid || group.clientName || Math.random()}
              style={styles.clientGroupCard}
            >
              <TouchableOpacity
                style={styles.clientHeaderRow}
                onPress={() =>
                  setCollapsedByClient((prev) => ({
                    ...prev,
                    [cid]: !prev[cid],
                  }))
                }
                activeOpacity={0.8}
              >
                <View style={styles.clientHeaderLeft}>
                  <View style={styles.clientAvatarWrap}>
                    <Ionicons
                      name="person"
                      size={20}
                      color={theme.primary}
                    />
                  </View>
                  <View style={styles.clientHeaderText}>
                    <AppText style={styles.clientName}>
                      {group.clientName ?? 'Cliente'}
                    </AppText>
                    <View style={styles.clientChips}>
                      <View style={styles.chipActive}>
                        <AppText style={styles.chipActiveText}>
                          {(group.resources ?? []).filter((r) => r.isActive).length} activas
                        </AppText>
                      </View>
                      <View style={styles.chipInactive}>
                        <AppText style={styles.chipInactiveText}>
                          {(group.resources ?? []).filter((r) => !r.isActive).length} inactivas
                        </AppText>
                      </View>
                    </View>
                  </View>
                </View>
                <Ionicons
                  name={isCollapsed ? 'chevron-down' : 'chevron-up'}
                  size={24}
                  color={theme.textSecondary}
                />
              </TouchableOpacity>

              {!isCollapsed && (
              <View style={styles.clientBlockBody}>
              <View style={styles.tabRow}>
                {(['ACTIVE', 'INACTIVE'] as const).map((tab) => {
                  const clientId = group.clientId ?? 0;
                  const current = activeTabByClient[clientId] ?? 'ACTIVE';
                  const isActive = current === tab;
                  const count =
                    tab === 'ACTIVE'
                      ? (group.resources ?? []).filter((r) => r.isActive).length
                      : (group.resources ?? []).filter((r) => !r.isActive).length;
                  return (
                    <TouchableOpacity
                      key={tab}
                      style={[styles.tabButton, isActive && styles.tabButtonActive]}
                      onPress={() =>
                        setActiveTabByClient((prev) => ({
                          ...prev,
                          [clientId]: tab,
                        }))
                      }
                      activeOpacity={0.8}
                    >
                      <AppText
                        style={[styles.tabText, isActive && styles.tabTextActive]}
                      >
                        {tab === 'ACTIVE' ? 'Activas' : 'Inactivas'} ({count})
                      </AppText>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View style={styles.dietCards}>
                {(group.resources ?? [])
                  .filter((r) => {
                    const clientId = group.clientId ?? 0;
                    const current = activeTabByClient[clientId] ?? 'ACTIVE';
                    return current === 'ACTIVE' ? r.isActive : !r.isActive;
                  })
                  .map((resource: ClientResourceResponseDtoReadable) => (
                    <View key={resource.id} style={styles.dietCard}>
                      <View style={styles.dietCardTop}>
                        <View
                          style={[
                            styles.statusPill,
                            resource.isActive
                              ? styles.statusPillActive
                              : styles.statusPillInactive,
                          ]}
                        >
                          <Ionicons
                            name={resource.isActive ? 'checkmark-circle' : 'close-circle'}
                            size={14}
                            color={
                              resource.isActive ? theme.success : theme.textSecondary
                            }
                          />
                          <AppText
                            style={[
                              styles.statusPillText,
                              {
                                color: resource.isActive
                                  ? theme.successText
                                  : theme.textSecondary,
                              },
                            ]}
                          >
                            {resource.isActive ? 'Activa' : 'Inactiva'}
                          </AppText>
                        </View>
                      </View>
                      <View style={styles.dietCardTitleRow}>
                        <View style={styles.dietIconWrap}>
                          <Ionicons
                            name="restaurant-outline"
                            size={18}
                            color={theme.primary}
                          />
                        </View>
                        <AppText style={styles.dietCardTitle} numberOfLines={1}>
                          {resource.resourceName ?? 'Dieta'}
                        </AppText>
                        {resource.fileId != null ? (
                          <TouchableOpacity
                            style={styles.docButton}
                            onPress={async () => {
                              try {
                                await WebBrowser.openBrowserAsync(
                                  `${FILE_DOWNLOAD_BASE}/${resource.fileId}`,
                                );
                              } catch (e) {
                                console.error('[FITECH] error opening diet file', e);
                              }
                            }}
                            activeOpacity={0.8}
                          >
                            <Ionicons
                              name="document-text-outline"
                              size={22}
                              color={theme.info}
                            />
                          </TouchableOpacity>
                        ) : (
                          <View style={styles.docButtonPlaceholder}>
                            <Ionicons
                              name="document-text-outline"
                              size={22}
                              color={theme.textSecondary}
                            />
                          </View>
                        )}
                      </View>
                      <View style={styles.dietCardMeta}>
                        <Ionicons
                          name="calendar-outline"
                          size={14}
                          color={theme.textSecondary}
                          style={styles.metaIcon}
                        />
                        <AppText style={styles.dietCardMetaText}>
                          {resource.startDate && resource.endDate
                            ? `${formatDate(resource.startDate)} - ${formatDate(resource.endDate)}`
                            : resource.createdAt
                              ? `Creada el ${formatDate(resource.createdAt)}`
                              : '—'}
                        </AppText>
                      </View>
                    </View>
                  ))}
              </View>
              </View>
              )}
            </View>
          );
          })}
          </ScrollView>
        )}
      </View>
    </PageContainer>
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    pageStyle: {},
    contentWrap: {
      gap: 16,
      paddingVertical: 8,
    },
    topRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 12,
    },
    sectionTitle: {
      fontSize: 12,
      fontWeight: '700',
      color: theme.textSecondary,
      letterSpacing: 0.6,
      textTransform: 'uppercase',
    },
    createBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      backgroundColor: theme.primary,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 14,
    },
    createBtnText: {
      color: theme.background,
      fontWeight: '700',
      fontSize: 14,
    },
    summaryColumn: {
      flexDirection: 'column',
      gap: 10,
    },
    summaryCard: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 14,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.card,
      gap: 12,
    },
    summaryCardSuccess: {
      borderLeftWidth: 4,
      borderLeftColor: theme.success,
    },
    summaryCardOrange: {
      borderLeftWidth: 4,
      borderLeftColor: theme.orange,
    },
    summaryCardInfo: {
      borderLeftWidth: 4,
      borderLeftColor: theme.info,
    },
    summaryIconWrap: {
      width: 44,
      height: 44,
      borderRadius: 12,
      backgroundColor: theme.successBackground,
      alignItems: 'center',
      justifyContent: 'center',
    },
    summaryContent: {},
    summaryValue: {
      fontSize: 22,
      fontWeight: '900',
      color: theme.textPrimary,
    },
    summaryLabel: {
      fontSize: 12,
      color: theme.textSecondary,
      fontWeight: '600',
      marginTop: 2,
    },
    emptyWrap: {
      paddingVertical: 32,
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
    listScroll: { flex: 1 },
    listScrollContent: { paddingBottom: 24, gap: 12 },
    clientGroupCard: {
      backgroundColor: theme.card,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.border,
      overflow: 'hidden',
    },
    clientHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
      backgroundColor: theme.backgroundInput,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    clientHeaderLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      gap: 12,
    },
    clientAvatarWrap: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.primaryBg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    clientHeaderText: { flex: 1, minWidth: 0 },
    clientName: {
      fontSize: 17,
      fontWeight: '700',
      color: theme.textPrimary,
      marginBottom: 4,
    },
    clientBlockBody: {
      padding: 16,
      gap: 12,
    },
    clientChips: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
    chipActive: {
      backgroundColor: theme.successBackground,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 999,
    },
    chipActiveText: {
      fontSize: 12,
      fontWeight: '600',
      color: theme.successText,
    },
    chipInactive: {
      backgroundColor: theme.orangeBackground,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 999,
    },
    chipInactiveText: {
      fontSize: 12,
      fontWeight: '600',
      color: theme.orangeText,
    },
    tabRow: {
      flexDirection: 'row',
      gap: 8,
      flexWrap: 'wrap',
    },
    tabButton: {
      paddingVertical: 8,
      paddingHorizontal: 14,
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
      fontSize: 13,
      fontWeight: '600',
      color: theme.textSecondary,
    },
    tabTextActive: {
      color: theme.background,
    },
    dietCards: {
      flexDirection: 'column',
      gap: 12,
    },
    dietCard: {
      backgroundColor: theme.backgroundInput,
      borderRadius: 14,
      padding: 14,
      borderWidth: 1,
      borderColor: theme.border,
    },
    dietCardTop: { marginBottom: 8 },
    statusPill: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 999,
      gap: 6,
    },
    statusPillActive: { backgroundColor: theme.successBackground },
    statusPillInactive: { backgroundColor: theme.backgroundInput },
    statusPillText: { fontSize: 12, fontWeight: '700' },
    dietCardTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 8,
    },
    dietIconWrap: {
      width: 28,
      height: 28,
      borderRadius: 8,
      backgroundColor: theme.primaryBg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    dietCardTitle: {
      flex: 1,
      fontSize: 15,
      fontWeight: '700',
      color: theme.textPrimary,
    },
    docButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.infoBackground,
      alignItems: 'center',
      justifyContent: 'center',
    },
    docButtonPlaceholder: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.backgroundInput,
      alignItems: 'center',
      justifyContent: 'center',
    },
    dietCardMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      borderTopWidth: 1,
      borderTopColor: theme.border,
      paddingTop: 8,
    },
    metaIcon: { marginRight: 6 },
    dietCardMetaText: {
      fontSize: 12,
      color: theme.textSecondary,
      flex: 1,
    },
  });
