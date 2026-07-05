import React from 'react';
import { Platform, RefreshControl, RefreshControlProps } from 'react-native';

import { TRANSLATIONS } from '@/constants/strings';
import { useTheme } from '@/contexts/ThemeContext';

type Props = Pick<RefreshControlProps, 'refreshing' | 'onRefresh' | 'progressViewOffset'>;

export function PullToRefreshControl({
  refreshing,
  onRefresh,
  progressViewOffset,
}: Props) {
  const { theme } = useTheme();
  const updatingLabel = TRANSLATIONS.common.updating;

  return (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      tintColor={theme.brand.primary}
      colors={[theme.brand.primary]}
      progressBackgroundColor={theme.background.card}
      progressViewOffset={progressViewOffset}
      {...(Platform.OS === 'ios' ? { title: updatingLabel } : {})}
    />
  );
}
