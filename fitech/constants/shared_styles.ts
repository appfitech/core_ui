import { TextStyle, ViewStyle } from 'react-native';

import { FullTheme } from '@/types/theme';

type SharedStyleKeys =
  | 'label'
  | 'inputWrapper'
  | 'input'
  | 'dropdown'
  | 'submitButton'
  | 'submitText';

type SharedStyles = Record<SharedStyleKeys, ViewStyle | TextStyle>;

export const SHARED_STYLES = (theme: FullTheme): SharedStyles => ({
  label: {
    fontSize: 16,
    color: theme.green700,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 12,
  },
  inputWrapper: {
    marginBottom: 4,
  },
  input: {
    backgroundColor: theme.backgroundInput,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 14,
    fontSize: 17,
    color: theme.dark900,
  },
  dropdown: {
    backgroundColor: theme.backgroundInput,
    borderColor: 'transparent',
    borderRadius: 10,
    color: theme.dark900,
  },
  submitButton: {
    backgroundColor: theme.primary,
    paddingVertical: 18,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 24,
  },
  submitText: {
    color: theme.textPrimary,
    fontWeight: '700',
    fontSize: 18,
  },
});

type HeadingStyleKeys = 'header' | 'subheader' | 'title' | 'subtitle';
type HeadingStyles = Record<HeadingStyleKeys, TextStyle>;

export const HEADING_STYLES = (theme: FullTheme): HeadingStyles => ({
  header: {
    color: theme.textPrimary,
    fontSize: 34,
    textAlign: 'center',
  },
  subheader: {
    fontSize: 22,
    color: theme.textSecondary,
    textAlign: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: theme.textSecondary,
    textAlign: 'center',
  },
});
