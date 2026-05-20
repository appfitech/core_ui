import React from 'react';
import { StyleSheet, View } from 'react-native';

import { ChipToggle } from '@/components/atoms/ChipToggle';
import { AppText } from '@/components/AppText';
import { textStyles } from '@/constants/styles';
import { useTheme } from '@/contexts/ThemeContext';
import { FullTheme } from '@/types/theme';

type Chip = { label: string; value: string };

type Props = {
  hint: string;
  chips?: Chip[];
  selectedValue?: string;
  onChipPress?: (value: string) => void;
  children?: React.ReactNode;
};

export function ListFilterSection({
  hint,
  chips,
  selectedValue,
  onChipPress,
  children,
}: Props) {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={styles.card}>
      <AppText style={styles.hint}>{hint}</AppText>
      {chips && selectedValue != null && onChipPress ? (
        <View style={styles.chipRow}>
          {chips.map((chip) => (
            <ChipToggle
              key={chip.value}
              label={chip.label}
              value={chip.value}
              selected={selectedValue === chip.value}
              onPress={onChipPress}
            />
          ))}
        </View>
      ) : (
        children
      )}
    </View>
  );
}

const getStyles = (theme: FullTheme) => {
  const text = textStyles(theme);
  return StyleSheet.create({
    card: {
      backgroundColor: theme.background.card,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: theme.border.default,
      borderLeftWidth: 4,
      borderLeftColor: theme.brand.primary,
      paddingVertical: 14,
      paddingHorizontal: 16,
      rowGap: 12,
    },
    hint: {
      ...text.caption,
      color: theme.text.secondary,
    },
    chipRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
    },
  });
};
