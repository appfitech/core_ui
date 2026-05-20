import { FoodItemDto } from '@/types/api/types.gen';

/** Gram weight of one porción (serving). */
export function getGramsPerServing(food: FoodItemDto): number {
  const servingSize = food.servingSize ?? 0;
  const unitsPerServing = food.unitsPerServing ?? 1;
  if (servingSize <= 0) return 0;
  return servingSize * unitsPerServing;
}

export function getTotalGramsFromPortions(
  food: FoodItemDto,
  portions: number,
): number {
  if (!Number.isFinite(portions) || portions <= 0) return 0;
  return getGramsPerServing(food) * portions;
}

export function formatGrams(grams: number): string {
  if (grams <= 0) return '—';
  const rounded = Math.round(grams * 10) / 10;
  const value = rounded % 1 === 0 ? Math.round(rounded) : rounded;
  return `${value} g`;
}
