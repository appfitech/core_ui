import { TextStyle, ViewStyle } from 'react-native';

import { TYPOGRAPHY } from '@/constants/typography';
import { FullTheme } from '@/types/theme';

const TAP_TARGET_MIN = 44;

type SharedStyles = {
  label: TextStyle;
  inputWrapper: ViewStyle;
  input: TextStyle;
  dropdown: TextStyle;
  submitButton: ViewStyle;
  submitText: TextStyle;
};

export const SHARED_STYLES = (theme: FullTheme): SharedStyles => ({
  label: {
    ...TYPOGRAPHY.caption,
    fontFamily: 'Inter_600SemiBold',
    color: theme.textPrimary,
    marginBottom: 8,
    marginTop: 12,
  },
  inputWrapper: {
    marginBottom: 8,
  },
  input: {
    ...TYPOGRAPHY.body,
    backgroundColor: theme.backgroundInput,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: theme.textPrimary,
    minHeight: TAP_TARGET_MIN,
  },
  dropdown: {
    ...TYPOGRAPHY.body,
    backgroundColor: theme.backgroundInput,
    borderColor: 'transparent',
    borderRadius: 12,
    color: theme.textPrimary,
    minHeight: TAP_TARGET_MIN,
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
    ...TYPOGRAPHY.button,
    color: theme.backgroundInverted,
  },
});

type HeadingStyleKeys =
  | 'header'
  | 'subheader'
  | 'title'
  | 'subtitle'
  | 'screenTitle'
  | 'content'
  | 'caption';
type HeadingStyles = Record<HeadingStyleKeys, TextStyle>;

/** Screen headings — built on the Inter type scale. */
export const HEADING_STYLES = (theme: FullTheme): HeadingStyles => ({
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
  title: {
    ...TYPOGRAPHY.sectionTitle,
    color: theme.textPrimary,
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
  caption: {
    ...TYPOGRAPHY.caption,
    fontFamily: 'Inter_500Medium',
    color: theme.textSecondary,
  },
});
