import {
  StyleSheet,
  TextInput as NativeTextInput,
  type TextInputProps,
} from 'react-native';

import { SHARED_STYLES } from '@/constants/shared_styles';
import { useTheme } from '@/contexts/ThemeContext';
import { FullTheme } from '@/types/theme';

type Props = TextInputProps;

export function TextInput(props: Props) {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <NativeTextInput
      {...props}
      placeholderTextColor={theme.dark800}
      style={[styles.input, { flex: 1 }, props.style ?? {}]}
      autoCapitalize="none"
      autoCorrect={false}
    />
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    ...SHARED_STYLES(theme),
  });
