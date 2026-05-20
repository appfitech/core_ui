import { Pressable, StyleSheet } from 'react-native';

import { AppText } from '@/components/AppText';
import { textStyles } from '@/constants/styles';
import { useTheme } from '@/contexts/ThemeContext';
import { AppTheme } from '@/types/theme';

type Props = {
  label: string;
  value: string;
  selected: boolean;
  onPress: (value: string) => void;
};

export function ChipToggle({ label, selected, value, onPress }: Props) {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <Pressable
      onPress={() => onPress(value)}
      style={[styles.container, selected && styles.containerSelected]}
    >
      <AppText style={[styles.label, selected && styles.labelSelected]}>
        {label}
      </AppText>
    </Pressable>
  );
}

const getStyles = (theme: AppTheme) => {
  const text = textStyles(theme);

  return StyleSheet.create({
    container: {
      paddingVertical: 7,
      paddingHorizontal: 12,
      borderRadius: 999,
      backgroundColor: theme.background.card,
      borderWidth: 1,
      borderColor: theme.border.default,
    },
    containerSelected: {
      backgroundColor: theme.brand.primary,
      borderColor: theme.brand.primary,
    },
    label: {
      ...text.smallSemibold,
      color: theme.text.primary,
    },
    labelSelected: {
      color: theme.background.app,
    },
  });
};
