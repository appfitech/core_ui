import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { memo, useCallback } from 'react';
import { ImageBackground, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Tag } from '@/components/Tag';
import { TRANSLATIONS } from '@/constants/strings';
import { textStyles } from '@/constants/styles';
import { useTheme } from '@/contexts/ThemeContext';
import { FoodItemDto } from '@/types/api/types.gen';
import { AppTheme } from '@/types/theme';

const CARD_MIN_HEIGHT = 268;

type Props = {
  foodItem: FoodItemDto;
  width: number;
  isSelected?: boolean;
  onAdd: (foodItem: FoodItemDto) => void;
};

const { macrosCalculatorScreen: copy } = TRANSLATIONS;

function MacroFoodCarouselCardInner({
  foodItem,
  width,
  isSelected = false,
  onAdd,
}: Props) {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const handleAdd = useCallback(() => {
    onAdd(foodItem);
  }, [foodItem, onAdd]);

  const calories = foodItem.macros?.calories ?? 0;
  const fats = foodItem.macros?.fats ?? 0;
  const carbs = foodItem.macros?.carbohydrates ?? 0;
  const proteins = foodItem.macros?.proteins ?? 0;
  const categoryLabel = foodItem.category?.trim();

  const imageLayer = foodItem.imageUrl ? (
    <ImageBackground
      source={{ uri: foodItem.imageUrl }}
      style={StyleSheet.absoluteFillObject}
      imageStyle={styles.image}
      resizeMode="cover"
    >
      <LinearGradient
        colors={[
          'rgba(0,0,0,0)',
          'rgba(0,0,0,0.15)',
          'rgba(0,0,0,0.72)',
          'rgba(0,0,0,0.94)',
        ]}
        locations={[0, 0.4, 0.72, 1]}
        style={StyleSheet.absoluteFillObject}
      />
    </ImageBackground>
  ) : (
    <View style={[StyleSheet.absoluteFillObject, styles.placeholderBg]}>
      <LinearGradient
        colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.45)']}
        locations={[0, 1]}
        style={StyleSheet.absoluteFillObject}
      />
    </View>
  );

  return (
    <View style={[styles.card, { width }, isSelected && styles.cardSelected]}>
      <View style={styles.mediaLayer} pointerEvents="none">
        {imageLayer}
        {!foodItem.imageUrl ? (
          <Ionicons
            name="restaurant-outline"
            size={48}
            color={theme.text.tertiary}
            style={styles.placeholderIcon}
          />
        ) : null}
      </View>

      <View style={styles.foreground}>
        <View style={styles.topBadges}>
          {categoryLabel ? (
            <Tag
              label={categoryLabel}
              backgroundColor={theme.status.info.bgStrong}
              textColor={theme.status.info.text}
              style={styles.categoryTag}
            />
          ) : (
            <View />
          )}
          <Tag
            label={`${calories} kcal`}
            backgroundColor={theme.status.warning.bgStrong}
            textColor={theme.status.warning.text}
            style={styles.caloriesTag}
          />
        </View>

        <View style={styles.contentArea}>
          <LinearGradient
            colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.9)']}
            locations={[0, 1]}
            style={styles.contentScrim}
            pointerEvents="none"
          />
          <View style={styles.content}>
            <AppText style={styles.title} numberOfLines={2}>
              {foodItem.name}
            </AppText>

            <View style={styles.macrosRow}>
              <MacroCell label="Grasas" value={`${fats}g`} styles={styles} />
              <MacroCell label="Carb." value={`${carbs}g`} styles={styles} />
              <MacroCell label="Prot." value={`${proteins}g`} styles={styles} />
            </View>

            <Pressable
              onPress={handleAdd}
              style={({ pressed }) => [
                styles.addButton,
                isSelected && styles.addButtonSelected,
                pressed && styles.addButtonPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel={isSelected ? copy.removeFood : copy.addFood}
            >
              <Ionicons
                name={isSelected ? 'checkmark-circle' : 'add-circle-outline'}
                size={18}
                color={isSelected ? theme.background.app : theme.brand.primary}
              />
              <AppText
                style={[
                  styles.addButtonText,
                  isSelected && styles.addButtonTextSelected,
                ]}
              >
                {isSelected ? copy.addedFood : copy.addFood}
              </AppText>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

function MacroCell({
  label,
  value,
  styles,
}: {
  label: string;
  value: string;
  styles: ReturnType<typeof getStyles>;
}) {
  return (
    <View style={styles.macroCell}>
      <AppText style={styles.macroLabel}>{label}</AppText>
      <AppText style={styles.macroValue}>{value}</AppText>
    </View>
  );
}

export const MacroFoodCarouselCard = memo(MacroFoodCarouselCardInner);

const getStyles = (theme: AppTheme) => {
  const text = textStyles(theme);

  return StyleSheet.create({
    card: {
      minHeight: CARD_MIN_HEIGHT,
      borderRadius: 20,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: theme.border.default,
    },
    cardSelected: {
      borderColor: theme.brand.primary,
      borderWidth: 2,
    },
    mediaLayer: {
      ...StyleSheet.absoluteFillObject,
    },
    image: {
      borderRadius: 20,
    },
    placeholderBg: {
      backgroundColor: theme.background.input,
    },
    placeholderIcon: {
      position: 'absolute',
      alignSelf: 'center',
      top: '28%',
    },
    foreground: {
      flex: 1,
      minHeight: CARD_MIN_HEIGHT,
      justifyContent: 'space-between',
    },
    topBadges: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      columnGap: 8,
      paddingTop: 12,
      paddingHorizontal: 12,
    },
    categoryTag: {
      flexShrink: 1,
      maxWidth: '58%',
    },
    caloriesTag: {
      flexShrink: 0,
    },
    contentArea: {
      position: 'relative',
      paddingTop: 28,
    },
    contentScrim: {
      ...StyleSheet.absoluteFillObject,
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
    },
    content: {
      paddingHorizontal: 14,
      paddingBottom: 14,
      zIndex: 1,
    },
    title: {
      ...text.bodySemibold,
      color: theme.text.primary,
      marginBottom: 10,
      minHeight: 40,
    },
    macrosRow: {
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'space-between',
      columnGap: 6,
      marginBottom: 12,
    },
    macroCell: {
      flex: 1,
      alignItems: 'center',
      rowGap: 2,
    },
    macroLabel: {
      ...text.caption,
      color: theme.text.secondary,
    },
    macroValue: {
      ...text.smallSemibold,
      color: theme.text.primary,
    },
    addButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      columnGap: 6,
      paddingVertical: 8,
      paddingHorizontal: 14,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: theme.brand.primary,
      backgroundColor: 'rgba(0,0,0,0.35)',
      width: '100%',
    },
    addButtonSelected: {
      backgroundColor: theme.brand.primary,
      borderColor: theme.brand.primary,
    },
    addButtonPressed: {
      opacity: 0.88,
    },
    addButtonText: {
      ...text.smallSemibold,
      color: theme.brand.primaryLight,
    },
    addButtonTextSelected: {
      color: theme.background.app,
    },
  });
};
