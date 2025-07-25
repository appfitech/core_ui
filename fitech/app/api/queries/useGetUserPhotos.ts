import { useQuery } from '@tanstack/react-query';

import { useUserStore } from '@/stores/user';
import { Photo } from '@/types/photos';

import { api } from '../api';

export const useGetUserPhotos = () => {
  const userId = useUserStore((s) => s?.user?.user?.id);

  return useQuery<Photo[]>({
    enabled: !!userId,
    queryKey: ['/file-upload/user', userId],
    queryFn: async () => {
      return api.get(`/profile/${userId}/photos`);
    },
  });
};
