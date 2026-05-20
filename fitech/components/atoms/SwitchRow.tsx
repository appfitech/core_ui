import { StyleSheet, Switch, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { textStyles } from '@/constants/styles';
import { useTheme } from '@/contexts/ThemeContext';
import { AppTheme } from '@/types/theme';

type Props = {
  label: string;
  onChange: (value: boolean) => void;
  value: boolean;
  labelStyle?: any;
};

export function SwitchRow({ label, labelStyle, value, onChange }: Props) {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={styles.container}>
      <AppText style={[styles.label, labelStyle]}>{label}</AppText>
      <Switch value={!!value} onValueChange={onChange} />
    </View>
  );
}

const getStyles = (theme: AppTheme) => {
  const text = textStyles(theme);
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    label: {
      ...text.link,
      paddingRight: 20,
      flexWrap: 'wrap',
      flex: 1,
    },
  });
};
