import { useMutation } from '@tanstack/react-query';

import {
  CreateExerciseWithSetsRequest,
  WorkoutSessionDto,
} from '@/types/api/types.gen';

import { api } from '../../api';

export const useDeleteWorkout = () => {
  return useMutation<unknown, Error, number>({
    mutationFn: async (workoutId: number) => {
      return api.delete(`/workouts/exercises/${workoutId}`);
    },
  });
};

export const useEditWorkout = () => {
  return useMutation<WorkoutSessionDto, Error, CreateExerciseWithSetsRequest>({
    mutationFn: async (request: CreateExerciseWithSetsRequest) => {
      return api.put(
        `/workouts/exercises/${request?.workoutSessionId}/with-sets`,
        request,
      );
    },
  });
};

export const useCreateWorkout = () => {
  return useMutation<WorkoutSessionDto, Error, CreateExerciseWithSetsRequest>({
    mutationFn: async (request: CreateExerciseWithSetsRequest) => {
      console.log('[K] request', request);
      return api.post(`/workouts/exercises/with-sets`, request);
    },
  });
};
