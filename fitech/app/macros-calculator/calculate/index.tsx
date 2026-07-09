import React, { useCallback, useMemo } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { MacroPortionListItem } from '@/components/macros/MacroPortionListItem';
import { MacroResultsSummary } from '@/components/macros/MacroResultsSummary';
import PageContainer from '@/components/PageContainer';
import { TRANSLATIONS } from '@/constants/strings';
import { textStyles } from '@/constants/styles';
import { useMacroFoodItemsContext } from '@/contexts/MacroFoodItemsContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useCalculateMacros } from '@/lib/api/mutations/use-calculate-macros';
import { MacroCalculationResponseDto } from '@/types/api/types.gen';
import { AppTheme } from '@/types/theme';
import { getFooterScrollPaddingBottom } from '@/utils/layout';

function normalizeCalculationResult(
  result: unknown,
): MacroCalculationResponseDto {
  if (
    result &&
    typeof result === 'object' &&
    'data' in result &&
    (result as { data: unknown }).data
  ) {
    return (result as { data: MacroCalculationResponseDto }).data;
  }
  return result as MacroCalculationResponseDto;
}

const EXTRA_RESULTS_BOTTOM_PADDING = 24;

export default function MacrosCalculatorCalculateScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => getStyles(theme), [theme]);
  const { macrosCalculatorScreen: copy } = TRANSLATIONS;

  const contentPaddingBottom =
    getFooterScrollPaddingBottom(insets) + EXTRA_RESULTS_BOTTOM_PADDING;

  const {
    selectedItems,
    foodItemRequest,
    calculation,
    setCalculation,
    onFoodSelection,
    onRequestChange,
    getPortionInput,
  } = useMacroFoodItemsContext();

  const { mutate: calculateMacros, isPending } = useCalculateMacros();

  const handleCalculateMacros = useCallback(() => {
    calculateMacros(
      { selectedFoods: foodItemRequest },
      {
        onSuccess: (response) => {
          setCalculation(normalizeCalculationResult(response));
        },
      },
    );
  }, [calculateMacros, foodItemRequest, setCalculation]);

  const footer = (
    <Button
      label={copy.showResultsButton}
      onPress={handleCalculateMacros}
      disabled={!selectedItems.length || isPending}
      loading={isPending}
      animated={false}
      style={styles.footerButton}
    />
  );

  return (
    <PageContainer
      title={copy.calculateTitle}
      subheader={copy.calculateSubheader}
      style={styles.page}
      includeTabBarPadding={false}
      hasBottomPadding={false}
      footer={selectedItems.length > 0 ? footer : undefined}
    >
      {!selectedItems.length ? (
        <View style={styles.banner}>
          <AppText style={styles.bannerLabel}>{copy.noSelectionBanner}</AppText>
        </View>
      ) : (
        <View style={[styles.content, { paddingBottom: contentPaddingBottom }]}>
          <AppText style={styles.sectionLabel}>{copy.portionsSection}</AppText>

          <View style={styles.portionsList}>
            {selectedItems.map((selectedItem, index) =>
              selectedItem.id != null ? (
                <MacroPortionListItem
                  key={selectedItem.id}
                  foodItem={selectedItem}
                  portionValue={getPortionInput(selectedItem.id)}
                  onRemove={onFoodSelection}
                  onQuantityChange={onRequestChange}
                  isLast={index === selectedItems.length - 1}
                />
              ) : null,
            )}
          </View>

          {isPending ? (
            <View style={styles.loadingWrap}>
              <ActivityIndicator size="large" color={theme.brand.primary} />
            </View>
          ) : null}

          {calculation && !isPending ? (
            <MacroResultsSummary calculation={calculation} />
          ) : null}
        </View>
      )}
    </PageContainer>
  );
}

const getStyles = (theme: AppTheme) => {
  const text = textStyles(theme);

  return StyleSheet.create({
    page: {
      paddingHorizontal: 16,
      paddingBottom: 0,
    },
    content: {
      rowGap: 10,
    },
    sectionLabel: {
      ...text.smallSemibold,
      color: theme.text.secondary,
      marginBottom: 2,
    },
    portionsList: {
      rowGap: 0,
    },
    banner: {
      backgroundColor: theme.status.warning.bg,
      borderColor: theme.status.warning.border,
      borderWidth: 1,
      borderRadius: 14,
      padding: 16,
    },
    bannerLabel: {
      ...text.small,
      color: theme.status.warning.text,
      lineHeight: 20,
    },
    loadingWrap: {
      paddingVertical: 24,
      alignItems: 'center',
    },
    footerButton: {
      width: '100%',
    },
  });
};
