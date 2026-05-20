import React from 'react';
import {
  ActivityIndicator,
  StyleProp,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';

import { textStyles } from '@/constants/styles';
import { useTheme } from '@/contexts/ThemeContext';
import { AppTheme } from '@/types/theme';

import { AppText } from './AppText';

const MIN_HEIGHT = 48;

type ButtonType = 'primary' | 'secondary' | 'destructive' | 'tertiary' | 'link';

type ButtonStyles = {
  base: ViewStyle;
  container: Record<ButtonType, ViewStyle>;
  text: Record<ButtonType, TextStyle>;
  spinnerColor: Record<ButtonType, string>;
  disabledContainer: ViewStyle;
  disabledText: TextStyle;
  loadingRow: ViewStyle;
};

type Props = {
  label?: string;
  onPress: () => void;
  type?: ButtonType;
  style?: StyleProp<ViewStyle>;
  buttonStyle?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
  disabled?: boolean;
  /** When false, skips the entrance animation (e.g. alerts). Default true. */
  animated?: boolean;
  loading?: boolean;
  /** Shown instead of `label` while `loading` is true. */
  loadingLabel?: string;
};

export function Button({
  label = '',
  children = null,
  onPress,
  type = 'primary',
  style = {},
  buttonStyle = {},
  disabled = false,
  animated = true,
  loading = false,
  loadingLabel,
}: Props) {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const containerStyle = styles.container[type];
  const textStyle = styles.text[type];
  const isDisabled = disabled || loading;
  const displayLabel =
    loading && loadingLabel != null && loadingLabel !== ''
      ? loadingLabel
      : label;
  const spinnerColor = styles.spinnerColor[type];

  const Wrapper = animated ? Animated.View : View;
  const wrapperProps = animated
    ? { entering: ZoomIn.delay(200), style }
    : { style };

  return (
    <Wrapper {...wrapperProps}>
      <TouchableOpacity
        style={[
          styles.base,
          containerStyle,
          isDisabled && styles.disabledContainer,
          buttonStyle,
        ]}
        disabled={isDisabled}
        onPress={onPress}
        activeOpacity={0.78}
      >
        {loading ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator color={spinnerColor} size="small" />
            {displayLabel ? (
              <AppText style={[textStyle, isDisabled && styles.disabledText]}>
                {displayLabel}
              </AppText>
            ) : null}
          </View>
        ) : (
          <>
            {label ? (
              <AppText style={[textStyle, isDisabled && styles.disabledText]}>
                {label}
              </AppText>
            ) : null}
            {children}
          </>
        )}
      </TouchableOpacity>
    </Wrapper>
  );
}

function getStyles(theme: AppTheme): ButtonStyles {
  const base: ViewStyle = {
    minHeight: MIN_HEIGHT,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  };
  const container: Record<ButtonType, ViewStyle> = {
    primary: { backgroundColor: theme.button.primaryBg },
    secondary: {
      backgroundColor: theme.button.secondaryBg,
      borderWidth: 1,
      borderColor: theme.button.secondaryBorder,
    },
    destructive: { backgroundColor: theme.status.error.bg },
    tertiary: {
      backgroundColor: theme.background.input,
      borderWidth: 1,
      borderColor: theme.border.default,
    },
    link: {
      backgroundColor: 'transparent',
      paddingVertical: 8,
      paddingHorizontal: 12,
      minHeight: undefined,
    },
  };
  const text = textStyles(theme);
  const buttonText: Record<ButtonType, TextStyle> = {
    primary: {
      ...text.button,
      color: theme.button.primaryText,
    },
    secondary: {
      ...text.button,
      color: theme.button.secondaryText,
    },
    destructive: {
      ...text.button,
      color: theme.status.error.text,
    },
    tertiary: {
      ...text.button,
      color: theme.text.primary,
    },
    link: {
      ...text.caption,
      fontFamily: 'Inter_600SemiBold',
      color: theme.brand.primary,
      textDecorationLine: 'underline',
    },
  };
  const spinnerColor: Record<ButtonType, string> = {
    primary: theme.button.primaryText,
    secondary: theme.button.secondaryText,
    destructive: theme.button.dangerText,
    tertiary: theme.text.primary,
    link: theme.brand.primary,
  };

  return {
    base,
    container,
    text: buttonText,
    spinnerColor,
    disabledContainer: { opacity: 0.55 },
    disabledText: {},
    loadingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      columnGap: 10,
    },
  };
}
