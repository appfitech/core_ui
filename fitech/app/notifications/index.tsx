import { useRouter } from 'expo-router';
import React, { useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/contexts/ThemeContext';
import { NotificationDto } from '@/types/api/types.gen';
import { FullTheme } from '@/types/theme';

import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
} from '../api/mutations/use-actions-notifications';
import { useGetUserNotifications } from '../api/queries/use-get-notifications';
import { AppText } from '../components/AppText';
import { Button } from '../components/Button';
import { ListItem } from '../components/ListItem';
import PageContainer from '../components/PageContainer';

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
  }, []);

  return (
    <PageContainer style={styles.pageStyle} header="Notificaciones">
      <View style={styles.listWrapper}>
        {!!notifications?.length && (
          <View style={styles.markAllWrapper}>
            <Button
              onPress={handleMarkAllRead}
              type={'link'}
              label={'Marcar todo como leído'}
            />
          </View>
        )}
        <View>
          {!notifications?.length && (
            <AppText style={styles.emptyMessage}>
              {'Estás al día, no hay más notificaciones 🎉'}
            </AppText>
          )}
          {notifications?.map((item, index) => (
            <ListItem
              key={`notification-${item.id}-${index}`}
              label={`${item.icon} ${item.title}`}
              description={`${item.message}${item.timeAgo ? `\n${item.timeAgo}` : ''}`}
              hasChevron={false}
              style={item.isRead ? undefined : styles.itemUnread}
              onClick={() => {
                if (item.id) {
                  markNotifRead(item.id, {
                    onSuccess: () => {
                      refetch();
                    },
                  });
                }

                router.push(item.redirectUrl);
              }}
            />
          ))}
        </View>
      </View>
    </PageContainer>
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    pageStyle: {
      padding: 16,
      paddingBottom: 150,
    },
    listWrapper: {
      rowGap: 8,
      paddingVertical: 10,
      marginBottom: 30,
    },
    markAllWrapper: {
      alignItems: 'flex-end',
    },
    emptyMessage: {
      color: theme.secondary,
      fontSize: 16,
      marginTop: 34,
    },
    itemUnread: {
      backgroundColor: theme.green100,
    },
  });
