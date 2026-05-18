import { TextStyle } from 'react-native';

/** Kinetic Obsidian / Inter type scale */
export const TYPOGRAPHY = {
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: 28,
    lineHeight: 34,
  },
  sectionTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 20,
    lineHeight: 26,
  },
  body: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    lineHeight: 22,
  },
  caption: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    lineHeight: 18,
  },
  button: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    lineHeight: 22,
  },
} as const satisfies Record<string, TextStyle>;

export type TypographyVariant = keyof typeof TYPOGRAPHY;

/** Map React Native fontWeight to loaded Inter faces. */
export function getInterFontFamily(weight?: TextStyle['fontWeight']): string {
  const weightStr =
    typeof weight === 'string'
      ? weight.toLowerCase()
      : (weight?.toString() ?? '400');

  if (weightStr === '500' || weightStr === 'medium') {
    return 'Inter_500Medium';
  }
  if (
    weightStr === '600' ||
    weightStr === 'semibold' ||
    weightStr === '600semibold'
  ) {
    return 'Inter_600SemiBold';
  }
  if (
    weightStr === '700' ||
    weightStr === 'bold' ||
    weightStr === '800' ||
    weightStr === '900'
  ) {
    return 'Inter_700Bold';
  }
  return 'Inter_400Regular';
}
