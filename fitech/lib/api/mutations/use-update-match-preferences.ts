import { useMutation } from '@tanstack/react-query';

import {
  CreateMatchPreferencesRequest,
  MatchPreferencesDto,
} from '@/types/api/types.gen';

import { api } from '../api';

export const useUpdateMatchPreferences = () => {
  return useMutation<MatchPreferencesDto, Error, CreateMatchPreferencesRequest>(
    {
      mutationFn: async (
        request: CreateMatchPreferencesRequest,
      ): Promise<MatchPreferencesDto> =>
        api.post('/match-preferences', request),
    },
  );
};
