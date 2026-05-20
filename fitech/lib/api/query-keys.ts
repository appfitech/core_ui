/**
 * React Query keys — use for `queryKey` and targeted `invalidateQueries`.
 * Prefer `queryKeys.*` over string literals in new code.
 */
export const queryKeys = {
  profile: {
    root: ['profile'] as const,
    photos: (userId: number | null | undefined) =>
      ['/file-upload/user', userId] as const,
  },
  locations: {
    all: ['get-locations'] as const,
  },
  fitnessGoals: {
    types: ['get-all-fitness-goals'] as const,
  },
  matchPreferences: {
    all: ['/match-preferences'] as const,
  },
  gymbro: {
    candidates: ['get-gymbro-candidates'] as const,
    mutuals: ['get-gymbro-mutuals'] as const,
  },
  gymcrush: {
    candidates: ['get-gymcrush-candidates'] as const,
    mutuals: ['get-gymcrush-mutuals'] as const,
  },
  contracts: {
    active: ['get-active-contracts'] as const,
    inactive: ['get-inactive-contracts'] as const,
  },
  routines: {
    user: ['get-user-routines'] as const,
  },
  diets: {
    user: ['get-user-diets'] as const,
  },
  clientResources: {
    grouped: ['client-resources-grouped'] as const,
  },
  workouts: {
    root: ['workouts'] as const,
    user: ['get-user-workouts'] as const,
    byDate: (date: string) =>
      [`/workouts/exercises/user/date/${date}`] as const,
    sets: (workoutId: number) =>
      [`/workouts/exercises/${workoutId}/sets`] as const,
  },
  notifications: {
    all: ['get-user-notifications'] as const,
  },
  chats: {
    all: ['/chats'] as const,
    detail: (id: number | string) => [`/chats/${id}`] as const,
    messages: (id: number | string) => [`/chats/${id}/messages`] as const,
  },
  trainers: {
    detail: (id: number | string) => ['get-trainer', id] as const,
    services: (trainerId: number | string) =>
      ['get-trainer-services', trainerId] as const,
    photos: (trainerId: number | string) =>
      ['get-trainer-photos', trainerId] as const,
    payments: {
      list: ['get-trainer-payments'] as const,
      summary: ['get-trainer-payments-summary'] as const,
    },
    clients: {
      stats: ['get-trainer-reviews-stats'] as const,
      list: ['trainer-clients-list'] as const,
    },
    servicesList: ['get-trainer-services-list'] as const,
    servicesTypes: ['get-trainer-services-types'] as const,
    reviews: {
      stats: ['get-trainer-reviews-stats'] as const,
      breakdown: ['get-trainer-reviews-breakdown'] as const,
      list: ['get-trainer-reviews'] as const,
    },
  },
  reviews: {
    client: ['get-reviews'] as const,
  },
  subscription: {
    user: ['/memberships/user-subscription'] as const,
    payments: ['/memberships/payment-history'] as const,
  },
  macros: {
    categories: ['food-categories'] as const,
    search: (categoryId: number | 'all', q: string) =>
      ['search-foods', categoryId, q] as const,
  },
} as const;
