import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { type Href, useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useMemo, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { AppText } from '@/components/AppText';
import PageContainer from '@/components/PageContainer';
import { ROUTES } from '@/constants/routes';
import { textStyles } from '@/constants/styles';
import { useTheme } from '@/contexts/ThemeContext';
import { useClientResourcesGrouped } from '@/lib/api/queries/use-client-resources-grouped';
import type {
  ClientResourceGroupDtoReadable,
  ClientResourceResponseDtoReadable,
} from '@/types/api/types.gen';
import { AppTheme } from '@/types/theme';

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

  const groups = useMemo<ClientResourceGroupDtoReadable[]>(
    () => groupedData?.content ?? [],
    [groupedData?.content],
  );

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
    >
      <View style={styles.contentWrap}>
        <View style={styles.topRow}>
          <AppText style={styles.sectionTitle}>RESUMEN</AppText>
          <TouchableOpacity
            style={styles.createBtn}
            onPress={() => router.push(`${ROUTES.trainerDiets}/new` as Href)}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={18} color={theme.background.app} />
            <AppText style={styles.createBtnText}>Crear Dieta</AppText>
          </TouchableOpacity>
        </View>

        <View style={styles.summaryColumn}>
          <View style={[styles.summaryCard, styles.summaryCardSuccess]}>
            <View
              style={[
                styles.summaryIconWrap,
                { backgroundColor: theme.status.success.icon },
              ]}
            >
              <Ionicons
                name="checkmark-circle"
                size={20}
                color={theme.background.app}
              />
            </View>
            <View>
              <AppText style={styles.summaryValue}>
                {summary.activeDiets}
              </AppText>
              <AppText style={styles.summaryLabel}>Dietas Activas</AppText>
            </View>
          </View>
          <View style={[styles.summaryCard, styles.summaryCardOrange]}>
            <View
              style={[
                styles.summaryIconWrap,
                { backgroundColor: theme.status.warning.icon },
              ]}
            >
              <Ionicons
                name="pause-circle"
                size={20}
                color={theme.background.app}
              />
            </View>
            <View>
              <AppText style={styles.summaryValue}>
                {summary.inactiveDiets}
              </AppText>
              <AppText style={styles.summaryLabel}>Dietas Inactivas</AppText>
            </View>
          </View>
          <View style={[styles.summaryCard, styles.summaryCardInfo]}>
            <View
              style={[
                styles.summaryIconWrap,
                { backgroundColor: theme.status.info.icon },
              ]}
            >
              <MaterialCommunityIcons
                name="account-group"
                size={20}
                color={theme.background.app}
              />
            </View>
            <View>
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
          <View style={styles.groupsList}>
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
                          color={theme.brand.primary}
                        />
                      </View>
                      <View style={styles.clientHeaderText}>
                        <AppText style={styles.clientName}>
                          {group.clientName ?? 'Cliente'}
                        </AppText>
                        <View style={styles.clientChips}>
                          <View style={styles.chipActive}>
                            <AppText style={styles.chipActiveText}>
                              {
                                (group.resources ?? []).filter(
                                  (r) => r.isActive,
                                ).length
                              }{' '}
                              activas
                            </AppText>
                          </View>
                          <View style={styles.chipInactive}>
                            <AppText style={styles.chipInactiveText}>
                              {
                                (group.resources ?? []).filter(
                                  (r) => !r.isActive,
                                ).length
                              }{' '}
                              inactivas
                            </AppText>
                          </View>
                        </View>
                      </View>
                    </View>
                    <Ionicons
                      name={isCollapsed ? 'chevron-down' : 'chevron-up'}
                      size={24}
                      color={theme.text.secondary}
                    />
                  </TouchableOpacity>

                  {!isCollapsed && (
                    <View style={styles.clientBlockBody}>
                      <View style={styles.tabRow}>
                        {(['ACTIVE', 'INACTIVE'] as const).map((tab) => {
                          const clientId = group.clientId ?? 0;
                          const current =
                            activeTabByClient[clientId] ?? 'ACTIVE';
                          const isActive = current === tab;
                          const count =
                            tab === 'ACTIVE'
                              ? (group.resources ?? []).filter(
                                  (r) => r.isActive,
                                ).length
                              : (group.resources ?? []).filter(
                                  (r) => !r.isActive,
                                ).length;
                          return (
                            <TouchableOpacity
                              key={tab}
                              style={[
                                styles.tabButton,
                                isActive && styles.tabButtonActive,
                              ]}
                              onPress={() =>
                                setActiveTabByClient((prev) => ({
                                  ...prev,
                                  [clientId]: tab,
                                }))
                              }
                              activeOpacity={0.8}
                            >
                              <AppText
                                style={[
                                  styles.tabText,
                                  isActive && styles.tabTextActive,
                                ]}
                              >
                                {tab === 'ACTIVE' ? 'Activas' : 'Inactivas'} (
                                {count})
                              </AppText>
                            </TouchableOpacity>
                          );
                        })}
                      </View>

                      <View style={styles.dietCards}>
                        {(group.resources ?? [])
                          .filter((r) => {
                            const clientId = group.clientId ?? 0;
                            const current =
                              activeTabByClient[clientId] ?? 'ACTIVE';
                            return current === 'ACTIVE'
                              ? r.isActive
                              : !r.isActive;
                          })
                          .map(
                            (resource: ClientResourceResponseDtoReadable) => (
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
                                      name={
                                        resource.isActive
                                          ? 'checkmark-circle'
                                          : 'close-circle'
                                      }
                                      size={14}
                                      color={
                                        resource.isActive
                                          ? theme.status.success.icon
                                          : theme.text.secondary
                                      }
                                    />
                                    <AppText
                                      style={[
                                        styles.statusPillText,
                                        {
                                          color: resource.isActive
                                            ? theme.status.success.text
                                            : theme.text.secondary,
                                        },
                                      ]}
                                    >
                                      {resource.isActive
                                        ? 'Activa'
                                        : 'Inactiva'}
                                    </AppText>
                                  </View>
                                </View>
                                <View style={styles.dietCardTitleRow}>
                                  <View style={styles.dietIconWrap}>
                                    <Ionicons
                                      name="restaurant-outline"
                                      size={18}
                                      color={theme.brand.primary}
                                    />
                                  </View>
                                  <AppText
                                    style={styles.dietCardTitle}
                                    numberOfLines={1}
                                  >
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
                                          console.error(
                                            '[FITECH] error opening diet file',
                                            e,
                                          );
                                        }
                                      }}
                                      activeOpacity={0.8}
                                    >
                                      <Ionicons
                                        name="document-text-outline"
                                        size={22}
                                        color={theme.status.info.icon}
                                      />
                                    </TouchableOpacity>
                                  ) : (
                                    <View style={styles.docButtonPlaceholder}>
                                      <Ionicons
                                        name="document-text-outline"
                                        size={22}
                                        color={theme.text.secondary}
                                      />
                                    </View>
                                  )}
                                </View>
                                <View style={styles.dietCardMeta}>
                                  <Ionicons
                                    name="calendar-outline"
                                    size={14}
                                    color={theme.text.secondary}
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
                            ),
                          )}
                      </View>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        )}
      </View>
    </PageContainer>
  );
}

const getStyles = (theme: AppTheme) => {
  const text = textStyles(theme);
  return StyleSheet.create({
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
      borderColor: theme.border.default,
      backgroundColor: theme.background.card,
      gap: 12,
    },
    summaryCardSuccess: {
      borderLeftWidth: 4,
      borderLeftColor: theme.status.success.icon,
    },
    summaryCardOrange: {
      borderLeftWidth: 4,
      borderLeftColor: theme.status.warning.icon,
    },
    summaryCardInfo: {
      borderLeftWidth: 4,
      borderLeftColor: theme.status.info.icon,
    },
    summaryIconWrap: {
      width: 44,
      height: 44,
      borderRadius: 12,
      backgroundColor: theme.status.success.bg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    summaryValue: {
      ...text.stat,
    },
    summaryLabel: {
      ...text.captionSemibold,
      marginTop: 2,
    },
    emptyWrap: {
      paddingVertical: 32,
      alignItems: 'center',
    },
    emptyText: {
      ...text.bodySemibold,
      textAlign: 'center',
    },
    emptyHint: {
      ...text.small,
      color: theme.text.secondary,
      marginTop: 8,
      textAlign: 'center',
    },
    groupsList: { gap: 12, paddingBottom: 24 },
    clientGroupCard: {
      backgroundColor: theme.background.card,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.border.default,
      overflow: 'hidden',
    },
    clientHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
      backgroundColor: theme.background.input,
      borderBottomWidth: 1,
      borderBottomColor: theme.border.default,
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
      backgroundColor: theme.brand.primarySoft,
      alignItems: 'center',
      justifyContent: 'center',
    },
    clientHeaderText: { flex: 1, minWidth: 0 },
    clientName: {
      ...text.leadSemibold,
      marginBottom: 4,
    },
    clientBlockBody: {
      padding: 16,
      gap: 12,
    },
    clientChips: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
    chipActive: {
      backgroundColor: theme.status.success.bg,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 999,
    },
    chipActiveText: {
      ...text.captionSemibold,
      color: theme.status.success.text,
    },
    chipInactive: {
      backgroundColor: theme.status.warning.bgStrong,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 999,
    },
    chipInactiveText: {
      ...text.captionSemibold,
      color: theme.status.warning.text,
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
      backgroundColor: theme.background.card,
      borderWidth: 1,
      borderColor: theme.border.default,
    },
    tabButtonActive: {
      backgroundColor: theme.brand.primary,
      borderColor: theme.brand.primary,
    },
    tabText: {
      ...text.nav,
    },
    tabTextActive: {
      ...text.nav,
      color: theme.background.app,
    },
    dietCards: {
      flexDirection: 'column',
      gap: 12,
    },
    dietCard: {
      backgroundColor: theme.background.input,
      borderRadius: 14,
      padding: 14,
      borderWidth: 1,
      borderColor: theme.border.default,
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
    statusPillActive: { backgroundColor: theme.status.success.bg },
    statusPillInactive: { backgroundColor: theme.background.input },
    statusPillText: { ...text.captionSemibold },
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
      backgroundColor: theme.brand.primarySoft,
      alignItems: 'center',
      justifyContent: 'center',
    },
    dietCardTitle: {
      ...text.linkSemibold,
      flex: 1,
    },
    docButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.status.info.bg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    docButtonPlaceholder: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.background.input,
      alignItems: 'center',
      justifyContent: 'center',
    },
    dietCardMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      borderTopWidth: 1,
      borderTopColor: theme.border.default,
      paddingTop: 8,
    },
    metaIcon: { marginRight: 6 },
    dietCardMetaText: {
      ...text.caption,
      flex: 1,
    },
  });
};
