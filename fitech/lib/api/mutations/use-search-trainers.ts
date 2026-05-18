import { useMutation } from '@tanstack/react-query';

import {
  PublicTrainerDtoReadable,
  TrainerSearchDto,
} from '@/types/api/types.gen';

import { api } from '../api';

export const useSearchTrainers = () => {
  return useMutation<PublicTrainerDtoReadable[], Error, TrainerSearchDto>({
    mutationFn: async (request): Promise<PublicTrainerDtoReadable[]> => {
      return await api.post('/trainers/search', request);
    },
  });
};
