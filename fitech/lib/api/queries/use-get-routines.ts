import { useQuery } from '@tanstack/react-query';

import { ClientResourceResponseDtoReadable } from '@/types/api/types.gen';

import { api } from '../api';
import { useSessionQueryEnabled } from './use-session-query-enabled';

export const useGetRoutines = () => {
  const enabled = useSessionQueryEnabled();

  return useQuery<ClientResourceResponseDtoReadable[]>({
    queryKey: ['get-user-routines'],
    queryFn: async () => {
      return api.get(`/client-resources/client/routines`);
    },
    enabled,
  });
};
