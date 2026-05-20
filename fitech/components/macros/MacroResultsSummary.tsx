import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { textStyles } from '@/constants/styles';
import { useTheme } from '@/contexts/ThemeContext';
import {
  FoodCalculationDetailDto,
  MacroCalculationResponseDto,
  MacroNutrientsDto,
} from '@/types/api/types.gen';
import { AppTheme } from '@/types/theme';

type Props = {
  calculation: MacroCalculationResponseDto;
};

type MacroBarConfig = {
  key: keyof Pick<MacroNutrientsDto, 'carbohydrates' | 'fats' | 'proteins'>;
  label: string;
  color: string;
  trackColor: string;
  apiPctKey: 'carbohydratePercentage' | 'fatPercentage' | 'proteinPercentage';
};

const MACRO_BARS: MacroBarConfig[] = [
  {
    key: 'carbohydrates',
    label: 'Carbohidratos',
    color: '#FF6B9D',
    trackColor: 'rgba(255, 107, 157, 0.2)',
    apiPctKey: 'carbohydratePercentage',
  },
  {
    key: 'fats',
    label: 'Grasas',
    color: '#F5B84B',
    trackColor: 'rgba(245, 184, 75, 0.2)',
    apiPctKey: 'fatPercentage',
  },
  {
    key: 'proteins',
    label: 'Proteínas',
    color: '#4DA3FF',
    trackColor: 'rgba(77, 163, 255, 0.2)',
    apiPctKey: 'proteinPercentage',
  },
];

function resolvePercent(
  grams: number,
  apiPct: number | undefined,
  fallbackTotal: number,
): number {
  if (apiPct != null && Number.isFinite(apiPct)) {
    return Math.min(100, Math.max(0, apiPct));
  }
  if (fallbackTotal <= 0) return 0;
  return Math.min(100, Math.round((grams / fallbackTotal) * 100));
}

function MacroProgressBar({
  label,
  grams,
  percent,
  color,
  trackColor,
  styles,
}: {
  label: string;
  grams: number;
  percent: number;
  color: string;
  trackColor: string;
  styles: ReturnType<typeof getStyles>;
}) {
  return (
    <View style={styles.barBlock}>
      <View style={styles.barHeader}>
        <AppText style={styles.barLabel}>{label}</AppText>
        <AppText style={styles.barMeta}>
          {`${Math.round(grams)} g · ${Math.round(percent)}%`}
        </AppText>
      </View>
      <View style={[styles.barTrack, { backgroundColor: trackColor }]}>
        <View
          style={[
            styles.barFill,
            { width: `${percent}%`, backgroundColor: color },
          ]}
        />
      </View>
    </View>
  );
}

export function MacroResultsSummary({ calculation }: Props) {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const totals = calculation.totalMacros;
  const percentages = calculation.percentages;

  const macroMassTotal = useMemo(() => {
    const p = totals?.proteins ?? 0;
    const c = totals?.carbohydrates ?? 0;
    const f = totals?.fats ?? 0;
    return p + c + f;
  }, [totals?.carbohydrates, totals?.fats, totals?.proteins]);

  return (
    <View style={styles.wrap}>
      <AppText style={styles.sectionTitle}>Resumen nutricional</AppText>

      <View style={styles.hero}>
        <AppText style={styles.heroValue}>{totals?.calories ?? 0}</AppText>
        <AppText style={styles.heroUnit}>kcal totales</AppText>
      </View>

      <View style={styles.barsCard}>
        <AppText style={styles.barsTitle}>Distribución de macros</AppText>
        {MACRO_BARS.map((bar) => {
          const grams = totals?.[bar.key] ?? 0;
          const apiPct = percentages?.[bar.apiPctKey];
          const percent = resolvePercent(grams, apiPct, macroMassTotal);

          return (
            <MacroProgressBar
              key={bar.key}
              label={bar.label}
              grams={grams}
              percent={percent}
              color={bar.color}
              trackColor={bar.trackColor}
              styles={styles}
            />
          );
        })}
      </View>

      {(calculation.foodDetails?.length ?? 0) > 0 ? (
        <View style={styles.breakdown}>
          <AppText style={styles.breakdownTitle}>Por alimento</AppText>
          {calculation.foodDetails?.map((detail, index) => (
            <FoodDetailRow
              key={`${detail.foodId}-${index}`}
              detail={detail}
              styles={styles}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}

function FoodDetailRow({
  detail,
  styles,
}: {
  detail: FoodCalculationDetailDto;
  styles: ReturnType<typeof getStyles>;
}) {
  return (
    <View style={styles.detailCard}>
      <View style={styles.detailHeader}>
        <AppText style={styles.detailName} numberOfLines={1}>
          {detail.foodName}
        </AppText>
        <AppText style={styles.detailQty}>
          {detail.quantity != null ? `× ${detail.quantity}` : ''}
        </AppText>
      </View>
      <AppText style={styles.detailKcal}>
        {`${detail.macros?.calories ?? 0} kcal`}
      </AppText>
      <View style={styles.detailMacros}>
        <AppText style={styles.detailMacroText}>
          {`G ${detail.macros?.fats ?? 0}`}
        </AppText>
        <AppText style={styles.detailMacroText}>
          {`C ${detail.macros?.carbohydrates ?? 0}`}
        </AppText>
        <AppText style={styles.detailMacroText}>
          {`P ${detail.macros?.proteins ?? 0}`}
        </AppText>
      </View>
    </View>
  );
}

const getStyles = (theme: AppTheme) => {
  const text = textStyles(theme);

  return StyleSheet.create({
    wrap: {
      rowGap: 16,
      marginTop: 8,
    },
    sectionTitle: {
      ...text.sectionTitle,
      color: theme.text.primary,
    },
    hero: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.status.success.bg,
      borderRadius: 20,
      paddingVertical: 28,
      borderWidth: 1,
      borderColor: theme.status.success.border,
    },
    heroValue: {
      ...text.display,
      color: theme.status.success.text,
    },
    heroUnit: {
      ...text.bodyMedium,
      color: theme.status.success.text,
      marginTop: 4,
    },
    barsCard: {
      backgroundColor: theme.background.card,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: theme.border.default,
      padding: 14,
      rowGap: 14,
    },
    barsTitle: {
      ...text.smallSemibold,
      color: theme.text.secondary,
    },
    barBlock: {
      rowGap: 8,
    },
    barHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      columnGap: 8,
    },
    barLabel: {
      ...text.smallMedium,
      color: theme.text.primary,
    },
    barMeta: {
      ...text.caption,
      color: theme.text.tertiary,
    },
    barTrack: {
      height: 10,
      borderRadius: 999,
      overflow: 'hidden',
    },
    barFill: {
      height: '100%',
      borderRadius: 999,
      minWidth: 4,
    },
    breakdown: {
      rowGap: 10,
    },
    breakdownTitle: {
      ...text.smallSemibold,
      color: theme.text.secondary,
    },
    detailCard: {
      backgroundColor: theme.background.card,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border.default,
      padding: 12,
      rowGap: 6,
    },
    detailHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      columnGap: 8,
    },
    detailName: {
      ...text.linkSemibold,
      color: theme.text.primary,
      flex: 1,
    },
    detailQty: {
      ...text.caption,
      color: theme.text.tertiary,
    },
    detailKcal: {
      ...text.captionSemibold,
      color: theme.brand.primary,
    },
    detailMacros: {
      flexDirection: 'row',
      columnGap: 12,
    },
    detailMacroText: {
      ...text.caption,
      color: theme.text.secondary,
    },
  });
};
