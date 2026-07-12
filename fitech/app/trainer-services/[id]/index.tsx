import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import PageContainer from '@/components/PageContainer';
import { ServiceActionBar } from '@/components/trainer-services/ServiceActionBar';
import { textStyles } from '@/constants/styles';
import { useTheme } from '@/contexts/ThemeContext';
import { useTrainerServiceActions } from '@/hooks/use-trainer-service-actions';
import { useTrainerGetServices } from '@/lib/api/queries/use-trainer-get-services';
import { TrainerService } from '@/types/trainer';
import { AppTheme } from '@/types/theme';
import { formatPEN } from '@/utils/currency';

function StatusPill({ active }: { active: boolean }) {
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

export default function TrainerServiceDetailScreen() {
  const { id, service: serviceParam } = useLocalSearchParams<{
    id: string;
    service?: string;
  }>();
  const router = useRouter();
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const { data: services } = useTrainerGetServices();

  const service = useMemo<TrainerService | null>(() => {
    const list = (services as TrainerService[]) ?? [];
    const fromList = list.find((item) => String(item.id) === id);
    if (fromList) return fromList;

    if (!serviceParam) return null;
    try {
      return JSON.parse(serviceParam) as TrainerService;
    } catch {
      return null;
    }
  }, [id, serviceParam, services]);

  const handleDeleted = useCallback(() => {
    router.back();
  }, [router]);

  const {
    handleEditService,
    handleDeleteService,
    handleToggleStatus,
    isServicePending,
  } = useTrainerServiceActions({ onDeleted: handleDeleted });

  const handleEditPress = useCallback(() => {
    if (!service) return;
    handleEditService(service);
  }, [handleEditService, service]);

  const handleTogglePress = useCallback(() => {
    if (!service) return;
    handleToggleStatus(service);
  }, [handleToggleStatus, service]);

  const handleDeletePress = useCallback(() => {
    if (!service) return;
    handleDeleteService(service);
  }, [handleDeleteService, service]);

  if (!service) {
    return (
      <PageContainer title="Servicio" hasBackButton>
        <AppText style={styles.errorText}>
          No se pudo cargar el servicio.
        </AppText>
      </PageContainer>
    );
  }

  const isPending = isServicePending(service.id);

  return (
    <PageContainer title={service.name} hasBackButton>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <View style={styles.topRow}>
            <StatusPill active={service.isActive} />
          </View>

          <View style={styles.titleRow}>
            <View style={styles.iconBadge}>
              <Ionicons
                name={service.isInPerson ? 'walk' : 'videocam'}
                size={18}
                color={theme.background.app}
              />
            </View>
            <AppText style={styles.title}>{service.name}</AppText>
          </View>

          {!!service.description && (
            <AppText style={styles.description}>{service.description.trim()}</AppText>
          )}

          <View style={styles.metaRow}>
            <View style={styles.metaCell}>
              <Ionicons
                name={service.isInPerson ? 'location' : 'laptop-outline'}
                size={14}
                color={theme.text.secondary}
              />
              <AppText style={styles.metaText}>
                {service.isInPerson ? 'Presencial' : 'Virtual'}
              </AppText>
            </View>
            <View style={styles.metaCell}>
              <Ionicons
                name="people-outline"
                size={14}
                color={theme.text.secondary}
              />
              <AppText style={styles.metaText}>
                {service.enrolledUsersCount}{' '}
                {service.enrolledUsersCount === 1 ? 'cliente' : 'clientes'}
              </AppText>
            </View>
          </View>

          <View style={styles.priceBlock}>
            <View style={styles.priceMainRow}>
              <AppText style={styles.totalPrice}>
                {formatPEN(service.totalPrice)}
              </AppText>
              <AppText style={styles.earnings}>
                Ganas: {formatPEN(service.trainerEarnings)}
              </AppText>
            </View>
            <AppText style={styles.sessionPrice}>
              Por sesión: {formatPEN(service.pricePerSession)}
            </AppText>
          </View>

          <ServiceActionBar
            service={service}
            isPending={isPending}
            onEdit={handleEditPress}
            onToggleStatus={handleTogglePress}
            onDelete={handleDeletePress}
          />
        </View>
      </ScrollView>
    </PageContainer>
  );
}

const getStyles = (theme: AppTheme) => {
  const text = textStyles(theme);
  return StyleSheet.create({
    content: {
      paddingBottom: 32,
    },
    card: {
      backgroundColor: theme.background.card,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.border.default,
      padding: 16,
      gap: 12,
    },
    topRow: {
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
      width: 36,
      height: 36,
      borderRadius: 10,
      backgroundColor: theme.brand.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      ...text.leadSemibold,
      color: theme.text.primary,
      flex: 1,
    },
    description: {
      ...text.small,
      color: theme.text.secondary,
      lineHeight: 22,
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: 20,
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
    priceBlock: {
      borderTopWidth: 1,
      borderTopColor: theme.border.default,
      paddingTop: 12,
      gap: 4,
    },
    priceMainRow: {
      flexDirection: 'row',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      gap: 12,
    },
    totalPrice: {
      ...text.stat,
      color: theme.status.info.text,
    },
    earnings: {
      ...text.smallSemibold,
      color: theme.status.success.text,
    },
    sessionPrice: {
      ...text.caption,
      color: theme.text.secondary,
    },
    errorText: {
      ...text.body,
      color: theme.text.secondary,
    },
  });
};
