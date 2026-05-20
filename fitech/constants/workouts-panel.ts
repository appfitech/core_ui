import type { ImageSourcePropType } from 'react-native';

import { AllowedPath, ROUTES } from '@/constants/routes';
import { TRANSLATIONS } from '@/constants/strings';

const PRODUCT_IMAGES = {
  diets: require('@/assets/images/products/diets.jpg'),
  routines: require('@/assets/images/products/routines.jpg'),
  contracts: require('@/assets/images/products/contracts.jpg'),
  payments: require('@/assets/images/products/payments.jpg'),
  reviews: require('@/assets/images/products/reviews.jpg'),
} as const satisfies Record<string, ImageSourcePropType>;

export type ClientWorkoutsPanelId = 'diets' | 'routines' | 'contracts';

export type TrainerWorkoutsPanelId =
  | 'trainerDiets'
  | 'trainerRoutines'
  | 'trainerServices'
  | 'trainerPayments'
  | 'trainerReviews';

export type WorkoutsPanelItemConfig = {
  id: ClientWorkoutsPanelId | TrainerWorkoutsPanelId;
  image: ImageSourcePropType;
  route: AllowedPath;
};

export const CLIENT_WORKOUTS_PANEL_ITEMS: WorkoutsPanelItemConfig[] = [
  {
    id: 'diets',
    image: PRODUCT_IMAGES.diets,
    route: ROUTES.diets,
  },
  {
    id: 'routines',
    image: PRODUCT_IMAGES.routines,
    route: ROUTES.routines,
  },
  {
    id: 'contracts',
    image: PRODUCT_IMAGES.contracts,
    route: ROUTES.contracts,
  },
];

export const TRAINER_WORKOUTS_PANEL_ITEMS: WorkoutsPanelItemConfig[] = [
  {
    id: 'trainerDiets',
    image: PRODUCT_IMAGES.diets,
    route: ROUTES.trainerDiets,
  },
  {
    id: 'trainerRoutines',
    image: PRODUCT_IMAGES.routines,
    route: ROUTES.trainerRoutines,
  },
  {
    id: 'trainerServices',
    image: PRODUCT_IMAGES.contracts,
    route: ROUTES.trainerServices,
  },
  {
    id: 'trainerPayments',
    image: PRODUCT_IMAGES.payments,
    route: ROUTES.trainerPayments,
  },
  {
    id: 'trainerReviews',
    image: PRODUCT_IMAGES.reviews,
    route: ROUTES.trainerReviews,
  },
];

export function getWorkoutsPanelItems(
  isTrainer: boolean,
): WorkoutsPanelItemConfig[] {
  return isTrainer ? TRAINER_WORKOUTS_PANEL_ITEMS : CLIENT_WORKOUTS_PANEL_ITEMS;
}

export type WorkoutsPanelRow = WorkoutsPanelItemConfig & {
  title: string;
  description: string;
};

export function getWorkoutsPanelRows(isTrainer: boolean): WorkoutsPanelRow[] {
  if (isTrainer) {
    const { items } = TRANSLATIONS.workoutsScreen.trainer;
    return TRAINER_WORKOUTS_PANEL_ITEMS.map((item) => ({
      ...item,
      ...items[item.id as TrainerWorkoutsPanelId],
    }));
  }

  const { items } = TRANSLATIONS.workoutsScreen.client;
  return CLIENT_WORKOUTS_PANEL_ITEMS.map((item) => ({
    ...item,
    ...items[item.id as ClientWorkoutsPanelId],
  }));
}
