import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { AppText } from '@/components/AppText';
import { ChipToggle } from '@/components/atoms/ChipToggle';
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
  style?: StyleProp<ViewStyle>;
};

export function ListFilterSection({
  hint,
  chips,
  selectedValue,
  onChipPress,
  children,
  style,
}: Props) {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={[styles.card, style]}>
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
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border.default,
      borderLeftWidth: 3,
      borderLeftColor: theme.brand.primary,
      paddingVertical: 10,
      paddingHorizontal: 12,
      rowGap: 8,
    },
    hint: {
      ...text.caption,
      color: theme.text.secondary,
      lineHeight: 16,
    },
    chipRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
  });
};
