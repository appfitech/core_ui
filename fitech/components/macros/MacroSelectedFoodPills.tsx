import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { textStyles } from '@/constants/styles';
import { useTheme } from '@/contexts/ThemeContext';
import { FoodItemDto } from '@/types/api/types.gen';
import { AppTheme } from '@/types/theme';

type Props = {
  items: FoodItemDto[];
  onRemove: (item: FoodItemDto) => void;
};

export function MacroSelectedFoodPills({ items, onRemove }: Props) {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={styles.wrap}>
      {items.map((item) => (
        <Pressable
          key={item.id ?? item.name}
          onPress={() => onRemove(item)}
          style={({ pressed }) => [styles.pill, pressed && styles.pillPressed]}
          accessibilityRole="button"
          accessibilityLabel={`Quitar ${item.name}`}
        >
          <AppText style={styles.pillText} numberOfLines={1}>
            {item.name}
          </AppText>
          <Ionicons name="close" size={16} color={theme.brand.primary} />
        </Pressable>
      ))}
    </View>
  );
}

const getStyles = (theme: AppTheme) => {
  const text = textStyles(theme);

  return StyleSheet.create({
    wrap: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    pill: {
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: 6,
      maxWidth: '100%',
      paddingVertical: 8,
      paddingLeft: 12,
      paddingRight: 8,
      borderRadius: 999,
      backgroundColor: theme.brand.primarySoft,
      borderWidth: 1,
      borderColor: theme.brand.primary,
    },
    pillPressed: {
      opacity: 0.85,
    },
    pillText: {
      ...text.smallSemibold,
      color: theme.brand.primary,
      flexShrink: 1,
    },
  });
};
