import { TextStyle, ViewStyle } from 'react-native';

import { FullTheme } from '@/types/theme';

/**
 * Design system — typography & form text styles in one place.
 *
 * Prefer `<AppText variant="sectionTitle">` for UI copy.
 * Use `textStyles(theme).header` when building StyleSheet objects.
 * Use `formStyles(theme)` for inputs, labels, and submit rows.
 */

/** Raw Inter scale (no theme colors). */
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
    fontSize: 12,
    lineHeight: 16,
  },
  button: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    lineHeight: 22,
  },
} as const satisfies Record<string, TextStyle>;

/** Base scale keys (maps 1:1 to TYPOGRAPHY). */
export type TypographyScale = keyof typeof TYPOGRAPHY;

/** Semantic text presets (includes theme colors). */
export type TextVariant =
  | TypographyScale
  | 'header'
  | 'subheader'
  | 'subtitle'
  | 'screenTitle'
  | 'content'
  | 'label';

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

/** Themed text preset — use with AppText or StyleSheet. */
export function getTextStyle(
  theme: FullTheme,
  variant: TextVariant,
): TextStyle {
  return textStyles(theme)[variant];
}

export type TextStyles = Record<TextVariant, TextStyle>;

/** All semantic text styles for the active theme. */
export function textStyles(theme: FullTheme): TextStyles {
  return {
    title: {
      ...TYPOGRAPHY.title,
      color: theme.textPrimary,
    },
    sectionTitle: {
      ...TYPOGRAPHY.sectionTitle,
      color: theme.textPrimary,
    },
    body: {
      ...TYPOGRAPHY.body,
      color: theme.textPrimary,
    },
    caption: {
      ...TYPOGRAPHY.caption,
      color: theme.textSecondary,
    },
    button: {
      ...TYPOGRAPHY.button,
      color: theme.textPrimary,
    },
    header: {
      ...TYPOGRAPHY.title,
      color: theme.textPrimary,
      textAlign: 'center',
    },
    subheader: {
      ...TYPOGRAPHY.body,
      fontFamily: 'Inter_500Medium',
      color: theme.textSecondary,
      textAlign: 'center',
    },
    subtitle: {
      ...TYPOGRAPHY.body,
      fontFamily: 'Inter_600SemiBold',
      color: theme.textSecondary,
    },
    screenTitle: {
      ...TYPOGRAPHY.body,
      fontFamily: 'Inter_600SemiBold',
      color: theme.textPrimary,
    },
    content: {
      ...TYPOGRAPHY.body,
      color: theme.textPrimary,
    },
    label: {
      ...TYPOGRAPHY.caption,
      fontFamily: 'Inter_600SemiBold',
      color: theme.dark800,
      textTransform: 'uppercase',
      marginBottom: 8,
      marginTop: 12,
    },
  };
}

export type FormStyles = {
  label: TextStyle;
  inputWrapper: ViewStyle;
  input: TextStyle;
  dropdown: TextStyle;
  submitButton: ViewStyle;
  submitText: TextStyle;
};

/** Form fields & actions — pairs with `textStyles` for screens. */
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
    },
    input: {
      ...text.body,
      backgroundColor: theme.backgroundInput,
      borderRadius: 12,
      paddingVertical: 12,
      minHeight: TAP_TARGET_MIN,
      lineHeight: 0,
    },
    dropdown: {
      ...text.body,
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
  };
}
