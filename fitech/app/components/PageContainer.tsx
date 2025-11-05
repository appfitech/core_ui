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
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HEADING_STYLES } from '@/constants/shared_styles';
import { useTheme } from '@/contexts/ThemeContext';
import { FullTheme } from '@/types/theme';

import { AnimatedAppText } from './AnimatedAppText';
import { BackButton } from './BackButton';

type Props = {
  children: React.ReactNode;
  hasBackButton?: boolean;
  hasNoTopPadding?: boolean;
  style?: ViewStyle;
  header?: string;
  subheader?: string;
  includeLogo?: boolean;
  hasBottomPadding?: boolean;
};

export default function PageContainer({
  children,
  hasBackButton = true,
  hasNoTopPadding = false,
  style = {},
  header = '',
  subheader = '',
  includeLogo = false,
  hasBottomPadding = true,
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
                padding: 16,
                paddingTop: hasNoTopPadding
                  ? 0
                  : hasBackButton
                    ? 110
                    : insets.top,
                paddingBottom: hasBottomPadding ? 150 : 80,
                flexGrow: 1,
              },
              style,
            ]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {(header || subheader) && (
              <View style={styles.headerWrapper}>
                {includeLogo && (
                  <Animated.Image
                    entering={FadeInUp.duration(600)}
                    source={require('../../assets/images/logos/logo.webp')}
                    style={styles.logo}
                    resizeMode="contain"
                  />
                )}
                {header && (
                  <AnimatedAppText
                    entering={FadeInUp.delay(200)}
                    style={styles.headerTitle}
                  >
                    {header}
                  </AnimatedAppText>
                )}
                {subheader && (
                  <AnimatedAppText
                    entering={FadeInUp.delay(300)}
                    style={styles.headerSubtitle}
                  >
                    {subheader}
                  </AnimatedAppText>
                )}
              </View>
            )}
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
    headerTitle: {
      ...HEADING_STYLES(theme).title,
      fontWeight: '700',
    },
    headerSubtitle: {
      ...HEADING_STYLES(theme).subtitle,
      marginTop: 8,
    },
    headerWrapper: {
      width: '100%',
      alignItems: 'center',
      marginBottom: 12,
    },
    logo: {
      width: 80,
      height: 80,
      marginBottom: 10,
    },
  });
