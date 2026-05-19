import type { QueryClient } from '@tanstack/react-query';

import { useUserStore } from '@/stores/user';
import type {
  LoginResponseDtoReadable,
  UserResponseDtoReadable,
} from '@/types/api/types.gen';
import type { LoginResponse } from '@/types/user';

import { queryKeys } from './query-keys';

type MutationUserPayload =
  | LoginResponse
  | LoginResponseDtoReadable
  | UserResponseDtoReadable
  | { user?: UserResponseDtoReadable | null }
  | null
  | undefined;

function extractUser(
  data: MutationUserPayload,
): UserResponseDtoReadable | null {
  if (data == null) return null;
  if ('user' in data && data.user) {
    return data.user as UserResponseDtoReadable;
  }
  if ('person' in data && 'id' in data) {
    return data as UserResponseDtoReadable;
  }
  return null;
}

/** Persist latest user from a profile/auth mutation into Zustand + SecureStore. */
export async function syncUserFromMutation(
  data: MutationUserPayload,
): Promise<void> {
  const user = extractUser(data);
  if (!user) return;
  await useUserStore.getState().updateUserInfo(user);
}

export async function invalidateProfileQueries(
  queryClient: QueryClient,
): Promise<void> {
  const userId = useUserStore.getState().getUserId();
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: queryKeys.profile.root }),
    queryClient.invalidateQueries({
      queryKey: queryKeys.profile.photos(userId),
    }),
    queryClient.invalidateQueries({ queryKey: queryKeys.fitnessGoals.types }),
    queryClient.invalidateQueries({ queryKey: queryKeys.matchPreferences.all }),
  ]);
}

export async function invalidateContractQueries(
  queryClient: QueryClient,
): Promise<void> {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: queryKeys.contracts.active }),
    queryClient.invalidateQueries({ queryKey: queryKeys.contracts.inactive }),
    queryClient.invalidateQueries({ queryKey: queryKeys.routines.user }),
    queryClient.invalidateQueries({ queryKey: queryKeys.diets.user }),
    queryClient.invalidateQueries({
      queryKey: queryKeys.trainers.clients.list,
    }),
  ]);
}

export async function invalidateWorkoutQueries(
  queryClient: QueryClient,
): Promise<void> {
  await queryClient.invalidateQueries({
    predicate: (query) =>
      String(query.queryKey[0] ?? '').startsWith('/workouts'),
  });
}

/** Drop cached server data (e.g. on logout or before a new session). */
export function clearAppQueryCache(queryClient: QueryClient): void {
  queryClient.clear();
}

export async function invalidateClientResourceQueries(
  queryClient: QueryClient,
): Promise<void> {
  await Promise.all([
    queryClient.invalidateQueries({
      queryKey: queryKeys.clientResources.grouped,
    }),
    queryClient.invalidateQueries({ queryKey: queryKeys.routines.user }),
    queryClient.invalidateQueries({ queryKey: queryKeys.diets.user }),
    queryClient.invalidateQueries({
      queryKey: queryKeys.trainers.clients.list,
    }),
  ]);
}

export async function invalidateMatchQueries(
  queryClient: QueryClient,
): Promise<void> {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: queryKeys.gymbro.candidates }),
    queryClient.invalidateQueries({ queryKey: queryKeys.gymbro.mutuals }),
    queryClient.invalidateQueries({ queryKey: queryKeys.gymcrush.candidates }),
    queryClient.invalidateQueries({ queryKey: queryKeys.gymcrush.mutuals }),
    queryClient.invalidateQueries({ queryKey: queryKeys.chats.all }),
  ]);
}

export async function invalidateNotificationQueries(
  queryClient: QueryClient,
): Promise<void> {
  await queryClient.invalidateQueries({
    queryKey: queryKeys.notifications.all,
  });
}

export async function invalidateReviewQueries(
  queryClient: QueryClient,
): Promise<void> {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: queryKeys.reviews.client }),
    queryClient.invalidateQueries({
      queryKey: queryKeys.trainers.reviews.stats,
    }),
    queryClient.invalidateQueries({
      queryKey: queryKeys.trainers.reviews.breakdown,
    }),
    queryClient.invalidateQueries({
      queryKey: queryKeys.trainers.reviews.list,
    }),
  ]);
}

export async function invalidateTrainerServiceQueries(
  queryClient: QueryClient,
): Promise<void> {
  await Promise.all([
    queryClient.invalidateQueries({
      queryKey: queryKeys.trainers.servicesList,
    }),
    queryClient.invalidateQueries({
      queryKey: queryKeys.trainers.servicesTypes,
    }),
  ]);
}
