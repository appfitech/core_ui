import { useQuery } from '@tanstack/react-query';

import { useUserStore } from '@/stores/user';

import { api } from '../api';

export type TrainerClientItem = {
  clientId: number;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  profilePhotoId?: number | null;
  fitnessGoals?: string[];
  totalServicesCount?: number;
  activeServicesCount?: number;
  totalAmountPaid?: number;
  [key: string]: unknown;
};

type PageResponse = {
  content?: TrainerClientItem[];
  totalElements?: number;
  totalPages?: number;
  number?: number;
  size?: number;
  empty?: boolean;
};

export type UseTrainerGetClientsListParams = {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
};

export function useTrainerGetClientsList(
  params: UseTrainerGetClientsListParams = {},
) {
  const userId = useUserStore((s) => s?.user?.user?.id);
  const {
    page = 0,
    size = 100,
    sortBy = 'clientName',
    sortDir = 'asc',
  } = params;

  return useQuery<PageResponse>({
    queryKey: ['trainer-clients-list', userId, page, size, sortBy, sortDir],
    queryFn: async () => {
      const q = new URLSearchParams({
        page: String(page),
        size: String(size),
        sortBy,
        sortDir,
      });
      return api.get(`/trainers/${userId}/clients?${q.toString()}`);
    },
    enabled: !!userId,
  });
}
