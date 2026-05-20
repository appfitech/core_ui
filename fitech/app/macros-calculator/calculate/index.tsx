import { Ionicons } from '@expo/vector-icons';
import React, { useCallback } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { AppText } from '@/components/AppText';
import MacroInput from '@/components/macros/MacroInput';
import PageContainer from '@/components/PageContainer';
import { formStyles, textStyles } from '@/constants/styles';
import { useMacroFoodItemsContext } from '@/contexts/MacroFoodItemsContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useCalculateMacros } from '@/lib/api/mutations/use-calculate-macros';
import { MacroNutrientsDto } from '@/types/api/types.gen';
import { AppTheme } from '@/types/theme';

const MACRO_GRAM_KEYS = [
  'proteins',
  'carbohydrates',
  'fats',
] as const satisfies readonly (keyof MacroNutrientsDto)[];

export default function MacrosCalculatorCalculateScreen() {
  const { theme } = useTheme();
  const text = textStyles(theme);
  const styles = getStyles(theme);
  const { selectedItems, foodItemRequest, calculation, setCalculation } =
    useMacroFoodItemsContext();

  const { mutate: calculateMacros } = useCalculateMacros();

  const handleCalculateMacros = useCallback(() => {
    calculateMacros(
      { selectedFoods: foodItemRequest },
      {
        onSuccess: (response) => {
          setCalculation(response);
        },
      },
    );
  }, [foodItemRequest, calculateMacros, setCalculation]);

  return (
    <PageContainer
      title="¿Cuánto comiste?"
      subheader="Ajusta las porciones para obtener tu desglose de macros."
      style={{ padding: 16, paddingBottom: 200 }}
    >
      <View
        style={{
          gap: 10,
          marginTop: 30,
        }}
      >
        {!selectedItems.length && (
          <View style={styles.banner}>
            <AppText style={styles.bannerLabel}>
              <Ionicons name="alert-circle-outline" size={20} />
              &nbsp;
              {
                'Todavía no elegiste ningún alimento. Agrega uno para calcular tus macros.'
              }
            </AppText>
          </View>
        )}
        {selectedItems.map((selectedItem) => {
          const requestItem = foodItemRequest?.find(
            (item) => item.foodId === selectedItem?.id,
          );

          return (
            <MacroInput
              key={selectedItem?.id}
              foodItem={selectedItem}
              requestItem={requestItem}
            />
          );
        })}
      </View>
      {!!selectedItems.length && (
        <View style={{ alignItems: 'flex-end', marginTop: 10 }}>
          <TouchableOpacity
            style={{
              padding: 10,
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: theme.brand.primary,
              borderRadius: 12,
              columnGap: 10,
              marginTop: 30,
            }}
            onPress={handleCalculateMacros}
          >
            <AppText
              style={{
                color: theme.background.app,
                ...text.leadSemibold,
              }}
            >
              {'Mostrar resultados'}
            </AppText>
            <Ionicons name="play" size={20} color={theme.background.app} />
          </TouchableOpacity>
        </View>
      )}
      {!!selectedItems.length && !!calculation && (
        <View
          style={{
            backgroundColor: theme.background.app,
            padding: 14,
            borderRadius: 12,
            marginTop: 20,
            alignItems: 'center',
            rowGap: 10,
          }}
        >
          <AppText
            style={{
              color: theme.status.info.text,
              ...text.sectionTitle,
            }}
          >
            {'Resumen nutricional'}
          </AppText>
          <View
            style={{
              backgroundColor: theme.status.success.bg,
              borderRadius: '50%',
              padding: 30,
              alignItems: 'center',
            }}
          >
            <AppText
              style={{
                color: theme.status.success.text,
                ...text.display,
              }}
            >
              {calculation?.totalMacros?.calories}
            </AppText>
            <AppText
              style={{
                color: theme.status.success.text,
                ...text.sectionTitle,
              }}
            >
              {'kcal'}
            </AppText>
          </View>
          <View style={{ width: '100%', rowGap: 4 }}>
            {MACRO_GRAM_KEYS.map((macroKey) => (
              <View
                key={macroKey}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <AppText
                  style={{
                    ...text.lead,
                    color: theme.text.disabled,
                    paddingLeft: 20,
                  }}
                >
                  {macroKey}
                </AppText>
                <AppText
                  style={{
                    ...text.lead,
                    color: theme.status.info.text,
                    paddingLeft: 20,
                  }}
                >
                  {`${calculation?.totalMacros?.[macroKey] ?? 0} g`}
                </AppText>
              </View>
            ))}
          </View>
        </View>
      )}
    </PageContainer>
  );
}

const getStyles = (theme: AppTheme) => {
  const text = textStyles(theme);
  return StyleSheet.create({
    ...formStyles(theme),
    banner: {
      backgroundColor: theme.status.warning.bg,
      borderColor: theme.status.warning.border,
      borderWidth: 2,
      borderRadius: 20,
      padding: 16,
      marginTop: 100,
    },
    bannerLabel: {
      ...text.sectionTitle,
      color: theme.status.warning.text,
    },
  });
};
