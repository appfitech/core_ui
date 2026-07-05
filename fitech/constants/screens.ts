import { Option } from '@/types/forms';

import { AllowedPath, ROUTES } from './routes';
import { TRANSLATIONS } from './strings';

export type MenuItem = {
  icon?: string;
  label: string;
  route?: AllowedPath;
  userOnly?: boolean;
  premiumOnly?: boolean;
  destructive?: boolean;
  type?: 'logout';
};

const { profileMenu } = TRANSLATIONS;

export const PROFILE_MENU_SECTIONS: {
  title: string;
  items: MenuItem[];
}[] = [
  {
    title: profileMenu.sections.profile,
    items: [
      {
        label: profileMenu.items.personalInfo,
        icon: 'person-outline',
        route: ROUTES.personalInfo,
      },
      {
        icon: 'images-outline',
        route: ROUTES.imageGallery,
        label: profileMenu.items.photoGallery,
      },
      {
        icon: 'lock-closed-outline',
        route: ROUTES.changePassword,
        label: profileMenu.items.changePassword,
      },
    ],
  },
  {
    title: profileMenu.sections.fitness,
    items: [
      {
        icon: 'list-outline',
        route: ROUTES.goals,
        label: profileMenu.items.fitnessGoals,
        userOnly: true,
      },
      {
        icon: 'heart-outline',
        route: ROUTES.matchPreferences,
        label: profileMenu.items.matchPreferences,
        userOnly: true,
        premiumOnly: true,
      },
    ],
  },
  {
    title: profileMenu.sections.account,
    items: [
      {
        icon: 'cash-outline',
        route: ROUTES.subscription,
        label: profileMenu.items.subscription,
        userOnly: true,
        premiumOnly: true,
      },
      {
        icon: 'notifications-outline',
        route: ROUTES.notifications,
        label: profileMenu.items.notifications,
        userOnly: true,
      },
    ],
  },
  {
    title: profileMenu.sections.help,
    items: [
      {
        icon: 'help-circle-outline',
        route: ROUTES.support,
        label: profileMenu.items.support,
      },
      //TODO: Add FAQ and Privacy Policy items later
      {
        icon: 'logo-github',
        route: ROUTES.testTools,
        label: profileMenu.items.testTools,
      },
    ],
  },
  {
    title: '',
    items: [
      {
        label: profileMenu.items.deleteAccount,
        icon: 'trash',
        route: ROUTES.deleteAccount,
        destructive: true,
      },
      {
        label: profileMenu.items.logout,
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
    label: 'Solicitudes',
    value: 'requests',
  },
  {
    label: 'Matches',
    value: 'matches',
  },
];
