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
    fontSize: 15,
    color: theme.green700,
    fontWeight: 'medium',
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
    paddingVertical: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 24,
  },
  submitText: {
    color: theme.textPrimary,
    fontWeight: '600',
    fontSize: 18,
  },
});
