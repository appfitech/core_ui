import { TRANSLATIONS } from '@/constants/strings';

const { foodUnitTypes: labels } = TRANSLATIONS;

const UNIT_TYPE_LABELS: Record<string, string> = {
  GRAMS: labels.grams,
  UNIT: labels.unit,
  SCOOP: labels.scoop,
  CUP: labels.cup,
  TABLESPOON: labels.tablespoon,
  TEASPOON: labels.teaspoon,
  PIECE: labels.piece,
  ML: labels.ml,
};

export function getFoodUnitTypeLabel(
  unitType?: string | null,
  unitName?: string | null,
): string {
  if (unitType) {
    const normalized = unitType.trim().toUpperCase();
    return UNIT_TYPE_LABELS[normalized] ?? unitName ?? unitType;
  }

  if (unitName?.trim()) {
    return unitName.trim();
  }

  return labels.grams;
}
