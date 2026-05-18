import React, { forwardRef } from 'react';
import {
  StyleSheet,
  Text as RNText,
  Text,
  TextProps,
} from 'react-native';

import {
  getInterFontFamily,
  getTextStyle,
  TextVariant,
} from '@/constants/typography';
import { useTheme } from '@/contexts/ThemeContext';

type Props = TextProps & {
  /** Themed preset from the design system (default: `body`). */
  variant?: TextVariant;
};

export const AppText = forwardRef<RNText, Props>(
  ({ style, variant = 'body', children, ...props }, ref) => {
    const { theme } = useTheme();
    const flattened = StyleSheet.flatten(style) ?? {};
    const preset = getTextStyle(theme, variant);
    const fontFamily =
      flattened.fontWeight != null
        ? getInterFontFamily(flattened.fontWeight)
        : preset.fontFamily;

    return (
      <Text ref={ref} {...props} style={[preset, { fontFamily }, style]}>
        {children}
      </Text>
    );
  },
);

AppText.displayName = 'AppText';
