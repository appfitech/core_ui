import { TextStyle, ViewStyle } from 'react-native';

import { FullTheme } from '@/types/theme';

/**
 * Design system — shared text & form styles.
 *
 * Prefer `<AppText variant="…">` in JSX.
 * In StyleSheet: `...textStyles(theme).body` (only override color when needed).
 */

/** Raw Inter scale (no theme colors). */
export const TYPOGRAPHY = {
  display: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 40,
    lineHeight: 44,
  },
  statLarge: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 28,
    lineHeight: 32,
  },
  stat: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 22,
    lineHeight: 28,
  },
  title: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 26,
    lineHeight: 32,
  },
  sectionTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
    lineHeight: 24,
  },
  screenTitle: {
    fontFamily: 'Inter_500Medium',
    fontSize: 17,
    lineHeight: 22,
  },
  greeting: {
    fontFamily: 'Inter_500Medium',
    fontSize: 17,
    lineHeight: 22,
  },
  lead: {
    fontFamily: 'Inter_500Medium',
    fontSize: 17,
    lineHeight: 22,
  },
  leadSemibold: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 17,
    lineHeight: 22,
  },
  body: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    lineHeight: 22,
  },
  bodyMedium: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    lineHeight: 22,
  },
  bodySemibold: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    lineHeight: 22,
  },
  subheader: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    lineHeight: 20,
  },
  link: {
    fontFamily: 'Inter_500Medium',
    fontSize: 15,
    lineHeight: 20,
  },
  linkSemibold: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
    lineHeight: 20,
  },
  subtitle: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    lineHeight: 20,
  },
  small: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    lineHeight: 18,
  },
  smallMedium: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    lineHeight: 18,
  },
  smallSemibold: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    lineHeight: 18,
  },
  caption: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    lineHeight: 16,
  },
  captionMedium: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    lineHeight: 16,
  },
  captionSemibold: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    lineHeight: 16,
  },
  overline: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  label: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  nav: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    lineHeight: 16,
  },
  button: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    lineHeight: 22,
  },
} as const satisfies Record<string, TextStyle>;

export type TypographyScale = keyof typeof TYPOGRAPHY;

/** Semantic aliases + scale keys — all resolve in `textStyles()`. */
export type TextVariant =
  | TypographyScale
  | 'header'
  | 'content'
  | 'screenTitle';

const TAP_TARGET_MIN = 44;

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

export function getTextStyle(
  theme: FullTheme,
  variant: TextVariant,
): TextStyle {
  return textStyles(theme)[variant];
}

export type TextStyles = Record<TextVariant, TextStyle>;

/** All semantic text styles for the active theme. */
export function textStyles(theme: FullTheme): TextStyles {
  const base: Record<TypographyScale, TextStyle> = {
    display: { ...TYPOGRAPHY.display, color: theme.textPrimary },
    statLarge: { ...TYPOGRAPHY.statLarge, color: theme.textPrimary },
    stat: { ...TYPOGRAPHY.stat, color: theme.textPrimary },
    title: { ...TYPOGRAPHY.title, color: theme.textPrimary },
    sectionTitle: { ...TYPOGRAPHY.sectionTitle, color: theme.textPrimary },
    screenTitle: { ...TYPOGRAPHY.screenTitle, color: theme.textPrimary },
    greeting: { ...TYPOGRAPHY.greeting, color: theme.textPrimary },
    lead: { ...TYPOGRAPHY.lead, color: theme.textPrimary },
    leadSemibold: { ...TYPOGRAPHY.leadSemibold, color: theme.textPrimary },
    body: { ...TYPOGRAPHY.body, color: theme.textPrimary },
    bodyMedium: { ...TYPOGRAPHY.bodyMedium, color: theme.textPrimary },
    bodySemibold: { ...TYPOGRAPHY.bodySemibold, color: theme.textPrimary },
    subheader: { ...TYPOGRAPHY.subheader, color: theme.textSecondary },
    link: { ...TYPOGRAPHY.link, color: theme.textPrimary },
    linkSemibold: { ...TYPOGRAPHY.linkSemibold, color: theme.textPrimary },
    subtitle: { ...TYPOGRAPHY.subtitle, color: theme.textSecondary },
    small: { ...TYPOGRAPHY.small, color: theme.textPrimary },
    smallMedium: { ...TYPOGRAPHY.smallMedium, color: theme.textPrimary },
    smallSemibold: { ...TYPOGRAPHY.smallSemibold, color: theme.textPrimary },
    caption: { ...TYPOGRAPHY.caption, color: theme.textSecondary },
    captionMedium: { ...TYPOGRAPHY.captionMedium, color: theme.textSecondary },
    captionSemibold: {
      ...TYPOGRAPHY.captionSemibold,
      color: theme.textSecondary,
    },
    overline: { ...TYPOGRAPHY.overline, color: theme.textSecondary },
    label: {
      ...TYPOGRAPHY.label,
      color: theme.dark800,
      marginBottom: 8,
      marginTop: 12,
    },
    nav: { ...TYPOGRAPHY.nav, color: theme.textSecondary },
    button: { ...TYPOGRAPHY.button, color: theme.textPrimary },
  };

  return {
    ...base,
    header: {
      ...base.title,
      textAlign: 'center',
    },
    content: base.body,
    screenTitle: base.screenTitle,
  };
}

export type FormStyles = {
  label: TextStyle;
  inputWrapper: ViewStyle;
  input: TextStyle;
  dropdown: TextStyle;
  submitButton: ViewStyle;
  submitText: TextStyle;
  labelContainer: ViewStyle;
  optionalTag: ViewStyle;
};

export function formStyles(theme: FullTheme): FormStyles {
  const text = textStyles(theme);

  return {
    label: text.label,
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.backgroundInput,
      borderRadius: 12,
      paddingHorizontal: 12,
      borderWidth: 1,
      borderColor: theme.border,
      overflow: 'hidden',
      minHeight: TAP_TARGET_MIN,
      maxHeight: TAP_TARGET_MIN + 4,
    },
    input: {
      ...text.body,
      backgroundColor: 'transparent',
      flex: 1,
      paddingVertical: 0,
      minHeight: TAP_TARGET_MIN,
      lineHeight: 20,
    },
    dropdown: {
      ...text.link,
      backgroundColor: theme.backgroundInput,
      borderRadius: 12,
      minHeight: TAP_TARGET_MIN,
      borderWidth: 1,
      borderColor: theme.border,
    },
    submitButton: {
      backgroundColor: theme.primary,
      paddingVertical: 16,
      paddingHorizontal: 24,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: TAP_TARGET_MIN,
    },
    submitText: {
      ...text.button,
      color: theme.backgroundInverted,
    },
    labelContainer: {
      columnGap: 4,
      flexDirection: 'row',
      alignItems: 'center',
    },
    optionalTag: {
      paddingVertical: 2,
      paddingHorizontal: 8,
      alignSelf: 'center',
    },
  };
}
