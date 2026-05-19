import { Pressable, StyleSheet } from 'react-native';

import { AppText } from '@/components/AppText';
import { textStyles } from '@/constants/styles';
import { useTheme } from '@/contexts/ThemeContext';
import { FullTheme } from '@/types/theme';
type Props = {
  label: string;
  value: string;
  selected: boolean;
  onPress: (value: string) => void;
};

export function ChipToggle({ label, selected, value, onPress }: Props) {
  const { theme } = useTheme();

  const styles = getStyles(theme);

  const handlePress = () => {
    onPress(value);
  };

  return (
    <Pressable
      onPress={handlePress}
      style={[
        styles.container,
        selected && { backgroundColor: theme.text.primary },
      ]}
    >
      <AppText
        style={[
          styles.label,
          selected && styles.labelSelected,
        ]}
      >
        {label}
      </AppText>
    </Pressable>
  );
}

const getStyles = (theme: FullTheme) => {
  const text = textStyles(theme);
  return StyleSheet.create({
    container: {
      paddingVertical: 10,
      paddingHorizontal: 14,
      borderRadius: 999,
      backgroundColor: '#F1F1F1',
    },
    label: { ...text.linkSemibold, color: theme.text.primary },
    labelSelected: { ...text.linkSemibold, color: theme.background.app },
  });
};
