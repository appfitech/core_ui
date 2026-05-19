import { useMutation, useQueryClient } from '@tanstack/react-query';

import { invalidateMatchQueries } from '@/lib/api/mutation-cache';
import { MatchActionDto, MatchActionResponseDto } from '@/types/api/types.gen';

import { api } from '../../api';

export const useDiscardGymBro = () => {
  const queryClient = useQueryClient();

  return useMutation<MatchActionResponseDto, Error, number>({
    mutationFn: async (targetUserId: number) => {
      return api.post(`/matches/gymbro/action`, {
        targetUserId,
        matchSystem: 'GYMBRO',
        actionType: 'PASS',
      } satisfies MatchActionDto);
    },
    onSuccess: async () => {
      await invalidateMatchQueries(queryClient);
    },
  });
};

export const useMatchGymBro = () => {
  const queryClient = useQueryClient();

  return useMutation<MatchActionResponseDto, Error, number>({
    mutationFn: async (targetUserId: number) => {
      return api.post(`/matches/gymbro/action`, {
        targetUserId,
        matchSystem: 'GYMBRO',
        actionType: 'LIKE',
      } satisfies MatchActionDto);
    },
    onSuccess: async () => {
      await invalidateMatchQueries(queryClient);
    },
  });
};

export const useDiscardGymCrush = () => {
  const queryClient = useQueryClient();

  return useMutation<MatchActionResponseDto, Error, number>({
    mutationFn: async (targetUserId: number) => {
      return api.post(`/matches/gymcrush/action`, {
        targetUserId,
        matchSystem: 'GYMCRUSH',
        actionType: 'PASS',
      } satisfies MatchActionDto);
    },
    onSuccess: async () => {
      await invalidateMatchQueries(queryClient);
    },
  });
};

export const useMatchGymCrush = () => {
  const queryClient = useQueryClient();

  return useMutation<MatchActionResponseDto, Error, number>({
    mutationFn: async (targetUserId: number) => {
      return api.post(`/matches/gymcrush/action`, {
        targetUserId,
        matchSystem: 'GYMCRUSH',
        actionType: 'LIKE',
      } satisfies MatchActionDto);
    },
    onSuccess: async () => {
      await invalidateMatchQueries(queryClient);
    },
  });
};
