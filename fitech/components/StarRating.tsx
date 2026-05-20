import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { useTheme } from '@/contexts/ThemeContext';
import { FullTheme } from '@/types/theme';

type Props = {
  value: number;
  onChange: (value: number) => void;
  max?: number;
  size?: number;
};

export function StarRating({ value, onChange, max = 5, size = 36 }: Props) {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={styles.row}>
      {Array.from({ length: max }, (_, index) => {
        const starValue = index + 1;
        const filled = starValue <= value;

        return (
          <Pressable
            key={starValue}
            onPress={() => onChange(starValue)}
            hitSlop={6}
            style={styles.starButton}
          >
            <Ionicons
              name={filled ? 'star' : 'star-outline'}
              size={size}
              color={filled ? theme.brand.primary : theme.text.tertiary}
            />
          </Pressable>
        );
      })}
    </View>
  );
}

const getStyles = (_theme: FullTheme) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      justifyContent: 'center',
      columnGap: 8,
    },
    starButton: {
      padding: 2,
    },
  });
