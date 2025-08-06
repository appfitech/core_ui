import React, { useCallback } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';

import { useTheme } from '@/contexts/ThemeContext';
import { FoodItemDto } from '@/types/api/types.gen';

import { AppText } from '../components/AppText';
import { Tag } from '../components/Tag';

type Props = {
  foodItem: FoodItemDto;
  onSelectFood: (foodItem: FoodItemDto) => void;
  isSelected?: boolean;
};

export function MacroFoodCard({
  foodItem,
  onSelectFood,
  isSelected = false,
}: Props) {
  const { theme } = useTheme();

  const handleSelect = useCallback(() => {
    if (!foodItem?.id) {
      return;
    }

    onSelectFood(foodItem);
  }, [foodItem]);

  return (
    <TouchableOpacity key={foodItem?.id} onPress={handleSelect}>
      <View
        style={[
          {
            borderRadius: 20,
            overflow: 'hidden',
            backgroundColor: theme.dark100,
          },
          isSelected && {
            backgroundColor: theme.successBackground,
            borderColor: theme.successBorder,
            borderWidth: 5,
          },
        ]}
      >
        <Image
          source={{ uri: foodItem?.imageUrl }}
          style={{ width: '100%', height: 100 }}
          resizeMode="cover"
        />
        <View style={{ padding: 16, rowGap: 4 }}>
          <AppText
            style={{
              fontSize: 17,
              fontWeight: '500',
              color: theme.backgroundInverted,
            }}
          >
            {foodItem?.name}
          </AppText>
          <AppText style={{ fontSize: 15, color: theme.dark900 }}>
            {foodItem?.description}
          </AppText>
          {foodItem?.category && (
            <View style={{ marginVertical: 10 }}>
              <Tag
                icon="coffee"
                label={foodItem?.category}
                textColor={theme.successText}
                backgroundColor={theme.successBackground}
              />
            </View>
          )}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <AppText
              style={{
                fontSize: 14,
                color: theme.green800,
                fontWeight: '600',
              }}
            >
              {`${foodItem?.macros?.calories} kcal`}
            </AppText>
            <AppText
              style={{
                fontSize: 14,
                color: theme.green800,
                fontWeight: '600',
              }}
            >
              {`${foodItem?.macros?.proteins} proteína`}
            </AppText>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
