import { StyleSheet, View } from 'react-native';

import { ChipToggle } from '@/components/atoms/ChipToggle';
import { useTheme } from '@/contexts/ThemeContext';
import { Option } from '@/types/forms';
import { FullTheme } from '@/types/theme';

type Props = {
  options: Option[];
  onChange: (items: string[]) => void;
  selectedValues: string[];
};

export function ChipsList({ options, selectedValues, onChange }: Props) {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const handlePress = (newValue: string) => {
    const set = new Set(selectedValues || []);

    if (set.has(newValue)) {
      set.delete(newValue);
    } else {
      set.add(newValue);
    }

    onChange(Array.from(set));
  };

  return (
    <View style={styles.row}>
      {options.map((option) => {
        return (
          <ChipToggle
            key={option.value}
            onPress={handlePress}
            label={option.label}
            value={option.value}
            selected={selectedValues.includes(option.value)}
          />
        );
      })}
    </View>
  );
}

const getStyles = (_theme: FullTheme) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
  });
