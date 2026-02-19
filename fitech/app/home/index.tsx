import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/contexts/ThemeContext';
import { useUserStore } from '@/stores/user';
import { FullTheme } from '@/types/theme';

import { GreetingHeader } from '../components/modules/GreetingHeader';
import PageContainer from '../components/PageContainer';
import { TrainerHomeContent } from './TrainerHomeContent';
import { UserHomeContent } from './UserHomeContent';

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

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    wrapper: {
      flex: 1,
      position: 'relative',
      backgroundColor: theme.backgroundHeader,
    },
    pageContainer: {
      padding: 0,
      paddingBottom: 0,
    },
    contentWrapper: {
      backgroundColor: theme.background,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      paddingTop: 12,

      paddingBottom: 180,
    },
  });
