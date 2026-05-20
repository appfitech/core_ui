import type { ImageSourcePropType } from 'react-native';

/** Portrait backgrounds for home promo carousel cards. */
export const ACTIVITY_BACKGROUNDS = {
  diet: require('@/assets/images/backgrounds/diet_bg.jpg'),
  routine: require('@/assets/images/backgrounds/routine_bg.jpg'),
} as const satisfies Record<'diet' | 'routine', ImageSourcePropType>;

/** Landscape backgrounds for diet list cards — rotated by item so lists feel varied. */
export const DIET_LIST_LANDSCAPE_BACKGROUNDS = [
  require('@/assets/images/backgrounds/diets_landscape_bg_1.jpg'),
  require('@/assets/images/backgrounds/diets_landscape_bg_2.jpg'),
  require('@/assets/images/backgrounds/diets_landscape_bg_3.jpg'),
  require('@/assets/images/backgrounds/diets_landscape_bg_4.jpg'),
  require('@/assets/images/backgrounds/diets_landscape_bg_5.jpg'),
] as const satisfies readonly ImageSourcePropType[];

/** Landscape backgrounds for routine list cards — rotated by item so lists feel varied. */
export const ROUTINE_LIST_LANDSCAPE_BACKGROUNDS = [
  require('@/assets/images/backgrounds/routines_landscape_bg_1.jpg'),
  require('@/assets/images/backgrounds/routines_landscape_bg_2.jpg'),
  require('@/assets/images/backgrounds/routines_landscape_bg_3.jpg'),
  require('@/assets/images/backgrounds/routines_landscape_bg_4.jpg'),
  require('@/assets/images/backgrounds/routines_landscape_bg_5.jpg'),
] as const satisfies readonly ImageSourcePropType[];

function pickListLandscapeBackground(
  backgrounds: readonly ImageSourcePropType[],
  seed: number,
): ImageSourcePropType {
  const index = Math.abs(Math.trunc(seed)) % backgrounds.length;
  return backgrounds[index]!;
}

export function getDietListLandscapeBackground(
  seed: number,
): ImageSourcePropType {
  return pickListLandscapeBackground(DIET_LIST_LANDSCAPE_BACKGROUNDS, seed);
}

export function getRoutineListLandscapeBackground(
  seed: number,
): ImageSourcePropType {
  return pickListLandscapeBackground(ROUTINE_LIST_LANDSCAPE_BACKGROUNDS, seed);
}
