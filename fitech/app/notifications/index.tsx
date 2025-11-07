import { useRouter } from 'expo-router';
import React, { useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { FadeInUp } from 'react-native-reanimated';

import { HEADING_STYLES } from '@/constants/shared_styles';
import { useTheme } from '@/contexts/ThemeContext';
import { NotificationDto } from '@/types/api/types.gen';
import { FullTheme } from '@/types/theme';

import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
} from '../api/mutations/use-actions-notifications';
import { useGetUserNotifications } from '../api/queries/use-get-notifications';
import { AnimatedAppText } from '../components/AnimatedAppText';
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
    <PageContainer style={{ padding: 16, paddingBottom: 150 }}>
      <View style={{ rowGap: 8, paddingVertical: 10, marginBottom: 30 }}>
        <AnimatedAppText entering={FadeInUp.duration(400)} style={styles.title}>
          {'Notificaciones'}
        </AnimatedAppText>
        {!!notifications?.length && (
          <View style={{ alignItems: 'flex-end' }}>
            <Button
              onPress={handleMarkAllRead}
              type={'link'}
              label={'Marcar todo como leído'}
            />
          </View>
        )}
        <View>
          {!notifications?.length && (
            <AppText
              style={{ color: theme.secondary, fontSize: 16, marginTop: 34 }}
            >
              {'Estás al día, no hay más notificaciones 🎉'}
            </AppText>
          )}
          {notifications?.map((item, index) => (
            <ListItem
              key={`notification-${item.id}-${index}`}
              label={`${item.icon} ${item.title}`}
              description={`${item.message}${item.timeAgo ? `\n${item.timeAgo}` : ''}`}
              hasChevron={false}
              style={item.isRead ? {} : { backgroundColor: theme.green100 }}
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
    card: {
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
      display: 'flex',
      flexDirection: 'row',
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: '800',
      color: theme.dark900,
      marginBottom: 8,
    },
    cardDescription: {
      fontSize: 14,
      color: theme.dark700,
      lineHeight: 20,
    },
    image: {
      width: 120,
      height: '100%',
    },
    ...HEADING_STYLES(theme),
    title: {
      ...HEADING_STYLES(theme).title,
      textAlign: 'left',
    },
  });
