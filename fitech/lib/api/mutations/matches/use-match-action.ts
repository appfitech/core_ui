import { useMutation } from '@tanstack/react-query';

import { MatchActionDto, MatchActionResponseDto } from '@/types/api/types.gen';

import { api } from '../../api';

export const useDiscardGymBro = () => {
  return useMutation<MatchActionResponseDto, Error, number>({
    mutationFn: async (targetUserId: number) => {
      return api.post(`/matches/gymbro/action`, {
        targetUserId,
        matchSystem: 'GYMBRO',
        actionType: 'PASS',
      } satisfies MatchActionDto);
    },
  });
};

export const useMatchGymBro = () => {
  return useMutation<MatchActionResponseDto, Error, number>({
    mutationFn: async (targetUserId: number) => {
      return api.post(`/matches/gymbro/action`, {
        targetUserId,
        matchSystem: 'GYMBRO',
        actionType: 'LIKE',
      } satisfies MatchActionDto);
    },
  });
};

export const useDiscardGymCrush = () => {
  return useMutation<MatchActionResponseDto, Error, number>({
    mutationFn: async (targetUserId: number) => {
      return api.post(`/matches/gymcrush/action`, {
        targetUserId,
        matchSystem: 'GYMCRUSH',
        actionType: 'PASS',
      } satisfies MatchActionDto);
    },
  });
};

export const useMatchGymCrush = () => {
  return useMutation<MatchActionResponseDto, Error, number>({
    mutationFn: async (targetUserId: number) => {
      return api.post(`/matches/gymcrush/action`, {
        targetUserId,
        matchSystem: 'GYMCRUSH',
        actionType: 'LIKE',
      } satisfies MatchActionDto);
    },
  });
};
