import { Option } from '@/types/forms';

import { AllowedPath, ROUTES } from './routes';

export type MenuItem = {
  icon?: string;
  label: string;
  route?: AllowedPath;
  userOnly?: boolean;
  premiumOnly?: boolean;
  destructive?: boolean;
  type?: 'logout';
};

export const PROFILE_MENU_SECTIONS: {
  title: string;
  items: MenuItem[];
}[] = [
  {
    title: 'Perfil',
    items: [
      {
        label: 'Información personal',
        icon: 'person-outline',
        route: ROUTES.personalInfo,
      },
      {
        icon: 'images-outline',
        route: ROUTES.imageGallery,
        label: 'Galería de fotos',
      },
      {
        icon: 'lock-closed-outline',
        route: ROUTES.changePassword,
        label: 'Cambiar contraseña',
      },
    ],
  },
  {
    title: 'Fitness y preferencias',
    items: [
      {
        icon: 'list-outline',
        route: ROUTES.goals,
        label: 'Objetivos fitness',
        userOnly: true,
      },
      {
        icon: 'heart-outline',
        route: ROUTES.matchPreferences,
        label: 'Preferencias de match',
        userOnly: true,
        premiumOnly: true,
      },
    ],
  },
  {
    title: 'Cuenta',
    items: [
      {
        icon: 'cash-outline',
        route: ROUTES.subscription,
        label: 'Suscripción',
        userOnly: true,
        premiumOnly: true,
      },
      {
        icon: 'notifications-outline',
        route: ROUTES.notifications,
        label: 'Notificaciones',
        userOnly: true,
      },
    ],
  },
  {
    title: 'Ayuda',
    items: [
      { icon: 'help-circle-outline', route: ROUTES.support, label: 'Soporte' },
      //TODO: Add FAQ and Privacy Policy items later
      { icon: 'logo-github', route: ROUTES.testTools, label: 'Testing tools' },
    ],
  },
  {
    title: '',
    items: [
      {
        label: 'Eliminar cuenta',
        icon: 'trash',
        route: ROUTES.deleteAccount,
        destructive: true,
      },
      {
        label: 'Logout',
        icon: 'log-out-outline',
        type: 'logout',
        destructive: true,
      },
    ],
  },
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
