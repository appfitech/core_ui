import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { useTheme } from '@/contexts/ThemeContext';
import { FullTheme } from '@/types/theme';

import { useGetUserPayments } from '@/lib/api/queries/use-get-user-payments';
import { useGetUserSubscription } from '@/lib/api/queries/use-get-user-subscription';
import { Accordion } from '@/components/Accordion';
import { AppText } from '@/components/AppText';
import PageContainer from '@/components/PageContainer';

const PAYMENT_METHODS_MAPPER: Record<string, string> = {
  CONTRACT_PAYMENT: 'Pago de Contrato',
  STRIPE: 'Stripe',
};

type SectionItemProps = {
  label: string;
  sublabel?: string;
  value?: string;
  icon?: keyof typeof Ionicons.glyphMap;
};

function SectionItem({ label, sublabel, value, icon }: SectionItemProps) {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={styles.item}>
      {icon && (
        <View style={styles.iconWrapper}>
          <Ionicons name={icon} size={18} color={theme.primary} />
        </View>
      )}
      <View style={styles.itemInner}>
        <View>
          <AppText style={styles.itemLabel}>{label}</AppText>
          {sublabel ? (
            <AppText style={styles.itemSubLabel}>{sublabel}</AppText>
          ) : null}
        </View>
        {value != null && value !== '' && (
          <AppText style={styles.itemValue}>{value}</AppText>
        )}
      </View>
    </View>
  );
}

export default function SubscriptionScreen() {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const { data: subscription } = useGetUserSubscription();
  const { data: payments } = useGetUserPayments();

  return (
    <PageContainer
      title="Mi Suscripción"
      subheader="Gestiona tu membresía premium"
      style={styles.pageStyle}
    >
      <View style={styles.content}>
        <Animated.View
          entering={FadeInUp.delay(100).duration(400)}
          style={[styles.card, styles.cardPrimary]}
        >
          <AppText style={styles.cardTitle}>Suscripción Activa</AppText>
          <AppText style={styles.cardSubtitle}>
            Tu membresía premium está activa y funcionando correctamente.
          </AppText>
        </Animated.View>

        <Animated.View
          entering={FadeInUp.delay(150).duration(400)}
          style={styles.card}
        >
          <AppText style={styles.cardTitle}>Información de Suscripción</AppText>
          <AppText style={styles.cardSubtitle}>
            Detalles de tu membresía actual
          </AppText>

          <SectionItem
            label="Fecha de inicio"
            value={subscription?.startDate}
            icon="calendar-outline"
          />
          <SectionItem
            label="Fecha de finalización"
            value={subscription?.endDate}
            icon="calendar-outline"
          />
          <SectionItem
            label="Tipo de Membresía"
            value={subscription?.membershipType}
            icon="book-outline"
          />
          {subscription?.trainerName && (
            <SectionItem
              label="Entrenador"
              value={subscription.trainerName}
              icon="person-outline"
            />
          )}
        </Animated.View>

        <Animated.View
          entering={FadeInUp.delay(200).duration(400)}
          style={styles.card}
        >
          <AppText style={styles.cardTitle}>Información del Contrato</AppText>
          <AppText style={styles.cardSubtitle}>
            Detalles de tu contrato con el entrenador
          </AppText>
          <AppText style={styles.contractDetails}>
            {subscription?.contractDetails ?? '—'}
          </AppText>
        </Animated.View>

        <Accordion
          title="Ver Historial de Pagos"
          themeColors={{
            background: theme.card,
            text: theme.textPrimary,
            border: theme.border,
            icon: theme.textPrimary,
          }}
        >
          <Animated.View
            entering={FadeInUp.delay(100).duration(400)}
            style={styles.card}
          >
            <AppText style={styles.cardTitle}>Historial de Pagos</AppText>
            <AppText style={styles.cardSubtitle}>
              Últimos pagos realizados
            </AppText>

            {payments?.length ? (
              payments.map((payment) => (
                <SectionItem
                  key={payment?.id}
                  label={`$${payment?.amount?.toFixed(2)}`}
                  sublabel={`${moment(payment?.createdAt).format('DD MMM YYYY')} - ${PAYMENT_METHODS_MAPPER[payment?.paymentMethod ?? ''] ?? ''}`}
                  value={payment?.status}
                />
              ))
            ) : (
              <AppText style={styles.emptyPayments}>
                Aún no hay pagos registrados.
              </AppText>
            )}
          </Animated.View>
        </Accordion>
      </View>
    </PageContainer>
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    pageStyle: {
      paddingHorizontal: 16,
    },
    content: {
      paddingTop: 8,
      rowGap: 16,
    },
    card: {
      backgroundColor: theme.card,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: theme.border,
      padding: 18,
      rowGap: 10,
    },
    cardPrimary: {
      backgroundColor: theme.primaryBg ?? theme.green100,
      borderColor: theme.successBorder ?? theme.border,
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.textPrimary,
    },
    cardSubtitle: {
      fontSize: 14,
      color: theme.textSecondary,
      marginBottom: 4,
    },
    item: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.border,
      columnGap: 12,
    },
    iconWrapper: {
      width: 28,
      alignItems: 'center',
    },
    itemInner: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    itemLabel: {
      fontSize: 15,
      fontWeight: '500',
      color: theme.textSecondary,
    },
    itemSubLabel: {
      fontSize: 12,
      color: theme.textSecondary,
      marginTop: 2,
    },
    itemValue: {
      fontSize: 15,
      fontWeight: '600',
      color: theme.textPrimary,
    },
    contractDetails: {
      fontSize: 15,
      color: theme.textPrimary,
      lineHeight: 22,
      marginTop: 4,
    },
    emptyPayments: {
      fontSize: 14,
      color: theme.textSecondary,
      fontStyle: 'italic',
      marginTop: 8,
    },
  });
