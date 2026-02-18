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
import { AppText } from './AppText';
import { BackButton } from './BackButton';

type Props = {
  children: React.ReactNode;
  hasBackButton?: boolean;
  hasNoTopPadding?: boolean;
  style?: ViewStyle;
  /** Shown in the fixed top bar (with back button); stays visible when scrolling */
  title?: string;
  header?: string;
  subheader?: string;
  includeLogo?: boolean;
  hasBottomPadding?: boolean;
  styleContainer?: ViewStyle;
};

export default function PageContainer({
  children,
  hasBackButton = true,
  hasNoTopPadding = false,
  style = {},
  title = '',
  header = '',
  subheader = '',
  includeLogo = false,
  hasBottomPadding = true,
  styleContainer = {},
}: Props) {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const hasFixedHeader = hasBackButton || title;
  const hasFixedSubheader = !!(title && subheader);
  const fixedHeaderHeight = hasFixedHeader
    ? hasFixedSubheader
      ? 80
      : title && !hasBackButton
        ? 64
        : 56
    : 0;

  return (
    <View style={[styles.container, styleContainer]}>
      {hasFixedHeader && (
        <View
          style={[
            styles.fixedHeader,
            {
              paddingTop: insets.top,
              minHeight: fixedHeaderHeight + insets.top,
            },
          ]}
        >
          <View
            style={[
              styles.fixedHeaderRow,
              !hasBackButton && styles.fixedHeaderRowCentered,
            ]}
          >
            {hasBackButton && <BackButton variant="light" />}
            <View style={styles.fixedHeaderTextWrap}>
              {title ? (
                <AppText style={styles.fixedTitle} numberOfLines={1}>
                  {title}
                </AppText>
              ) : null}
              {hasFixedSubheader ? (
                <AppText style={styles.fixedSubheader}>{subheader}</AppText>
              ) : null}
            </View>
          </View>
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
                paddingHorizontal: 24,
                paddingVertical: 16,
                paddingTop: hasNoTopPadding
                  ? 0
                  : hasFixedHeader
                    ? fixedHeaderHeight + insets.top + 8
                    : insets.top,
                paddingBottom: hasBottomPadding ? 150 : 80,
                flexGrow: 1,
              },
              style,
            ]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {((subheader && !title) || includeLogo || (header && !title)) && (
              <View style={styles.headerWrapper}>
                {includeLogo && (
                  <Animated.Image
                    entering={FadeInUp.duration(600)}
                    source={require('../../assets/images/logos/logo.webp')}
                    style={styles.logo}
                    resizeMode="contain"
                  />
                )}
                {header && !title && (
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
    fixedHeader: {
      position: 'absolute',
      top: 0,
      right: 0,
      left: 0,
      zIndex: 10,
      paddingHorizontal: 24,
      paddingVertical: 8,
      paddingBottom: 12,
      backgroundColor: theme.backgroundHeader,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.border,
    },
    fixedHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: 12,
    },
    fixedHeaderRowCentered: {
      paddingVertical: 12,
      justifyContent: 'center',
    },
    fixedHeaderTextWrap: {
      flex: 1,
      minWidth: 0,
    },
    fixedTitle: {
      ...HEADING_STYLES(theme).screenTitle,
      color: theme.fixedHeaderTitleColor,
    },
    fixedSubheader: {
      marginTop: 2,
      fontSize: 13,
      fontWeight: '500',
      color: theme.fixedHeaderSubheaderColor,
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
