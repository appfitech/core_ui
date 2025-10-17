import { AllowedPath, ROUTES } from './routes';

export const PROFILE_LIST_ITEMS: {
  icon?: string;
  label: string;
  route: AllowedPath;
  userOnly?: boolean;
  premiumOnly?: boolean;
}[] = [
  {
    icon: 'user',
    route: ROUTES.personalInfo,
    label: 'Información Personal',
  },
  {
    icon: 'image',
    route: ROUTES.imageGallery,
    label: 'Galería de fotos',
  },
  {
    icon: 'list',
    route: ROUTES.goals,
    label: 'Objetivos Fitness',
    userOnly: true,
  },
  {
    icon: 'heart',
    route: ROUTES.matchPreferences,
    label: 'Preferencias de match',
    userOnly: true,
    premiumOnly: true,
  },
  {
    icon: 'dollar-sign',
    route: ROUTES.subscription,
    label: 'Mi Suscripción',
    userOnly: true,
    premiumOnly: true,
  },
  {
    icon: 'github',
    route: ROUTES.testTools,
    label: 'Testing tools',
  },
];
