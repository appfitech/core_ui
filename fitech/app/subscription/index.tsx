import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { Accordion } from '@/components/Accordion';
import { AppText } from '@/components/AppText';
import PageContainer from '@/components/PageContainer';
import { TRANSLATIONS } from '@/constants/strings';
import { useTheme } from '@/contexts/ThemeContext';
import { useGetUserPayments } from '@/lib/api/queries/use-get-user-payments';
import { useGetUserSubscription } from '@/lib/api/queries/use-get-user-subscription';
import { usePullToRefreshMany } from '@/hooks/use-pull-to-refresh';
import { AppTheme } from '@/types/theme';

const { subscriptionScreen: copy } = TRANSLATIONS;

const PAYMENT_METHODS_MAPPER: Record<string, string> =
  copy.paymentMethods as Record<string, string>;

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
          <Ionicons name={icon} size={18} color={theme.icon.muted} />
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

  const { data: subscription, refetch: refetchSubscription } =
    useGetUserSubscription();
  const { data: payments, refetch: refetchPayments } = useGetUserPayments();
  const { refreshing, onRefresh } = usePullToRefreshMany(
    refetchSubscription,
    refetchPayments,
  );

  return (
    <PageContainer
      title={copy.title}
      subheader={copy.subheader}
      style={styles.pageStyle}
      includeTabBarPadding={false}
      onRefresh={onRefresh}
      refreshing={refreshing}
    >
      <View style={styles.content}>
        <Animated.View
          entering={FadeInUp.delay(100).duration(400)}
          style={styles.activeCard}
        >
          <AppText style={styles.activeCardTitle}>{copy.activeTitle}</AppText>
          <AppText style={styles.activeCardSubtitle}>
            {copy.activeSubtitle}
          </AppText>
        </Animated.View>

        <Animated.View
          entering={FadeInUp.delay(150).duration(400)}
          style={styles.card}
        >
          <AppText style={styles.cardTitle}>{copy.infoTitle}</AppText>
          <AppText style={styles.cardSubtitle}>{copy.infoSubtitle}</AppText>

          <SectionItem
            label={copy.startDateLabel}
            value={subscription?.startDate}
            icon="calendar-outline"
          />
          <SectionItem
            label={copy.endDateLabel}
            value={subscription?.endDate}
            icon="calendar-outline"
          />
          <SectionItem
            label={copy.membershipTypeLabel}
            value={subscription?.membershipType}
            icon="book-outline"
          />
          {subscription?.trainerName && (
            <SectionItem
              label={copy.trainerLabel}
              value={subscription.trainerName}
              icon="person-outline"
            />
          )}
        </Animated.View>

        <Animated.View
          entering={FadeInUp.delay(200).duration(400)}
          style={styles.card}
        >
          <AppText style={styles.cardTitle}>{copy.contractInfoTitle}</AppText>
          <AppText style={styles.cardSubtitle}>
            {copy.contractInfoSubtitle}
          </AppText>
          <AppText style={styles.contractDetails}>
            {subscription?.contractDetails ?? TRANSLATIONS.common.dash}
          </AppText>
        </Animated.View>

        <Accordion
          title={copy.paymentHistoryTitle}
          themeColors={{
            background: theme.background.card,
            text: theme.text.primary,
            border: theme.border.default,
            icon: theme.text.primary,
          }}
        >
          <Animated.View
            entering={FadeInUp.delay(100).duration(400)}
            style={styles.card}
          >
            <AppText style={styles.cardTitle}>
              {copy.paymentHistoryCardTitle}
            </AppText>
            <AppText style={styles.cardSubtitle}>
              {copy.paymentHistoryCardSubtitle}
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
                {copy.emptyPayments}
              </AppText>
            )}
          </Animated.View>
        </Accordion>
      </View>
    </PageContainer>
  );
}

const getStyles = (theme: AppTheme) =>
  StyleSheet.create({
    pageStyle: {
      paddingHorizontal: 16,
    },
    content: {
      paddingTop: 8,
      rowGap: 16,
    },
    activeCard: {
      backgroundColor: theme.status.success.bg,
      borderColor: theme.status.success.border,
      padding: 12,
      borderRadius: 14,
      borderWidth: 1,
    },
    activeCardTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.status.success.icon,
    },
    activeCardSubtitle: {
      fontSize: 14,
      color: theme.status.success.text,
      marginBottom: 4,
    },
    card: {
      backgroundColor: theme.background.card,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: theme.border.default,
      padding: 18,
      rowGap: 10,
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.text.primary,
    },
    cardSubtitle: {
      fontSize: 14,
      color: theme.text.secondary,
      marginBottom: 4,
    },
    item: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.border.default,
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
      color: theme.text.secondary,
    },
    itemSubLabel: {
      fontSize: 12,
      color: theme.text.secondary,
      marginTop: 2,
    },
    itemValue: {
      fontSize: 15,
      fontWeight: '600',
      color: theme.text.primary,
    },
    contractDetails: {
      fontSize: 15,
      color: theme.text.primary,
      lineHeight: 22,
      marginTop: 4,
    },
    emptyPayments: {
      fontSize: 14,
      color: theme.text.secondary,
      fontStyle: 'italic',
      marginTop: 8,
    },
  });
