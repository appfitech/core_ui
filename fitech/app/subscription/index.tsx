import { Feather } from '@expo/vector-icons';
import moment from 'moment';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

import { HEADING_STYLES } from '@/constants/shared_styles';
import { useTheme } from '@/contexts/ThemeContext';
import { FullTheme } from '@/types/theme';

import { useGetUserPayments } from '../api/queries/use-get-user-payments';
import { useGetUserSubscription } from '../api/queries/use-get-user-subscription';
import { Accordion } from '../components/Accordion';
import { AnimatedAppText } from '../components/AnimatedAppText';
import { AppText } from '../components/AppText';
import PageContainer from '../components/PageContainer';

const PAYMENT_METHODS_MAPPER = {
  CONTRACT_PAYMENT: 'Pago de Contrato',
  STRIPE: 'Stripe',
};

export default function SubscriptionScreen() {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const { data: subscription } = useGetUserSubscription();
  const { data: payments } = useGetUserPayments();

  return (
    <PageContainer>
      <AnimatedAppText entering={FadeInDown.duration(500)} style={styles.title}>
        {'Mi Suscripción'}
      </AnimatedAppText>
      <AnimatedAppText
        entering={FadeInDown.duration(500)}
        style={styles.subtitle}
      >
        {'Gestiona tu membresía premium'}
      </AnimatedAppText>

      <View style={styles.content}>
        <Animated.View
          entering={FadeInUp.delay(100).duration(500)}
          style={styles.card}
        >
          <AppText
            style={{
              fontWeight: '600',
              fontSize: 18,
              color: theme.textPrimary,
            }}
          >
            {'Suscripción Activa'}
          </AppText>
          <AppText style={{ color: theme.textSecondary }}>
            {'Tu membresía premium está activa y funcionando correctamente.'}
          </AppText>
        </Animated.View>

        <Animated.View
          entering={FadeInUp.delay(100).duration(500)}
          style={[styles.card, { backgroundColor: theme.warningBackground }]}
        >
          <AppText
            style={{
              fontWeight: '600',
              fontSize: 18,
              color: theme.textPrimary,
            }}
          >
            {'Información de Suscripción'}
          </AppText>
          <AppText style={{ color: theme.textSecondary }}>
            {'Detalles de tu membresía actual'}
          </AppText>

          <SectionItem
            label={'Fecha de inicio'}
            value={subscription?.startDate}
            icon={'calendar'}
          />
          <SectionItem
            label={'Fecha de finalización'}
            value={subscription?.endDate}
            icon={'trending-down'}
          />
          <SectionItem
            label={'Tipo de Membresía'}
            value={subscription?.membershipType}
            icon={'book-open'}
          />

          {subscription?.trainerName && (
            <SectionItem
              label={'Entrenador'}
              value={subscription?.trainerName}
              icon={'user'}
            />
          )}
        </Animated.View>

        <Animated.View
          entering={FadeInUp.delay(100).duration(500)}
          style={[styles.card, { backgroundColor: theme.infoBackground }]}
        >
          <AppText
            style={{
              fontWeight: '600',
              fontSize: 18,
              color: theme.textPrimary,
            }}
          >
            {'Información del Contrato'}
          </AppText>
          <AppText style={{ color: theme.textSecondary }}>
            {'Detalles de tu contrato con el entrenador'}
          </AppText>

          <AppText style={{ color: theme.dark900 }}>
            {subscription?.contractDetails}
          </AppText>
        </Animated.View>

        <Accordion
          title={'Ver Historial de Pagos'}
          themeColors={{
            background: theme.background,
            text: theme.textPrimary,
            border: theme.border,
            icon: theme.textPrimary,
          }}
        >
          <Animated.View
            entering={FadeInUp.delay(100).duration(500)}
            style={[styles.card, { backgroundColor: theme.orangeBackground }]}
          >
            <AppText
              style={{
                fontWeight: '600',
                fontSize: 18,
                color: theme.textPrimary,
              }}
            >
              {'Historial de Pagos'}
            </AppText>
            <AppText style={{ color: theme.textSecondary }}>
              {'Últimos pagos realizados'}
            </AppText>

            {payments?.map((payment) => (
              <SectionItem
                key={payment?.id}
                label={`$${payment?.amount?.toFixed(2)}`}
                sublabel={`${moment(payment?.createdAt).format('DD MMM YYYY')} - ${PAYMENT_METHODS_MAPPER?.[payment?.paymentMethod] ?? ''}`}
                value={payment?.status}
              />
            ))}
          </Animated.View>
        </Accordion>
      </View>
    </PageContainer>
  );
}

const SectionItem = ({ label, sublabel, value, icon }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={styles.item}>
      {icon && (
        <View style={styles.iconWrapper}>
          <Feather name={icon} size={16} color={theme.dark400} />
        </View>
      )}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          flex: 1,
          justifyContent: 'space-between',
        }}
      >
        <View>
          <AppText style={styles.itemLabel}>{label}</AppText>
          {sublabel && (
            <AppText style={styles.itemSubLabel}>{sublabel}</AppText>
          )}
        </View>
        <AppText style={styles.itemValue}>{value}</AppText>
      </View>
    </View>
  );
};

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    title: {
      ...HEADING_STYLES(theme).title,
      textAlign: 'left',
    },
    subtitle: {
      ...HEADING_STYLES(theme).subtitle,
      textAlign: 'left',
    },
    card: {
      backgroundColor: theme.primaryBg,
      borderRadius: 16,
      padding: 20,
      shadowColor: theme.backgroundInverted,
      shadowOpacity: 0.05,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 8,
      elevation: 4,
      rowGap: 8,
    },
    content: {
      marginTop: 20,
      rowGap: 10,
    },
    item: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: theme.dark500,
      columnGap: 4,
    },
    iconWrapper: {
      width: 30,
      alignItems: 'center',
    },
    itemLabel: {
      fontSize: 15,
      fontWeight: '500',
      color: theme.dark400,
      paddingVertical: 4,
    },
    itemSubLabel: {
      fontSize: 12,
      fontWeight: '500',
      color: theme.textSecondary,
    },
    itemValue: {
      fontSize: 15,
      fontWeight: '500',
      color: theme.dark900,
      paddingVertical: 4,
    },
  });
