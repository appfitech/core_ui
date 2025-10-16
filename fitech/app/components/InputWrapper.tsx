import { StyleSheet, TextInputProps, View } from 'react-native';

import { SHARED_STYLES } from '@/constants/shared_styles';
import { useTheme } from '@/contexts/ThemeContext';
import { FullTheme } from '@/types/theme';

import { AppText } from './AppText';
import { TextInput } from './TextInput';

type Props = TextInputProps & {
  label: string;
  id: string;
};

export function InputWrapper({ label, id, ...props }: Props) {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <View key={id} style={styles.inputWrapper}>
      <AppText style={styles.label}>{label}</AppText>
      <TextInput {...props} />
    </View>
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    ...SHARED_STYLES(theme),
  });
