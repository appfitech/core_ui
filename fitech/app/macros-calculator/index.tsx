import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Dropdown } from '@/components/Dropdown';
import { MacroFoodCarouselCard } from '@/components/macros/MacroFoodCarouselCard';
import { MacroSelectedFoodPills } from '@/components/macros/MacroSelectedFoodPills';
import PageContainer from '@/components/PageContainer';
import { SearchBar } from '@/components/SearchBar';
import { TRANSLATIONS } from '@/constants/strings';
import { textStyles } from '@/constants/styles';
import { useMacroFoodItemsContext } from '@/contexts/MacroFoodItemsContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useDebounce } from '@/hooks/use-debounce';
import { useGetFoodCategories } from '@/lib/api/queries/use-get-food-categories';
import { useSearchFoods } from '@/lib/api/queries/use-search-foods';
import { FoodItemDto } from '@/types/api/types.gen';
import { AppTheme } from '@/types/theme';

const CARD_GAP = 12;
const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_WIDTH = Math.min(260, SCREEN_WIDTH * 0.72);
const ALL_CATEGORIES_VALUE = '';

export default function MacrosCalculatorScreen() {
  const { theme } = useTheme();
  const styles = useMemo(() => getStyles(theme), [theme]);
  const { macrosCalculatorScreen: copy } = TRANSLATIONS;

  const [query, setQuery] = useState('');
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const { selectedItems, onFoodSelection } = useMacroFoodItemsContext();

  const debouncedQuery = useDebounce(query, 400);
  const { data: categories = [], isLoading: categoriesLoading } =
    useGetFoodCategories();
  const {
    data: foods = [],
    isFetching,
    isLoading: foodsLoading,
  } = useSearchFoods({
    query: debouncedQuery,
    categoryId,
  });

  const router = useRouter();
  const snapInterval = CARD_WIDTH + CARD_GAP;
  const isFoodsLoading = foodsLoading || isFetching;

  const categoryOptions = useMemo(
    () => [
      { label: copy.categoryPlaceholder, value: ALL_CATEGORIES_VALUE },
      ...categories
        .filter((cat) => cat.id != null && cat.name)
        .map((cat) => ({
          label: cat.name!,
          value: String(cat.id),
        })),
    ],
    [categories, copy.categoryPlaceholder],
  );

  const selectedIds = useMemo(() => {
    const ids = new Set<number>();
    for (const item of selectedItems) {
      if (item.id != null) ids.add(item.id);
    }
    return ids;
  }, [selectedItems]);

  const handleOpenCalculate = useCallback(() => {
    router.push('/macros-calculator/calculate');
  }, [router]);

  const handleCategoryChange = useCallback((value: string) => {
    if (value === '' || value === ALL_CATEGORIES_VALUE) {
      setCategoryId(null);
    } else {
      setCategoryId(Number(value));
    }
  }, []);

  const handleAddFood = useCallback(
    (item: FoodItemDto) => {
      onFoodSelection(item);
    },
    [onFoodSelection],
  );

  const renderCarouselCard = useCallback(
    (item: FoodItemDto) => (
      <MacroFoodCarouselCard
        foodItem={item}
        width={CARD_WIDTH}
        isSelected={item.id != null && selectedIds.has(item.id)}
        onAdd={handleAddFood}
      />
    ),
    [handleAddFood, selectedIds],
  );

  const footer = (
    <Button
      label={copy.viewMacrosButton}
      onPress={handleOpenCalculate}
      disabled={selectedItems.length === 0}
      animated={false}
      style={styles.footerButton}
    />
  );

  return (
    <PageContainer
      title={copy.title}
      subheader={copy.subheader}
      style={styles.pageContent}
      disableScroll
      includeTabBarPadding={false}
      hasBottomPadding={false}
      footer={footer}
    >
      <View style={styles.filtersBlock}>
        <Dropdown
          label={copy.categoryLabel}
          placeholder={copy.categoryPlaceholder}
          options={categoryOptions}
          value={categoryId != null ? String(categoryId) : ALL_CATEGORIES_VALUE}
          onChange={handleCategoryChange}
          required={false}
          clearable
          disabled={categoriesLoading}
        />
        <SearchBar
          placeholder={copy.searchPlaceholder}
          value={query}
          onChangeText={setQuery}
          shouldHideEndIcon
          containerStyle={styles.searchBar}
        />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <AppText style={styles.sectionLabel}>{copy.searchResults}</AppText>
          {isFoodsLoading ? (
            <View style={styles.loadingWrap}>
              <ActivityIndicator size="large" color={theme.brand.primary} />
            </View>
          ) : foods.length === 0 ? (
            <AppText style={styles.hintText}>{copy.searchEmpty}</AppText>
          ) : (
            <>
              <FlatList
                data={foods}
                keyExtractor={(item, index) =>
                  item.id != null ? String(item.id) : `food-${index}`
                }
                horizontal
                showsHorizontalScrollIndicator={false}
                decelerationRate="fast"
                snapToInterval={snapInterval}
                snapToAlignment="start"
                disableIntervalMomentum
                contentContainerStyle={styles.carouselContent}
                renderItem={({ item }) => renderCarouselCard(item)}
              />
            </>
          )}
        </View>

        {selectedItems.length > 0 ? (
          <View style={styles.section}>
            <AppText style={styles.sectionLabel}>
              {`${copy.selectedTitle} (${selectedItems.length})`}
            </AppText>
            <MacroSelectedFoodPills
              items={selectedItems}
              onRemove={handleAddFood}
            />
          </View>
        ) : null}
      </ScrollView>
    </PageContainer>
  );
}

const getStyles = (theme: AppTheme) => {
  const text = textStyles(theme);

  return StyleSheet.create({
    pageContent: {
      paddingHorizontal: 0,
      paddingBottom: 0,
    },
    filtersBlock: {
      paddingHorizontal: 16,
      paddingBottom: 12,
      rowGap: 10,
    },
    searchBar: {
      width: '100%',
    },
    scroll: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: 16,
      paddingBottom: 16,
      flexGrow: 1,
    },
    section: {
      marginBottom: 20,
      rowGap: 10,
    },
    sectionLabel: {
      ...text.smallSemibold,
      color: theme.text.secondary,
    },
    carouselContent: {
      columnGap: CARD_GAP,
      paddingRight: 4,
    },
    hintText: {
      ...text.small,
      color: theme.text.secondary,
      textAlign: 'center',
      paddingVertical: 16,
      paddingHorizontal: 8,
    },
    loadingWrap: {
      paddingVertical: 40,
      alignItems: 'center',
    },
    footerButton: {
      width: '100%',
    },
  });
};
