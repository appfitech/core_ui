import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import { AppText } from '@/components/AppText';
import { MacroFoodCard } from '@/components/macros/MacroFoodCard';
import PageContainer from '@/components/PageContainer';
import { SearchBar } from '@/components/SearchBar';
import { formStyles, textStyles } from '@/constants/styles';
import { useMacroFoodItemsContext } from '@/contexts/MacroFoodItemsContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useDebounce } from '@/hooks/use-debounce';
import { useSearchMacros } from '@/lib/api/queries/use-search-macros';
import { FoodItemDto } from '@/types/api/types.gen';
import { FullTheme } from '@/types/theme';

const LIST_ITEM_GAP = 10;

type HeaderProps = {
  query: string;
  onQueryChange: (q: string) => void;
  onCalculate: () => void;
};

function MacrosSearchHeader({
  query,
  onQueryChange,
  onCalculate,
}: HeaderProps) {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <>
      <AppText style={styles.sectionLabel}>
        {'Selecciona tus alimentos'}
      </AppText>
      <View style={styles.searchRow}>
        <SearchBar
          placeholder="Buscar comida"
          value={query}
          onChangeText={onQueryChange}
          shouldHideEndIcon={true}
          containerStyle={styles.searchBarContainer}
        />
        <TouchableOpacity
          style={styles.searchButton}
          accessibilityRole="button"
        >
          <Ionicons
            name="chevron-forward"
            size={22}
            color={theme.background.app}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.calculateRow}>
        <TouchableOpacity style={styles.calculateButton} onPress={onCalculate}>
          <AppText style={styles.calculateButtonText}>{'Calcular'}</AppText>
          <Ionicons name="play" size={20} color={theme.background.app} />
        </TouchableOpacity>
      </View>
    </>
  );
}

export default function MacrosCalculatorScreen() {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const [query, setQuery] = useState('');
  const { selectedItems, onFoodSelection } = useMacroFoodItemsContext();

  const debouncedQuery = useDebounce(query, 400);
  const trimmedDebounced = debouncedQuery.trim();
  const {
    data: macrosResults,
    isFetching,
    isLoading,
  } = useSearchMacros(trimmedDebounced);
  const router = useRouter();

  const handleOpenCalculateMacros = useCallback(() => {
    router.push('/macros-calculator/calculate');
  }, [router]);

  const selectedIds = useMemo(() => {
    const ids = new Set<number>();
    for (const item of selectedItems) {
      if (item.id != null) ids.add(item.id);
    }
    return ids;
  }, [selectedItems]);

  const selectedIdsKey = useMemo(
    () => [...selectedIds].sort((a, b) => a - b).join(','),
    [selectedIds],
  );

  const listData: FoodItemDto[] =
    trimmedDebounced.length > 0 ? (macrosResults ?? []) : [];

  const renderItem: ListRenderItem<FoodItemDto> = useCallback(
    ({ item }) => (
      <View style={{ marginBottom: LIST_ITEM_GAP }}>
        <MacroFoodCard
          foodItem={item}
          onSelectFood={onFoodSelection}
          isSelected={item.id != null && selectedIds.has(item.id)}
        />
      </View>
    ),
    [onFoodSelection, selectedIds],
  );

  const keyExtractor = useCallback((item: FoodItemDto) => String(item.id), []);

  const listHeader = useCallback(
    () => (
      <MacrosSearchHeader
        query={query}
        onQueryChange={setQuery}
        onCalculate={handleOpenCalculateMacros}
      />
    ),
    [handleOpenCalculateMacros, query],
  );

  const listEmpty = useCallback(() => {
    if (trimmedDebounced.length === 0) {
      return (
        <AppText style={styles.emptyText}>
          Escribe al menos una letra para buscar alimentos.
        </AppText>
      );
    }
    if (isLoading || isFetching) {
      return (
        <View style={styles.emptyWrap}>
          <ActivityIndicator size="large" color={theme.brand.primary} />
        </View>
      );
    }
    return (
      <AppText style={styles.emptyText}>
        No encontramos alimentos para esa búsqueda.
      </AppText>
    );
  }, [
    isFetching,
    isLoading,
    styles.emptyText,
    styles.emptyWrap,
    theme.brand.primary,
    trimmedDebounced.length,
  ]);

  const listFooter = useCallback(() => <View style={{ height: 24 }} />, []);

  return (
    <PageContainer
      title="¿Cuántos gramos tiene tu antojo?"
      subheader="Descubre si estás alimentando músculo, energía... o puro gustito."
      style={styles.pageContent}
      disableScroll
    >
      <FlatList
        data={listData}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={listEmpty}
        ListFooterComponent={listFooter}
        extraData={selectedIdsKey}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        initialNumToRender={6}
        maxToRenderPerBatch={8}
        windowSize={7}
        removeClippedSubviews={Platform.OS === 'android'}
      />
    </PageContainer>
  );
}

const getStyles = (theme: FullTheme) => {
  const text = textStyles(theme);
  return StyleSheet.create({
    ...formStyles(theme),
    pageContent: {
      paddingHorizontal: 0,
      paddingVertical: 0,
      paddingTop: 0,
      paddingBottom: 0,
    },
    list: { flex: 1 },
    listContent: {
      paddingHorizontal: 16,
      paddingTop: 0,
      flexGrow: 1,
    },
    sectionLabel: {
      ...text.bodySemibold,
      marginBottom: 8,
      color: theme.text.primary,
    },
    searchRow: {
      flexDirection: 'row',
      marginBottom: 20,
      columnGap: 8,
      alignItems: 'center',
    },
    searchBarContainer: {
      flex: 1,
      width: 'auto',
      minWidth: 0,
    },
    searchButton: {
      backgroundColor: theme.brand.primary,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 10,
      height: 46,
      width: 46,
      flexShrink: 0,
    },
    calculateRow: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginBottom: 12,
    },
    calculateButton: {
      paddingVertical: 10,
      paddingHorizontal: 12,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.brand.primary,
      borderRadius: 12,
      columnGap: 4,
    },
    calculateButtonText: {
      color: theme.background.app,
      ...text.leadSemibold,
    },
    emptyText: {
      textAlign: 'center',
      color: theme.text.secondary,
      ...text.link,
      paddingVertical: 32,
      paddingHorizontal: 12,
    },
    emptyWrap: {
      paddingVertical: 40,
      alignItems: 'center',
    },
  });
};
