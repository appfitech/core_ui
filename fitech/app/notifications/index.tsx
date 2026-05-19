import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import PageContainer from '@/components/PageContainer';
import { useTheme } from '@/contexts/ThemeContext';
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
} from '@/lib/api/mutations/use-actions-notifications';
import { useGetUserNotifications } from '@/lib/api/queries/use-get-notifications';
import { NotificationDto } from '@/types/api/types.gen';
import { FullTheme } from '@/types/theme';

function getNotificationIcon(type?: string): keyof typeof Ionicons.glyphMap {
  const t = (type ?? '').toUpperCase();
  if (t.includes('DIET') || t.includes('DIETA')) return 'nutrition-outline';
  if (t.includes('ROUTINE') || t.includes('RUTINA')) return 'barbell-outline';
  if (t.includes('CONTRACT') || t.includes('CONTRATO'))
    return 'document-text-outline';
  if (t.includes('CHAT')) return 'chatbubble-outline';
  if (t.includes('TRAINER') || t.includes('ENTRENADOR'))
    return 'person-outline';
  return 'notifications-outline';
}

export default function NotificationsScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const { data, refetch } = useGetUserNotifications();
  const notifications: NotificationDto[] = useMemo(
    () => data?.recent || [],
    [data],
  );

  const { mutate: markAllRead } = useMarkAllNotificationsRead();
  const { mutate: markNotifRead } = useMarkNotificationRead();

  const handleMarkAllRead = useCallback(() => {
    markAllRead(undefined, {
      onSuccess: () => {
        refetch();
      },
    });
  }, [markAllRead, refetch]);

  const handleItemPress = useCallback(
    (item: NotificationDto) => {
      if (item.id) {
        markNotifRead(item.id, {
          onSuccess: () => {
            refetch();
          },
        });
      }
      if (item.redirectUrl) {
        router.push(item.redirectUrl as Parameters<typeof router.push>[0]);
      }
    },
    [markNotifRead, refetch, router],
  );

  return (
    <PageContainer title="Notificaciones" style={styles.pageStyle}>
      <View style={styles.listWrapper}>
        {!!notifications?.length && (
          <View style={styles.markAllWrapper}>
            <Button
              onPress={handleMarkAllRead}
              type="link"
              label="Marcar todo como leído"
            />
          </View>
        )}

        {!notifications?.length && (
          <View style={styles.emptyWrapper}>
            <Ionicons
              name="checkmark-circle-outline"
              size={56}
              color={theme.text.secondary}
            />
            <AppText style={styles.emptyMessage}>
              Estás al día, no hay más notificaciones 🎉
            </AppText>
          </View>
        )}

        {notifications?.map((item, index) => {
          const iconName = getNotificationIcon(item.type);
          return (
            <TouchableOpacity
              key={`notification-${item.id}-${index}`}
              style={[styles.card, !item.isRead && styles.cardUnread]}
              onPress={() => handleItemPress(item)}
              activeOpacity={0.7}
            >
              <View style={styles.iconBox}>
                <Ionicons name={iconName} size={24} color={theme.brand.primary} />
              </View>
              <View style={styles.cardContent}>
                <AppText style={styles.cardTitle} numberOfLines={1}>
                  {item.title}
                </AppText>
                <AppText style={styles.cardMessage} numberOfLines={2}>
                  {item.message}
                </AppText>
                {item.timeAgo ? (
                  <AppText style={styles.cardTime}>{item.timeAgo}</AppText>
                ) : null}
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={theme.text.secondary}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </PageContainer>
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    pageStyle: {
      paddingHorizontal: 16,
      paddingBottom: 160,
    },
    listWrapper: {
      paddingTop: 8,
      rowGap: 10,
    },
    markAllWrapper: {
      alignItems: 'flex-end',
      marginBottom: 4,
    },
    emptyWrapper: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 48,
      gap: 16,
    },
    emptyMessage: {
      color: theme.text.secondary,
      fontSize: 16,
      textAlign: 'center',
    },
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.background.card,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: theme.border.default,
      paddingVertical: 14,
      paddingHorizontal: 14,
      columnGap: 12,
    },
    cardUnread: {
      backgroundColor: theme.brand.primarySoft ?? theme.status.success.bgStrong,
      borderColor: theme.status.success.border ?? theme.border.default,
    },
    iconBox: {
      width: 44,
      height: 44,
      borderRadius: 12,
      backgroundColor: theme.background.input,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cardContent: {
      flex: 1,
      minWidth: 0,
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.text.primary,
      marginBottom: 2,
    },
    cardMessage: {
      fontSize: 14,
      color: theme.text.secondary,
      lineHeight: 20,
    },
    cardTime: {
      fontSize: 12,
      color: theme.text.secondary,
      marginTop: 4,
    },
  });
