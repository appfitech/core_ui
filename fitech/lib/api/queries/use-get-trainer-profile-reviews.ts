import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/lib/api/query-keys';
import {
  ReviewResponseDtoReadable,
  TrainerRatingBreakdownDto,
  TrainerRatingStatsDto,
} from '@/types/api/types.gen';

import { api } from '../api';
import { useSessionQueryEnabled } from './use-session-query-enabled';

function isValidTrainerId(trainerId: number): boolean {
  return Number.isFinite(trainerId) && trainerId > 0;
}

export const useGetTrainerProfileReviewsStats = (trainerId: number) => {
  const enabled = useSessionQueryEnabled(isValidTrainerId(trainerId));

  return useQuery<TrainerRatingStatsDto>({
    queryKey: queryKeys.trainers.reviews.byTrainer.stats(trainerId),
    queryFn: async () => api.get(`/trainer/reviews/${trainerId}/stats`),
    enabled,
  });
};

export const useGetTrainerProfileReviewsBreakdown = (trainerId: number) => {
  const enabled = useSessionQueryEnabled(isValidTrainerId(trainerId));

  return useQuery<TrainerRatingBreakdownDto>({
    queryKey: queryKeys.trainers.reviews.byTrainer.breakdown(trainerId),
    queryFn: async () => api.get(`/trainer/reviews/${trainerId}/breakdown`),
    enabled,
  });
};

export const useGetTrainerProfileReviews = (trainerId: number) => {
  const enabled = useSessionQueryEnabled(isValidTrainerId(trainerId));

  return useQuery<ReviewResponseDtoReadable[]>({
    queryKey: queryKeys.trainers.reviews.byTrainer.list(trainerId),
    queryFn: async () => api.get(`/trainer/reviews/${trainerId}`),
    enabled,
  });
};
