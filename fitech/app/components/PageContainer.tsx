import React from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/contexts/ThemeContext';
import { FullTheme } from '@/types/theme';

import { BackButton } from './BackButton';

type Props = {
  children: React.ReactNode;
  hasBackButton?: boolean;
  hasNoTopPadding?: boolean;
  style?: ViewStyle;
};

export default function PageContainer({
  children,
  hasBackButton = true,
  hasNoTopPadding = false,
  style = {},
}: Props) {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={styles.container}>
      {hasBackButton && (
        <View style={[styles.backButtonContainer, { paddingTop: insets.top }]}>
          <BackButton />
        </View>
      )}

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <ScrollView
            contentContainerStyle={[
              styles.scrollContent,
              {
                paddingTop: hasNoTopPadding
                  ? 0
                  : hasBackButton
                    ? 110
                    : insets.top,
                paddingBottom: 80,
                flexGrow: 1,
              },
              style,
            ]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    backButtonContainer: {
      position: 'absolute',
      top: 0,
      right: 0,
      left: 0,
      zIndex: 10,
      paddingHorizontal: 24,
      paddingVertical: 5,
      backgroundColor: theme.background,
    },
    scrollContent: {
      paddingTop: 110,
      paddingBottom: 80,
      flexGrow: 1,
    },
    flex: {
      flex: 1,
    },
  });
