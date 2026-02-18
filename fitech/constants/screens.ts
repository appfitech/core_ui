import { Option } from '@/types/forms';

import { AllowedPath, ROUTES } from './routes';

export const PROFILE_LIST_ITEMS: {
  icon?: string;
  label: string;
  route: AllowedPath;
  userOnly?: boolean;
  premiumOnly?: boolean;
}[] = [
  {
    icon: 'person-outline',
    route: ROUTES.personalInfo,
    label: 'Información Personal',
  },
  {
    icon: 'contrast-outline',
    route: ROUTES.appearance,
    label: 'Apariencia',
  },
  {
    icon: 'images-outline',
    route: ROUTES.imageGallery,
    label: 'Galería de fotos',
  },
  {
    icon: 'list-outline',
    route: ROUTES.goals,
    label: 'Objetivos Fitness',
    userOnly: true,
  },
  {
    icon: 'heart-outline',
    route: ROUTES.matchPreferences,
    label: 'Preferencias de match',
    userOnly: true,
    premiumOnly: true,
  },
  {
    icon: 'cash-outline',
    route: ROUTES.subscription,
    label: 'Mi Suscripción',
    userOnly: true,
    premiumOnly: true,
  },
  {
    icon: 'notifications-outline',
    route: ROUTES.notifications,
    label: 'Notificaciones',
    userOnly: true,
  },
  { icon: 'help-circle-outline', route: ROUTES.support, label: 'Soporte' },
  { icon: 'logo-github', route: ROUTES.testTools, label: 'Testing tools' },
];

export const MATCH_SCREEN_TABS: Option[] = [
  {
    label: 'Descubre',
    value: 'discover',
  },
  {
    label: 'Matches',
    value: 'matches',
  },
];
