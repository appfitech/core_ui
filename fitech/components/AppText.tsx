import React, { forwardRef } from 'react';
import { StyleSheet, Text as RNText, Text, TextProps } from 'react-native';

import {
  getInterFontFamily,
  TYPOGRAPHY,
  TypographyVariant,
} from '@/constants/typography';

type Props = TextProps & {
  /** Applies a preset from the design system (default: `body`). */
  variant?: TypographyVariant;
};

export const AppText = forwardRef<RNText, Props>(
  ({ style, variant = 'body', children, ...props }, ref) => {
    const flattened = StyleSheet.flatten(style) ?? {};
    const preset = TYPOGRAPHY[variant];
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
