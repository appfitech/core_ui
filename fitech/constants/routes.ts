import type { Href } from 'expo-router';

export const ROUTES = {
  login: '/login',
  register: '/register',
  onboarding: '/onboarding',
  home: '/home',
  workouts: '/workouts',
  trainers: '/trainers',
  profile: '/profile',
  support: '/support',
  subscription: '/subscription',
  premiumFeatures: '/premium-features',
  macrosCalculator: '/macros-calculator',
  diets: '/diets',
  routines: '/routines',
  contracts: '/contracts',
  trainerReviews: '/trainer-reviews',
  trainerClients: '/trainer-clients',
  trainerPayments: '/trainer-payments',
  gymbro: '/gymbro',
  gymcrush: '/gymcrush',
  personalInfo: '/personal-info',
  imageGallery: '/image-gallery',
  goals: '/goals',
  matchPreferences: '/match-preferences',
  testTools: '/test-tools',
} as const;

type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];

export type AllowedPath = Extract<RoutePath, Href>;
