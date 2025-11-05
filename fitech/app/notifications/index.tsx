import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { FadeInUp } from 'react-native-reanimated';

import { HEADING_STYLES } from '@/constants/shared_styles';
import { useTheme } from '@/contexts/ThemeContext';
import { FullTheme } from '@/types/theme';

import { useGetUserNotifications } from '../api/queries/use-get-notifications';
import { AnimatedAppText } from '../components/AnimatedAppText';
import { ListItem } from '../components/ListItem';
import PageContainer from '../components/PageContainer';

export default function NotificationsScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const { data } = useGetUserNotifications();
  const notifications = useMemo(() => data?.recent, [data]);

  return (
    <PageContainer style={{ padding: 16, paddingBottom: 150 }}>
      <View style={{ rowGap: 10, paddingVertical: 10, marginBottom: 30 }}>
        <AnimatedAppText entering={FadeInUp.duration(400)} style={styles.title}>
          {'Notificaciones'}
        </AnimatedAppText>
        {notifications?.map((item, index) => (
          <ListItem
            key={`notification-${item.id}-${index}`}
            label={`${item.icon} ${item.title}`}
            description={item.message}
            hasChevron={false}
          />
        ))}
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
