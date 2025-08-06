import { Feather } from '@expo/vector-icons';
import React, { useCallback } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import PageContainer from '@/app/components/PageContainer';
import { HEADING_STYLES, SHARED_STYLES } from '@/constants/shared_styles';
import { useMacroFoodItemsContext } from '@/contexts/MacroFoodItemsContext';
import { useTheme } from '@/contexts/ThemeContext';
import { FullTheme } from '@/types/theme';

import { useCalculateMacros } from '../../api/mutations/use-calculate-macros';
import { AppText } from '../../components/AppText';
import MacroInput from './MacroInput';

export default function MacrosCalculatorCalculateScreen() {
  const { theme } = useTheme();
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
  }, [foodItemRequest]);

  return (
    <PageContainer style={{ padding: 16, paddingBottom: 200 }}>
      <AppText style={styles.title}>{'¿Cuánto comiste?'}</AppText>
      <AppText style={styles.subtitle}>
        {'Ajusta las porciones para obtener tu desglose de macros.'}
      </AppText>

      <View
        style={{
          gap: 10,
          marginTop: 30,
        }}
      >
        {!selectedItems.length && (
          <View style={styles.banner}>
            <AppText style={styles.bannerLabel}>
              <Feather name="alert-circle" size={20} />
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
              backgroundColor: theme.primary,
              borderRadius: 12,
              columnGap: 10,
              marginTop: 30,
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
              {'Mostrar resultados'}
            </AppText>
            <Feather name="play" size={20} color={theme.background} />
          </TouchableOpacity>
        </View>
      )}
      {!!selectedItems.length && !!calculation && (
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

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    ...HEADING_STYLES(theme),
    ...SHARED_STYLES(theme),
    banner: {
      backgroundColor: theme.warningBackground,
      borderColor: theme.warningBorder,
      borderWidth: 2,
      borderRadius: 20,
      padding: 16,
      marginTop: 100,
    },
    bannerLabel: {
      fontSize: 18,
      color: theme.warningText,
    },
  });
