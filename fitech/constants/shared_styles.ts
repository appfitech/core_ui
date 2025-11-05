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
    fontSize: 14,
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
    fontSize: 15,
    color: theme.dark900,
  },
  dropdown: {
    backgroundColor: theme.backgroundInput,
    borderColor: 'transparent',
    borderRadius: 10,
    color: theme.dark900,
    fontSize: 15,
  },
  submitButton: {
    backgroundColor: theme.primary,
    paddingVertical: 18,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitText: {
    color: theme.textPrimary,
    fontWeight: '700',
    fontSize: 16,
  },
});

type HeadingStyleKeys =
  | 'header'
  | 'subheader'
  | 'title'
  | 'subtitle'
  | 'content';
type HeadingStyles = Record<HeadingStyleKeys, TextStyle>;

export const HEADING_STYLES = (theme: FullTheme): HeadingStyles => ({
  header: {
    color: theme.textPrimary,
    fontSize: 30,
    textAlign: 'center',
    fontWeight: '600',
  },
  subheader: {
    fontSize: 20,
    color: theme.textSecondary,
    textAlign: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: theme.textSecondary,
    textAlign: 'center',
  },
  content: {
    fontSize: 13,
    color: theme.textPrimary,
    textAlign: 'left',
  },
});
