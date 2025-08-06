import { Feather } from '@expo/vector-icons';
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
  }, []);

  return (
    <PageContainer style={{ padding: 16, paddingBottom: 200 }}>
      <View style={{ rowGap: 10, paddingVertical: 10, marginBottom: 10 }}>
        <AppText style={styles.title}>
          {'¿Cuántos gramos tiene tu antojo?'}
        </AppText>
        <AppText style={styles.subtitle}>
          {'Descubre si estás alimentando músculo, energía... o puro gustito.'}
        </AppText>
      </View>

      <AppText style={{ fontSize: 16, fontWeight: '600', marginBottom: 4 }}>
        {'Selecciona tus alimentos'}
      </AppText>
      <View style={styles.searchRow}>
        <SearchBar
          placeholder="Buscar comida"
          value={query}
          onChangeText={setQuery}
          shouldHideEndIcon={true}
        />
        <TouchableOpacity style={styles.searchButton}>
          <Feather name="chevrons-right" size={22} color={theme.dark100} />
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
          style={{
            padding: 10,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.backgroundInverted,
            borderRadius: 12,
          }}
          onPress={handleOpenCalculateMacros}
        >
          <AppText
            style={{
              color: theme.background,
              fontSize: 17,
              fontWeight: '600',
            }}
          >
            {'Calcular'}
          </AppText>
          <Feather name="play" size={20} color={theme.background} />
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
      columnGap: 4,
      alignItems: 'center',
    },
    searchButton: {
      backgroundColor: theme.primary,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 10,
      height: 43,
      width: 43,
    },
    bottomSheetContainer: {
      padding: 16,
      rowGap: 12,
      paddingBottom: 150,
    },
  });
