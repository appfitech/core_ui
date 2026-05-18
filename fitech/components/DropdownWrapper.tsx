import { StyleSheet, View } from 'react-native';

import { SHARED_STYLES } from '@/constants/shared_styles';
import { useTheme } from '@/contexts/ThemeContext';
import { FullTheme } from '@/types/theme';

import { AppText } from './AppText';
import { Dropdown, type Props as DropdownProps } from './Dropdown';

type Props = DropdownProps & {
  id: string;
  label: string;
};

export function DropdownWrapper({ label, id, ...props }: Props) {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <View key={id} style={styles.inputWrapper}>
      <AppText style={styles.label}>{label}</AppText>
      <Dropdown {...props} placeholder={props?.placeholder || label} />
    </View>
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    ...SHARED_STYLES(theme),
  });
