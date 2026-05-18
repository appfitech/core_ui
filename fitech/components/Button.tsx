import React from 'react';
import {
  StyleProp,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';

import { textStyles } from '@/constants/typography';
import { useTheme } from '@/contexts/ThemeContext';
import { FullTheme } from '@/types/theme';

import { AppText } from './AppText';

const MIN_HEIGHT = 48;

type ButtonType = 'primary' | 'secondary' | 'destructive' | 'tertiary' | 'link';

type ButtonStyles = {
  base: ViewStyle;
  container: Record<ButtonType, ViewStyle>;
  text: Record<ButtonType, TextStyle>;
  disabledContainer: ViewStyle;
  disabledText: TextStyle;
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
}: Props) {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const containerStyle = styles.container[type];
  const textStyle = styles.text[type];

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
          disabled && styles.disabledContainer,
          buttonStyle,
        ]}
        disabled={disabled}
        onPress={onPress}
        activeOpacity={0.78}
      >
        {label ? (
          <AppText style={[textStyle, disabled && styles.disabledText]}>
            {label}
          </AppText>
        ) : null}
        {children}
      </TouchableOpacity>
    </Wrapper>
  );
}

function getStyles(theme: FullTheme): ButtonStyles {
  const base: ViewStyle = {
    minHeight: MIN_HEIGHT,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  };
  const container: Record<ButtonType, ViewStyle> = {
    primary: { backgroundColor: theme.primary },
    secondary: {
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: theme.primary,
    },
    destructive: { backgroundColor: theme.error },
    tertiary: {
      backgroundColor: theme.backgroundInput,
      borderWidth: 1,
      borderColor: theme.border,
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
      color: theme.background,
    },
    secondary: {
      ...text.button,
      color: theme.primaryText,
    },
    destructive: {
      ...text.button,
      color: theme.background,
    },
    tertiary: {
      ...text.button,
      color: theme.textPrimary,
    },
    link: {
      ...text.caption,
      fontFamily: 'Inter_600SemiBold',
      color: theme.primary,
      textDecorationLine: 'underline',
    },
  };
  return {
    base,
    container,
    text: buttonText,
    disabledContainer: { opacity: 0.55 },
    disabledText: {},
  };
}
