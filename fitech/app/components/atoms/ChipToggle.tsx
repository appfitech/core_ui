import { Pressable, StyleSheet } from 'react-native';

import { useTheme } from '@/contexts/ThemeContext';
import { FullTheme } from '@/types/theme';

import { AppText } from '../AppText';

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
        selected && { backgroundColor: theme.backgroundInverted },
      ]}
    >
      <AppText
        style={[
          styles.label,
          selected && { color: theme.dark100, fontWeight: '700' },
        ]}
      >
        {label}
      </AppText>
    </Pressable>
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    container: {
      paddingVertical: 10,
      paddingHorizontal: 14,
      borderRadius: 999,
      backgroundColor: '#F1F1F1',
    },
    label: { fontWeight: '600' },
  });
