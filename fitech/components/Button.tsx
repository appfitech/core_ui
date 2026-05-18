import React from 'react';
import {
  StyleProp,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';

import { TYPOGRAPHY } from '@/constants/typography';
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
};

export function Button({
  label = '',
  children = null,
  onPress,
  type = 'primary',
  style = {},
  buttonStyle = {},
  disabled = false,
}: Props) {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const containerStyle = styles.container[type];
  const textStyle = styles.text[type];

  return (
    <Animated.View entering={ZoomIn.delay(200)} style={style}>
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
    </Animated.View>
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
  const text: Record<ButtonType, TextStyle> = {
    primary: {
      ...TYPOGRAPHY.button,
      color: theme.background,
    },
    secondary: {
      ...TYPOGRAPHY.button,
      color: theme.primaryText,
    },
    destructive: {
      ...TYPOGRAPHY.button,
      color: theme.background,
    },
    tertiary: {
      ...TYPOGRAPHY.button,
      color: theme.textPrimary,
    },
    link: {
      ...TYPOGRAPHY.caption,
      fontFamily: 'Inter_600SemiBold',
      color: theme.primary,
      textDecorationLine: 'underline',
    },
  };
  return {
    base,
    container,
    text,
    disabledContainer: { opacity: 0.55 },
    disabledText: {},
  };
}
