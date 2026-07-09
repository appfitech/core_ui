import { useQuery } from '@tanstack/react-query';

import { TrainerPhoto } from '@/types/trainer';
import { isImageUploadFile } from '@/utils/files';

import { api } from '../api';

export const useGetTrainerPhotos = (trainerId: number) => {
  return useQuery<TrainerPhoto[]>({
    queryKey: ['get-trainer-photos', trainerId],
    queryFn: async () => {
      const photos = (await api.get(`/profile/${trainerId}/photos`)) as
        | TrainerPhoto[]
        | null
        | undefined;
      return (photos ?? []).filter(isImageUploadFile);
    },
  });
};
