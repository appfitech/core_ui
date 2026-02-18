import { TextStyle, ViewStyle } from 'react-native';

import { FullTheme } from '@/types/theme';

/**
 * Typography & form styles aligned with platform guidelines.
 *
 * ## iOS Human Interface Guidelines (Typography)
 * - Large Title: 34pt | Title 1: 28pt | Title 2: 22pt | Title 3: 20pt
 * - Headline: 17pt Semibold | Body: 17pt Regular | Callout: 16pt | Subheadline: 15pt
 * - Footnote: 13pt | Caption 1: 12pt
 * - Weights: Regular (400), Medium (500), Semibold (600), Bold (700)
 * - Minimum tap target: 44×44pt. Inputs ≥16pt to avoid zoom on focus.
 *
 * ## Material Design 3 (Type scale – mobile)
 * - Headline: 32/28/24sp | Title: 22/16/14sp | Body: 16/14/12sp | Label: 14/12/11sp
 * - Body 16sp as baseline; lighter weight/color for secondary hierarchy
 * - Minimum touch target: 48dp
 *
 * Our scale maps to both: header≈Title 1, title≈Title 3, body=17/16, caption=13/12.
 */
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
    fontSize: 15,
    color: theme.textPrimary,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 12,
  },
  inputWrapper: {
    marginBottom: 8,
  },
  /** 16pt avoids iOS zoom on focus; matches MD input/body size */
  input: {
    backgroundColor: theme.backgroundInput,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: theme.textPrimary,
    minHeight: TAP_TARGET_MIN,
  },
  dropdown: {
    backgroundColor: theme.backgroundInput,
    borderColor: 'transparent',
    borderRadius: 12,
    color: theme.textPrimary,
    fontSize: 16,
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
    color: theme.backgroundInverted,
    fontWeight: '700',
    fontSize: 17,
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

/**
 * iOS: Nav bar titles are typically 17pt Semibold, title case (not all caps).
 * MD3: Top app bar title 22/16sp; we use 17pt for compact bar consistency.
 */
export const HEADING_STYLES = (theme: FullTheme): HeadingStyles => ({
  /** iOS Title 1 (28pt) / MD Headline medium — hero, welcome, login */
  header: {
    color: theme.textPrimary,
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
    lineHeight: 34,
    textAlign: 'center',
  },
  /** iOS Body (17pt) / MD Body large — supporting line under header */
  subheader: {
    color: theme.textSecondary,
    fontSize: 17,
    fontWeight: '500',
    lineHeight: 24,
    textAlign: 'center',
  },
  /** iOS Title 3 (20pt) / MD Title large — section or card title */
  title: {
    color: theme.textPrimary,
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 26,
  },
  /** iOS Callout (16pt) / MD Title medium — secondary heading */
  subtitle: {
    color: theme.textSecondary,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  /** Fixed screen header (nav bar title): 17pt Semibold, title case. Use on backgroundHeader. */
  screenTitle: {
    color: theme.textPrimary,
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 22,
  },
  /** iOS Body (17pt) / MD Body large — primary body text */
  content: {
    color: theme.textPrimary,
    fontSize: 17,
    fontWeight: '400',
    lineHeight: 24,
  },
  /** iOS Footnote (13pt) / MD Label medium — labels, hints, metadata */
  caption: {
    color: theme.textSecondary,
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
  },
});
