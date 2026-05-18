import { useMutation } from '@tanstack/react-query';

import {
  MacroCalculationRequestDto,
  MacroCalculationResponseDto,
} from '@/types/api/types.gen';

import { api } from '../api';

export const useCalculateMacros = () => {
  return useMutation<
    MacroCalculationResponseDto,
    Error,
    MacroCalculationRequestDto
  >({
    mutationFn: async (request) => {
      return api.post('/nutrition/foods/calculate-macros', request);
    },
  });
};
