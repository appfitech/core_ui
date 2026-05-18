import { useQuery } from '@tanstack/react-query';

import type {
  ClientResourceGroupDtoReadable,
  PageClientResourceGroupDtoReadable,
} from '@/types/api/types.gen';

import { api } from '../api';

export type ClientResourcesGroupedParams = {
  resourceType: 'DIETA' | 'RUTINA';
  page?: number;
  size?: number;
};

export function useClientResourcesGrouped(
  params: ClientResourcesGroupedParams,
) {
  const { resourceType, page = 0, size = 10 } = params;

  return useQuery<PageClientResourceGroupDtoReadable>({
    queryKey: ['client-resources-grouped', resourceType, page, size],
    queryFn: async () => {
      const q = new URLSearchParams({
        resourceType,
        page: String(page),
        size: String(size),
      });
      return api.get(`/client-resources/grouped-by-client/all?${q.toString()}`);
    },
  });
}

export type { ClientResourceGroupDtoReadable };
