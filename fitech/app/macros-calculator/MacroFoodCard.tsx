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
            backgroundColor: theme.card,
            borderWidth: 1,
            borderColor: theme.border,
          },
          isSelected && {
            backgroundColor: theme.successBackground,
            borderColor: theme.successBorder,
            borderWidth: 2,
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
              color: theme.textPrimary,
            }}
          >
            {foodItem?.name}
          </AppText>
          <AppText style={{ fontSize: 15, color: theme.textSecondary }}>
            {foodItem?.description}
          </AppText>
          <View
            style={{
              marginVertical: 10,
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: 8,
              alignItems: 'center',
            }}
          >
            {!!foodItem?.category && (
              <Tag
                icon="restaurant-outline"
                label={foodItem?.category}
                textColor={theme.successText}
                backgroundColor={theme.successBackground}
              />
            )}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: theme.backgroundInput,
                borderWidth: 1,
                borderColor: theme.border,
                paddingVertical: 5,
                paddingHorizontal: 10,
                borderRadius: 999,
              }}
            >
              <AppText
                style={{
                  fontSize: 13,
                  color: theme.textPrimary,
                  fontWeight: '700',
                }}
              >
                {`${foodItem?.macros?.calories} kcal`}
              </AppText>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: theme.backgroundInput,
                borderWidth: 1,
                borderColor: theme.border,
                paddingVertical: 5,
                paddingHorizontal: 10,
                borderRadius: 999,
              }}
            >
              <AppText
                style={{
                  fontSize: 13,
                  color: theme.textPrimary,
                  fontWeight: '700',
                }}
              >
                {`${foodItem?.macros?.proteins} proteína`}
              </AppText>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
