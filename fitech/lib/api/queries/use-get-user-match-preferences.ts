import { useQuery } from '@tanstack/react-query';

import { MatchPreferencesDto } from '@/types/api/types.gen';

import { api } from '../api';

export const useGetUserMatchPreferences = () => {
  return useQuery<any, Error, MatchPreferencesDto>({
    queryKey: ['/match-preferences'],
    queryFn: async () => {
      return api.get(`/match-preferences`);
    },
  });
};
