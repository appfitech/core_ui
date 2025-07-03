import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/contexts/ThemeContext';
import { FullTheme } from '@/types/theme';

import { BackButton } from './BackButton';

export default function PageContainer({ children, hasBackButton = true }) {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();

  const styles = getStyles(theme);

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        {
          paddingTop: insets.top + 20,
          paddingBottom: insets.bottom + 100,
        },
      ]}
    >
      {hasBackButton && (
        <View style={styles.backButtonContainer}>
          <BackButton />
        </View>
      )}
      {children}
    </ScrollView>
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    container: {
      padding: 16,
      flexGrow: 1,
      minHeight: '100%',
      backgroundColor: theme.background,
    },
    backButtonContainer: {
      marginTop: 0,
      marginBottom: 60,
    },
  });
