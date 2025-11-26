import { StyleSheet, Switch, View } from 'react-native';

import { useTheme } from '@/contexts/ThemeContext';

import { AppText } from '../AppText';

type Props = {
  label: string;
  onChange: (value: boolean) => void;
  value: boolean;
  labelStyle?: any;
};

export function SwitchRow({ label, labelStyle, value, onChange }: Props) {
  const { theme } = useTheme();
  const styles = getStyles();

  return (
    <View style={styles.container}>
      <AppText style={[styles.label, labelStyle]}>{label}</AppText>
      <Switch value={!!value} onValueChange={onChange} />
    </View>
  );
}

const getStyles = () =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    label: {
      fontWeight: '400',
      fontSize: 15,
      paddingRight: 20,
      flexWrap: 'wrap',
      flex: 1,
    },
  });
