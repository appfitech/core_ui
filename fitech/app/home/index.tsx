import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TrainerHomeContent } from '@/components/home/TrainerHomeContent';
import { UserHomeContent } from '@/components/home/UserHomeContent';
import { GreetingHeader } from '@/components/modules/GreetingHeader';
import PageContainer from '@/components/PageContainer';
import { useTheme } from '@/contexts/ThemeContext';
import { useUserStore } from '@/stores/user';
import { AppTheme } from '@/types/theme';

export default function HomeScreen() {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const insets = useSafeAreaInsets();
  const isTrainer = useUserStore((s) => s.getIsTrainer());

  return (
    <View style={[styles.wrapper, { paddingTop: insets.top }]}>
      <GreetingHeader />

      <PageContainer
        hasBackButton={false}
        hasNoTopPadding
        style={styles.pageContainer}
      >
        <View style={styles.contentWrapper}>
          {isTrainer ? <TrainerHomeContent /> : <UserHomeContent />}
        </View>
      </PageContainer>
    </View>
  );
}

const getStyles = (theme: AppTheme) =>
  StyleSheet.create({
    wrapper: {
      flex: 1,
      position: 'relative',
      backgroundColor: theme.background.card,
    },
    pageContainer: {
      paddingTop: 12,
    },
    contentWrapper: {
      backgroundColor: theme.background.app,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      paddingTop: 12,
    },
  });
