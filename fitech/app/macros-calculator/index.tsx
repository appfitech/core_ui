import { Feather } from '@expo/vector-icons';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import React, { useCallback, useRef, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { HEADING_STYLES, SHARED_STYLES } from '@/constants/shared_styles';
import { useTheme } from '@/contexts/ThemeContext';
import {
  FoodItemDto,
  MacroCalculationResponseDto,
  SelectedFoodDto,
} from '@/types/api/types.gen';
import { FullTheme } from '@/types/theme';

import { useSearchMacros } from '../api/queries/use-search-macros';
import { AppText } from '../components/AppText';
import PageContainer from '../components/PageContainer';
import { SearchBar } from '../components/SearchBar';
import { Tag } from '../components/Tag';
import { useCalculateMacros } from '../api/mutations/use-calculate-macros';

export default function MacrosCalculatorScreen() {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<FoodItemDto[]>([]);
  const [request, setRequest] = useState<SelectedFoodDto[]>([]);
  const [calculation, setCalculation] = useState<MacroCalculationResponseDto>();

  const { data: macrosResults } = useSearchMacros(query);
  const { mutate: calculateMacros } = useCalculateMacros();

  const openBottomSheet = () => {
    bottomSheetModalRef.current?.present();
  };

  const handleAddMacro = useCallback(
    (itemId: number) => () => {
      const existing = selected.find((item) => item.id === itemId);
      if (existing) {
        setSelected((prev) => prev.filter((item) => item.id !== itemId));
        setRequest((prev) => prev.filter((item) => item.foodId !== itemId));
      } else {
        const newItem = macrosResults?.find((item) => item.id === itemId);
        if (newItem) {
          setSelected((prev) => [...prev, newItem]);
          setRequest((prev) => [...prev, { foodId: itemId, quantity: 1 }]);
        }
        openBottomSheet();
      }
    },
    [macrosResults, selected],
  );

  const handleCalculateMacros = useCallback(() => {
    calculateMacros(
      { selectedFoods: request },
      {
        onSuccess: (response) => {
          setCalculation(response);
        },
      },
    );
  }, []);

  const handleChange = useCallback(
    (foodId: number) => (text: string) => {
      if (isNaN(Number(text)) && !!text) {
        return;
      }

      setRequest((prev) =>
        prev.map((item) =>
          item.foodId === foodId
            ? { ...item, quantity: !!text ? Number(text) : text }
            : item,
        ),
      );
    },
    [],
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <PageContainer
          hasBackButton={false}
          style={{ padding: 16, paddingBottom: 200 }}
        >
          {/* Header */}
          <View style={{ rowGap: 10, paddingVertical: 10, marginBottom: 10 }}>
            <AppText style={styles.title}>
              {'¿Cuántos gramos tiene tu antojo?'}
            </AppText>
            <AppText style={styles.subtitle}>
              {
                'Descubre si estás alimentando músculo, energía... o puro gustito.'
              }
            </AppText>
          </View>

          {/* Searchbar */}
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

          {/* Calculate macros, open bottom sheet */}
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
              onPress={openBottomSheet}
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

          {/* Macros results */}
          <ScrollView contentContainerStyle={{ rowGap: 10 }}>
            {macrosResults?.map((macroItem) => (
              <TouchableOpacity
                key={macroItem?.id}
                onPress={handleAddMacro(macroItem?.id)}
              >
                <View
                  style={{
                    borderRadius: 20,
                    overflow: 'hidden',
                    backgroundColor: theme.dark100,
                  }}
                >
                  <Image
                    source={{ uri: macroItem?.imageUrl }}
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
                      {macroItem?.name}
                    </AppText>
                    <AppText style={{ fontSize: 15, color: theme.dark900 }}>
                      {macroItem?.description}
                    </AppText>
                    {macroItem?.category && (
                      <Tag
                        icon="coffee"
                        label={macroItem?.category}
                        textColor={theme.successText}
                        backgroundColor={theme.successBackground}
                      />
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
                        {`${macroItem?.macros?.calories} kcal`}
                      </AppText>
                      <AppText
                        style={{
                          fontSize: 14,
                          color: theme.green800,
                          fontWeight: '600',
                        }}
                      >
                        {`${macroItem?.macros?.proteins} proteína`}
                      </AppText>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </PageContainer>

        {/* Calculate Macros Modal */}
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={0}
          enableDynamicSizing
          backgroundStyle={{
            backgroundColor: theme.backgroundInverted,
          }}
          handleIndicatorStyle={{ backgroundColor: theme.dark200 }}
        >
          <BottomSheetView style={styles.bottomSheetContainer}>
            <AppText
              style={{
                color: theme.dark100,
                fontSize: 19,
                fontWeight: '600',
                marginBottom: 10,
              }}
            >
              {'Calcula tus macros'}
            </AppText>
            {!selected.length && (
              <AppText style={{ fontSize: 14, color: theme.dark200 }}>
                {
                  'Elige tus comidas favoritas de la lista para ver sus macronutrientes'
                }
              </AppText>
            )}
            <View
              style={{
                gap: 10,
              }}
            >
              {selected.map((selectedItem) => {
                const quantity = request?.find(
                  (item) => item.foodId === selectedItem?.id,
                )?.quantity;

                return (
                  <View
                    key={selectedItem.id}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      columnGap: 16,
                    }}
                  >
                    <AppText
                      style={{
                        color: theme.dark100,
                        fontSize: 18,
                        fontWeight: '400',
                        flex: 1,
                      }}
                    >
                      {selectedItem.name}
                    </AppText>
                    <View style={{ flex: 1, paddingLeft: 30 }}>
                      <AppText
                        style={{ color: theme.dark100, marginBottom: 2 }}
                      >
                        {'Porciones'}
                      </AppText>
                      <TextInput
                        placeholderTextColor={theme.dark700}
                        placeholder=""
                        keyboardType="numeric"
                        style={[styles.input]}
                        value={quantity?.toString()}
                        onChangeText={handleChange(selectedItem?.id)}
                      />
                    </View>
                    <TouchableOpacity
                      onPress={handleAddMacro(selectedItem.id)}
                      style={{
                        backgroundColor: theme.errorBackground,
                        borderRadius: '50%',
                        flexGrow: 0,
                      }}
                    >
                      <Feather
                        name="x-circle"
                        size={24}
                        color={theme.errorText}
                      />
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
            {!!selected.length && (
              <View style={{ alignItems: 'flex-end', marginTop: 10 }}>
                <TouchableOpacity
                  style={{
                    padding: 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: theme.primary,
                    borderRadius: 12,
                    columnGap: 10,
                  }}
                  onPress={handleCalculateMacros}
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
            )}
            <View
              style={{
                backgroundColor: theme.background,
                padding: 14,
                borderRadius: 12,
                marginTop: 20,
                alignItems: 'center',
                rowGap: 10,
              }}
            >
              <AppText
                style={{
                  color: theme.infoText,
                  fontSize: 20,
                  fontWeight: 900,
                }}
              >
                {'Resumen nutricional'}
              </AppText>
              <View
                style={{
                  backgroundColor: theme.successBackground,
                  borderRadius: '50%',
                  padding: 30,
                  alignItems: 'center',
                }}
              >
                <AppText
                  style={{
                    color: theme.successText,
                    fontSize: 40,
                    fontWeight: 900,
                  }}
                >
                  {calculation?.totalMacros?.calories}
                </AppText>
                <AppText
                  style={{
                    color: theme.successText,
                    fontSize: 18,
                  }}
                >
                  {'kcal'}
                </AppText>
              </View>
              <View style={{ width: '100%', rowGap: 4 }}>
                {Object.keys(calculation?.totalMacros ?? []).map((macroKey) => (
                  <View
                    key={macroKey}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}
                  >
                    <AppText
                      style={{
                        fontSize: 17,
                        color: theme.dark500,
                        fontWeight: 500,
                        paddingLeft: 20,
                      }}
                    >
                      {macroKey}
                    </AppText>
                    <AppText
                      style={{
                        fontSize: 17,
                        color: theme.infoText,
                        fontWeight: 500,
                        paddingLeft: 20,
                      }}
                    >{`${calculation?.totalMacros?.[macroKey] ?? 0} g`}</AppText>
                  </View>
                ))}
              </View>
            </View>
          </BottomSheetView>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
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
