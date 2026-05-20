import type { Href } from 'expo-router';

export const ROUTES = {
  login: '/login',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
  verifyEmail: '/verify-email',
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
  trainerDiets: '/trainer-diets',
  trainerRoutines: '/trainer-routines',
  trainerServices: '/trainer-services',
  trainerPayments: '/trainer-payments',
  exercises: '/exercises',
  gymbro: '/gymbro',
  gymcrush: '/gymcrush',
  personalInfo: '/personal-info',
  imageGallery: '/image-gallery',
  goals: '/goals',
  matchPreferences: '/match-preferences',
  testTools: '/test-tools',
  notifications: '/notifications',
  chats: '/chats',
  changePassword: '/change-password',
  deleteAccount: '/delete-account',
} as const;

type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];

export type AllowedPath = Extract<RoutePath, Href>;
