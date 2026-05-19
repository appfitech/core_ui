import React, { memo, useCallback } from 'react';
import { Image, Platform, TouchableOpacity, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { textStyles } from '@/constants/styles';
import { Tag } from '@/components/Tag';
import { useTheme } from '@/contexts/ThemeContext';
import { FoodItemDto } from '@/types/api/types.gen';

type Props = {
  foodItem: FoodItemDto;
  onSelectFood: (foodItem: FoodItemDto) => void;
  isSelected?: boolean;
};

function MacroFoodCardInner({
  foodItem,
  onSelectFood,
  isSelected = false,
}: Props) {
  const { theme } = useTheme();
  const text = textStyles(theme);

  const handleSelect = useCallback(() => {
    if (!foodItem?.id) {
      return;
    }

    onSelectFood(foodItem);
  }, [foodItem, onSelectFood]);

  return (
    <TouchableOpacity onPress={handleSelect} activeOpacity={0.85}>
      <View
        style={[
          {
            borderRadius: 20,
            overflow: 'hidden',
            backgroundColor: theme.background.card,
            borderWidth: 1,
            borderColor: theme.border.default,
          },
          isSelected && {
            backgroundColor: theme.status.success.bg,
            borderColor: theme.status.success.border,
            borderWidth: 2,
          },
        ]}
      >
        <Image
          source={{ uri: foodItem?.imageUrl }}
          style={{ width: '100%', height: 100 }}
          resizeMode="cover"
          resizeMethod={Platform.OS === 'android' ? 'resize' : undefined}
        />
        <View style={{ padding: 16, rowGap: 4 }}>
          <AppText
            style={{
              ...text.lead,
              color: theme.text.primary,
            }}
            numberOfLines={2}
          >
            {foodItem?.name}
          </AppText>
          <AppText
            variant="subheader"
            style={{ color: theme.text.secondary }}
            numberOfLines={2}
          >
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
                textColor={theme.status.success.text}
                backgroundColor={theme.status.success.bg}
              />
            )}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: theme.background.input,
                borderWidth: 1,
                borderColor: theme.border.default,
                paddingVertical: 5,
                paddingHorizontal: 10,
                borderRadius: 999,
              }}
            >
              <AppText
                style={{ ...text.nav, color: theme.text.primary }}
              >
                {`${foodItem?.macros?.calories} kcal`}
              </AppText>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: theme.background.input,
                borderWidth: 1,
                borderColor: theme.border.default,
                paddingVertical: 5,
                paddingHorizontal: 10,
                borderRadius: 999,
              }}
            >
              <AppText
                style={{ ...text.nav, color: theme.text.primary }}
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

export const MacroFoodCard = memo(MacroFoodCardInner);
