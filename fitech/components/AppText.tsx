import React, { forwardRef } from 'react';
import { Text as RNText, Text, TextProps, TextStyle } from 'react-native';

type Props = TextProps;

const getPlusJakartaSansFont = (
  weight?: TextStyle['fontWeight'],
  style?: TextStyle['fontStyle'],
) => {
  const weightStr =
    typeof weight === 'string' ? weight : (weight?.toString() ?? '400');
  const isItalic = style === 'italic';
  const key = `${weightStr}${isItalic ? '_italic' : ''}`.toLowerCase();

  const map: Record<string, string> = {
    '200': 'PlusJakartaSans_200ExtraLight',
    '200_italic': 'PlusJakartaSans_200ExtraLight_Italic',
    '300': 'PlusJakartaSans_300Light',
    '300_italic': 'PlusJakartaSans_300Light_Italic',
    '400': 'PlusJakartaSans_400Regular',
    '400_italic': 'PlusJakartaSans_400Regular_Italic',
    '500': 'PlusJakartaSans_500Medium',
    '500_italic': 'PlusJakartaSans_500Medium_Italic',
    '600': 'PlusJakartaSans_600SemiBold',
    '600_italic': 'PlusJakartaSans_600SemiBold_Italic',
    '700': 'PlusJakartaSans_700Bold',
    '700_italic': 'PlusJakartaSans_700Bold_Italic',
    '800': 'PlusJakartaSans_800ExtraBold',
    '800_italic': 'PlusJakartaSans_800ExtraBold_Italic',
  };

  // fallback if some weight isn't mapped
  return map[key] ?? 'PlusJakartaSans_400Regular';
};

export const AppText = forwardRef<RNText, Props>(
  ({ style, children, ...props }, ref) => {
    const flattened = Array.isArray(style)
      ? Object.assign({}, ...style)
      : style || {};
    const fontWeight = flattened?.fontWeight;
    const fontStyle = flattened?.fontStyle;
    const fontFamily = getPlusJakartaSansFont(fontWeight, fontStyle);

    return (
      <Text ref={ref} {...props} style={[{ fontFamily }, style]}>
        {children}
      </Text>
    );
  },
);
