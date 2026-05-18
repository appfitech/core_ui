import { StyleSheet, View } from 'react-native';

import { formStyles } from '@/constants/styles';
import { useTheme } from '@/contexts/ThemeContext';
import { FullTheme } from '@/types/theme';

import { AppText } from './AppText';

type Props = {
  label: string;
  children: React.ReactNode;
};

export function FormWrapper({ label, children }: Props) {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={styles.inputWrapper}>
      <AppText style={styles.label}>{label}</AppText>
      {children}
    </View>
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    ...formStyles(theme),
  });
