import { useRouter } from 'expo-router';
import React, { useCallback, useMemo } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { ListEmptyState } from '@/components/list/ListEmptyState';
import { NotificationListRow } from '@/components/list/NotificationListRow';
import PageContainer from '@/components/PageContainer';
import { LIST_SCREEN_FLATLIST } from '@/constants/list-screens';
import { TRANSLATIONS } from '@/constants/strings';
import { textStyles } from '@/constants/styles';
import { useTheme } from '@/contexts/ThemeContext';
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
} from '@/lib/api/mutations/use-actions-notifications';
import { useGetUserNotifications } from '@/lib/api/queries/use-get-notifications';
import { NotificationDto } from '@/types/api/types.gen';
import { AppTheme } from '@/types/theme';
import { parseAppRedirectUrl } from '@/utils/navigate-from-push-notification';

export default function NotificationsScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const { notificationsScreen: copy } = TRANSLATIONS;

  const { data, refetch, isLoading } = useGetUserNotifications();
  const notifications: NotificationDto[] = useMemo(
    () => data?.recent ?? [],
    [data],
  );

  const hasUnread = useMemo(
    () =>
      (data?.unreadCount ?? 0) > 0 ||
      notifications.some((item) => !item.isRead),
    [data?.unreadCount, notifications],
  );

  const { mutate: markAllRead, isPending: isMarkingAll } =
    useMarkAllNotificationsRead();
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
        router.push(parseAppRedirectUrl(item.redirectUrl));
      }
    },
    [markNotifRead, refetch, router],
  );

  const renderItem = useCallback(
    ({ item }: { item: NotificationDto }) => (
      <NotificationListRow item={item} onPress={() => handleItemPress(item)} />
    ),
    [handleItemPress],
  );

  const keyExtractor = useCallback(
    (item: NotificationDto, index: number) =>
      item.id != null ? String(item.id) : `notification-${index}`,
    [],
  );

  return (
    <PageContainer
      title={copy.title}
      subheader={copy.subheader}
      disableScroll
      style={styles.pageStyle}
      includeTabBarPadding={false}
      hasBottomPadding={false}
      footer={
        hasUnread ? (
          <Button
            type="tertiary"
            onPress={handleMarkAllRead}
            label={copy.markAllRead}
            disabled={isMarkingAll}
            loading={isMarkingAll}
            animated={false}
            style={styles.footerButton}
          />
        ) : undefined
      }
    >
      <FlatList
        data={notifications}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListEmptyComponent={
          isLoading ? (
            <View style={styles.loadingWrap}>
              <ActivityIndicator color={theme.brand.primary} />
              <AppText style={styles.loadingText}>{copy.loading}</AppText>
            </View>
          ) : (
            <ListEmptyState title={copy.emptyTitle} hint={copy.emptyHint} />
          )
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        initialNumToRender={LIST_SCREEN_FLATLIST.initialNumToRender}
        maxToRenderPerBatch={LIST_SCREEN_FLATLIST.maxToRenderPerBatch}
        windowSize={LIST_SCREEN_FLATLIST.windowSize}
        removeClippedSubviews={LIST_SCREEN_FLATLIST.removeClippedSubviews}
      />
    </PageContainer>
  );
}

const getStyles = (theme: AppTheme) => {
  const text = textStyles(theme);
  return StyleSheet.create({
    pageStyle: {
      paddingBottom: 0,
    },
    listContent: {
      flexGrow: 1,
      paddingBottom: 24,
    },
    loadingWrap: {
      paddingVertical: 48,
      alignItems: 'center',
      rowGap: 8,
    },
    loadingText: {
      ...text.nav,
      color: theme.text.secondary,
    },
    footerButton: {
      width: '100%',
    },
  });
};
