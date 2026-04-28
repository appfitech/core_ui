import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { HEADING_STYLES, SHARED_STYLES } from '@/constants/shared_styles';
import { useMacroFoodItemsContext } from '@/contexts/MacroFoodItemsContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useDebounce } from '@/hooks/use-debounce';
import { FullTheme } from '@/types/theme';

import { useSearchMacros } from '../api/queries/use-search-macros';
import { AppText } from '../components/AppText';
import PageContainer from '../components/PageContainer';
import { SearchBar } from '../components/SearchBar';
import { MacroFoodCard } from './MacroFoodCard';

export default function MacrosCalculatorScreen() {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const [query, setQuery] = useState('');
  const { selectedItems, onFoodSelection } = useMacroFoodItemsContext();

  const debouncedQuery = useDebounce(query, 500);
  const { data: macrosResults } = useSearchMacros(debouncedQuery);
  const router = useRouter();

  const handleOpenCalculateMacros = useCallback(() => {
    router.push('/macros-calculator/calculate');
  }, [router]);

  return (
    <PageContainer
      title="¿Cuántos gramos tiene tu antojo?"
      subheader="Descubre si estás alimentando músculo, energía... o puro gustito."
      style={{ padding: 16, paddingBottom: 200 }}
    >
      <AppText
        style={{
          fontSize: 16,
          fontWeight: '700',
          marginBottom: 8,
          color: theme.textPrimary,
        }}
      >
        {'Selecciona tus alimentos'}
      </AppText>
      <View style={styles.searchRow}>
        <SearchBar
          placeholder="Buscar comida"
          value={query}
          onChangeText={setQuery}
          shouldHideEndIcon={true}
          containerStyle={styles.searchBarContainer}
        />
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="chevron-forward" size={22} color={theme.background} />
        </TouchableOpacity>
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
          marginBottom: 12,
        }}
      >
        <TouchableOpacity
          style={styles.calculateButton}
          onPress={handleOpenCalculateMacros}
        >
          <AppText style={styles.calculateButtonText}>{'Calcular'}</AppText>
          <Ionicons name="play" size={20} color={theme.background} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ rowGap: 10 }}>
        {macrosResults?.map((macroItem) => (
          <MacroFoodCard
            key={macroItem?.id}
            foodItem={macroItem}
            onSelectFood={onFoodSelection}
            isSelected={
              !!selectedItems.find((item) => item.id === macroItem?.id)
            }
          />
        ))}
      </ScrollView>
    </PageContainer>
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    ...HEADING_STYLES(theme),
    ...SHARED_STYLES(theme),
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
      backgroundColor: theme.primary,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 10,
      height: 46,
      width: 46,
      flexShrink: 0,
    },
    calculateButton: {
      paddingVertical: 10,
      paddingHorizontal: 12,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.primary,
      borderRadius: 12,
      columnGap: 4,
    },
    calculateButtonText: {
      color: theme.background,
      fontSize: 17,
      fontWeight: '600',
    },
    bottomSheetContainer: {
      padding: 16,
      rowGap: 12,
      paddingBottom: 150,
    },
  });
