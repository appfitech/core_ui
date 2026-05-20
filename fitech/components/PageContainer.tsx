import React, { useState } from 'react';
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { textStyles } from '@/constants/styles';
import { useTabBarInset } from '@/contexts/TabBarInsetContext';
import { useTheme } from '@/contexts/ThemeContext';
import { FullTheme } from '@/types/theme';
import {
  CONTENT_GAP_BELOW_HEADER,
  getFixedHeaderScrollOffset,
  getFooterScrollPaddingBottom,
  getScreenScrollPaddingBottom,
  getScrollPaddingBottom,
  PAGE_HEADER_TOP_EXTRA,
} from '@/utils/layout';
import { authFadeInUp } from '@/utils/platform-animations';

import { AnimatedAppText } from './AnimatedAppText';
import { AppText } from './AppText';
import { BackButton } from './BackButton';

/** Space between focused field and keyboard (keep small — KASV already positions the field). */
const KEYBOARD_EXTRA_SCROLL = {
  default: { ios: 16, android: 24 },
  /** Sticky footer (e.g. register) — field must clear keyboard + footer button */
  withFooter: { ios: 88, android: 120 },
} as const;

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
  /** Bottom padding for scroll content so the last content is visible above nav/tab bar. Applied after style. */
  contentPaddingBottom?: number;
  styleContainer?: ViewStyle;
  /**
   * When true, children are not wrapped in ScrollView (use with FlatList / FlashList as main scroll).
   * Avoids nested scroll + renders all rows at once on long lists (bad on Android).
   */
  disableScroll?: boolean;
  /** Rendered below the scroll area, fixed at the bottom of the screen */
  footer?: React.ReactNode;
  /**
   * Extra padding under `footer` so it sits above the tab bar.
   * @default false — opt in on tab screens (e.g. workout form).
   */
  footerAboveTabBar?: boolean;
  onBackPress?: () => void;
  /** Shorter fades on Android for register / forgot-password style flows. */
  authOptimized?: boolean;
  /**
   * When false, bottom padding is only safe-area sized (support, auth stack).
   * @default true
   */
  includeTabBarPadding?: boolean;
  /** Use with a parent `ImageBackground` so the app background does not cover it. */
  transparentBackground?: boolean;
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
  contentPaddingBottom,
  styleContainer = {},
  disableScroll = false,
  footer,
  footerAboveTabBar = false,
  onBackPress,
  authOptimized = false,
  includeTabBarPadding = true,
  transparentBackground = false,
}: Props) {
  const insets = useSafeAreaInsets();
  const tabBarInset = useTabBarInset();
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [measuredFixedHeaderHeight, setMeasuredFixedHeaderHeight] = useState(0);

  const defaultBottomPadding =
    includeTabBarPadding && hasBottomPadding
      ? Math.max(tabBarInset, getScrollPaddingBottom(insets))
      : includeTabBarPadding
        ? getScrollPaddingBottom(insets, { includeFab: false })
        : getScreenScrollPaddingBottom(insets);

  const scrollPaddingBottom =
    contentPaddingBottom ??
    (footer ? getFooterScrollPaddingBottom(insets) : defaultBottomPadding);

  const hasFixedHeader = hasBackButton || !!title;
  const hasFixedSubheader = !!(title && subheader);

  const headerTopInset = insets.top + PAGE_HEADER_TOP_EXTRA;

  const fixedHeaderScrollOffset = hasFixedHeader
    ? getFixedHeaderScrollOffset(insets, {
        hasSubheader: hasFixedSubheader,
        titleOnlyNoBack: !!title && !hasBackButton,
      })
    : 0;

  const scrollPaddingTop = hasFixedHeader
    ? measuredFixedHeaderHeight > 0
      ? measuredFixedHeaderHeight + CONTENT_GAP_BELOW_HEADER
      : fixedHeaderScrollOffset
    : hasNoTopPadding
      ? 0
      : insets.top + PAGE_HEADER_TOP_EXTRA;

  const bottomScrollInset =
    includeTabBarPadding && hasBottomPadding ? scrollPaddingBottom : 0;

  const footerPaddingBottom =
    Math.max(insets.bottom, 16) +
    (footer && footerAboveTabBar ? tabBarInset : 0);

  const sharedInnerStyle: StyleProp<ViewStyle> = [
    styles.scrollContent,
    {
      paddingHorizontal: 16,
      paddingTop: scrollPaddingTop,
    },
    style,
  ];

  const keyboardVerticalOffset = hasFixedHeader
    ? scrollPaddingTop
    : headerTopInset;

  const keyboardPlatform = Platform.OS === 'android' ? 'android' : 'ios';
  const headerEnter = (duration: number, delay = 0) =>
    authOptimized
      ? authFadeInUp(duration, delay)
      : FadeInUp.duration(duration).delay(delay);

  const keyboardScrollProps = {
    enableOnAndroid: true,
    enableAutomaticScroll: true,
    enableResetScrollToCoords: false,
    keyboardOpeningTime: 0,
    extraScrollHeight: footer
      ? KEYBOARD_EXTRA_SCROLL.withFooter[keyboardPlatform]
      : KEYBOARD_EXTRA_SCROLL.default[keyboardPlatform],
    keyboardVerticalOffset,
    keyboardShouldPersistTaps: 'handled' as const,
    keyboardDismissMode: 'on-drag' as const,
    showsVerticalScrollIndicator: false,
    nestedScrollEnabled: true,
    overScrollMode: 'always' as const,
    ...(Platform.OS === 'android' && bottomScrollInset > 0
      ? { scrollIndicatorInsets: { bottom: bottomScrollInset } }
      : {}),
  };

  const scrollHeader =
    (subheader && !title) || includeLogo || (header && !title) ? (
      <View style={styles.headerWrapper}>
        {includeLogo && (
          <Animated.Image
            entering={headerEnter(600)}
            source={require('@/assets/images/logos/logo.webp')}
            style={styles.logo}
            resizeMode="contain"
          />
        )}
        {header && !title && (
          <AnimatedAppText
            entering={headerEnter(600, 200)}
            style={styles.headerTitle}
          >
            {header}
          </AnimatedAppText>
        )}
        {subheader && (
          <AnimatedAppText
            entering={headerEnter(600, 300)}
            style={styles.headerSubtitle}
          >
            {subheader}
          </AnimatedAppText>
        )}
      </View>
    ) : null;

  const scrollBottomSpacer =
    bottomScrollInset > 0 ? (
      <View style={{ height: bottomScrollInset }} />
    ) : null;

  const scrollContent = (
    <>
      {scrollHeader}
      {children}
      {scrollBottomSpacer}
    </>
  );

  const surfaceStyles = transparentBackground
    ? styles.transparentSurface
    : null;

  return (
    <View
      style={[
        styles.container,
        transparentBackground && styles.containerTransparent,
        styleContainer,
      ]}
    >
      {hasFixedHeader && (
        <View
          onLayout={(event) => {
            const { height } = event.nativeEvent.layout;
            if (height > 0 && height !== measuredFixedHeaderHeight) {
              setMeasuredFixedHeaderHeight(height);
            }
          }}
          style={[
            styles.fixedHeader,
            transparentBackground && styles.fixedHeaderTransparent,
            { paddingTop: headerTopInset },
          ]}
        >
          <View
            style={[
              styles.fixedHeaderRow,
              hasFixedSubheader && styles.fixedHeaderRowWithSubheader,
              !hasBackButton && styles.fixedHeaderRowCentered,
            ]}
          >
            {hasBackButton && (
              <BackButton variant="light" onPress={onBackPress} />
            )}
            <View style={styles.fixedHeaderTextWrap}>
              {title ? (
                <AppText variant="screenTitle" numberOfLines={1}>
                  {title}
                </AppText>
              ) : null}
              {hasFixedSubheader ? (
                <AppText variant="caption" style={styles.fixedSubheader}>
                  {subheader}
                </AppText>
              ) : null}
            </View>
          </View>
        </View>
      )}

      {disableScroll ? (
        footer ? (
          <View style={[styles.flex, surfaceStyles]}>
            <View style={[...sharedInnerStyle, styles.flex, surfaceStyles]}>
              {children}
            </View>
            <View
              style={[
                styles.footer,
                transparentBackground && styles.footerTransparent,
                { paddingBottom: footerPaddingBottom },
              ]}
            >
              {footer}
            </View>
          </View>
        ) : (
          <View style={[...sharedInnerStyle, styles.flex, surfaceStyles]}>
            {children}
          </View>
        )
      ) : footer ? (
        <View style={[styles.flex, surfaceStyles]}>
          <KeyboardAwareScrollView
            style={[styles.flex, surfaceStyles]}
            contentContainerStyle={sharedInnerStyle}
            {...keyboardScrollProps}
          >
            {scrollContent}
          </KeyboardAwareScrollView>
          <View
            style={[
              styles.footer,
              transparentBackground && styles.footerTransparent,
              { paddingBottom: footerPaddingBottom },
            ]}
          >
            {footer}
          </View>
        </View>
      ) : (
        <KeyboardAwareScrollView
          style={[styles.flex, surfaceStyles]}
          contentContainerStyle={sharedInnerStyle}
          {...keyboardScrollProps}
        >
          {scrollContent}
        </KeyboardAwareScrollView>
      )}
    </View>
  );
}

const getStyles = (theme: FullTheme) => {
  const text = textStyles(theme);
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background.app,
    },
    containerTransparent: {
      backgroundColor: 'transparent',
    },
    transparentSurface: {
      backgroundColor: 'transparent',
    },
    fixedHeader: {
      position: 'absolute',
      top: 0,
      right: 0,
      left: 0,
      zIndex: 10,
      paddingHorizontal: 16,
      paddingBottom: 10,
      backgroundColor: theme.background.elevated,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.border.subtle,
    },
    fixedHeaderTransparent: {
      backgroundColor: 'transparent',
      borderBottomWidth: 0,
    },
    fixedHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: 12,
      minHeight: 44,
    },
    fixedHeaderRowWithSubheader: {
      alignItems: 'flex-start',
    },
    fixedHeaderRowCentered: {
      paddingVertical: 12,
      justifyContent: 'center',
    },
    fixedHeaderTextWrap: {
      flex: 1,
      minWidth: 0,
    },
    fixedSubheader: {
      marginTop: 4,
      color: theme.text.secondary,
    },
    scrollContent: {
      flexGrow: 1,
    },
    flex: {
      flex: 1,
    },
    footer: {
      paddingHorizontal: 16,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: theme.border.default,
      backgroundColor: theme.background.app,
    },
    footerTransparent: {
      backgroundColor: 'transparent',
      borderTopWidth: 0,
    },
    headerTitle: {
      ...text.sectionTitle,
    },
    headerSubtitle: {
      ...text.subtitle,
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
};
