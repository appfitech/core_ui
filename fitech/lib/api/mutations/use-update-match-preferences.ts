import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/lib/api/query-keys';
import {
  CreateMatchPreferencesRequest,
  MatchPreferencesDto,
} from '@/types/api/types.gen';

import { api } from '../api';

export const useUpdateMatchPreferences = () => {
  const queryClient = useQueryClient();

  return useMutation<MatchPreferencesDto, Error, CreateMatchPreferencesRequest>(
    {
      mutationFn: async (
        request: CreateMatchPreferencesRequest,
      ): Promise<MatchPreferencesDto> =>
        api.post('/match-preferences', request),
      onSuccess: async () => {
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: queryKeys.matchPreferences.all,
          }),
          queryClient.invalidateQueries({ queryKey: queryKeys.gymbro.candidates }),
          queryClient.invalidateQueries({ queryKey: queryKeys.gymcrush.candidates }),
        ]);
      },
    },
  );
};
