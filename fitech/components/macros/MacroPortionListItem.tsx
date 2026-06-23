import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { TextInput } from '@/components/TextInput';
import { textStyles } from '@/constants/styles';
import { useTheme } from '@/contexts/ThemeContext';
import { getFoodUnitTypeLabel } from '@/lib/macros/unit-type';
import { FoodItemDto } from '@/types/api/types.gen';
import { AppTheme } from '@/types/theme';

const PORTION_INPUT_WIDTH = 64;

type Props = {
  foodItem: FoodItemDto;
  portionValue: string;
  onRemove: (foodItem: FoodItemDto) => void;
  onQuantityChange: (foodId: number, text: string) => void;
  isLast?: boolean;
};

export function MacroPortionListItem({
  foodItem,
  portionValue,
  onRemove,
  onQuantityChange,
  isLast = false,
}: Props) {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const unitLabel = useMemo(
    () => getFoodUnitTypeLabel(foodItem.unitType, foodItem.unitName),
    [foodItem.unitName, foodItem.unitType],
  );

  const handleRemove = useCallback(() => {
    onRemove(foodItem);
  }, [foodItem, onRemove]);

  return (
    <View style={[styles.row, !isLast && styles.rowBorder]}>
      <View style={styles.main}>
        <AppText style={styles.name} numberOfLines={2}>
          {foodItem.name}
        </AppText>
        {unitLabel ? (
          <AppText style={styles.unitType}>{unitLabel}</AppText>
        ) : null}
      </View>

      <View style={styles.portionWrap}>
        <TextInput
          placeholder="1"
          keyboardType="decimal-pad"
          value={portionValue}
          onChangeText={(text) =>
            foodItem.id != null && onQuantityChange(foodItem.id, text)
          }
          style={styles.portionInput}
        />
      </View>

      <Pressable
        onPress={handleRemove}
        style={styles.removeBtn}
        accessibilityRole="button"
        accessibilityLabel="Quitar alimento"
        hitSlop={6}
      >
        <Ionicons name="close" size={18} color={theme.status.error.text} />
      </Pressable>
    </View>
  );
}

const getStyles = (theme: AppTheme) => {
  const text = textStyles(theme);

  return StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: 10,
      paddingVertical: 12,
      minHeight: 56,
    },
    rowBorder: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.border.default,
    },
    main: {
      flex: 1,
      minWidth: 0,
      rowGap: 2,
    },
    name: {
      ...text.smallMedium,
      color: theme.text.primary,
    },
    unitType: {
      ...text.caption,
      color: theme.text.secondary,
    },
    portionWrap: {
      width: PORTION_INPUT_WIDTH,
    },
    portionInput: {
      ...text.small,
      textAlign: 'center',
      paddingVertical: 0,
      minHeight: 40,
    },
    removeBtn: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: theme.status.error.bg,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
};
