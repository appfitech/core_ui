import type { ImageSourcePropType } from 'react-native';

import { AllowedPath, ROUTES } from '@/constants/routes';

export type PremiumFeatureId = 'workoutLog' | 'library' | 'gymBro' | 'gymCrush';

export type PremiumFeaturePreferenceFlag = 'showInGymBro' | 'showInGymCrush';

export type PremiumFeatureConfig = {
  id: PremiumFeatureId;
  image: ImageSourcePropType;
  route?: AllowedPath;
  preferenceFlag?: PremiumFeaturePreferenceFlag;
};

export const PREMIUM_FEATURES: PremiumFeatureConfig[] = [
  {
    id: 'workoutLog',
    image: require('@/assets/images/products/exercises.jpg'),
    route: ROUTES.exercises,
  },
  {
    id: 'library',
    image: require('@/assets/images/products/library.jpg'),
  },
  {
    id: 'gymBro',
    image: require('@/assets/images/products/gymbro.jpg'),
    route: ROUTES.gymbro,
    preferenceFlag: 'showInGymBro',
  },
  {
    id: 'gymCrush',
    image: require('@/assets/images/products/gymcrush.jpg'),
    route: ROUTES.gymcrush,
    preferenceFlag: 'showInGymCrush',
  },
];

type MatchPreferencesVisibility = {
  showInGymBro?: boolean;
  showInGymCrush?: boolean;
};

export function getVisiblePremiumFeatures(
  preferences?: MatchPreferencesVisibility | null,
): PremiumFeatureConfig[] {
  return PREMIUM_FEATURES.filter((feature) => {
    if (feature.preferenceFlag === 'showInGymBro') {
      return !!preferences?.showInGymBro;
    }
    if (feature.preferenceFlag === 'showInGymCrush') {
      return !!preferences?.showInGymCrush;
    }
    return true;
  });
}
