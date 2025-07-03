import React, { forwardRef } from 'react';
import { Text as RNText, Text, TextProps, TextStyle } from 'react-native';

type Props = TextProps;

const getUrbanistFont = (
  weight?: TextStyle['fontWeight'],
  style?: TextStyle['fontStyle'],
) => {
  const weightStr =
    typeof weight === 'string' ? weight : (weight?.toString() ?? '400');
  const isItalic = style === 'italic';
  const key = `${weightStr}${isItalic ? '_italic' : ''}`.toLowerCase();

  const map: Record<string, string> = {
    '100': 'Urbanist_100Thin',
    '100_italic': 'Urbanist_100Thin_Italic',
    '200': 'Urbanist_200ExtraLight',
    '200_italic': 'Urbanist_200ExtraLight_Italic',
    '300': 'Urbanist_300Light',
    '300_italic': 'Urbanist_300Light_Italic',
    '400': 'Urbanist_400Regular',
    '400_italic': 'Urbanist_400Regular_Italic',
    '500': 'Urbanist_500Medium',
    '500_italic': 'Urbanist_500Medium_Italic',
    '600': 'Urbanist_600SemiBold',
    '600_italic': 'Urbanist_600SemiBold_Italic',
    '700': 'Urbanist_700Bold',
    '700_italic': 'Urbanist_700Bold_Italic',
    '800': 'Urbanist_800ExtraBold',
    '800_italic': 'Urbanist_800ExtraBold_Italic',
    '900': 'Urbanist_900Black',
    '900_italic': 'Urbanist_900Black_Italic',
  };

  return map[key] ?? 'Urbanist_400Regular';
};

export const AppText = forwardRef<RNText, Props>(
  ({ style, children, ...props }, ref) => {
    const flattened = Array.isArray(style)
      ? Object.assign({}, ...style)
      : style || {};
    const fontWeight = flattened?.fontWeight;
    const fontStyle = flattened?.fontStyle;
    const fontFamily = getUrbanistFont(fontWeight, fontStyle);

    return (
      <Text ref={ref} {...props} style={[{ fontFamily }, style]}>
        {children}
      </Text>
    );
  },
);
