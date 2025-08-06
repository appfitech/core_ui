import { Feather } from '@expo/vector-icons';
import React, { useCallback } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

import { HEADING_STYLES, SHARED_STYLES } from '@/constants/shared_styles';
import { useMacroFoodItemsContext } from '@/contexts/MacroFoodItemsContext';
import { useTheme } from '@/contexts/ThemeContext';
import { FoodItemDto, SelectedFoodDto } from '@/types/api/types.gen';
import { FullTheme } from '@/types/theme';

import { AppText } from '../../components/AppText';

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
  }, [foodItem]);

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: 16,
      }}
    >
      <AppText
        style={{
          color: theme.dark700,
          fontSize: 18,
          fontWeight: '400',
          flex: 1,
        }}
      >
        {foodItem.name}
      </AppText>
      <View style={{ flex: 1, paddingLeft: 30 }}>
        <AppText style={{ color: theme.dark400, marginBottom: 2 }}>
          {'Porciones'}
        </AppText>
        <TextInput
          placeholderTextColor={theme.dark700}
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
          backgroundColor: theme.errorBackground,
          borderRadius: '50%',
          flexGrow: 0,
        }}
      >
        <Feather name="trash-2" size={24} color={theme.errorText} />
      </TouchableOpacity>
    </View>
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    ...HEADING_STYLES(theme),
    ...SHARED_STYLES(theme),
  });
