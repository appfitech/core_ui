import { useMutation, useQueryClient } from '@tanstack/react-query';

import { invalidateWorkoutQueries } from '@/lib/api/mutation-cache';
import {
  CreateExerciseWithSetsRequest,
  WorkoutSessionDto,
} from '@/types/api/types.gen';

import { api } from '../../api';

export const useDeleteWorkout = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, number>({
    mutationFn: async (workoutId: number) => {
      return api.delete(`/workouts/exercises/${workoutId}`);
    },
    onSuccess: async () => {
      await invalidateWorkoutQueries(queryClient);
    },
  });
};

export const useEditWorkout = () => {
  const queryClient = useQueryClient();

  return useMutation<WorkoutSessionDto, Error, CreateExerciseWithSetsRequest>({
    mutationFn: async (request: CreateExerciseWithSetsRequest) => {
      return api.put(
        `/workouts/exercises/${request?.workoutSessionId}/with-sets`,
        request,
      );
    },
    onSuccess: async () => {
      await invalidateWorkoutQueries(queryClient);
    },
  });
};

export const useCreateWorkout = () => {
  const queryClient = useQueryClient();

  return useMutation<WorkoutSessionDto, Error, CreateExerciseWithSetsRequest>({
    mutationFn: async (request: CreateExerciseWithSetsRequest) => {
      return api.post(`/workouts/exercises/with-sets`, request);
    },
    onSuccess: async () => {
      await invalidateWorkoutQueries(queryClient);
    },
  });
};
