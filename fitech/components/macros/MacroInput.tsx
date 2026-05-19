import { Ionicons } from '@expo/vector-icons';
import React, { useCallback } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { TextInput } from '@/components/TextInput';
import { formStyles } from '@/constants/styles';
import { useMacroFoodItemsContext } from '@/contexts/MacroFoodItemsContext';
import { useTheme } from '@/contexts/ThemeContext';
import { FoodItemDto, SelectedFoodDto } from '@/types/api/types.gen';
import { FullTheme } from '@/types/theme';

type Props = {
  foodItem: FoodItemDto;
  requestItem?: SelectedFoodDto;
};

export default function MacroInput({ foodItem, requestItem }: Props) {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const { onFoodSelection, onRequestChange } = useMacroFoodItemsContext();

  const handleRemoveFoodItem = useCallback(() => {
    foodItem && onFoodSelection(foodItem);
  }, [foodItem, onFoodSelection]);

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: 16,
      }}
    >
      <AppText
        variant="sectionTitle"
        style={{ color: theme.icon.muted, flex: 1 }}
      >
        {foodItem.name}
      </AppText>
      <View style={{ flex: 1, paddingLeft: 30 }}>
        <AppText style={{ color: theme.text.tertiary, marginBottom: 2 }}>
          {'Porciones'}
        </AppText>
        <TextInput
          placeholderTextColor={theme.icon.muted}
          placeholder=""
          keyboardType="numeric"
          style={[styles.input]}
          value={requestItem?.quantity?.toString()}
          onChangeText={(text: string) =>
            foodItem?.id && onRequestChange(foodItem?.id, text)
          }
        />
      </View>
      <TouchableOpacity
        onPress={handleRemoveFoodItem}
        style={{
          backgroundColor: theme.status.error.bg,
          borderRadius: '50%',
          flexGrow: 0,
        }}
      >
        <Ionicons
          name="trash-outline"
          size={24}
          color={theme.status.error.text}
        />
      </TouchableOpacity>
    </View>
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    ...formStyles(theme),
  });
