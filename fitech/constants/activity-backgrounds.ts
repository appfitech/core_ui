import type { ImageSourcePropType } from 'react-native';

/** Portrait backgrounds for home promo carousel cards. */
export const ACTIVITY_BACKGROUNDS = {
  diet: require('@/assets/images/backgrounds/diet_bg.jpg'),
  routine: require('@/assets/images/backgrounds/routine_bg.jpg'),
} as const satisfies Record<'diet' | 'routine', ImageSourcePropType>;

/** Landscape backgrounds for diets / routines list cards (text on the left). */
export const RESOURCE_LIST_BACKGROUNDS = {
  diet: require('@/assets/images/backgrounds/diets_landscape_bg.jpg'),
  routine: require('@/assets/images/backgrounds/routines_landscape_bg.jpg'),
} as const satisfies Record<'diet' | 'routine', ImageSourcePropType>;
