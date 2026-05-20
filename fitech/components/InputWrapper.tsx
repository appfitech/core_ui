import { StyleSheet, TextInputProps, View } from 'react-native';

import { formStyles } from '@/constants/styles';
import { useTheme } from '@/contexts/ThemeContext';
import { AppTheme } from '@/types/theme';

import { AppText } from './AppText';
import { TextInput } from './TextInput';

type Props = TextInputProps & {
  label: string;
  id: string;
  disabled?: boolean;
};

export function InputWrapper({ label, id, disabled, ...props }: Props) {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <View key={id} style={styles.inputWrapper}>
      <AppText style={styles.label}>{label}</AppText>
      <TextInput
        {...props}
        editable={disabled ? false : props.editable}
        style={[props.style, disabled && styles.inputDisabled]}
      />
    </View>
  );
}

const getStyles = (theme: AppTheme) =>
  StyleSheet.create({
    ...formStyles(theme),
    inputDisabled: {
      backgroundColor: theme.background.input,
      opacity: 0.9,
      color: theme.text.secondary,
      borderWidth: 1,
      borderColor: theme.border.default,
    },
  });
